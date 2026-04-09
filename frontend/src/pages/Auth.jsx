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
    navigate('/');
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
      }
    } catch (err) {
      setError(err.response?.data?.error || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShieldAlert className="text-neon-green" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-green to-blue-400 bg-clip-text text-transparent tracking-wide">Bhasha-Verify</h1>
          </div>
          <p className="text-gray-400 text-sm">Enterprise Scam Protection</p>
        </div>

        <div className="glass-panel p-8 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative">
          <div className="flex justify-between mb-8 border-b border-gray-700 pb-4">
            <button className={`w-1/2 text-center font-medium pb-2 transition-colors ${isLogin ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-500'}`} onClick={() => setIsLogin(true)}>Sign In</button>
            <button className={`w-1/2 text-center font-medium pb-2 transition-colors ${!isLogin ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-500'}`} onClick={() => setIsLogin(false)}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative">
                  <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleInputChange} className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-600 focus:border-neon-green" required={!isLogin} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input type="email" name="email" placeholder="you@company.com" value={formData.email} onChange={handleInputChange} className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-600 focus:border-neon-green" required />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-600 focus:border-neon-green" required />
              </div>
            </div>

            {error && <div className="text-red-400 p-3 rounded text-sm text-center bg-red-500/10 border border-red-500/50">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-neon-green text-black font-bold py-3 rounded-lg hover:bg-[#00e68f] transition-all flex items-center justify-center gap-2">
              {loading ? 'Processing...' : (isLogin ? 'Access Scanner' : 'Create Account')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4"><div className="flex-1 h-px bg-gray-700" /><span className="text-gray-500 text-sm">OR</span><div className="flex-1 h-px bg-gray-700" /></div>

          <div className="mt-6 flex justify-center w-full relative z-10">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} theme="filled_black" shape="pill" width="100%" />
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <motion.a href="https://wa.me/14155238886?text=join%20interior-famous" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-[#25D366] text-sm font-semibold">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.603 6.034L0 24l6.135-1.608a11.745 11.745 0 005.91 1.558h.005c6.632 0 12.05-5.414 12.05-12.05 0-3.217-1.252-6.242-3.525-8.514" /></svg>
              Prefer WhatsApp? Try the Bot
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
