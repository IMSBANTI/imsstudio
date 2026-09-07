import React, { useState, useRef, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  CheckSquare,
  Clock,
  Trash2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export function NotificationDropdown() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearReadNotifications,
    setActiveTab,
    currentUser
  } = useStudio();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.entityType === 'task') {
      setActiveTab('tasks');
    } else if (notif.entityType === 'project') {
      setActiveTab('projects');
    }
    setIsOpen(false);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <CheckSquare size={16} className="text-[#E5252A]" />;
      case 'PROJECT_ASSIGNED':
        return <FolderKanban size={16} className="text-blue-500" />;
      case 'REVISION_REQUESTED':
        return <RotateCcw size={16} className="text-amber-500" />;
      default:
        return <Bell size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Unread Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Job Assignment Notifications"
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#21262d] transition-colors border border-transparent hover:border-slate-300 dark:hover:border-[#30363d] cursor-pointer"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E5252A] text-white text-[9px] font-black flex items-center justify-center pulse-glow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
          
          {/* Header */}
          <div className="px-4 pb-2.5 border-b dark:border-[#21262d] border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black dark:text-white text-slate-900">
                Job Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E5252A]/10 text-[#E5252A] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-slate-400 hover:text-[#E5252A] font-semibold transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={clearReadNotifications}
                title="Clear read notifications"
                className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y dark:divide-[#21262d] divide-slate-100">
            {safeNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <Bell size={24} className="mx-auto mb-2 text-slate-400 opacity-50" />
                No job notifications yet.
              </div>
            ) : (
              safeNotifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-[#21262d]/60 cursor-pointer transition-colors ${
                    !notif.isRead ? 'dark:bg-[#E5252A]/5 bg-red-50/50' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl dark:bg-[#0d1117] bg-slate-100 border dark:border-[#21262d] border-slate-200 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs truncate ${!notif.isRead ? 'font-bold dark:text-white text-slate-900' : 'font-medium dark:text-slate-300 text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#E5252A] flex-shrink-0"></span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>From: <strong>{notif.senderName}</strong></span>
                      <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 pt-2.5 border-t dark:border-[#21262d] border-slate-100 text-center">
            <span className="text-[10px] text-slate-400">
              When an Admin assigns a job, notifications appear here in real-time.
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
