const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "electronest-test",
});


connection.connect((err) => {
  if (err) {
    console.warn("error");
  } else {
    console.log("Database Connected Successfully");
  }
});


module.exports = connection