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
app.listen(PORT, () => {
  console.log(`ElectroNest application is running on: ${PORT}`);
});
