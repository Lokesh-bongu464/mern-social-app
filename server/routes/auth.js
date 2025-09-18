const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post("/login", loginUser);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password - send reset token to email
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
// NOTE: Changed from PUT to POST to match the other controller, and changed parameter to :token
router.post("/reset-password/:token", resetPassword);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get("/me", protect, getMe);

module.exports = router;
