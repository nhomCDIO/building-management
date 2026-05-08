import React, { useState } from 'react';

const ThanhToan = () => {
    const [method, setMethod] = useState('Chuyển khoản');

    const paymentInfo = {
        tongTien: '1,200,000đ',
        noiDung: 'CH A101 THANH TOAN PHI DV T4',
        nganHang: 'Vietcombank',
        stk: '1023456789',
        chuTk: 'CONG TY QUAN LY TOA NHA A&RMS'
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>💳 Thanh toán hóa đơn</h2>
            
            <div style={styles.contentLayout}>
                {/* Cột trái: Thông tin hóa đơn */}
                <div style={styles.infoSection}>
                    <div style={styles.card}>
                        <h3>Tóm tắt đơn hàng</h3>
                        <div style={styles.row}>
                            <span>Phí quản lý:</span>
                            <span>500,000đ</span>
                        </div>
                        <div style={styles.row}>
                            <span>Tiền điện:</span>
                            <span>700,000đ</span>
                        </div>
                        <hr style={styles.hr} />
                        <div style={styles.totalRow}>
                            <span>Tổng cộng:</span>
                            <span style={styles.totalAmount}>{paymentInfo.tongTien}</span>
                        </div>
                    </div>

                    <div style={styles.methodSection}>
                        <h3>Phương thức thanh toán</h3>
                        <div 
                            style={{...styles.methodItem, borderColor: method === 'Chuyển khoản' ? '#4caf50' : '#ddd'}}
                            onClick={() => setMethod('Chuyển khoản')}
                        >
                            <input type="radio" checked={method === 'Chuyển khoản'} readOnly />
                            <span>Chuyển khoản ngân hàng (QR Code)</span>
                        </div>
                        <div 
                            style={{...styles.methodItem, borderColor: method === 'The' ? '#4caf50' : '#ddd'}}
                            onClick={() => setMethod('The')}
                        >
                            <input type="radio" checked={method === 'The'} readOnly />
                            <span>Thẻ ATM / Visa / Mastercard</span>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Mã QR thanh toán */}
                <div style={styles.qrSection}>
                    <div style={styles.qrCard}>
                        <p style={styles.qrText}>Quét mã để thanh toán nhanh</p>
                        <div style={styles.qrPlaceholder}>
                            {/* Vinh có thể thay link ảnh QR thật của bạn vào đây */}
                            <img 
                                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Vietcombank|1023456789|1200000" 
                                alt="QR Thanh toan" 
                                style={styles.qrImage}
                            />
                        </div>
                        <div style={styles.bankDetails}>
                            <p><strong>Ngân hàng:</strong> {paymentInfo.nganHang}</p>
                            <p><strong>STK:</strong> {paymentInfo.stk}</p>
                            <p><strong>Chủ TK:</strong> {paymentInfo.chuTk}</p>
                            <p><strong>Nội dung:</strong> <span style={styles.copyText}>{paymentInfo.noiDung}</span></p>
                        </div>
                        <button style={styles.confirmBtn}>Tôi đã thanh toán</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    title: { marginBottom: '20px', color: '#333' },
    contentLayout: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
    infoSection: { flex: 1.5, display: 'flex', flexDirection: 'column', gap: '20px' },
    qrSection: { flex: 1 },
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666' },
    hr: { border: 'none', borderTop: '1px solid #eee', margin: '15px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' },
    totalAmount: { color: '#d32f2f' },
    methodSection: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    methodItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' },
    qrCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' },
    qrText: { marginBottom: '15px', fontWeight: 'bold', color: '#2e7d32' },
    qrPlaceholder: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px', display: 'inline-block', marginBottom: '15px' },
    qrImage: { width: '200px', height: '200px' },
    bankDetails: { textAlign: 'left', fontSize: '13px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', lineHeight: '1.6' },
    copyText: { color: '#1976d2', fontWeight: 'bold' },
    confirmBtn: { width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default ThanhToan;