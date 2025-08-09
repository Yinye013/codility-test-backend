const User = require("../models/user.model"); // Fix: Change from "../models/User"

// @desc    Purchase airtime
// @route   POST /api/purchase/airtime
// @access  Private
const purchaseAirtime = async (req, res) => {
  try {
    const { phoneNumber, amount, network } = req.body;
    const userId = req.user.userId;

    // Validation logic stays the same...
    if (!phoneNumber || !amount || !network) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone number, amount, and network",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const phoneRegex = /^[\d\+\-\(\)\s]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const previousBalance = user.wallet.balance;

    try {
      await user.addTransaction(
        "debit",
        amount,
        `Airtime purchase for ${phoneNumber} (${network})`
      );

      console.log(
        `Airtime purchase successful: ${phoneNumber}, Amount: ₦${amount}, New Balance: ₦${user.wallet.balance}`
      );

      const latestTransaction =
        user.wallet.transactions[user.wallet.transactions.length - 1];

      res.status(200).json({
        success: true,
        message: "Airtime purchase successful",
        data: {
          phoneNumber,
          amount,
          network,
          transactionId: latestTransaction._id,
          previousBalance,
          newBalance: user.wallet.balance,
          transaction: latestTransaction,
        },
      });
    } catch (transactionError) {
      return res.status(400).json({
        success: false,
        message: transactionError.message,
      });
    }
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during purchase",
    });
  }
};

// @desc    Add funds to wallet
// @route   POST /api/purchase/add-funds
// @access  Private
const addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const previousBalance = user.wallet.balance;

    await user.addTransaction("credit", amount, "Wallet top-up");

    const latestTransaction =
      user.wallet.transactions[user.wallet.transactions.length - 1];

    res.status(200).json({
      success: true,
      message: "Funds added successfully",
      data: {
        amount,
        previousBalance,
        newBalance: user.wallet.balance,
        transaction: latestTransaction,
      },
    });
  } catch (error) {
    console.error("Add funds error:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding funds",
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/purchase/transactions
// @access  Private
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //let's get transactions (I used sorting to get newest first)
    const transactions = user.wallet.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice((page - 1) * limit, page * limit);

    const totalTransactions = user.wallet.transactions.length;
    const totalPages = Math.ceil(totalTransactions / limit);
    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalTransactions,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Transaction history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving transaction history",
    });
  }
};

// @desc    Get wallet balance and summary
// @route   GET /api/purchase/wallet
// @access  Private
const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const totalSpent = user.wallet.transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalReceived = user.wallet.transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const recentTransactions = user.wallet.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        balance: user.wallet.balance,
        statistics: {
          totalSpent,
          totalReceived,
          totalTransactions: user.wallet.transactions.length,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Wallet balance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error retrieving wallet information",
    });
  }
};

module.exports = {
  purchaseAirtime,
  getTransactionHistory,
  getWalletBalance,
  addFunds,
};
