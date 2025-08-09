const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const WalletSchema = require("./wallet.model");

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  wallet: {
    type: WalletSchema,
    default: function () {
      return {
        balance: 5000,
        transactions: [
          {
            type: "credit",
            amount: 5000,
            description: "Welcome bonus",
            balanceAfter: 5000,
            createdAt: new Date(),
          },
        ],
      };
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

UserSchema.methods.addTransaction = function (type, amount, description) {
  const newBalance =
    type === "credit"
      ? this.wallet.balance + amount
      : this.wallet.balance - amount;

  if (newBalance < 0) {
    throw new Error("Insufficient balance for this transaction");
  }

  const transaction = {
    type,
    amount,
    description,
    balanceAfter: newBalance,
    createdAt: new Date(),
  };

  this.wallet.transactions.push(transaction);
  this.wallet.balance = newBalance;
  return this.save();
};

UserSchema.methods.getTransactionHistory = function (limit = 10) {
  return this.wallet.transactions
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
