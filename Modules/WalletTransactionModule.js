import mongoose from "mongoose";
const walletTransaction = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    action: {
      type: String,
      enum: ["ADD", "DEDUCT"],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    balanceAfter: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);
const WalletTransaction=mongoose.model('WalletTransaction',walletTransaction)
export default WalletTransaction;