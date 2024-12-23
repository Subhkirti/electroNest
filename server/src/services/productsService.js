const connection = require("../connection");
const tableName = "products";
const wishlistTableName = "wishlist";
const topLevelCateTableName = "top_level_categories"; // also known as categories
const secondLevelCateTableName = "second_level_categories"; // also known as sections
const thirdLevelCateTableName = "third_level_categories"; // also known as items
const express = require("express");
const productsRouter = express.Router();
const { getUserIdFromToken } = require("./jwtService");

createProductCateSectionItemsTable();

productsRouter.post("/product/categories/sections/items", (req, res) => {
  const { categories } = req.body;

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Transaction error" });
    }

    const categoryInsertPromises = categories.map((category) => {
      const category_id = generateSlug(category.name);
      const { sections } = category;

      // Insert the category
      return new Promise((resolve, reject) => {
        const insertCategoryQuery = `INSERT INTO ${topLevelCateTableName} (category_id, category_name) VALUES (?, ?)`;
        connection.query(
          insertCategoryQuery,
          [category_id, category.name],
          (err) => {
            if (err) return reject(err);

            // Insert sections
            const sectionInsertPromises = sections.map((section) => {
              const section_id = generateSlug(section.name);
              return new Promise((resolveSection, rejectSection) => {
                const insertSectionQuery = `INSERT INTO ${secondLevelCateTableName} (section_id, section_name, category_id) VALUES (?, ?, ?)`;
                connection.query(
                  insertSectionQuery,
                  [section_id, section.name, category_id],
                  (err) => {
                    if (err) return rejectSection(err);

                    // Insert items for the section
                    const itemInsertPromises = section.items.map((item) => {
                      const item_id = generateSlug(item.name);
                      return new Promise((resolveItem, rejectItem) => {
                        const insertItemQuery = `INSERT INTO ${thirdLevelCateTableName} (item_id, item_name, section_id) VALUES (?, ?, ?)`;
                        connection.query(
                          insertItemQuery,
                          [item_id, item.name, section_id],
                          (err) => {
                            if (err) return rejectItem(err);
                            resolveItem();
                          }
                        );
                      });
                    });

                    // Wait for all item insertions
                    Promise.all(itemInsertPromises)
                      .then(() => resolveSection())
                      .catch(rejectSection);
                  }
                );
              });
            });

            // Wait for all sections to be inserted
            Promise.all(sectionInsertPromises)
              .then(() => resolve())
              .catch(reject);
          }
        );
      });
    });

    // Wait for all category insertions to finish
    Promise.all(categoryInsertPromises)
      .then(() => {
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              console.error("Error committing transaction:", err);
              return res
                .status(500)
                .json({ status: 500, message: "Transaction commit error" });
            });
          }
          return res
            .status(200)
            .json({ status: 200, message: "Data inserted successfully." });
        });
      })
      .catch((err) => {
        return connection.rollback(() => {
          console.error(
            "Error while inserting categories, sections, or items:",
            err
          );
          return res.status(400).json({
            status: 400,
            message: "Error while inserting categories, sections, or items",
          });
        });
      });
  });
});

// Get all categories data
productsRouter.get("/product/categories", (req, res) => {
  // Query to get all top-level categories
  const getCategoriesQuery = `SELECT * FROM ${topLevelCateTableName}`;

  connection.query(getCategoriesQuery, (err, categories) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({
        status: 500,
        message: "Error fetching categories" + err,
      });
    }

    // Fetch the sections for each category
    const categoryPromises = categories.map((category) => {
      return new Promise((resolveCategory, rejectCategory) => {
        const categoryId = category.category_id;

        // Query to get sections for each category
        const getSectionsQuery = `SELECT * FROM ${secondLevelCateTableName} WHERE category_id = ?`;

        connection.query(getSectionsQuery, [categoryId], (err, sections) => {
          if (err) {
            console.error(
              "Error fetching sections for category:",
              categoryId,
              err
            );
            return rejectCategory(err);
          }

          // Fetch items for each section
          const sectionPromises = sections.map((section) => {
            return new Promise((resolveSection, rejectSection) => {
              const sectionId = section.section_id;

              // Query to get items for each section
              const getItemsQuery = `SELECT * FROM ${thirdLevelCateTableName} WHERE section_id = ?`;

              connection.query(getItemsQuery, [sectionId], (err, items) => {
                if (err) {
                  console.error(
                    "Error fetching items for section:",
                    sectionId,
                    err
                  );
                  return rejectSection(err);
                }

                // Map items to the required structure
                section.items = items.map((item) => ({
                  id: item.item_id,
                  name: item.item_name,
                }));

                resolveSection(section);
              });
            });
          });

          // Wait for all sections to be processed
          Promise.all(sectionPromises)
            .then((resolvedSections) => {
              // Map sections to the required structure
              category.sections = resolvedSections.map((section) => ({
                id: section.section_id,
                name: section.section_name,
                items: section.items,
              }));

              resolveCategory(category);
            })
            .catch(rejectCategory);
        });
      });
    });

    // Wait for all categories to be processed
    Promise.all(categoryPromises)
      .then((resolvedCategories) => {
        // Map categories to the required structure
        const allCategories = resolvedCategories.map((category) => ({
          id: category.category_id,
          name: category.category_name,
          sections: category.sections,
        }));

        // Return the final response
        return res.status(200).json({ status: 200, data: allCategories });
      })
      .catch((err) => {
        console.error("Error getting categories:", err);
        return res.status(500).json({
          status: 500,
          message: "Error getting categories: categories",
        });
      });
  });
});

