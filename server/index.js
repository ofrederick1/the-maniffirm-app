require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
const User = require("./models/user.model"); // Ensure model is registered

const app = express();
const PORT = process.env.PORT || 3500;

// Sync the database
sequelize.sync();
//! to reset database when you make changes to models
// sequelize.sync({ force: true }).then(() => {
//   console.log("Database synced with force: true");
// });

//Controllers
const userController = require("./controller/user.controller");

// Middleware
app.use(express.json());
app.use("/user", userController);

// Routes
app.get("/", (req, res) => {
  console.log("Maniffirm Backend is Running ✅");
  res.send("Maniffirm Backend is Running ✅");
});
app.use("/user", userController);

// Start Server
app.listen(PORT, function () {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
