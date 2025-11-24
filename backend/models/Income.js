const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ref: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Received', 'Pending', 'Cancelled'],
    default: 'Received',
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Freelance', 'Ad Revenue', 'Consulting', 'Investment', 'Salary', 'Other'],
    default: 'Other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Income', IncomeSchema);
