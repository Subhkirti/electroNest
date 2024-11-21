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
  const { userId, cartId, addressId, status } = req.body;

  // Input validation
  if (!userId || !addressId) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  // Step 1: Fetch User Details from the 'users' table
  connection.query(
    `SELECT first_name, email, mobile FROM users WHERE id = ?`,
    [userId],
    (err, userResults) => {
      if (err || !userResults.length) {
        return res
          .status(500)
          .json({ status: 500, message: "Error fetching user details" });
      }

      // Step 2: Create a new order for each product in the cart
      createNewOrder(userId, cartId, addressId, status, res);
    }
  );
});

// Function to create a new order for each product in the cart
function createNewOrder(userId, cartId, addressId, status, res) {
  // Step 1: Fetch product details from cart_items for the given cart_id
  connection.query(
    `SELECT ci.product_id, ci.quantity, ci.price, ci.delivery_charges, ci.discount_price 
    FROM cart_items ci JOIN products p ON ci.product_id = p.product_id WHERE ci.cart_id = ?`,
    [cartId],
    (err, cartItems) => {
      if (err || !cartItems.length) {
        return res
          .status(400)
          .json({ status: 400, message: "No items found in cart" });
      }

      // Step 2: Prepare data for insertion
      const ordersData = cartItems.map((item) => {
        const transactionAmount =
          (item.price + item.delivery_charges - item.discount_price) *
          item.quantity;

        return [
          userId,
          addressId,
          status || "pending",
          item.product_id,
          item.quantity,
          transactionAmount,
          Math.floor(Date.now() / 1000),
        ];
      });

      // Step 3: Insert multiple rows into the orders table
      connection.query(
        `INSERT INTO ${tableName} 
          (user_id, address_id, status, product_id, quantity, transaction_amount, receipt) 
          VALUES ?`,
        [ordersData],
        (err, insertResult) => {
          if (err) {
            console.log("Error inserting orders:", err);
            return res
              .status(500)
              .json({ status: 500, message: "Error creating new orders" });
          }

          // Step 4: Calculate the total transaction amount for all products
          const totalAmount = ordersData.reduce(
            (sum, order) => sum + order?.[5], // Sum up the transaction_amount field
            0
          );

          // Step 5: Fetch receipt_id from the first inserted order
          connection.query(
            `SELECT receipt FROM ${tableName} WHERE id = ?`,
            [insertResult.insertId],
            (err, receiptResult) => {
              if (err || !receiptResult.length) {
                return res
                  .status(500)
                  .json({ status: 500, message: "Error fetching receipt_id" });
              }

              const receiptId = receiptResult[0].receipt;

              // Step 6: Handle Razorpay order creation
              handleRazorpayOrderCreation(
                insertResult.insertId,
                receiptId,
                totalAmount,
                res
              );
            }
          );
        }
      );
    }
  );
}

// Function to create Razorpay Order
function handleRazorpayOrderCreation(orderId, receiptId, amount, res) {
  const options = {
    amount: amount * 100, // Convert to paise
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
    return res.status(200).json({
      status: 200,
      message: "Order created successfully",
      data: {
        receiptId,
        razorpayOrderId: razorpayOrder.id,
        amount: options.amount / 100, // Return in INR
        receipt: options.receipt,
      },
    });
  });
}

// Verify payment and update order status using receipt_id and empty the cart if payment is successful
app.post("/verifyPayment", (req, res) => {
  const { razorpayOrderId, paymentId, signature, receiptId, cartId } = req.body;

  // Validate input
  if (!razorpayOrderId || !paymentId || !signature || !receiptId) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing payment details or receipt_id" });
  }

  // Step 1: Verify the payment signature
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

  // Step 2: Update all orders with the same receipt_id to 'paid' status
  connection.query(
    `UPDATE orders SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE receipt = ?`,
    [receiptId],
    (err, updateResult) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error updating order status" });
      }

      // Step 3: Clear the cart after updating all orders
      if (cartId) {
        connection.query(
          `DELETE FROM cart_items WHERE cart_id = ?`,
          [cartId],
          (err) => {
            if (err) {
              return res.status(500).json({
                status: 500,
                message: "Payment verified, but failed to clear cart items",
              });
            }

            // Delete the cart itself
            connection.query(
              `DELETE FROM cart WHERE id = ?`,
              [cartId],
              (err) => {
                if (err) {
                  return res.status(500).json({
                    status: 500,
                    message: "Payment verified, but failed to clear cart",
                  });
                }

                // Step 4: Respond with success
                return res.status(200).json({
                  status: 200,
                  message: "Payment verified and orders updated successfully",
                  paymentId,
                  receiptId,
                });
              }
            );
          }
        );
      }
      // Step 4: Respond with success
      // In case of buy now
      else {
        return res.status(200).json({
          status: 200,
          message: "Payment verified and orders updated successfully",
          paymentId,
          receiptId,
        });
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

// Function to check and create orders table if it doesn't exist
function checkOrderTableExistence() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;
  connection.query(checkTableQuery, [tableName], (err, results) => {
    if (err) {
      console.error("Error checking order table existence:", err);
      return;
    }

    if (results && results[0].count === 0) {
      const createTableQuery = `
        CREATE TABLE ${tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY, 
          user_id INT, 
          address_id INT,
          status VARCHAR(50) DEFAULT 'pending', 
          product_id INT,
          quantity INT, 
          transaction_amount DECIMAL(10, 2),
          receipt VARCHAR(255), 
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, 
          FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE
        )
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
