require('dotenv').config();
const express = require("express");
const {authenticate, authorize} = require("./middleware/auth");
const cors = require("cors");
const connection = require("./config/connection");
const userRoutes = require("./routes/user.router");
const jamNightsRoutes = require("./routes/jamKnight.router");
const jwt = require("jsonwebtoken");

// Initialize the app
const app = express();
const port = 2000;

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
