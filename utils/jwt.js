const jwt = require("jsonwebtoken");

const JWT_SECRET = "photo-sharing-jwt-secret";

function createToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      login_name: user.login_name,
      first_name: user.first_name,
      last_name: user.last_name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { createToken, verifyToken };
