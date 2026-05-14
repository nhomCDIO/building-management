const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

// 1. LẤY DANH SÁCH THÔNG BÁO (Lọc theo phòng của cư dân hoặc thông báo chung)
router.get('/', async (req, res) => {
    try {
        // Lấy ma_phong từ query parameter (ví dụ: /api/thong-bao?ma_phong=103)
        const { ma_phong } = req.query;

        let query = `
            SELECT 
                tb.id,
                tb.tieu_de,
                tb.noi_dung,
                tb.ngay_gui,
                tb.ma_phong,
                COALESCE(nd.ho_ten, 'Ban Quản Lý') AS ten_hien_thi
            FROM thong_bao tb
            LEFT JOIN nguoi_dung nd ON tb.id_nguoi_gui = nd.id
        `;

        let queryParams = [];

        // NẾU có ma_phong truyền lên: Chỉ lấy thông báo chung (NULL) HOẶC thông báo của đúng phòng đó
        if (ma_phong) {
            query += ` WHERE tb.ma_phong IS NULL OR tb.ma_phong = ? `;
            queryParams.push(ma_phong);
        } 
        // NẾU không có ma_phong (dành cho trang Admin): Lấy tất cả thông báo để quản lý
        
        query += ` ORDER BY tb.ngay_gui DESC `;

        const [rows] = await db.query(query, queryParams);
        return res.status(200).json(rows);

    } catch (error) {
        console.error('Lỗi lấy thông báo:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy thông báo!' });
    }
});

// 2. GỬI THÔNG BÁO
router.post('/gui', async (req, res) => {
    try {
        const { id_nguoi_gui, tieu_de, noi_dung } = req.body;

        if (!id_nguoi_gui || !tieu_de?.trim() || !noi_dung?.trim()) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tiêu đề và nội dung!' });
        }

        // Kiểm tra quyền hạn
        const [userRows] = await db.query(
            `SELECT ho_ten, vai_tro FROM nguoi_dung WHERE id = ?`,
            [id_nguoi_gui]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản gửi!' });
        }

        if (userRows[0].vai_tro !== 'QuanLy') {
            return res.status(403).json({ message: 'Chỉ quản lý mới được gửi thông báo!' });
        }

        // Thêm NOW() để đảm bảo có thời gian gửi
        const [result] = await db.query(
            `INSERT INTO thong_bao (id_nguoi_gui, tieu_de, noi_dung, ngay_gui)
             VALUES (?, ?, ?, NOW())`,
            [id_nguoi_gui, tieu_de.trim(), noi_dung.trim()]
        );

        // Lấy lại dữ liệu vừa chèn để trả về cho Frontend hiển thị ngay
        const [newRows] = await db.query(`
            SELECT 
                tb.id,
                tb.tieu_de,
                tb.noi_dung,
                tb.ngay_gui,
                ? AS ten_hien_thi -- Sử dụng chính tên của người vừa gửi
            FROM thong_bao tb
            WHERE tb.id = ?
        `, [userRows[0].ho_ten, result.insertId]);

        return res.status(200).json({
            message: 'Gửi thông báo thành công!',
            thong_bao: newRows[0]
        });
    } catch (error) {
        console.error('Lỗi gửi thông báo:', error);
        return res.status(500).json({ message: 'Lỗi server khi gửi thông báo!' });
    }
});

module.exports = router;