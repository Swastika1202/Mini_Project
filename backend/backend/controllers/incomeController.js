const Income = require('../models/Income');

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

module.exports = { getIncomes, addIncome };
