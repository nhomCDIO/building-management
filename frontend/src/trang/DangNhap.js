import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiDangNhap, apiDangKy } from '../api/goi_api';
import bgImage from '../assets/background.jpg';

const DangNhap = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);

    const [form, setForm] = useState({
        ten: '',
        mk: '',
        reMk: '',
        role: 'CuDan',
        maNoiBo: ''
    });

    const handleAction = async (e) => {
        e.preventDefault();

        try {
            if (!isRegister) {
                const data = await apiDangNhap({
                    ten: form.ten,
                    mk: form.mk
                });

                alert(data.message);

                const userData = data.user;
                sessionStorage.setItem('user', JSON.stringify(userData));

                if (userData.vai_tro === 'QuanLy') {
                    navigate('/dashboard-quan-ly');
                } else {
                    navigate('/dashboard-cu-dan');
                }
            } else {
                if (form.mk !== form.reMk) {
                    return alert('Mật khẩu nhập lại không khớp!');
                }

                if (form.role === 'QuanLy' && form.maNoiBo !== '123456') {
                    return alert('Mã nội bộ không chính xác!');
                }

                const data = await apiDangKy({
                    ten: form.ten,
                    mk: form.mk,
                    role: form.role,
                    maNoiBo: form.maNoiBo
                });

                alert(data.message);

                setForm({
                    ten: '',
                    mk: '',
                    reMk: '',
                    role: 'CuDan',
                    maNoiBo: ''
                });
                setIsRegister(false);
            }
        } catch (error) {
            console.error('Lỗi auth:', error);
            const errorMsg = error.response?.data?.message || 'Lỗi kết nối Server!';
            alert(errorMsg);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <div style={styles.leftSide}>
                    <div style={styles.logoContainer}>
                        <span style={styles.icon}>🏬</span>
                        <h1 style={styles.brandName}>A&RMS</h1>
                    </div>
                    <div style={styles.welcomeText}>
                        <p style={styles.mainWelcome}>
                            {isRegister ? 'Khởi tạo tài khoản mới,' : 'Chào mừng đã đến với A&RMS,'}
                        </p>
                        <p style={styles.subWelcome}>Phần mềm quản lý căn hộ và khu dân cư!</p>
                    </div>
                </div>

                <div style={styles.rightSide}>
                    <h2 style={styles.title}>
                        {isRegister ? 'Đăng Ký Thành Viên' : 'Apartment & Resident Management System'}
                    </h2>

                    <form onSubmit={handleAction} style={styles.form} autoComplete="off">
                        {isRegister && (
                            <div style={styles.roleBox}>
                                <div style={styles.radioGroup}>
                                    <label style={styles.label}>
                                        <input
                                            type="radio"
                                            checked={form.role === 'CuDan'}
                                            onChange={() => setForm({ ...form, role: 'CuDan' })}
                                        />{' '}
                                        Cư dân
                                    </label>
                                    <label style={styles.label}>
                                        <input
                                            type="radio"
                                            checked={form.role === 'QuanLy'}
                                            onChange={() => setForm({ ...form, role: 'QuanLy' })}
                                        />{' '}
                                        Quản lý
                                    </label>
                                </div>

                                {form.role === 'QuanLy' && (
                                    <input
                                        type="text"
                                        placeholder="Mã nội bộ..."
                                        style={styles.redInput}
                                        value={form.maNoiBo}
                                        onChange={(e) =>
                                            setForm({ ...form, maNoiBo: e.target.value })
                                        }
                                        required
                                    />
                                )}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Tài khoản ..."
                            style={styles.input}
                            required
                            value={form.ten}
                            autoComplete="one-time-code"
                            onChange={(e) => setForm({ ...form, ten: e.target.value })}
                        />

                        <input
                            type="password"
                            placeholder="Mật khẩu ..."
                            style={styles.input}
                            required
                            value={form.mk}
                            autoComplete="new-password"
                            onChange={(e) => setForm({ ...form, mk: e.target.value })}
                        />

                        {isRegister && (
                            <input
                                type="password"
                                placeholder="Nhập lại mật khẩu ..."
                                style={styles.input}
                                required
                                value={form.reMk}
                                autoComplete="new-password"
                                onChange={(e) => setForm({ ...form, reMk: e.target.value })}
                            />
                        )}

                        <button type="submit" style={styles.loginBtn}>
                            {isRegister ? 'Xác nhận Đăng ký' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div style={styles.footer}>
                        <span
                            style={styles.registerLink}
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setForm({
                                    ten: '',
                                    mk: '',
                                    reMk: '',
                                    role: 'CuDan',
                                    maNoiBo: ''
                                });
                            }}
                        >
                            {isRegister ? 'Quay lại Đăng nhập' : 'Đăng ký tài khoản mới'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Inter', sans-serif",
    },
    loginBox: {
        display: 'flex',
        width: '900px',
        height: '520px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        overflow: 'hidden',
    },
    leftSide: {
        flex: 1,
        backgroundColor: '#1c1c1c',
        padding: '50px',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' },
    icon: { fontSize: '35px' },
    brandName: { fontSize: '32px', fontWeight: 'bold', margin: 0 },
    welcomeText: { lineHeight: '1.6' },
    mainWelcome: { fontSize: '18px', fontWeight: '600' },
    subWelcome: { fontSize: '14px', opacity: 0.8 },
    rightSide: {
        flex: 1.3,
        padding: '40px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: { fontSize: '19px', color: '#444', textAlign: 'center', marginBottom: '30px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: {
        width: '100%',
        padding: '13px 16px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        backgroundColor: '#f9f9f9',
    },
    roleBox: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' },
    radioGroup: { display: 'flex', gap: '15px', fontSize: '14px' },
    label: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
    redInput: {
        border: '2px solid #a52a2a',
        borderRadius: '6px',
        padding: '5px 10px',
        width: '100px',
        outline: 'none'
    },
    loginBtn: {
        padding: '14px',
        backgroundColor: '#4e342e',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
    },
    footer: { marginTop: '20px', textAlign: 'center' },
    registerLink: { color: '#2e7d32', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }
};

export default DangNhap;