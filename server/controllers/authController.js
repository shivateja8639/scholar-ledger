//  controllers/authController.js
const userModel = require("../models/userModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // 🧠 Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.emailVerified)
      return res.status(403).json({ message: "Please verify your email before logging in." });

    return res.status(200).json({ success: true, user, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User with this mail already exists" });

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const newUser = new userModel({ name, email, password, emailVerificationToken });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationURL = `${process.env.BACKEND_URL}/api/v1/users/verify-email/${emailVerificationToken}`;

    transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `<p>Please click <a href="${verificationURL}">here</a> to verify your email address.</p>`,
    }, (err, info) => {
      if (err) {
        console.log(" Error sending email:", err);
        return res.status(500).json({ success: false, message: "Failed to send verification email." });
      } else {
        return res.status(201).json({ success: true, message: "Check your email to verify your account." });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Verify Email
const verifyEmailController = async (req, res) => {
  try {
    const user = await userModel.findOne({ emailVerificationToken: req.params.token });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    return res.send("Email verified successfully. You can now login.");
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  loginController,
  registerController,
  verifyEmailController,
};
