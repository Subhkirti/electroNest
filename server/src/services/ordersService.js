const connection = require("../connection");
const ordersTableName = "orders";
const orderStatusTableName = "order_status";
const paymentsTableName = "payments";
const PORT = process.env.PORT || 4000;
const express = require("express");
const ordersRouter = express.Router();
checkOrdersTableExistence();
checkOrderStatusTableExistence();

const OrderStatus = {
  PENDING: "pending",
  PLACED: "placed",
  ORDER_CONFIRMED: "orderConfirmed",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "outForDelivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  FAILED: "failed",
  REFUNDED: "refunded",
  REFUNDED_INITIATED: "refundInitiated",
};

ordersRouter.post("/order/create", async (req, res) => {
  const { userId, cartId, addressId, status, productId } = req.body;
  if (!userId || !addressId) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  try {
    const result = await createNewOrder(
      userId,
      cartId,
      addressId,
      status,
      productId
    );
    res.status(result.status).json(result);
  } catch (error) {
    console.log("error creating order:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

async function createNewOrder(userId, cartId, addressId, status, productId) {
  console.log("cartId:", cartId);
  // Order through Cart
  if (cartId) {
    const cartItems = await getCartItems(cartId);
    const cart = await getTotalAmountFromCart(cartId);
    const cartDetail = cart ? cart?.[0] : null;
    const totalAmount = cartDetail
      ? (
          Number(cartDetail?.total_price) -
          Number(cartDetail?.total_discount_price) +
          Number(cartDetail?.total_delivery_charges)
        ).toFixed(2)
      : "0.00";

    let res;
    if (!cartItems.length) {
      return { status: 400, message: "No items found in cart" };
    }

    for (let item of cartItems) {
      const transactionAmount = (
        (Number(item.price) +
          Number(item.delivery_charges) -
          Number(item.discount_price)) *
        Number(item.quantity)
      ).toFixed(2);
      // If order does not exist, insert a new order
      const orderId = await insertOrder(
        userId,
        addressId,
        status || OrderStatus.PENDING,
        item.product_id,
        item.quantity,
        transactionAmount
      );

      await insertOrderStatusHistory(orderId, status || OrderStatus.PENDING);
      if (!orderId) throw new Error("Error inserting order");

      res = await createPayment(
        userId,
        orderId,
        transactionAmount,
        totalAmount
      );
    }

    return {
      status: 200,
      message: "Order and payment created successfully",
      data: res?.data,
    };
  }
  // Order through Buy now
  else if (productId) {
    const product = await getProduct(productId);
    if (!product) {
      return { status: 400, message: "Product not found" };
    }

    const transactionAmount = (
      Number(product.net_price) + Number(product.delivery_charges)
    ).toFixed(2);

    // If order does not exist, insert a new order
    const orderId = await insertOrder(
      userId,
      addressId,
      status || OrderStatus.PENDING,
      productId,
      1,
      transactionAmount
    );

    if (!orderId) throw new Error("Error inserting order");
    const res = await createPayment(
      userId,
      orderId,
      transactionAmount,
      transactionAmount
    );
    return {
      status: 200,
      message: "Order and payment created successfully",
      data: res?.data,
    };
  } else {
    return { status: 400, message: "Unable to place order. Try again later." };
  }
}

function getCartItems(cartId) {
  return executeQuery(
    `SELECT ci.product_id, ci.quantity, ci.price, ci.delivery_charges, ci.discount_price
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.product_id
     WHERE ci.cart_id = ?`,
    [cartId]
  );
}

function getTotalAmountFromCart(cartId) {
  return executeQuery(`SELECT * FROM cart WHERE id = ?`, [cartId]);
}

async function getProduct(productId) {
  return executeQuery(`SELECT * FROM products WHERE product_id = ?`, [
    productId,
  ])
    .then((results) => results[0])
    .catch(() => null);
}

async function insertOrder(
  userId,
  addressId,
  status,
  productId,
  quantity,
  transactionAmount
) {
  return executeQuery(
    `INSERT INTO ${ordersTableName} (user_id, address_id, status, product_id, quantity, transaction_amount, receipt) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      addressId,
      status,
      productId,
      quantity,
      transactionAmount,
      Math.floor(Date.now() / 1000),
    ]
  ).then((result) => result.insertId);
}

async function createPayment(userId, orderId, amount, totalAmount) {
  try {
    // Step 1: Fetch the receipt from the database
    const receipt = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT receipt FROM ${ordersTableName} WHERE id = ?`,
        [orderId],
        (err, res) => {
          if (err) {
            reject(err); // Reject the promise if there's an error
            return;
          }
          // Resolve with the receipt (or null if not found)
          resolve(res?.[0]?.receipt || null);
        }
      );
    });

    // Step 2: Proceed with the payment API call using the receipt
    if (!receipt) {
      throw new Error("Receipt not found for the order");
    }

    const paymentResponse = await fetch(
      process.env.NODE_ENV === "production"
        ? `https://electronest-backend.onrender.com/payment/create`
        : `http://localhost:${PORT}/payment/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          orderId,
          amount,
          receipt,
          totalAmount,
        }),
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error creating payment:", error);
        throw error; // If there's an error, throw it
      });

    return paymentResponse; // Return the payment response
  } catch (error) {
    console.error("Error in createPayment:", error);
    return { status: 500, message: "Error processing payment" }; // Return error response
  }
}

function executeQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

async function insertOrderStatusHistory(orderId, status) {
  return executeQuery(
    `INSERT INTO ${orderStatusTableName} (order_id, status) VALUES (?, ?)`,
    [orderId, status]
  );
}

// Fetch all orders (with pagination)
ordersRouter.get("/orders", (req, res) => {
  const userId = req.query.id;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (pageNumber - 1) * pageSize;

  // Query to fetch orders
  const fetchOrdersQuery = `
  SELECT * 
  FROM ${ordersTableName} 
  WHERE user_id = ? 
  ${
    req.query.pageNumber
      ? `ORDER BY created_at DESC LIMIT ? OFFSET ?`
      : "ORDER BY created_at DESC"
  }
`;

  // Fetch orders first
  connection.query(
    fetchOrdersQuery,
    req.query.pageNumber ? [userId, pageSize, offset] : [userId],
    (err, ordersResult) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error fetching orders" });
      }

      if (ordersResult.length === 0) {
        return res.status(200).json({
          status: 200,
          data: [],
          totalCount: 0,
        });
      }

      // Extract product IDs from the orders
      const productIds = ordersResult.map((order) => order.product_id);

      // Query to fetch product details for the extracted product IDs
      const fetchProductsQuery = `
        SELECT * 
        FROM products 
        WHERE product_id IN (?)
      `;

      connection.query(
        fetchProductsQuery,
        [productIds],
        (productErr, productsResult) => {
          if (productErr) {
            return res
              .status(500)
              .json({ status: 500, message: "Error fetching product details" });
          }

          // Map product details by product_id for easier lookup
          const productDetailsMap = {};
          productsResult.forEach((product) => {
            productDetailsMap[product.product_id] = product;
          });

          // Add product details to each order
          const formattedOrders = ordersResult.map((order) => ({
            ...order,
            product_details: productDetailsMap[order.product_id] || null,
          }));

          // Query to get the total count of orders for the user
          const countQuery = `
          SELECT COUNT(*) AS totalCount 
          FROM ${ordersTableName} 
          WHERE user_id = ?
        `;

          connection.query(countQuery, [userId], (countErr, countResult) => {
            if (countErr) {
              return res
                .status(500)
                .json({ status: 500, message: "Error counting orders" });
            }

            const totalCount = countResult[0].totalCount;

            return res.status(200).json({
              status: 200,
              data: formattedOrders,
              totalCount,
            });
          });
        }
      );
    }
  );
});

// Filter Orders Api
ordersRouter.get("/orders/filter", (req, res) => {
  const userId = req.query.id;
  const statusFilters = req.query.status ? req.query.status.split(",") : [];
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (pageNumber - 1) * pageSize;

  // Building the query dynamically based on filters
  let filterCondition = `WHERE user_id = ?`;
  if (statusFilters.length > 0) {
    filterCondition += ` AND status IN (${statusFilters
      .map(() => "?")
      .join(",")})`;
  }

  // Query to fetch orders
  const fetchOrdersQuery = `
    SELECT * 
    FROM ${ordersTableName} 
    ${filterCondition} 
    ${req.query.pageNumber ? `LIMIT ? OFFSET ?` : ""}
  `;

  // Query parameters
  const queryParams = [
    userId,
    ...statusFilters,
    ...(req.query.pageNumber ? [pageSize, offset] : []),
  ];

  connection.query(fetchOrdersQuery, queryParams, (err, ordersResult) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Error fetching filtered orders" });
    }

    if (ordersResult.length === 0) {
      return res.status(200).json({
        status: 200,
        data: [],
        totalCount: 0,
      });
    }

    // Extract product IDs from the orders
    const productIds = ordersResult.map((order) => order.product_id);

    // Query to fetch product details for the extracted product IDs
    const fetchProductsQuery = `
      SELECT * 
      FROM products 
      WHERE product_id IN (?)
    `;

    connection.query(
      fetchProductsQuery,
      [productIds],
      (productErr, productsResult) => {
        if (productErr) {
          return res
            .status(500)
            .json({ status: 500, message: "Error fetching product details" });
        }

        // Map product details by product_id for easier lookup
        const productDetailsMap = {};
        productsResult.forEach((product) => {
          productDetailsMap[product.product_id] = product;
        });

        // Add product details to each order
        const formattedOrders = ordersResult.map((order) => ({
          ...order,
          product_details: productDetailsMap[order.product_id] || null,
        }));

        // Query to get the total count of filtered orders
        const countQuery = `
        SELECT COUNT(*) AS totalCount 
        FROM ${ordersTableName} 
        ${filterCondition}
      `;

        const countParams = [userId, ...statusFilters];

        connection.query(countQuery, countParams, (countErr, countResult) => {
          if (countErr) {
            return res
              .status(500)
              .json({ status: 500, message: "Error counting filtered orders" });
          }

          const totalCount = countResult[0].totalCount;

          return res.status(200).json({
            status: 200,
            data: formattedOrders,
            totalCount,
          });
        });
      }
    );
  });
});

// Get order details by ID
ordersRouter.get("/order-details", (req, res) => {
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
          .status(200)
          .json({ status: 200, message: "Order not found" });
      }
      // Query to fetch product details for the extracted product IDs
      const fetchProductsQuery = "SELECT * FROM products WHERE product_id = ?";
      connection.query(
        fetchProductsQuery,
        [result[0]?.product_id],
        (productErr, productsResult) => {
          if (productErr) {
            return res
              .status(500)
              .json({ status: 500, message: "Error fetching product details" });
          }
          // Add product details to each order
          const formattedOrders = result.map((order) => ({
            ...order,
            product_details: productsResult?.[0],
          }));

          return res
            .status(200)
            .json({ status: 200, data: formattedOrders[0] });
        }
      );
    }
  );
});

// Update order status API (send receipt Id while creating order, and orderId when order is already placed)

ordersRouter.put("/order/update-status", (req, res) => {
  const { receiptId, status, userId, orderId } = req.body;
  if (!orderId || !status || !userId) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields" });
  }

  const validStatuses = [
    OrderStatus.PENDING,
    OrderStatus.PLACED,
    OrderStatus.ORDER_CONFIRMED,
    OrderStatus.SHIPPED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.FAILED,
    OrderStatus.REFUNDED,
    OrderStatus.REFUNDED_INITIATED,
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ status: 400, message: "Invalid status" });
  }

  const updateQuery =
    receiptId && orderId
      ? `UPDATE ${ordersTableName} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND receipt = ? AND id = ?`
      : `UPDATE ${ordersTableName} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND id = ?`;

  connection.query(
    updateQuery,
    receiptId
      ? [status, userId, receiptId, orderId]
      : [status, userId, orderId],
    async (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: 500, message: "Error updating order status" });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ status: 404, message: "Order not found" });

      // Insert into order_status
      await insertOrderStatusHistory(orderId, status);

      if (
        (status === OrderStatus.FAILED || status === OrderStatus.CANCELLED) &&
        receiptId
      ) {
        // when order cancelled, then after 2 minutes set it's status to refund initiated
        if (status === OrderStatus.CANCELLED) {
          const refundStatus = OrderStatus.REFUNDED_INITIATED;
          await insertOrderStatusHistory(orderId, refundStatus);
          executeQuery(
            updateQuery,
            receiptId
              ? [refundStatus, userId, receiptId, orderId]
              : [refundStatus, userId, orderId]
          );
        }

        const updatePaymentQuery = `UPDATE ${paymentsTableName} SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND receipt_id = ?`;
        connection.query(
          updatePaymentQuery,
          [status, userId, receiptId],
          (err, result) => {
            if (err)
              return res.status(500).json({
                status: 500,
                message: "Error updating payment status",
              });

            res.status(200).json({
              status: 200,
              message: "Order status updated successfully",
            });
          }
        );
      } else {
        res.status(200).json({
          status: 200,
          message: "Order status updated successfully",
          orderId,
          status,
        });
      }
    }
  );
});

ordersRouter.get("/order/status-history", (req, res) => {
  const orderId = req.query.orderId;
  if (!orderId) {
    return res
      .status(400)
      .json({ status: 400, message: "Order ID is required" });
  }

  const query = `SELECT * FROM ${orderStatusTableName} WHERE order_id = ? ORDER BY updated_at DESC`;
  connection.query(query, [orderId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ status: 500, message: "Error fetching order status history" });
    res.status(200).json({ status: 200, data: result });
  });
});

// Check if the orders table exists and create it if not
function checkOrdersTableExistence() {
  const checkQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`;
  connection.query(
    checkQuery,
    [process.env.DB_NAME, ordersTableName],
    (err, results) => {
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
          status ENUM("pending", "placed", "orderConfirmed", "shipped", "outForDelivery", "delivered", "cancelled", "failed", "refundInitiated", "refunded") DEFAULT 'pending',
          product_id INT,
          quantity INT,
          transaction_amount DECIMAL(10, 2),
          receipt VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`;
        connection.query(createTableQuery, (err) => {
          if (err) console.error("Error creating orders table:", err);
          else console.log("Orders table created successfully.");
        });
      }
    }
  );
}

// Check if the orders table exists and create it if not
function checkOrderStatusTableExistence() {
  const checkQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`;
  connection.query(
    checkQuery,
    [process.env.DB_NAME, orderStatusTableName],
    (err, results) => {
      if (err) {
        console.error("Error checking order status table existence:", err);
        return;
      }

      if (results[0].count === 0) {
        const createTableQuery = `
        CREATE TABLE ${orderStatusTableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        status ENUM("pending", "placed", "orderConfirmed", "shipped", "outForDelivery", "delivered", "cancelled", "failed", "refundInitiated", "refunded") NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )`;
        connection.query(createTableQuery, (err) => {
          if (err) console.error("Error creating orders table:", err);
          else console.log("Order Status table created successfully.");
        });
      }
    }
  );
}
module.exports = ordersRouter;
