import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

// Import Assets
import logoBgImg from '../../assets/nen_ten_web.jpg';
import mainBgImg from '../../assets/nen_nen.jpg';

const TrangChuCuDan = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [currentUser, setCurrentUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem('user') || '{}');
    });

    const menuItems = [
        { name: 'Thông báo', path: 'thong-bao' },
        { name: 'Xem hoá đơn', path: 'hoa-don' },
        { name: 'Nhắn tin', path: 'nhan-tin' },
        { name: 'Gửi yêu cầu bảo trì', path: 'bao-tri' },
        { name: 'Quản lý phương tiện', path: 'phuong-tien' },
        { name: 'Đăng ký bãi đỗ xe', path: 'dang-ky-bai-do-xe' },
        { name: 'Thông tin cá nhân', path: 'thong-tin' },
    ];

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        setCurrentUser(user);

        // Chưa đăng nhập hoặc sai vai trò -> quay về auth
        if (!user?.id || user?.vai_tro !== 'CuDan') {
            navigate('/auth', { replace: true });
            return;
        }

        const daKhaiBao = Number(user.da_khai_bao) === 1;

        // Nếu vừa vào dashboard cư dân
        if (
            location.pathname === '/dashboard-cu-dan' ||
            location.pathname === '/dashboard-cu-dan/'
        ) {
            if (!daKhaiBao) {
                navigate('/dashboard-cu-dan/thong-tin', { replace: true });
            } else {
                navigate('/dashboard-cu-dan/thong-bao', { replace: true });
            }
            return;
        }

        // Nếu chưa khai báo thì bắt buộc ở lại trang thông tin cá nhân
        if (!daKhaiBao && location.pathname !== '/dashboard-cu-dan/thong-tin') {
            navigate('/dashboard-cu-dan/thong-tin', { replace: true });
        }
    }, [location.pathname, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth', { replace: true });
    };

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
                boxSizing: 'border-box'
            }}
        >
            {/* Sidebar */}
            <aside style={styles.sidebar} className="glass-sidebar">
                <div
                    style={{
                        ...styles.logoWrapper,
                        backgroundImage: `url(${logoBgImg})`
                    }}
                >
                    <h1 style={styles.logoText}>A&RMS</h1>
                </div>

                <nav style={styles.navStack}>
                    {menuItems.map((item, index) => {
                        const chuaKhaiBao = Number(currentUser?.da_khai_bao) !== 1;

                        return (
                            <NavLink
                                key={index}
                                to={`/dashboard-cu-dan/${item.path}`}
                                style={({ isActive }) => ({
                                    ...styles.navBtn,
                                    backgroundColor: isActive ? 'rgba(139, 94, 94, 0.9)' : '#fff',
                                    color: isActive ? '#fff' : '#333',
                                    border:
                                        chuaKhaiBao && item.path === 'thong-tin'
                                            ? '2px solid #fbc02d'
                                            : 'none',
                                    opacity:
                                        chuaKhaiBao && item.path !== 'thong-tin'
                                            ? 0.7
                                            : 1
                                })}
                            >
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    Đăng xuất
                </button>
            </aside>

            {/* Content Area */}
            <div style={styles.rightContent}>
                <header style={styles.headerRow}>
                    <div className="glass-sidebar" style={styles.titleBox}>
                        Hệ thống cư dân A&RMS
                    </div>

                    <div className="glass-sidebar" style={styles.adminBox}>
                        {currentUser?.so_phong
                            ? `Phòng ${currentUser.so_phong}`
                            : 'Cư dân'}
                    </div>
                </header>

                <main style={styles.contentMain}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// Styles
const styles = {
    sidebar: {
        width: '280px',
        borderRadius: '30px',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column'
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
        border: '1px solid rgba(255,255,255,0.2)'
    },
    logoText: {
        color: '#fff',
        fontSize: '35px',
        fontWeight: '900',
        textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
        margin: 0
    },
    navStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flex: 1
    },
    navBtn: {
        padding: '15px 20px',
        borderRadius: '25px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '13px',
        textAlign: 'center',
        transition: '0.3s'
    },
    logoutBtn: {
        marginTop: '20px',
        padding: '12px',
        borderRadius: '20px',
        border: 'none',
        background: 'rgba(255,255,255,0.2)',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    rightContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    headerRow: {
        display: 'flex',
        gap: '20px',
        height: '60px'
    },
    titleBox: {
        flex: 1,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    adminBox: {
        width: '150px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    contentMain: {
        flex: 1,
        display: 'flex'
    }
};

export default TrangChuCuDan;