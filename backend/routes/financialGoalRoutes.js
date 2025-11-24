const express = require('express');
const router = express.Router();
const {
  getFinancialGoals,
  createFinancialGoal,
  updateFinancialGoal,
  deleteFinancialGoal,
} = require('../controllers/financialGoalController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFinancialGoals).post(protect, createFinancialGoal);
router.route('/:id').put(protect, updateFinancialGoal).delete(protect, deleteFinancialGoal);

module.exports = router;