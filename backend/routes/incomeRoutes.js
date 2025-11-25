const express = require('express');
const { getIncomes, addIncome, getIncomeSummary } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getIncomes).post(protect, addIncome);
router.route('/summary').get(protect, getIncomeSummary);

module.exports = router;
