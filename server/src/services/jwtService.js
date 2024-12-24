const jwt = require("jsonwebtoken");
const jwtSecretKey = "electroNestJwt";

function generateToken(userId) {
  const expiresIn = 24 * 60 * 60 * 1000; //24h
  const token = jwt.sign({ id: userId }, jwtSecretKey, { expiresIn });

  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + expiresIn);

  return { token, expirationDate };
}

const getUserIdFromToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded.id;
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      res &&
        res.status(400).json({
          status: 400,
          message: "Token Expired.",
          name: "TokenExpiredError",
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
