const connection = require("../connection");
const cartTableName = "cart";
const cartItemsTableName = "cart_items";
const express = require("express");
const cartRouter = express.Router();
const { getUserIdFromToken } = require("./jwtService");

checkCartTableExistence();
checkCartItemsTable();

// Get cart details
cartRouter.get("/cart", (req, res) => {
  const userId = getUserIdFromToken(req);
  connection.query(
    `SELECT * FROM ${cartTableName} WHERE user_id = ?`,
    [userId],
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
cartRouter.get("/cart-items", (req, res) => {
  const userId = getUserIdFromToken(req);
  let cartId;
  connection.query(
    `SELECT * FROM ${cartTableName} WHERE user_id = ?`,
    [userId],
    async (err, results) => {
      if (err) {
        console.log("Error while getting cart details:", err);
        return res.status(400).json({
          status: 400,
          message: "Error while getting cart details",
        });
      }
      cartId = results[0]?.id || 0;
      await getCartItems(cartId, res);
    }
  );
});

async function getCartItems(cartId, res, message) {
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
          message: message,
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
                    delivery_charges: productDetail.delivery_charges,
                  }
                : null,
            };
          });

          // Step 4: Get the total count of cart items
          connection.query(
            `SELECT COUNT(*) AS totalCount FROM ${cartItemsTableName} WHERE cart_id = ?`,
            [cartId],
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
                message: message,
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

// Add cart items
cartRouter.post("/cart-items/add", (req, res) => {
  const userId = getUserIdFromToken(req, res);

  const { productId, price, discountPercentage, deliveryCharges } = req.body;
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

    let cartId = results.length > 0 ? results[0].id : null;

    if (!cartId) {
      // Create a new cart if none exists
      const createCartQuery = `INSERT INTO ${cartTableName} (user_id, total_price, total_items, total_delivery_charges) VALUES (?, 0, 0, 0)`;

      connection.query(createCartQuery, [userId], (err, result) => {
        if (err) {
          console.error("Error creating cart:", err);
          return res.status(400).json({
            status: 400,
            message: "Error creating cart",
          });
        }
        cartId = result.insertId;

        proceedWithCart(cartId);
      });
    } else {
      proceedWithCart(cartId);
    }
  });

  const proceedWithCart = (cartId) => {
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
          // Product exists in the cart, update quantity
          const existingQuantity = results[0].quantity;
          const updateCartItemQuery = `
            UPDATE ${cartItemsTableName} 
            SET quantity = ?, discount_price = ?, delivery_charges = ?
            WHERE id = ?
        `;

          connection.query(
            updateCartItemQuery,
            [
              existingQuantity + 1,
              discountPrice,
              deliveryCharges,
              results[0].id,
            ],
            (err) => {
              if (err) {
                console.error("Error updating cart item quantity:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error updating cart item quantity",
                });
              } else {
                updateCartTotal(cartId, async (err) => {
                  if (err) {
                    console.error("Error updating cart totals:", err);
                    return res.status(400).json({
                      status: 400,
                      message: "Error updating cart totals",
                    });
                  }
                  await getCartItems(
                    cartId,
                    res,
                    "Product quantity updated in cart."
                  );
                });
              }
            }
          );
        } else {
          // Product not in the cart, add it
          const addCartItemQuery = `INSERT INTO ${cartItemsTableName} (cart_id, product_id, quantity, price, discount_price, delivery_charges) VALUES (?, ?, ?, ?, ?, ?)`;

          connection.query(
            addCartItemQuery,
            [cartId, productId, 1, price, discountPrice, deliveryCharges],
            (err) => {
              if (err) {
                console.error("Error adding product to cart:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Failed to add product to cart",
                });
              }
              updateCartTotal(cartId, async (err) => {
                if (err) {
                  console.error("Error updating cart totals:", err);
                  return res.status(400).json({
                    status: 400,
                    message: "Error updating cart totals",
                  });
                }
                await getCartItems(cartId, res, "Product added to cart.");
              });
            }
          );
        }
      }
    );
  };
});

