# Bhasha-Verify (AI Scam Detection)

A "Digital Bodyguard" that analyzes text messages for potential scams using a 3-layer architecture:
1. **Heuristic Engine**: Rules and Regex patterns.
2. **AI Semantic Analysis**: Google Gemini API integration for intent extraction.
3. **RAG Engine**: Verification against mock official bank patterns.

## 🛠️ Setup Instructions (Local)

### Prerequisites
- PHP 8+
- Composer
- Node.js 18+

### 1. Backend Setup
1. Open a terminal in the root directory.
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy `.env.example` to `.env` (or just edit the generated `.env` file).
4. Add your Gemini API Key in `.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
5. Start the PHP server:
   ```bash
   php -S localhost:8000
   ```

### 2. Frontend Setup
1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`

## ☁️ Deployment Guide

### Backend (PHP)
- Deploy the root folder to any standard PHP hosting service (Hostinger, cPanel, Railway, Heroku).
- Point the document root to `/` (since `index.php` is in the root).
- Ensure Composer dependencies are installed via `composer install --no-dev`.
- Update the API Key environment variable in the dashboard of your hosting provider.

### Frontend (React / Vite)
- In the `frontend` folder, run `npm run build`.
- Upload the contents of `frontend/dist` to Netlify, Vercel, or GitHub Pages.
- *Important*: Ensure you change the API endpoint in `Home.jsx` from `http://localhost:8000/api/scan` to your live PHP backend URL.

## 💾 MongoDB Integration (Next Steps)
Currently, Bhasha-Verify is entirely stateless to ensure maximum speed and privacy. For future updates indicating a database schema, use `mongodb/mongodb` via composer. You can create a `MessageModel.php` to log history of queries and user IDs.
