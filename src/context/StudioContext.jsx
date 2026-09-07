import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { initialData } from '../../server/data/initial_data';

const StudioContext = createContext();

export function StudioProvider({ children }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authenticated User State (defaults to null: requires login)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ims_studio_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Day / Dark mode theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ims_studio_theme');
    return saved || 'dark';
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  
  // Toast Alert State
  const [toast, setToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Live Stopwatch state
  const [timerState, setTimerState] = useState(() => {
    const saved = localStorage.getItem('ims_active_timer');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      isRunning: false,
      seconds: 0,
      projectId: 'proj-01',
      taskId: 'task-01',
      notes: ''
    };
  });

  // Save theme to DOM and localStorage
  useEffect(() => {
    localStorage.setItem('ims_studio_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Persist current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ims_studio_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ims_studio_current_user');
    }
  }, [currentUser]);

  // Persist timer state
  useEffect(() => {
    localStorage.setItem('ims_active_timer', JSON.stringify(timerState));
  }, [timerState]);

  // Stopwatch ticking interval
  useEffect(() => {
    let interval = null;
    if (timerState.isRunning) {
      interval = setInterval(() => {
        setTimerState(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState.isRunning]);

  // Fetch full data & user notifications
  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await api.getDatabase();
      if (res && res.projects) {
        setData(res);
      }
      if (currentUser?.id) {
        const notifs = await api.getNotifications(currentUser.id);
        setNotifications(notifs);
      }
      setError(null);
    } catch (err) {
      console.warn('Failed to load from server, using local seed fallback:', err);
      setData(initialData);
      if (currentUser?.id) {
        const fallbackNotifs = (initialData.notifications || []).filter(n => n.recipientId === currentUser.id);
        setNotifications(fallbackNotifs);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser?.id]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // --- Auth Methods ---
  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.user) {
        setCurrentUser(res.user);
        showToast(`Welcome back, ${res.user.name}! Logged in as ${res.user.roleType.toUpperCase()}.`, 'success');
        return res.user;
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setNotifications([]);
    showToast('Logged out successfully', 'info');
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!currentUser) throw new Error('Not authenticated');
    const res = await api.changePassword(currentUser.id, currentPassword, newPassword);
    showToast('Your password was updated successfully!', 'success');
    return res;
  };

  const adminResetPassword = async (targetUserId, newPassword) => {
    if (!currentUser || currentUser.roleType !== 'admin') {
      throw new Error('Unauthorized');
    }
    const res = await api.adminResetPassword(currentUser.id, targetUserId, newPassword);
    showToast(res.message, 'success');
    await refreshData();
    return res;
  };

  // --- Notification Methods ---
  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await api.markNotificationRead(id);
    } catch (e) {}
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await api.markAllNotificationsRead(currentUser.id);
      showToast('All notifications marked as read', 'info');
    } catch (e) {}
  };

  const clearReadNotifications = async () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => !n.isRead));
    try {
      await api.clearReadNotifications(currentUser.id);
    } catch (e) {}
  };

  // --- Role & Privilege Checkers ---
  const isAdmin = currentUser?.roleType === 'admin';
  const isManager = currentUser?.roleType === 'admin' || currentUser?.roleType === 'manager';
  const isVisualizer = currentUser?.roleType === 'visualizer';
  const isBD = currentUser?.roleType === 'bd';

  // Timer controls
  const startTimer = (projectId, taskId) => {
    setTimerState(prev => ({
      ...prev,
      projectId: projectId || prev.projectId,
      taskId: taskId || prev.taskId,
      isRunning: true
    }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setTimerState({
      isRunning: false,
      seconds: 0,
      projectId: data.projects[0]?.id || '',
      taskId: data.tasks[0]?.id || '',
      notes: ''
    });
  };

  const stopAndSaveTimer = async (customNotes) => {
    if (timerState.seconds < 5) {
      resetTimer();
      return;
    }
    const hours = +(timerState.seconds / 3600).toFixed(2);
    const project = data.projects.find(p => p.id === timerState.projectId);
    const task = data.tasks.find(t => t.id === timerState.taskId);
    const member = currentUser ? data.members.find(m => m.id === currentUser.id) || currentUser : data.members[0];

    const newLog = {
      date: new Date().toISOString().slice(0, 10),
      memberId: member ? member.id : 'mem-1',
      memberName: member ? member.name : 'Artist',
      departmentName: member ? member.departmentName : 'Studio',
      projectId: timerState.projectId,
      projectTitle: project ? project.title : 'General Studio Work',
      taskId: timerState.taskId,
      taskTitle: task ? task.title : 'Experiential Production',
      hours: Math.max(0.1, hours),
      notes: customNotes || timerState.notes || 'Recorded via Live Stopwatch'
    };

    try {
      await api.createTimeLog(newLog);
      await refreshData();
      showToast(`Logged ${newLog.hours}h for ${newLog.taskTitle}!`, 'success');
    } catch (err) {
      setData(prev => ({
        ...prev,
        timelogs: [ { id: `time-${Date.now()}`, ...newLog }, ...prev.timelogs ]
      }));
    }

    resetTimer();
  };

  // Data mutation actions with automated notifications
  const addBrief = async (briefData) => {
    try {
      const created = await api.createBrief(briefData);
      await refreshData();
      showToast(`BD Brief '${briefData.projectTitle}' ingested successfully!`, 'success');
      return created;
    } catch (e) {
      setData(prev => ({ ...prev, briefs: [{ id: `brief-${Date.now()}`, ...briefData }, ...prev.briefs] }));
    }
  };

  const updateBrief = async (id, updates) => {
    try {
      await api.updateBrief(id, updates);
      await refreshData();
      showToast('Brief updated successfully', 'info');
    } catch (e) {
      setData(prev => ({
        ...prev,
        briefs: prev.briefs.map(b => b.id === id ? { ...b, ...updates } : b)
      }));
    }
  };

  const deleteBrief = async (id) => {
    try {
      await api.deleteBrief(id);
      await refreshData();
      showToast('Brief deleted', 'info');
    } catch (e) {
      setData(prev => ({ ...prev, briefs: prev.briefs.filter(b => b.id !== id) }));
    }
  };

  const handoverBrief = async (briefId, projectConfig) => {
    try {
      const res = await api.handoverBrief(briefId, {
        ...projectConfig,
        senderName: currentUser ? currentUser.name : 'Studio Director'
      });
      await refreshData();
      showToast(`Pitch handed over to studio! Assigned lead notified.`, 'success');
      return res;
    } catch (e) {
      console.error(e);
    }
  };

  const addProject = async (projectData) => {
    try {
      const created = await api.createProject({
        ...projectData,
        senderName: currentUser ? currentUser.name : 'Studio Director'
      });
      await refreshData();
      showToast(`Project '${projectData.title}' launched in studio!`, 'success');
      return created;
    } catch (e) {
      setData(prev => ({ ...prev, projects: [{ id: `proj-${Date.now()}`, ...projectData }, ...prev.projects] }));
    }
  };

  const updateProject = async (id, updates) => {
    try {
      await api.updateProject(id, updates);
      await refreshData();
      showToast('Project updated successfully', 'info');
    } catch (e) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      }));
    }
  };

  const deleteProject = async (id) => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Admin can delete studio projects', 'error');
      return;
    }
    try {
      await api.deleteProject(id);
      await refreshData();
      showToast('Project removed', 'info');
    } catch (e) {
      setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
    }
  };

  const addTask = async (taskData) => {
    try {
      const created = await api.createTask({
        ...taskData,
        senderName: currentUser ? currentUser.name : 'Studio Admin'
      });
      await refreshData();
      
      const assignee = data.members.find(m => m.id === taskData.assigneeId);
      showToast(`Task assigned! Notification dispatched to ${assignee?.name || 'artist'}.`, 'success');
      return created;
    } catch (e) {
      setData(prev => ({ ...prev, tasks: [{ id: `task-${Date.now()}`, ...taskData }, ...prev.tasks] }));
    }
  };

  const updateTask = async (id, updates) => {
    try {
      await api.updateTask(id, {
        ...updates,
        senderName: currentUser ? currentUser.name : 'Studio Manager'
      });
      await refreshData();
      showToast('Task updated successfully', 'info');
    } catch (e) {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      }));
    }
  };

  const deleteTask = async (id) => {
    if (!isManager) {
      showToast('Permission Denied: Only Admins or Managers can delete tasks', 'error');
      return;
    }
    try {
      await api.deleteTask(id);
      await refreshData();
      showToast('Task deleted', 'info');
    } catch (e) {
      setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    }
  };

  const addTimeLog = async (logData) => {
    try {
      await api.createTimeLog(logData);
      await refreshData();
      showToast(`Logged ${logData.hours}h successfully!`, 'success');
    } catch (e) {
      setData(prev => ({ ...prev, timelogs: [{ id: `time-${Date.now()}`, ...logData }, ...prev.timelogs] }));
    }
  };

  const deleteTimeLog = async (id) => {
    try {
      await api.deleteTimeLog(id);
      await refreshData();
      showToast('Time log removed', 'info');
    } catch (e) {
      setData(prev => ({ ...prev, timelogs: prev.timelogs.filter(l => l.id !== id) }));
    }
  };

  const addMember = async (memberData) => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Admins can add team members', 'error');
      return;
    }
    try {
      await api.createMember(memberData);
      await refreshData();
      showToast(`Added ${memberData.name} to team roster!`, 'success');
    } catch (e) {
      setData(prev => ({ ...prev, members: [...prev.members, { id: `mem-${Date.now()}`, ...memberData }] }));
    }
  };

  const updateMember = async (id, updates) => {
    if (!isAdmin && currentUser?.id !== id) {
      showToast('Permission Denied: Only Admin can edit other team members', 'error');
      return;
    }
    try {
      await api.updateMember(id, updates);
      await refreshData();
      showToast('Member profile updated', 'info');
    } catch (e) {
      setData(prev => ({
        ...prev,
        members: prev.members.map(m => m.id === id ? { ...m, ...updates } : m)
      }));
    }
  };

  const deleteMember = async (id) => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Admins can remove members', 'error');
      return;
    }
    try {
      await api.deleteMember(id);
      await refreshData();
      showToast('Member removed from team', 'info');
    } catch (e) {
      setData(prev => ({ ...prev, members: prev.members.filter(m => m.id !== id) }));
    }
  };

  const addDepartment = async (deptData) => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Admins can create departments', 'error');
      return;
    }
    try {
      await api.createDepartment(deptData);
      await refreshData();
      showToast(`Department '${deptData.name}' created!`, 'success');
    } catch (e) {
      setData(prev => ({ ...prev, departments: [...prev.departments, { id: `dept-${Date.now()}`, ...deptData }] }));
    }
  };

  const addRole = async (roleData) => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Admins can create roles', 'error');
      return;
    }
    try {
      await api.createRole(roleData);
      await refreshData();
      showToast(`Role '${roleData.title}' added!`, 'success');
    } catch (e) {
      setData(prev => ({ ...prev, roles: [...prev.roles, { id: `role-${Date.now()}`, ...roleData }] }));
    }
  };

  const resetAllData = async () => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Admins can reset the database', 'error');
      return;
    }
    try {
      const res = await api.resetDatabase();
      if (res.db) setData(res.db);
      showToast('Database reset to initial studio records', 'info');
    } catch (e) {
      setData(initialData);
    }
  };

  const importData = async (jsonPayload) => {
    if (!isAdmin) {
      showToast('Permission Denied: Only Admins can import database snapshots', 'error');
      return;
    }
    try {
      const res = await api.importDatabase(jsonPayload);
      if (res.db) setData(res.db);
      showToast('Database imported successfully', 'success');
    } catch (e) {
      setData(jsonPayload);
    }
  };

  return (
    <StudioContext.Provider
      value={{
        data,
        loading,
        error,
        theme,
        toggleTheme,
        currentUser,
        login,
        logout,
        changePassword,
        adminResetPassword,
        isAdmin,
        isManager,
        isVisualizer,
        isBD,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearReadNotifications,
        toast,
        showToast,
        activeTab,
        setActiveTab,
        timerState,
        startTimer,
        pauseTimer,
        stopAndSaveTimer,
        resetTimer,
        setTimerState,
        refreshData,
        // Entity actions
        addBrief,
        updateBrief,
        deleteBrief,
        handoverBrief,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addTimeLog,
        deleteTimeLog,
        addMember,
        updateMember,
        deleteMember,
        addDepartment,
        addRole,
        resetAllData,
        importData
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error('useStudio must be used within a StudioProvider');
  return context;
}
