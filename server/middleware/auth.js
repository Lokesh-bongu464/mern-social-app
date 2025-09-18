const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.protect = (req, res, next) => {
  let token;

  // Check for the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  }

  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
  }
};
