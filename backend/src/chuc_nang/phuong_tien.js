const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

// =====================================================
// 1. LẤY DANH SÁCH PHƯƠNG TIỆN THEO PHÒNG
// Dùng cho cả cư dân và quản lý
// =====================================================
router.get('/phong/:ma_phong', async (req, res) => {
    try {
        const { ma_phong } = req.params;

        const [rows] = await db.query(
            `SELECT id, ma_phong, loai_xe, bien_so, ngay_tao
             FROM phuong_tien
             WHERE ma_phong = ?
             ORDER BY id DESC`,
            [ma_phong]
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy phương tiện theo phòng:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy phương tiện!' });
    }
});

// =====================================================
// 2. THÊM PHƯƠNG TIỆN
// =====================================================
router.post('/them', async (req, res) => {
    try {
        const { ma_phong, loai_xe, bien_so } = req.body;

        if (!ma_phong || !loai_xe || !bien_so) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin phương tiện!' });
        }

        const bienSo = String(bien_so).trim().toUpperCase();

        if (!bienSo) {
            return res.status(400).json({ message: 'Biển số không hợp lệ!' });
        }

        const [phongRows] = await db.query(
            `SELECT ma_phong FROM phong WHERE ma_phong = ?`,
            [ma_phong]
        );

        if (phongRows.length === 0) {
            return res.status(400).json({ message: 'Mã phòng không tồn tại!' });
        }

        const [trungBienSo] = await db.query(
            `SELECT id FROM phuong_tien WHERE bien_so = ?`,
            [bienSo]
        );

        if (trungBienSo.length > 0) {
            return res.status(400).json({ message: 'Biển số này đã được đăng ký!' });
        }

        const [result] = await db.query(
            `INSERT INTO phuong_tien (ma_phong, loai_xe, bien_so)
             VALUES (?, ?, ?)`,
            [ma_phong, loai_xe, bienSo]
        );

        const [newRows] = await db.query(
            `SELECT id, ma_phong, loai_xe, bien_so, ngay_tao
             FROM phuong_tien
             WHERE id = ?`,
            [result.insertId]
        );

        return res.status(200).json({
            message: 'Thêm phương tiện thành công!',
            phuong_tien: newRows[0]
        });
    } catch (error) {
        console.error('Lỗi thêm phương tiện:', error);
        return res.status(500).json({ message: 'Lỗi server khi thêm phương tiện!' });
    }
});

// =====================================================
// 3. XÓA PHƯƠNG TIỆN
// Chỉ xóa đúng xe thuộc phòng của cư dân đang gửi lên
// =====================================================
router.delete('/xoa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { ma_phong } = req.body;

        if (!id || !ma_phong) {
            return res.status(400).json({ message: 'Thiếu thông tin để xóa phương tiện!' });
        }

        const [rows] = await db.query(
            `SELECT id, ma_phong, bien_so
             FROM phuong_tien
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phương tiện!' });
        }

        const xe = rows[0];

        if (xe.ma_phong !== ma_phong) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa phương tiện này!' });
        }

        await db.query(
            `DELETE FROM phuong_tien
             WHERE id = ?`,
            [id]
        );

        return res.status(200).json({
            message: `Đã xóa phương tiện ${xe.bien_so} thành công!`
        });
    } catch (error) {
        console.error('Lỗi xóa phương tiện:', error);
        return res.status(500).json({ message: 'Lỗi server khi xóa phương tiện!' });
    }
});

module.exports = router;