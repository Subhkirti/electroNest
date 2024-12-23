const jwt = require("jsonwebtoken");
const jwtSecretKey = "electroNestJwt";

function generateToken(userId) {
  const token = jwt.sign({ userId }, jwtSecretKey, { expiresIn: "48h" });
  return token;
}

const getUserIdFromToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded.userId;
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      res &&
        res.status(400).json({
          status: 400,
          message: "Token Expired.",
        });
      return null;
    }
    res &&
      res.status(400).json({
        status: 400,
        message: "Authorization failed.",
      });
    return null;
  }
};

module.exports = { generateToken, getUserIdFromToken };
