import React, { useEffect, useState } from 'react';
import {
    apiLayPhongTrong,
    apiCapNhatThongTin,
    apiLayThongTinTaiKhoan
} from '../../api/goi_api';

export default function ThongTinCaNhan() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const [danhSachPhong, setDanhSachPhong] = useState([]);
    const [form, setForm] = useState({
        so_phong: '',
        ho_ten: '',
        so_dien_thoai: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [daKhaiBao, setDaKhaiBao] = useState(false);
    const [dangChinhSua, setDangChinhSua] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            if (!user?.id) {
                alert('Không tìm thấy tài khoản đăng nhập!');
                return;
            }

            const [thongTinUser, phongTrong] = await Promise.all([
                apiLayThongTinTaiKhoan(user.id),
                apiLayPhongTrong()
            ]);

            setForm({
                so_phong: thongTinUser.so_phong || '',
                ho_ten: thongTinUser.ho_ten || '',
                so_dien_thoai: thongTinUser.so_dien_thoai || ''
            });

            const userDaKhaiBao = Number(thongTinUser.da_khai_bao) === 1;
            setDaKhaiBao(userDaKhaiBao);
            setDangChinhSua(!userDaKhaiBao);

            let dsPhong = [...(phongTrong || [])];

            if (
                thongTinUser.so_phong &&
                !dsPhong.some((p) => p.ma_phong === thongTinUser.so_phong)
            ) {
                dsPhong.unshift({ ma_phong: thongTinUser.so_phong });
            }

            dsPhong.sort((a, b) => Number(a.ma_phong) - Number(b.ma_phong));
            setDanhSachPhong(dsPhong);
        } catch (error) {
            console.error('Lỗi tải thông tin cá nhân:', error);
            alert(error.response?.data?.message || 'Không thể tải thông tin cá nhân!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!user?.id) {
            return alert('Không tìm thấy tài khoản đăng nhập!');
        }

        if (!form.so_phong || !form.ho_ten.trim() || !form.so_dien_thoai.trim()) {
            return alert('Vui lòng nhập đầy đủ thông tin!');
        }

        try {
            setSaving(true);

            const data = await apiCapNhatThongTin({
                id_nguoi_dung: user.id,
                so_phong: form.so_phong,
                ho_ten: form.ho_ten.trim(),
                so_dien_thoai: form.so_dien_thoai.trim()
            });

            const newUser = {
                ...user,
                so_phong: data.user.so_phong,
                ho_ten: data.user.ho_ten,
                so_dien_thoai: data.user.so_dien_thoai,
                da_khai_bao: 1
            };

            sessionStorage.setItem('user', JSON.stringify(newUser));

            setForm({
                so_phong: data.user.so_phong || '',
                ho_ten: data.user.ho_ten || '',
                so_dien_thoai: data.user.so_dien_thoai || ''
            });

            setDaKhaiBao(true);
            setDangChinhSua(false);

            alert('Đã lưu thông tin thành công!');
        } catch (error) {
            console.error('Lỗi cập nhật thông tin:', error);
            const msg = error.response?.data?.message || 'Lưu thông tin thất bại!';
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <h2 style={titleStyle}>THÔNG TIN CÁ NHÂN</h2>
                    <div style={loadingStyle}>Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

    if (daKhaiBao && !dangChinhSua) {
        return (
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <h2 style={titleStyle}>THÔNG TIN CÁ NHÂN</h2>

                    <div style={infoRowStyle}>
                        <span style={infoLabelStyle}>Mã căn hộ:</span>
                        <span style={infoValueStyle}>{form.so_phong}</span>
                    </div>

                    <div style={infoRowStyle}>
                        <span style={infoLabelStyle}>Họ và tên:</span>
                        <span style={infoValueStyle}>{form.ho_ten}</span>
                    </div>

                    <div style={infoRowStyle}>
                        <span style={infoLabelStyle}>Số điện thoại:</span>
                        <span style={infoValueStyle}>{form.so_dien_thoai}</span>
                    </div>

                    <button
                        onClick={() => setDangChinhSua(true)}
                        style={buttonStyle}
                    >
                        CHỈNH SỬA THÔNG TIN
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>
                    {daKhaiBao ? 'CHỈNH SỬA THÔNG TIN' : 'CẬP NHẬT THÔNG TIN'}
                </h2>

                <label style={labelStyle}>Mã căn hộ:</label>
                <select
                    name="so_phong"
                    value={form.so_phong}
                    onChange={handleChange}
                    style={inputStyle}
                    disabled={daKhaiBao}
                >
                    <option value="">-- Chọn phòng --</option>
                    {danhSachPhong.map((item) => (
                        <option key={item.ma_phong} value={item.ma_phong}>
                            {item.ma_phong}
                        </option>
                    ))}
                </select>

                <label style={labelStyle}>Họ và tên:</label>
                <input
                    type="text"
                    name="ho_ten"
                    placeholder="Nhập tên cư dân..."
                    value={form.ho_ten}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <label style={labelStyle}>Số điện thoại:</label>
                <input
                    type="text"
                    name="so_dien_thoai"
                    placeholder="Ví dụ: 0905123456"
                    value={form.so_dien_thoai}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <div style={actionWrapStyle}>
                    {daKhaiBao && (
                        <button
                            onClick={() => setDangChinhSua(false)}
                            style={secondaryButtonStyle}
                            disabled={saving}
                        >
                            HỦY
                        </button>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            ...buttonStyle,
                            opacity: saving ? 0.6 : 1,
                            cursor: saving ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {saving ? 'Đang lưu...' : 'XÁC NHẬN LƯU'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const containerStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
};

const cardStyle = {
    width: '100%',
    maxWidth: '560px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '25px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const titleStyle = {
    textAlign: 'center',
    color: '#8b5e5e',
    marginBottom: '10px'
};

const labelStyle = {
    fontWeight: 'bold',
    color: '#444'
};

const inputStyle = {
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    outline: 'none',
    fontSize: '15px'
};

const buttonStyle = {
    marginTop: '12px',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#9b6b6b',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px'
};

const secondaryButtonStyle = {
    marginTop: '12px',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#888',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px'
};

const actionWrapStyle = {
    display: 'flex',
    gap: '10px'
};

const loadingStyle = {
    padding: '20px',
    textAlign: 'center',
    color: '#666'
};

const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: '#f7f7f7'
};

const infoLabelStyle = {
    fontWeight: 'bold',
    color: '#555'
};

const infoValueStyle = {
    color: '#222'
};