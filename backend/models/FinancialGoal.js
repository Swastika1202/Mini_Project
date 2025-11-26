const mongoose = require('mongoose');

const FinancialGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a goal name'],
    trim: true,
    maxlength: [100, 'Goal name can not be more than 100 characters'],
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please add a target amount'],
    min: [0, 'Target amount must be a positive number'],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount must be a positive number'],
  },
  targetDate: {
    type: Date,
    required: [true, 'Please add a target date'],
  },
  icon: {
    type: String,
    enum: ['Wallet', 'Car', 'Home', 'Target', 'Travel', 'Education', 'Gadget', 'General', 'Gift'], // Expanded icons
    default: 'Wallet',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FinancialGoal', FinancialGoalSchema);