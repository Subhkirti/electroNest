const connection = require("../connection");
const tableName = "products";
const topLevelCateTableName = "top_level_categories";
const secondLevelCateTableName = "second_level_categories";
const thirdLevelCateTableName = "third_level_categories";

const app = require("../app");
createProductCateSectionItemsTable();
app.post("/product/categories/sections/items", (req, res) => {
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
        const insertCategoryQuery = `INSERT INTO product_categories (category_id, category_name) VALUES (?, ?)`;
        connection.query(
          insertCategoryQuery,
          [category_id, category.name],
          (err) => {
            if (err) return reject(err);

            // Insert sections
            const sectionInsertPromises = sections.map((section) => {
              const section_id = generateSlug(section.name);
              return new Promise((resolveSection, rejectSection) => {
                const insertSectionQuery = `INSERT INTO product_category_sections (section_id, section_name, category_id) VALUES (?, ?, ?)`;
                connection.query(
                  insertSectionQuery,
                  [section_id, section.name, category_id],
                  (err) => {
                    if (err) return rejectSection(err);

                    // Insert items for the section
                    const itemInsertPromises = section.items.map((item) => {
                      const item_id = generateSlug(item.name);
                      return new Promise((resolveItem, rejectItem) => {
                        const insertItemQuery = `INSERT INTO product_category_section_items (item_id, item_name, section_id) VALUES (?, ?, ?)`;
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

/* Set products list */
app.post("/product/add", (req, res) => {
  const {
    thumbnail,
    images,
    brand,
    title,
    color,
    size,
    description,
    price,
    quantity,
    disPercentage,
    disPrice,
    topLevelCategory,
    secondLevelCategory,
    thirdLevelCategory,
  } = req.body;

  connection.query(
    `INSERT INTO ${tableName} (product_name, description, price, discount_price, discount_percentage, quantity, brand, color, size, thumbnail, images, category_id, section_id, item_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      title,
      description,
      price,
      disPrice,
      disPercentage,
      quantity,
      brand,
      color,
      size,
      JSON.stringify(thumbnail),
      JSON.stringify(images),
      topLevelCategory,
      secondLevelCategory,
      thirdLevelCategory,
    ],
    (err, result) => {
      if (err) {
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
});

/* Edit product details */
app.post("/product/edit", (req, res) => {
  const productId = req.query?.id;
  const {
    thumbnail,
    images,
    brand,
    title,
    color,
    size,
    description,
    price,
    quantity,
    disPercentage,
    disPrice,
    topLevelCategory,
    secondLevelCategory,
    thirdLevelCategory,
  } = req.body;

  connection.query(
    `UPDATE ${tableName} SET product_name = ?, description = ?, price = ?, discount_price = ?, discount_percentage = ?, quantity = ?, brand = ?, color = ?, size = ?, thumbnail = ?, images = ?, category_id = ?, section_id = ?, item_id = ? WHERE product_id = ?`,
    [
      title,
      description,
      price,
      disPrice,
      disPercentage,
      quantity,
      brand,
      color,
      size,
      JSON.stringify([thumbnail]),
      JSON.stringify(images),
      topLevelCategory,
      secondLevelCategory,
      thirdLevelCategory,
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
});

/* Delete product */
app.delete("/product/delete", (req, res) => {
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
      console.log("err:", err);
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
});

/* Get product details by id */
app.get("/product-details", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "Product Id not found in request" });
  }
  connection.query(
    `SELECT * FROM ${tableName} WHERE product_id = ?`,
    [id],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while getting products" });
      }
      return res.status(200).json({ status: 200, data: result });
    }
  );
});

/* Get products list */
app.get("/products", (req, res) => {
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
      /* Get Products query */
      connection.query(
        `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`,
        [limit, offset],
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
});

/* Get top level categories list */
app.get("/top-level-categories", (req, res) => {
  connection.query(`SELECT * FROM ${topLevelCateTableName}`, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Error while getting products" });
    }
    return res.status(200).json({ status: 200, data: result });
  });
});

/* Get second level categories list */
app.get("/second-level-categories", (req, res) => {
  const categoryId = req.query?.categoryId;
  connection.query(
    `SELECT * FROM ${secondLevelCateTableName} WHERE category_id = ?`,
    [categoryId],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while getting products" });
      }
      return res.status(200).json({ status: 200, data: result });
    }
  );
});

/* Get third level categories list */
app.get("/third-level-categories", (req, res) => {
  const sectionId = req.query?.sectionId;
  connection.query(
    `SELECT * FROM ${thirdLevelCateTableName} WHERE section_id = ?`,
    [sectionId],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while getting products" });
      }
      return res.status(200).json({ status: 200, data: result });
    }
  );
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
        discount_price DECIMAL(10, 2),
        discount_percentage DECIMAL(5, 2),
        quantity INT DEFAULT 0,
        brand VARCHAR(255),
        color VARCHAR(50),
        size VARCHAR(50),
        thumbnail TEXT,
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
