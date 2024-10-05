const app = require("./app");
require("./connection");
require("./services/userService");
const dotenv = require("dotenv");

// Loading the appropriate .env file based on the NODE_ENV,
// This key NODE_ENV already set in scripts of package.json, while starting the application
const result = dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env",
});

if (result.error) {
  throw result.error;
}

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send("Welcome to electroNest apis,");
});

app.listen(PORT, () => {
  console.log(`ElectroNest application is running on: ${PORT}`);
});
