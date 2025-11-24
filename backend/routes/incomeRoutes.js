const express = require('express');
const { getIncomes, addIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getIncomes).post(protect, addIncome);

module.exports = router;
