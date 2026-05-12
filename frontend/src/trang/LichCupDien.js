import React from 'react';
import { useNavigate } from 'react-router-dom';

const LichCupDien = () => {
    const navigate = useNavigate();
    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                {/*Thêm nút quay về */}
                <button 
                    onClick={() => navigate('/')} 
                    style={styles.backButton}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0a1d37';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'translateX(-5px)'; // Nhích nhẹ sang trái khi hover
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = '#0a1d37';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}
                >
                    <span>←</span> Trở về trang chủ
                </button>
                {/* Header Thông báo */}
                <div style={styles.header}>
                    <span style={styles.badge}>Thông báo nội bộ</span>
                    <h1 style={styles.title}>LỊCH TẠM NGỪNG CUNG CẤP ĐIỆN - THÁNG 05/2026</h1>
                    <div style={styles.meta}>
                        <span>📅 Đăng ngày: 08/05/2026</span>
                        <span>👤 Người đăng: Ban Quản Lý</span>
                    </div>
                </div>

                {/* Nội dung chi tiết */}
                <div style={styles.content}>
                    <p>Kính gửi Quý cư dân, Ban Quản Lý thông báo lịch bảo trì hệ thống điện định kỳ như sau:</p>
                    
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>Ngày</th>
                                <th style={styles.th}>Thời gian</th>
                                <th style={styles.th}>Khu vực ảnh hưởng</th>
                                <th style={styles.th}>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={styles.td}>17/05/2026</td>
                                <td style={styles.td}>08:00 - 11:30</td>
                                <td style={styles.td}>Tòa A1, tầng 1-10</td>
                                <td style={styles.td}>Bảo trì trạm biến áp</td>
                            </tr>
                            <tr style={{backgroundColor: '#f9f9f9'}}>
                                <td style={styles.td}>19/05/2026</td>
                                <td style={styles.td}>14:00 - 17:00</td>
                                <td style={styles.td}>Toàn bộ khu vực Shophouse</td>
                                <td style={styles.td}>Kiểm tra hệ thống tủ bù</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={styles.warningBox}>
                        <h4 style={{color: '#856404', marginTop: 0}}>⚠️ Lưu ý quan trọng:</h4>
                        <ul style={{marginBottom: 0}}>
                            <li>Quý cư dân vui lòng ngắt các thiết bị điện trước giờ thông báo.</li>
                            <li>Hạn chế sử dụng thang máy sát giờ cắt điện.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { padding: '50px 20px', backgroundColor: '#f4f7f6', minHeight: '100vh' },
    container: { maxWidth: '1000px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
    header: { borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '30px' },
    badge: { backgroundColor: '#800000', color: '#fff', padding: '5px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
    title: { color: '#0a1d37', marginTop: '15px', fontSize: '24px' },
    meta: { display: 'flex', gap: '20px', color: '#888', fontSize: '14px', marginTop: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    tableHeader: { backgroundColor: '#0a1d37', color: '#fff' },
    th: { padding: '12px', textAlign: 'left', border: '1px solid #ddd' },
    td: { padding: '12px', border: '1px solid #ddd' },
    warningBox: { backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginTop: '30px', borderLeft: '5px solid #ffc107' },
    backButton: {
        backgroundColor: '#fff',
        border: '2px solid #0a1d37',
        color: '#0a1d37',
        padding: '10px 20px',
        borderRadius: '30px', // Bo tròn kiểu viên thuốc (capsule) nhìn hiện đại hơn
        cursor: 'pointer',
        marginBottom: '30px',
        fontWeight: 'bold',
        fontSize: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px', // Tạo khoảng cách giữa icon mũi tên và chữ
        transition: 'all 0.3s ease', // Hiệu ứng chuyển động mượt mà
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    }
};

export default LichCupDien;