const API_BASE = '/api';

export const api = {
  async getDatabase() {
    try {
      const res = await fetch(`${API_BASE}/data`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      localStorage.setItem('ims_studio_cached_data', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('API fetch failed, reading from local cache:', err);
      const cached = localStorage.getItem('ims_studio_cached_data');
      if (cached) return JSON.parse(cached);
      throw err;
    }
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/data/reset`, { method: 'POST' });
    return res.json();
  },

  async importDatabase(payload) {
    const res = await fetch(`${API_BASE}/data/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async changePassword(userId, currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  async adminResetPassword(adminId, targetUserId, newPassword) {
    const res = await fetch(`${API_BASE}/auth/admin-reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId, targetUserId, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset password');
    return data;
  },

  // Notifications
  async getNotifications(recipientId) {
    try {
      const url = recipientId
        ? `${API_BASE}/notifications?recipientId=${encodeURIComponent(recipientId)}`
        : `${API_BASE}/notifications`;
      const res = await fetch(url);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async createNotification(notif) {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif)
    });
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
    return res.json();
  },

  async markAllNotificationsRead(recipientId) {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId })
    });
    return res.json();
  },

  async clearReadNotifications(recipientId) {
    const res = await fetch(`${API_BASE}/notifications/clear?recipientId=${encodeURIComponent(recipientId)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Briefs
  async createBrief(brief) {
    const res = await fetch(`${API_BASE}/briefs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brief)
    });
    return res.json();
  },

  async updateBrief(id, updates) {
    const res = await fetch(`${API_BASE}/briefs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteBrief(id) {
    const res = await fetch(`${API_BASE}/briefs/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async handoverBrief(id, projectConfig) {
    const res = await fetch(`${API_BASE}/briefs/${id}/handover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectConfig)
    });
    return res.json();
  },

  // Projects
  async createProject(project) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return res.json();
  },

  async updateProject(id, updates) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Tasks
  async createTask(task) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return res.json();
  },

  async updateTask(id, updates) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Time Logs
  async createTimeLog(log) {
    const res = await fetch(`${API_BASE}/timelogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
    return res.json();
  },

  async deleteTimeLog(id) {
    const res = await fetch(`${API_BASE}/timelogs/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Members
  async createMember(member) {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    return res.json();
  },

  async updateMember(id, updates) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Departments & Roles
  async createDepartment(dept) {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dept)
    });
    return res.json();
  },

  async createRole(role) {
    const res = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role)
    });
    return res.json();
  },

  async updateRole(id, updates) {
    const res = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteRole(id) {
    const res = await fetch(`${API_BASE}/roles/${id}`, { method: 'DELETE' });
    return res.json();
  }
};
