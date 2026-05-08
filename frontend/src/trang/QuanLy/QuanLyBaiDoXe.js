import React, { useEffect, useState } from 'react';
import {
    apiLayDanhSachBaiDoXe,
    apiLayChiTietBaiDoXe,
    apiAdminXoaBaiDoXe
} from '../../api/goi_api';

export default function QuanLyBaiDoXe() {
    const [dsO, setDsO] = useState([]);
    const [oDangChon, setODangChon] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDsO = async () => {
        try {
            setLoading(true);
            const data = await apiLayDanhSachBaiDoXe();
            setDsO(data || []);
        } catch (error) {
            console.error('Lỗi tải bãi đỗ xe:', error);
            alert(error.response?.data?.message || 'Không thể tải dữ liệu bãi đỗ xe!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDsO();
    }, []);

    const handleChonO = async (maO) => {
        try {
            const data = await apiLayChiTietBaiDoXe(maO);
            setODangChon(data);
        } catch (error) {
            console.error('Lỗi lấy chi tiết ô:', error);
            alert(error.response?.data?.message || 'Không thể lấy chi tiết ô!');
        }
    };

    const handleXoa = async () => {
        if (!oDangChon) return;
        try {
            const data = await apiAdminXoaBaiDoXe({ ma_o: oDangChon.ma_o });
            alert(data.message);
            setODangChon(null);
            fetchDsO();
        } catch (error) {
            console.error('Lỗi admin xóa ô:', error);
            alert(error.response?.data?.message || 'Xóa thất bại!');
        }
    };

    const getMauO = (o) => {
        return o.trang_thai === 'Trong' ? '#ffffff' : '#fbc02d';
    };

    return (
        <div style={containerStyle}>
            <div style={leftStyle}>
                {loading ? (
                    <div style={emptyStyle}>Đang tải dữ liệu...</div>
                ) : (
                    <div style={gridStyle}>
                        {dsO.map((o) => (
                            <button
                                key={o.ma_o}
                                onClick={() => handleChonO(o.ma_o)}
                                style={{
                                    ...oBtnStyle,
                                    backgroundColor: getMauO(o)
                                }}
                            >
                                {o.ma_o}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div style={rightStyle}>
                {!oDangChon ? (
                    <div style={emptyStyle}>Vui lòng chọn một vị trí đỗ ở bên trái để xem thông tin.</div>
                ) : (
                    <div style={{ width: '100%' }}>
                        <h2 style={titleStyle}>CHI TIẾT Ô ĐỖ XE</h2>

                        <div style={infoBoxStyle}>
                            <p><b>Mã ô:</b> {oDangChon.ma_o}</p>
                            <p><b>Trạng thái:</b> {oDangChon.trang_thai === 'Trong' ? 'Trống' : 'Đã thuê'}</p>
                            <p><b>Thuê bởi phòng:</b> {oDangChon.ma_phong_thue || 'Chưa có'}</p>
                            {oDangChon.ngay_dang_ky && (
                                <p><b>Ngày đăng ký:</b> {new Date(oDangChon.ngay_dang_ky).toLocaleString('vi-VN')}</p>
                            )}
                        </div>

                        {oDangChon.trang_thai === 'DaThue' && (
                            <button onClick={handleXoa} style={actionBtnStyle}>
                                Xóa cư dân khỏi ô này
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const containerStyle = {
    flex: 1,
    display: 'flex',
    gap: '20px',
    height: '100%'
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

const oBtnStyle = {
    border: 'none',
    borderRadius: '10px',
    padding: '14px 0',
    fontWeight: 'bold',
    cursor: 'pointer'
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

const titleStyle = {
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

const actionBtnStyle = {
    marginTop: '20px',
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#9b6b6b',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const emptyStyle = {
    textAlign: 'center',
    color: '#999',
    fontSize: '18px'
};