const jwt = require("jsonwebtoken");
const jwtSecretKey = "electroNestJwt";

function generateToken(userId) {
  const token = jwt.sign({ userId }, jwtSecretKey, { expiresIn: "48h" });
  return token;
}

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, getUserIdFromToken };
