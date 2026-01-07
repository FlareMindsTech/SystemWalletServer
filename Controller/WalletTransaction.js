import User from "../Modules/UserModule";

export const addMoney = async (req, res) => {
  const { userId, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.walletBalance += Number(amount);
  await user.save();

  await WalletTransaction.create({
    userId,
    action: "ADD",
    amount,
    balanceAfter: user.walletBalance
  });

  res.json({
    message: "Money added successfully",
    balance: user.walletBalance
  });
};


export const deductMoney = async (req, res) => {
  const { userId, amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.walletBalance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  user.walletBalance -= Number(amount);
  await user.save();

  await WalletTransaction.create({
    userId,
    action: "DEDUCT",
    amount,
    balanceAfter: user.walletBalance
  });

  res.json({
    message: "Money deducted successfully",
    balance: user.walletBalance
  });
};
