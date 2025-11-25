const express = require('express');
const { getExpenses, addExpense, getExpenseSummary } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, addExpense);
router.route('/summary').get(protect, getExpenseSummary);

module.exports = router;
