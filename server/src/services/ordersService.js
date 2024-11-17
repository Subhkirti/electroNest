const connection = require("../connection");
const app = require("../app");
const tableName = "orders";
checkOrderTableExistence();

// Create Order API
app.post("/order/create", (req, res) => {
  const { userId, cartId, addressId, status } = req.body;

  if (!userId || !cartId || !addressId) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  // Check if an order with the same userId, cartId, and addressId already exists
  connection.query(
    `SELECT id FROM orders WHERE user_id = ? AND cart_id = ?`,
    [userId, cartId],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error checking for existing order" });
      }

      if (results.length > 0) {
        const orderId = results[0].id;
        connection.query(
          `UPDATE ${tableName} SET cart_id = ?, address_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [cartId, addressId, status, orderId],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ status: 500, message: "Error updating order" });
            }
            if (result.affectedRows === 0) {
              return res
                .status(404)
                .json({ status: 404, message: "Order not found" });
            }
            return res.status(200).json({
              status: 200,
              message: "Order updated successfully",
              data: orderId,
            });
          }
        );
      } else {
        // Insert the new order if no duplicate is found
        connection.query(
          `INSERT INTO orders (user_id, cart_id, address_id, status) VALUES (?, ?, ?, ?)`,
          [userId, cartId, addressId, status || "pending"],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ status: 500, message: "Error creating order" });
            }
            return res.status(200).json({
              status: 200,
              message: "Order created successfully",
              data: result.insertId,
            });
          }
        );
      }
    }
  );
});

// Fetch all orders (with pagination)
app.get("/orders", (req, res) => {
  const userId = req.query.id;
  connection.query(
    `SELECT * FROM ${tableName} WHERE user_id = ?`,
    [userId],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error fetching orders" });
      }

      // Query to get the total count of orders
      connection.query(
        `SELECT COUNT(*) AS totalCount FROM ${tableName}`,
        (countErr, countResult) => {
          if (countErr) {
            return res
              .status(500)
              .json({ status: 500, message: "Error counting orders" });
          }
          const totalCount = countResult[0].totalCount;
          return res.status(200).json({
            status: 200,
            data: result,
            totalCount,
          });
        }
      );
    }
  );
});

// Get order details by ID
app.get("/order-details", (req, res) => {
  const orderId = req.query.id;
  if (!orderId) {
    return res
      .status(400)
      .json({ status: 400, message: "Order ID is required" });
  }

  connection.query(
    `SELECT * FROM ${tableName} WHERE id = ?`,
    [orderId],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error fetching order details" });
      }
      if (result.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "Order not found" });
      }
      return res.status(200).json({ status: 200, data: result[0] });
    }
  );
});

// Delete an order
app.delete("/order/delete", (req, res) => {
  const orderId = req.query.id;

  if (!orderId) {
    return res
      .status(400)
      .json({ status: 400, message: "Order ID is required" });
  }

  connection.query(
    `DELETE FROM ${tableName} WHERE id = ?`,
    [orderId],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error deleting order" });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Order deleted successfully" });
    }
  );
});

// Checked if the orders table exists, if not then created it
function checkOrderTableExistence() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [tableName], (err, results) => {
    if (err) {
      console.error("Error checking order table existence:", err);
      return;
    }

    if (results && results[0].count === 0) {
      const createTableQuery = `
        CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, cart_id INT,address_id INT, status VARCHAR(50) DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE, FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE)
      `;

      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error("Error creating orders table:", err);
        } else {
          console.log("Orders table created successfully.");
        }
      });
    } else {
      console.log("Orders table already exists.");
    }
  });
}
