const express = require('express');
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer'); // Import multer

const router = express.Router();

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/').get(protect, getProfile).put(protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;

