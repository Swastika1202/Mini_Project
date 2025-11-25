const express = require('express');
const { getChatbotResponse } = require('../utils/geminiService');
const { protect } = require('../middleware/authMiddleware'); // Assuming authentication is needed
const multer = require('multer');

const router = express.Router();

// Configure Multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { prompt, userName, language } = req.body;
    const file = req.file; // Uploaded file details

    if (!prompt && !file) {
      return res.status(400).json({ message: 'Please provide a prompt or a file.' });
    }

    const response = await getChatbotResponse(prompt, userName, language, file);
    res.json({ response });
  } catch (error) {
    console.error('Error in chatbot route:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
