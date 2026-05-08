const express = require("express");
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
} = require("./auth.controller");
const router = express.Router();
const rateLimiter = require("express-rate-limit");
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, //15 minites
  max: 10, // limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.post("/register", apiLimiter, register);
router.post("/login", apiLimiter, login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

module.exports = router;
