const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 7500;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to electroNest apis,");
});

app.listen(PORT, () => {
  console.log(`ElectroNest application is running on: ${PORT}`);
});

module.exports = app;
