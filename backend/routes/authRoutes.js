const express = require('express');
const passport = require('passport');
const multer = require('multer'); // Import multer
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register', upload.single('avatar'), registerUser); // Add multer middleware
router.post('/login', loginUser);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard or send token
    // For now, let's redirect to a success page or send user info
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${req.user.token}`);
  }
);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;