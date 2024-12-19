const express = require("express");
const cors = require("cors");
const connection = require("./config/connection");
const userRoutes = require("./routes/user.router");
const jamKnightsRoutes = require("./routes/jamKnight.router");

// Initialize the app
const app = express();
const port = 2000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", userRoutes);
app.use("/jamKnights", jamKnightsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
