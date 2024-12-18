const express = require("express");
const cors = require("cors");
const connection = require("./config/connection");

// Initialize the app
const app = express();
const port = 2000;

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
