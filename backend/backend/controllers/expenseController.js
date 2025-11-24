const Expense = require('../models/Expense');

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  const { name, date, category, amount } = req.body;

  try {
    const newExpense = await Expense.create({
      userId: req.user._id,
      name,
      date,
      category,
      amount,
    });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, addExpense };
