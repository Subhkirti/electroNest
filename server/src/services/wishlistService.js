const tableName = "wishlist";
const productsTableName = "products";
const connection = require("../connection");
const express = require("express");
const wishlistRouter = express.Router();
checkTableExistence();

wishlistRouter.post("/wishlist/remove", (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({
      status: 400,
      message: "Missing parameters in request.",
    });
  }

  const deleteWishlistQuery = `DELETE FROM ${tableName} WHERE user_id = ?, product_id = ?`;
  connection.query(deleteWishlistQuery, [userId, productId], (err, results) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Error removing user's wishlist.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Product deleted from wishlist successfully.",
    });
  });
});

wishlistRouter.post("/wishlist/add", (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({
      status: 400,
      message: "Missing parameters in request.",
    });
  }

  const addWishlistQuery = `INSERT INTO ${tableName} (user_id, product_id) VALUES(?, ?)`;
  const findProductQuery = `SELECT * FROM ${productsTableName} WHERE product_id = ?`;

  connection.query(addWishlistQuery, [userId, productId], (err, result) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Error adding user's wishlist.",
      });
    }

    connection.query(findProductQuery, [productId], (err, results) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Error while finding wishlist details",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Product added to wishlist successfully.",
        data: results?.[0],
      });
    });
  });
});

function checkTableExistence() {
  // Checked and created users table if it does not exist
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [tableName], (err, results) => {
    if (err) {
      console.error("Error checking table existence:", results?.[0]?.count);
      return;
    }

    // If the table does not exist, create it
    if (results && results?.length && results[0].count === 0) {
      // Table creation query
      const createQuery = `CREATE TABLE ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT, 
        product_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;

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

module.exports = wishlistRouter;
