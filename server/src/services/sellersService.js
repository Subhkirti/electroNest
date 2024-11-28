const tableName = "sellers";
const connection = require("../connection");
const express = require("express");
const sellersRouter = express.Router();
checkSellersTableExistence();

// Get All Sellers
sellersRouter.get("/sellers", (req, res) => {
  connection.query(`SELECT * FROM ${tableName}`, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Error checking sellers" });
    }

    res.status(200).json({
      status: 200,
      data: result,
    });
  });
});

// Get Seller detail
sellersRouter.get("/seller-detail", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "Seller Id not found in request" });
  }
  connection.query(
    `SELECT * FROM ${tableName} WHERE id = ?`,
    [id],
    [email],
    (err, results) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error checking seller" });
      }

      if (!results.length) {
        return res
          .status(400)
          .json({ status: 400, message: "Seller detail not found" });
      }

      res.status(200).json({
        status: 200,
        data: results?.[0],
      });
    }
  );
});

// Add Seller details
sellersRouter.post("/sellers/add", (req, res) => {
  const {
    user_id,
    store_name,
    business_address,
    tax_id,
    seller_rating = 0.0,
    store_logo,
  } = req.body;

  if (!user_id || !store_name) {
    return res.status(400).json({
      status: 400,
      message: "User ID and Store Name are required",
    });
  }

  const insertQuery = `
      INSERT INTO ${tableName} 
      (user_id, store_name, business_address, tax_id, seller_rating, store_logo) 
      VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    user_id,
    store_name,
    business_address || null,
    tax_id || null,
    seller_rating,
    store_logo || null,
  ];

  connection.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Error adding seller:", err);
      return res.status(500).json({
        status: 500,
        message: "Error adding seller",
      });
    }

    res.status(201).json({
      status: 201,
      message: "Seller added successfully",
      data: { id: result.insertId, ...req.body },
    });
  });
});

// Delete Seller details
sellersRouter.delete("/sellers/delete", (req, res) => {
  const sellerId = req.query?.id;

  if (!sellerId) {
    return res
      .status(400)
      .json({ status: 400, message: "Seller Id not found in request" });
  }

  const deleteQuery = `DELETE FROM ${tableName} WHERE id = ?`;
  connection.query(deleteQuery, [sellerId], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Error deleting seller",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Seller deleted successfully",
    });
  });
});

// Checked and created sellers table if it does not exist
function checkSellersTableExistence() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [tableName], (err, results) => {
    if (err) {
      console.error("Error checking table existence:", err);
      return;
    }

    // If the table does not exist, create it
    if (results && results.length && results[0].count === 0) {
      // Sellers table creation query
      const createQuery = `CREATE TABLE ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            store_name VARCHAR(255) NOT NULL,
            business_address VARCHAR(255),
            tax_id VARCHAR(50),
            seller_rating DECIMAL(3,2) DEFAULT 0.00,
            store_logo VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )`;

      connection.query(createQuery, (err) => {
        if (err) {
          console.error(`Error creating ${tableName} table: ${err}`);
        } else {
          console.log(`${tableName} table created successfully.`);
        }
      });
    } else {
      console.log(`${tableName} table already exists.`);
    }
  });
}
module.exports = sellersRouter; 
