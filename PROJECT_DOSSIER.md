# Bhasha-Verify: Project Technical Dossier
**Enterprise-Grade AI Scam Protection for the Modern Language Landscape**

---

## 🛡️ 1. Project Overview: What is Bhasha-Verify?
**Bhasha-Verify** is a cross-platform protection engine designed to identify and neutralize scams in real-time. Unlike traditional filters that only look for English keywords, Bhasha-Verify is built for the **multilingual reality** of India (Hinglish, regional dialects) and handles both **Text** and **Voice Notes**.

### The Core Problem
*   **Language Barrier**: Modern scams use "Hinglish" to bypass simple spam filters.
*   **Audio Scams**: A rising trend of scammers using voice notes which are usually unscanable by traditional apps.
*   **Authority Impersonation**: Scammers pretend to be banks or government bodies using high-urgency language.

### The Solution 
An AI-first ecosystem that analyzes messages across multiple layers (Heuristics + AI + RAG) and delivers a "Trust Score" instantly via a Web App or a WhatsApp Bot.

---

## ⚙️ 2. The Architecture: How It Works
We use a proprietary **"Triple-Threat" Analysis Engine** to ensure zero-day scam detection.

### Layer 1: Heuristic Engine (Speed)
*   **What**: Pattern matching for urgent keywords (e.g., "KYC", "Block", "Urgent") and suspicious URL detection.
*   **Why**: Provides instant feedback for obvious scams without using expensive AI resources.

### Layer 2: AI Semantic Engine (Intelligence)
*   **What**: Using **Google Gemini Pro** to understand the *intent* of the message. 
*   **Why**: Detects the "vibe" of a scam even if it uses friendly language. It can identify if a message is trying to extract an OTP, login credentials, or money.

### Layer 3: RAG (Retrieval-Augmented Generation) (Authority)
*   **What**: Cross-verifies claims made in a message against official brand guidelines.
*   **Why**: If a message says "Your SBI account is blocked," the RAG engine checks if the tone and format match real SBI communications.

---

## 🛠️ 3. Tech Stack: The "What" and "Why"

| Component | Technology | Why we used it? |
| :--- | :--- | :--- |
| **Frontend** | **React.js + Tailwind** | We needed a **High-Performance UI** that is responsive on mobile. HeroUI/Lucide were used for a "Premium" developer aesthetic. |
| **Backend** | **PHP 8.2 (Apache)** | PHP is the "Backbone of the Web." It provides native, fast routing and is extremely efficient at handling API webhooks (like Twilio). |
| **Database** | **Aiven Cloud MySQL** | We needed a **Managed Cloud Database** that is always on and supports multi-tenant isolation so user data is secure and private. |
| **Container** | **Docker** | We containerized the backend so that the "Development Environment" is identical to the "Production Environment," preventing deployment bugs. |
| **CDN/Hosting**| **Vercel** | Industry-standard for frontend deployment. It provides the **SSL Security** and global speed needed for a SaaS product. |

---

## 🔌 4. API Integration: Which and Why?

### **1. Google Gemini Pro API**
*   **Role**: The "Brain" of the system. Handles semantic scanning and high-accuracy transcription.
*   **Why?**: Gemini is currently the best-performing LLM for **Hinglish and Regional Indian languages**. It understands local context (like UPI scams) better than competitors.

### **2. Twilio WhatsApp API**
*   **Role**: The "Bridge." Connects our AI engine directly to the world's most popular messaging app.
*   **Why?**: Scams most often happen on WhatsApp. By using the Twilio API, we put the protection right where the danger is.

---

## ☁️ 5. Deployment Map (How we went Live)

> [!IMPORTANT]
> The project uses a **Global Cloud Triangle** strategy:
> 1.  **Vercel** delivers the Frontend UI to the user's browser.
> 2.  **Render** hosts the Dockerized PHP Backend to handle logic.
> 3.  **Aiven** stores all user scans and history in a secure MySQL vault.

---

## 📈 6. Future Roadmap
*   **Multi-modal Video Analysis**: Detecting "Deepfake" video call scams.
*   **Browser Extension**: Real-time pop-ups when a user visits a suspicious link.
*   **Localized LLMs**: Fine-tuning models specifically for Tamil, Telugu, and Marathi scam patterns.

---

### **Project Final Status: 100% LIVE 🚀**
*   **Web:** [bhasha-verify.vercel.app](https://bhasha-verify.vercel.app)
*   **Backend:** [bhasha-verify.onrender.com](https://bhasha-verify.onrender.com)
