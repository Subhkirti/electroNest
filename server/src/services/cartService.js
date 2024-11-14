const connection = require("../connection");
const cartTableName = "cart";
const cartItemsTableName = "cart_items";
const app = require("../app");
checkCartTableExistence();
checkCartItemsTable();

// Get cart details
app.get("/cart", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "User Id not found in request" });
  }

  connection.query(
    `SELECT * FROM ${cartTableName} WHERE user_id = ?`,
    [id],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while getting cart details" });
      }

      return res.status(200).json({
        status: 200,
        data: result?.[0],
      });
    }
  );
});

// Get cart Items
app.get("/cart_items", (req, res) => {
  const { id } = req.query;
  let cartId;
  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "Cart Id not found in request" });
  }

  connection.query(
    `SELECT * FROM ${cartTableName} WHERE user_id = ?`,
    [id],
    (err, results) => {
      if (err) {
        console.log("Error while getting cart details:", err);
        return res.status(400).json({
          status: 400,
          message: "Error while getting cart details",
        });
      }
      cartId = results[0]?.id || 0;
      // Step 1: Get all cart items for the given cart_id
      connection.query(
        `SELECT * FROM ${cartItemsTableName} WHERE cart_id = ?`,
        [cartId],
        (err, cartItems) => {
          if (err) {
            console.log("Error while getting cart items:", err);
            return res.status(400).json({
              status: 400,
              message: "Error while getting cart items",
            });
          }

          if (cartItems.length === 0) {
            return res.status(200).json({
              status: 200,
              data: [],
              totalCount: 0,
            });
          }

          // Step 2: Get product details for each cart item (based on product_id)
          const productIds = cartItems.map((item) => item.product_id);

          connection.query(
            `SELECT * FROM products WHERE product_id IN (?)`,
            [productIds],
            (err, productDetails) => {
              if (err) {
                console.log("Error while getting product details:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error while getting product details",
                });
              }

              // Step 3: Map product details to each cart item
              const cartItemsWithDetails = cartItems.map((item) => {
                const productDetail = productDetails.find(
                  (product) => product.product_id === item.product_id
                );

                return {
                  ...item,
                  product_details: productDetail
                    ? {
                        product_id: productDetail.product_id,
                        product_name: productDetail.product_name,
                        description: productDetail.description,
                        net_price: productDetail.net_price,
                        price: productDetail.price,
                        discount_percentage: productDetail.discount_percentage,
                        brand: productDetail.brand,
                        color: productDetail.color,
                        size: productDetail.size,
                        stock: productDetail.stock,
                        rating: productDetail.rating,
                        reviews: productDetail.reviews,
                        warranty_info: productDetail.warranty_info,
                        return_policy: productDetail.return_policy,
                        images: productDetail.images,
                        category_id: productDetail.category_id,
                        section_id: productDetail.section_id,
                        item_id: productDetail.item_id,
                      }
                    : null, // If no matching product found, set `product_details` to null
                };
              });

              // Step 4: Get the total count of cart items
              connection.query(
                `SELECT COUNT(*) AS totalCount FROM ${cartItemsTableName} WHERE cart_id = ?`,
                [id],
                (countErr, countResult) => {
                  if (countErr) {
                    return res.status(400).json({
                      status: 400,
                      message: "Error while counting cart items",
                    });
                  }
                  const totalCount = countResult[0].totalCount;

                  // Return the cart items along with product details in the response
                  return res.status(200).json({
                    status: 200,
                    data: cartItemsWithDetails,
                    totalCount: totalCount,
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

// Add cart items
app.post("/cart-items/add", (req, res) => {
  const { userId, productId, price, discountPercentage, deliveryCharges } = req.body;
  const discountPrice = (price * discountPercentage) / 100;
  // Step 1: Check if the user already has an active cart
  const checkCartQuery = `SELECT id FROM ${cartTableName} WHERE user_id = ? AND total_items > 0`;

  connection.query(checkCartQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user's cart:", err);
      return res.status(400).json({
        status: 400,
        message: "Error checking user's cart",
      });
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
          return res.status(400).json({
            status: 400,
            message: "Error creating cart",
          });
        }
        cartId = result.insertId;
        console.log(`Cart created for user ${userId}, cart ID: ${cartId}`);
      });
    }

    // Step 2: Check if the product is already in the user's cart
    const checkProductInCartQuery = `SELECT * FROM ${cartItemsTableName} WHERE cart_id = ? AND product_id = ?`;

    connection.query(
      checkProductInCartQuery,
      [cartId, productId],
      (err, results) => {
        if (err) {
          console.error("Error checking product in cart:", err);
          return res.status(400).json({
            status: 400,
            message: "Error checking product in cart",
          });
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
            [existingQuantity + 1, discountPrice, results[0].id],
            (err) => {
              if (err) {
                console.error("Error updating cart item quantity:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error updating cart item quantity",
                });
              } else {
                console.log(
                  `Updated cart item quantity for product ID ${productId}`
                );
                // Now, return a single response after the update
                updateCartTotal(cartId, (err) => {
                  if (err) {
                    console.error("Error updating cart totals:", err);
                    return res.status(400).json({
                      status: 400,
                      message: "Error updating cart totals",
                    });
                  }
                  connection.query(
                    `SELECT * FROM ${cartItemsTableName} WHERE id = ?`,
                    [results?.[0]?.id],
                    (err, results) => {
                      if (err) {
                        console.error("Error finding cart items details:", err);
                        return res.status(400).json({
                          status: 400,
                          message: "Error finding cart items details",
                        });
                      }
                      res.status(200).json({
                        status: 200,
                        data: results,
                        message: "Cart item added successfully",
                      });
                    }
                  );
                });
              }
            }
          );
        } else {
          // If the product is not in the cart, add it
          const addCartItemQuery = `INSERT INTO ${cartItemsTableName} (cart_id, product_id, quantity, price, discount_price) VALUES (?, ?, ?, ?, ?)`;

          connection.query(
            addCartItemQuery,
            [cartId, productId, 1, price, discountPrice],
            (err, cartItemsResults) => {
              if (err) {
                console.error("Error adding product to cart:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Failed to add product in cart",
                });
              } else {
                // Now, update the cart totals after adding the new item
                updateCartTotal(cartId, (err) => {
                  if (err) {
                    console.error("Error updating cart totals:", err);
                    return res.status(400).json({
                      status: 400,
                      message: "Error updating cart totals",
                    });
                  }
                  console.log("cartItemsResults:", cartItemsResults.id);

                  connection.query(
                    `SELECT * FROM ${cartItemsTableName} WHERE id = ?`,
                    [cartItemsResults?.id],
                    (err, results) => {
                      if (err) {
                        console.error("Error finding cart items details:", err);
                        return res.status(400).json({
                          status: 400,
                          message: "Error finding cart items details",
                        });
                      }
                      res.status(200).json({
                        status: 200,
                        data: results,
                        message: "Cart item added successfully",
                      });
                    }
                  );
                });
              }
            }
          );
        }
      }
    );
  });
});

// Add in cart: Function to update the total price and total items count in the cart
app.post("/cart-items/add", (req, res) => {
  const {
    userId,
    productId,
    price,
    discountPercentage,
    deliveryCharges,
  } = req.body;
  const discountPrice = (price * discountPercentage) / 100;

  // Step 1: Check if the user already has an active cart
  const checkCartQuery = `SELECT id, delivery_charges FROM ${cartTableName} WHERE user_id = ? AND total_items > 0`;

  connection.query(checkCartQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user's cart:", err);
      return res.status(400).json({
        status: 400,
        message: "Error checking user's cart",
      });
    }

    let cartId;
    if (results.length > 0) {
      // If the user already has an active cart, use the existing cart ID
      cartId = results[0].id;
      console.log(`Cart exists for user ${userId}, cart ID: ${cartId}`);
    } else {
      // If no active cart exists, create a new cart with deliveryCharges
      const createCartQuery = `
        INSERT INTO ${cartTableName} (user_id, total_price, total_items, delivery_charges) 
        VALUES (?, 0, 0, ?)
      `;
      connection.query(createCartQuery, [userId, deliveryCharges], (err, result) => {
        if (err) {
          console.error("Error creating cart:", err);
          return res.status(400).json({
            status: 400,
            message: "Error creating cart",
          });
        }
        cartId = result.insertId;
        console.log(`Cart created for user ${userId}, cart ID: ${cartId}`);
      });
    }

    // Step 2: Check if the product is already in the user's cart
    const checkProductInCartQuery = `SELECT * FROM ${cartItemsTableName} WHERE cart_id = ? AND product_id = ?`;

    connection.query(
      checkProductInCartQuery,
      [cartId, productId],
      (err, results) => {
        if (err) {
          console.error("Error checking product in cart:", err);
          return res.status(400).json({
            status: 400,
            message: "Error checking product in cart",
          });
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
            [existingQuantity + 1, discountPrice, results[0].id],
            (err) => {
              if (err) {
                console.error("Error updating cart item quantity:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error updating cart item quantity",
                });
              } else {
                console.log(
                  `Updated cart item quantity for product ID ${productId}`
                );
                updateCartTotal(cartId, deliveryCharges, (err) => {
                  if (err) {
                    console.error("Error updating cart totals:", err);
                    return res.status(400).json({
                      status: 400,
                      message: "Error updating cart totals",
                    });
                  }
                  res.status(200).json({
                    status: 200,
                    message: "Cart item updated successfully",
                  });
                });
              }
            }
          );
        } else {
          // If the product is not in the cart, add it
          const addCartItemQuery = `INSERT INTO ${cartItemsTableName} (cart_id, product_id, quantity, price, discount_price) VALUES (?, ?, ?, ?, ?)`;

          connection.query(
            addCartItemQuery,
            [cartId, productId, 1, price, discountPrice],
            (err) => {
              if (err) {
                console.error("Error adding product to cart:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Failed to add product in cart",
                });
              }
              updateCartTotal(cartId, deliveryCharges, (err) => {
                if (err) {
                  console.error("Error updating cart totals:", err);
                  return res.status(400).json({
                    status: 400,
                    message: "Error updating cart totals",
                  });
                }
                res.status(200).json({
                  status: 200,
                  message: "Cart item added successfully",
                });
              });
            }
          );
        }
      }
    );
  });
});

