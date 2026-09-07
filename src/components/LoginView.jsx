import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';

export function LoginView() {
  const studio = useStudio();
  const theme = studio?.theme || 'dark';
  const toggleTheme = studio?.toggleTheme || (() => {});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Safe login executor: uses context login or direct api fallback
  const performLogin = async (loginEmail, loginPassword) => {
    if (typeof studio?.login === 'function') {
      return await studio.login(loginEmail, loginPassword);
    }
    // Fallback if context is pending HMR refresh
    const res = await api.login(loginEmail, loginPassword);
    if (res?.user) {
      if (typeof studio?.setCurrentUser === 'function') {
        studio.setCurrentUser(res.user);
      }
      localStorage.setItem('ims_studio_current_user', JSON.stringify(res.user));
      window.location.reload();
      return res.user;
    }
    throw new Error('Login failed: invalid response');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await performLogin(email, password);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail) => {
    setEmail(quickEmail);
    setPassword('ims2026');
    setError('');
    setLoading(true);
    try {
      await performLogin(quickEmail, 'ims2026');
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: 'Admin / Studio Director',
      badge: 'Full Admin Privileges',
      badgeColor: 'bg-red-500/10 text-[#E5252A] border-red-500/30',
      name: 'IMS Studio Director',
      email: 'admin@ims-studio.com',
      avatar: '/ims-logo.png'
    },
    {
      role: 'Sr. Studio Manager (2D)',
      badge: 'Management Privileges',
      badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      name: 'Farhan Rahman',
      email: 'farhan.rahman@ims-studio.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      role: '3D Visualizer (Artist)',
      badge: 'Visualizer Privileges',
      badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      name: 'Rafiul Karim',
      email: 'rafiul.karim@ims-studio.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    {
      role: 'BD Lead',
      badge: 'Business Development',
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      name: 'Shahriar Alam',
      email: 'shahriar.bd@ims-studio.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between dark:bg-[#0B0F14] bg-[#F8FAFC] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Bar with Logo & Theme Toggle */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#E5252A] p-0.5 bg-white flex items-center justify-center shadow-sm">
            <img src="/ims-logo.png" alt="IMS Studio" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight dark:text-white text-slate-900 leading-none">
              IMS <span className="text-[#E5252A] font-serif italic">Studio</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Experiential Work Management
            </div>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border dark:border-[#30363d] border-slate-200 dark:bg-[#161b22] bg-white text-slate-600 dark:text-slate-300 hover:border-[#E5252A] transition-colors cursor-pointer"
          title="Toggle Day / Dark Mode"
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
      </div>

      {/* Main Login Form Container */}
      <div className="max-w-4xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Card: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-xl space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E5252A]/10 text-[#E5252A] border border-[#E5252A]/20">
              <ShieldCheck size={14} /> Authentication Portal
            </div>
            <h1 className="text-2xl font-black dark:text-white text-slate-900 tracking-tight">
              Sign In to IMS Studio
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your studio projects, visualizer tasks, timesheets, and notifications.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold dark:text-slate-200 text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  required
                  type="email"
                  placeholder="name@ims-studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 focus:outline-none focus:border-[#E5252A] dark:text-white text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold dark:text-slate-200 text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 focus:outline-none focus:border-[#E5252A] dark:text-white text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold text-xs transition-all shadow-lg shadow-red-900/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t dark:border-[#21262d] border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Default demo password: <strong className="font-mono text-[#E5252A]">ims2026</strong></span>
            <span>Experiential Studio v1.0.0</span>
          </div>
        </div>

        {/* Right Card: Quick Demo Login Switcher */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold dark:text-white text-slate-900 flex items-center gap-2">
              <Sparkles size={16} className="text-[#E5252A]" />
              Quick Demo Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any role below to test privileges and assignment notifications instantly:
            </p>
          </div>

          <div className="space-y-3">
            {demoAccounts.map(account => (
              <button
                key={account.email}
                onClick={() => handleQuickLogin(account.email)}
                className="w-full p-3.5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 hover:border-[#E5252A] text-left transition-all shadow-sm hover:shadow-md flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={account.avatar}
                  alt={account.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700 group-hover:border-[#E5252A] transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold dark:text-white text-slate-900 truncate">
                      {account.name}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${account.badgeColor}`}>
                      {account.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{account.email}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4 text-center text-xs text-slate-400 border-t dark:border-[#21262d] border-slate-200">
        IMS Studio Work & Production Management • Experiential 2D & 3D Workflows
      </div>

    </div>
  );
}
