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
    console.error("Error verifying token:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Authorization Middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    // Convert the userType and roles to lowercase to avoid case sensitivity issues
    const userType = req.user.userType.toLowerCase();
    const allowedRoles = roles.map(role => role.toLowerCase());

    // If roles are provided, check if the user has one of the allowed roles
    if (allowedRoles.length && !allowedRoles.includes(userType)) {
      return res.status(403).json({ message: "Access Denied, Insufficient Role" });
    }

    // Move to the next middleware if the user has the right role
    next();
  };
};


module.exports = { authenticate, authorize };