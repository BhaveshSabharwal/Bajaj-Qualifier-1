const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL ; // Set via ENV or hardcode
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Helper Functions
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const getLcm = (arr) => {
    if (arr.some(n => n === 0)) return 0;
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        result = (Math.abs(result * arr[i])) / gcd(result, arr[i]);
    }
    return result;
};

const getHcf = (arr) => {
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        result = gcd(result, arr[i]);
    }
    return result;
};

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

//Fibonacci number
const getFibonacci = (n) => {
    if (n === 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];
    let seq = [0, 1];
    for (let i = 2; i < n; i++) {
        seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq;
};

// GET /health
app.get('/health', (req, res) => {
    res.status(200).json({
        "is_success": true,
        "official_email": OFFICIAL_EMAIL
    });
});

// POST /bfhl
app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        
        // 1. Validate JSON presence (handled by express.json(), but check for empty body if needed)
        const keys = Object.keys(body);

        // 2. Validate Key Count: Must be exactly 1
        if (keys.length !== 1) {
            return res.status(400).json({
                "is_success": false,
                "official_email": OFFICIAL_EMAIL,
                "error": "Request body must contain exactly one key."
            });
        }

        const key = keys[0];
        const value = body[key];

        // 3. Validate Allowed Keys
        const Keys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
        if (!Keys.includes(key)) {
            return res.status(400).json({
                "is_success": false,
                "official_email": OFFICIAL_EMAIL,
                "error": "Invalid key provided."
            });
        }

        let result;

        try {
            switch (key) {
                case 'fibonacci':
                     // Type Validation: Must be integer
                    if (!Number.isInteger(value)) {
                        return res.status(400).json({
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "Input must be an integer." // Type mismatch -> 400
                        });
                    }
                    // Semantic Validation: Must be >= 0
                    if (value < 0) {
                        return res.status(422).json({
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "Input must be non-negative." // Unprocessable -> 422
                        });
                    }
                    result = getFibonacci(value);
                    break;
                
                case 'prime':
                    // Type Validation: Must be array
                    if (!Array.isArray(value)) {
                         return res.status(400).json({
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "Input must be an array."
                        });
                    }
                    // Element Type Validation: integers only
                    if (!value.every(Number.isInteger)) {
                        return res.status(400).json({
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "All elements must be integers."
                        });
                    }
                    // Semantic: Empty is valid.
                    // Filter: ignore <=1 
                    result = value.filter(isPrime);
                    break;

                case 'lcm':
                    // Type Validation
                    if (!Array.isArray(value)) {
                         return res.status(400).json({
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "Input must be an array."
                        });
                    }
                    if (!value.every(Number.isInteger)) {
                        return res.status(400).json({
                             "is_success": false,
                             "official_email": OFFICIAL_EMAIL,
                             "error": "All elements must be integers."
                         });
                    }
                    // Semantic Validation: Non-empty
                    if (value.length < 1) {
                         return res.status(422).json({
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "Array must not be empty."
                        });
                    }
                    result = getLcm(value);
                    break;

                case 'hcf':
                    // Type Validation
                    if (!Array.isArray(value)) {
                        return res.status(400).json({
                           "is_success": false,
                           "official_email": OFFICIAL_EMAIL,
                           "error": "Input must be an array."
                       });
                   }
                   if (!value.every(Number.isInteger)) {
                       return res.status(400).json({
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "All elements must be integers."
                        });
                   }
                   // Semantic Validation: Non-empty
                   if (value.length < 1) {
                        return res.status(422).json({
                           "is_success": false,
                           "official_email": OFFICIAL_EMAIL,
                           "error": "Array must not be empty."
                       });
                   }
                    result = getHcf(value);
                    break;

                case 'AI':
                     // Type Validation
                    if (typeof value !== 'string') {
                        return res.status(400).json({
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "Input must be a string."
                        });
                    }
                    // Semantic Validation: Not empty
                    if (value.trim() === '') {
                        return res.status(422).json({ // Unprocessable empty string
                            "is_success": false,
                            "official_email": OFFICIAL_EMAIL,
                            "error": "Input string must not be empty."
                        });
                    }
                    
                    if (!genAI) {
                        return res.status(500).json({
                             "is_success": false,
                             "official_email": OFFICIAL_EMAIL,
                             "error": "AI service not configured."
                        });
                    }

                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                    const prompt = `Respond in one word only. ${value}`;
                    
                    try {
                        const aiResult = await model.generateContent(prompt);
                        const response = await aiResult.response;
                        const text = response.text();
                        // Post-processing: Remove all punctuation except internal word chars if needed, but "one word" usually means just letters.
                        // "remove punctuation" -> regex replace.
                        // "trim whitespace"
                        result = text.trim().replace(/[^\w\s]/gi, '').split(/\s+/)[0]; 
                    } catch (aiError) {
                        console.error("AI Error:", aiError);
                        if(aiError.statusText === 'Too Many Requests'){
                            return res.status(429).json({
                                "is_success": false,
                                "official_email": OFFICIAL_EMAIL, 
                                "error": "Quota Over"
                            });
                        }else{
                            return res.status(502).json({
                                "is_success": false,
                                "official_email": OFFICIAL_EMAIL, 
                                "error": "AI provider failed."
                            });
                        }
                    }
                    break;
            }
        } catch (logicError) {
             console.error("Logic Error:", logicError);
             return res.status(500).json({
                "is_success": false,
                "official_email": OFFICIAL_EMAIL,
                "error": "Internal logic error."
            });
        }

        res.status(200).json({
            "is_success": true,
            "official_email": OFFICIAL_EMAIL,
            "data": result
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({
            "is_success": false,
            "official_email": OFFICIAL_EMAIL, 
            "error": "Internal Server Error"
        });
    }
});

// JSON Parsing Error Handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            "is_success": false,
            "official_email": OFFICIAL_EMAIL,
            "error": "Invalid JSON format"
        });
    }
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
