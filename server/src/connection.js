const mysql = require("mysql");

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 100, // Number of concurrent connections
  waitForConnections: true,
  queueLimit: 0,
});

connection.on("error", (err) => {
  console.error("Database error:", err);
});


module.exports = connection;