/* Set products list */
productsRouter.post("/product/add", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const {
      images,
      brand,
      title,
      color,
      size,
      description,
      price,
      quantity,
      disPercentage,
      topLevelCategory,
      secondLevelCategory,
      thirdLevelCategory,
      stock,
      rating,
      warrantyInfo,
      returnPolicy,
      deliveryCharges,
    } = req.body;

    const netPrice =
      Number(price) - Number(price) * (Number(disPercentage) / 100);
    connection.query(
      `INSERT INTO ${tableName} (product_name, description, price, discount_percentage, net_price, brand, color, size, images, category_id, section_id, item_id, quantity, stock, rating, reviews, warranty_info, return_policy, delivery_charges) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        title,
        description,
        price,
        disPercentage,
        netPrice,
        brand,
        color,
        size,
        JSON.stringify(images),
        topLevelCategory,
        secondLevelCategory,
        thirdLevelCategory,
        quantity,
        stock,
        rating,
        JSON.stringify([]),
        warrantyInfo,
        returnPolicy,
        deliveryCharges,
      ],
      (err, result) => {
        if (err) {
          console.log("err:", err);
          return res
            .status(400)
            .json({ status: 400, message: "Error while adding product" });
        } else {
          const productId = result.insertId;
          // give product details
          connection.query(
            `SELECT * FROM ${tableName} WHERE product_id = ?`,
            [productId],
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  status: 400,
                  message: "Error checking product",
                });
              }
              if (!result.length) {
                return res.status(400).json({
                  status: 400,
                  message: "Failed to get product",
                });
              }
              return res.status(200).json({ status: 200, data: result[0] });
            }
          );
        }
      }
    );
  }
});

/* Edit product details */
productsRouter.post("/product/edit", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const productId = req.query?.id;
    const {
      images,
      brand,
      title,
      color,
      size,
      description,
      price,
      quantity,
      disPercentage,
      topLevelCategory,
      secondLevelCategory,
      thirdLevelCategory,
      stock,
      rating,
      warrantyInfo,
      returnPolicy,
      deliveryCharges,
    } = req.body;
    const netPrice =
      Number(price) - Number(price) * (Number(disPercentage) / 100);
    connection.query(
      `UPDATE ${tableName} SET product_name = ?, description = ?, price = ?, discount_percentage = ?, net_price = ?, brand = ?, color = ?, size = ?, images = ?, category_id = ?, section_id = ?, item_id = ?, quantity = ?, stock = ?, rating = ?, reviews = ?, warranty_info = ?, return_policy = ?, delivery_charges = ? WHERE product_id = ?`,
      [
        title,
        description,
        price,
        disPercentage,
        netPrice,
        brand,
        color,
        size,
        JSON.stringify(images),
        topLevelCategory,
        secondLevelCategory,
        thirdLevelCategory,
        quantity,
        stock,
        rating,
        JSON.stringify([]),
        warrantyInfo,
        returnPolicy,
        deliveryCharges,
        productId,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ status: 400, message: "Error while updating product" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: 404,
            message: "Product not found",
          });
        }

        // return the updated product details
        connection.query(
          `SELECT * FROM ${tableName} WHERE product_id = ?`,
          [productId],
          (err, result) => {
            if (err) {
              return res.status(400).json({
                status: 400,
                message: "Error fetching updated product",
              });
            }
            return res.status(200).json({ status: 200, data: result[0] });
          }
        );
      }
    );
  }
});

/* Delete product */
productsRouter.delete("/product/delete", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const { id } = req.query;
    if (!id) {
      return res
        .status(400)
        .json({ status: 400, message: "Product Id not found in request" });
    }
    connection.query(
      `DELETE FROM ${tableName} WHERE product_id = ?`,
      [parseInt(id)],
      (err) => {
        if (err) {
          return res
            .status(400)
            .json({ status: 400, message: "Error while getting products" });
        }
        return res
          .status(200)
          .json({ status: 200, data: "Product deleted successfully" });
      }
    );
  }
});

/* Get product details by id */
productsRouter.get("/product-details", (req, res) => {
  const userId = getUserIdFromToken(req);
  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "Product Id not found in request" });
  }
  const query = `
    SELECT p.*, 
     CASE 
             WHEN ? IS NOT NULL AND w.user_id = ? THEN true 
             ELSE false 
           END AS is_liked
    FROM ${tableName} p
    LEFT JOIN ${wishlistTableName} w ON p.product_id = w.product_id AND w.user_id = ? WHERE p.product_id = ?
  `;

  const queryParams = [userId, userId, userId, id];

  connection.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error while getting product details:", err);
      return res.status(400).json({
        status: 400,
        message: "Error while getting product details",
      });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    }

    return res.status(200).json({ status: 200, data: result });
  });
});

/* Get products list */

productsRouter.get("/products", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const { pageNumber, pageSize } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(pageNumber) - 1) * limit;

    /* Count query */
    connection.query(
      `SELECT COUNT(*) as totalCount FROM ${tableName}`,
      (err, countResult) => {
        if (err) {
          return res
            .status(400)
            .json({ status: 400, message: "Error while counting products" });
        }

        const totalCount = countResult[0].totalCount;

        /* Get Products with wishlist status */
        const query = `
        SELECT p.*, 
               CASE 
                 WHEN w.user_id = ? THEN true 
                 ELSE false 
               END AS is_liked
        FROM ${tableName} p
        LEFT JOIN ${wishlistTableName} w 
        ON p.product_id = w.product_id AND w.user_id = ?
        LIMIT ? OFFSET ?`;

        connection.query(
          query,
          [userId, userId, limit, offset],
          (err, result) => {
            if (err) {
              return res
                .status(400)
                .json({ status: 400, message: "Error while getting products" });
            }

            return res.status(200).json({
              status: 200,
              data: result,
              totalCount: totalCount,
            });
          }
        );
      }
    );
  }
});

/* Find products on the basis of filters */
productsRouter.post("/find-products", (req, res) => {
  const userId = getUserIdFromToken(req);
  const {
    categoryId,
    sectionId,
    itemId,
    colors,
    minPrice,
    maxPrice,
    discount,
    stock,
    sort,
    pageNumber,
    pageSize,
    searchQuery,
  } = req.body;

  const limit = parseInt(pageSize);
  const offset = (parseInt(pageNumber) - 1) * limit;

  let queryParams = [];
  let whereClauses = [];

  // Handling colors filter
  if (colors && colors.length > 0) {
    whereClauses.push("color IN (?)");
    queryParams.push(colors);
  }

  // Handling minPrice filter
  if (minPrice && minPrice.length > 0) {
    whereClauses.push("net_price >= ?");
    queryParams.push(Math.min(...minPrice));
  }

  // Handling maxPrice filter
  if (maxPrice && maxPrice.length > 0) {
    whereClauses.push("net_price <= ?");
    queryParams.push(Math.max(...maxPrice));
  }

  // Handling discount filter
  if (discount && discount.length > 0) {
    const discountConditions = discount.map((d) => `discount_percentage >= ?`);
    whereClauses.push(`(${discountConditions.join(" OR ")})`);
    discount.forEach((d) => queryParams.push(parseInt(d)));
  }

  if (stock) {
    if (stock == "out_of_stock") {
      whereClauses.push("stock <= 0");
    } else {
      whereClauses.push("stock > 0");
    }
  }

  let orderByClause = "";
  if (sort) {
    if (sort === "low_to_high") {
      orderByClause = "ORDER BY net_price ASC";
    } else if (sort === "high_to_low") {
      orderByClause = "ORDER BY net_price DESC";
    }
  }

  // Handling category filter
  if (categoryId) {
    whereClauses.push("category_id = ?");
    queryParams.push(categoryId);
  }

  // Handling section filter
  if (sectionId) {
    whereClauses.push("section_id = ?");
    queryParams.push(sectionId);
  }

  // Handling item filter
  if (itemId) {
    whereClauses.push("item_id = ?");
    queryParams.push(itemId);
  }

  if (searchQuery) {
    whereClauses.push("(product_name LIKE ? OR description LIKE ?)");
    const likeQuery = `%${searchQuery}%`;
    queryParams.push(likeQuery, likeQuery);
  }

  // Create the SQL query with dynamic WHERE clauses
  let query = `
    SELECT p.*, 
           CASE 
             WHEN ? IS NOT NULL AND w.user_id = ? THEN true 
             ELSE false 
           END AS is_liked
    FROM ${tableName} p
    LEFT JOIN ${wishlistTableName} w 
    ON p.product_id = w.product_id AND w.user_id = ?
  `;

  queryParams.unshift(userId, userId, userId);

  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  if (orderByClause) {
    query += ` ${orderByClause}`;
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  connection.query(query, queryParams, (err, result) => {
    if (err) {
      console.log("err:", err);
      return res
        .status(400)
        .json({ status: 400, message: "Error while getting products" });
    }

    // Optional: get the total count of products matching the filter criteria
    const countQuery = `
      SELECT COUNT(*) AS totalCount
      FROM ${tableName} p
      ${whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : ""}
    `;

    connection.query(
      countQuery,
      queryParams.slice(3, -2), // Exclude userId and pagination parameters
      (countErr, countResult) => {
        if (countErr) {
          console.log("countErr:", countErr);
          return res.status(400).json({
            status: 400,
            message: "Error while getting total count",
          });
        }

        return res.status(200).json({
          status: 200,
          data: result,
          totalCount: countResult[0].totalCount,
        });
      }
    );
  });
});

/* Get top level categories list */
productsRouter.get("/top-level-categories", (req, res) => {
  const { pageNumber, pageSize } = req.query;
  const limit = parseInt(pageSize);
  const offset = (parseInt(pageNumber) - 1) * limit;
  const selectQuery = pageNumber
    ? `SELECT * FROM ${topLevelCateTableName} LIMIT ? OFFSET ?`
    : `SELECT * FROM ${topLevelCateTableName}`;
  /* Count query */
  connection.query(
    `SELECT COUNT(*) as totalCount FROM ${topLevelCateTableName}`,
    (err, countResult) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: "Error while counting top level categories",
        });
      }

      const totalCount = countResult[0].totalCount;
      /* Get top level categories query */
      connection.query(selectQuery, [limit, offset], (err, result) => {
        if (err) {
          return res.status(400).json({
            status: 400,
            message: "Error while getting top level categories",
          });
        }

        return res.status(200).json({
          status: 200,
          data: result,
          totalCount: totalCount,
        });
      });
    }
  );
});

/* Get second level categories list */
productsRouter.get("/second-level-categories", (req, res) => {
  const { pageNumber, pageSize, categoryId } = req.query;
  const limit = parseInt(pageSize);
  const offset = (parseInt(pageNumber) - 1) * limit;
  const selectQuery = pageNumber
    ? `SELECT * FROM ${secondLevelCateTableName} WHERE category_id = ? LIMIT ? OFFSET ?`
    : `SELECT * FROM ${secondLevelCateTableName} WHERE category_id = ?`;
  /* Count query */
  connection.query(
    `SELECT COUNT(*) as totalCount FROM ${secondLevelCateTableName} WHERE category_id = ? `,
    [categoryId],
    (err, countResult) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: "Error while counting second level categories",
        });
      }

      const totalCount = countResult[0].totalCount;
      /* Get second level categories query */
      connection.query(
        selectQuery,
        [categoryId, limit, offset],
        (err, result) => {
          if (err) {
            return res.status(400).json({
              status: 400,
              message: "Error while getting second level categories",
            });
          }

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

/* Get third level categories list */
productsRouter.get("/third-level-categories", (req, res) => {
  const { pageNumber, pageSize, sectionId } = req.query;
  const limit = parseInt(pageSize);
  const offset = (parseInt(pageNumber) - 1) * limit;

  const selectQuery = pageNumber
    ? `SELECT * FROM ${thirdLevelCateTableName} WHERE section_id = ? LIMIT ? OFFSET ?`
    : `SELECT * FROM ${thirdLevelCateTableName} WHERE section_id = ?`;

  /* Count query */
  connection.query(
    `SELECT COUNT(*) as totalCount FROM ${thirdLevelCateTableName} WHERE section_id = ?`,
    [sectionId],
    (err, countResult) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: "Error while counting third level categories",
        });
      }

      const totalCount = countResult[0].totalCount;
      /* Get third level categories query */
      connection.query(
        selectQuery,
        [sectionId, limit, offset],
        (err, result) => {
          if (err) {
            return res.status(400).json({
              status: 400,
              message: "Error while getting third level categories",
            });
          }

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

/* Get products carousel list for home page */
productsRouter.get("/products-carousel", (req, res) => {
  const userId = getUserIdFromToken(req);
  const pageNumber = 1;
  const pageSize = 20;
  const limit = parseInt(pageSize);
  const offset = (parseInt(pageNumber) - 1) * limit;

  // Query to get top-level categories
  connection.query(
    `SELECT * FROM ${topLevelCateTableName} LIMIT 6`,
    (err, results) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: "Error while getting top-level categories",
        });
      }

      // Use Promise.all to handle multiple asynchronous queries
      const categoryPromises = results.map((category) => {
        const selectQuery = `
          SELECT p.*, 
                 CASE 
                   WHEN ? IS NOT NULL AND w.user_id = ? THEN true 
                   ELSE false 
                 END AS is_liked
          FROM ${tableName} p
          LEFT JOIN ${wishlistTableName} w 
          ON p.product_id = w.product_id AND w.user_id = ?
          WHERE LOWER(p.category_id) = ? 
          LIMIT ? OFFSET ?
        `;
        const categoryId = category?.category_id?.trim().toLowerCase();

        return new Promise((resolve, reject) => {
          connection.query(
            selectQuery,
            [userId, userId, userId, categoryId, limit, offset],
            (err, products) => {
              if (err) {
                reject(err);
              } else {
                // Include category and its products
                resolve({
                  category,
                  products,
                });
              }
            }
          );
        });
      });

      Promise.all(categoryPromises)
        .then((categoriesWithProducts) => {
          res.status(200).json({
            status: 200,
            data: categoriesWithProducts,
          });
        })
        .catch((err) => {
          console.error("Error while getting products:", err);
          res.status(400).json({
            status: 400,
            message: "Error while getting products",
          });
        });
    }
  );
});

/* Add top level category */
productsRouter.post("/top-level-categories/add", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const { categoryName } = req.body;
    const category_id = generateSlug(categoryName);

    if (!categoryName) {
      return res.status(400).json({
        status: 400,
        message: "CategoryName not found in request.",
      });
    }
    connection.query(
      `INSERT INTO ${topLevelCateTableName} (category_id, category_name) VALUES (?, ?)`,
      [category_id, categoryName],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              status: 400,
              message: "This Category already exists",
            });
          }

          return res.status(400).json({
            status: 400,
            message: "Error while getting top level categories",
          });
        } else {
          const categoryId = result.insertId;
          // Fetch newly added category details
          connection.query(
            `SELECT * FROM ${topLevelCateTableName} WHERE id = ?`,
            [categoryId],
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  status: 400,
                  message: "Error checking category",
                });
              }
              if (!result.length) {
                return res.status(400).json({
                  status: 400,
                  message: "Failed to get category",
                });
              }

              return res.status(200).json({
                status: 200,
                data: result[0],
              });
            }
          );
        }
      }
    );
  }
});

/* Add second level category  */
productsRouter.post("/second-level-categories/add", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const { categoryName, sectionName } = req.body;
    const category_id = generateSlug(categoryName);
    const section_id = generateSlug(sectionName);

    if (!categoryName || !sectionName) {
      return res.status(400).json({
        status: 400,
        message: "CategoryName or sectionName not found in request.",
      });
    }
    connection.query(
      `INSERT INTO ${secondLevelCateTableName} (section_id, section_name, category_id) VALUES (?, ?, ?)`,
      [section_id, sectionName, category_id],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              status: 400,
              message: "This Category already exists",
            });
          }
          return res.status(400).json({
            status: 400,
            message: "Error while getting top level categories",
          });
        } else {
          const categoryId = result.insertId;
          // Fetch newly added category details
          connection.query(
            `SELECT * FROM ${secondLevelCateTableName} WHERE id = ?`,
            [categoryId],
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  status: 400,
                  message: "Error checking category",
                });
              }
              if (!result.length) {
                return res.status(400).json({
                  status: 400,
                  message: "Failed to get category",
                });
              }

              return res.status(200).json({
                status: 200,
                data: result[0],
              });
            }
          );
        }
      }
    );
  }
});

/* Add third level category  */
productsRouter.post("/third-level-categories/add", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const { sectionName, itemName } = req.body;
    const section_id = generateSlug(sectionName);
    const item_id = generateSlug(itemName);

    if (!sectionName || !itemName) {
      return res.status(400).json({
        status: 400,
        message: "SectionName or itemName not found in request.",
      });
    }

    connection.query(
      `INSERT INTO ${thirdLevelCateTableName} (item_id, item_name, section_id) VALUES (?, ?, ?)`,
      [item_id, itemName, section_id],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              status: 400,
              message: "This Category already exists",
            });
          }
          return res.status(400).json({
            status: 400,
            message: "Error while getting third level categories",
          });
        } else {
          const categoryId = result.insertId;
          // Fetch newly added category details
          connection.query(
            `SELECT * FROM ${thirdLevelCateTableName} WHERE id = ?`,
            [categoryId],
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  status: 400,
                  message: "Error checking category",
                });
              }
              if (!result.length) {
                return res.status(400).json({
                  status: 400,
                  message: "Failed to get category",
                });
              }

              return res.status(200).json({
                status: 200,
                data: result[0],
              });
            }
          );
        }
      }
    );
  }
});

/* Delete top level category */
productsRouter.delete("/top-level-categories/delete", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const categoryId = req.query.id;
    if (!categoryId) {
      return res
        .status(400)
        .json({ status: 400, message: "Category Id not found in request" });
    }

    connection.query(
      `SELECT section_id FROM ${secondLevelCateTableName} WHERE category_id = ?`,
      [categoryId],
      (err, results) => {
        if (err) {
          return res
            .status(400)
            .json({ status: 400, message: "Error while retrieving sections" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ status: 404, message: "No sections found" });
        }

        // Prepare to delete each section_id
        const sectionIds = results.map((row) => row.section_id);
        const deletePromises = sectionIds.map((sectionId) => {
          return new Promise((resolve, reject) => {
            connection.query(
              `DELETE FROM ${thirdLevelCateTableName} WHERE section_id = ?`,
              [sectionId],
              (err) => {
                if (err) {
                  return reject(err);
                }
                resolve();
              }
            );
          });
        });

        // Execute all delete queries
        Promise.all(deletePromises)
          .then(() => {
            connection.query(
              `DELETE FROM ${secondLevelCateTableName} WHERE category_id = ?`,
              [categoryId],
              (err) => {
                if (err) {
                  return res.status(400).json({
                    status: 400,
                    message: "Error while retrieving sections",
                  });
                } else {
                  connection.query(
                    `DELETE FROM ${topLevelCateTableName} WHERE category_id = ?`,
                    [categoryId],
                    (err) => {
                      if (err) {
                        return res.status(400).json({
                          status: 400,
                          message: "Error while retrieving sections",
                        });
                      } else {
                        return res.status(200).json({
                          status: 200,
                          message: "Categories deleted successfully",
                        });
                      }
                    }
                  );
                }
              }
            );
          })
          .catch((err) => {
            return res.status(400).json({
              status: 400,
              message: "Error while retrieving items",
            });
          });
      }
    );
  }
});

/* Delete second-level category */
productsRouter.delete("/second-level-categories/delete", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const sectionId = req.query.id;
    if (!sectionId) {
      return res
        .status(400)
        .json({ status: 400, message: "Section Id not found in request" });
    }

    // Retrieve the category_id associated with this section_id
    connection.query(
      `SELECT category_id FROM ${secondLevelCateTableName} WHERE section_id = ?`,
      [sectionId],
      (err, results) => {
        if (err) {
          return res.status(400).json({
            status: 400,
            message: "Error while retrieving category information",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: 404,
            message: "No section found with the provided section ID",
          });
        }

        const categoryId = results[0].category_id;

        // Delete items from the third-level category that depend on this section
        connection.query(
          `DELETE FROM ${thirdLevelCateTableName} WHERE section_id = ?`,
          [sectionId],
          (err) => {
            if (err) {
              return res.status(400).json({
                status: 400,
                message: "Error while deleting third-level category items",
              });
            }

            // Once third-level items are deleted, we can safely delete the second-level section
            connection.query(
              `DELETE FROM ${secondLevelCateTableName} WHERE section_id = ?`,
              [sectionId],
              (err) => {
                if (err) {
                  return res.status(400).json({
                    status: 400,
                    message:
                      "Error while deleting second-level category (section)",
                  });
                }

                // Check if there are any more sections left for the top-level category
                connection.query(
                  `SELECT COUNT(*) AS section_count FROM ${secondLevelCateTableName} WHERE category_id = ?`,
                  [categoryId],
                  (err, results) => {
                    if (err) {
                      return res.status(400).json({
                        status: 400,
                        message: "Error while checking remaining sections",
                      });
                    }

                    // If no other sections exist for this category, we can delete the top-level category
                    if (results[0].section_count === 0) {
                      connection.query(
                        `DELETE FROM ${topLevelCateTableName} WHERE category_id = ?`,
                        [categoryId],
                        (err) => {
                          if (err) {
                            return res.status(400).json({
                              status: 400,
                              message:
                                "Error while deleting top-level category",
                            });
                          }

                          // Success response
                          return res.status(200).json({
                            status: 200,
                            message: "Category deleted Successfully.",
                          });
                        }
                      );
                    } else {
                      // If there are still sections, we just delete the second-level category
                      return res.status(200).json({
                        status: 200,
                        message: "Category deleted Successfully.",
                      });
                    }
                  }
                );
              }
            );
          }
        );
      }
    );
  }
});

/* Delete third-level category */
productsRouter.delete("/third-level-categories/delete", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (userId) {
    const itemId = req.query.id;
    if (!itemId) {
      return res
        .status(400)
        .json({ status: 400, message: "Item Id not found in request" });
    }

    // Step 1: Retrieve the section_id and category_id associated with this item
    connection.query(
      `SELECT section_id FROM ${thirdLevelCateTableName} WHERE item_id = ?`,
      [itemId],
      (err, results) => {
        if (err) {
          return res.status(400).json({
            status: 400,
            message: "Error while retrieving section information",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: 404,
            message: "No item found with the provided item ID",
          });
        }

        const sectionId = results[0].section_id;

        // Step 2: Delete the third-level category (item) from the third-level table
        connection.query(
          `DELETE FROM ${thirdLevelCateTableName} WHERE item_id = ?`,
          [itemId],
          (err) => {
            if (err) {
              return res.status(400).json({
                status: 400,
                message: "Error while deleting third-level category (item)",
              });
            }

            // Step 3: After deleting the third-level item, check if the second-level section can be deleted
            connection.query(
              `SELECT category_id FROM ${secondLevelCateTableName} WHERE section_id = ?`,
              [sectionId],
              (err, results) => {
                if (err) {
                  return res.status(400).json({
                    status: 400,
                    message:
                      "Error while retrieving category information for section",
                  });
                }

                if (results.length === 0) {
                  return res.status(404).json({
                    status: 404,
                    message: "No section found with the provided section ID",
                  });
                }

                const categoryId = results[0].category_id;

                // Step 4: Check if there are any other sections left in this second-level category
                connection.query(
                  `SELECT COUNT(*) AS section_count FROM ${thirdLevelCateTableName} WHERE section_id = ?`,
                  [sectionId],
                  (err, results) => {
                    if (err) {
                      return res.status(400).json({
                        status: 400,
                        message:
                          "Error while checking remaining third-level items",
                      });
                    }

                    // If no more third-level items exist for this section, delete the second-level section
                    if (results[0].section_count === 0) {
                      connection.query(
                        `DELETE FROM ${secondLevelCateTableName} WHERE section_id = ?`,
                        [sectionId],
                        (err) => {
                          if (err) {
                            return res.status(400).json({
                              status: 400,
                              message:
                                "Error while deleting second-level category (section)",
                            });
                          }

                          // Step 5: Check if the top-level category should be deleted
                          connection.query(
                            `SELECT COUNT(*) AS section_count FROM ${secondLevelCateTableName} WHERE category_id = ?`,
                            [categoryId],
                            (err, results) => {
                              if (err) {
                                return res.status(400).json({
                                  status: 400,
                                  message:
                                    "Error while checking remaining sections for top-level category",
                                });
                              }

                              // If no other sections exist for this category, we can delete the top-level category
                              if (results[0].section_count === 0) {
                                connection.query(
                                  `DELETE FROM ${topLevelCateTableName} WHERE category_id = ?`,
                                  [categoryId],
                                  (err) => {
                                    if (err) {
                                      return res.status(400).json({
                                        status: 400,
                                        message:
                                          "Error while deleting top-level category",
                                      });
                                    }

                                    // Success response
                                    return res.status(200).json({
                                      status: 200,
                                      message: "Category deleted Successfully.",
                                    });
                                  }
                                );
                              } else {
                                // If sections still exist, don't delete the top-level category
                                return res.status(200).json({
                                  status: 200,
                                  message: "Category deleted Successfully.",
                                });
                              }
                            }
                          );
                        }
                      );
                    } else {
                      // If there are still third-level items, just return success for third-level deletion
                      return res.status(200).json({
                        status: 200,
                        message: "Category deleted Successfully.",
                      });
                    }
                  }
                );
              }
            );
          }
        );
      }
    );
  }
});

/* Create tables section starts here */
function createProductCateSectionItemsTable() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(
    checkTableQuery,
    [thirdLevelCateTableName],
    (err, results) => {
      if (err) {
        console.error("Error checking table existence:", err);
        return;
      }

      /* If the table does not exist, create it */
      if (results && results.length && results[0].count === 0) {
        /* Table creation query */
        const createItemsQuery = `
          CREATE TABLE ${thirdLevelCateTableName} (
            item_id VARCHAR(255) NOT NULL PRIMARY KEY,
            item_name VARCHAR(255) NOT NULL,
            section_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (section_id) REFERENCES ${secondLevelCateTableName}(section_id)
          )
        `;

        connection.query(createItemsQuery, (err) => {
          if (err) {
            console.error(
              `Error creating ${thirdLevelCateTableName} table: ${err}`
            );
          } else {
            console.log(
              `${thirdLevelCateTableName} Table created successfully.`
            );
            /* Now that the items table is created, we can create sections table */
            createProductCateSectionsTable();
          }
        });
      } else {
        console.log(`${thirdLevelCateTableName} Table already exists.`);
        createProductCateSectionsTable();
      }
    }
  );
}

function createProductCateSectionsTable() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(
    checkTableQuery,
    [secondLevelCateTableName],
    (err, results) => {
      if (err) {
        console.error("Error checking table existence:", err);
        return;
      }

      /* If the table does not exist, create it */
      if (results && results.length && results[0].count === 0) {
        /* Table creation query */
        const createSectionsQuery = `
        CREATE TABLE ${secondLevelCateTableName} (
          section_id VARCHAR(255) NOT NULL PRIMARY KEY,
          section_name VARCHAR(255) NOT NULL,
          category_id VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES ${topLevelCateTableName}(category_id)
        )
      `;

        connection.query(createSectionsQuery, (err) => {
          if (err) {
            console.error(
              `Error creating ${secondLevelCateTableName} table: ${err}`
            );
          } else {
            console.log(
              `${secondLevelCateTableName} Table created successfully.`
            );
            /* Now that the sections table is created, we can create categories table */
            createProductCateTable();
          }
        });
      } else {
        console.log(`${secondLevelCateTableName} Table already exists.`);
        /* If sections already exist, check/create categories table */
        createProductCateTable();
      }
    }
  );
}

function createProductCateTable() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  /* Checked and created product_categories table if it does not exist */
  connection.query(checkTableQuery, [topLevelCateTableName], (err, results) => {
    if (err) {
      console.error("Error checking table existence:", results?.[0]?.count);
      return;
    }

    /* If the table does not exist, create it */
    if (results && results.length && results[0].count === 0) {
      /* Table creation query */
      const createCategoriesQuery = `CREATE TABLE ${topLevelCateTableName} (category_id VARCHAR(255) NOT NULL PRIMARY KEY, category_name VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;

      connection.query(createCategoriesQuery, (err) => {
        if (err) {
          console.error(
            `Error creating ${topLevelCateTableName} table: ${err}`
          );
        } else {
          console.log(`${topLevelCateTableName} Table created successfully.`);
          /* Now that the categories table is created, we can create products table */
          createProductsTable();
        }
      });
    } else {
      console.log(`${topLevelCateTableName} Table already exists.`);
      /* If categories already exist, check/create products table */
      createProductsTable();
    }
  });
}

