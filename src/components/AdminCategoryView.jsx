import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  ShieldCheck,
  UserMinus,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  KeyRound,
  Database,
  Lock,
  CheckCircle,
  AlertCircle,
  Server,
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  Building
} from 'lucide-react';

export function AdminCategoryView({ onOpenAdminResetPassword, onOpenChangePassword }) {
  const {
    data,
    clearSampleMembers,
    clearSampleWork,
    clearAllSampleData,
    resetAllData,
    importData,
    currentUser,
    isAdmin
  } = useStudio();

  const [importStatus, setImportStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Export full JSON snapshot
  const handleExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IMS_Studio_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Database backup snapshot downloaded successfully!');
  };

  // Import JSON snapshot
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.departments && parsed.projects) {
          importData(parsed);
          setImportStatus('Database imported successfully!');
          setTimeout(() => setImportStatus(''), 4000);
        } else {
          setImportStatus('Invalid JSON database format.');
        }
      } catch (err) {
        setImportStatus('Error reading file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (!isAdmin) {
    return (
      <div className="p-8 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <Lock size={24} />
        </div>
        <h2 className="text-lg font-bold dark:text-white text-slate-900">Admin Privileges Required</h2>
        <p className="text-xs text-slate-400">
          The <strong>Admin Category</strong> is restricted to Studio Directors and System Administrators. Please log in with your administrative credentials to access database management and system maintenance tools.
        </p>
      </div>
    );
  }

  const adminMembers = data.members.filter(m => m.roleType === 'admin');
  const nonAdminMembers = data.members.filter(m => m.roleType !== 'admin');

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-[#E5252A]" size={28} />
            Admin Category & Studio Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Administrative maintenance, sample demo data cleanup, database snapshots, and team credential security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenChangePassword}
            className="h-9 flex items-center gap-1.5 px-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 hover:border-[#E5252A] dark:text-slate-200 text-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <KeyRound size={14} className="text-[#E5252A]" />
            <span>Change Admin Password</span>
          </button>
        </div>
      </div>

      {/* Global Action Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle size={16} /> {successMessage}
        </div>
      )}

      {/* System Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <Users size={13} className="text-[#E5252A]" />
            <span>Team Roster</span>
          </div>
          <div className="mt-1.5 text-2xl font-black dark:text-white text-slate-900">
            {data.members.length} <span className="text-xs font-normal text-slate-400">Members</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {adminMembers.length} Admin • {nonAdminMembers.length} Staff
          </div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <FolderKanban size={13} className="text-blue-500" />
            <span>Active Pipeline</span>
          </div>
          <div className="mt-1.5 text-2xl font-black dark:text-white text-slate-900">
            {data.projects.length} <span className="text-xs font-normal text-slate-400">Projects</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {data.briefs.length} Briefs • {data.tasks.length} Tasks
          </div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <Server size={13} className="text-emerald-500" />
            <span>Storage & Persistence</span>
          </div>
          <div className="mt-1.5 text-base font-extrabold text-emerald-500">
            Cloud Persistent
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            PostgreSQL & Disk Sync
          </div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-purple-500" />
            <span>Current Admin Session</span>
          </div>
          <div className="mt-1.5 text-sm font-bold dark:text-white text-slate-900 truncate">
            {currentUser?.name}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">
            {currentUser?.email}
          </div>
        </div>
      </div>

      {/* Primary Section: Sample & Demo Data Management */}
      <div className="p-6 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <UserMinus size={18} />
            </div>
            <h2 className="text-base font-extrabold dark:text-white text-slate-900">
              Sample & Demo Data Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Clean out pre-seeded demo records to run your studio in 100% production mode. Your Admin credentials and custom records are always preserved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Clear Sample Members */}
          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs dark:text-white text-slate-800 flex items-center gap-1.5">
                  <UserMinus size={15} className="text-rose-500" />
                  Clear Sample Members
                </span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  Roster
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Removes all 13 pre-seeded demo visualizers, artists, and managers from your studio roster. Your Admin profile and any custom members you created will be kept safe.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Remove all pre-seeded demo team members? Your Admin account and custom members will be preserved.')) {
                  clearSampleMembers();
                  showNotification('All pre-seeded demo members cleared from roster!');
                }
              }}
              className="h-9 w-full flex items-center justify-center gap-1.5 px-4 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <UserMinus size={14} />
              <span>Clear Sample Members</span>
            </button>
          </div>

          {/* Card 2: Clear Sample Work */}
          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs dark:text-white text-slate-800 flex items-center gap-1.5">
                  <Trash2 size={15} className="text-amber-500" />
                  Clear Sample Work (Keep Team)
                </span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Projects & Briefs
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Clears all sample client projects (Dhaka Motor Show, Airtel Cube, etc.), BD pitch briefs, tasks, and timesheets. Keeps your entire team roster and custom members intact.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all sample briefs, projects, tasks, and timesheets? Your team roster and members will be preserved.')) {
                  clearSampleWork();
                  showNotification('All sample projects, briefs, tasks, and timesheets cleared!');
                }
              }}
              className="h-9 w-full flex items-center justify-center gap-1.5 px-4 rounded-xl border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear Sample Work (Keep Team)</span>
            </button>
          </div>

          {/* Card 3: Start Fresh (Clear All Demo Data) */}
          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs dark:text-white text-slate-800 flex items-center gap-1.5">
                  <RotateCcw size={15} className="text-red-500" />
                  Start Fresh (Clear All Demo Data)
                </span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                  Blank Slate
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Wipes all sample projects, tasks, briefs, timelogs, AND demo members. Gives you a completely pristine production workspace ready for your studio clients.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear ALL sample briefs, projects, tasks, timelogs, and demo members? This starts a 100% clean production studio workspace (Admin preserved).')) {
                  clearAllSampleData();
                  showNotification('Studio reset to clean production canvas!');
                }
              }}
              className="h-9 w-full flex items-center justify-center gap-1.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Start Fresh (Clear All Demo Data)</span>
            </button>
          </div>

          {/* Card 4: Reset to Demo Seed Records */}
          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs dark:text-white text-slate-800 flex items-center gap-1.5">
                  <RotateCcw size={15} className="text-slate-400" />
                  Reset to Initial Demo Records
                </span>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">
                  Demo Seed
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Need to demonstrate or test experiential workflows? Re-populates the database with initial sample projects, briefs, team visualizers, and stage resolution specs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset studio database to initial experiential seed records?')) {
                  resetAllData();
                  showNotification('Studio database reset to demo seed records!');
                }
              }}
              className="h-9 w-full flex items-center justify-center gap-1.5 px-4 rounded-xl dark:bg-[#21262d] bg-white border dark:border-[#30363d] border-slate-300 text-slate-700 dark:text-slate-300 hover:border-slate-400 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset to Demo Records</span>
            </button>
          </div>

        </div>
      </div>

      {/* Database Backup & Snapshot Restore */}
      <div className="p-6 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">
                Database Snapshots & Local/Cloud Backup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Export and import complete database snapshots to migrate data or maintain offsite backups.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-xs dark:text-white text-slate-800 flex items-center gap-1.5">
                <Download size={15} className="text-[#E5252A]" />
                <span>Export Studio Snapshot</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Download a complete JSON backup containing all projects, briefs, tasks, departments, roles, and timesheets.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="h-9 w-full flex items-center justify-center gap-1.5 px-4 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Download size={14} />
              <span>Download Snapshot (.json)</span>
            </button>
          </div>

          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-xs dark:text-white text-slate-800 flex items-center gap-1.5">
                <Upload size={15} className="text-blue-500" />
                <span>Restore Database Snapshot</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Upload a JSON snapshot file exported previously to restore or sync state from another studio environment.
              </p>
            </div>
            <label className="h-9 w-full flex items-center justify-center gap-1.5 px-4 rounded-xl dark:bg-[#21262d] bg-white border dark:border-[#30363d] border-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-[#E5252A] transition-all cursor-pointer">
              <Upload size={14} />
              <span>Select Backup File (.json)</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={15} /> {importStatus}
          </div>
        )}
      </div>

      {/* Member Password Management (Admin Privilege) */}
      <div className="p-6 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">
                Staff Authentication & Password Reset
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                As Studio Director, you can reset credentials for any member if they are locked out or need access assistance.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y dark:divide-[#21262d] divide-slate-100 max-h-72 overflow-y-auto pr-1">
          {nonAdminMembers.map(member => (
            <div key={member.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="font-bold dark:text-white text-slate-900 leading-tight">
                    {member.name}
                  </div>
                  <div className="text-[11px] text-slate-400">{member.email} • {member.roleTitle}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenAdminResetPassword(member)}
                className="h-8 flex items-center gap-1.5 px-3 rounded-lg border dark:border-[#30363d] border-slate-200 hover:border-[#E5252A] text-slate-600 dark:text-slate-300 hover:text-[#E5252A] text-xs font-semibold transition-all cursor-pointer"
              >
                <KeyRound size={13} />
                <span>Reset Password</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
