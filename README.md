<p align="center">
  <img src="https://img.shields.io/badge/STATUS-LIVE-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Gemini_Pro-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<h1 align="center">🛡️ Bhasha-Verify</h1>
<p align="center"><strong>AI-Powered Multilingual Scam Detection Platform</strong></p>
<p align="center">Real-time protection against text, voice, and WhatsApp scams — built for India's multilingual reality.</p>

---

## 🌐 Live Links

| Service | URL |
| :--- | :--- |
| 🖥️ **Web App** | [bhasha-verify.vercel.app](https://bhasha-verify.vercel.app) |
| ⚙️ **Backend API** | [bhasha-verify.onrender.com](https://bhasha-verify.onrender.com) |
| 📱 **WhatsApp Bot** | [Chat on WhatsApp](https://wa.me/14155238886?text=join%20interior-famous) |

---

## 🧠 What is Bhasha-Verify?

Bhasha-Verify is a **cross-platform scam detection engine** that goes beyond simple keyword matching. It understands **Hinglish**, **regional Indian dialects**, and even **voice notes** — the real languages scammers use.

### The Problem
- Traditional spam filters fail on **code-mixed languages** (Hindi + English).
- **Voice note scams** are completely invisible to existing tools.
- Scammers impersonate banks and government bodies using **urgency tactics**.

### The Solution
A proprietary **"Triple-Threat" Analysis Engine** that delivers a Trust Score in seconds via Web or WhatsApp.

---

## ⚙️ Architecture — The Triple-Threat Engine

```
┌─────────────────────────────────────────────────────┐
│                   USER INPUT                        │
│          (Text / Audio / WhatsApp Message)           │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ LAYER 1  │  │ LAYER 2  │  │ LAYER 3  │
   │Heuristic │  │ Gemini   │  │   RAG    │
   │ Engine   │  │ AI (LLM) │  │ Verifier │
   └────┬─────┘  └────┬─────┘  └────┬─────┘
        │              │              │
        └──────────────┼──────────────┘
                       ▼
              ┌─────────────────┐
              │  TRUST SCORE    │
              │  + Risk Level   │
              │  + Explanation  │
              └─────────────────┘
```

| Layer | Engine | Purpose |
| :---: | :--- | :--- |
| 1 | **Heuristic** | Regex-based keyword & URL pattern matching for instant detection |
| 2 | **Gemini Pro AI** | Semantic intent analysis — understands context, urgency, and manipulation |
| 3 | **RAG Verifier** | Cross-references claims against official brand communication patterns |

---

## 🛠️ Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 19, Tailwind CSS, Framer Motion | High-performance SPA with premium animations |
| **Backend** | PHP 8.2, Apache | Fast webhook handling for Twilio; native routing |
| **Database** | Aiven Cloud MySQL (SSL/TLS) | Managed, always-on, multi-tenant secure storage |
| **AI Engine** | Google Gemini Pro API | Best-in-class Hinglish comprehension and audio transcription |
| **WhatsApp** | Twilio WhatsApp API | Places protection directly inside the messaging app |
| **Containerization** | Docker | Identical dev ↔ prod environments |
| **Frontend Hosting** | Vercel | Global CDN with automatic SSL |
| **Backend Hosting** | Render | Managed Docker container deployment |

---

## 🚀 Features

- ✅ **Text Analysis** — Paste any SMS, email, or WhatsApp message
- ✅ **Audio Analysis** — Upload call recordings (MP3/WAV/M4A) for AI transcription + scam detection
- ✅ **WhatsApp Bot** — Send messages directly to the bot for instant analysis
- ✅ **Scan History** — View past scans with risk levels and timestamps
- ✅ **Admin Dashboard** — Real-time analytics with charts (Recharts)
- ✅ **Google SSO** — One-click authentication via Google OAuth
- ✅ **Multilingual** — Handles English, Hindi, Hinglish, and regional dialects

---

## 📂 Project Structure

```
Bhasha-Verify/
├── frontend/                # React + Vite SPA
│   ├── src/
│   │   ├── components/      # WhatsAppFAB, LoadingAnalyzer, AIExplanation
│   │   └── pages/           # Home, Auth, Result, AdminDashboard
│   └── package.json
├── controllers/             # ScanController (text + audio + WhatsApp webhook)
├── services/                # AIService (Gemini), HeuristicService, RAGService
├── models/                  # UserModel, MessageModel (PDO + SSL)
├── database/                # schema.sql
├── config/                  # Environment loader
├── index.php                # API router (REST endpoints + Twilio webhook)
├── Dockerfile               # Production container (Apache + PHP + SSL certs)
├── composer.json            # PHP dependencies (Twilio SDK)
└── .env                     # Environment variables (not committed)
```

---

## 🏗️ Local Development Setup

### Prerequisites
- PHP 8.2+, Composer, Node.js 18+

### Backend
```bash
composer install
cp .env.example .env        # Add your GEMINI_API_KEY
php -S localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                  # Opens at http://localhost:5173
```

---

## ☁️ Cloud Deployment

| Layer | Platform | Config |
| :--- | :--- | :--- |
| Frontend | **Vercel** | Auto-deploys from `main` branch, root = `frontend/` |
| Backend | **Render** | Docker Web Service, env vars set in dashboard |
| Database | **Aiven** | MySQL 8 with SSL/TLS, port `10459` |

---

## 🔌 API Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/scan` | Analyze a text message |
| `POST` | `/api/scan-audio` | Upload & analyze an audio file |
| `POST` | `/api/whatsapp` | Twilio WhatsApp webhook |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/google` | Google OAuth SSO |
| `GET` | `/api/history` | Fetch scan history (by user_id) |
| `GET` | `/api/admin/stats` | Dashboard analytics |

---

## 📈 Future Roadmap

- 🔜 **Deepfake Video Detection** — Analyze video call recordings
- 🔜 **Browser Extension** — Real-time suspicious link alerts
- 🔜 **Regional LLM Tuning** — Fine-tuned models for Tamil, Telugu, Marathi
- 🔜 **Community Reporting** — Crowdsourced scam database

---

## 👤 Author

**Ayush Vishwakarma**
- GitHub: [@AyushVishwakarma-CodeHub](https://github.com/AyushVishwakarma-CodeHub)

---

<p align="center">
  <sub>Built with ❤️ for a safer digital India</sub>
</p>
