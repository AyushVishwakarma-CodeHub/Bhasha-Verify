import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { ArrowLeft, ShieldAlert, Activity, Database, Smartphone, Users, Radio, Mail, Clock, Mic, MessageSquareText } from 'lucide-react';
import axios from 'axios';

const API = 'https://bhasha-verify.onrender.com';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview'); // overview | users | activity

  const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const ADMIN_EMAILS = ['ayushvishwakarmadto29@gmail.com'];
  const isAdmin = ADMIN_EMAILS.includes(authUser?.email?.toLowerCase());

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Analytics: admin sees global, regular users see their own
        const analyticsUrl = isAdmin
          ? `${API}/api/admin/analytics`
          : `${API}/api/admin/analytics?user_id=${authUser.id}`;
        
        const requests = [axios.get(analyticsUrl)];
        
        // Only admin can fetch users list and activity feed
        if (isAdmin) {
          requests.push(
            axios.get(`${API}/api/admin/users?admin_email=${encodeURIComponent(authUser.email)}`),
            axios.get(`${API}/api/admin/activity?admin_email=${encodeURIComponent(authUser.email)}`)
          );
        }

        const results = await Promise.all(requests);
        setStats(results[0].data);
        if (isAdmin && results[1]) setUsers(results[1].data);
        if (isAdmin && results[2]) setActivity(results[2].data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Activity className="animate-spin text-neon-green" size={40} />
        <h2 className="text-white text-xl animate-pulse">
          {isAdmin ? 'Loading Admin Portal...' : 'Loading your analytical portal...'}
        </h2>
      </div>
    );
  }

  if (!stats) return <div className="text-white text-center mt-20">Failed to load admin dashboard.</div>;

  const pieData = [
    { name: 'Safe', value: stats.riskDistribution.Safe || 0, color: '#00FF9F' },
    { name: 'Suspicious', value: stats.riskDistribution.Suspicious || 0, color: '#FFC857' },
    { name: 'Scam', value: stats.riskDistribution.Scam || 0, color: '#FF4D4D' }
  ];

  const barData = [
    { name: 'Text / WhatsApp', count: stats.sourceDistribution.text || 0 },
    { name: 'Audio Calls', count: stats.sourceDistribution.audio || 0 }
  ];

  const timelineData = stats.recentActivity.map(item => {
    const [year, month, day] = item.date.split('-');
    return { date: `${month}/${day}`, count: item.count };
  });

  const riskBadge = (level) => {
    const colors = {
      Scam: 'bg-red-500/20 text-red-400 border-red-500/30',
      Suspicious: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Safe: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return `px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold border ${colors[level] || 'text-gray-400'}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const NAV_TABS = [
    { id: 'overview', label: 'Analytics', icon: Activity },
    ...(isAdmin ? [
      { id: 'users', label: 'Users', icon: Users, count: users.length },
      { id: 'activity', label: 'Activity Feed', icon: Radio, count: activity.length },
    ] : [])
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 relative pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button onClick={() => navigate('/scanner')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={18} /> Back to Scanner
        </button>
        <span className="bg-black/50 border border-gray-800 text-gray-300 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs">
          <Database size={14} /> Aiven MySQL • Live
        </span>
      </div>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          {isAdmin ? 'Admin Portal' : 'My Analytics'}
        </h1>
        <p className="text-gray-400 mt-1 text-sm md:text-lg">
          {isAdmin ? 'Real-time platform monitoring & user management.' : 'Your personal scan analytics & security insights.'}
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 border-b border-gray-800 overflow-x-auto">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 sm:px-5 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase whitespace-nowrap transition-colors
                ${isActive ? 'text-neon-green' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Icon size={15} />
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/10 rounded-full">{tab.count}</span>
              )}
              {isActive && (
                <motion.div layoutId="adminTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-neon-green shadow-[0_0_8px_rgba(0,255,159,0.6)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════ OVERVIEW TAB ═══════════ */}
      {activeSection === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-5 md:p-6">
              <p className="text-gray-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-2">Total Scans</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white">{stats.totalScans}</h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-panel p-5 md:p-6 border-b-4 border-b-neon-red">
              <p className="text-gray-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldAlert size={14} className="text-neon-red" /> Threats Blocked
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-neon-red">{stats.riskDistribution.Scam || 0}</h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-5 md:p-6 transition-all hover:border-white/20">
              <p className="text-gray-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-2">
                {isAdmin ? 'Registered Users' : 'Safe Interactions'}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                {isAdmin ? users.length : (stats.riskDistribution.Safe || 0)}
              </h2>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-5 md:p-6 min-h-[350px] md:min-h-[400px] flex flex-col">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 border-b border-white/10 pb-2">Risk Distribution</h3>
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">{isAdmin ? 'Global' : 'My'}</p>
                  <p className="text-white text-xl font-bold">Threats</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-5 md:p-6 min-h-[350px] md:min-h-[400px] flex flex-col">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 border-b border-white/10 pb-2 flex items-center justify-between">
                <span>Input Vectors</span>
                <Smartphone size={18} className="text-gray-400" />
              </h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#4B90FF" radius={[8, 8, 0, 0]} maxBarSize={60}>
                      {barData.map((e, i) => <Cell key={i} fill={i === 0 ? '#4B90FF' : '#B84BFF'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel p-5 md:p-6 min-h-[300px] md:min-h-[350px]">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 border-b border-white/10 pb-2">7-Day Scan Volume</h3>
            <div className="w-full h-[200px] md:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} />
                  <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="count" stroke="#00FF9F" strokeWidth={3} dot={{ r: 5, fill: '#00FF9F', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ═══════════ USERS TAB ═══════════ */}
      {activeSection === 'users' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-panel overflow-hidden">
            <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <Users size={20} className="text-neon-green" /> Registered Users
              </h3>
              <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{users.length} total</span>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Scans</th>
                    <th className="px-6 py-4">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-gray-600 text-sm">{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-green/30 to-blue-500/30 flex items-center justify-center text-white text-xs font-bold">
                            {user.full_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-white font-medium text-sm">{user.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(user.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-white/10 text-white text-xs font-bold px-2.5 py-1 rounded-full">{user.scan_count}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{user.last_active ? formatDate(user.last_active) : 'Never'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-3 space-y-3">
              {users.map((user) => (
                <div key={user.id} className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green/30 to-blue-500/30 flex items-center justify-center text-white text-sm font-bold">
                      {user.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{user.full_name}</p>
                      <p className="text-gray-500 text-xs truncate">{user.email}</p>
                    </div>
                    <span className="ml-auto bg-white/10 text-white text-xs font-bold px-2 py-1 rounded-full shrink-0">{user.scan_count} scans</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-600">
                    <span>Joined {formatDate(user.created_at)}</span>
                    <span>Last active: {user.last_active ? formatDate(user.last_active) : 'Never'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════ ACTIVITY FEED TAB ═══════════ */}
      {activeSection === 'activity' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-panel overflow-hidden">
            <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                <Radio size={20} className="text-neon-green animate-pulse" /> Live Activity Feed
              </h3>
              <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">Last {activity.length} events</span>
            </div>

            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {activity.map((scan) => (
                <div key={scan.id} className="px-4 md:px-6 py-3 md:py-4 hover:bg-white/[0.02] transition-colors flex items-start gap-3 md:gap-4">
                  {/* Source Icon */}
                  <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${scan.source === 'audio' ? 'bg-purple-500/10' : 'bg-blue-500/10'}`}>
                    {scan.source === 'audio'
                      ? <Mic size={16} className="text-purple-400" />
                      : <MessageSquareText size={16} className="text-blue-400" />
                    }
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-white font-medium text-sm">{scan.user_name}</span>
                      <span className="text-gray-600 text-xs">scanned {scan.source === 'audio' ? 'audio' : 'text'}</span>
                      <span className={riskBadge(scan.risk_level)}>{scan.risk_level}</span>
                      <span className="text-gray-500 text-xs font-mono">{parseFloat(scan.probability).toFixed(0)}%</span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm truncate">{scan.original_message?.substring(0, 80)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock size={11} className="text-gray-600" />
                      <span className="text-gray-600 text-[11px]">{formatDate(scan.scanned_at)} {formatTime(scan.scanned_at)}</span>
                      {scan.user_email && <span className="text-gray-700 text-[11px]">• {scan.user_email}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
