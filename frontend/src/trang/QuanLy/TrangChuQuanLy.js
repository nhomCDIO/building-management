import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import logoBgImg from '../../assets/nen_ten_web.jpg';
import mainBgImg from '../../assets/nen_nen.jpg';

const TrangChuQuanLy = () => {
    const navigate = useNavigate(); // 2. Khai báo navigate

    // 2. Thêm hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/auth', { replace: true });
    };
    const menuItems = [
        { name: 'Quản lý thông báo', path: 'thong-bao' },
        { name: 'Quản lý cư dân', path: 'cu-dan' },
        { name: 'Nhắn tin', path: 'nhan-tin' },
        { name: 'Quản lý hoá đơn', path: 'hoa-don' },
        { name: 'Quản lý yêu cầu bảo trì', path: 'bao-tri' },
        { name: 'Quản lý phương tiện', path: 'phuong-tien' },
        { name: 'Quản lý bãi đỗ xe', path: 'bai-do-xe' },
        { name: 'Báo cáo & thống kê', path: 'bao-cao' },
    ];

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',
                padding: '20px',
                gap: '20px',
                backgroundImage: `url(${mainBgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxSizing: 'border-box',
                position: 'relative'
            }}
        >
            <aside style={styles.sidebar} className="glass-sidebar">
                <div
                    style={{
                        ...styles.logoWrapper,
                        backgroundImage: `url(${logoBgImg})`,
                    }}
                >
                    <h1 style={styles.logoText}>A&RMS</h1>
                </div>

                <nav style={styles.navStack}>
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            style={({ isActive }) => ({
                                ...styles.navBtn,
                                backgroundColor: isActive ? 'rgba(139, 94, 94, 0.9)' : '#fff',
                                color: isActive ? '#fff' : '#333',
                            })}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div style={styles.rightContent}>
                <header style={styles.headerRow}>
                    <div className="glass-sidebar" style={styles.titleBox}>
                        HỆ THỐNG QUẢN LÝ TÒA NHÀ 
                    </div>
                    <div className="glass-sidebar" style={styles.adminBox}>
                        <span>admin</span>
                    </div>
                </header>

                <main style={styles.contentMain}>
                    <Outlet />
                </main>
            </div>
            {/* Nút Đăng xuất nằm cố định ở góc dưới bên phải */}
            <button 
                onClick={handleLogout} 
                style={styles.fixedLogoutBtn}
                className="glass-logout-btn" // Sử dụng CSS Class
            >
                Đăng xuất
            </button>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '280px',
        borderRadius: '30px',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
    },
    logoWrapper: {
        height: '110px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    logoText: {
        color: '#fff',
        fontSize: '35px',
        fontWeight: '900',
        textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
        margin: 0,
    },
    navStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflowY: 'auto', // Thêm cuộn cho menu nếu danh sách quá dài
        paddingRight: '5px',
    },
    navBtn: {
        padding: '15px 20px',
        borderRadius: '25px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '14px',
        textAlign: 'center',
        transition: '0.3s',
    },
    logoutBtn: {
        marginTop: '20px',
        padding: '12px',
        borderRadius: '20px',
        border: 'none',
        background: 'rgba(255,255,255,0.2)',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    rightContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    headerRow: {
        display: 'flex',
        gap: '20px',
        height: '60px',
    },
    titleBox: {
        flex: 1,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    adminBox: {
        width: '150px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
    },
    contentMain: {
        flex: 1,
        display: 'flex',
        minHeight: 0,
    },
    // Style mới cho nút Đăng xuất cố định
    fixedLogoutBtn: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        padding: '12px 25px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.3)',
        background: 'rgba(255,255,255,0.2)', // Giống i chang bên cư dân
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: 1000, // Đảm bảo luôn nằm trên các thành phần khác
        transition: '0.3s',
    },
};

export default TrangChuQuanLy;