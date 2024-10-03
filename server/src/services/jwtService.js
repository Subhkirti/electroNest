const jwt = require("jsonwebtoken");
const jwtSecretKey = "electroNestJwt";

function generateToken(userId) {
  const token = jwt.sign({ userId }, jwtSecretKey, { expiresIn: "48h" });
  return token;
}

function getUserIdFromToken(token) {
  const decodeToken = jwt.verify(token, jwtSecretKey);
  return decodeToken.userId;
}

module.exports = { generateToken, getUserIdFromToken };
