const userModel = require("../models/userModel");

// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email and password (Consider hashing for production)
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "User not found or invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      user,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || error,
    });
  }
};

// Register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save new user
    const newUser = new userModel({ name, email, password });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || error,
    });
  }
};

module.exports = { loginController, registerController };
