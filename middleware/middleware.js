// Middleware function to determine if the API endpoint request is from an authenticated user
const jwt = require("jsonwebtoken");

function isAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.jsend.error({ message : "No token provided." });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.jsend.error({ message : "Invalid token" });
  }
}

module.exports = isAuth;