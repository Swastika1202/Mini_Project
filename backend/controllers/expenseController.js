const Expense = require('../models/Expense');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

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

const getExpenseSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { period = 'weekly' } = req.query; // Default to weekly

  let startDate = new Date();
  const endDate = new Date();

  switch (period) {
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'yearly':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'weekly':
    default:
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      break;
  }

  const expenses = await Expense.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate average daily spending
  const days = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const avgDaily = days > 0 ? totalSpent / days : 0;

  // Top Category
  const categoryMap = {};
  expenses.forEach(expense => {
    if (categoryMap[expense.category]) {
      categoryMap[expense.category] += expense.amount;
    } else {
      categoryMap[expense.category] = expense.amount;
    }
  });

  const sortedCategories = Object.keys(categoryMap)
    .map(category => ({
      category,
      amount: categoryMap[category],
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = sortedCategories.length > 0 ? sortedCategories[0].category : 'N/A';

  // Weekly Spending Trend (for last 7 days)
  const weeklySpending = Array(7).fill(0);
  expenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    const diffTime = Math.abs(endDate.getTime() - expenseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
      weeklySpending[6 - diffDays] += expense.amount; // 0 is oldest, 6 is newest
    }
  });

  // Budget
  const user = await User.findById(userId);
  const monthlyBudget = user ? user.monthlyBudget || 0 : 0;
  const budgetUsed = totalSpent;
  const budgetLeft = monthlyBudget - budgetUsed;
  const budgetProgress = monthlyBudget > 0 ? (budgetUsed / monthlyBudget) * 100 : 0;

  res.json({
    totalSpent,
    avgDaily,
    topCategory,
    weeklySpending,
    budgetLeft,
    budgetUsed,
    budgetProgress,
    categories: sortedCategories,
    recentExpenses: expenses,
  });
});

module.exports = { getExpenses, addExpense, getExpenseSummary };
