const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

function kiemTraThangNam(thang, nam) {
    const t = Number(thang);
    const n = Number(nam);

    if (!t || !n || t < 1 || t > 12 || n < 2000 || n > 3000) {
        return null;
    }

    return { thang: t, nam: n };
}

function laThangTrongQuaKhu(thang, nam) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (nam < currentYear) return true;
    if (nam === currentYear && thang < currentMonth) return true;
    return false;
}

// ===============================================
// 1. BÁO CÁO CƯ DÂN
// ===============================================
router.get('/cu-dan', async (req, res) => {
    try {
        const [[tongPhongRow]] = await db.query(`
            SELECT COUNT(*) AS tong_phong
            FROM phong
        `);

        const [[phongCoNguoiRow]] = await db.query(`
            SELECT COUNT(DISTINCT so_phong) AS phong_co_nguoi
            FROM nguoi_dung
            WHERE vai_tro = 'CuDan'
              AND so_phong IS NOT NULL
              AND so_phong <> ''
        `);

        const tong_phong = Number(tongPhongRow.tong_phong || 0);
        const phong_co_nguoi = Number(phongCoNguoiRow.phong_co_nguoi || 0);
        const phong_trong = tong_phong - phong_co_nguoi;

        return res.status(200).json({
            tong_phong,
            phong_co_nguoi,
            phong_trong: phong_trong < 0 ? 0 : phong_trong
        });
    } catch (error) {
        console.error('Lỗi báo cáo cư dân:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy báo cáo cư dân!' });
    }
});

// ===============================================
// 2. BÁO CÁO BẢO TRÌ
// ===============================================
router.get('/bao-tri', async (req, res) => {
    try {
        const params = kiemTraThangNam(req.query.thang, req.query.nam);
        if (!params) {
            return res.status(400).json({ message: 'Tháng hoặc năm không hợp lệ!' });
        }

        const { thang, nam } = params;

        const [[row]] = await db.query(`
            SELECT
                COUNT(*) AS tong_yeu_cau,
                SUM(CASE WHEN trang_thai = 'ChuaThucHien' THEN 1 ELSE 0 END) AS chua_thuc_hien,
                SUM(CASE WHEN trang_thai = 'DangThucHien' THEN 1 ELSE 0 END) AS dang_thuc_hien,
                SUM(CASE WHEN trang_thai = 'DaHoanThanh' THEN 1 ELSE 0 END) AS da_hoan_thanh
            FROM bao_tri
            WHERE MONTH(ngay_gui) = ?
              AND YEAR(ngay_gui) = ?
        `, [thang, nam]);

        return res.status(200).json({
            thang,
            nam,
            tong_yeu_cau: Number(row.tong_yeu_cau || 0),
            chua_thuc_hien: Number(row.chua_thuc_hien || 0),
            dang_thuc_hien: Number(row.dang_thuc_hien || 0),
            da_hoan_thanh: Number(row.da_hoan_thanh || 0)
        });
    } catch (error) {
        console.error('Lỗi báo cáo bảo trì:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy báo cáo bảo trì!' });
    }
});

// ===============================================
// 3. BÁO CÁO TÀI CHÍNH
// ===============================================
router.get('/tai-chinh', async (req, res) => {
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
                h.so_tien
            FROM phong p
            LEFT JOIN hoa_don h
                ON p.ma_phong = h.ma_phong
                AND h.thang = ?
                AND h.nam = ?
            ORDER BY CAST(p.ma_phong AS UNSIGNED)
        `, [thang, nam]);

        let tong_da_thu = 0;
        let so_phong_da_thanh_toan = 0;
        let so_phong_chua_thanh_toan = 0;

        for (const item of rows) {
            if (item.id) {
                if (item.trang_thai === 'DaThanhToan') {
                    tong_da_thu += Number(item.so_tien || 0);
                    so_phong_da_thanh_toan += 1;
                } else {
                    so_phong_chua_thanh_toan += 1;
                }
            } else {
                if (laThangTrongQuaKhu(thang, nam)) {
                    so_phong_da_thanh_toan += 1;
                } else {
                    so_phong_chua_thanh_toan += 1;
                }
            }
        }

        return res.status(200).json({
            thang,
            nam,
            tong_da_thu,
            so_phong_da_thanh_toan,
            so_phong_chua_thanh_toan,
            tong_phong: rows.length
        });
    } catch (error) {
        console.error('Lỗi báo cáo tài chính:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy báo cáo tài chính!' });
    }
});

// ===============================================
// 4. BÁO CÁO PHƯƠNG TIỆN
// ===============================================
router.get('/phuong-tien', async (req, res) => {
    try {
        const [[row]] = await db.query(`
            SELECT
                COUNT(*) AS tong_phuong_tien,
                COUNT(DISTINCT ma_phong) AS so_ho_dang_ky,
                SUM(
                    CASE 
                        WHEN loai_xe IN ('XeMay', 'Xe máy', 'xe máy', 'xe may') THEN 1
                        ELSE 0
                    END
                ) AS tong_xe_may,
                SUM(
                    CASE 
                        WHEN loai_xe IN ('OTo', 'Ô tô', 'oto', 'ô tô', 'Ôtô') THEN 1
                        ELSE 0
                    END
                ) AS tong_o_to
            FROM phuong_tien
        `);

        return res.status(200).json({
            tong_phuong_tien: Number(row.tong_phuong_tien || 0),
            so_ho_dang_ky: Number(row.so_ho_dang_ky || 0),
            tong_xe_may: Number(row.tong_xe_may || 0),
            tong_o_to: Number(row.tong_o_to || 0)
        });
    } catch (error) {
        console.error('Lỗi báo cáo phương tiện:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy báo cáo phương tiện!' });
    }
});

module.exports = router;