const tableName = "wishlist";
const productsTableName = "products";
const connection = require("../connection");
const express = require("express");
const wishlistRouter = express.Router();
const { getUserIdFromToken } = require("./jwtService");

checkTableExistence();

// fetch user wishlist
wishlistRouter.get("/wishlist", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (!userId) return;
  const pageNumber = req.query?.pageNumber ? parseInt(req.query.pageNumber) : 1;
  const pageSize = req.query?.pageSize ? parseInt(req.query.pageSize) : 10;
  const offset = (pageNumber - 1) * pageSize;

  const getWishlistQuery = `
    SELECT p.*, 
           true AS is_liked
    FROM ${tableName} w
    JOIN ${productsTableName} p ON w.product_id = p.product_id
    WHERE w.user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?
  `;

  connection.query(
    getWishlistQuery,
    [userId, pageSize, offset],
    (err, results) => {
      if (err) {
        console.log("err:", err);
        return res.status(400).json({
          status: 400,
          message: "Error retrieving user's wishlist.",
        });
      }

      // SQL query to get the total count of wishlist items for the user
      const getTotalCountQuery = `
      SELECT COUNT(*) AS totalCount
      FROM ${tableName}
      WHERE user_id = ?
    `;

      connection.query(
        getTotalCountQuery,
        [userId],
        (countErr, countResult) => {
          if (countErr) {
            return res.status(400).json({
              status: 400,
              message: "Error retrieving total count of wishlist items.",
            });
          }

          const totalCount = countResult[0]?.totalCount || 0;

          if (results.length === 0) {
            return res.status(200).json({
              status: 200,
              message: "No items found in the wishlist.",
              data: [],
              totalCount,
            });
          }

          return res.status(200).json({
            status: 200,
            message: "Wishlist items retrieved successfully.",
            data: results,
            totalCount,
          });
        }
      );
    }
  );
});

// remove product from wishlist
wishlistRouter.delete("/wishlist/remove/:id", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  const productId = req.params?.id;

  if (!userId) return;
  if (!productId || productId === "null" || productId === "undefined")
    return res.status(400).json({
      status: 400,
      message: "Missing parameters in request.",
    });

  const deleteWishlistQuery = `DELETE FROM ${tableName} WHERE user_id = ? AND product_id = ?`;
  connection.query(deleteWishlistQuery, [userId, productId], (err, results) => {
    if (err)
      return res.status(400).json({
        status: 400,
        message: "Error removing user's wishlist.",
      });

    return res.status(200).json({
      status: 200,
      message: "Product deleted from wishlist successfully.",
    });
  });
});

// add product to wishlist
wishlistRouter.get("/wishlist/add/:id", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  const productId = req.params?.id;

  if (!userId) return;
  if (!productId || productId === "null" || productId === "undefined")
    return res.status(400).json({
      status: 400,
      message: "Missing parameters in request.",
    });

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
