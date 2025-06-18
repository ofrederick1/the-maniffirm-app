const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const User = require("../models/user.model"); // Import from models/index.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateSession = require("../config/middleware/validate-session"); // Middleware to validate session
// require("../models/associations"); 



//  Create User
router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);

    const { firstName, lastName, email, username, password, userType } = req.body.user;

    if (!username || !password || !firstName || !lastName || !email || !userType) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: "email-taken" });
      }
      if (existingUser.username === username) {
        return res.status(409).json({ message: "username-taken" });
      }
    }



    // Create user in DB
    let user = await User.create({
      username,
      passwordhash: bcrypt.hashSync(password, 10),
      firstName,
      lastName,
      email,
      userType,
    });

    // Generate token
    const token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    return res.status(201).json({
      user,
      message: "User created successfully",
      sessionToken: token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: error.message });
  }
});

// SIGNING IN A USER
router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  // let email = req.body.user.username;
  // let password = req.body.user.password;

  User.findOne({
    where: { username: username },
  }).then((user) => {
    user ? comparePasswords(user) : res.send("User not found in our database");

    function comparePasswords(user) {
      bcrypt.compare(password, user.passwordhash, function (err, matches) {
        matches ? generateToken(user) : res.send("Incorrect Password");
      });
    }

    function generateToken(user) {
      let token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });

      res.json({
        user: user,
        message: "logged in",
        sessionToken: token,
      });
    }
  });
});

// Update User
router.put("/update-user", validateSession, async (req, res) => {
  try {
    const user = req.user;

    const { username, firstName, lastName, password } = req.body.user || {};

    const updates = {};
    if (username !== undefined) updates.username = username;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (password !== undefined) {
      updates.passwordhash = bcrypt.hashSync(password, 10);
    }
    await user.update(updates);

    const newToken = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    res.json({
      user,
      message: "User profile replaced successfully.",
      sessionToken: newToken,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/myprofile", validateSession, async (req, res)=>{
const profile = await User.findByPk(req.user.id)
res.json({message: "route works", user: profile})
})

router.get("/technicians", async (req, res) => {
  try {
    const technicians = await User.findAll({
      where: { userType: "technician" },
      attributes: ["id", "firstName", "lastName"] // You can adjust fields as needed
    });

    res.json(technicians);
  } catch (error) {
    console.error("Error fetching technicians:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// FORGOT PASSWORD ROUTE

const crypto = require("crypto");
// const sendEmail = require("../../server/middleware/SendEmail"); nodem

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email not found." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = expiry;
    await user.save();

  // reset link here
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send the email
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h2>Hi ${user.firstName},</h2>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error sending reset link." });
  }
});

// RESET PASSWORD ROUTE
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [require("sequelize").Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.passwordhash = bcrypt.hashSync(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ message: `Your password has been updated successfully.` });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error." });
  }
});



module.exports = router;