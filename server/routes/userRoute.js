const express = require('express');
const {
  loginController,
  registerController,
  verifyEmailController,
} = require('../controllers/authController');

const {
  forgotPasswordController,
  resetPasswordController,
} = require('../controllers/passwordController');

const router = express.Router();

// Auth routes
router.post('/login', loginController);
router.post('/register', registerController);
router.get('/verify-email/:token', verifyEmailController);

// Password reset routes
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);

module.exports = router;
