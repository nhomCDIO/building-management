const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

// 1. Lấy toàn bộ ô đỗ xe
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ma_o, trang_thai, ma_phong_thue, ngay_dang_ky
            FROM o_do_xe
            ORDER BY ma_o
        `);

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy danh sách ô đỗ xe:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy bãi đỗ xe!' });
    }
});

// 2. Lấy chi tiết 1 ô
router.get('/:ma_o', async (req, res) => {
    try {
        const { ma_o } = req.params;

        const [rows] = await db.query(
            `SELECT ma_o, trang_thai, ma_phong_thue, ngay_dang_ky
             FROM o_do_xe
             WHERE ma_o = ?`,
            [ma_o]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy ô đỗ xe!' });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Lỗi lấy chi tiết ô đỗ xe:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết ô đỗ xe!' });
    }
});

// 3. Cư dân đăng ký ô trống
router.post('/dang-ky', async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { ma_o, ma_phong } = req.body;

        if (!ma_o || !ma_phong) {
            connection.release();
            return res.status(400).json({ message: 'Thiếu mã ô hoặc mã phòng!' });
        }

        await connection.beginTransaction();

        const [oRows] = await connection.query(
            `SELECT ma_o, trang_thai, ma_phong_thue
             FROM o_do_xe
             WHERE ma_o = ?
             FOR UPDATE`,
            [ma_o]
        );

        if (oRows.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ message: 'Không tìm thấy ô đỗ xe!' });
        }

        const oDoXe = oRows[0];

        if (oDoXe.trang_thai !== 'Trong') {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: 'Ô đỗ xe này đã có người thuê!' });
        }

        const [daCoO] = await connection.query(
            `SELECT ma_o
             FROM o_do_xe
             WHERE ma_phong_thue = ?
             FOR UPDATE`,
            [ma_phong]
        );

        if (daCoO.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: `Phòng ${ma_phong} đã đăng ký ô ${daCoO[0].ma_o}!` });
        }

        await connection.query(
            `UPDATE o_do_xe
             SET trang_thai = 'DaThue',
                 ma_phong_thue = ?,
                 ngay_dang_ky = NOW()
             WHERE ma_o = ?`,
            [ma_phong, ma_o]
        );

        await connection.commit();
        connection.release();

        return res.status(200).json({
            message: `Đăng ký ô ${ma_o} thành công!`
        });
    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error('Lỗi đăng ký ô đỗ xe:', error);
        return res.status(500).json({ message: 'Lỗi server khi đăng ký bãi đỗ xe!' });
    }
});

// 4. Cư dân hủy ô của chính mình
router.post('/huy', async (req, res) => {
    try {
        const { ma_o, ma_phong } = req.body;

        if (!ma_o || !ma_phong) {
            return res.status(400).json({ message: 'Thiếu mã ô hoặc mã phòng!' });
        }

        const [rows] = await db.query(
            `SELECT ma_o, ma_phong_thue
             FROM o_do_xe
             WHERE ma_o = ?`,
            [ma_o]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy ô đỗ xe!' });
        }

        const oDoXe = rows[0];

        if (oDoXe.ma_phong_thue !== ma_phong) {
            return res.status(403).json({ message: 'Bạn không có quyền hủy ô này!' });
        }

        await db.query(
            `UPDATE o_do_xe
             SET trang_thai = 'Trong',
                 ma_phong_thue = NULL,
                 ngay_dang_ky = NULL
             WHERE ma_o = ?`,
            [ma_o]
        );

        return res.status(200).json({
            message: `Đã hủy đăng ký ô ${ma_o}!`
        });
    } catch (error) {
        console.error('Lỗi hủy đăng ký ô đỗ xe:', error);
        return res.status(500).json({ message: 'Lỗi server khi hủy đăng ký!' });
    }
});

// 5. Admin xóa cư dân khỏi ô
router.post('/admin-xoa', async (req, res) => {
    try {
        const { ma_o } = req.body;

        if (!ma_o) {
            return res.status(400).json({ message: 'Thiếu mã ô đỗ xe!' });
        }

        const [rows] = await db.query(
            `SELECT ma_o
             FROM o_do_xe
             WHERE ma_o = ?`,
            [ma_o]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy ô đỗ xe!' });
        }

        await db.query(
            `UPDATE o_do_xe
             SET trang_thai = 'Trong',
                 ma_phong_thue = NULL,
                 ngay_dang_ky = NULL
             WHERE ma_o = ?`,
            [ma_o]
        );

        return res.status(200).json({
            message: `Đã xóa cư dân khỏi ô ${ma_o}!`
        });
    } catch (error) {
        console.error('Lỗi admin xóa ô đỗ xe:', error);
        return res.status(500).json({ message: 'Lỗi server khi xóa cư dân khỏi ô đỗ xe!' });
    }
});

module.exports = router;