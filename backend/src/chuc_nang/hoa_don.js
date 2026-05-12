const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

function laThangTrongQuaKhu(thang, nam) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (nam < currentYear) return true;
    if (nam === currentYear && thang < currentMonth) return true;
    return false;
}

function kiemTraThangNam(thang, nam) {
    const t = Number(thang);
    const n = Number(nam);

    if (!t || !n || t < 1 || t > 12 || n < 2000 || n > 3000) {
        return null;
    }

    return { thang: t, nam: n };
}

// =====================================================
// 1. DANH SÁCH TRẠNG THÁI HÓA ĐƠN TOÀN BỘ PHÒNG
// =====================================================
router.get('/danh-sach', async (req, res) => {
    try {
        const params = kiemTraThangNam(req.query.thang, req.query.nam);
        if (!params) {
            return res.status(400).json({ message: 'Tháng hoặc năm không hợp lệ!' });
        }

        const { thang, nam } = params;

        const [rows] = await db.query(`
            SELECT 
                p.ma_phong,
                h.id,
                h.trang_thai,
                h.so_tien,
                h.tien_dien,
                h.tien_nuoc,
                h.phu_phi,
                h.han_thanh_toan,
                h.noi_dung,
                h.thoi_gian_thanh_toan
            FROM phong p
            LEFT JOIN hoa_don h
                ON p.ma_phong = h.ma_phong
                AND h.thang = ?
                AND h.nam = ?
            ORDER BY CAST(p.ma_phong AS UNSIGNED)
        `, [thang, nam]);

        const data = rows.map(item => {
            if (item.id) {
                return {
                    ma_phong: item.ma_phong,
                    trang_thai: item.trang_thai,
                    so_tien: item.so_tien,
                    tien_dien: item.tien_dien || 0,
                    tien_nuoc: item.tien_nuoc || 0,
                    phu_phi: item.phu_phi || 0,
                    han_thanh_toan: item.han_thanh_toan,
                    noi_dung: item.noi_dung,
                    thoi_gian_thanh_toan: item.thoi_gian_thanh_toan,
                    la_mac_dinh: false
                };
            }

            if (laThangTrongQuaKhu(thang, nam)) {
                return {
                    ma_phong: item.ma_phong,
                    trang_thai: 'DaThanhToan',
                    so_tien: 0,
                    tien_dien: 0,
                    tien_nuoc: 0,
                    phu_phi: 0,
                    han_thanh_toan: null,
                    noi_dung: 'Hệ thống mặc định các tháng trước là đã thanh toán.',
                    thoi_gian_thanh_toan: null,
                    la_mac_dinh: true
                };
            }

            return {
                ma_phong: item.ma_phong,
                trang_thai: 'ChuaThanhToan',
                so_tien: 0,
                tien_dien: 0,
                tien_nuoc: 0,
                phu_phi: 0,
                han_thanh_toan: null,
                noi_dung: null,
                thoi_gian_thanh_toan: null,
                la_mac_dinh: false
            };
        });

        return res.status(200).json(data);
    } catch (error) {
        console.error('Lỗi lấy danh sách hóa đơn:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách hóa đơn!' });
    }
});

// =====================================================
// 2. CHI TIẾT HÓA ĐƠN THEO PHÒNG
// =====================================================
router.get('/chi-tiet/:ma_phong', async (req, res) => {
    try {
        const { ma_phong } = req.params;
        const params = kiemTraThangNam(req.query.thang, req.query.nam);

        if (!params) {
            return res.status(400).json({ message: 'Tháng hoặc năm không hợp lệ!' });
        }

        const { thang, nam } = params;

        const [phongRows] = await db.query(
            `SELECT ma_phong FROM phong WHERE ma_phong = ?`,
            [ma_phong]
        );

        if (phongRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phòng!' });
        }

        const [rows] = await db.query(
            `SELECT id, ma_phong, thang, nam, trang_thai, so_tien, tien_dien, tien_nuoc, phu_phi, han_thanh_toan, noi_dung, thoi_gian_thanh_toan
             FROM hoa_don
             WHERE ma_phong = ? AND thang = ? AND nam = ?
             LIMIT 1`,
            [ma_phong, thang, nam]
        );

        if (rows.length > 0) {
            return res.status(200).json({
                ...rows[0],
                la_mac_dinh: false
            });
        }

        if (laThangTrongQuaKhu(thang, nam)) {
            return res.status(200).json({
                ma_phong,
                thang,
                nam,
                trang_thai: 'DaThanhToan',
                so_tien: 0,
                tien_dien: 0,
                tien_nuoc: 0,
                phu_phi: 0,
                han_thanh_toan: null,
                noi_dung: 'Hệ thống mặc định các tháng trước là đã thanh toán.',
                thoi_gian_thanh_toan: null,
                la_mac_dinh: true
            });
        }

        return res.status(200).json({
            ma_phong,
            thang,
            nam,
            trang_thai: 'ChuaThanhToan',
            so_tien: 0,
            tien_dien: 0,
            tien_nuoc: 0,
            phu_phi: 0,
            han_thanh_toan: null,
            noi_dung: null,
            thoi_gian_thanh_toan: null,
            la_mac_dinh: false
        });
    } catch (error) {
        console.error('Lỗi lấy chi tiết hóa đơn:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy chi tiết hóa đơn!' });
    }
});

