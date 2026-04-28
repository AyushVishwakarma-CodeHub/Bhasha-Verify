import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-16 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="text-neon-green" size={32} />
          <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
        </div>
        <p className="text-gray-500 text-sm mb-8">Last Updated: April 28, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>Bhasha-Verify ("we", "us", "our") is an AI-powered scam detection platform. We are committed to protecting the privacy and security of our users. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and WhatsApp bot service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Account Information:</strong> When you register, we collect your name, email address, and a securely hashed password. We never store your password in plain text.</li>
              <li><strong className="text-white">Scan Data:</strong> When you submit text messages or audio recordings for analysis, we temporarily process the content to generate a risk assessment. The AI-generated analysis result (risk level, probability score) is stored to power your personal analytics dashboard.</li>
              <li><strong className="text-white">Audio Files:</strong> Uploaded audio files are processed in-memory for transcription and analysis. They are <strong>not permanently stored</strong> on our servers and are deleted immediately after processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To provide scam detection and analysis services.</li>
              <li>To display your personal scan history and analytics on your dashboard.</li>
              <li>To improve our AI model's accuracy and detect emerging scam patterns (using anonymized, aggregated data only).</li>
              <li>To maintain platform security and prevent abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
            <p>We do <strong className="text-white">not</strong> sell, rent, or share your personal information with any third parties. Your messages and audio files are never shared externally. We use Google's Gemini AI API for analysis — your data is sent securely via encrypted channels and is subject to Google's data processing policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention & Deletion</h2>
            <p>Your scan history is retained as long as your account is active. You may request complete deletion of your account and all associated data at any time through the "Request Account Deletion" option in your Analytics dashboard. We will process your request within <strong className="text-white">72 hours</strong>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Security</h2>
            <p>We implement industry-standard security measures including password hashing (bcrypt), SSL/TLS encryption for data in transit, and secure cloud-hosted databases. However, no method of electronic transmission is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights (DPDP Act Compliance)</h2>
            <p>In accordance with India's Digital Personal Data Protection (DPDP) Act, 2023, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
              <li>Access and review your personal data.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and all associated data.</li>
              <li>Withdraw consent for data processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:ayushvishwakarmadto29@gmail.com" className="text-neon-green hover:underline">ayushvishwakarmadto29@gmail.com</a></p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
