import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  Sun,
  Moon,
  Play,
  Pause,
  Square,
  Database,
  ChevronDown,
  KeyRound,
  LogOut,
  ShieldCheck,
  Sparkles,
  Plus,
  Camera
} from 'lucide-react';

export function Navbar({ onOpenSyncModal, onOpenNewBrief, onOpenNewProject, onOpenChangePassword, onOpenProfilePicture }) {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    timerState,
    startTimer,
    pauseTimer,
    stopAndSaveTimer,
    data,
    currentUser,
    logout,
    isAdmin,
    isManager,
    isBD
  } = useStudio();

  const [userDropdown, setUserDropdown] = useState(false);

  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const activeProject = data.projects.find(p => p.id === timerState.projectId);
  const activeTask = data.tasks.find(t => t.id === timerState.taskId);

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'briefs', label: 'BD Pitch & Brief Hub', icon: Briefcase, badge: data.briefs.filter(b => b.briefStatus === 'Need Clarification').length },
    { id: 'projects', label: 'Studio Projects', icon: FolderKanban, badge: data.projects.filter(p => p.status === 'Ongoing').length },
    { id: 'tasks', label: 'Task Pipeline', icon: CheckSquare },
    { id: 'timetracking', label: 'Time & Timesheets', icon: Clock },
    { id: 'team', label: 'Studio Structure', icon: Users },
    { id: 'admin', label: 'Admin Category', icon: ShieldCheck }
  ];

  const getRoleBadge = (roleType) => {
    switch (roleType) {
      case 'admin':
        return 'bg-red-500/15 text-[#E5252A] border-red-500/30';
      case 'manager':
        return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
      case 'visualizer':
        return 'bg-purple-500/15 text-purple-500 border-purple-500/30';
      case 'bd':
        return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors border-b dark:bg-[#0d1117]/90 bg-white/90 dark:border-[#21262d] border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Tagline */}
          <div className="flex items-center gap-3 cursor-pointer group select-none" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <img
                  src="/ims-logo.png"
                  alt="IMS Studio Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 dark:border-[#0d1117] border-white" title="Studio System Active"></div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 leading-none">
                <span className="font-extrabold text-[17px] tracking-tight dark:text-white text-slate-900 leading-none">
                  IMS <span className="text-[#E5252A]">Studio</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded dark:bg-[#E5252A]/20 bg-[#E5252A]/10 text-[#E5252A] leading-none inline-flex items-center">
                  Experiential
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-none">
                Work & Production Management
              </span>
            </div>
          </div>

          {/* Center: Live Stopwatch Timer Bar */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full dark:bg-[#161b22] bg-slate-100 border dark:border-[#30363d] border-slate-200 shadow-inner">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${timerState.isRunning ? 'bg-[#E5252A] pulse-glow' : 'bg-slate-400'}`}></span>
              <span className="font-mono text-sm font-semibold tracking-wider dark:text-white text-slate-900">
                {formatTime(timerState.seconds)}
              </span>
            </div>

            <div className="h-4 w-px dark:bg-[#30363d] bg-slate-300"></div>

            <div className="max-w-[200px] truncate text-xs font-medium dark:text-slate-300 text-slate-700" title={activeTask?.title || 'No task selected'}>
              {activeTask ? activeTask.title : 'Ready to Track'}
            </div>

            <div className="flex items-center gap-1 pl-1">
              {timerState.isRunning ? (
                <button
                  onClick={pauseTimer}
                  title="Pause Timer"
                  className="p-1 rounded-full text-amber-500 hover:bg-amber-500/10 transition-colors"
                >
                  <Pause size={14} />
                </button>
              ) : (
                <button
                  onClick={() => startTimer()}
                  title="Start Timer"
                  className="p-1 rounded-full text-[#E5252A] hover:bg-[#E5252A]/10 transition-colors"
                >
                  <Play size={14} />
                </button>
              )}

              <button
                onClick={() => stopAndSaveTimer()}
                title="Stop & Log Time"
                disabled={timerState.seconds === 0}
                className={`p-1 rounded-full transition-colors ${
                  timerState.seconds > 0
                    ? 'text-emerald-500 hover:bg-emerald-500/10 cursor-pointer'
                    : 'text-slate-400 opacity-40 cursor-not-allowed'
                }`}
              >
                <Square size={14} />
              </button>
            </div>
          </div>

          {/* Right Action Icons & Authenticated User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Action: New BD Brief (Admin, Manager, or BD) */}
            {(isAdmin || isManager || isBD) && (
              <button
                onClick={onOpenNewBrief}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white bg-[#E5252A] hover:bg-[#c91d22] transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">New BD Brief</span>
              </button>
            )}

            {/* Notification Bell with unread counter */}
            <NotificationDropdown />

            {/* Multi-Location Sync (Admin only can reset/import, all can export) */}
            <button
              onClick={onOpenSyncModal}
              title="Database Backup, Multi-Location & Sync"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors border border-transparent hover:border-slate-300 dark:hover:border-[#30363d] cursor-pointer"
            >
              <Database size={18} />
            </button>

            {/* Day / Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Day Mode' : 'Dark Mode'}`}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors border border-transparent hover:border-slate-300 dark:hover:border-[#30363d] cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </button>

            {/* Authenticated User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-lg dark:hover:bg-[#161b22] hover:bg-slate-100 border dark:border-[#30363d] border-slate-200 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || '/ims-logo.png'}
                  alt={currentUser?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-[#E5252A]"
                />
                <div className="hidden md:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold dark:text-white text-slate-900 leading-tight truncate max-w-[120px]">
                      {currentUser?.name || 'User'}
                    </span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-bold ${getRoleBadge(currentUser?.roleType)}`}>
                      {currentUser?.roleType || 'user'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                    {currentUser?.roleTitle || 'Studio Member'}
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setUserDropdown(false)}
                >
                  <div className="px-3.5 py-2.5 border-b dark:border-[#21262d] border-slate-100 mb-1">
                    <div className="font-bold text-xs dark:text-white text-slate-900 truncate">
                      {currentUser?.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                    <div className="text-[10px] text-[#E5252A] font-semibold mt-0.5">
                      {currentUser?.departmentName} • {currentUser?.roleTitle}
                    </div>
                  </div>

                  {/* Update Profile Picture Option */}
                  <button
                    onClick={() => {
                      setUserDropdown(false);
                      onOpenProfilePicture?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs dark:text-slate-300 text-slate-700 dark:hover:bg-[#21262d] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Camera size={15} className="text-[#E5252A]" />
                    <span>Update Profile Picture</span>
                  </button>

                  {/* Change Password Option */}
                  <button
                    onClick={() => {
                      setUserDropdown(false);
                      onOpenChangePassword();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs dark:text-slate-300 text-slate-700 dark:hover:bg-[#21262d] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <KeyRound size={15} className="text-[#E5252A]" />
                    <span>Change Password</span>
                  </button>

                  {/* Sign Out Option */}
                  <button
                    onClick={() => {
                      setUserDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 border-t dark:border-[#21262d] border-slate-100 text-xs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'dark:bg-[#E5252A] bg-[#E5252A] text-white shadow-sm font-semibold'
                    : 'dark:text-slate-300 text-slate-600 hover:dark:bg-[#21262d] hover:bg-slate-100'
                }`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 leading-none rounded-full font-bold inline-flex items-center justify-center ${
                      isActive
                        ? 'bg-white text-[#E5252A]'
                        : 'bg-[#E5252A] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
