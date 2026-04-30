const Expense = require("../models/Expense");
const Balance = require("../models/Balance");

// Add a new expense and update balances
const addExpense = async (req, res) => {
  try {
    const { paidBy, splits } = req.body;

    // For each split, update how much that person owes the one who paid
    for (let split of splits) {
      const isTheSamePersonWhoPaid = split.userId === paidBy;

      if (!isTheSamePersonWhoPaid) {
        await Balance.findOneAndUpdate(
          { from: split.userId, to: paidBy },  
          { $inc: { amount: split.amount } },   
          { upsert: true }                       
        );
      }
    }

    const newExpense = await Expense.create(req.body);
    res.json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all expenses (with names instead of IDs)
const getAllExpenses = async (req, res) => {
  try {
    const allExpenses = await Expense.find()
      .populate("paidBy", "name")
      .populate("groupId", "name")
      .populate("splits.userId", "name");

    res.json(allExpenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all balances (who owes whom and how much)
const getAllBalances = async (req, res) => {
  try {
    const allBalances = await Balance.find()
      .populate("from", "name")  
      .populate("to", "name");   

    // Send only the names and amount (not the full MongoDB objects)
    const formattedBalances = allBalances.map((balance) => ({
      from: balance.from.name,
      to: balance.to.name,
      amount: balance.amount,
    }));

    res.json(formattedBalances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addExpense, getAllExpenses, getAllBalances };