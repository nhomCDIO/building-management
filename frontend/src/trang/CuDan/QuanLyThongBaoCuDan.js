import React, { useEffect, useState } from 'react';
import { apiLayThongBao } from '../../api/goi_api';

export default function ThongBaoCuDan() {
    const [dsThongBao, setDsThongBao] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchThongBao = async () => {
        try {
            setLoading(true);
            const data = await apiLayThongBao();
            setDsThongBao(data || []);
        } catch (error) {
            console.error('Lỗi tải thông báo:', error);
            alert(error.response?.data?.message || 'Không thể tải thông báo!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThongBao();

        const interval = setInterval(() => {
            fetchThongBao();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

   return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>📢 THÔNG BÁO TÒA NHÀ</h2>
                <div style={subTitleStyle}>
                    Cư dân có thể xem tất cả thông báo từ ban quản lý tại đây
                </div>
            </div>

            <div style={bodyStyle}>
                {loading ? (
                    <div style={emptyStyle}>Đang tải thông báo...</div>
                ) : dsThongBao.length === 0 ? (
                    <div style={emptyStyle}>Hiện tại chưa có thông báo nào.</div>
                ) : (
                    <div style={listStyle}>
                        {dsThongBao.map((item) => {
                            // --- PHẦN BỔ SUNG MỚI: Kiểm tra xem có phải thông báo bảo trì không ---
                            const laBaoTri = item.tieu_de.includes('🛠️') || item.tieu_de.toLowerCase().includes('bảo trì');

                            return (
                                <div 
                                    key={item.id} 
                                    style={{
                                        ...itemStyle,
                                        // Highlight thông báo bảo trì: viền vàng và nền vàng nhạt
                                        borderLeft: laBaoTri ? '6px solid #fbc02d' : 'none',
                                        backgroundColor: laBaoTri ? '#fffef0' : 'rgba(255,255,255,0.92)'
                                    }}
                                >
                                    <div style={itemTopStyle}>
                                        <div style={{
                                            ...itemTitleStyle,
                                            // Đổi màu chữ tiêu đề nếu là bảo trì cho đồng bộ
                                            color: laBaoTri ? '#d4a017' : '#8b5e5e'
                                        }}>
                                            {item.tieu_de}
                                        </div>
                                        <div style={itemTimeStyle}>
                                            {new Date(item.ngay_gui).toLocaleString('vi-VN')}
                                        </div>
                                    </div>

                                    <div style={itemSenderStyle}>
                                        Người gửi: {item.ten_hien_thi || 'ad'}
                                    </div>

                                    <div style={itemContentStyle}>
                                        {item.noi_dung}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );  
}

const containerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: 'calc(100vh - 230px)',
    minHeight: 0,
    overflow: 'hidden'
};

const headerStyle = {
    flexShrink: 0
};

const titleStyle = {
    margin: 0,
    color: '#fff',
    fontWeight: 'bold'
};

const subTitleStyle = {
    marginTop: '6px',
    color: '#f1f1f1',
    fontSize: '14px'
};

const bodyStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '20px',
    overflow: 'hidden',
    minHeight: 0
};

const listStyle = {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    paddingRight: '6px'
};

const itemStyle = {
    background: 'rgba(255,255,255,0.92)',
    borderRadius: '18px',
    padding: '18px',
    flexShrink: 0
};

const itemTopStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '8px'
};

const itemTitleStyle = {
    fontWeight: 'bold',
    color: '#8b5e5e',
    fontSize: '18px'
};

const itemTimeStyle = {
    fontSize: '12px',
    color: '#777',
    whiteSpace: 'nowrap'
};

const itemSenderStyle = {
    fontSize: '13px',
    color: '#666',
    marginBottom: '10px'
};

const itemContentStyle = {
    color: '#333',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap'
};

const emptyStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontSize: '20px'
};