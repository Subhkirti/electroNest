const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, 
  waitForConnections: true,
  queueLimit: 0,
  idleTimeoutMillis: 30000, 
});

connection.on("error", (err) => {
  console.error("Database error:", err);
});


module.exports = connection;
