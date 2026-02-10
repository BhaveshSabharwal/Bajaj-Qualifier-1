# Bajaj Qualifier 1 API

This is a production-ready REST API built with Node.js and Express.

## Features

- **Publicly Accessible**: Designed for deployment on Vercel/Railway/Render.
- **Robust Error Handling**: Strict status codes (400, 422, 500, 502) and JSON validation.
- **AI Integration**: Uses Google Gemini API for the `AI` endpoint.

## API Endpoints

### 1. `GET /health`

Returns the health status of the API.

**Response:**
```json
{
  "is_success": true,
  "official_email": "YOUR_CHITKARA_EMAIL"
}
```

### 2. `POST /bfhl`

Accepts a JSON body with exactly one key from: `fibonacci`, `prime`, `lcm`, `hcf`, `AI`.

**Example Request:**
```json
{ "fibonacci": 10 }
```

**Example Response:**
```json
{
  "is_success": true,
  "official_email": "YOUR_CHITKARA_EMAIL",
  "data": [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
}
```

## Local Setup

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    OFFICIAL_EMAIL=your.email@chitkara.edu.in
    GEMINI_API_KEY=your_gemini_api_key
    ```
4.  **Start the server:**
    ```bash
    npm start
    ```

## Deployment

This project is ready for deployment on platforms like Vercel, Railway, or Render. Ensure you set the environment variables in your deployment dashboard.
