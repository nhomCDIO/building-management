import React, { useEffect, useState } from 'react';
import {
    apiLayPhuongTienTheoPhong,
    apiThemPhuongTien,
    apiXoaPhuongTien
} from '../../api/goi_api';

export default function QuanLyPhuongTienCuDan() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const [dsXe, setDsXe] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        loai_xe: '',
        bien_so: ''
    });

    const fetchDsXe = async () => {
    try {
        console.log('User hiện tại:', user);
        console.log('so_phong gửi lên:', user?.so_phong);

        if (!user?.so_phong) {
            setDsXe([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const data = await apiLayPhuongTienTheoPhong(user.so_phong);
        console.log('Dữ liệu xe trả về:', data);

        setDsXe(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Lỗi lấy danh sách xe:', error);
        console.log('error.response:', error.response);
        console.log('error.message:', error.message);
        alert(error.response?.data?.message || error.message || 'Không thể tải danh sách phương tiện!');
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
    fetchDsXe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

    const handleThemXe = async () => {
        if (!user?.so_phong) {
            return alert('Bạn chưa có số phòng!');
        }

        if (!form.loai_xe || !form.bien_so.trim()) {
            return alert('Vui lòng nhập đầy đủ loại xe và biển số!');
        }

        try {
            const data = await apiThemPhuongTien({
                ma_phong: user.so_phong,
                loai_xe: form.loai_xe,
                bien_so: form.bien_so.trim()
            });

            alert(data.message);
            setForm({ loai_xe: '', bien_so: '' });
            fetchDsXe();
        } catch (error) {
            console.error('Lỗi thêm xe:', error);
            const msg = error.response?.data?.message || 'Thêm phương tiện thất bại!';
            alert(msg);
        }
    };

    const handleXoaXe = async (id) => {
        const ok = window.confirm('Bạn có chắc muốn xóa phương tiện này không?');
        if (!ok) return;

        try {
            const data = await apiXoaPhuongTien(id, {
                ma_phong: user.so_phong
            });

            alert(data.message);
            fetchDsXe();
        } catch (error) {
            console.error('Lỗi xóa xe:', error);
            const msg = error.response?.data?.message || 'Xóa phương tiện thất bại!';
            alert(msg);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={leftStyle}>
                <div style={boxTitleStyle}>ĐĂNG KÝ MỚI</div>

                <label style={labelStyle}>Loại xe:</label>
                <select
                    value={form.loai_xe}
                    onChange={(e) => setForm({ ...form, loai_xe: e.target.value })}
                    style={inputStyle}
                >
                    <option value="">-- Chọn loại xe --</option>
                    <option value="XeMay">Xe máy</option>
                    <option value="Oto">Ô tô</option>
                    <option value="Khac">Khác</option>
                </select>

                <label style={labelStyle}>Biển số xe:</label>
                <input
                    type="text"
                    value={form.bien_so}
                    onChange={(e) => setForm({ ...form, bien_so: e.target.value })}
                    placeholder="VD: 43-K1 123.45"
                    style={inputStyle}
                />

                <button onClick={handleThemXe} style={buttonStyle}>
                    THÊM PHƯƠNG TIỆN
                </button>
            </div>

            <div style={rightStyle}>
                <h2 style={rightTitleStyle}>PHƯƠNG TIỆN ĐÃ ĐĂNG KÝ</h2>

                {loading ? (
                    <div style={emptyStyle}>Đang tải dữ liệu...</div>
                ) : dsXe.length === 0 ? (
                    <div style={emptyStyle}>Chưa có xe nào</div>
                ) : (
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

                                <button
                                    onClick={() => handleXoaXe(xe.id)}
                                    style={deleteBtnStyle}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const containerStyle = {
    flex: 1,
    display: 'flex',
    gap: '25px',
    height: '100%'
};

const leftStyle = {
    width: '420px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '25px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const rightStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '25px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column'
};

const boxTitleStyle = {
    textAlign: 'center',
    padding: '14px',
    borderRadius: '16px',
    border: '2px dashed #9b6b6b',
    color: '#9b6b6b',
    fontWeight: 'bold',
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
    marginTop: '10px',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#9b6b6b',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer'
};

const rightTitleStyle = {
    textAlign: 'center',
    color: '#8b5e5e',
    marginTop: 0,
    marginBottom: '20px'
};

const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto'
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

const deleteBtnStyle = {
    border: 'none',
    borderRadius: '10px',
    padding: '10px 18px',
    background: '#b85c5c',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const emptyStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#aaa',
    fontSize: '20px'
};