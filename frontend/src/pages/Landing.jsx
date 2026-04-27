import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  Mic, 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  Lock, 
  Activity,
  MessageSquare
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem('auth_user') || 'null');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-neon-green/30 selection:text-neon-green overflow-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-dark/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-neon-green rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-dark" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              BHASHA <span className="text-neon-green">-VERIFY</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            {authUser ? (
              <Link to="/scanner" className="px-5 py-2.5 bg-neon-green text-dark font-bold rounded-lg hover:bg-[#00D97E] transition-all flex items-center gap-2 group">
                Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-gray-400 hover:text-white font-medium transition-colors">Login</Link>
                <Link to="/auth" className="px-5 py-2.5 bg-neon-green text-dark font-bold rounded-lg hover:bg-[#00D97E] transition-all shadow-[0_0_20px_rgba(0,255,159,0.3)]">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 px-6">
        {/* Background Overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] opacity-40 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-dark/0 via-dark/50 to-dark" />
        </div>

        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            AI-Powered Scam Protection
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Stop Scams in Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-blue-400">Regional Language</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            The first AI security shield built specifically for Hinglish and Indian dialects. 
            Instantly scan SMS, WhatsApp messages, and call recordings.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-8 py-4 bg-neon-green text-dark text-lg font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,159,0.4)] flex items-center justify-center gap-2"
            >
              Start Free Scan <ArrowRight size={20} />
            </button>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              How it Works
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Protecting Every Interaction</h2>
            <p className="text-gray-400">Global AI intelligence, localized for Indian users.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-neon-green/50 transition-all group"
            >
              <div className="w-14 h-14 bg-neon-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-neon-green transition-colors">
                <MessageSquare className="text-neon-green group-hover:text-dark" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Text & WhatsApp</h3>
              <p className="text-gray-400 leading-relaxed">
                Paste any suspicious SMS or WhatsApp text. Our AI detects urgency tactics, fake bank alerts, and malicious links.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all group"
            >
              <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-400 transition-colors">
                <Mic className="text-blue-400 group-hover:text-dark" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Audio Analysis</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload call recordings. We transcribe and analyze voice-based scams, including deepfake and social engineering attempts.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-400/50 transition-all group"
            >
              <div className="w-14 h-14 bg-purple-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-400 transition-colors">
                <Globe className="text-purple-400 group-hover:text-dark" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Hinglish Intelligence</h3>
              <p className="text-gray-400 leading-relaxed">
                Optimized for mixed languages like Hindi-English (Hinglish) and regional dialects where standard tools fail.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-8">Scan in Seconds</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-green text-dark flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Paste or Upload</h4>
                    <p className="text-gray-400">Copy text from WhatsApp or upload a recorded call file.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-green text-dark flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">AI Scan</h4>
                    <p className="text-gray-400">Our engine performs heuristic and semantic analysis using Google Gemini.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-green text-dark flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Get Result</h4>
                    <p className="text-gray-400">Receive a detailed Trust Score and clear reasons for the risk level.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm mb-2">
                      <Activity size={16} /> SCAM DETECTED
                    </div>
                    <p className="text-sm text-gray-300">"Urgent: Your SBI account is blocked. Click here to update KYC..."</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-gray-500 text-xs uppercase mb-2">AI Reasoning</div>
                    <ul className="text-sm space-y-2 text-gray-400">
                      <li className="flex gap-2"><CheckCircle size={14} className="text-neon-green flex-shrink-0 mt-1" /> Unofficial URL format detected</li>
                      <li className="flex gap-2"><CheckCircle size={14} className="text-neon-green flex-shrink-0 mt-1" /> High-urgency manipulative language</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-green/20 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-neon-green/20 to-blue-500/20 border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <ShieldCheck size={200} className="text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 relative z-10">Ready to stay safe?</h2>
          <p className="text-gray-300 text-lg mb-12 relative z-10">Join thousands of users who trust Bhasha-Verify for their daily security.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-10 py-5 bg-white text-dark text-xl font-bold rounded-2xl hover:scale-105 transition-all shadow-2xl"
            >
              Create Account
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <Lock size={18} /> Secure & Encrypted
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon-green rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-dark" size={18} />
            </div>
            <span className="font-bold tracking-tight">BHASHA-VERIFY</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 Bhasha-Verify. AI Scam Detection for the next billion.
          </div>
          <Link to="/developer" className="text-gray-400 hover:text-neon-green transition-colors flex items-center gap-2 text-sm font-medium">
            <span>Know about Developer</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
