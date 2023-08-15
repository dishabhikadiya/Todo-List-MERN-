const express = require("express");
const {
  register,
  login,
  logout,
  getUser,
} = require("../Controller/userController");
const router = express.Router();
const checkAuth = require("../middleware/jwt");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user", checkAuth, getUser);

module.exports = router;
