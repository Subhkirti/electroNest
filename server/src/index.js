const app = require("./app");
const path = require('path');
const dotenv = require("dotenv");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));
// Loading the appropriate .env file based on the NODE_ENV,
// This key NODE_ENV already set in scripts of package.json, while starting the application
const tableName = "products";
const topLevelCateTableName = "top_level_categories"; 
const secondLevelCateTableName = "second_level_categories"; 
const thirdLevelCateTableName = "third_level_categories";

const result = dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env",
});

if (result.error) {
  throw result.error;
}
const connection = require("./connection");
const usersRouter = require("./services/userService");
const productsRouter = require("./services/productsService");
const cartRouter = require("./services/cartService");
const ordersRouter = require("./services/ordersService");
const paymentsRouter = require("./services/paymentsService");
const addressRouter = require("./services/addressService");

app.use(usersRouter);
app.use(productsRouter);
app.use(cartRouter);
app.use(ordersRouter);
app.use(paymentsRouter);
app.use(addressRouter);

const PORT = process.env.PORT || 4000;

// Fallback route to handle SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to electroNest apis," });
});

app.get("/userslist", (req, res) => {
  connection.query("SELECT * FROM users", (req, results) => {
    res
      .status(200)
      .json({ message: "Welcome to electroNest apis,", data: results });
  });
});

// Get all categories data
app.get("/product/categories", (req, res) => {
  // Query to get all top-level categories
  const getCategoriesQuery = `SELECT * FROM ${topLevelCateTableName}`;

  connection.query(getCategoriesQuery, (err, categories) => {
    console.log("err:", err);
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
          message: `Error getting categories: ${err}`,
        });
      });
  });
});

app.listen(PORT, () => {
  console.log(`ElectroNest application is running on: ${PORT}`);
});
