const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc    Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({ username, email, password });
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Login user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @desc    Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // We send a success-like response to prevent email enumeration
      return res.status(200).json({
        success: true,
        msg: "If a user with that email exists, a reset link has been sent.",
      });
    }

    // Create a short-lived token specifically for password reset
    const payload = { user: { id: user.id } };
    const resetToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token is valid for 1 hour
    });

    // This is the link that would be emailed to the user
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // In a production environment, you would use Nodemailer to send an email here
    console.log(`Password reset link: ${resetUrl}`); // For development only

    res.status(200).json({
      success: true,
      msg: "Password reset email sent (check console for link in development)",
      // In production, don't send the resetUrl in the response
      ...(process.env.NODE_ENV === "development" && { resetUrl }),
    });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({
      success: false,
      msg: "Error processing forgot password request",
    });
  }
};

// @desc    Reset Password
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
    return res.status(400).json({
      success: false,
      msg: "Please provide a new password",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id from the token
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found or token is invalid",
      });
    }

    // Set the new password (the pre-save hook will hash it)
    user.password = password;
    await user.save();

    // Invalidate the token after use (optional)
    // You could store used tokens in Redis or similar for one-time use

    res.status(200).json({
      success: true,
      msg: "Password has been successfully reset. You can now log in with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err.message);

    // Handle specific JWT errors
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        msg: "Invalid or malformed token.",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        msg: "Password reset token has expired. Please request a new reset link.",
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      msg: "Error resetting password. Please try again.",
    });
  }
};

// @desc    Get current logged in user
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
