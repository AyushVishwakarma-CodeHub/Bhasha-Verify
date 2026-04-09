import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, MessageSquareText, Mic, History, Upload, X, FileAudio, BarChart3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingAnalyzer from '../components/LoadingAnalyzer';

const TABS = [
  { id: 'text', label: 'TEXT', mobileLabel: 'TEXT', icon: MessageSquareText },
  { id: 'audio', label: 'CALL RECORDING', mobileLabel: 'AUDIO', icon: Mic },
  { id: 'history', label: 'HISTORY', mobileLabel: 'HISTORY', icon: History },
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

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await axios.get(`https://bhasha-verify.onrender.com/api/history?user_id=${authUser.id}`);
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://bhasha-verify.onrender.com/api/scan', {
        message: message, user_id: authUser.id
      });
      setTimeout(() => { navigate('/result', { state: { data: response.data } }); }, 2500);
    } catch (err) {
      setError('Unable to reach the server.');
      setLoading(false);
    }
  };

  const handleAnalyzeAudio = async () => {
    if (!audioFile) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('user_id', authUser.id);
      const response = await axios.post('https://bhasha-verify.onrender.com/api/scan-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000
      });
      if (response.data.error) { setError(response.data.error); setLoading(false); return; }
      setTimeout(() => { navigate('/result', { state: { data: response.data } }); }, 2500);
    } catch (err) {
      setError('Audio analysis failed.');
      setLoading(false);
    }
  };

  const clearAudio = () => {
    setAudioFile(null);
    const input = document.getElementById('audio-upload');
    if (input) input.value = '';
  };

  if (loading) return <LoadingAnalyzer />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 relative">

      {/* ─── HEADER BAR ─── */}
      <div className="absolute top-4 right-4 md:top-12 md:right-12 flex items-center gap-2 z-20">
        <span className="text-gray-400 text-sm hidden md:block">
          Welcome, <span className="text-white font-medium">{authUser?.full_name || 'User'}</span>
        </span>
        <motion.button
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20 transition-colors text-xs md:text-sm"
          onClick={() => navigate('/admin')}
        >
          <BarChart3 size={16} />
          <span className="font-semibold tracking-wider hidden sm:inline">DASHBOARD</span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/20 transition-colors text-xs md:text-sm"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span className="font-semibold tracking-wider hidden sm:inline">EXIT</span>
        </motion.button>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-3xl w-full mt-16 sm:mt-0"
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_12px_rgba(0,255,159,0.7)]" />
          <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
            <span className="text-white">Bhasha</span><span className="text-neon-green"> -Verify</span>
          </h2>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 md:mb-4 tracking-tight text-white leading-tight">
          Is this message <span className="neon-text-green">safe?</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm sm:text-lg md:text-xl mb-4 md:mb-6 max-w-2xl mx-auto px-2">
          Your Digital Bodyguard. Paste any SMS, WhatsApp text, email, or <span className="text-neon-green font-medium">upload a call recording</span> to detect scams instantly using AI.
        </p>

        {/* WhatsApp CTA */}
        <div className="flex justify-center mb-6 md:mb-10">
          <motion.a
            href="https://wa.me/14155238886?text=join%20interior-famous"
            target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-full border border-[#25D366]/30 transition-all font-medium text-xs md:text-sm"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.603 6.034L0 24l6.135-1.608a11.745 11.745 0 005.91 1.558h.005c6.632 0 12.05-5.414 12.05-12.05 0-3.217-1.252-6.242-3.525-8.514" /></svg>
            <span className="hidden sm:inline">Better on WhatsApp? Try the Bot</span>
            <span className="sm:hidden">WhatsApp Bot</span>
          </motion.a>
        </div>

        {/* ─── TAB NAVIGATION (mobile-friendly) ─── */}
        <div className="flex items-center justify-center gap-0 mb-6 border-b border-gray-800 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null); }}
                className={`relative flex items-center gap-1.5 px-3 sm:px-6 py-3 text-[11px] sm:text-sm font-semibold tracking-wider uppercase transition-colors duration-200 whitespace-nowrap
                  ${isActive ? 'text-neon-green' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Icon size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.mobileLabel}</span>
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

        {/* ─── TAB CONTENT ─── */}
        <AnimatePresence mode="wait">
          {/* TEXT TAB */}
          {activeTab === 'text' && (
            <motion.div key="text-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="glass-panel p-2 flex flex-col items-center w-full"
            >
              <textarea
                value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g., URGENT: Your SBI account is blocked..."
                className="w-full bg-transparent border-none outline-none resize-none text-white text-base md:text-lg p-4 md:p-6 min-h-[120px] md:min-h-[160px] placeholder-gray-600"
              />
              <div className="w-full flex justify-between items-center px-4 pb-4">
                <span className="text-gray-500 text-xs md:text-sm">{message.length} chars</span>
                <button onClick={handleAnalyzeText} disabled={!message.trim()}
                  className="group flex items-center gap-2 bg-white text-dark px-4 py-2.5 md:px-6 md:py-3 rounded-full font-semibold hover:bg-neon-green transition-all text-sm md:text-base disabled:opacity-50"
                >
                  Analyze <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* AUDIO TAB */}
          {activeTab === 'audio' && (
            <motion.div key="audio-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="glass-panel p-4 md:p-8 flex flex-col items-center w-full gap-4 md:gap-6"
            >
              {!audioFile ? (
                <div className="w-full border-2 border-dashed border-gray-700 rounded-xl p-6 md:p-10 flex flex-col items-center cursor-pointer hover:border-neon-green/50"
                  onClick={() => document.getElementById('audio-upload').click()}
                >
                  <Upload size={32} className="text-neon-green mb-3" />
                  <p className="text-gray-300 font-medium text-sm md:text-base">Tap to upload audio</p>
                  <p className="text-gray-600 text-xs mt-1">MP3, WAV, M4A • Max 25MB</p>
                </div>
              ) : (
                <div className="w-full bg-black/40 rounded-xl p-4 md:p-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileAudio size={24} className="text-neon-green shrink-0" />
                    <p className="text-white truncate text-sm md:text-base">{audioFile.name}</p>
                  </div>
                  <button onClick={clearAudio} className="text-gray-400 hover:text-red-500 shrink-0"><X size={20} /></button>
                </div>
              )}
              <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={(e) => { if (e.target.files[0]) setAudioFile(e.target.files[0]); }} />
              <button onClick={handleAnalyzeAudio} disabled={!audioFile}
                className="bg-white text-dark px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold hover:bg-neon-green transition-all text-sm md:text-base disabled:opacity-50"
              >
                Transcribe & Analyze
              </button>
            </motion.div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <motion.div key="history-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="glass-panel p-4 md:p-6 flex flex-col items-center w-full min-h-[200px] md:min-h-[300px]"
            >
              {loadingHistory ? (
                <p className="text-gray-500 py-10">Loading...</p>
              ) : history.length === 0 ? (
                <p className="text-gray-500 py-10">No scans yet</p>
              ) : (
                <div className="w-full space-y-2 md:space-y-3 max-h-[400px] overflow-y-auto">
                  {history.map(item => (
                    <div key={item.id}
                      className="bg-black/40 p-3 md:p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-black/60 transition-colors"
                      onClick={() => navigate('/result', { state: { data: { ...item, trust_score: { probability: parseFloat(item.probability), risk_level: item.risk_level }, analysis_data: JSON.parse(item.analysis_data) }}})}
                    >
                      <p className="text-gray-300 truncate text-sm max-w-[200px] sm:max-w-[300px]">{item.original_message}</p>
                      <ArrowRight size={16} className="text-gray-600 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 md:mt-6 text-neon-red font-medium text-left glass-panel p-3 md:p-4 border border-neon-red/30 text-sm"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