// Add in cart: Function to update the total price and total items count in the cart
function updateCartTotal(cartId, callback) {
  const updateCartQuery = `
    UPDATE ${cartTableName} 
    SET 
      total_price = (SELECT SUM(price * quantity) FROM ${cartItemsTableName} WHERE cart_id = ?),
      total_delivery_charges = (SELECT SUM(delivery_charges * quantity) FROM ${cartItemsTableName} WHERE cart_id = ?),
      total_discount_price = (SELECT SUM(discount_price * quantity) FROM ${cartItemsTableName} WHERE cart_id = ?),
      total_items = (SELECT SUM(quantity) FROM ${cartItemsTableName} WHERE cart_id = ?)
    WHERE id = ?`;

  connection.query(
    updateCartQuery,
    [cartId, cartId, cartId, cartId, cartId],
    (err) => {
      if (err) {
        console.error("Error updating cart totals:", err);
        return callback(err);
      } else {
        callback(null);
      }
    }
  );
}

// Remove an item from the user's cart
cartRouter.post("/cart-items/remove", (req, res) => {
  const userId = getUserIdFromToken(req, res);

  const { cartItemId } = req.body;
  // Step 1: Check if the user has an active cart
  const checkCartQuery = `SELECT id FROM ${cartTableName} WHERE user_id = ?`;
  connection.query(checkCartQuery, [userId], (err, cartResults) => {
    if (err) {
      console.error("Error checking user's cart:", err);
      return res.status(500).json({ status: 500, message: "Server error" });
    }

    if (cartResults.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No active cart found" });
    }

    const cartId = cartResults[0].id;

    // Step 2: Remove the specified product from the cart_items table
    const removeItemQuery = `DELETE FROM ${cartItemsTableName} WHERE cart_id = ? AND id = ?`;
    connection.query(removeItemQuery, [cartId, cartItemId], (err) => {
      if (err) {
        console.error("Error removing product from cart:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Failed to remove item" });
      }

      // Step 3: Check if there are any items left in the cart
      const countItemsQuery = `SELECT COUNT(*) AS itemCount FROM ${cartItemsTableName} WHERE cart_id = ?`;
      connection.query(countItemsQuery, [cartId], (err, countResults) => {
        if (err) {
          console.error("Error checking remaining items:", err);
          return res.status(500).json({ status: 500, message: "Server error" });
        }

        const itemCount = countResults[0].itemCount;

        if (itemCount === 0) {
          // Step 4: Delete the cart itself if it's empty
          const deleteCartQuery = `DELETE FROM ${cartTableName} WHERE id = ?`;
          connection.query(deleteCartQuery, [cartId], async (err) => {
            if (err) {
              console.error("Error deleting empty cart:", err);
              return res
                .status(500)
                .json({ status: 500, message: "Failed to delete cart" });
            }
            await getCartItems(
              cartId,
              res,
              "Product removed and cart deleted successfully"
            );
          });
        } else {
          // Step 5: If items remain, update the cart totals (if applicable)
          updateCartTotal(cartId, async (err) => {
            if (err) {
              console.error("Error updating cart totals:", err);
              return res
                .status(500)
                .json({ status: 500, message: "Failed to update totals" });
            }
            await getCartItems(cartId, res, "Product removed successfully");
          });
        }
      });
    });
  });
});

// Reduce the quantity of an item in the cart
cartRouter.post("/cart-items/reduce", (req, res) => {
  const userId = getUserIdFromToken(req, res);

  const { productId } = req.body;

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
            updateCartTotal(cartId, async (err) => {
              if (err) {
                console.error("Error updating cart totals:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error updating cart totals",
                });
              }
              await getCartItems(cartId, res, "Product removed from cart");
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
            updateCartTotal(cartId, async (err) => {
              if (err) {
                console.error("Error updating cart totals:", err);
                return res.status(400).json({
                  status: 400,
                  message: "Error updating cart totals",
                });
              }
              await getCartItems(
                cartId,
                res,
                "Product quantity reduced successfully"
              );
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
      const createQuery = `CREATE TABLE ${cartTableName} (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, total_price DECIMAL(10, 2) DEFAULT 0.00, total_delivery_charges DECIMAL(10, 2) DEFAULT 0.00, total_items INT DEFAULT 0,total_discount_price DECIMAL(10, 2) DEFAULT 0.00, discount INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id)
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
          delivery_charges DECIMAL(10, 2) DEFAULT 0.00,
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
module.exports = cartRouter;
