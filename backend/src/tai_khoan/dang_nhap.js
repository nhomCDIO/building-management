const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

// =====================================================
// 1. ĐĂNG NHẬP
// =====================================================
router.post('/login', async (req, res) => {
    try {
        const { ten, mk } = req.body;

        if (!ten || !mk) {
            return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
        }

        const [rows] = await db.query(
            `SELECT 
                id,
                ten_dang_nhap,
                mat_khau,
                vai_tro,
                so_phong,
                ho_ten,
                so_dien_thoai,
                da_khai_bao,
                ngay_tao
             FROM nguoi_dung
             WHERE ten_dang_nhap = ?
             LIMIT 1`,
            [ten]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
        }

        const user = rows[0];

        if (user.mat_khau !== mk) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác!' });
        }

        return res.status(200).json({
            message: 'Đăng nhập thành công!',
            user: {
                id: user.id,
                ten_dang_nhap: user.ten_dang_nhap,
                vai_tro: user.vai_tro,
                so_phong: user.so_phong,
                ho_ten: user.ho_ten,
                so_dien_thoai: user.so_dien_thoai,
                da_khai_bao: user.da_khai_bao || 0,
                ngay_tao: user.ngay_tao
            }
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return res.status(500).json({ message: 'Lỗi server khi đăng nhập!' });
    }
});

// =====================================================
// 2. ĐĂNG KÝ
// =====================================================
router.post('/register', async (req, res) => {
    try {
        const { ten, mk, role, maNoiBo } = req.body;

        if (!ten || !mk || !role) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
        }

        if (role === 'QuanLy' && maNoiBo !== '123456') {
            return res.status(400).json({ message: 'Mã nội bộ không chính xác!' });
        }

        const [checkRows] = await db.query(
            `SELECT id FROM nguoi_dung WHERE ten_dang_nhap = ? LIMIT 1`,
            [ten]
        );

        if (checkRows.length > 0) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại!' });
        }

        await db.query(
            `INSERT INTO nguoi_dung 
                (ten_dang_nhap, mat_khau, vai_tro, so_phong, ho_ten, so_dien_thoai, da_khai_bao)
             VALUES (?, ?, ?, NULL, NULL, NULL, 0)`,
            [ten, mk, role]
        );

        return res.status(200).json({ message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        return res.status(500).json({ message: 'Lỗi server khi đăng ký!' });
    }
});

// =====================================================
// 3. LẤY DANH SÁCH PHÒNG TRỐNG
// =====================================================
router.get('/phong-trong', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.ma_phong, p.tang
            FROM phong p
            WHERE p.ma_phong NOT IN (
                SELECT so_phong
                FROM nguoi_dung
                WHERE vai_tro = 'CuDan'
                  AND so_phong IS NOT NULL
                  AND so_phong <> ''
            )
            ORDER BY CAST(p.ma_phong AS UNSIGNED)
        `);

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy phòng trống:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách phòng trống!' });
    }
});

// =====================================================
// 4. CẬP NHẬT THÔNG TIN CÁ NHÂN CƯ DÂN
// =====================================================
router.post('/cap-nhat-thong-tin', async (req, res) => {
    try {
        const idNguoiDung = req.body.id_nguoi_dung || req.body.id;
        const { so_phong, ho_ten, so_dien_thoai } = req.body;

        if (!idNguoiDung || !so_phong || !ho_ten || !so_dien_thoai) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
        }

        const [userRows] = await db.query(
            `SELECT id, vai_tro, so_phong
             FROM nguoi_dung
             WHERE id = ?
             LIMIT 1`,
            [idNguoiDung]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        const user = userRows[0];

        if (user.vai_tro !== 'CuDan') {
            return res.status(403).json({ message: 'Chỉ cư dân mới được cập nhật thông tin này!' });
        }

        const [checkPhongRows] = await db.query(
            `SELECT id
             FROM nguoi_dung
             WHERE vai_tro = 'CuDan'
               AND so_phong = ?
               AND id <> ?`,
            [so_phong, idNguoiDung]
        );

        if (checkPhongRows.length > 0) {
            return res.status(400).json({ message: 'Phòng này đã được tài khoản khác khai báo!' });
        }

        await db.query(
            `UPDATE nguoi_dung
             SET so_phong = ?, ho_ten = ?, so_dien_thoai = ?, da_khai_bao = 1
             WHERE id = ?`,
            [so_phong, ho_ten, so_dien_thoai, idNguoiDung]
        );

        const [updatedRows] = await db.query(
            `SELECT 
                id,
                ten_dang_nhap,
                vai_tro,
                so_phong,
                ho_ten,
                so_dien_thoai,
                da_khai_bao,
                ngay_tao
             FROM nguoi_dung
             WHERE id = ?
             LIMIT 1`,
            [idNguoiDung]
        );

        return res.status(200).json({
            message: 'Cập nhật thông tin thành công!',
            user: updatedRows[0]
        });
    } catch (error) {
        console.error('Lỗi cập nhật thông tin:', error);
        return res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin!' });
    }
});

// =====================================================
// 5. LẤY THÔNG TIN TÀI KHOẢN THEO ID
// =====================================================
router.get('/thong-tin/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT 
                id,
                ten_dang_nhap,
                vai_tro,
                so_phong,
                ho_ten,
                so_dien_thoai,
                da_khai_bao,
                ngay_tao
             FROM nguoi_dung
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Lỗi lấy thông tin tài khoản:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy thông tin tài khoản!' });
    }
});

module.exports = router;