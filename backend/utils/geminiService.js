const pdfParse = require('pdf-parse');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Gemini models list
const PRIMARY_MODELS = [
  'models/gemini-pro-vision',
  'models/gemini-2.5-flash',
  'models/gemini-1.5-flash-latest',
  'models/gemini-1.0-pro-latest',
];

const getChatbotResponse = async (prompt, userName, language, file = null) => {
  console.log('geminiService: file received:', file);
  if (!GEMINI_API_KEY) {
    return "Assistant connection issue. Please try again later.";
  }

  const currentUserName = userName || 'User';
  const isHindi = (language || '').toLowerCase() === 'hi';

  let extractedText = '';

  try {
    let finalPrompt = '';
    let imageBase64 = null;
    let modelToUse = PRIMARY_MODELS[0]; // Default to first model

    // 🔍 Step 1: File handling
    if (file && file.buffer) {
        const ext = path.extname(file.originalname).toLowerCase(); // Use originalname for extension
        console.log('geminiService: Detected file extension:', ext);

            if (ext === '.pdf') {
                const pdfData = await pdfParse(file.buffer); // Read from buffer
                extractedText = pdfData.text;
                console.log('📄 PDF text extracted successfully');
            } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                // For image files, read as base64 for Gemini Vision
                imageBase64 = file.buffer.toString('base64'); // Read from buffer
                modelToUse = 'models/gemini-pro-vision'; // Use vision model
                console.log('🖼️ Image converted to base64 for Vision API. modelToUse:', modelToUse);
                console.log('geminiService: imageBase64 populated.'); // Debug log
                // console.log('imageBase64 sample:', imageBase64.substring(0, 50) + '...'); // Log first 50 chars

                // Also perform OCR for text extraction as a fallback/additional info
                const result = await Tesseract.recognize(file.buffer, 'eng'); // Pass buffer to Tesseract
                extractedText = result.data.text;
                console.log('🖼️ Image OCR extracted successfully');
            }
        }

        console.log('geminiService: Value of imageBase64 after conditional logic:', !!imageBase64); // New debug log

        // 🧠 Step 2: Create prompt
        const tone = isHindi
            ? `You are YouthWallet’s friendly and helpful financial assistant.\n             Always address the user by their name (${currentUserName}) and clearly answer all finance-related queries.\n             End each response with: "Main 100% sahi nahi ho sakta, kripya kisi financial advisor se consult kare."`
            : `You are YouthWallet’s friendly and helpful financial assistant.\n             Always address the user by their name (${currentUserName}) and clearly answer all finance-related queries.\n             End each response with: "I\'m not 100% accurate, please consult a financial advisor for confirmation."`;

        let userQueryText = prompt || ''; // User's original message

        // Remove the `[File: filename]` prefix from userQueryText if present
        if (file && userQueryText.startsWith(`[File: ${file.originalname}]`)) {
            userQueryText = userQueryText.substring(`[File: ${file.originalname}]`.length).trim();
        }

        const requestParts = [];

        if (imageBase64) {
            requestParts.push({
                inlineData: {
                    mimeType: file.mimetype,
                    data: imageBase64,
                },
            });
        }

        let textPromptContent = '';
        if (imageBase64) {
            textPromptContent = `The user has provided an image for analysis. `;
            if (extractedText) {
                textPromptContent += `Here is the extracted text from the image: "${extractedText}". `;
            }
            if (userQueryText) {
                textPromptContent += `User's additional query: "${userQueryText}". `;
            }
            textPromptContent += `Please analyze the image content `;
            if (extractedText) {
                textPromptContent += `along with the extracted text `;
            }
            textPromptContent += `and respond in ${isHindi ? 'Hindi' : 'English'} language.`;
        } else if (extractedText) { // Only extracted text (e.g., from PDF, or OCR from image without explicit image analysis instruction)
            textPromptContent = `The user has uploaded a financial document/report. Here is the extracted text:\n"${extractedText}"\n\n`;
            textPromptContent += `Analyze this document/report and explain it in ${isHindi ? 'Hindi' : 'English'} language.`
            if (userQueryText) {
                textPromptContent += ` User also said: "${userQueryText}".`;
            }
        } else { // No file or image, just text prompt
            textPromptContent = `User: ${userQueryText}`;
        }

        requestParts.push({ text: `${tone}\n${textPromptContent}` });

        console.log('geminiService: Final requestParts before API call:', JSON.stringify(requestParts, null, 2)); // Debug log

        // 🧩 Step 3: Call Gemini API
        const body = {
            contents: [{ role: 'user', parts: requestParts }],
        };
        console.log('geminiService: Final Gemini API request body:', JSON.stringify(body, null, 2));
        console.log('geminiService: Model to use:', modelToUse);

        // Use the selected model (vision or default)
        for (const model of [modelToUse, ...PRIMARY_MODELS.filter(m => m !== modelToUse)]) { // Prioritize modelToUse
            for (const version of ['v1beta', 'v1']) {
                try {
                    const url = `https://generativelanguage.googleapis.com/${version}/${model}:generateContent?key=${GEMINI_API_KEY}`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });

                    const data = await response.json();
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.();
                    if (text) return text;
                } catch (err) {
                    console.error(`❌ Gemini model error [${model}]:`, err.message);
                    continue;
                }
            }
        }

        return "Sorry, I'm unable to respond right now. Please try again later.";

    } catch (err) {
        console.error('💥 Gemini Service Error:', err);
        return 'Something went wrong while analyzing your file.';
    } finally {
        // No file cleanup needed as files are stored in memory
    }
};

module.exports = { getChatbotResponse };
