

    const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'detai2',
    password: 'Lengocson2011@',
    database: 'building_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function kiemTraKetNoi() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Kết nối MySQL thành công!');
        connection.release();
    } catch (error) {
        console.error('❌ Lỗi kết nối MySQL:', error.message);
    }
}

kiemTraKetNoi();

module.exports = pool;