// Helper function to update the cart total
function updateCartTotal(cartId, deliveryCharges, callback) {
  const updateCartQuery = `
    UPDATE ${cartTableName} 
    SET total_price = (
      SELECT SUM((price - discount_price) * quantity) 
      FROM ${cartItemsTableName} 
      WHERE cart_id = ?
    ) + ?, total_items = (
      SELECT SUM(quantity) FROM ${cartItemsTableName} WHERE cart_id = ?
    )
    WHERE id = ?
  `;

  connection.query(
    updateCartQuery,
    [cartId, deliveryCharges, cartId, cartId],
    (err) => {
      if (err) {
        console.error("Error updating cart totals:", err);
        return callback(err);
      }
      callback(null);
    }
  );
}


// Remove an item from the cart
app.post("/cart-items/remove", (req, res) => {
  const { userId, productId } = req.body;

  // Step 1: Check if the user has an active cart
  const checkCartQuery = `SELECT id FROM ${cartTableName} WHERE user_id = ? AND total_items > 0`;

  connection.query(checkCartQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user's cart:", err);
      return res.status(400).json({
        status: 400,
        message: "Error checking user's cart",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No active cart found for the user",
      });
    }

    const cartId = results?.[0]?.id || 0;

    // Step 2: Check if the product exists in the user's cart
    const checkProductInCartQuery = `SELECT * FROM ${cartItemsTableName} WHERE cart_id = ? AND product_id = ?`;

    connection.query(
      checkProductInCartQuery,
      [cartId, productId],
      (err, results) => {
        if (err) {
          console.error("Error checking product in cart:", err);
          return res.status(400).json({
            status: 400,
            message: "Error checking product in cart",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: 404,
            message: "Product not found in the cart",
          });
        }
        const cartItemId = results?.[0]?.id || 0;
        // Step 3: Remove the product from the cart
        const removeCartItemQuery = `DELETE FROM ${cartItemsTableName} WHERE cart_id = ? AND product_id = ?`;

        connection.query(
          removeCartItemQuery,
          [cartId, productId],
          (err, results) => {
            if (err) {
              console.error("Error removing product from cart:", err);
              return res.status(400).json({
                status: 400,
                message: "Error removing product from cart",
              });
            }

            // Step 4: Update the cart totals after removal
            updateCartTotal(cartId, (err) => {
              if (err) {
                console.error("Error updating cart totals:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error updating cart totals",
                });
              }

              res.status(200).json({
                status: 200,
                data: cartItemId,
                message: "Product removed from cart successfully",
              });
            });
          }
        );
      }
    );
  });
});

