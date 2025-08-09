const mongoose = require("mongoose");
const TransactionSchema = require("./transaction.model");
const { Schema } = mongoose;

const WalletSchema = new Schema(
  {
    balance: {
      type: Number,
      default: 5000,
      min: 0,
    },
    transactions: [TransactionSchema],
  },
  {
    _id: false,
  }
);

module.exports = WalletSchema;
