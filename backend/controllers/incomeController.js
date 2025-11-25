const Income = require('../models/Income');
const asyncHandler = require('express-async-handler');

// @desc    Get all income for a user
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user._id });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new income
// @route   POST /api/income
// @access  Private
const addIncome = async (req, res) => {
  const { name, ref, date, status, amount, type } = req.body;

  try {
    const newIncome = await Income.create({
      userId: req.user._id,
      name,
      ref,
      date,
      status,
      amount,
      type,
    });
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomeSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { period = 'weekly' } = req.query; // Default to weekly

  let startDate = new Date();
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

  const incomes = await Income.find({
    userId,
    date: { $gte: startDate },
  }).sort({ date: -1 });

  const totalRevenue = incomes.reduce((acc, curr) => curr.status === 'Received' ? acc + curr.amount : acc, 0);
  const pendingClearance = incomes.reduce((acc, curr) => curr.status === 'Pending' ? acc + curr.amount : acc, 0);
  const receivedIncomesCount = incomes.filter(t => t.status === 'Received').length;
  const avgTransaction = receivedIncomesCount > 0 ? totalRevenue / receivedIncomesCount : 0;

  // Income Growth (Weekly breakdown for now)
  const incomeGrowth = Array(8).fill(0); // For 8 weeks
  const now = new Date();
  incomes.forEach(income => {
    const incomeDate = new Date(income.date);
    const diffTime = Math.abs(now.getTime() - incomeDate.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

    if (diffWeeks <= 8 && income.status === 'Received') {
      incomeGrowth[8 - diffWeeks] += income.amount; // Store from oldest to newest
    }
  });

  // Top Sources
  const sourceMap = {};
  incomes.forEach(income => {
    if (income.status === 'Received') {
      if (sourceMap[income.type]) {
        sourceMap[income.type] += income.amount;
      } else {
        sourceMap[income.type] = income.amount;
      }
    }
  });

  const topSources = Object.keys(sourceMap)
    .map(type => ({
      type,
      amount: sourceMap[type],
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3); // Top 3 sources

  res.json({
    totalRevenue,
    pendingClearance,
    avgTransaction,
    incomeGrowth,
    topSources,
    recentIncomes: incomes, // All incomes within the period
  });
});

module.exports = { getIncomes, addIncome, getIncomeSummary };
