const FinancialGoal = require('../models/FinancialGoal');
const asyncHandler = require('express-async-handler');

// @desc    Get all financial goals
// @route   GET /api/goals
// @access  Private
const getFinancialGoals = asyncHandler(async (req, res) => {
  console.log("User ID in getFinancialGoals:", req.user.id); // Add this line
  const goals = await FinancialGoal.find({ userId: req.user.id });
  res.status(200).json(goals);
});

// @desc    Create a financial goal
// @route   POST /api/goals
// @access  Private
const createFinancialGoal = asyncHandler(async (req, res) => {
  const { name, targetAmount, targetDate, icon } = req.body;

  if (!name || !targetAmount || !targetDate) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  try {
    const goal = await FinancialGoal.create({
      userId: req.user.id,
      name,
      targetAmount,
      targetDate,
      icon,
    });
  
    res.status(201).json(goal);
  } catch (error) {
    console.error("Error creating financial goal:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Update a financial goal
// @route   PUT /api/goals/:id
// @access  Private
const updateFinancialGoal = asyncHandler(async (req, res) => {
  const goal = await FinancialGoal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  // Make sure the logged in user matches the goal user
  if (goal.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const { name, targetAmount, currentAmount, targetDate, icon } = req.body;

  const updatedGoal = await FinancialGoal.findByIdAndUpdate(req.params.id, {
    name,
    targetAmount,
    currentAmount,
    targetDate,
    icon,
  }, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedGoal);
});

// @desc    Delete a financial goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteFinancialGoal = asyncHandler(async (req, res) => {
  const goal = await FinancialGoal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  // Make sure the logged in user matches the goal user
  if (goal.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await goal.deleteOne();

  res.status(200).json({ message: 'Goal removed' });
});

module.exports = {
  getFinancialGoals,
  createFinancialGoal,
  updateFinancialGoal,
  deleteFinancialGoal,
};