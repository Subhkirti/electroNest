const connection = require("../connection");
const app = require("../app");
const tableName = "orders";
const Razorpay = require("razorpay");

checkOrderTableExistence();
var {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");

// Initialize Razorpay instance
var razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Create Order API
app.post("/order/create", (req, res) => {
  const { userId, cartId, addressId, status, amount } = req.body;

  // Input validation
  if (!userId || !addressId || Number(amount) <= 0) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  // Step 1: Fetch User Details from the 'users' table
  connection.query(
    `SELECT first_name, email, mobile FROM users WHERE id = ?`,
    [userId],
    (err, userResults) => {
      if (err || userResults.length === 0) {
        return res
          .status(500)
          .json({ status: 500, message: "Error fetching user details" });
      }

      const user = userResults[0];
      const userName = user.first_name;
      const userEmail = user.email;
      const userContact = user.mobile;

      // Step 2: Check if cartId is provided
      if (cartId) {
        // Check for existing order with cartId
        connection.query(
          `SELECT id FROM ${tableName} WHERE user_id = ? AND cart_id = ?`,
          [userId, cartId],
          (err, existingOrders) => {
            if (err) {
              return res.status(500).json({
                status: 500,
                message: "Error checking existing orders",
              });
            }

            const isUpdate = existingOrders.length > 0;
            const orderId = isUpdate ? existingOrders[0].id : null;

            if (isUpdate) {
              // Step 3A: Update the existing order
              connection.query(
                `UPDATE ${tableName} SET address_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                [addressId, status || "pending", orderId],
                (err, updateResult) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ status: 500, message: "Error updating order" });
                  }
                  return handleRazorpayOrderCreation(orderId, amount, res);
                }
              );
            } else {
              // Step 3B: Create a new order if no existing order found
              createNewOrder(
                userId,
                cartId,
                addressId,
                status,
                amount,
                userName,
                userEmail,
                userContact,
                res
              );
            }
          }
        );
      } else {
        // Handle "Buy Now" case without cartId
        createNewOrder(
          userId,
          null,
          addressId,
          status,
          amount,
          userName,
          userEmail,
          userContact,
          res
        );
      }
    }
  );
});

// Function to create a new order
function createNewOrder(
  userId,
  cartId,
  addressId,
  status,
  amount,
  userName,
  userEmail,
  userContact,
  res
) {
  connection.query(
    `INSERT INTO ${tableName} (user_id, cart_id, address_id, status, transaction_amount, receipt) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      cartId,
      addressId,
      status || "pending",
      amount,
      Math.floor(Date.now() / 1000), // unique receipt ID
    ],
    (err, insertResult) => {
      if (err) {
        console.log("err:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Error creating new order" });
      }
      const newOrderId = insertResult.insertId;
      handleRazorpayOrderCreation(newOrderId, amount, res);
    }
  );
}

// Function to create Razorpay Order
function handleRazorpayOrderCreation(orderId, amount, res) {
  const options = {
    amount: amount * 100, // Convert to paise (smallest currency unit)
    currency: "INR",
    receipt: `order_receipt_id_${orderId}`,
    notes: { orderId },
  };

  razorpayInstance.orders.create(options, (err, razorpayOrder) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Error creating Razorpay order" });
    }
    // Success response with order details
    return res.status(200).json({
      status: 200,
      message: "Order created successfully",
      data: {
        orderId,
        razorpayOrderId: razorpayOrder.id,
        amount: options.amount / 100, // Return in INR
        receipt: options.receipt,
      },
    });
  });
}

// verify payment and update order status and empty the cart if payment is successful
app.post("/verifyPayment", (req, res) => {
  const { razorpayOrderId, orderId, paymentId, signature } = req.body;

  if (!razorpayOrderId || !orderId || !paymentId || !signature) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing payment details" });
  }

  // Step 1: Verify the payment signature using Razorpay's utility
  const isSignatureValid = validatePaymentVerification(
    { order_id: razorpayOrderId, payment_id: paymentId },
    signature,
    process.env.RAZORPAY_API_SECRET
  );

  if (!isSignatureValid) {
    return res
      .status(400)
      .json({ status: 400, message: "Payment signature mismatch" });
  }

  // Step 2: Confirm the payment and handle post-payment actions
  connection.query(
    `SELECT * FROM orders WHERE id = ?`,
    [orderId],
    (err, result) => {
      if (err || !result.length) {
        return res
          .status(500)
          .json({ status: 500, message: "Order not found" });
      }

      const cartId = result[0].cart_id; // Retrieve cart_id from the orders table

      // Update order status to "paid"
      connection.query(
        `UPDATE orders SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [orderId],
        (err, updateResult) => {
          if (err) {
            return res
              .status(500)
              .json({ status: 500, message: "Error updating order status" });
          }

          // Step 3: Clear cart_items and cart tables
          connection.query(
            `DELETE FROM cart_items WHERE cart_id = ?`,
            [cartId],
            (err, deleteCartItemsResult) => {
              if (err) {
                return res
                  .status(500)
                  .json({ status: 500, message: "Error clearing cart items" });
              }

              // Delete the cart itself
              connection.query(
                `DELETE FROM cart WHERE id = ?`,
                [cartId],
                (err, deleteCartResult) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ status: 500, message: "Error clearing cart" });
                  }

                  // Step 4: Respond back with success
                  return res.status(200).json({
                    status: 200,
                    message: "Payment verified and cart cleared successfully",
                    data: { orderId, paymentId },
                  });
                }
              );
            }
          );
        }
      );
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
        CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, cart_id INT,address_id INT, status VARCHAR(50) DEFAULT 'pending', transaction_amount DECIMAL(10, 2),
          receipt VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE, FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE)
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
