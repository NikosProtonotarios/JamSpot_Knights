const jwt = require("jsonwebtoken");

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access Denied, No Token Provided" });
  }

  // Remove 'Bearer ' prefix if it exists
  const tokenValue = token.split(" ")[1];
  
  if (!tokenValue) {
    return res.status(400).json({ message: "Invalid Token format" });
  }

  try {
    const decoded = jwt.verify(tokenValue, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);  // Log error for debugging
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Authorization Middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    // Check if the user is updating their own profile
    if (req.params.id !== req.user.userId.toString()) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }

    // Check if the user's role matches one of the allowed roles (if roles are provided)
    if (roles.length && !roles.includes(req.user.userType)) {
      return res.status(403).json({ message: "Access Denied, Insufficient Role" });
    }

    next();
  };
};


module.exports = { authenticate, authorize };