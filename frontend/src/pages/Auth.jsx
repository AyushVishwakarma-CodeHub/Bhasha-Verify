import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const finalizeLogin = (user) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    navigate('/scanner');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://bhasha-verify.onrender.com/api/auth/google', {
        token: credentialResponse.credential
      });
      if (response.data.success) {
        finalizeLogin(response.data.user);
      } else {
        setError(response.data.error || "Google Authentication failed.");
      }
    } catch (err) {
      setError("Server Connection Error.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => setError("Failed to initialize Google Sign-In.");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endpoint = isLogin
      ? 'https://bhasha-verify.onrender.com/api/auth/login'
      : 'https://bhasha-verify.onrender.com/api/auth/register';
    try {
      const response = await axios.post(endpoint, formData);
      if (response.data.success) {
        const user = isLogin ? response.data.user : { id: response.data.id, ...formData };
        finalizeLogin(user);
      } else {
        setError(response.data.error || "Authentication failed. Please check your credentials.");
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Network error. Backend may be waking up — try again in 30 seconds.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 relative overflow-hidden bg-[#030306]">

      {/* ═══ LAYER 1: 3D PERSPECTIVE GRID ═══ */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] overflow-hidden pointer-events-none" style={{ perspective: '400px' }}>
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,159,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,159,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'rotateX(65deg)',
            transformOrigin: 'center top',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ═══ LAYER 2: FLOATING SCAM MESSAGES (Hinglish) ═══ */}
      {[
        { text: '"आपका अकाउंट ब्लॉक हो गया है..."', x: '5%', y: '15%', delay: 0, color: 'rgba(255,77,77,0.12)' },
        { text: '"KYC update karo nahi to account band..."', x: '65%', y: '10%', delay: 1.5, color: 'rgba(255,77,77,0.1)' },
        { text: '"₹50,000 lottery jeet gaye! Click here..."', x: '10%', y: '75%', delay: 3, color: 'rgba(255,200,87,0.1)' },
        { text: '"OTP share karo verify karne ke liye..."', x: '70%', y: '80%', delay: 4.5, color: 'rgba(255,77,77,0.08)' },
        { text: '"Dear customer, your SBI card..."', x: '75%', y: '45%', delay: 2, color: 'rgba(255,200,87,0.08)' },
        { text: '"Police station se bol raha hoon..."', x: '3%', y: '50%', delay: 5, color: 'rgba(255,77,77,0.1)' },
      ].map((msg, i) => (
        <motion.div
          key={`msg-${i}`}
          className="absolute pointer-events-none px-3 py-2 rounded-lg border text-xs font-mono max-w-[200px] truncate"
          style={{
            left: msg.x,
            top: msg.y,
            background: msg.color,
            borderColor: msg.color.replace('0.1', '0.2').replace('0.08', '0.15').replace('0.12', '0.2'),
            color: 'rgba(255,255,255,0.25)',
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: msg.delay,
            ease: "easeInOut",
          }}
        >
          {msg.text}
        </motion.div>
      ))}

      {/* ═══ LAYER 3: CENTRAL SHIELD PULSE ═══ */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
          <path d="M200 40L340 110V230C340 310 270 370 200 390C130 370 60 310 60 230V110L200 40Z" 
            stroke="#00FF9F" strokeWidth="1.5" fill="rgba(0,255,159,0.02)" />
          <path d="M200 70L310 125V230C310 295 255 340 200 358C145 340 90 295 90 230V125L200 70Z" 
            stroke="#00FF9F" strokeWidth="0.5" fill="none" opacity="0.3" />
          {/* Checkmark inside shield */}
          <motion.path d="M160 200L185 225L240 170" stroke="#00FF9F" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* ═══ LAYER 4: AURORA NEBULA ═══ */}
      <motion.div 
        className="absolute top-[-20%] left-[-30%] w-[70%] h-[50%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,255,159,0.06) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)', filter: 'blur(60px)' }}
        animate={{ x: [0, 80, 0], scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[-10%] right-[-15%] w-[50%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)', filter: 'blur(50px)' }}
        animate={{ x: [0, -60, 0], scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ═══ LAYER 5: FLOATING PARTICLES ═══ */}
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: i % 3 === 0 ? '#00FF9F' : i % 3 === 1 ? '#3B82F6' : '#A855F7',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -(60 + Math.random() * 120), 0],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ═══ LAYER 6: ORBITING SECURITY RING ═══ */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full border border-neon-green/[0.06] pointer-events-none"
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-neon-green rounded-full shadow-[0_0_15px_rgba(0,255,159,0.8)]" />
      </motion.div>
      <motion.div
        className="absolute w-[680px] h-[680px] rounded-full border border-blue-500/[0.04] pointer-events-none"
        style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.7)]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <ShieldAlert className="text-neon-green" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-neon-green to-blue-400 bg-clip-text text-transparent tracking-wide">
              Bhasha-Verify
            </h1>
          </div>
          <p className="text-gray-400 text-xs md:text-sm">Enterprise Scam Protection</p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel p-5 sm:p-8 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative">
          {/* Tab switcher */}
          <div className="flex justify-between mb-6 md:mb-8 border-b border-gray-700 pb-3 md:pb-4">
            <button
              className={`w-1/2 text-center font-medium pb-2 transition-colors text-sm md:text-base ${isLogin ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-500'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`w-1/2 text-center font-medium pb-2 transition-colors text-sm md:text-base ${!isLogin ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-500'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative">
                  <label className="text-xs md:text-sm text-gray-400 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input type="text" name="full_name" placeholder="Your Name" value={formData.full_name} onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 md:py-3 px-9 md:px-10 text-white text-sm md:text-base placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-xs md:text-sm text-gray-400 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input type="email" name="email" placeholder="you@company.com" value={formData.email} onChange={handleInputChange}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 md:py-3 px-9 md:px-10 text-white text-sm md:text-base placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs md:text-sm text-gray-400 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 md:py-3 px-9 md:px-10 text-white text-sm md:text-base placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 p-2.5 md:p-3 rounded text-xs md:text-sm text-center bg-red-500/10 border border-red-500/50">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-neon-green text-black font-bold py-2.5 md:py-3 rounded-lg hover:bg-[#00e68f] transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : (isLogin ? 'Access Scanner' : 'Create Account')}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-xs md:text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Google Sign In */}
          <div className="mt-4 md:mt-6 flex justify-center w-full relative z-10">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="filled_black" shape="pill" width="100%" />
          </div>

          {/* WhatsApp Link */}
          <div className="mt-4 md:mt-6 flex flex-col items-center">
            <motion.a href="https://wa.me/14155238886?text=join%20interior-famous" target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-[#25D366] text-xs md:text-sm font-semibold"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.603 6.034L0 24l6.135-1.608a11.745 11.745 0 005.91 1.558h.005c6.632 0 12.05-5.414 12.05-12.05 0-3.217-1.252-6.242-3.525-8.514" /></svg>
              Prefer WhatsApp? Try the Bot
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
