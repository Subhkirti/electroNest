const mysql = require("mysql");

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

connection.on("error", (err) => {
  console.error("Database error:", err);
});


module.exports = connection;
