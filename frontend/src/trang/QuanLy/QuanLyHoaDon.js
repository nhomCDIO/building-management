import React, { useEffect, useState } from 'react';
import { apiLayDanhSachHoaDon, apiLayChiTietHoaDon } from '../../api/goi_api';
import axios from 'axios'; // Đảm bảo bạn đã cài axios

export default function QuanLyHoaDon() {
    const now = new Date();
    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam, setNam] = useState(now.getFullYear());
    const [dsPhong, setDsPhong] = useState([]);
    const [phongDangChon, setPhongDangChon] = useState('');
    const [chiTiet, setChiTiet] = useState(null);
    const [loading, setLoading] = useState(true);

    // State cho Form nhập liệu
    const [formInput, setFormInput] = useState({
        tien_dien: 0,
        tien_nuoc: 0,
        phu_phi: 0,
        han_thanh_toan: '',
        noi_dung: ''
    });

    const fetchDanhSach = async () => {
        try {
            setLoading(true);
            const data = await apiLayDanhSachHoaDon(thang, nam);
            setDsPhong(data || []);
        } catch (error) {
            alert('Không thể tải dữ liệu hóa đơn!');
        } finally {
            setLoading(false);
        }
    };

    const handleChonPhong = async (maPhong) => {
        try {
            setPhongDangChon(maPhong);
            const data = await apiLayChiTietHoaDon(maPhong, thang, nam);
            setChiTiet(data);
            
            // Đổ dữ liệu cũ vào form để chỉnh sửa
            setFormInput({
                tien_dien: data.tien_dien || 0,
                tien_nuoc: data.tien_nuoc || 0,
                phu_phi: data.phu_phi || 0,
                han_thanh_toan: data.han_thanh_toan ? data.han_thanh_toan.split('T')[0] : '',
                noi_dung: data.noi_dung || ''
            });
        } catch (error) {
            alert('Không thể lấy chi tiết hóa đơn!');
        }
    };

    // Hàm gửi dữ liệu về Backend
    const handleCapNhat = async () => {
        try {
            const payload = {
                ma_phong: phongDangChon,
                thang,
                nam,
                ...formInput
            };
            // Thay đổi URL cho đúng với route backend của bạn
            await axios.post('http://localhost:5000/api/hoa-don/cap-nhat-thong-so', payload);
            alert('Cập nhật hóa đơn thành công!');
            fetchDanhSach(); // Refresh lại danh sách bên trái
        } catch (error) {
            alert('Lỗi khi cập nhật: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchDanhSach();
        setPhongDangChon('');
        setChiTiet(null);
    }, [thang, nam]);

    const getMauPhong = (item) => {
        return item.trang_thai === 'DaThanhToan' ? '#4caf50' : '#fbc02d';
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>QUẢN LÝ HÓA ĐƠN</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select value={thang} onChange={(e) => setThang(Number(e.target.value))} style={selectStyle}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>Tháng {m}</option>
                        ))}
                    </select>
                    <select value={nam} onChange={(e) => setNam(Number(e.target.value))} style={selectStyle}>
                        {[2025, 2026, 2027, 2028].map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={mainStyle}>
                {/* BÊN TRÁI: DANH SÁCH PHÒNG */}
                <div style={leftStyle}>
                    {loading ? <div style={emptyStyle}>Đang tải...</div> : (
                        <div style={gridStyle}>
                            {dsPhong.map((item) => (
                                <button key={item.ma_phong} onClick={() => handleChonPhong(item.ma_phong)}
                                    style={{ ...roomBtnStyle, backgroundColor: getMauPhong(item), outline: phongDangChon === item.ma_phong ? '3px solid #fff' : 'none' }}>
                                    {item.ma_phong}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* BÊN PHẢI: FORM NHẬP LIỆU */}
                <div style={rightStyle}>
                    {!chiTiet ? (
                        <div style={emptyStyle}>Vui lòng chọn một số phòng ở bên trái để nhập hóa đơn...</div>
                    ) : (
                        <div style={{ width: '100%', maxWidth: '500px' }}>
                            <h2 style={detailTitleStyle}>NHẬP DỮ LIỆU PHÒNG {chiTiet.ma_phong}</h2>
                            
                            <div style={formGrid}>
                                <div>
                                    <label style={labelStyle}>Tiền điện (VNĐ):</label>
                                    <input type="number" value={formInput.tien_dien} style={inputStyle}
                                        onChange={e => setFormInput({...formInput, tien_dien: e.target.value})}/>
                                </div>
                                <div>
                                    <label style={labelStyle}>Tiền nước (VNĐ):</label>
                                    <input type="number" value={formInput.tien_nuoc} style={inputStyle}
                                        onChange={e => setFormInput({...formInput, tien_nuoc: e.target.value})}/>
                                </div>
                                <div>
                                    <label style={labelStyle}>Phụ phí (VNĐ):</label>
                                    <input type="number" value={formInput.phu_phi} style={inputStyle}
                                        onChange={e => setFormInput({...formInput, phu_phi: e.target.value})}/>
                                </div>
                                <div>
                                    <label style={labelStyle}>Hạn thanh toán:</label>
                                    <input type="date" value={formInput.han_thanh_toan} style={inputStyle}
                                        onChange={e => setFormInput({...formInput, han_thanh_toan: e.target.value})}/>
                                </div>
                            </div>

                            <label style={labelStyle}>Nội dung ghi chú:</label>
                            <textarea value={formInput.noi_dung} style={textareaStyle}
                                onChange={e => setFormInput({...formInput, noi_dung: e.target.value})} />

                            <div style={totalStyle}>
                                TỔNG CỘNG: {(Number(formInput.tien_dien) + Number(formInput.tien_nuoc) + Number(formInput.phu_phi)).toLocaleString('vi-VN')} VNĐ
                            </div>

                            <button onClick={handleCapNhat} style={btnSubmitStyle}>
                                LƯU & GỬI HÓA ĐƠN
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Bổ sung các Style mới
const formGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const textareaStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px', boxSizing: 'border-box' };
const totalStyle = { marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '10px', textAlign: 'center', fontWeight: 'bold', color: '#1976d2', fontSize: '18px' };
const btnSubmitStyle = { width: '100%', marginTop: '15px', padding: '15px', border: 'none', borderRadius: '10px', backgroundColor: '#8b5e5e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };

// ... Giữ nguyên các style cũ của bạn (containerStyle, leftStyle, v.v.) ...
const containerStyle = { flex: 1, display: 'flex', flexDirection: 'column', height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px' };
const titleStyle = { margin: 0, color: '#fff' };
const selectStyle = { padding: '10px 14px', borderRadius: '10px', border: 'none', outline: 'none' };
const mainStyle = { flex: 1, display: 'flex', gap: '20px' };
const leftStyle = { width: '340px', padding: '15px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', overflowY: 'auto' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' };
const roomBtnStyle = { border: 'none', borderRadius: '10px', padding: '14px 0', fontWeight: 'bold', cursor: 'pointer', color: '#222' };
const rightStyle = { flex: 1, borderRadius: '25px', background: 'rgba(255,255,255,0.92)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px' };
const detailTitleStyle = { textAlign: 'center', color: '#8b5e5e', marginTop: 0 };
const emptyStyle = { textAlign: 'center', color: '#999', fontSize: '18px' };