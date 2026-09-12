import React, { useState, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  X,
  UploadCloud,
  Camera,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

const MAX_SIZE_BYTES = 1024 * 1024; // 1 Megabyte

export function ProfilePictureModal({ isOpen, onClose }) {
  const { currentUser, updateMember, showToast } = useStudio();
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen || !currentUser) return null;

  const currentAvatar = currentUser.avatar || '/ims-logo.png';

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcessFile = (file) => {
    setError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP, or GIF).');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`Selected image is ${formatFileSize(file.size)}. Image size must be below 1 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.onerror = () => {
      setError('Failed to read the selected image.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleProcessFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleProcessFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleSave = async () => {
    if (!preview) return;
    setSaving(true);
    try {
      await updateMember(currentUser.id, { avatar: preview });
      showToast('Profile picture updated successfully', 'success');
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to update profile picture');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      await updateMember(currentUser.id, { avatar: '/ims-logo.png' });
      showToast('Profile picture reset to default', 'info');
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to reset profile picture');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setPreview(null);
    setError('');
    setSaving(false);
    setDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl dark:bg-[#161B22] bg-white border dark:border-[#30363D] border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-[#21262D] border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <Camera size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold dark:text-white text-slate-900 leading-tight">
                Update Profile Picture
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Max size 1 MB • JPG, PNG, WebP, GIF
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Avatar Preview Area */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative group">
              <img
                src={preview || currentAvatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 dark:border-[#30363D] shadow-md group-hover:border-[#E5252A] transition-colors"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#E5252A] hover:bg-[#c91d22] text-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
                title="Select Photo"
              >
                <Camera size={14} />
              </button>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold dark:text-white text-slate-900">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400">
                {currentUser.roleTitle || 'Studio Member'}
              </div>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-[#E5252A] bg-[#E5252A]/5'
                : 'border-slate-300 dark:border-[#30363D] hover:border-[#E5252A] dark:hover:border-[#E5252A] bg-slate-50 dark:bg-[#0D1117]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-1.5">
              <UploadCloud size={24} className="text-[#E5252A]" />
              <div className="text-xs font-semibold dark:text-slate-200 text-slate-700">
                Click to upload or drag & drop
              </div>
              <div className="text-[10px] text-slate-400">
                Supports JPG, PNG, WebP (Must be under 1 MB)
              </div>
            </div>
          </div>

          {/* Error Warning */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Note if preview ready */}
          {preview && !error && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="flex-shrink-0" />
              <span>Image verified (below 1 MB). Click "Save Changes" to apply.</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0D1117] border-t dark:border-[#21262D] border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleRemove}
            disabled={saving || currentAvatar === '/ims-logo.png'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Reset to default logo"
          >
            <Trash2 size={14} />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !preview || !!error}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#E5252A] hover:bg-[#c91d22] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-red-900/20"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}