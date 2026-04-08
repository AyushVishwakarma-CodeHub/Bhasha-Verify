import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { ArrowLeft, ShieldAlert, Activity, Database, Smartphone } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/analytics');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Activity className="animate-spin text-neon-green" size={40} />
        <h2 className="text-white text-xl animate-pulse">Aggregating Global Metrics...</h2>
      </div>
    );
  }

  if (!stats) return <div className="text-white text-center mt-20">Failed to load analytics dashboard.</div>;

  // Format data for Recharts
  const pieData = [
    { name: 'Safe', value: stats.riskDistribution.Safe || 0, color: '#00FF9F' },
    { name: 'Suspicious', value: stats.riskDistribution.Suspicious || 0, color: '#FFC857' },
    { name: 'Scam', value: stats.riskDistribution.Scam || 0, color: '#FF4D4D' }
  ];

  const barData = [
    { name: 'Text / WhatsApp', count: stats.sourceDistribution.text || 0 },
    { name: 'Audio Calls', count: stats.sourceDistribution.audio || 0 }
  ];

  // Map timeline data replacing raw dates with abbreviated versions
  const timelineData = stats.recentActivity.map(item => {
      // Very simple local formatting to fit better on charts
      const [year, month, day] = item.date.split('-');
      return { date: `${month}/${day}`, count: item.count };
  });

  return (
    <div className="min-h-screen p-6 md:p-12 relative pb-20">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Scanner
        </button>
        <span className="bg-black/50 border border-gray-800 text-gray-300 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
          <Database size={16} /> Live MySQL Link
        </span>
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Platform Analytics
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Real-time aggregate security metrics for Bhasha-Verify.</p>
      </motion.div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-6 flex flex-col justify-center">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Scans Processed</p>
          <h2 className="text-5xl font-bold text-white">{stats.totalScans}</h2>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-panel p-6 flex flex-col justify-center border-b-4 border-b-neon-red">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
             <ShieldAlert size={16} className="text-neon-red"/> Critical Threats Blocked
          </p>
          <h2 className="text-5xl font-bold text-neon-red">{stats.riskDistribution.Scam || 0}</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-6 flex flex-col justify-center">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Average Trust Probability</p>
          <h2 className="text-5xl font-bold text-white">{stats.avgProbability}%</h2>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Risk Distribution Pie Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6 min-h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-2">Risk Distribution</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend inside the chart frame to save space */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-gray-400 text-xs uppercase tracking-widest">Global</p>
              <p className="text-white text-2xl font-bold">Threats</p>
            </div>
          </div>
        </motion.div>

        {/* Scan Source Bar Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-6 min-h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-2 flex items-center justify-between">
            <span>Input Vectors</span>
            <Smartphone size={20} className="text-gray-400" />
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#aaa' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#4B90FF" radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4B90FF' : '#B84BFF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel p-6 min-h-[350px]">
         <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-2">7-Day Scan Activity Volume</h3>
         <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tick={{ fill: '#aaa' }} />
                <YAxis stroke="#666" tick={{ fill: '#aaa' }} allowDecimals={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#00FF9F" strokeWidth={3} dot={{ r: 5, fill: '#00FF9F', strokeWidth: 0 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
         </div>
      </motion.div>

    </div>
  );
}
