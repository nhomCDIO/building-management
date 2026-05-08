import React, { useEffect, useState } from 'react';
import {
    apiLayDanhSachPhong,
    apiLayPhuongTienTheoPhong
} from '../../api/goi_api';

export default function QuanLyPhuongTien() {
    const [dsPhong, setDsPhong] = useState([]);
    const [phongDangChon, setPhongDangChon] = useState('');
    const [dsXe, setDsXe] = useState([]);
    const [loadingPhong, setLoadingPhong] = useState(true);
    const [loadingXe, setLoadingXe] = useState(false);

    const fetchDanhSachPhong = async () => {
        try {
            setLoadingPhong(true);
            const data = await apiLayDanhSachPhong();
            setDsPhong(data || []);
        } catch (error) {
            console.error('Lỗi lấy danh sách phòng:', error);
            alert('Không thể tải danh sách phòng!');
        } finally {
            setLoadingPhong(false);
        }
    };

    const handleChonPhong = async (maPhong) => {
        try {
            setPhongDangChon(maPhong);
            setLoadingXe(true);
            const data = await apiLayPhuongTienTheoPhong(maPhong);
            setDsXe(data || []);
        } catch (error) {
            console.error('Lỗi lấy xe theo phòng:', error);
            alert('Không thể tải phương tiện!');
        } finally {
            setLoadingXe(false);
        }
    };

    useEffect(() => {
        fetchDanhSachPhong();
    }, []);

    return (
        <div style={containerStyle}>
            <div style={leftStyle}>
                {loadingPhong ? (
                    <div style={loadingStyle}>Đang tải phòng...</div>
                ) : (
                    <div style={gridStyle}>
                        {dsPhong.map((item) => (
                            <button
                                key={item.ma_phong}
                                onClick={() => handleChonPhong(item.ma_phong)}
                                style={{
                                    ...roomBtnStyle,
                                    backgroundColor:
                                        phongDangChon === item.ma_phong ? '#a56b6b' : '#fff',
                                    color:
                                        phongDangChon === item.ma_phong ? '#fff' : '#333'
                                }}
                            >
                                {item.ma_phong}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div style={rightStyle}>
                {!phongDangChon ? (
                    <div style={emptyStyle}>Vui lòng chọn một số phòng ở bên trái...</div>
                ) : loadingXe ? (
                    <div style={emptyStyle}>Đang tải dữ liệu...</div>
                ) : dsXe.length === 0 ? (
                    <div style={emptyStyle}>Phòng {phongDangChon} chưa đăng ký phương tiện nào.</div>
                ) : (
                    <div style={{ width: '100%' }}>
                        <h2 style={titleStyle}>PHƯƠNG TIỆN PHÒNG {phongDangChon}</h2>

                        <div style={listStyle}>
                            {dsXe.map((xe) => (
                                <div key={xe.id} style={itemStyle}>
                                    <div>
                                        <div style={itemMainStyle}>{xe.bien_so}</div>
                                        <div style={itemSubStyle}>
                                            {xe.loai_xe === 'XeMay'
                                                ? 'Xe máy'
                                                : xe.loai_xe === 'Oto'
                                                ? 'Ô tô'
                                                : 'Khác'}
                                        </div>
                                    </div>

                                    <div style={dateStyle}>
                                        {new Date(xe.ngay_tao).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            ))}
                        </div>
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
    width: '220px',
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
    padding: '10px 0',
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
    marginTop: 0,
    marginBottom: '20px'
};

const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f8f8f8',
    borderRadius: '14px'
};

const itemMainStyle = {
    fontWeight: 'bold',
    color: '#222'
};

const itemSubStyle = {
    fontSize: '14px',
    color: '#777',
    marginTop: '4px'
};

const dateStyle = {
    fontSize: '13px',
    color: '#888'
};

const emptyStyle = {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '20px'
};

const loadingStyle = {
    textAlign: 'center',
    color: '#fff',
    padding: '20px'
};