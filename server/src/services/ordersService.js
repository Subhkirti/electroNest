const connection = require("../connection");
const app = require("../app");
const ordersTableName = "orders";
const PORT = process.env.PORT;

checkOrdersTableExistence();

// Create Order API
app.post("/order/create", async (req, res) => {
  const { userId, cartId, addressId, status, productId } = req.body;

  if (!userId || !addressId) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  try {
    await createNewOrder(userId, cartId, addressId, status, productId, res);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
});

// Function to create a new order for each product in the cart or single product
async function createNewOrder(
  userId,
  cartId,
  addressId,
  status,
  productId,
  res
) {
  if (cartId) {
    // Create order for all items in the cart
    try {
      const cartItems = await getCartItems(cartId);

      if (!cartItems.length) {
        return res
          .status(400)
          .json({ status: 400, message: "No items found in cart" });
      }

      for (let item of cartItems) {
        const transactionAmount =
          (item.price + item.delivery_charges - item.discount_price) *
          item.quantity;

        const orderId = await insertIntoOrdersTable([
          userId,
          addressId,
          status || "pending",
          item.product_id,
          item.quantity,
          transactionAmount,
          Math.floor(Date.now() / 1000),
        ]);

        if (orderId) {
          insertIntoPaymentsTable(userId, orderId, transactionAmount, res);
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Error processing cart items" });
    }
  } else if (productId) {
    // Create order for a single product (Buy Now)
    try {
      const product = await getProduct(productId);

      if (!product) {
        return res
          .status(400)
          .json({ status: 400, message: "Product not found" });
      }

      const transactionAmount = product.net_price + product.delivery_charges;

      const orderId = await insertIntoOrdersTable([
        userId,
        addressId,
        status || "pending",
        productId,
        1,
        transactionAmount,
        Math.floor(Date.now() / 1000),
      ]);


      if (orderId) {
        insertIntoPaymentsTable(userId, orderId, transactionAmount, res);
      }
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Error processing product" });
    }
  } else {
    return res.status(400).json({
      status: 400,
      message: "Unable to place order. Try again later.",
    });
  }
}

// Fetch cart items
function getCartItems(cartId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT ci.product_id, ci.quantity, ci.price, ci.delivery_charges, ci.discount_price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      WHERE ci.cart_id = ?`,
      [cartId],
      (err, cartItems) => {
        if (err) {
          reject(err);
        } else {
          resolve(cartItems);
        }
      }
    );
  });
}

// Fetch product details
function getProduct(productId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM products WHERE product_id = ?`,
      [productId],
      (err, products) => {
        if (err || !products.length) {
          reject(err || "Product not found");
        } else {
          resolve(products[0]);
        }
      }
    );
  });
}

// Insert orders into the orders table
// Insert orders into the orders table
function insertIntoOrdersTable(ordersData) {
  return new Promise((resolve, reject) => {
    // Ensure ordersData is in the correct format for batch insertion
    if (!Array.isArray(ordersData) || ordersData.length === 0) {
      return reject("Invalid orders data format.");
    }
    connection.query(
      `INSERT INTO ${ordersTableName} (user_id, address_id, status, product_id, quantity, transaction_amount, receipt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ordersData,
      (err, insertResult) => {
        if (err) {
          reject("Error creating orders");
        } else {
          resolve(insertResult.insertId);
        }
      }
    );
  });
}

// Insert data into payments table
function insertIntoPaymentsTable(userId, orderId, amount, res) {
  fetch(`http://localhost:${PORT}/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, orderId, amount }),
  })
    .then((response) => response.json())
    .then((paymentResponse) => {
      if (paymentResponse.status === 200) {
        // Payment was created successfully
        return res.status(200).json({
          status: 200,
          message: "Order and payment created successfully",
          data: paymentResponse.data,
        });
      } else {
        // Handle payment creation failure
        return res.status(500).json({
          status: 500,
          message: "Order created, but payment creation failed",
        });
      }
    })
    .catch((err) => {
      console.error("Error calling /payment/create API:", err);
      return res.status(500).json({
        status: 500,
        message: "Error calling payment API",
      });
    });
}

// Fetch all orders (with pagination)
app.get("/orders", (req, res) => {
  const userId = req.query.id;
  connection.query(
    `SELECT * FROM ${ordersTableName} WHERE user_id = ?`,
    [userId],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error fetching orders" });
      }

      // Query to get the total count of orders
      connection.query(
        `SELECT COUNT(*) AS totalCount FROM ${ordersTableName}`,
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
    `SELECT * FROM ${ordersTableName} WHERE id = ?`,
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

// Check if the orders table exists and create it if not
function checkOrdersTableExistence() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [ordersTableName], (err, results) => {
    if (err) {
      console.error("Error checking orders table existence:", err);
      return;
    }

    if (results[0].count === 0) {
      const createTableQuery = `
        CREATE TABLE ${ordersTableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          address_id INT,
          cart_id INT,
          status ENUM('pending', 'placed', 'orderConfirmed', 'shipped', 'outForDelivery', 'delivered', 'cancelled', 'failed', 'refunded', 'returned') NOT NULL DEFAULT 'pending',
          product_id INT,
          quantity INT,
          transaction_amount DECIMAL(10, 2),
          receipt VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE,
          FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE
        )`;

      connection.query(createTableQuery, (err) => {
        if (err) console.error("Error creating orders table:", err);
        else console.log("Orders table created successfully.");
      });
    }
  });
}
