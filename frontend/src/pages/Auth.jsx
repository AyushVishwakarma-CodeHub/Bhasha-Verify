import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on edit
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin 
      ? 'http://localhost:8000/api/auth/login' 
      : 'http://localhost:8000/api/auth/register';

    try {
      const response = await axios.post(endpoint, formData);
      
      if (response.data.success) {
        // Automatically save user session using LocalStorage
        let user = isLogin ? response.data.user : { id: response.data.id, email: formData.email, full_name: formData.full_name };
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Grant access -> Redirect to Home
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Network error. Could not reach server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShieldAlert className="text-neon-green" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-green to-blue-400 bg-clip-text text-transparent tracking-wide">
              Bhasha-Verify
            </h1>
          </div>
          <p className="text-gray-400">Enterprise Scam Protection</p>
        </div>

        <div className="glass-panel p-8 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
          
          <div className="flex justify-between mb-8 border-b border-gray-700 pb-4">
            <button 
              className={`w-1/2 text-center font-medium pb-2 transition-colors ${isLogin ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button 
              className={`w-1/2 text-center font-medium pb-2 transition-colors ${!isLogin ? 'text-neon-green border-b-2 border-neon-green' : 'text-gray-500 hover:text-gray-300'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      name="full_name"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Corporate or Personal Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 w-full bg-neon-green hover:bg-[#00e68f] text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : (isLogin ? 'Access Scanner' : 'Register Securely')}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
