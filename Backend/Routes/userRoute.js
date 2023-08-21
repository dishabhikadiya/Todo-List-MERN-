const express = require("express");
const {
  register,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
} = require("../Controller/userController");
const router = express.Router();
const checkAuth = require("../middleware/jwt");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user", checkAuth, getUser);
router.post("/forgot", forgotPassword);
router.post("/otp", verifyOTP);
router.post("/reset", resetPassword);

module.exports = router;
