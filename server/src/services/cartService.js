const connection = require("../connection");
const cartTableName = "cart";
const cartItemsTableName = "cart_items";
const app = require("../app");
checkCartTableExistence();
checkCartItemsTable();

// Get cart details
app.get("/cart", (req, res) => {
  connection.query(`SELECT * FROM ${cartTableName}`, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Error while getting cart details" });
    }

    // Query to get the total count of users
    connection.query(
      `SELECT COUNT(*) AS totalCount FROM ${cartTableName}`,
      (countErr, countResult) => {
        if (countErr) {
          return res.status(400).json({
            status: 400,
            message: "Error while counting cart details",
          });
        }
        const totalCount = countResult[0].totalCount;

        return res.status(200).json({
          status: 200,
          data: result,
          totalCount: totalCount,
        });
      }
    );
  });
});

// Get cart Items
app.get("/cart_items", (req, res) => {
  const { id } = req.query;
  const limit = parseInt(pageSize);
  const offset = (parseInt(pageNumber) - 1) * limit;

  connection.query(
    `SELECT * FROM ${cartItemsTableName} WHERE cart_id = ?`,
    [id],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while getting cart items" });
      }

      // Query to get the total count of users
      connection.query(
        `SELECT COUNT(*) AS totalCount FROM ${cartItemsTableName}`,
        (countErr, countResult) => {
          if (countErr) {
            return res.status(400).json({
              status: 400,
              message: "Error while counting cart items",
            });
          }
          const totalCount = countResult[0].totalCount;

          return res.status(200).json({
            status: 200,
            data: result,
            totalCount: totalCount,
          });
        }
      );
    }
  );
});

// Add cart items
app.post("/cart-items/add", (req, res) => {
  const { userId, productId, quantity, price, discountPrice } = req.body;
  // Step 1: Check if the user already has an active cart
  const checkCartQuery = `SELECT id FROM ${cartTableName} WHERE user_id = ? AND total_items > 0`;

  connection.query(checkCartQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user's cart:", err);
      return;
    }
    let cartId;
    if (results.length > 0) {
      // If the user already has an active cart, use the existing cart ID
      cartId = results[0].id;
      console.log(`Cart exists for user ${userId}, cart ID: ${cartId}`);
    } else {
      // If no active cart exists, create a new cart
      const createCartQuery = `INSERT INTO ${cartTableName} (user_id, total_price, total_items) VALUES (?, 0, 0)`;

      connection.query(createCartQuery, [userId], (err, result) => {
        if (err) {
          console.error("Error creating cart:", err);
          return;
        }
        cartId = result.insertId;
        console.log(`Cart created for user ${userId}, cart ID: ${cartId}`);
      });
    }

    // Step 2: Check if the product is already in the user's cart
    const checkProductInCartQuery = ` SELECT id, quantity FROM ${cartItemsTableName} WHERE cart_id = ? AND product_id = ?`;

    connection.query(
      checkProductInCartQuery,
      [cartId, productId],
      (err, results) => {
        if (err) {
          console.error("Error checking product in cart:", err);
          return;
        }

        if (results.length > 0) {
          // If product already exists in the cart, update the quantity
          const existingQuantity = results[0].quantity;
          const updateCartItemQuery = `
              UPDATE ${cartItemsTableName} 
              SET quantity = ?, discount_price = ?
              WHERE id = ?
          `;

          connection.query(
            updateCartItemQuery,
            [existingQuantity + quantity, discountPrice, results[0].id],
            (err) => {
              if (err) {
                console.error("Error updating cart item quantity:", err);
              } else {
                console.log(
                  `Updated cart item quantity for product ID ${productId}`
                );
              }
            }
          );
        } else {
          // If the product is not in the cart, add it
          const addCartItemQuery = `INSERT INTO ${cartItemsTableName} (cart_id, product_id, quantity, price, discount_price) VALUES (?, ?, ?, ?, ?)`;

          connection.query(
            addCartItemQuery,
            [cartId, productId, quantity, price, discountPrice],
            (err) => {
              if (err) {
                console.error("Error adding product to cart:", err);
                return res
                  .status(400)
                  .json({
                    status: 400,
                    message: "Failed to add product in cart",
                  });
              } else {
                // Return the final response
                return res
                  .status(200)
                  .json({ status: 200, data: allCategories });
              }
            }
          );
        }

        // Step 3: Update the cart total price and item count
        updateCartTotal(cartId);
      }
    );
  });
});

// Add in cart: Function to update the total price and total items count in the cart
function updateCartTotal(cartId) {
  const updateCartQuery = `UPDATE ${cartTableName} SET total_price = (SELECT SUM(price * quantity) FROM cart_items WHERE cart_id = ?), total_items = (SELECT SUM(quantity) FROM cart_items WHERE cart_id = ?) WHERE id = ?`;

  connection.query(updateCartQuery, [cartId, cartId, cartId], (err) => {
    if (err) {
      console.error("Error updating cart totals:", err);
    } else {
      res.console.log("Cart totals updated successfully.");
    }
  });
}

function checkCartTableExistence() {
  // Checked and created users table if it does not exist
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [cartTableName], (err, results) => {
    if (err) {
      console.error("Error checking table existence:", results?.[0]?.count);
      return;
    }

    // If the table does not exist, create it
    if (results && results?.length && results[0].count === 0) {
      // Table creation query
      const createQuery = `CREATE TABLE ${cartTableName} (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, total_price DECIMAL(10, 2) DEFAULT 0.00, total_items INT DEFAULT 0,total_discount_price DECIMAL(10, 2) DEFAULT 0.00, discount INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id)
)`;

      connection.query(createQuery, (err) => {
        if (err) {
          console.error(`Error creating ${cartTableName} table: ${err}`);
        } else {
          console.log(`${cartTableName} table created successfully.`);
        }
      });
    } else {
      console.log(`${cartTableName} table already exists.`);
    }
  });
}

function checkCartItemsTable() {
  const checkCartItemsTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(
    checkCartItemsTableQuery,
    [cartItemsTableName],
    (err, results) => {
      if (err) {
        console.error(
          `Error checking ${cartItemsTableName} table existence:`,
          err
        );
        return;
      }

      if (results && results.length && results[0].count === 0) {
        // Create cart_items table if it doesn't exist
        const createCartItemsTableQuery = `
        CREATE TABLE ${cartItemsTableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cart_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT DEFAULT 1,
          price DECIMAL(10, 2) NOT NULL,
          discount_price DECIMAL(10, 2) DEFAULT 0.00,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (cart_id) REFERENCES cart(id),
          FOREIGN KEY (product_id) REFERENCES products(product_id)
        )`;

        connection.query(createCartItemsTableQuery, (err) => {
          if (err) {
            console.error(`Error creating ${cartItemsTableName} table:`, err);
          } else {
            console.log(`${cartItemsTableName} table created successfully.`);
          }
        });
      } else {
        console.log(`${cartItemsTableName} table already exists.`);
      }
    }
  );
}
