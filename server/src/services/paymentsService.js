const connection = require("../connection");
const Razorpay = require("razorpay");
const paymentsTableName = "payments";
const orderStatusTableName = "order_status";
const ordersTableName = "orders";
const express = require("express");
const paymentsRouter = express.Router();
var {
  validatePaymentVerification,
} = require("razorpay/dist/utils/razorpay-utils");

var razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Check if payments table exists and create it if not
checkPaymentsTableExistence();

// Create Payment API
paymentsRouter.post("/payment/create", (req, res) => {
  const { userId, orderId, amount, receipt, totalAmount } = req.body;

  if (!userId || !orderId || !amount || !receipt || !totalAmount) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const options = {
    amount: Number(totalAmount) * 100, // Convert to paise
    currency: "INR",
    receipt: `order_receipt_id_${orderId}`,
    notes: { orderId },
  };

  razorpayInstance.orders.create(options, (err, razorpayOrder) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Error creating payment order" });
    }

    connection.query(
      `SELECT * FROM ${paymentsTableName} WHERE LOWER(receipt_id) = LOWER(?)`,
      [receipt],
      (err, receiptResult) => {
        if (err || !receiptResult.length) {
          connection.query(
            `INSERT INTO ${paymentsTableName} (user_id, order_id, razorpay_order_id, receipt_id, amount, payment_status) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, orderId, razorpayOrder.id, receipt, amount, "pending"],
            (err) => {
              if (err) {
                return res.status(500).json({
                  status: 500,
                  message: "Error saving payment details",
                });
              }

              return res.status(200).json({
                status: 200,
                message: "Payment order created successfully",
                data: {
                  receiptId: receipt,
                  orderId,
                  razorpayOrderId: razorpayOrder.id,
                  amount: options.amount / 100, // Convert back to INR
                },
              });
            }
          );
        } else {
          const razorpayOrderId = receiptResult?.[0]?.razorpay_order_id;
          // Save payment details to database
          connection.query(
            `INSERT INTO ${paymentsTableName} (user_id, order_id, razorpay_order_id, receipt_id, amount, payment_status) VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, orderId, razorpayOrderId, receipt, amount, "pending"],
            (err) => {
              if (err) {
                return res.status(500).json({
                  status: 500,
                  message: "Error saving payment details",
                });
              }

              return res.status(200).json({
                status: 200,
                message: "Payment order created successfully",
                data: {
                  receiptId: receipt,
                  orderId,
                  razorpayOrderId: razorpayOrderId,
                  amount: options.amount / 100, // Convert back to INR
                },
              });
            }
          );
        }
      }
    );
  });
});

// Verify Payment API
paymentsRouter.post("/payment/verify", (req, res) => {
  const { razorpayOrderId, paymentId, signature, receiptId, cartId, orderId } =
    req.body;

  if (!razorpayOrderId || !paymentId || !signature || !receiptId || !orderId) {
    return paymentVerificationFailed();
  }

  const isSignatureValid = validatePaymentVerification(
    { order_id: razorpayOrderId, payment_id: paymentId },
    signature,
    process.env.RAZORPAY_API_SECRET
  );

  if (!isSignatureValid) {
    return paymentVerificationFailed();
  }

  // Update payment and order statuses
  connection.query(
    `UPDATE ${paymentsTableName} SET payment_status = 'completed' WHERE razorpay_order_id = ?`,
    [razorpayOrderId],
    (err) => {
      if (err) {
        return paymentVerificationFailed();
      }

      connection.query(
        `UPDATE ${ordersTableName} SET status = 'placed' WHERE LOWER(receipt) = LOWER(?)`,
        [receiptId],
        (err, updateOrderResult) => {
          if (err) {
            return paymentVerificationFailed();
          }

          connection.query(
            `INSERT INTO ${orderStatusTableName} (order_id, status) VALUES (?, ?)`,
            [orderId, "placed"],
            (err, results) => {
              if (err) {
                return paymentVerificationFailed();
              }
              if (cartId) {
                // Get the cart ID related to the order (if applicable)
                connection.query(
                  `DELETE FROM cart_items WHERE cart_id = ?`,
                  [cartId],
                  (err, cartResult) => {
                    if (err) {
                      return paymentVerificationFailed();
                    }
                    // Delete cart items if the order was created from a cart
                    connection.query(
                      `DELETE FROM cart WHERE id = ?`,
                      [cartId],
                      (err) => {
                        if (err) {
                          return paymentVerificationFailed();
                        }

                        return res.status(200).json({
                          status: 200,
                          message:
                            "Payment verified, order updated, and cart cleared successfully",
                        });
                      }
                    );
                  }
                );
              } else {
                // If no cart is associated, just return success response
                return res.status(200).json({
                  status: 200,
                  message: "Payment verified and order updated successfully",
                });
              }
            }
          );
        }
      );
    }
  );

  function paymentVerificationFailed() {
    connection.query(
      `UPDATE ${paymentsTableName} SET payment_status = 'failed' WHERE razorpay_order_id = ?`,
      [razorpayOrderId],
      (err) => {
        connection.query(
          `UPDATE ${ordersTableName} SET status = 'failed' WHERE LOWER(receipt) = LOWER(?)`,
          [receiptId],
          (err, updateOrderResult) => {
            return res.status(400).json({
              status: 400,
              message: "Payment verification failed",
            });
          }
        );
      }
    );
  }
});

// Check if payments table exists and create it if not
function checkPaymentsTableExistence() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [paymentsTableName], (err, results) => {
    if (err) {
      console.error("Error checking payments table existence:", err);
      return;
    }

    if (results[0].count === 0) {
      const createTableQuery = `
        CREATE TABLE ${paymentsTableName} (
          id INT AUTO_INCREMENT PRIMARY KEY, 
          user_id INT, 
          order_id INT, 
          razorpay_order_id VARCHAR(255), 
          amount DECIMAL(10, 2), 
          payment_status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
          receipt_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )`;

      connection.query(createTableQuery, (err) => {
        if (err) console.error("Error creating payments table:", err);
        else console.log("Payments table created successfully.");
      });
    }
  });
}
module.exports = paymentsRouter; 
