const express = require("express");
const {
  register,
  login,
  getCurrentLoggedInUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/currentUser", protect, getCurrentLoggedInUser);

module.exports = router;
