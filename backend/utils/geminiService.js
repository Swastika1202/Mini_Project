const PdfReader = require('pdfreader').PdfReader;
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const mammoth = require('mammoth');

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
                extractedText = await new Promise((resolve, reject) => {
                    new PdfReader().parseBuffer(file.buffer, (err, item) => {
                        if (err) {
                            console.error('Error parsing PDF:', err);
                            return reject(err);
                        } else if (!item) {
                            return resolve(extractedText);
                        } else if (item.text) {
                            extractedText += item.text + ' ';
                        }
                    });
                });
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
            } else if (ext === '.docx') {
                const docxData = await mammoth.extractRawText({ buffer: file.buffer });
                extractedText = docxData.value;
                console.log('📄 DOCX text extracted successfully');
            }
        }

        console.log('geminiService: Value of imageBase64 after conditional logic:', !!imageBase64); // New debug log

        // 🧠 Step 2: Create prompt
        const tone = isHindi
            ? `आप यूथवॉलेट के मित्रवत और सहायक वित्तीय सहायक हैं।
             आपको केवल वित्त-संबंधी प्रश्नों का उत्तर देना चाहिए। यदि कोई प्रश्न वित्त से संबंधित नहीं है, तो विनम्रता से बताएं कि आप केवल वित्त से संबंधित मामलों में सहायता कर सकते हैं। यदि कोई दस्तावेज़ अपलोड किया गया है और वह वित्त से संबंधित नहीं है, तो दस्तावेज़ के कुछ अंश का उल्लेख करें और फिर अपनी सीमाएं बताएं।
             उपयोगकर्ता को उनके नाम (${currentUserName}) से संबोधित करें।
             अपने उत्तरों को **बुलेट पॉइंट** में दें। प्रत्येक बुलेट पॉइंट एक नया पैराग्राफ होना चाहिए, और प्रत्येक पैराग्राफ के बीच कम से कम दो खाली लाइनें छोड़ें ताकि वे स्पष्ट रूप से अलग दिखें। महत्वपूर्ण कीवर्ड को **बोल्ड** करें।
             प्रत्येक प्रतिक्रिया का अंत इससे करें: "मैं 100% सही नहीं हो सकता, कृपया किसी वित्तीय सलाहकार से सलाह लें।"`
            : `You are YouthWallet’s friendly and helpful financial assistant.
             You should only answer finance-related questions. If a question is not related to finance, politely state that you can only assist with finance-related matters. If a document is uploaded and its content is not finance-related, mention a brief snippet of the document's content and then state your limitations.
             Always address the user by their name (${currentUserName}).
             Provide your answers in **bullet points**. Each bullet point must be a new paragraph, and there must be at least two empty lines between each paragraph to ensure clear separation. **Bold** important keywords.
             End each response with: "I'm not 100% accurate, please consult a financial advisor for confirmation."`;

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
        } else if (extractedText) { // Only extracted text (e.g., from PDF, DOCX, or OCR from image without explicit image analysis instruction)
            textPromptContent = `The user has uploaded a document/report. Here is the extracted text:
"${extractedText}"\n\n`;
            textPromptContent += `Please analyze this document/report and explain it in ${isHindi ? 'Hindi' : 'English'} language. Remember, if the content is not finance-related, acknowledge the content and then politely state your limitation.`;
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
