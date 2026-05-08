const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

// =====================================================
// 1. LẤY DANH SÁCH THÔNG BÁO
// =====================================================
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                tb.id,
                tb.tieu_de,
                tb.noi_dung,
                tb.ngay_gui,
                CASE 
                    WHEN nd.vai_tro = 'QuanLy' THEN 'ad'
                    ELSE COALESCE(nd.so_phong, nd.ten_dang_nhap)
                END AS ten_hien_thi
            FROM thong_bao tb
            LEFT JOIN nguoi_dung nd
                ON tb.id_nguoi_gui = nd.id
            ORDER BY tb.ngay_gui DESC, tb.id DESC
        `);

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy thông báo:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy thông báo!' });
    }
});

// =====================================================
// 2. GỬI THÔNG BÁO
// Chỉ quản lý mới được gửi
// =====================================================
router.post('/gui', async (req, res) => {
    try {
        const { id_nguoi_gui, tieu_de, noi_dung } = req.body;

        if (!id_nguoi_gui || !tieu_de?.trim() || !noi_dung?.trim()) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung!' });
        }

        const [userRows] = await db.query(
            `SELECT id, vai_tro
             FROM nguoi_dung
             WHERE id = ?`,
            [id_nguoi_gui]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản gửi thông báo!' });
        }

        const user = userRows[0];

        if (user.vai_tro !== 'QuanLy') {
            return res.status(403).json({ message: 'Chỉ quản lý mới được gửi thông báo!' });
        }

        const [result] = await db.query(
            `INSERT INTO thong_bao (id_nguoi_gui, tieu_de, noi_dung)
             VALUES (?, ?, ?)`,
            [id_nguoi_gui, tieu_de.trim(), noi_dung.trim()]
        );

        const [rows] = await db.query(`
            SELECT 
                tb.id,
                tb.tieu_de,
                tb.noi_dung,
                tb.ngay_gui,
                'ad' AS ten_hien_thi
            FROM thong_bao tb
            WHERE tb.id = ?
            LIMIT 1
        `, [result.insertId]);

        return res.status(200).json({
            message: 'Gửi thông báo thành công!',
            thong_bao: rows[0]
        });
    } catch (error) {
        console.error('Lỗi gửi thông báo:', error);
        return res.status(500).json({ message: 'Lỗi server khi gửi thông báo!' });
    }
});

module.exports = router;