// Reduce the quantity of an item in the cart
app.post("/cart-items/reduce", (req, res) => {
  const { userId, productId } = req.body;

  // Step 1: Check if the user has an active cart
  const checkCartQuery = `SELECT id FROM ${cartTableName} WHERE user_id = ? AND total_items > 0`;

  connection.query(checkCartQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user's cart:", err);
      return res.status(400).json({
        status: 400,
        message: "Error checking user's cart",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No active cart found for the user",
      });
    }

    const cartId = results[0].id;

    // Step 2: Check if the product exists in the user's cart
    const checkProductInCartQuery = `SELECT * FROM ${cartItemsTableName} WHERE cart_id = ? AND product_id = ?`;

    connection.query(
      checkProductInCartQuery,
      [cartId, productId],
      (err, results) => {
        if (err) {
          console.error("Error checking product in cart:", err);
          return res.status(400).json({
            status: 400,
            message: "Error checking product in cart",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: 404,
            message: "Product not found in the cart",
          });
        }

        const cartItem = results[0];
        const currentQuantity = cartItem.quantity;

        if (currentQuantity <= 1) {
          // If quantity is 1, remove the product from the cart
          const removeCartItemQuery = `DELETE FROM ${cartItemsTableName} WHERE cart_id = ? AND product_id = ?`;

          connection.query(removeCartItemQuery, [cartId, productId], (err) => {
            if (err) {
              console.error("Error removing product from cart:", err);
              return res.status(400).json({
                status: 400,
                message: "Error removing product from cart",
              });
            }

            // Update cart totals after removal
            updateCartTotal(cartId, (err) => {
              if (err) {
                console.error("Error updating cart totals:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error updating cart totals",
                });
              }

              res.status(200).json({
                status: 200,
                message: "Product removed from cart",
              });
            });
          });
        } else {
          // If quantity is greater than 1, reduce the quantity by 1
          const updateCartItemQuery = `
          UPDATE ${cartItemsTableName} 
          SET quantity = quantity - 1 
          WHERE cart_id = ? AND product_id = ?`;

          connection.query(updateCartItemQuery, [cartId, productId], (err) => {
            if (err) {
              console.error("Error reducing cart item quantity:", err);
              return res.status(400).json({
                status: 400,
                message: "Error reducing cart item quantity",
              });
            }

            // Update cart totals after quantity reduction
            updateCartTotal(cartId, (err) => {
              if (err) {
                console.error("Error updating cart totals:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error updating cart totals",
                });
              }

              res.status(200).json({
                status: 200,
                message: "Product quantity reduced successfully",
                data: cartId,
              });
            });
          });
        }
      }
    );
  });
});

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
