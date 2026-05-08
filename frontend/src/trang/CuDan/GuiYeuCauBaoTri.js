import React, { useEffect, useState } from 'react';
import { apiGuiBaoTri, apiLayBaoTriCuDan } from '../../api/goi_api';

export default function GuiYeuCauBaoTri() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const now = new Date();

    const [ngay, setNgay] = useState(now.getDate());
    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam] = useState(now.getFullYear());

    const [form, setForm] = useState({
        tieu_de: '',
        mo_ta: ''
    });

    const [dsBaoTri, setDsBaoTri] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDsBaoTri = async () => {
        try {
            if (!user?.so_phong) {
                setDsBaoTri([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const data = await apiLayBaoTriCuDan(user.so_phong, ngay, thang, nam);
            setDsBaoTri(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Lỗi lấy bảo trì cư dân:', error);
            alert(error.response?.data?.message || 'Không thể tải lịch sử bảo trì!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDsBaoTri();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ngay, thang, nam]);

    const handleGui = async () => {
        if (!form.tieu_de.trim() || !form.mo_ta.trim()) {
            return alert('Vui lòng nhập đầy đủ tiêu đề và mô tả!');
        }

        try {
            const data = await apiGuiBaoTri({
                ma_phong: user.so_phong,
                tieu_de: form.tieu_de.trim(),
                mo_ta: form.mo_ta.trim()
            });

            alert(data.message);
            setForm({ tieu_de: '', mo_ta: '' });
            fetchDsBaoTri();
        } catch (error) {
            console.error('Lỗi gửi bảo trì:', error);
            alert(error.response?.data?.message || 'Gửi yêu cầu bảo trì thất bại!');
        }
    };

    const hienThiTrangThai = (trangThai) => {
        if (trangThai === 'ChuaThucHien') return 'Chưa thực hiện';
        if (trangThai === 'DangThucHien') return 'Đang thực hiện';
        return 'Đã hoàn thành';
    };

    return (
        <div style={containerStyle}>
            <div style={leftStyle}>
                <div style={leftInnerStyle}>
                    <div style={roomBoxStyle}>
                        MÃ SỐ PHÒNG
                        <div style={roomValueStyle}>{user.so_phong}</div>
                    </div>

                    <label style={labelStyle}>Tiêu đề sự cố:</label>
                    <input
                        value={form.tieu_de}
                        onChange={(e) => setForm({ ...form, tieu_de: e.target.value })}
                        placeholder="VD: Hỏng bóng đèn, tắc bồn rửa..."
                        style={inputStyle}
                    />

                    <label style={labelStyle}>Mô tả chi tiết:</label>
                    <textarea
                        value={form.mo_ta}
                        onChange={(e) => setForm({ ...form, mo_ta: e.target.value })}
                        placeholder="Mô tả cụ thể tình trạng hoặc vị trí sự cố..."
                        style={textareaStyle}
                    />

                    <button onClick={handleGui} style={buttonStyle}>
                        XÁC NHẬN GỬI
                    </button>
                </div>
            </div>

            <div style={rightStyle}>
                <div style={topRightStyle}>
                    <select value={ngay} onChange={(e) => setNgay(Number(e.target.value))} style={selectStyle}>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>Ngày {d}</option>
                        ))}
                    </select>

                    <select value={thang} onChange={(e) => setThang(Number(e.target.value))} style={selectStyle}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>Tháng {m}</option>
                        ))}
                    </select>
                </div>

                <h2 style={titleStyle}>LỊCH SỬ GỬI HÔM NAY</h2>

                {loading ? (
                    <div style={emptyStyle}>Đang tải dữ liệu...</div>
                ) : dsBaoTri.length === 0 ? (
                    <div style={emptyStyle}>Trống</div>
                ) : (
                    <div style={listStyle}>
                        {dsBaoTri.map((item) => (
                            <div key={item.id} style={itemStyle}>
                                <div style={itemTitleStyle}>{item.tieu_de}</div>
                                <div style={itemDescStyle}>{item.mo_ta}</div>
                                <div style={itemMetaStyle}>
                                    Trạng thái: {hienThiTrangThai(item.trang_thai)}
                                </div>
                                {item.ghi_chu_admin && (
                                    <div style={itemMetaStyle}>Ghi chú admin: {item.ghi_chu_admin}</div>
                                )}
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
    display: 'grid',
    gridTemplateColumns: '410px 1fr',
    gap: '20px',
    height: 'calc(100vh - 230px)',
    minHeight: 0,
    overflow: 'hidden'
};

const leftStyle = {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '25px',
    padding: '30px',
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden'
};

const leftInnerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const rightStyle = {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '25px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden'
};

const roomBoxStyle = {
    textAlign: 'center',
    border: '2px dashed #9b6b6b',
    borderRadius: '18px',
    padding: '18px',
    color: '#9b6b6b',
    fontWeight: 'bold'
};

const roomValueStyle = {
    fontSize: '40px',
    color: '#222',
    marginTop: '8px'
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
    boxSizing: 'border-box'
};

const textareaStyle = {
    minHeight: '120px',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box'
};

const buttonStyle = {
    marginTop: '12px',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#9b6b6b',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const topRightStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginBottom: '14px',
    flexShrink: 0
};

const selectStyle = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    outline: 'none'
};

const titleStyle = {
    textAlign: 'center',
    color: '#8b5e5e',
    marginTop: 0,
    marginBottom: '16px',
    flexShrink: 0
};

const listStyle = {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '6px'
};

const itemStyle = {
    background: '#f8f8f8',
    borderRadius: '14px',
    padding: '16px',
    flexShrink: 0
};

const itemTitleStyle = {
    fontWeight: 'bold',
    color: '#222',
    marginBottom: '6px'
};

const itemDescStyle = {
    color: '#555',
    marginBottom: '8px',
    lineHeight: 1.5
};

const itemMetaStyle = {
    fontSize: '13px',
    color: '#777',
    lineHeight: 1.5
};

const emptyStyle = {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#aaa',
    fontSize: '20px',
    textAlign: 'center'
};