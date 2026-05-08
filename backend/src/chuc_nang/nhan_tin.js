const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

// =====================================================
// 1. LẤY CHAT CHUNG
// =====================================================
router.get('/chung', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id, vai_tro_nguoi_gui, ma_phong, ten_hien_thi, noi_dung, thoi_gian_gui
            FROM tin_nhan_chung
            ORDER BY thoi_gian_gui ASC, id ASC
        `);

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy chat chung:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy chat chung!' });
    }
});

// =====================================================
// 2. GỬI CHAT CHUNG
// =====================================================
router.post('/chung/gui', async (req, res) => {
    try {
        const { id_nguoi_gui, noi_dung } = req.body;

        if (!id_nguoi_gui || !noi_dung?.trim()) {
            return res.status(400).json({ message: 'Thiếu thông tin gửi tin nhắn chung!' });
        }

        const [userRows] = await db.query(
            `SELECT id, vai_tro, so_phong
             FROM nguoi_dung
             WHERE id = ?`,
            [id_nguoi_gui]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người gửi!' });
        }

        const user = userRows[0];
        const tenHienThi = user.vai_tro === 'QuanLy' ? 'ad' : user.so_phong;

        await db.query(
            `INSERT INTO tin_nhan_chung (id_nguoi_gui, vai_tro_nguoi_gui, ma_phong, ten_hien_thi, noi_dung)
             VALUES (?, ?, ?, ?, ?)`,
            [
                user.id,
                user.vai_tro,
                user.vai_tro === 'CuDan' ? user.so_phong : null,
                tenHienThi,
                noi_dung.trim()
            ]
        );

        return res.status(200).json({ message: 'Gửi tin nhắn chung thành công!' });
    } catch (error) {
        console.error('Lỗi gửi chat chung:', error);
        return res.status(500).json({ message: 'Lỗi server khi gửi chat chung!' });
    }
});

// =====================================================
// 3. LẤY CHAT RIÊNG THEO PHÒNG
// =====================================================
router.get('/rieng/:ma_phong', async (req, res) => {
    try {
        const { ma_phong } = req.params;

        const [rows] = await db.query(
            `SELECT id, ma_phong, vai_tro_nguoi_gui, ten_hien_thi, noi_dung, thoi_gian_gui
             FROM tin_nhan_rieng
             WHERE ma_phong = ?
             ORDER BY thoi_gian_gui ASC, id ASC`,
            [ma_phong]
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy chat riêng:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy chat riêng!' });
    }
});

// =====================================================
// 4. CƯ DÂN GỬI CHAT RIÊNG CHO ADMIN
// =====================================================
router.post('/rieng/gui-cu-dan', async (req, res) => {
    try {
        const { id_nguoi_gui, noi_dung } = req.body;

        if (!id_nguoi_gui || !noi_dung?.trim()) {
            return res.status(400).json({ message: 'Thiếu thông tin gửi tin nhắn riêng!' });
        }

        const [userRows] = await db.query(
            `SELECT id, vai_tro, so_phong
             FROM nguoi_dung
             WHERE id = ?`,
            [id_nguoi_gui]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người gửi!' });
        }

        const user = userRows[0];

        if (user.vai_tro !== 'CuDan') {
            return res.status(403).json({ message: 'Chỉ cư dân mới dùng API này!' });
        }

        await db.query(
            `INSERT INTO tin_nhan_rieng (ma_phong, id_nguoi_gui, vai_tro_nguoi_gui, ten_hien_thi, noi_dung)
             VALUES (?, ?, 'CuDan', ?, ?)`,
            [user.so_phong, user.id, user.so_phong, noi_dung.trim()]
        );

        return res.status(200).json({ message: 'Gửi tin nhắn riêng thành công!' });
    } catch (error) {
        console.error('Lỗi cư dân gửi chat riêng:', error);
        return res.status(500).json({ message: 'Lỗi server khi gửi chat riêng!' });
    }
});

// =====================================================
// 5. ADMIN GỬI CHAT RIÊNG CHO 1 HOẶC NHIỀU PHÒNG
// =====================================================
router.post('/rieng/gui-admin', async (req, res) => {
    try {
        const { id_nguoi_gui, ma_phongs, noi_dung } = req.body;

        if (!id_nguoi_gui || !Array.isArray(ma_phongs) || ma_phongs.length === 0 || !noi_dung?.trim()) {
            return res.status(400).json({ message: 'Thiếu thông tin gửi tin nhắn admin!' });
        }

        const [adminRows] = await db.query(
            `SELECT id, vai_tro
             FROM nguoi_dung
             WHERE id = ?`,
            [id_nguoi_gui]
        );

        if (adminRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản admin!' });
        }

        const admin = adminRows[0];

        if (admin.vai_tro !== 'QuanLy') {
            return res.status(403).json({ message: 'Chỉ quản lý mới được gửi tin nhắn riêng tới phòng!' });
        }

        const dsPhongSach = [...new Set(ma_phongs.map(String))];

        for (const maPhong of dsPhongSach) {
            await db.query(
                `INSERT INTO tin_nhan_rieng (ma_phong, id_nguoi_gui, vai_tro_nguoi_gui, ten_hien_thi, noi_dung)
                 VALUES (?, ?, 'QuanLy', 'ad', ?)`,
                [maPhong, admin.id, noi_dung.trim()]
            );
        }

        return res.status(200).json({
            message: `Đã gửi tin nhắn tới ${dsPhongSach.length} phòng!`
        });
    } catch (error) {
        console.error('Lỗi admin gửi chat riêng:', error);
        return res.status(500).json({ message: 'Lỗi server khi admin gửi chat riêng!' });
    }
});

module.exports = router;