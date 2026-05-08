import React, { useEffect, useState } from 'react';
import {
    apiLayDanhSachPhong,
    apiLayChiTietCuDanTheoPhong
} from '../../api/goi_api';

export default function QuanLyCuDan() {
    const [dsPhong, setDsPhong] = useState([]);
    const [phongDangChon, setPhongDangChon] = useState('');
    const [chiTiet, setChiTiet] = useState(null);
    const [loadingDsPhong, setLoadingDsPhong] = useState(true);
    const [loadingChiTiet, setLoadingChiTiet] = useState(false);

    const fetchDanhSachPhong = async () => {
        try {
            setLoadingDsPhong(true);
            const data = await apiLayDanhSachPhong();
            setDsPhong(data || []);
        } catch (error) {
            console.error('Lỗi lấy danh sách phòng:', error);
            alert(error.response?.data?.message || 'Không thể tải danh sách phòng!');
        } finally {
            setLoadingDsPhong(false);
        }
    };

    const handleChonPhong = async (maPhong) => {
        try {
            setPhongDangChon(maPhong);
            setLoadingChiTiet(true);
            const data = await apiLayChiTietCuDanTheoPhong(maPhong);
            setChiTiet(data);
        } catch (error) {
            console.error('Lỗi lấy chi tiết cư dân:', error);
            alert(error.response?.data?.message || 'Không thể lấy chi tiết cư dân!');
        } finally {
            setLoadingChiTiet(false);
        }
    };

    useEffect(() => {
        fetchDanhSachPhong();
    }, []);

    const getButtonStyle = (maPhong) => {
        return {
            ...roomBtnStyle,
            backgroundColor: phongDangChon === maPhong ? '#9b6b6b' : '#fff',
            color: phongDangChon === maPhong ? '#fff' : '#222',
            border: phongDangChon === maPhong ? '2px solid #fff' : 'none'
        };
    };

    const renderRightContent = () => {
        if (loadingChiTiet) {
            return <div style={emptyStyle}>Đang tải thông tin cư dân...</div>;
        }

        if (!phongDangChon) {
            return <div style={emptyStyle}>Vui lòng chọn một số phòng ở bên trái.</div>;
        }

        if (!chiTiet || !chiTiet.co_cu_dan) {
            return (
                <div style={emptyWrapStyle}>
                    <div style={warningIconStyle}>⚠️</div>
                    <div style={warningTitleStyle}>Phòng {phongDangChon} chưa khai báo</div>
                    <div style={warningTextStyle}>
                        Cư dân phòng này chưa tạo tài khoản hoặc chưa cập nhật thông tin lên hệ thống.
                    </div>
                </div>
            );
        }

        return (
            <div style={detailWrapStyle}>
                <h2 style={titleStyle}>THÔNG TIN CƯ DÂN PHÒNG {chiTiet.ma_phong}</h2>

                <div style={gridStyle}>
                    <div style={cardStyle}>
                        <div style={labelStyle}>Mã phòng</div>
                        <div style={valueStyle}>{chiTiet.ma_phong || '---'}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={labelStyle}>Tầng</div>
                        <div style={valueStyle}>{chiTiet.tang || '---'}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={labelStyle}>Tài khoản</div>
                        <div style={valueStyle}>{chiTiet.ten_dang_nhap || '---'}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={labelStyle}>Họ và tên</div>
                        <div style={valueStyle}>{chiTiet.ho_ten || 'Chưa cập nhật'}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={labelStyle}>Số điện thoại</div>
                        <div style={valueStyle}>{chiTiet.so_dien_thoai || 'Chưa cập nhật'}</div>
                    </div>

                    <div style={cardStyle}>
                        <div style={labelStyle}>Trạng thái khai báo</div>
                        <div style={valueStyle}>
                            {Number(chiTiet.da_khai_bao) === 1 ? 'Đã khai báo' : 'Chưa khai báo'}
                        </div>
                    </div>
                </div>

                <div style={infoBoxStyle}>
                    <div><b>Ngày tạo tài khoản:</b> {chiTiet.ngay_tao ? new Date(chiTiet.ngay_tao).toLocaleString('vi-VN') : '---'}</div>
                </div>
            </div>
        );
    };

    return (
        <div style={containerStyle}>
            <div style={leftStyle}>
                {loadingDsPhong ? (
                    <div style={emptyStyle}>Đang tải danh sách phòng...</div>
                ) : (
                    <div style={gridRoomStyle}>
                        {dsPhong.map((item) => (
                            <button
                                key={item.ma_phong}
                                onClick={() => handleChonPhong(item.ma_phong)}
                                style={getButtonStyle(item.ma_phong)}
                            >
                                {item.ma_phong}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div style={rightStyle}>
                {renderRightContent()}
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
    width: '240px',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '16px',
    overflowY: 'auto'
};

const gridRoomStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px'
};

const roomBtnStyle = {
    padding: '12px 0',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s'
};

const rightStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '26px',
    padding: '30px',
    overflowY: 'auto'
};

const detailWrapStyle = {
    width: '100%'
};

const titleStyle = {
    textAlign: 'center',
    marginTop: 0,
    marginBottom: '24px',
    color: '#8b5e5e'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
};

const cardStyle = {
    background: '#f8f8f8',
    borderRadius: '18px',
    padding: '20px'
};

const labelStyle = {
    color: '#777',
    fontSize: '14px',
    marginBottom: '8px'
};

const valueStyle = {
    color: '#222',
    fontWeight: 'bold',
    fontSize: '20px',
    wordBreak: 'break-word'
};

const infoBoxStyle = {
    marginTop: '20px',
    background: '#f8f8f8',
    borderRadius: '18px',
    padding: '18px',
    color: '#444'
};

const emptyStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#999',
    textAlign: 'center'
};

const emptyWrapStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#8b5e5e'
};

const warningIconStyle = {
    fontSize: '54px',
    marginBottom: '10px'
};

const warningTitleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '14px'
};

const warningTextStyle = {
    fontSize: '18px',
    color: '#666',
    maxWidth: '420px',
    lineHeight: 1.5
};