import React, { useEffect, useState } from 'react';
import {
    apiLayDanhSachPhong,
    apiLayTinNhanChung,
    apiGuiTinNhanChung,
    apiLayTinNhanRieng,
    apiGuiTinNhanRiengAdmin
} from '../../api/goi_api';

export default function NhanTin() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const [tab, setTab] = useState('chung');
    const [dsPhong, setDsPhong] = useState([]);
    const [phongDangChon, setPhongDangChon] = useState('');
    const [phongDaChonNhieu, setPhongDaChonNhieu] = useState([]);
    const [dsChung, setDsChung] = useState([]);
    const [dsRieng, setDsRieng] = useState([]);
    const [noiDungChung, setNoiDungChung] = useState('');
    const [noiDungRieng, setNoiDungRieng] = useState('');

    const fetchPhong = async () => {
        try {
            const data = await apiLayDanhSachPhong();
            setDsPhong(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchChung = async () => {
        try {
            const data = await apiLayTinNhanChung();
            setDsChung(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRieng = async (maPhong) => {
        try {
            if (!maPhong) return;
            const data = await apiLayTinNhanRieng(maPhong);
            setDsRieng(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPhong();
        fetchChung();

        const interval = setInterval(() => {
            fetchChung();
            if (phongDangChon) fetchRieng(phongDangChon);
        }, 3000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phongDangChon]);

    const handleGuiChung = async () => {
        if (!noiDungChung.trim()) return;

        try {
            await apiGuiTinNhanChung({
                id_nguoi_gui: user.id,
                noi_dung: noiDungChung.trim()
            });
            setNoiDungChung('');
            fetchChung();
        } catch (error) {
            alert(error.response?.data?.message || 'Gửi thất bại!');
        }
    };

    const handleGuiRieng = async () => {
        if (!noiDungRieng.trim()) return;
        if (phongDaChonNhieu.length === 0) return alert('Vui lòng chọn ít nhất 1 phòng!');

        try {
            await apiGuiTinNhanRiengAdmin({
                id_nguoi_gui: user.id,
                ma_phongs: phongDaChonNhieu,
                noi_dung: noiDungRieng.trim()
            });

            setNoiDungRieng('');

            if (phongDaChonNhieu.length === 1) {
                setPhongDangChon(phongDaChonNhieu[0]);
                fetchRieng(phongDaChonNhieu[0]);
            } else {
                setPhongDangChon('');
                setDsRieng([]);
            }

            alert('Gửi tin nhắn thành công!');
        } catch (error) {
            alert(error.response?.data?.message || 'Gửi thất bại!');
        }
    };

    const togglePhong = async (maPhong) => {
        let next = [...phongDaChonNhieu];

        if (next.includes(maPhong)) {
            next = next.filter((p) => p !== maPhong);
        } else {
            next.push(maPhong);
        }

        setPhongDaChonNhieu(next);

        if (next.length === 1) {
            setPhongDangChon(next[0]);
            fetchRieng(next[0]);
        } else {
            setPhongDangChon('');
            setDsRieng([]);
        }
    };

    const isMine = (item) => {
        return item.vai_tro_nguoi_gui === 'QuanLy';
    };

    const sameSender = (a, b) => {
        if (!a || !b) return false;
        return (
            a.vai_tro_nguoi_gui === b.vai_tro_nguoi_gui &&
            String(a.ten_hien_thi) === String(b.ten_hien_thi)
        );
    };

    const getSenderName = (item) => {
        return item.vai_tro_nguoi_gui === 'QuanLy' ? 'ad' : `Phòng ${item.ten_hien_thi}`;
    };

    const getAvatarText = (item) => {
        return item.vai_tro_nguoi_gui === 'QuanLy' ? 'AD' : String(item.ten_hien_thi);
    };

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderMessages = (list) => {
        if (!list || list.length === 0) {
            return <div style={emptyStyle}>Chưa có tin nhắn</div>;
        }

        return list.map((item, index) => {
            const prev = list[index - 1];
            const next = list[index + 1];

            const mine = isMine(item);
            const showAvatar = !sameSender(prev, item);
            const groupWithPrev = sameSender(prev, item);
            const groupWithNext = sameSender(item, next);

            return (
                <div
                    key={item.id}
                    style={{
                        ...messageRowStyle,
                        justifyContent: mine ? 'flex-end' : 'flex-start',
                        marginTop: groupWithPrev ? 4 : 14
                    }}
                >
                    {!mine && (
                        showAvatar ? (
                            <div style={avatarStyle}>{getAvatarText(item)}</div>
                        ) : (
                            <div style={avatarSpacerStyle} />
                        )
                    )}

                    <div
                        style={{
                            ...messageContentWrapStyle,
                            alignItems: mine ? 'flex-end' : 'flex-start'
                        }}
                    >
                        {showAvatar && (
                            <div style={senderNameStyle}>{getSenderName(item)}</div>
                        )}

                        <div
                            style={{
                                ...bubbleTimeRowStyle,
                                justifyContent: mine ? 'flex-end' : 'flex-start'
                            }}
                        >
                            {mine && (
                                <span style={timeInlineStyle}>{formatTime(item.thoi_gian_gui)}</span>
                            )}

                            <div
                                style={{
                                    ...bubbleStyle,
                                    ...(mine ? myBubbleStyle : otherBubbleStyle),
                                    borderTopLeftRadius: !mine && groupWithPrev ? 8 : 18,
                                    borderBottomLeftRadius: !mine && groupWithNext ? 8 : 18,
                                    borderTopRightRadius: mine && groupWithPrev ? 8 : 18,
                                    borderBottomRightRadius: mine && groupWithNext ? 8 : 18
                                }}
                            >
                                {item.noi_dung}
                            </div>

                            {!mine && (
                                <span style={timeInlineStyle}>{formatTime(item.thoi_gian_gui)}</span>
                            )}
                        </div>
                    </div>

                    {mine && (
                        showAvatar ? (
                            <div style={avatarStyle}>{getAvatarText(item)}</div>
                        ) : (
                            <div style={avatarSpacerStyle} />
                        )
                    )}
                </div>
            );
        });
    };

    return (
        <div style={containerStyle}>
            <div style={topTabStyle}>
                <button onClick={() => setTab('chung')} style={tab === 'chung' ? activeBtnStyle : btnStyle}>
                    Nhắn tin chung
                </button>
                <button onClick={() => setTab('rieng')} style={tab === 'rieng' ? activeBtnStyle : btnStyle}>
                    Nhắn tin riêng
                </button>
            </div>

            {tab === 'chung' ? (
                <div style={chatBoxStyle}>
                    <div style={messagesStyle}>
                        {renderMessages(dsChung)}
                    </div>

                    <div style={inputRowStyle}>
                        <input
                            value={noiDungChung}
                            onChange={(e) => setNoiDungChung(e.target.value)}
                            placeholder="Nhập tin nhắn chung..."
                            style={inputStyle}
                        />
                        <button onClick={handleGuiChung} style={sendBtnStyle}>Gửi</button>
                    </div>
                </div>
            ) : (
                <div style={privateWrapStyle}>
                    <div style={leftStyle}>
                        <h3 style={{ marginTop: 0 }}>Chọn phòng</h3>
                        <div style={roomListStyle}>
                            {dsPhong.map((item) => (
                                <label key={item.ma_phong} style={roomItemStyle}>
                                    <input
                                        type="checkbox"
                                        checked={phongDaChonNhieu.includes(item.ma_phong)}
                                        onChange={() => togglePhong(item.ma_phong)}
                                    />
                                    <span>Phòng {item.ma_phong}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={rightStyle}>
                        <div style={messagesStyle}>
                            {phongDaChonNhieu.length !== 1
                                ? <div style={emptyStyle}>Chọn 1 phòng để xem lịch sử chat riêng. Chọn nhiều phòng để gửi đồng loạt.</div>
                                : renderMessages(dsRieng)}
                        </div>

                        <div style={inputRowStyle}>
                            <input
                                value={noiDungRieng}
                                onChange={(e) => setNoiDungRieng(e.target.value)}
                                placeholder="Nhập tin nhắn riêng..."
                                style={inputStyle}
                            />
                            <button onClick={handleGuiRieng} style={sendBtnStyle}>Gửi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const containerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    height: 'calc(100vh - 230px)',
    minHeight: 0,
    overflow: 'hidden'
};

const topTabStyle = {
    display: 'flex',
    gap: '10px',
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

const chatBoxStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '24px',
    padding: '20px',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gap: '15px',
    minHeight: 0,
    overflow: 'hidden'
};

const privateWrapStyle = {
    flex: 1,
    display: 'flex',
    gap: '20px',
    minHeight: 0,
    overflow: 'hidden'
};

const leftStyle = {
    width: '260px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '24px',
    padding: '20px',
    overflowY: 'auto'
};

const rightStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '24px',
    padding: '20px',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gap: '15px',
    minHeight: 0,
    overflow: 'hidden'
};

const roomListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '100%'
};

const roomItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const messagesStyle = {
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '6px'
};

const messageRowStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
    flexShrink: 0
};

const messageContentWrapStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '72%'
};

const senderNameStyle = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#8b5e5e',
    marginBottom: '4px',
    paddingLeft: '4px',
    paddingRight: '4px'
};

const bubbleTimeRowStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px'
};

const bubbleStyle = {
    padding: '12px 14px',
    wordBreak: 'break-word',
    lineHeight: 1.45,
    fontSize: '15px'
};

const myBubbleStyle = {
    background: '#9b6b6b',
    color: '#fff'
};

const otherBubbleStyle = {
    background: '#f3f3f3',
    color: '#222'
};

const timeInlineStyle = {
    fontSize: '11px',
    color: '#888',
    whiteSpace: 'nowrap',
    marginBottom: '4px'
};

const avatarStyle = {
    width: '34px',
    height: '34px',
    minWidth: '34px',
    borderRadius: '50%',
    background: '#d7b3b3',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    overflow: 'hidden'
};

const avatarSpacerStyle = {
    width: '34px',
    minWidth: '34px'
};

const inputRowStyle = {
    display: 'flex',
    gap: '10px',
    flexShrink: 0
};

const inputStyle = {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #ddd',
    outline: 'none'
};

const sendBtnStyle = {
    padding: '14px 22px',
    borderRadius: '12px',
    border: 'none',
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
    textAlign: 'center'
};