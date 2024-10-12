const connection = require("../connection");
const tableName = "products";
const productCategoriesTableName = "product_categories";

const app = require("../app");
checkTableExistence();

/* Set products categories */
app.post("/products/categories", (req, res) => {
  const categories = req.body.categories;

  if (!Array.isArray(categories)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid input: categories must be an array.",
    });
  }

  const values = categories.map((category_name) => {
    const slug = generateSlug(category_name);
    return [slug, category_name]; 
  });

  // Prepared the query for multiple inserts
  const placeholders = values.map(() => '(?, ?)').join(', ');
  const flattenedValues = values.flat();

  const insertQuery = `INSERT INTO ${productCategoriesTableName} (category_id, category_name) VALUES ${placeholders}`;
  connection.query(insertQuery, flattenedValues, (err, result) => {
    if (err) {
      console.error('Error while inserting categories:', err); 
      return res.status(400).json({
        status: 400,
        message: "Error while getting products categories",
      });
    }
    return res.status(200).json({ status: 200, data: result });
  });
});


/* Get products categories */
app.get("/products/categories", (req, res) => {
  connection.query(
    `SELECT * FROM ${productCategoriesTableName}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: "Error while getting products categories",
        });
      }
      return res.status(200).json({ status: 200, data: result });
    }
  );
});

/* Set products list */
app.set("/products", (req, res) => {
  connection.query(
    `INSERT INTO ${tableName} (product_name,  price, stock_quantity, category_id) VALUES (?,?,?,?)`,
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

function checkTableExistence() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  // Checked and created product_categories table if it does not exist
  connection.query(
    checkTableQuery,
    [productCategoriesTableName],
    (err, results) => {
      if (err) {
        console.error("Error checking table existence:", results?.[0]?.count);
        return;
      }

      // If the table does not exist, create it
      if (results && results.length && results[0].count === 0) {
        // Table creation query
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
            // Now that the categories table is created, we can create products table
            createProductsTable();
          }
        });
      } else {
        console.log(`${productCategoriesTableName} Table already exists.`);
        // If categories already exist, check/create products table
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

    // If the table does not exist, create it
    if (results && results.length && results[0].count === 0) {
      // Table creation query
      const createQuery = `CREATE TABLE ${tableName} (product_id INT AUTO_INCREMENT PRIMARY KEY, product_name VARCHAR(255) NOT NULL, price DECIMAL(10, 2) NOT NULL, stock_quantity INT DEFAULT 0, category_id VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (category_id) REFERENCES ${productCategoriesTableName}(category_id))`;

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

// Generate slug for product category_id
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}
