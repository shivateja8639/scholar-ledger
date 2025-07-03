const userModel = require("../models/userModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Forgot Password Controller
const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpire = Date.now() + 15 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetExpire;
        await user.save();

        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // ✔️ secure
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: "Reset your password",
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px;">
                  <p>You requested a password reset. Click the link below:</p>
                  <p><a href="${resetURL}" style="color: #1a73e8; text-decoration: underline;">Reset Password</a></p>
                  <p>This link is valid for 15 minutes.</p>
                </div>
            `,
        });

        return res.status(200).json({
            success: true,
            message: "Password reset email sent",
        });

    } catch (error) {
        console.error("❌ Forgot Password Error:", error); // ⬅️ Will log full error
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Reset Password Controller
const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            console.log("Token received:", token);
            console.log("Trying to find user with token...");
            const user = await userModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpire: { $gt: Date.now() },
            });
            console.log("User found:", user);

        }

        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    forgotPasswordController,
    resetPasswordController,
};
