const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

// =====================================================
// 1. LẤY DANH SÁCH TOÀN BỘ PHÒNG
// Dùng cho giao diện quản lý cư dân
// =====================================================
router.get('/danh-sach-phong', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.ma_phong,
                p.tang,
                p.trang_thai,
                nd.id AS id_nguoi_dung,
                nd.ten_dang_nhap,
                nd.ho_ten,
                nd.so_dien_thoai,
                nd.da_khai_bao,
                nd.ngay_tao
            FROM phong p
            LEFT JOIN nguoi_dung nd 
                ON p.ma_phong = nd.so_phong
                AND nd.vai_tro = 'CuDan'
            ORDER BY CAST(p.ma_phong AS UNSIGNED)
        `);

        const data = rows.map(item => ({
            ma_phong: item.ma_phong,
            tang: item.tang,
            trang_thai: item.trang_thai,
            co_cu_dan: !!item.id_nguoi_dung,
            ten_dang_nhap: item.ten_dang_nhap || null,
            ho_ten: item.ho_ten || null,
            so_dien_thoai: item.so_dien_thoai || null,
            da_khai_bao: item.da_khai_bao || 0,
            ngay_tao: item.ngay_tao || null
        }));

        return res.status(200).json(data);
    } catch (error) {
        console.error('Lỗi lấy danh sách phòng:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách phòng!' });
    }
});

// =====================================================
// 2. LẤY CHI TIẾT CƯ DÂN THEO PHÒNG
// =====================================================
router.get('/chi-tiet/:ma_phong', async (req, res) => {
    try {
        const { ma_phong } = req.params;

        const [rows] = await db.query(`
            SELECT 
                p.ma_phong,
                p.tang,
                p.trang_thai,
                nd.id AS id_nguoi_dung,
                nd.ten_dang_nhap,
                nd.ho_ten,
                nd.so_dien_thoai,
                nd.da_khai_bao,
                nd.ngay_tao
            FROM phong p
            LEFT JOIN nguoi_dung nd
                ON p.ma_phong = nd.so_phong
                AND nd.vai_tro = 'CuDan'
            WHERE p.ma_phong = ?
            LIMIT 1
        `, [ma_phong]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phòng này!' });
        }

        const item = rows[0];

        if (!item.id_nguoi_dung) {
            return res.status(200).json({
                ma_phong: item.ma_phong,
                tang: item.tang,
                trang_thai: item.trang_thai,
                co_cu_dan: false,
                ten_dang_nhap: null,
                ho_ten: null,
                so_dien_thoai: null,
                da_khai_bao: 0,
                ngay_tao: null,
                message: `Phòng ${item.ma_phong} chưa khai báo`
            });
        }

        return res.status(200).json({
            ma_phong: item.ma_phong,
            tang: item.tang,
            trang_thai: item.trang_thai,
            co_cu_dan: true,
            ten_dang_nhap: item.ten_dang_nhap,
            ho_ten: item.ho_ten,
            so_dien_thoai: item.so_dien_thoai,
            da_khai_bao: item.da_khai_bao || 0,
            ngay_tao: item.ngay_tao || null
        });
    } catch (error) {
        console.error('Lỗi lấy chi tiết cư dân theo phòng:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết cư dân!' });
    }
});

module.exports = router;