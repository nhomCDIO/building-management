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
        // 1. Nhận dữ liệu từ Frontend
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

        // 2. Cập nhật trạng thái yêu cầu bảo trì trong bảng 'bao_tri'
        const [updateResult] = await db.query(
            `UPDATE bao_tri 
             SET trang_thai = ?, ghi_chu_admin = ?, ngay_cap_nhat = NOW() 
             WHERE id = ?`,
            [trang_thai, ghi_chu_admin || '', id]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy yêu cầu bảo trì để cập nhật!' });
        }

        // 3. Lấy thông tin yêu cầu để làm nội dung thông báo
        const [rows] = await db.query(
            `SELECT tieu_de, ma_phong FROM bao_tri WHERE id = ?`,
            [id]
        );
        const yeuCauCu = rows[0];

        // 4. Xử lý idNguoiGui (Lấy từ id_admin của frontend hoặc mặc định là 1)
        // Đây là nơi bạn sửa lỗi ReferenceError
        const idNguoiGui = id_admin || 1; 

        // 5. Tạo nội dung và chèn vào bảng 'thong_bao'
        const tieuDeThongBao = `🛠️ CẬP NHẬT BẢO TRÌ: ${yeuCauCu.ma_phong}`;
        const noiDungThongBao = `Yêu cầu "${yeuCauCu.tieu_de}" đã được cập nhật:\n- Trạng thái: ${tenTrangThai[trang_thai]}\n- Phản hồi: ${ghi_chu_admin || 'Không có ghi chú'}`;

        // CẬP NHẬT LỆNH INSERT Ở ĐÂY:
        await db.query(
            `INSERT INTO thong_bao (id_nguoi_gui, tieu_de, noi_dung, ma_phong, ngay_gui)
            VALUES (?, ?, ?, ?, NOW())`,
            [idNguoiGui, tieuDeThongBao, noiDungThongBao, yeuCauCu.ma_phong] // Thêm yeuCauCu.ma_phong vào mảng này
        );

        // 6. Trả về kết quả thành công
        return res.status(200).json({
            message: 'Cập nhật trạng thái và tạo thông báo thành công!'
        });

    } catch (error) {
        console.error('Lỗi cập nhật bảo trì:', error);
        return res.status(500).json({ message: 'Lỗi server khi cập nhật bảo trì!' });
    }
    const [rows] = await db.query(
        `SELECT tieu_de, ma_phong FROM bao_tri WHERE id = ?`,
        [id]
    );

    // Thêm đoạn này để tránh lỗi nếu id sai
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy yêu cầu bảo trì với ID này!' });
    }
    const yeuCauCu = rows[0];
    });
module.exports = router;