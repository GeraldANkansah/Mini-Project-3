const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token (ensure JWT_SECRET is correctly set in .env)
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    
    // Attach user data to request object
    req.user = verified;

    next(); // Continue to next middleware or route
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
