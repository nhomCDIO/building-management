import React, { useEffect, useState } from 'react';
import {
    apiBaoCaoCuDan,
    apiBaoCaoBaoTri,
    apiBaoCaoTaiChinh,
    apiBaoCaoPhuongTien
} from '../../api/goi_api';

export default function BaoCaoThongKe() {
    const now = new Date();

    const [tab, setTab] = useState('tai-chinh');
    const [thang, setThang] = useState(now.getMonth() + 1);
    const [nam, setNam] = useState(now.getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            let result = null;

            if (tab === 'tai-chinh') {
                result = await apiBaoCaoTaiChinh(thang, nam);
            } else if (tab === 'phuong-tien') {
                result = await apiBaoCaoPhuongTien();
            } else if (tab === 'bao-tri') {
                result = await apiBaoCaoBaoTri(thang, nam);
            } else if (tab === 'cu-dan') {
                result = await apiBaoCaoCuDan();
            }

            setData(result);
        } catch (error) {
            console.error('Lỗi tải báo cáo:', error);
            alert(error.response?.data?.message || 'Không thể tải dữ liệu báo cáo!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, thang, nam]);

    const renderContent = () => {
        if (loading) {
            return <div style={emptyStyle}>Đang tải dữ liệu...</div>;
        }

        if (!data) {
            return <div style={emptyStyle}>Chưa có dữ liệu thống kê</div>;
        }

        if (tab === 'tai-chinh') {
            return (
                <div style={contentWrapStyle}>
                    <h2 style={titleStyle}>BÁO CÁO TÀI CHÍNH</h2>
                    <div style={gridStyle}>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Tổng đã thu</div>
                            <div style={valueStyle}>{Number(data.tong_da_thu || 0).toLocaleString('vi-VN')} VNĐ</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Phòng đã thanh toán</div>
                            <div style={valueStyle}>{data.so_phong_da_thanh_toan}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Phòng chưa thanh toán</div>
                            <div style={valueStyle}>{data.so_phong_chua_thanh_toan}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Tổng số phòng</div>
                            <div style={valueStyle}>{data.tong_phong}</div>
                        </div>
                    </div>
                </div>
            );
        }

        if (tab === 'phuong-tien') {
            return (
                <div style={contentWrapStyle}>
                    <h2 style={titleStyle}>BÁO CÁO PHƯƠNG TIỆN</h2>
                    <div style={gridStyle}>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Số hộ đăng ký</div>
                            <div style={valueStyle}>{data.so_ho_dang_ky}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Tổng phương tiện</div>
                            <div style={valueStyle}>{data.tong_phuong_tien}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Tổng xe máy</div>
                            <div style={valueStyle}>{data.tong_xe_may}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Tổng ô tô</div>
                            <div style={valueStyle}>{data.tong_o_to}</div>
                        </div>
                    </div>
                </div>
            );
        }

        if (tab === 'bao-tri') {
            return (
                <div style={contentWrapStyle}>
                    <h2 style={titleStyle}>BÁO CÁO BẢO TRÌ</h2>
                    <div style={gridStyle}>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Tổng yêu cầu</div>
                            <div style={valueStyle}>{data.tong_yeu_cau}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Chưa thực hiện</div>
                            <div style={valueStyle}>{data.chua_thuc_hien}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Đang thực hiện</div>
                            <div style={valueStyle}>{data.dang_thuc_hien}</div>
                        </div>
                        <div style={cardStyle}>
                            <div style={labelStyle}>Đã hoàn thành</div>
                            <div style={valueStyle}>{data.da_hoan_thanh}</div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div style={contentWrapStyle}>
                <h2 style={titleStyle}>BÁO CÁO CƯ DÂN</h2>
                <div style={gridStyle}>
                    <div style={cardStyle}>
                        <div style={labelStyle}>Tổng số phòng</div>
                        <div style={valueStyle}>{data.tong_phong}</div>
                    </div>
                    <div style={cardStyle}>
                        <div style={labelStyle}>Phòng có người</div>
                        <div style={valueStyle}>{data.phong_co_nguoi}</div>
                    </div>
                    <div style={cardStyle}>
                        <div style={labelStyle}>Phòng trống</div>
                        <div style={valueStyle}>{data.phong_trong}</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={containerStyle}>
            <div style={leftStyle}>
                <button
                    onClick={() => setTab('tai-chinh')}
                    style={tab === 'tai-chinh' ? activeMenuStyle : menuStyle}
                >
                    Tài chính
                </button>

                <button
                    onClick={() => setTab('phuong-tien')}
                    style={tab === 'phuong-tien' ? activeMenuStyle : menuStyle}
                >
                    Phương tiện
                </button>

                <button
                    onClick={() => setTab('bao-tri')}
                    style={tab === 'bao-tri' ? activeMenuStyle : menuStyle}
                >
                    Bảo trì
                </button>

                <button
                    onClick={() => setTab('cu-dan')}
                    style={tab === 'cu-dan' ? activeMenuStyle : menuStyle}
                >
                    Cư dân
                </button>
            </div>

            <div style={rightStyle}>
                {(tab === 'tai-chinh' || tab === 'bao-tri') && (
                    <div style={filterStyle}>
                        <select value={thang} onChange={(e) => setThang(Number(e.target.value))} style={selectStyle}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <option key={m} value={m}>Tháng {m}</option>
                            ))}
                        </select>

                        <select value={nam} onChange={(e) => setNam(Number(e.target.value))} style={selectStyle}>
                            {[2025, 2026, 2027, 2028].map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                )}

                {renderContent()}
            </div>
        </div>
    );
}

const containerStyle = {
    flex: 1,
    display: 'flex',
    gap: '20px',
    height: '100%'
};

const leftStyle = {
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
};

const menuStyle = {
    padding: '18px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
    color: '#333'
};

const activeMenuStyle = {
    ...menuStyle,
    background: '#9b6b6b',
    color: '#fff'
};

const rightStyle = {
    flex: 1,
    background: 'rgba(255,255,255,0.94)',
    borderRadius: '26px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
};

const filterStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginBottom: '16px'
};

const selectStyle = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    outline: 'none'
};

const contentWrapStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
};

const titleStyle = {
    marginTop: 0,
    marginBottom: '18px',
    color: '#8b5e5e',
    textTransform: 'uppercase'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
};

const cardStyle = {
    background: '#f8f8f8',
    borderRadius: '18px',
    padding: '22px',
    minHeight: '110px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
};

const labelStyle = {
    fontSize: '15px',
    color: '#666',
    marginBottom: '8px'
};

const valueStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#222'
};

const emptyStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#999',
    fontSize: '20px'
};