// =====================================================
// 3. CƯ DÂN THANH TOÁN HÓA ĐƠN
// =====================================================
router.post('/thanh-toan', async (req, res) => {
    try {
        const { ma_phong, thang, nam, so_tien, noi_dung } = req.body;

        const params = kiemTraThangNam(thang, nam);
        if (!params) {
            return res.status(400).json({ message: 'Tháng hoặc năm không hợp lệ!' });
        }

        const { thang: t, nam: n } = params;
        const tien = Number(so_tien);

        if (!ma_phong || !tien || tien <= 0 || !noi_dung?.trim()) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ và hợp lệ thông tin thanh toán!' });
        }

        const [phongRows] = await db.query(
            `SELECT ma_phong FROM phong WHERE ma_phong = ?`,
            [ma_phong]
        );

        if (phongRows.length === 0) {
            return res.status(400).json({ message: 'Mã phòng không tồn tại!' });
        }

        await db.query(
            `INSERT INTO hoa_don (ma_phong, thang, nam, trang_thai, so_tien, noi_dung, thoi_gian_thanh_toan)
             VALUES (?, ?, ?, 'DaThanhToan', ?, ?, NOW())
             ON DUPLICATE KEY UPDATE
                trang_thai = 'DaThanhToan',
                so_tien = VALUES(so_tien),
                noi_dung = VALUES(noi_dung),
                thoi_gian_thanh_toan = NOW()`,
            [ma_phong, t, n, tien, noi_dung.trim()]
        );

        const [rows] = await db.query(
            `SELECT id, ma_phong, thang, nam, trang_thai, so_tien, noi_dung, thoi_gian_thanh_toan
             FROM hoa_don
             WHERE ma_phong = ? AND thang = ? AND nam = ?
             LIMIT 1`,
            [ma_phong, t, n]
        );

        return res.status(200).json({
            message: 'Thanh toán thành công!',
            hoa_don: rows[0]
        });
    } catch (error) {
        console.error('Lỗi thanh toán hóa đơn:', error);
        return res.status(500).json({ message: 'Lỗi server khi thanh toán hóa đơn!' });
    }
});

// =====================================================
// 4. ADMIN TẠO/CẬP NHẬT HÓA ĐƠN HÀNG THÁNG
// =====================================================
router.post('/cap-nhat-thong-so', async (req, res) => {
    try {
        const { ma_phong, thang, nam, tien_dien, tien_nuoc, phu_phi, han_thanh_toan, noi_dung } = req.body;

        // Tính tổng tiền tự động
        const tong_tien = Number(tien_dien || 0) + Number(tien_nuoc || 0) + Number(phu_phi || 0);

        await db.query(
            `INSERT INTO hoa_don (ma_phong, thang, nam, trang_thai, so_tien, tien_dien, tien_nuoc, phu_phi, han_thanh_toan, noi_dung)
             VALUES (?, ?, ?, 'ChuaThanhToan', ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                so_tien = VALUES(so_tien),
                tien_dien = VALUES(tien_dien),
                tien_nuoc = VALUES(tien_nuoc),
                phu_phi = VALUES(phu_phi),
                han_thanh_toan = VALUES(han_thanh_toan),
                noi_dung = VALUES(noi_dung)`,
            [ma_phong, thang, nam, tong_tien, tien_dien, tien_nuoc, phu_phi, han_thanh_toan, noi_dung]
        );

        return res.status(200).json({ message: 'Cập nhật chỉ số hóa đơn thành công!' });
    } catch (error) {
        console.error('Lỗi Admin cập nhật hóa đơn:', error);
        return res.status(500).json({ message: 'Lỗi server khi cập nhật hóa đơn!' });
    }
});
module.exports = router;