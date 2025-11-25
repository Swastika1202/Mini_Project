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
  const { period = 'weekly', searchTerm = '', filterCategory = 'All' } = req.query; // Default to weekly
  console.log("Backend Received - Period:", period, "SearchTerm:", searchTerm, "FilterCategory:", filterCategory);

  let startDate = new Date();
  const endDate = new Date();

  switch (period) {
    case 'monthly':
      startDate.setDate(1); // Start of current month
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yearly':
      startDate.setMonth(0); // January
      startDate.setDate(1);  // 1st
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
    default:
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      break;
  }

  const query = {
    userId,
    date: { $gte: startDate, $lte: endDate },
  };

  if (searchTerm) {
    query.name = { $regex: searchTerm, $options: 'i' }; // Case-insensitive search by name
  }

  if (filterCategory !== 'All') {
    query.category = filterCategory;
  }

  const expenses = await Expense.find(query).sort({ date: -1 });

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

  // Dynamic Spending Trend based on period
  let spendingTrendData;
  let numDataPoints;

  if (period === 'weekly') {
    numDataPoints = 7;
    spendingTrendData = Array(numDataPoints).fill(0);
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const diffTime = Math.abs(endDate.getTime() - expenseDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < numDataPoints) {
        spendingTrendData[numDataPoints - 1 - diffDays] += expense.amount;
      }
    });
  } else if (period === 'monthly') {
    // Assuming a month has up to 31 days for simplicity, can be dynamic
    numDataPoints = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate(); // Days in current month
    spendingTrendData = Array(numDataPoints).fill(0);
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() === endDate.getMonth() && expenseDate.getFullYear() === endDate.getFullYear()) {
        const dayOfMonth = expenseDate.getDate();
        spendingTrendData[dayOfMonth - 1] += expense.amount;
      }
    });
  } else if (period === 'yearly') {
    numDataPoints = 12; // 12 months in a year
    spendingTrendData = Array(numDataPoints).fill(0);
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === endDate.getFullYear()) {
        const monthOfYear = expenseDate.getMonth(); // 0-indexed
        spendingTrendData[monthOfYear] += expense.amount;
      }
    });
  }

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
    spendingTrend: spendingTrendData, // Changed from weeklySpending
    budgetLeft,
    budgetUsed,
    budgetProgress,
    categories: sortedCategories,
    recentExpenses: expenses,
  });
});

module.exports = { getExpenses, addExpense, getExpenseSummary };
