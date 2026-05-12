import React, { useEffect, useState } from 'react';
import { apiLayChiTietHoaDon, apiThanhToanHoaDon } from '../../api/goi_api';

export default function HoaDonCuDan() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const now = new Date();

    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam, setNam] = useState(now.getFullYear());
    const [chiTiet, setChiTiet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        so_tien: '',
        noi_dung: ''
    });

    const fetchChiTiet = async () => {
        try {
            if (!user?.so_phong) return;

            setLoading(true);
            const data = await apiLayChiTietHoaDon(user.so_phong, thang, nam);
            setChiTiet(data);

            // Tự động điền số tiền và nội dung nếu có dữ liệu từ backend trả về
            if (data.trang_thai === 'DaThanhToan') {
                setForm({
                    so_tien: data.so_tien || '',
                    noi_dung: data.noi_dung || ''
                });
            } else {
                setForm({
                    so_tien: data.so_tien || '', // Hiển thị số tiền cần nợ nếu backend trả về
                    noi_dung: data.noi_dung || `Thanh toán tiền điện nước tháng ${thang}/${nam}`
                });
            }
        } catch (error) {
            console.error('Lỗi lấy hóa đơn cư dân:', error);
            alert(error.response?.data?.message || 'Không thể tải dữ liệu hóa đơn!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChiTiet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thang, nam]);

    const handleThanhToan = async () => {
        if (!form.so_tien || Number(form.so_tien) <= 0 || !form.noi_dung.trim()) {
            return alert('Vui lòng nhập đầy đủ số tiền và nội dung!');
        }

        try {
            const data = await apiThanhToanHoaDon({
                ma_phong: user.so_phong,
                thang,
                nam,
                so_tien: Number(form.so_tien),
                noi_dung: form.noi_dung.trim()
            });

            alert(data.message);
            fetchChiTiet();
        } catch (error) {
            console.error('Lỗi thanh toán hóa đơn:', error);
            alert(error.response?.data?.message || 'Thanh toán thất bại!');
        }
    };

    // Hàm format tiền tệ
    const formatMoney = (amount) => Number(amount || 0).toLocaleString('vi-VN') + ' VNĐ';

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>HÓA ĐƠN CƯ DÂN</h2>
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

            <div style={bodyStyle}>
                {loading ? (
                    <div style={emptyStyle}>Đang kiểm tra dữ liệu...</div>
                ) : (
                    <div style={cardStyle}>
                        <h3 style={chiTiet?.trang_thai === 'DaThanhToan' ? statusPaidStyle : statusUnpaidStyle}>
                            {chiTiet?.trang_thai === 'DaThanhToan' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                        </h3>
                        
                        <div style={infoBoxStyle}>
                            <p><b>Phòng:</b> {user.so_phong}</p>
                            <p><b>Hạn thanh toán:</b> <span style={{color: 'red'}}>{chiTiet?.han_thanh_toan ? new Date(chiTiet.han_thanh_toan).toLocaleDateString('vi-VN') : '---'}</span></p>
                            <hr style={hrStyle}/>
                            <p><b>Tiền điện:</b> {formatMoney(chiTiet?.tien_dien)}</p>
                            <p><b>Tiền nước:</b> {formatMoney(chiTiet?.tien_nuoc)}</p>
                            <p><b>Phụ phí:</b> {formatMoney(chiTiet?.phu_phi)}</p>
                            <p style={{fontSize: '1.2rem', marginTop: '10px'}}>
                                <b>Tổng cần thu:</b> <span style={{color: '#c62828'}}>{formatMoney(chiTiet?.so_tien)}</span>
                            </p>
                        </div>

                        {chiTiet?.trang_thai !== 'DaThanhToan' ? (
                            <>
                                <label style={labelStyle}>Số tiền thanh toán:</label>
                                <input
                                    type="number"
                                    value={form.so_tien}
                                    onChange={(e) => setForm({ ...form, so_tien: e.target.value })}
                                    style={inputStyle}
                                    placeholder="Nhập số tiền"
                                />

                                <label style={labelStyle}>Nội dung:</label>
                                <textarea
                                    value={form.noi_dung}
                                    onChange={(e) => setForm({ ...form, noi_dung: e.target.value })}
                                    style={textareaStyle}
                                    placeholder="Nhập nội dung thanh toán"
                                />

                                <button onClick={handleThanhToan} style={buttonStyle}>
                                    XÁC NHẬN THANH TOÁN
                                </button>
                            </>
                        ) : (
                            <div style={successBoxStyle}>
                                <p><b>Thời gian:</b> {chiTiet.thoi_gian_thanh_toan ? new Date(chiTiet.thoi_gian_thanh_toan).toLocaleString('vi-VN') : 'Hệ thống mặc định'}</p>
                                <p><b>Nội dung chuyển khoản:</b> {chiTiet.noi_dung}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Bổ sung/Cập nhật các Style
const infoBoxStyle = {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #eee',
    marginBottom: '10px'
};

const hrStyle = {
    border: 'none',
    borderTop: '1px dashed #ccc',
    margin: '10px 0'
};

const successBoxStyle = {
    padding: '15px',
    border: '1px solid #2e7d32',
    borderRadius: '12px',
    backgroundColor: '#e8f5e9'
};

// ... Các style cũ của bạn giữ nguyên bên dưới ...
const containerStyle = { flex: 1, display: 'flex', flexDirection: 'column', height: '100%' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px' };
const titleStyle = { margin: 0, color: '#fff' };
const selectStyle = { padding: '10px 14px', borderRadius: '10px', border: 'none', outline: 'none' };
const bodyStyle = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const cardStyle = { width: '100%', maxWidth: '560px', background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' };
const labelStyle = { fontWeight: 'bold', color: '#444' };
const inputStyle = { padding: '14px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' };
const textareaStyle = { minHeight: '80px', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', resize: 'none' };
const buttonStyle = { marginTop: '10px', padding: '14px', border: 'none', borderRadius: '12px', backgroundColor: '#9b6b6b', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };
const emptyStyle = { color: '#fff', fontSize: '20px' };
const statusPaidStyle = { textAlign: 'center', color: '#2e7d32', marginTop: 0, fontWeight: 'bold' };
const statusUnpaidStyle = { textAlign: 'center', color: '#c62828', marginTop: 0, fontWeight: 'bold' };