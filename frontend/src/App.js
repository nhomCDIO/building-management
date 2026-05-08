import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DangNhap from './trang/DangNhap';

// --- PHÂN HỆ QUẢN LÝ ---
import TrangChuQuanLy from './trang/QuanLy/TrangChuQuanLy';
import QuanLyCuDan from './trang/QuanLy/QuanLyCuDan';
import NhanTin from './trang/QuanLy/NhanTin';
import QuanLyHoaDon from './trang/QuanLy/QuanLyHoaDon';
import QuanLyBaoTri from './trang/QuanLy/QuanLyBaoTri';
import QuanLyPhuongTien from './trang/QuanLy/QuanLyPhuongTien';
import QuanLyBaiDoXe from './trang/QuanLy/QuanLyBaiDoXe';
import QuanLyThongBao from './trang/QuanLy/QuanLyThongBao';
import BaoCaoThongKe from './trang/QuanLy/BaoCaoThongKe';

// --- PHÂN HỆ CƯ DÂN ---
import TrangChuCuDan from './trang/CuDan/TrangChuCuDan';
import ThongTinCaNhan from './trang/CuDan/ThongTinCaNhan';
import XemHoaDon from './trang/CuDan/XemHoaDon';
import ThanhToan from './trang/CuDan/ThanhToan';
import GuiYeuCauBaoTri from './trang/CuDan/GuiYeuCauBaoTri';
import QuanLyPhuongTienCuDan from './trang/CuDan/QuanLyPhuongTienCuDan';
import DangKyBaiDoXe from './trang/CuDan/DangKyBaiDoXe';
import QuanLyThongBaoCuDan from './trang/CuDan/QuanLyThongBaoCuDan';
import NhanTinCuDan from './trang/CuDan/NhanTinCuDan';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<DangNhap />} />

                <Route path="/dashboard-quan-ly" element={<TrangChuQuanLy />}>
                    <Route index element={<Navigate to="thong-bao" replace />} />
                    <Route path="thong-bao" element={<QuanLyThongBao />} />
                    <Route path="cu-dan" element={<QuanLyCuDan />} />
                    <Route path="nhan-tin" element={<NhanTin />} />
                    <Route path="hoa-don" element={<QuanLyHoaDon />} />
                    <Route path="bao-tri" element={<QuanLyBaoTri />} />
                    <Route path="phuong-tien" element={<QuanLyPhuongTien />} />
                    <Route path="bai-do-xe" element={<QuanLyBaiDoXe />} />
                    <Route path="bao-cao" element={<BaoCaoThongKe />} />
                </Route>

                <Route path="/dashboard-cu-dan" element={<TrangChuCuDan />}>
                    <Route index element={<Navigate to="thong-bao" replace />} />
                    <Route path="thong-bao" element={<QuanLyThongBaoCuDan />} />
                    <Route path="thong-tin" element={<ThongTinCaNhan />} />
                    <Route path="nhan-tin" element={<NhanTinCuDan />} />
                    <Route path="hoa-don" element={<XemHoaDon />} />
                    <Route path="thanh-toan" element={<ThanhToan />} />
                    <Route path="bao-tri" element={<GuiYeuCauBaoTri />} />
                    <Route path="phuong-tien" element={<QuanLyPhuongTienCuDan />} />
                    <Route path="dang-ky-bai-do-xe" element={<DangKyBaiDoXe />} />
                </Route>

                <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
        </Router>
    );
}

export default App;