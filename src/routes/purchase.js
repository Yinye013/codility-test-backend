const express = require("express");
const { protect } = require("../middleware/auth");
const {
  purchaseAirtime,
  getTransactionHistory,
  getWalletBalance,
  addFunds,
} = require("../controllers/purchaseController");

const router = express.Router();

router.use(protect);

// Wallet routes
router.get("/wallet", getWalletBalance);
router.post("/add-funds", addFunds);

// Transaction routes
router.get("/transactions", getTransactionHistory);

// Purchase routes
router.post("/airtime", purchaseAirtime);
module.exports = router;
