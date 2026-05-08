import React, { useEffect, useState } from 'react';
import { apiLayDanhSachHoaDon, apiLayChiTietHoaDon } from '../../api/goi_api';

export default function QuanLyHoaDon() {
    const now = new Date();

    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam, setNam] = useState(now.getFullYear());
    const [dsPhong, setDsPhong] = useState([]);
    const [phongDangChon, setPhongDangChon] = useState('');
    const [chiTiet, setChiTiet] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDanhSach = async () => {
        try {
            setLoading(true);
            const data = await apiLayDanhSachHoaDon(thang, nam);
            setDsPhong(data || []);
        } catch (error) {
            console.error('Lỗi tải danh sách hóa đơn:', error);
            alert(error.response?.data?.message || 'Không thể tải dữ liệu hóa đơn!');
        } finally {
            setLoading(false);
        }
    };

    const handleChonPhong = async (maPhong) => {
        try {
            setPhongDangChon(maPhong);
            const data = await apiLayChiTietHoaDon(maPhong, thang, nam);
            setChiTiet(data);
        } catch (error) {
            console.error('Lỗi lấy chi tiết hóa đơn:', error);
            alert(error.response?.data?.message || 'Không thể lấy chi tiết hóa đơn!');
        }
    };

    useEffect(() => {
    fetchDanhSach();
    setPhongDangChon('');
    setChiTiet(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <div style={leftStyle}>
                    {loading ? (
                        <div style={emptyStyle}>Đang tải dữ liệu...</div>
                    ) : (
                        <div style={gridStyle}>
                            {dsPhong.map((item) => (
                                <button
                                    key={item.ma_phong}
                                    onClick={() => handleChonPhong(item.ma_phong)}
                                    style={{
                                        ...roomBtnStyle,
                                        backgroundColor: getMauPhong(item),
                                        outline: phongDangChon === item.ma_phong ? '3px solid #fff' : 'none'
                                    }}
                                >
                                    {item.ma_phong}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div style={rightStyle}>
                    {!chiTiet ? (
                        <div style={emptyStyle}>Vui lòng chọn một số phòng ở bên trái...</div>
                    ) : (
                        <div style={{ width: '100%' }}>
                            <h2 style={detailTitleStyle}>HÓA ĐƠN PHÒNG {chiTiet.ma_phong}</h2>

                            <div style={infoBoxStyle}>
                                <p><b>Tháng / Năm:</b> {chiTiet.thang} / {chiTiet.nam}</p>
                                <p><b>Trạng thái:</b> {chiTiet.trang_thai === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                                <p><b>Số tiền:</b> {Number(chiTiet.so_tien || 0).toLocaleString('vi-VN')} VNĐ</p>
                                <p><b>Nội dung:</b> {chiTiet.noi_dung || 'Chưa có'}</p>
                                <p><b>Thời gian:</b> {chiTiet.thoi_gian_thanh_toan ? new Date(chiTiet.thoi_gian_thanh_toan).toLocaleString('vi-VN') : 'Chưa có'}</p>
                                {chiTiet.la_mac_dinh && (
                                    <p style={{ color: '#888', fontStyle: 'italic' }}>
                                        Bản ghi này đang là trạng thái mặc định của các tháng trước.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const containerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px'
};

const titleStyle = {
    margin: 0,
    color: '#fff'
};

const selectStyle = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: 'none',
    outline: 'none'
};

const mainStyle = {
    flex: 1,
    display: 'flex',
    gap: '20px'
};

const leftStyle = {
    width: '340px',
    padding: '15px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    overflowY: 'auto'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px'
};

const roomBtnStyle = {
    border: 'none',
    borderRadius: '10px',
    padding: '14px 0',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#222'
};

const rightStyle = {
    flex: 1,
    borderRadius: '25px',
    background: 'rgba(255,255,255,0.92)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px'
};

const detailTitleStyle = {
    textAlign: 'center',
    color: '#8b5e5e',
    marginTop: 0
};

const infoBoxStyle = {
    background: '#f8f8f8',
    borderRadius: '14px',
    padding: '18px',
    marginTop: '20px',
    lineHeight: 1.8
};

const emptyStyle = {
    textAlign: 'center',
    color: '#999',
    fontSize: '18px'
};