const express = require('express');
const { getExpenses, addExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getExpenses).post(protect, addExpense);

module.exports = router;
