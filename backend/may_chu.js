const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); // Cho phép tất cả các nguồn truy cập
app.use(express.json());

// Route tài khoản
const routeTaiKhoan = require('./src/tai_khoan/dang_nhap');
app.use('/api/tai-khoan', routeTaiKhoan);

// Route thông báo
const routeThongBao = require('./src/chuc_nang/thong_bao');
app.use('/api/thong-bao', routeThongBao);

// Route cư dân
const routeCuDan = require('./src/chuc_nang/cu_dan');
app.use('/api/cu-dan', routeCuDan);

// Route phương tiện
const routePhuongTien = require('./src/chuc_nang/phuong_tien');
app.use('/api/phuong-tien', routePhuongTien);

// Route bãi đỗ xe
const routeBaiDoXe = require('./src/chuc_nang/bai_do_xe');
app.use('/api/bai-do-xe', routeBaiDoXe);

// thanh toán hoá đơn
const routeHoaDon = require('./src/chuc_nang/hoa_don');
app.use('/api/hoa-don', routeHoaDon);

// nhắn tin
const routeNhanTin = require('./src/chuc_nang/nhan_tin');
app.use('/api/nhan-tin', routeNhanTin);

// báo cáo
const routeBaoCao = require('./src/chuc_nang/bao_cao');
app.use('/api/bao-cao', routeBaoCao);

// Route test
app.get('/', (req, res) => {
    res.send('Backend A&RMS đang chạy!');
});

// Tìm đến cuối file và sửa dòng import baoTriRouter
const baoTriRouter = require('./src/chuc_nang/bao_tri'); 
app.use('/api/bao-tri', baoTriRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});