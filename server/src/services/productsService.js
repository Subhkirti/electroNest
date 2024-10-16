const connection = require("../connection");
const tableName = "products";
const productCategoriesTableName = "product_categories";
const productCategorySectionsTableName = "product_category_sections";
const productCategorySectionItemsTableName = "product_category_section_items";

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
app.set("/product/add", (req, res) => {
  connection.query(
    `INSERT INTO ${tableName} (product_name, description, price, discount_price, discount_percentage, stock_quantity, brand, color, size, product_image, category_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
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
  connection.query(`SELECT * FROM ${tableName}`, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Error while getting products" });
    }
    return res.status(200).json({ status: 200, data: result });
  });
});

/* Create tables section starts here */
function createProductCateSectionItemsTable() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(
    checkTableQuery,
    [productCategorySectionItemsTableName],
    (err, results) => {
      if (err) {
        console.error("Error checking table existence:", err);
        return;
      }

      /* If the table does not exist, create it */
      if (results && results.length && results[0].count === 0) {
        /* Table creation query */
        const createItemsQuery = `
          CREATE TABLE ${productCategorySectionItemsTableName} (
            item_id VARCHAR(255) NOT NULL PRIMARY KEY,
            item_name VARCHAR(255) NOT NULL,
            section_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (section_id) REFERENCES ${productCategorySectionsTableName}(section_id)
          )
        `;

        connection.query(createItemsQuery, (err) => {
          if (err) {
            console.error(
              `Error creating ${productCategorySectionItemsTableName} table: ${err}`
            );
          } else {
            console.log(
              `${productCategorySectionItemsTableName} Table created successfully.`
            );
            /* Now that the items table is created, we can create sections table */
            createProductCateSectionsTable();
          }
        });
      } else {
        console.log(
          `${productCategorySectionItemsTableName} Table already exists.`
        );
        createProductCateSectionsTable();
      }
    }
  );
}

function createProductCateSectionsTable() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(
    checkTableQuery,
    [productCategorySectionsTableName],
    (err, results) => {
      if (err) {
        console.error("Error checking table existence:", err);
        return;
      }

      /* If the table does not exist, create it */
      if (results && results.length && results[0].count === 0) {
        /* Table creation query */
        const createSectionsQuery = `
        CREATE TABLE ${productCategorySectionsTableName} (
          section_id VARCHAR(255) NOT NULL PRIMARY KEY,
          section_name VARCHAR(255) NOT NULL,
          category_id VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES ${productCategoriesTableName}(category_id)
        )
      `;

        connection.query(createSectionsQuery, (err) => {
          if (err) {
            console.error(
              `Error creating ${productCategorySectionsTableName} table: ${err}`
            );
          } else {
            console.log(
              `${productCategorySectionsTableName} Table created successfully.`
            );
            /* Now that the sections table is created, we can create categories table */
            createProductCateTable();
          }
        });
      } else {
        console.log(
          `${productCategorySectionsTableName} Table already exists.`
        );
        /* If sections already exist, check/create categories table */
        createProductCateTable();
      }
    }
  );
}

function createProductCateTable() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  /* Checked and created product_categories table if it does not exist */
  connection.query(
    checkTableQuery,
    [productCategoriesTableName],
    (err, results) => {
      if (err) {
        console.error("Error checking table existence:", results?.[0]?.count);
        return;
      }

      /* If the table does not exist, create it */
      if (results && results.length && results[0].count === 0) {
        /* Table creation query */
        const createCategoriesQuery = `CREATE TABLE ${productCategoriesTableName} (category_id VARCHAR(255) NOT NULL PRIMARY KEY, category_name VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;

        connection.query(createCategoriesQuery, (err) => {
          if (err) {
            console.error(
              `Error creating ${productCategoriesTableName} table: ${err}`
            );
          } else {
            console.log(
              `${productCategoriesTableName} Table created successfully.`
            );
            /* Now that the categories table is created, we can create products table */
            createProductsTable();
          }
        });
      } else {
        console.log(`${productCategoriesTableName} Table already exists.`);
        /* If categories already exist, check/create products table */
        createProductsTable();
      }
    }
  );
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
        product_image VARCHAR(255),
        category_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES ${productCategoriesTableName}(category_id)
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

/*
reqBody format:::===>
  {
  "categories": [
    {
      "name": "Televisions & accessories",
      "sections": [
        {
          "name": "LED TVs",
          "items": [
            { "name": "All LED Tvs" },
            { "name": "QLED" },
            { "name": "OLED TVs" },
            { "name": "4K Ultra HD TVs" },
            { "name": "8K Ultra HD TVs" }
          ]
        },
        {
          "name": "TV accessories ",
          "items": [
            { "name": "All TV Accessories" },
            { "name": "V Wall Mount & Stands" },
            { "name": "Cables & Connectors" },
            { "name": "Remotes & IR Blasters" }
          ]
        },
        {
          "name": "Projectors",
          "items": [
            {
              "name": "Short Throw Projectors"
            },
            {
              "name": "Ultra Short Throw Projectors"
            },
            { "name": "Full HD Projectors" },
            { "name": "Ultra HD 4K Projectors" }
          ]
        }
      ]
    },
    {
      "name": "Home Appliances",

      "sections": [
        {
          "name": "Washing Machines & Dryers",
          "items": [
            {
              "name": "Front Load Washing Machines"
            },
            {
              "name": "Top Load Washing Machines"
            },
            {
              "name": "Semi Automatic Washing Machines"
            }
          ]
        }
      ]
    },
    {
      "name": "Phones Wearables",
      "sections": [
        {
          "name": "Mobile Phones",
          "items": [
            { "name": "Android Phones" },
            { "name": "iPhones" },
            {
              "name": "Flip and Fold Mobile Phones"
            },
            { "name": "Gaming Mobile Phones" }
          ]
        },
        {
          "name": "Headphones & Earphones",
          "items": [
            { "name": "Bluetooth Earphones" },
            { "name": "Bluetooth Headphones" },
            { "name": "Truly Wireless Earbuds" },
            { "name": "Bluetooth" },
            { "name": "Headphones" }
          ]
        }
      ]
    }
  ]
}

*/
