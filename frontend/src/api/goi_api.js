import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const apiDangNhap = async (data) => {
  const res = await axiosInstance.post('/tai-khoan/login', data);
  return res.data;
};

export const apiDangKy = async (data) => {
  const res = await axiosInstance.post('/tai-khoan/register', data);
  return res.data;
};

export const apiLayPhongTrong = async () => {
  const res = await axiosInstance.get('/tai-khoan/phong-trong');
  return res.data;
};

export const apiCapNhatThongTin = async (data) => {
  const res = await axiosInstance.post('/tai-khoan/cap-nhat-thong-tin', data);
  return res.data;
};

// thông báo
export const apiLayThongBao = async () => {
  const res = await axiosInstance.get('/thong-bao');
  return res.data;
};

export const apiGuiThongBao = async (data) => {
  const res = await axiosInstance.post('/thong-bao/gui', data);
  return res.data;
};
//
export const apiLayDanhSachPhong = async () => {
  const res = await axiosInstance.get('/cu-dan/danh-sach-phong');
  return res.data;
};

export const apiLayChiTietCuDanTheoPhong = async (maPhong) => {
  const res = await axiosInstance.get(`/cu-dan/chi-tiet/${maPhong}`);
  return res.data;
};
export const apiLayThongTinTaiKhoan = async (id) => {
  const res = await axiosInstance.get(`/tai-khoan/thong-tin/${id}`);
  return res.data;
};
export const apiLayPhuongTienTheoPhong = async (maPhong) => {
  const res = await axiosInstance.get(`/phuong-tien/phong/${maPhong}`);
  return res.data;
};

export const apiThemPhuongTien = async (data) => {
  const res = await axiosInstance.post('/phuong-tien/them', data);
  return res.data;
};

export const apiXoaPhuongTien = async (id, data) => {
  const res = await axiosInstance.delete(`/phuong-tien/xoa/${id}`, { data });
  return res.data;
};

// bãi đỗ xe
export const apiLayDanhSachBaiDoXe = async () => {
  const res = await axiosInstance.get('/bai-do-xe');
  return res.data;
};

export const apiLayChiTietBaiDoXe = async (maO) => {
  const res = await axiosInstance.get(`/bai-do-xe/${maO}`);
  return res.data;
};

export const apiDangKyBaiDoXe = async (data) => {
  const res = await axiosInstance.post('/bai-do-xe/dang-ky', data);
  return res.data;
};

export const apiHuyDangKyBaiDoXe = async (data) => {
  const res = await axiosInstance.post('/bai-do-xe/huy', data);
  return res.data;
};

export const apiAdminXoaBaiDoXe = async (data) => {
  const res = await axiosInstance.post('/bai-do-xe/admin-xoa', data);
  return res.data;
};

// thanh toán hoá đơn
export const apiLayDanhSachHoaDon = async (thang, nam) => {
  const res = await axiosInstance.get(`/hoa-don/danh-sach?thang=${thang}&nam=${nam}`);
  return res.data;
};

export const apiLayChiTietHoaDon = async (maPhong, thang, nam) => {
  const res = await axiosInstance.get(`/hoa-don/chi-tiet/${maPhong}?thang=${thang}&nam=${nam}`);
  return res.data;
};

export const apiThanhToanHoaDon = async (data) => {
  const res = await axiosInstance.post('/hoa-don/thanh-toan', data);
  return res.data;
};

// bảo trì
export const apiGuiBaoTri = async (data) => {
  const res = await axiosInstance.post('/bao-tri/gui', data);
  return res.data;
};

export const apiLayBaoTriCuDan = async (maPhong, ngay, thang, nam) => {
  const res = await axiosInstance.get(`/bao-tri/cu-dan/${maPhong}?ngay=${ngay}&thang=${thang}&nam=${nam}`);
  return res.data;
};

export const apiLayBaoTriAdmin = async (ngay, thang, nam) => {
  const res = await axiosInstance.get(`/bao-tri/admin?ngay=${ngay}&thang=${thang}&nam=${nam}`);
  return res.data;
};

export const apiCapNhatBaoTri = async (id, data) => {
    // Sử dụng axiosInstance và bỏ /api/ ở đầu vì baseURL đã có rồi
    const res = await axiosInstance.post('/bao-tri/cap-nhat', { id, ...data });
    return res.data;
};

//nhắn tin
export const apiLayTinNhanChung = async () => {
  const res = await axiosInstance.get('/nhan-tin/chung');
  return res.data;
};

export const apiGuiTinNhanChung = async (data) => {
  const res = await axiosInstance.post('/nhan-tin/chung/gui', data);
  return res.data;
};

export const apiLayTinNhanRieng = async (maPhong) => {
  const res = await axiosInstance.get(`/nhan-tin/rieng/${maPhong}`);
  return res.data;
};

export const apiGuiTinNhanRiengCuDan = async (data) => {
  const res = await axiosInstance.post('/nhan-tin/rieng/gui-cu-dan', data);
  return res.data;
};

export const apiGuiTinNhanRiengAdmin = async (data) => {
  const res = await axiosInstance.post('/nhan-tin/rieng/gui-admin', data);
  return res.data;
};

// báo cáo
export const apiBaoCaoCuDan = async () => {
  const res = await axiosInstance.get('/bao-cao/cu-dan');
  return res.data;
};

export const apiBaoCaoBaoTri = async (thang, nam) => {
  const res = await axiosInstance.get(`/bao-cao/bao-tri?thang=${thang}&nam=${nam}`);
  return res.data;
};

export const apiBaoCaoTaiChinh = async (thang, nam) => {
  const res = await axiosInstance.get(`/bao-cao/tai-chinh?thang=${thang}&nam=${nam}`);
  return res.data;
};

export const apiBaoCaoPhuongTien = async () => {
  const res = await axiosInstance.get('/bao-cao/phuong-tien');
  return res.data;
};




export default axiosInstance;