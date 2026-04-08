import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, MessageSquareText, Mic, History, Upload, X, FileAudio, BarChart3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingAnalyzer from '../components/LoadingAnalyzer';

const TABS = [
  { id: 'text', label: 'TEXT / MESSAGE', icon: MessageSquareText },
  { id: 'audio', label: 'CALL RECORDING', icon: Mic },
  { id: 'history', label: 'HISTORY', icon: History },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('text');
  const [message, setMessage] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    navigate('/auth');
  };

  // ─── Fetch History ────────────────────────────────
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await axios.get(`https://bhasha-verify.onrender.com/api/history?user_id=${authUser.id}`);
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      // Don't show a blocking error, just keep history empty
    } finally {
      setLoadingHistory(false);
    }
  };

  // ─── Text Analysis Handler ─────────────────────────
  const handleAnalyzeText = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://bhasha-verify.onrender.com/api/scan', {
        message: message,
        user_id: authUser.id
      });
      setTimeout(() => {
        navigate('/result', { state: { data: response.data } });
      }, 2500);
    } catch (err) {
      console.error(err);
      setError('Unable to reach the server. Is the PHP backend running?');
      setLoading(false);
    }
  };

  // ─── Audio Analysis Handler ────────────────────────
  const handleAnalyzeAudio = async () => {
    if (!audioFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('user_id', authUser.id);

      const response = await axios.post('https://bhasha-verify.onrender.com/api/scan-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000 // 60s timeout for transcription
      });

      if (response.data.error) {
        setError(response.data.error);
        setLoading(false);
        return;
      }

      setTimeout(() => {
        navigate('/result', { state: { data: response.data } });
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Audio analysis failed. Check your API key and try again.');
      setLoading(false);
    }
  };

  const clearAudio = () => {
    setAudioFile(null);
    // Reset the file input
    const input = document.getElementById('audio-upload');
    if (input) input.value = '';
  };

  if (loading) {
    return <LoadingAnalyzer />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 p-6 relative">
      {/* Floating Header Badges */}
      <div className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-3 z-20">
        <span className="text-gray-400 text-sm hidden md:block">Welcome, <span className="text-white font-medium">{authUser?.full_name || 'User'}</span></span>
        
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.15)]"
          onClick={() => navigate('/admin')}
        >
          <BarChart3 size={18} />
          <span className="font-semibold tracking-wider text-sm hidden sm:inline">ADMIN</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/20 transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="font-semibold tracking-wider text-sm hidden sm:inline">EXIT</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl w-full"
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_12px_rgba(0,255,159,0.7)]"
          />
          <h2 className="text-2xl font-bold tracking-widest uppercase">
            <span className="text-white">Bhasha</span>
            <span className="text-neon-green"> -Verify</span>
          </h2>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-white leading-tight">
          Is this message <span className="neon-text-green">safe?</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Your Digital Bodyguard. Paste any SMS, WhatsApp text, email, or <span className="text-neon-green font-medium">upload a call recording</span> to detect scams instantly using AI.
        </p>

        {/* === TAB NAVIGATION === */}
        <div className="flex items-center justify-center gap-1 mb-6 border-b border-gray-800 pb-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null); }}
                className={`relative flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-colors duration-200
                  ${isActive ? 'text-neon-green' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Icon size={16} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-neon-green shadow-[0_0_8px_rgba(0,255,159,0.6)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* === TAB CONTENT === */}
        <AnimatePresence mode="wait">

          {/* ── TEXT TAB ── */}
          {activeTab === 'text' && (
            <motion.div
              key="text-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="glass-panel p-2 flex flex-col items-center w-full focus-within:ring-2 focus-within:ring-neon-green/50 transition-all duration-300"
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., URGENT: Your SBI account is blocked. Click here to verify KYC..."
                className="w-full bg-transparent border-none outline-none resize-none text-white text-lg p-6 min-h-[160px] placeholder-gray-600"
              />
              <div className="w-full flex justify-between items-center px-4 pb-4">
                <span className="text-gray-500 text-sm">{message.length} characters</span>
                <button
                  onClick={handleAnalyzeText}
                  disabled={message.trim() === ''}
                  className="group flex items-center gap-2 bg-white text-dark px-6 py-3 rounded-full font-semibold hover:bg-neon-green hover:text-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── AUDIO TAB ── */}
          {activeTab === 'audio' && (
            <motion.div
              key="audio-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="glass-panel p-8 flex flex-col items-center w-full gap-6"
            >
              {!audioFile ? (
                /* ── Upload Drop Zone ── */
                <div
                  className="w-full border-2 border-dashed border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:border-neon-green/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('audio-upload').click()}
                >
                  <div className="p-4 bg-neon-green/10 rounded-full">
                    <Upload size={36} className="text-neon-green" />
                  </div>
                  <p className="text-gray-300 text-lg font-medium">
                    Drop your audio file here or click to upload
                  </p>
                  <p className="text-gray-600 text-sm">Supports MP3, WAV, M4A • Max 25MB</p>
                </div>
              ) : (
                /* ── File Selected Preview ── */
                <div className="w-full bg-black/40 rounded-xl p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-neon-green/10 rounded-full">
                      <FileAudio size={28} className="text-neon-green" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium truncate max-w-[300px]">{audioFile.name}</p>
                      <p className="text-gray-500 text-sm">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={clearAudio}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-neon-red"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <input
                id="audio-upload"
                type="file"
                accept=".mp3,.wav,.m4a,.ogg,.webm,audio/*"
                className="hidden"
                onChange={(e) => { if (e.target.files[0]) setAudioFile(e.target.files[0]); }}
              />

              <button
                onClick={handleAnalyzeAudio}
                disabled={!audioFile}
                className="group flex items-center gap-2 bg-white text-dark px-6 py-3 rounded-full font-semibold hover:bg-neon-green hover:text-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Transcribe & Analyze
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="glass-panel p-6 flex flex-col items-center w-full min-h-[300px]"
            >
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-8 h-8 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
                  <p className="text-gray-500 text-sm animate-pulse">Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <History size={48} className="text-gray-800" />
                  <p className="text-gray-500 text-lg font-medium">No scans yet</p>
                  <p className="text-gray-600 text-sm">Your past analysis results will appear here.</p>
                </div>
              ) : (
                <div className="w-full space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-colors group cursor-pointer"
                      onClick={() => navigate('/result', { state: { data: {
                        original_message: item.original_message,
                        trust_score: { probability: parseFloat(item.probability), risk_level: item.risk_level },
                        heuristic_analysis: item.analysis_data.heuristics,
                        ai_insights: item.analysis_data.ai,
                        rag_verification: item.analysis_data.rag,
                        source: item.source,
                        isFromHistory: true
                      }}})}
                    >
                      <div className="flex items-center gap-4 text-left">
                         <div className={`w-2 h-10 rounded-full ${
                           item.risk_level === 'Scam' ? 'bg-neon-red' : 
                           item.risk_level === 'Suspicious' ? 'bg-yellow-500' : 'bg-neon-green'
                         }`} />
                         <div className="max-w-[400px]">
                            <p className="text-gray-300 text-sm line-clamp-1 italic">"{item.original_message}"</p>
                            <div className="flex items-center gap-3 mt-1">
                               <span className={`text-xs font-bold uppercase ${
                                 item.risk_level === 'Scam' ? 'text-neon-red' : 
                                 item.risk_level === 'Suspicious' ? 'text-yellow-500' : 'text-neon-green'
                               }`}>
                                 {item.risk_level} • {parseFloat(item.probability).toFixed(0)}%
                               </span>
                               <span className="text-[10px] text-gray-600 font-mono">
                                 {new Date(item.scanned_at).toLocaleDateString()} {new Date(item.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </span>
                            </div>
                         </div>
                      </div>
                      <ArrowRight size={18} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-6 text-neon-red font-medium text-left glass-panel p-4 border border-neon-red/30"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
