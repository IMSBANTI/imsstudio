import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Lock, X, CheckCircle, AlertCircle, KeyRound, ShieldAlert } from 'lucide-react';

export function ChangePasswordModal({ isOpen, onClose }) {
  const { changePassword, currentUser } = useStudio();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Change Password</h2>
              <p className="text-xs text-slate-400">Update login credentials for {currentUser?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Current Password *</label>
            <input
              required
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">New Password *</label>
            <input
              required
              type="password"
              placeholder="Enter new password (min 4 characters)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Confirm New Password *</label>
            <input
              required
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t dark:border-[#21262d] border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export function AdminResetPasswordModal({ isOpen, onClose, targetMember }) {
  const { adminResetPassword } = useStudio();
  const [newPassword, setNewPassword] = useState('ims2026');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !targetMember) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminResetPassword(targetMember.id, newPassword);
      onClose();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Admin Password Reset</h2>
              <p className="text-xs text-slate-400">Reset password for {targetMember.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 space-y-1">
            <div className="font-bold dark:text-white text-slate-800">{targetMember.name}</div>
            <div className="text-slate-400 text-[11px]">{targetMember.email} • {targetMember.roleTitle}</div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Set New Password *</label>
            <input
              required
              type="text"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t dark:border-[#21262d] border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
