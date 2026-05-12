import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TrangChu.css';

import imgQuanLyMockup from '../assets/dashboard_admin.png';
import imgCuDanMockup from '../assets/app_resident.png';

export default function TrangChu() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* 1. HEADER */}
            <header className="header-fixed" style={styles.header}>
                <div style={styles.logo}>A&RMS</div>
                <nav style={styles.nav}>
                    <a href="#ve-chung-toi" className="nav-item">Về chúng tôi</a>
                    <a href="#tinh-nang" className="nav-item">Tính năng</a>
                    <button onClick={() => navigate('/auth')} className="login-button">Đăng nhập</button>
                </nav>
            </header>

            {/* 2. HERO SECTION */}
            <section className="hero-background-fix">
                <div className="hero-overlay-dark"></div>
                <div className="hero-content-container">
                    <div style={styles.heroText}>
                        <h1 style={styles.heroTitle}>Hệ thống quản lý chung cư thông minh A&RMS</h1>
                        <p style={styles.heroSubtitle}>
                            Giải pháp tổng thể giúp số hóa quy trình quản lý, vận hành tòa nhà, mang lại trải nghiệm tiện ích cho cư dân.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION: KẾT QUẢ KHÁCH HÀNG */}
            <section style={styles.resultsSection}>
                <div style={styles.resultsHeader}>
                    <h2 style={styles.resultsMainTitle}>Kết quả khách hàng của chúng tôi nhận được</h2>
                    <p style={styles.resultsSubtitle}>
                        Hệ sinh thái số có khả năng liên kết tới những phần mềm, thiết bị gia đình thông minh và 
                        các giải pháp công nghệ hữu ích khác nhằm đem lại trải nghiệm hoàn toàn khác biệt trong 
                        công tác quản lý khu đô thị của các Chủ đầu tư và Công ty quản lý.
                    </p>
                </div>

                <div style={styles.resultsGrid}>
                    {/* Khối 1 */}
                    <div style={styles.resultCard}>
                        <div style={styles.resultIcon}>🖐️</div>
                        <h3 style={styles.resultCardTitle}>Tài chính minh bạch</h3>
                        <p style={styles.resultCardDesc}>
                            Thông tin lưu trữ, mẫu thông báo được hệ thống hóa, thuận tiện cho việc quản lý, theo dõi và kiểm tra.
                        </p>
                        <div style={styles.clientLogo}></div>
                    </div>

                    {/* Khối 2 */}
                    <div style={styles.resultCard}>
                        <div style={styles.resultIcon}>🚀</div>
                        <h3 style={styles.resultCardTitle}>Tối ưu nguồn lực</h3>
                        <p style={styles.resultCardDesc}>
                            Số hóa quản lý giúp quản lý hiệu quả về tài chính, hệ thống kỹ thuật và kế hoạch bảo trì, bảo dưỡng của chung cư.
                        </p>
                        <div style={styles.clientLogo}></div>
                    </div>

                    {/* Khối 3 */}
                    <div style={styles.resultCard}>
                        <div style={styles.resultIcon}>📊</div>
                        <h3 style={styles.resultCardTitle}>Cập nhật thông tin nhanh chóng</h3>
                        <p style={styles.resultCardDesc}>
                            Ứng dụng thông minh trên điện thoại là một kênh tương tác giúp cư dân phản ánh chất lượng dịch vụ, cập nhật thông tin cần thiết.
                        </p>
                        <div style={styles.clientLogo}></div>
                    </div>
                </div>
            </section>


            {/* 3. SECTION: DÀNH CHO BAN QUẢN LÝ */}
            <section id="tinh-nang" style={styles.featureSection}>
                <div style={styles.featureContent}>
                    <h2 style={styles.sectionTitle}>Hệ thống dành cho Ban Quản Lý</h2>
                    <div style={styles.featureItem}>
                        <div style={{...styles.iconBox, backgroundColor: '#4e73df'}}>📊</div>
                        <div>
                            <h3 style={styles.featureTitle}>Số hóa quản lý</h3>
                            <p style={styles.featureDesc}>Chuẩn hóa dữ liệu, tối ưu hóa tính phí và thanh toán trực tuyến.</p>
                        </div>
                    </div>
                    <div style={styles.featureItem}>
                        <div style={{...styles.iconBox, backgroundColor: '#1cc88a'}}>😊</div>
                        <div>
                            <h3 style={styles.featureTitle}>Nâng cao sự hài lòng</h3>
                            <p style={styles.featureDesc}>Tiếp nhận và xử lý yêu cầu bảo trì của cư dân minh bạch.</p>
                        </div>
                    </div>
                </div>
                <img src={imgQuanLyMockup} alt="Quản lý" style={styles.mockupImage} />
            </section>

            {/* SECTION: THÔNG TIN CHUNG */}
            <section id="tin-tuc" style={styles.newsSection}>
                <div style={styles.newsHeader}>
                    <h2 style={styles.newsMainTitle}>Thông tin chung</h2>
                    <div style={styles.newsTitleUnderline}></div>
                </div>

                <div style={styles.newsGrid}>
                    {/* Bài viết 1: Sửa dòng này để thêm onClick chuyển sang trang lịch cúp điện */}
                    <div 
                        className="news-card-hover" 
                        style={styles.newsCard} 
                        onClick={() => navigate('/lich-cup-dien')}
                    >
                        <div className="news-header-box" style={{...styles.newsImage, backgroundColor: '#800000'}}>
                            <span style={styles.newsDateBadge}>Thông tin chung</span>
                        </div>
                        <div style={styles.newsContent}>
                            <h3 style={styles.newsTitle}>THÔNG BÁO LỊCH CÚP ĐIỆN THÁNG 5/2026</h3>
                            <p style={styles.newsDesc}>Công ty Cổ phần A&RMS xin trân trọng thông báo lịch cúp điện...</p>
                            <div style={styles.newsAuthor}>
                                <div style={styles.authorAvatar}>👤</div>
                                <span>Nguyen Minh Tung</span>
                            </div>
                        </div>
                    </div>

                    {/* Bài viết 2: Thêm className */}
                    <div className="news-card-hover" style={styles.newsCard}>
                        <div className="news-header-box" style={{...styles.newsImage, backgroundColor: '#e67e22'}}>
                            <span style={styles.newsDateBadge}>Cập nhật phiên bản</span>
                        </div>
                        <div style={styles.newsContent}>
                            <h3 style={styles.newsTitle}>CẬP NHẬT TÍNH NĂNG – THÁNG 7 NĂM 2024</h3>
                            <p style={styles.newsDesc}>A&RMS tự hào giới thiệu các tính năng mới và cải tiến vượt trội...</p>
                            <div style={styles.newsAuthor}>
                                <div style={styles.authorAvatar}>👤</div>
                                <span>admin</span>
                            </div>
                        </div>
                    </div>

                    {/* Bài viết 3: Thêm className */}
                    <div className="news-card-hover" style={styles.newsCard}>
                        <div className="news-header-box" style={{...styles.newsImage, backgroundColor: '#3498db'}}>
                            <span style={styles.newsDateBadge}>Giải pháp</span>
                        </div>
                        <div style={styles.newsContent}>
                            <h3 style={styles.newsTitle}>GIẢI PHÁP THANH TOÁN TRỰC TUYẾN CHO CƯ DÂN</h3>
                            <p style={styles.newsDesc}>Chúng tôi phối hợp cùng các kênh thanh toán trực tuyến nâng cấp toàn diện...</p>
                            <div style={styles.newsAuthor}>
                                <div style={styles.authorAvatar}>👤</div>
                                <span>admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SECTION: DÀNH CHO CƯ DÂN */}
            <section style={{...styles.featureSection, flexDirection: 'row-reverse', backgroundColor: '#f8f9fa'}}>
                <div style={styles.featureContent}>
                    <h2 style={styles.sectionTitle}>Tiện ích dành cho Cư dân</h2>
                    <div style={styles.featureItem}>
                        <div style={{...styles.iconBox, backgroundColor: '#f6c23e'}}>💳</div>
                        <div>
                            <h3 style={styles.featureTitle}>Thanh toán trực tuyến</h3>
                            <p style={styles.featureDesc}>Xem chi tiết hóa đơn và thanh toán chỉ với 1 chạm qua App.</p>
                        </div>
                    </div>
                </div>
                <img src={imgCuDanMockup} alt="Cư dân" style={styles.mockupImage} />
            </section>

            {/* 5. SECTION: VỀ CHÚNG TÔI */}
            <section id="ve-chung-toi" style={styles.whySection}>
                <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                    <h2 style={{...styles.sectionTitle, textAlign: 'center', color: '#fff'}}>Tại sao nên dùng A&RMS?</h2>
                    <div style={styles.whyGrid}>
                        <ul style={styles.whyList}>
                            <li>Ứng dụng công nghệ hiện đại, hoạt động mượt mà.</li>
                            <li>Thao tác đơn giản, thân thiện với mọi lứa tuổi.</li>
                            <li>Tính bảo mật cao cho dữ liệu dân cư.</li>
                            <li>Quản lý, giám sát 24/7 không gián đoạn.</li>
                        </ul>
                        <div style={{color: '#fff', fontSize: '100px', opacity: 0.2}}>🏢</div>
                    </div>
                </div>
            </section>

            <footer style={styles.footer}>
                <p>© 2026 A&RMS - Hệ thống quản lý chung cư. All rights reserved.</p>
            </footer>
        </div>
    );
}

