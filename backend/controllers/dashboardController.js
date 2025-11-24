const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { period } = req.query;

  let startDate = new Date();
  // Default to weekly if no period is specified or an invalid period is provided.
  // This corresponds to `Weekly` which is currently the default in `Dashboard.tsx`.
  // If the user selects `Monthly` or `Yearly`, the frontend should pass that value.
  switch (period) {
    case 'Monthly':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'Yearly':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'Weekly':
    default:
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      break;
  }

  const incomes = await Income.find({
    user: userId,
    date: { $gte: startDate },
  });

  const expenses = await Expense.find({
    user: userId,
    date: { $gte: startDate },
  });

  const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
  const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  // Basic spending trend (for simplicity, just return amounts over time)
  // In a real application, you'd want more sophisticated aggregation for trends
  const spendingTrend = expenses.map(e => ({ date: e.date, amount: e.amount }));

  // Top spending categories
  const categoryMap = {};
  expenses.forEach(expense => {
    if (categoryMap[expense.category]) {
      categoryMap[expense.category] += expense.amount;
    } else {
      categoryMap[expense.category] = expense.amount;
    }
  });

  const topSpendingCategories = Object.keys(categoryMap)
    .map(category => ({
      category,
      amount: categoryMap[category],
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3); // Top 3 categories

  // Combine incomes and expenses for transaction history, sort by date
  const transactions = [...incomes.map(i => ({
    _id: i._id,
    name: i.title,
    desc: i.description,
    category: 'Income',
    date: i.date,
    amount: i.amount,
    type: 'income',
  })),
  ...expenses.map(e => ({
    _id: e._id,
    name: e.title,
    desc: e.description,
    category: e.category,
    date: e.date,
    amount: e.amount,
    type: 'expense',
  }))].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({
    totalIncome,
    totalExpenses,
    netSavings,
    spendingTrend,
    topSpendingCategories,
    transactions,
  });
});

module.exports = { getDashboardSummary };