// Create products table
function createProductsTable() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [tableName], (err, results) => {
    if (err) {
      console.error("Error checking table existence:", results?.[0]?.count);
      return;
    }

    /* If the table does not exist, create it */
    if (results && results.length && results[0].count === 0) {
      /* Table creation query */
      const createQuery = `CREATE TABLE ${tableName} (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        net_price DECIMAL(10, 2) NOT NULL,
        discount_percentage DECIMAL(5, 2),
        brand VARCHAR(255),
        color VARCHAR(50),
        size VARCHAR(50),
        quantity INT DEFAULT 1,
        stock INT DEFAULT 0,
        rating DECIMAL(5, 2) DEFAULT 0,
        reviews TEXT,
        warranty_info VARCHAR(255),
        return_policy VARCHAR(255),
        delivery_charges DECIMAL(5, 2) DEFAULT 0,
        images TEXT,
        category_id VARCHAR(255) NOT NULL,
        section_id VARCHAR(255) NOT NULL,
        item_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES ${topLevelCateTableName}(category_id)
    )`;

      connection.query(createQuery, (err) => {
        if (err) {
          console.error(`Error creating ${tableName} table: ${err}`);
        } else {
          console.log(`${tableName} Table created successfully.`);
        }
      });
    } else {
      console.log(`${tableName} Table already exists.`);
    }
  });
}
/* Create tables section ends here */

/* Generate slug for id's  */
function generateSlug(name) {
  return name
    ? name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
        .replace(/^-+|-+$/g, "")
    : ""; // Remove leading and trailing hyphens
}
module.exports = productsRouter;
