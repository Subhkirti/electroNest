const app = require(".");
const PORT = 7200;
require("./connection");
require("./services/userService");

app.get("/", (req, res) => {
  return res.status(200).send("Welcome to electroNest APIs.");
});

app.listen(PORT, () => {
  console.log(`electroNest api is listening on the port: ${PORT}`);
});
