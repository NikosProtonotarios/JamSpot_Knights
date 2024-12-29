require('dotenv').config();
const express = require("express");
const {authenticate, authorize} = require("./middleware/auth");
const cors = require("cors");
const connection = require("./config/connection");
const userRoutes = require("./routes/user.router");
const jamNightsRoutes = require("./routes/jamKnight.router");
// const musicianRoutes = require("./routes/musician.router");
const jwt = require("jsonwebtoken");
const path = require("path");

// Initialize the app
const app = express();
const port = 2000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/users", userRoutes);
app.use("/jamNights", jamNightsRoutes);
// app.use("/musicians", musicianRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
