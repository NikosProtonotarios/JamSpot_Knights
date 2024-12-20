require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connection = require("./config/connection");
const userRoutes = require("./routes/user.router");
const jamNightsRoutes = require("./routes/jamKnight.router");
const jwt = require("jsonwebtoken");

// Initialize the app
const app = express();
const port = 2000;

// Middleware for Authentication
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied, No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with your secret key
    req.user = decoded; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Middleware for Authorization (Optional, for user roles or permissions)
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.length || roles.includes(req.user.userType)) {
      return next(); // Allow access if user has the appropriate role
    }
    return res.status(403).json({ message: "Access Forbidden" });
  };
};

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", userRoutes);
app.use("/jamNights", authenticate, authorize(["showRunner"]), jamNightsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
