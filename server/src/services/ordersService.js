const connection = require("../connection");
const app = require("../app");
const ordersTableName = "orders";
const PORT = process.env.PORT;
checkOrdersTableExistence();

app.post("/order/create", async (req, res) => {
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
    console.error("Error creating order:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

async function createNewOrder(userId, cartId, addressId, status, productId) {
  if (cartId) {
    const cartItems = await getCartItems(cartId);
    let res;
    if (!cartItems.length) {
      return { status: 400, message: "No items found in cart" };
    }

    for (let item of cartItems) {
      const transactionAmount =
        (item.price + item.delivery_charges - item.discount_price) *
        item.quantity;

      const orderId = await insertOrder(
        userId,
        addressId,
        status || "pending",
        item.product_id,
        item.quantity,
        transactionAmount
      );
      if (!orderId) throw new Error("Error inserting order");
      res = await createPayment(userId, orderId, transactionAmount);
      console.log("res2.1:", res);
    }
    console.log("res2.2:", res);

    return {
      status: 200,
      message: "Order and payment created successfully",
      data: res?.data,
    };
  } else if (productId) {
    const product = await getProduct(productId);
    if (!product) {
      return { status: 400, message: "Product not found" };
    }

    const transactionAmount = product.net_price + product.delivery_charges;
    const orderId = await insertOrder(
      userId,
      addressId,
      status || "pending",
      productId,
      1,
      transactionAmount
    );
    if (!orderId) throw new Error("Error inserting order");
    const res = await createPayment(userId, orderId, transactionAmount);
    console.log("res1:", res);
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

async function createPayment(userId, orderId, amount) {
  connection.query(
    `SELECT receipt FROM ${ordersTableName} WHERE id = ?`,
    [orderId],
    async (err, res) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error counting orders" });
      }
      await fetch(`http://localhost:${PORT}/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          orderId,
          amount,
          receipt: res?.[0]?.receipt || null,
        }),
      })
        .then((response) => response.json())
        .then((paymentResponse) => {
        console.log('paymentResponse:', paymentResponse)
        return paymentResponse
        });
    }
  );
}

function executeQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
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
          cart_id INT,
          status ENUM('pending', 'placed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
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
