import React, { useEffect, useState } from 'react';
import { apiLayBaoTriAdmin, apiCapNhatBaoTri } from '../../api/goi_api';

export default function QuanLyBaoTri() {
    const now = new Date();

    const [ngay, setNgay] = useState(now.getDate());
    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam] = useState(now.getFullYear());

    const [dsBaoTri, setDsBaoTri] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemDangChon, setItemDangChon] = useState(null);
    const [form, setForm] = useState({
        trang_thai: 'ChuaThucHien',
        ghi_chu_admin: ''
    });

    const fetchDsBaoTri = async () => {
        try {
            setLoading(true);
            const data = await apiLayBaoTriAdmin(ngay, thang, nam);
            setDsBaoTri(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Lỗi lấy bảo trì admin:', error);
            alert(error.response?.data?.message || 'Không thể tải dữ liệu bảo trì!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDsBaoTri();
        setItemDangChon(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ngay, thang, nam]);

    const handleChon = (item) => {
        setItemDangChon(item);
        setForm({
            trang_thai: item.trang_thai,
            ghi_chu_admin: item.ghi_chu_admin || ''
        });
    };

    const handleCapNhat = async () => {
        if (!itemDangChon) return;

        try {
            const data = await apiCapNhatBaoTri({
                id: itemDangChon.id,
                trang_thai: form.trang_thai,
                ghi_chu_admin: form.ghi_chu_admin
            });

            alert(data.message);
            fetchDsBaoTri();
        } catch (error) {
            console.error('Lỗi cập nhật bảo trì:', error);
            alert(error.response?.data?.message || 'Cập nhật thất bại!');
        }
    };

    const hienThiTrangThai = (trangThai) => {
        if (trangThai === 'ChuaThucHien') return 'Chưa thực hiện';
        if (trangThai === 'DangThucHien') return 'Đang thực hiện';
        return 'Đã hoàn thành';
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div />
                <div style={{ display: 'flex', gap: '10px' }}>
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
            </div>

            <div style={mainStyle}>
                <div style={leftStyle}>
                    {loading ? (
                        <div style={emptyStyle}>Đang tải dữ liệu...</div>
                    ) : dsBaoTri.length === 0 ? (
                        <div style={emptyStyle}>Không có yêu cầu nào</div>
                    ) : (
                        <div style={listStyle}>
                            {dsBaoTri.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleChon(item)}
                                    style={{
                                        ...itemStyle,
                                        border: itemDangChon?.id === item.id ? '2px solid #9b6b6b' : '2px solid transparent',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={itemTitleStyle}>
                                        Phòng {item.ma_phong} - {item.tieu_de}
                                    </div>
                                    <div style={itemDescStyle}>{item.mo_ta}</div>
                                    <div style={itemMetaStyle}>
                                        {hienThiTrangThai(item.trang_thai)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={rightStyle}>
                    {!itemDangChon ? (
                        <div style={emptyStyle}>Chọn một yêu cầu ở bên trái để cập nhật.</div>
                    ) : (
                        <div style={detailScrollStyle}>
                            <h2 style={titleStyle}>CẬP NHẬT BẢO TRÌ</h2>

                            <div style={detailBoxStyle}>
                                <p><b>Phòng:</b> {itemDangChon.ma_phong}</p>
                                <p><b>Tiêu đề:</b> {itemDangChon.tieu_de}</p>
                                <p><b>Mô tả:</b> {itemDangChon.mo_ta}</p>
                            </div>

                            <label style={labelStyle}>Trạng thái:</label>
                            <select
                                value={form.trang_thai}
                                onChange={(e) => setForm({ ...form, trang_thai: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="ChuaThucHien">Chưa thực hiện</option>
                                <option value="DangThucHien">Đang thực hiện</option>
                                <option value="DaHoanThanh">Đã hoàn thành</option>
                            </select>

                            <label style={labelStyle}>Ghi chú admin:</label>
                            <textarea
                                value={form.ghi_chu_admin}
                                onChange={(e) => setForm({ ...form, ghi_chu_admin: e.target.value })}
                                style={textareaStyle}
                                placeholder="Nhập ghi chú xử lý..."
                            />

                            <button onClick={handleCapNhat} style={buttonStyle}>
                                CẬP NHẬT
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const containerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 230px)',
    minHeight: 0,
    overflow: 'hidden'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px',
    flexShrink: 0
};

const selectStyle = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: 'none',
    outline: 'none'
};

const mainStyle = {
    flex: 1,
    display: 'flex',
    gap: '20px',
    minHeight: 0,
    overflow: 'hidden'
};

const leftStyle = {
    width: '430px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '25px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden'
};

const rightStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '25px',
    padding: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    minHeight: 0,
    overflow: 'hidden'
};

const listStyle = {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    overflowX: 'hidden',
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
    color: '#777'
};

const detailScrollStyle = {
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 0,
    paddingRight: '4px',
    boxSizing: 'border-box'
};

const titleStyle = {
    textAlign: 'center',
    color: '#8b5e5e',
    marginTop: 0
};

const detailBoxStyle = {
    background: '#f8f8f8',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '14px',
    lineHeight: 1.8
};

const labelStyle = {
    fontWeight: 'bold',
    color: '#444',
    display: 'block',
    marginBottom: '6px'
};

const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    outline: 'none',
    marginBottom: '14px',
    boxSizing: 'border-box'
};

const textareaStyle = {
    width: '100%',
    minHeight: '120px',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box'
};

const buttonStyle = {
    marginTop: '16px',
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#9b6b6b',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const emptyStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#aaa',
    fontSize: '18px',
    textAlign: 'center'
};