// --- BIẾN STYLES ĐÃ ĐƯỢC BỔ SUNG ĐẦY ĐỦ ---
const styles = {
    container: { backgroundColor: '#fff', width: '100%' },
    header: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 50px', height: '80px' 
    },
    logo: { fontSize: '28px', fontWeight: 'bold', color: '#2b579a' },
    nav: { display: 'flex', gap: '25px', alignItems: 'center' },
    navLink: { color: '#333', fontWeight: 'bold', textDecoration: 'none' },

    heroText: { color: '#fff', maxWidth: '700px', textAlign: 'left' },
    heroTitle: { fontSize: '48px', marginBottom: '20px', fontWeight: 'bold', lineHeight: '1.2' },
    heroSubtitle: { fontSize: '20px', marginBottom: '30px', opacity: '0.9' },

    featureSection: { 
        display: 'flex', padding: '100px 50px', alignItems: 'center', 
        justifyContent: 'center', gap: '60px' 
    },
    featureContent: { flex: 1, maxWidth: '550px' },
    sectionTitle: { fontSize: '36px', color: '#1a365d', marginBottom: '40px', fontWeight: 'bold' },
    featureItem: { display: 'flex', gap: '20px', marginBottom: '30px' },
    iconBox: { 
        width: '50px', height: '50px', borderRadius: '12px', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
    },
    featureTitle: { fontSize: '20px', color: '#333', marginBottom: '5px', fontWeight: 'bold' },
    featureDesc: { color: '#666', lineHeight: '1.6' },
    mockupImage: { width: '500px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },

    whySection: { padding: '80px 50px', backgroundColor: '#1a365d' },
    whyGrid: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' },
    whyList: { color: '#fff', fontSize: '18px', lineHeight: '2.5', listStyleType: 'disc', paddingLeft: '20px' },
    footer: { textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', color: '#666' },

    // Thêm vào trong biến styles
    resultsSection: {
        padding: '80px 50px',
        backgroundColor: '#fff',
        textAlign: 'center'
    },
    resultsHeader: {
        maxWidth: '900px',
        margin: '0 auto 50px auto'
    },
    resultsMainTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#000',
        marginBottom: '20px'
    },
    resultsSubtitle: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#666'
    },
    resultsGrid: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap'
    },
    resultCard: {
        backgroundColor: '#0a1d37', // Màu xanh đen đậm như trong ảnh
        color: '#fff',
        padding: '40px 30px',
        borderRadius: '15px',
        width: '350px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px'
    },
    resultIcon: {
        fontSize: '40px',
        marginBottom: '20px',
        color: '#f1c40f' // Màu vàng icon
    },
    resultCardTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px'
    },
    resultCardDesc: {
        fontSize: '15px',
        lineHeight: '1.6',
        flexGrow: 1,
        marginBottom: '30px',
        opacity: '0.9'
    },
    clientLogo: {
        fontWeight: 'bold',
        fontSize: '20px',
        letterSpacing: '2px',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '20px',
        textAlign: 'center'
    },
    newsSection: { padding: '80px 50px', backgroundColor: '#f9f9f9' },
    newsHeader: { textAlign: 'center', marginBottom: '50px' },
    newsMainTitle: { fontSize: '32px', fontWeight: 'bold', color: '#0a1d37' },
    newsTitleUnderline: { width: '60px', height: '4px', backgroundColor: '#2b579a', margin: '15px auto' },
    newsGrid: { display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' },
    newsCard: { 
        width: '350px', 
        backgroundColor: '#fff', 
        borderRadius: '15px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'left'
    },
    newsImage: { height: '200px', width: '100%', position: 'relative' },
    newsDateBadge: { 
        position: 'absolute', bottom: '10px', left: '10px', 
        backgroundColor: '#fff', padding: '5px 12px', borderRadius: '15px',
        fontSize: '12px', fontWeight: 'bold', color: '#333'
    },
    newsContent: { padding: '20px' },
    newsTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#0a1d37' },
    newsDesc: { fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '20px' },
    newsAuthor: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#888' },
    authorAvatar: { width: '30px', height: '30px', backgroundColor: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    newsCard: { 
        width: '350px', 
        backgroundColor: '#fff', 
        borderRadius: '15px', 
        overflow: 'hidden', // Quan trọng để bo góc vùng màu
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'left',
        margin: '10px'
    },
    newsTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        transition: 'color 0.3s ease' // Để màu chữ đổi mượt mà
    },
};