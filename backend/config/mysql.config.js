const mysql = require('mysql2/promise');
require('dotenv').config();

// Imprimimos el puerto en consola para estar 100% seguros de qué está leyendo
console.log(`🔌 Intentando conectar a MySQL en host: ${process.env.DB_HOST}, puerto: ${process.env.DB_PORT}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3308,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;