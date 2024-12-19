const app = require("./app");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../client/build")));

// Loading the appropriate .env file based on the NODE_ENV,
// This key NODE_ENV already set in scripts of package.json, while starting the application
const result = dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env",
});

if (result.error) {
  throw result.error;
}

require("./connection");
const usersRouter = require("./services/userService");
const cartRouter = require("./services/cartService");
const productsRouter = require("./services/productsService");
const ordersRouter = require("./services/ordersService");
const paymentsRouter = require("./services/paymentsService");
const addressRouter = require("./services/addressService");
const wishlistRouter = require("./services/wishlistService");

app.use(usersRouter);
app.use(cartRouter);
app.use(productsRouter);
app.use(ordersRouter);
app.use(paymentsRouter);
app.use(addressRouter);
app.use(wishlistRouter);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to electroNest apis," });
});

app.listen(PORT, () => {
  console.log(`ElectroNest application is running on: ${PORT}`);
});
