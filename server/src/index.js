const app = require("./app");
const dotenv = require("dotenv");

// Loading the appropriate .env file based on the NODE_ENV,
// This key NODE_ENV already set in scripts of package.json, while starting the application
const result = dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env",
});

if (result.error) {
  throw result.error;
}

require("./connection");
require("./services/userService");
require("./services/productsService");
require("./services/cartService");
require("./services/ordersService");
require("./services/paymentsService");
require("./services/addressService");
// require("./services/sellersService");

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to electroNest apis," });
});


app.listen(PORT, () => {
  console.log(`ElectroNest application is running on: ${PORT}`);
});
