const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const User = require('../models/User'); // Assuming user has a monthlyBudget field

const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { timeRange = 'This Year' } = req.query;

  let startDate = new Date();
  const endDate = new Date();

  switch (timeRange) {
    case 'Last 6 Months':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case 'This Year':
      startDate.setFullYear(endDate.getFullYear(), 0, 1); // Start of the current year
      startDate.setHours(0, 0, 0, 0); 
      break;
    case 'All Time':
      // No start date filter, fetch all
      startDate = new Date(0); // Epoch
      break;
    default:
      startDate.setFullYear(endDate.getFullYear(), 0, 1); // Default to This Year
      startDate.setHours(0, 0, 0, 0);
      break;
  }

  const incomes = await Income.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  const expenses = await Expense.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  // Calculate Net Worth
  const totalIncomeAmount = incomes.reduce((acc, item) => acc + item.amount, 0);
  const totalExpenseAmount = expenses.reduce((acc, item) => acc + item.amount, 0);
  const netWorth = totalIncomeAmount - totalExpenseAmount; // Simplified, in real app would include assets

  // Calculate Savings Rate (simplified for demo)
  const user = await User.findById(userId);
  const monthlyBudget = user ? user.monthlyBudget || 0 : 0;
  const savingPotential = monthlyBudget > 0 ? (monthlyBudget - totalExpenseAmount) : 0;
  const savingsRate = totalIncomeAmount > 0 ? (savingPotential / totalIncomeAmount) * 100 : 0;

  // Avg. Monthly Cashflow
  // For 'This Year', divide by current month number (1-12)
  // For 'Last 6 Months', divide by 6
  let numberOfMonths = 1;
  if (timeRange === 'This Year') {
    numberOfMonths = endDate.getMonth() + 1; // Current month number
  } else if (timeRange === 'Last 6 Months') {
    numberOfMonths = 6;
  } else if (timeRange === 'All Time') {
    const firstIncomeDate = incomes.length > 0 ? new Date(incomes[0].date) : endDate;
    const firstExpenseDate = expenses.length > 0 ? new Date(expenses[0].date) : endDate;
    const earliestDate = new Date(Math.min(firstIncomeDate.getTime(), firstExpenseDate.getTime()));
    numberOfMonths = Math.ceil(Math.abs(endDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (numberOfMonths === 0) numberOfMonths = 1; // Avoid division by zero
  }
  
  const avgMonthlyCashflow = numberOfMonths > 0 ? (totalIncomeAmount - totalExpenseAmount) / numberOfMonths : 0;

  // Cashflow Trends (Income vs Expenses over time)
  // This requires a more complex aggregation, for now, let's group by month
  const cashflowTrendsMap = {};

  [...incomes, ...expenses].forEach(item => {
    const date = new Date(item.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
    if (!cashflowTrendsMap[monthYear]) {
      cashflowTrendsMap[monthYear] = { income: 0, expense: 0 };
    }
    if (item.title) { // Assuming title exists for income
      cashflowTrendsMap[monthYear].income += item.amount;
    } else if (item.name) { // Assuming name exists for expense
      cashflowTrendsMap[monthYear].expense += item.amount;
    }
  });

  const cashflowTrends = Object.keys(cashflowTrendsMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(key => ({
      month: new Date(key).toLocaleString('default', { month: 'short' }),
      income: cashflowTrendsMap[key].income,
      expense: cashflowTrendsMap[key].expense,
    }));

  // Asset Allocation (Mock Data for now)
  const assetAllocation = [
    { label: 'Stocks & ETFs', amount: 60000, percentage: 40 },
    { label: 'Real Estate', amount: 37500, percentage: 25 },
    { label: 'Crypto', amount: 30000, percentage: 20 },
    { label: 'Cash', amount: 22500, percentage: 15 },
  ];

  // Financial Goals (Mock Data for now)
  const financialGoals = [
    { name: 'Emergency Fund', current: 15000, target: 20000, icon: 'Wallet' },
    { name: 'New Car', current: 8500, target: 25000, icon: 'Car' },
    { name: 'Dream Home', current: 45000, target: 150000, icon: 'Home' },
  ];

  res.json({
    netWorth,
    savingsRate: savingsRate.toFixed(2),
    avgMonthlyCashflow: avgMonthlyCashflow.toFixed(2),
    cashflowTrends,
    assetAllocation,
    financialGoals,
  });
});

module.exports = { getAnalyticsSummary };

