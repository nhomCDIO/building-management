const express = require('express');
const router = express.Router();
const db = require('../cau_hinh/ket_noi_db');

function kiemTraNgayThangNam(ngay, thang, nam) {
    const d = Number(ngay);
    const m = Number(thang);
    const y = Number(nam);

    if (!d || !m || !y) return null;
    if (d < 1 || d > 31) return null;
    if (m < 1 || m > 12) return null;
    if (y < 2000 || y > 3000) return null;

    return { ngay: d, thang: m, nam: y };
}

// =====================================================
// 1. CƯ DÂN GỬI YÊU CẦU BẢO TRÌ (Giữ nguyên)
// =====================================================
router.post('/gui', async (req, res) => {
    try {
        const { ma_phong, tieu_de, mo_ta } = req.body;

        if (!ma_phong || !tieu_de?.trim() || !mo_ta?.trim()) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin yêu cầu bảo trì!' });
        }

        const [phongRows] = await db.query(
            `SELECT ma_phong FROM phong WHERE ma_phong = ?`,
            [ma_phong]
        );

        if (phongRows.length === 0) {
            return res.status(400).json({ message: 'Mã phòng không tồn tại!' });
        }

        const [result] = await db.query(
            `INSERT INTO bao_tri (ma_phong, tieu_de, mo_ta, trang_thai)
             VALUES (?, ?, ?, 'ChuaThucHien')`,
            [ma_phong, tieu_de.trim(), mo_ta.trim()]
        );

        const [rows] = await db.query(
            `SELECT id, ma_phong, tieu_de, mo_ta, trang_thai, ghi_chu_admin, ngay_gui, ngay_cap_nhat
             FROM bao_tri
             WHERE id = ?`,
            [result.insertId]
        );

        return res.status(200).json({
            message: 'Gửi yêu cầu bảo trì thành công!',
            bao_tri: rows[0]
        });
    } catch (error) {
        console.error('Lỗi gửi yêu cầu bảo trì:', error);
        return res.status(500).json({ message: 'Lỗi server khi gửi yêu cầu bảo trì!' });
    }
});

// ... (Các hàm lấy lịch sử giữ nguyên) ...
router.get('/cu-dan/:ma_phong', async (req, res) => {
    try {
        const { ma_phong } = req.params;
        const { ngay, thang, nam } = req.query;

        const params = kiemTraNgayThangNam(ngay, thang, nam);
        if (!params) {
            return res.status(400).json({ message: 'Ngày, tháng, năm không hợp lệ!' });
        }

        const { ngay: d, thang: m, nam: y } = params;

        const [rows] = await db.query(
            `SELECT id, ma_phong, tieu_de, mo_ta, trang_thai, ghi_chu_admin, ngay_gui, ngay_cap_nhat
             FROM bao_tri
             WHERE ma_phong = ?
               AND DAY(ngay_gui) = ?
               AND MONTH(ngay_gui) = ?
               AND YEAR(ngay_gui) = ?
             ORDER BY ngay_gui DESC, id DESC`,
            [ma_phong, d, m, y]
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy lịch sử bảo trì cư dân:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy lịch sử bảo trì!' });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const { ngay, thang, nam } = req.query;

        const params = kiemTraNgayThangNam(ngay, thang, nam);
        if (!params) {
            return res.status(400).json({ message: 'Ngày, tháng, năm không hợp lệ!' });
        }

        const { ngay: d, thang: m, nam: y } = params;

        const [rows] = await db.query(
            `SELECT id, ma_phong, tieu_de, mo_ta, trang_thai, ghi_chu_admin, ngay_gui, ngay_cap_nhat
             FROM bao_tri
             WHERE DAY(ngay_gui) = ?
               AND MONTH(ngay_gui) = ?
               AND YEAR(ngay_gui) = ?
             ORDER BY ngay_gui DESC, id DESC`,
            [d, m, y]
        );

        return res.status(200).json(rows);
    } catch (error) {
        console.error('Lỗi lấy lịch sử bảo trì admin:', error);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách bảo trì!' });
    }
});

// =====================================================
// 4. ADMIN CẬP NHẬT TRẠNG THÁI & TỰ ĐỘNG ĐĂNG THÔNG BÁO
// =====================================================
router.post('/cap-nhat', async (req, res) => {
    try {
        // Nhận id_admin từ Frontend gửi lên
        const { id, trang_thai, ghi_chu_admin, id_admin } = req.body;

        const dsTrangThai = ['ChuaThucHien', 'DangThucHien', 'DaHoanThanh'];
        const tenTrangThai = {
            'ChuaThucHien': 'Chưa thực hiện',
            'DangThucHien': 'Đang thực hiện',
            'DaHoanThanh': 'Đã hoàn thành'
        };

        // Kiểm tra dữ liệu đầu vào
        if (!id || !dsTrangThai.includes(trang_thai)) {
            return res.status(400).json({ message: 'Dữ liệu cập nhật không hợp lệ!' });
        }

        // 1. Lấy thông tin yêu cầu cũ để lấy mã phòng và tiêu đề gốc
        const [rows] = await db.query(
            `SELECT id, tieu_de, ma_phong FROM bao_tri WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy yêu cầu bảo trì!' });
        }
        const yeuCauCu = rows[0];

        // Đoạn này trong bao_tri.js (Backend) phải khớp với cấu trúc bảng thong_bao
        await db.query(
            `INSERT INTO thong_bao (id_nguoi_gui, tieu_de, noi_dung, ngay_gui)
            VALUES (?, ?, ?, NOW())`,
            [id_admin || 1, tieuDeThongBao, noiDungThongBao]
        );

        // 3. TỰ ĐỘNG CHÈN VÀO BẢNG thong_bao
        const tieuDeThongBao = `🛠️ CẬP NHẬT BẢO TRÌ: ${yeuCauCu.ma_phong}`;
        const noiDungThongBao = `Yêu cầu "${yeuCauCu.tieu_de}" đã được cập nhật:\n- Trạng thái: ${tenTrangThai[trang_thai]}\n- Phản hồi: ${ghi_chu_admin || 'Không có ghi chú'}`;

        // Kiểm tra ID người gửi để tránh lỗi khóa ngoại (Foreign Key)
        let idNguoiGui = id_admin;

        // Nếu Frontend không gửi id_admin, tìm ID của quản lý đầu tiên trong hệ thống
        if (!idNguoiGui) {
            const [adminRow] = await db.query(
                "SELECT id FROM nguoi_dung WHERE vai_tro = 'QuanLy' LIMIT 1"
            );
            idNguoiGui = adminRow[0]?.id;
        }

        // Chỉ chèn thông báo nếu tìm thấy người gửi hợp lệ
        if (idNguoiGui) {
            await db.query(
                `INSERT INTO thong_bao (id_nguoi_gui, tieu_de, noi_dung, ngay_gui)
                 VALUES (?, ?, ?, NOW())`,
                [idNguoiGui, tieuDeThongBao, noiDungThongBao]
            );
        }

        return res.status(200).json({
            message: 'Cập nhật trạng thái và tạo thông báo thành công!'
        });

    } catch (error) {
        console.error('Lỗi cập nhật bảo trì:', error);
        return res.status(500).json({ message: 'Lỗi server khi cập nhật bảo trì!' });
    }
});
module.exports = router;