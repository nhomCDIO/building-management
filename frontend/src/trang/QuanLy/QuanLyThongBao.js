import React, { useEffect, useState } from 'react';
import { apiLayThongBao, apiGuiThongBao } from '../../api/goi_api';

export default function QuanLyThongBao() {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');

    const [tab, setTab] = useState('khung');
    const [dsThongBao, setDsThongBao] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        tieu_de: '',
        noi_dung: ''
    });

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

    const handleGui = async () => {
        if (!user || !user.id) {
            return alert('Phiên đăng nhập không hợp lệ. Bạn hãy đăng nhập lại!');
        }

        if (!form.tieu_de.trim() || !form.noi_dung.trim()) {
            return alert('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
        }

        try {
            const data = await apiGuiThongBao({
                id_nguoi_gui: user.id,
                tieu_de: form.tieu_de.trim(),
                noi_dung: form.noi_dung.trim()
            });

            alert(data.message);

            setForm({
                tieu_de: '',
                noi_dung: ''
            });

            setTab('khung');
            fetchThongBao();
        } catch (error) {
            console.error('Lỗi gửi thông báo:', error);
            alert(error.response?.data?.message || 'Gửi thông báo thất bại!');
        }
    };

    return (
        <div style={containerStyle}>
            <div style={tabWrapStyle}>
                <button
                    onClick={() => setTab('khung')}
                    style={tab === 'khung' ? activeBtnStyle : btnStyle}
                >
                    Khung thông báo
                </button>

                <button
                    onClick={() => setTab('gui')}
                    style={tab === 'gui' ? activeBtnStyle : btnStyle}
                >
                    Gửi thông báo
                </button>
            </div>

            <div style={mainStyle}>
                {tab === 'khung' ? (
                    loading ? (
                        <div style={emptyStyle}>Đang tải thông báo...</div>
                    ) : dsThongBao.length === 0 ? (
                        <div style={emptyStyle}>Chưa có thông báo nào.</div>
                    ) : (
                        <div style={listStyle}>
                            {dsThongBao.map((item) => (
                                <div key={item.id} style={itemStyle}>
                                    <div style={itemTopStyle}>
                                        <div style={itemTitleStyle}>{item.tieu_de}</div>
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
                            ))}
                        </div>
                    )
                ) : (
                    <div style={formWrapStyle}>
                        <input
                            value={form.tieu_de}
                            onChange={(e) => setForm({ ...form, tieu_de: e.target.value })}
                            placeholder="Tiêu đề thông báo..."
                            style={inputStyle}
                        />

                        <textarea
                            value={form.noi_dung}
                            onChange={(e) => setForm({ ...form, noi_dung: e.target.value })}
                            placeholder="Nội dung thông báo chi tiết..."
                            style={textareaStyle}
                        />

                        <div style={actionStyle}>
                            <button onClick={handleGui} style={sendBtnStyle}>
                                Gửi ngay
                            </button>
                        </div>
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

const tabWrapStyle = {
    display: 'flex',
    gap: '12px',
    flexShrink: 0
};

const btnStyle = {
    padding: '12px 18px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer'
};

const activeBtnStyle = {
    ...btnStyle,
    backgroundColor: '#9b6b6b',
    color: '#fff',
    fontWeight: 'bold'
};

const mainStyle = {
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

const formWrapStyle = {
    height: '100%',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gap: '14px',
    minHeight: 0
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box'
};

const textareaStyle = {
    width: '100%',
    minHeight: 0,
    height: '100%',
    padding: '14px',
    borderRadius: '14px',
    border: 'none',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box'
};

const actionStyle = {
    display: 'flex',
    justifyContent: 'flex-end'
};

const sendBtnStyle = {
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#9b6b6b',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const emptyStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontSize: '20px'
};