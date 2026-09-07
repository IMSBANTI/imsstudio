import React, { useState, useMemo } from 'react';
import { useStudio } from '../context/StudioContext';
import { formatBDT } from '../utils/formatters';
import {
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  FolderKanban,
  FileSpreadsheet,
  Trash2,
  TrendingUp,
  Layers,
  Banknote,
  Coins
} from 'lucide-react';

export function TimeTrackingView({ onOpenLogTimeModal }) {
  const {
    data,
    timerState,
    startTimer,
    pauseTimer,
    stopAndSaveTimer,
    resetTimer,
    deleteTimeLog,
    currentUser
  } = useStudio();

  // Filters
  const [selectedMember, setSelectedMember] = useState('All');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchNotes, setSearchNotes] = useState('');

  // Stopwatch local project/task selectors
  const [activeProjectId, setActiveProjectId] = useState(timerState.projectId || data.projects[0]?.id || '');
  const [activeTaskId, setActiveTaskId] = useState(timerState.taskId || data.tasks[0]?.id || '');
  const [timerNotes, setTimerNotes] = useState('');

  // Format seconds
  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return data.timelogs.filter(log => {
      const matchesMember = selectedMember === 'All' || log.memberId === selectedMember;
      const matchesProject = selectedProject === 'All' || log.projectId === selectedProject;
      const matchesDept = selectedDept === 'All' || log.departmentName?.includes(selectedDept);
      const matchesNotes = !searchNotes || log.notes?.toLowerCase().includes(searchNotes.toLowerCase()) || log.taskTitle?.toLowerCase().includes(searchNotes.toLowerCase());

      return matchesMember && matchesProject && matchesDept && matchesNotes;
    });
  }, [data.timelogs, selectedMember, selectedProject, selectedDept, searchNotes]);

  // Aggregate metrics
  const totalFilteredHours = filteredLogs.reduce((sum, l) => sum + (l.hours || 0), 0);
  const totalMonetaryValueBDT = filteredLogs.reduce((sum, l) => sum + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);
  const hours2D = filteredLogs.filter(l => l.departmentName?.includes('2D')).reduce((s, l) => s + (l.hours || 0), 0);
  const value2DBDT = filteredLogs.filter(l => l.departmentName?.includes('2D')).reduce((s, l) => s + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);
  const hours3D = filteredLogs.filter(l => l.departmentName?.includes('3D')).reduce((s, l) => s + (l.hours || 0), 0);
  const value3DBDT = filteredLogs.filter(l => l.departmentName?.includes('3D')).reduce((s, l) => s + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Team Member', 'Department', 'Project', 'Task', 'Hours Logged', 'Hourly Rate (BDT)', 'Monetary Value (BDT)', 'Notes'];
    const rows = filteredLogs.map(l => {
      const rate = l.hourlyRateBDT || 1500;
      const valueBDT = l.monetaryValueBDT || (l.hours * rate);
      return [
        `"${l.date}"`,
        `"${l.memberName}"`,
        `"${l.departmentName}"`,
        `"${l.projectTitle}"`,
        `"${l.taskTitle}"`,
        l.hours,
        rate,
        valueBDT,
        `"${(l.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IMS_Studio_Timesheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <Clock className="text-[#E5252A]" size={26} />
            Live Time Tracking & Studio Timesheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time punch in/out stopwatch, daily timesheet logs, department hour breakdowns, and CSV export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 hover:border-[#E5252A] dark:text-slate-200 text-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download size={14} />
            Export Timesheet (CSV)
          </button>
          
          <button
            onClick={onOpenLogTimeModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white text-xs font-bold transition-all shadow-md shadow-red-900/10 cursor-pointer"
          >
            <Plus size={15} />
            Manual Log Entry
          </button>
        </div>
      </div>

      {/* Live Master Stopwatch Widget */}
      <div className="p-6 rounded-2xl dark:bg-gradient-to-r dark:from-[#161b22] dark:to-[#1a202c] bg-white border dark:border-[#30363d] border-slate-200 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Timer Display */}
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${timerState.isRunning ? 'bg-[#E5252A]/15 text-[#E5252A] pulse-glow' : 'dark:bg-[#0d1117] bg-slate-100 text-slate-400'}`}>
              <Clock size={32} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Live Studio Stopwatch
              </div>
              <div className="font-mono text-4xl sm:text-5xl font-black dark:text-white text-slate-900 tracking-tight">
                {formatTime(timerState.seconds)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Currently tracking as: <strong className="text-[#E5252A]">{currentUser?.name || 'Studio Member'}</strong>
              </div>
            </div>
          </div>

          {/* Project & Task Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-xl">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Target Project</label>
              <select
                value={activeProjectId}
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {data.projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code}: {p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Target Task</label>
              <select
                value={activeTaskId}
                onChange={(e) => setActiveTaskId(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {data.tasks.filter(t => t.projectId === activeProjectId).map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2">
            {timerState.isRunning ? (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Pause size={16} /> Pause
              </button>
            ) : (
              <button
                onClick={() => startTimer(activeProjectId, activeTaskId)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white text-xs font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
              >
                <Play size={16} /> Start Stopwatch
              </button>
            )}

            <button
              onClick={() => stopAndSaveTimer(timerNotes)}
              disabled={timerState.seconds < 5}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all text-xs font-bold ${
                timerState.seconds >= 5
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer'
                  : 'dark:bg-[#21262d] bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Square size={16} /> Stop & Log
            </button>
          </div>

        </div>
      </div>

      {/* Hourly & Monetary Work Value Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Filtered Hours</span>
          <div className="mt-1 text-2xl font-black dark:text-white text-slate-900 font-mono">{totalFilteredHours.toFixed(1)} hrs</div>
          <div className="text-[10px] text-slate-400 mt-1">{filteredLogs.length} total time log entries</div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-emerald-500">Delivered Work Value</span>
          <div className="mt-1 text-2xl font-black text-emerald-500 font-mono">{formatBDT(totalMonetaryValueBDT)}</div>
          <div className="text-[10px] text-slate-400 mt-1">Calculated in BDT across logged hours</div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-blue-500">2D Team Work Value</span>
          <div className="mt-1 text-xl font-black text-blue-500 font-mono">{formatBDT(value2DBDT)}</div>
          <div className="text-[10px] text-slate-400 mt-1">{hours2D.toFixed(1)}h logged (Motion, UI & Screens)</div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-purple-500">3D Team Work Value</span>
          <div className="mt-1 text-xl font-black text-purple-500 font-mono">{formatBDT(value3DBDT)}</div>
          <div className="text-[10px] text-slate-400 mt-1">{hours3D.toFixed(1)}h logged (CGI, Unreal & Sim)</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
        
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search notes or task title..."
            value={searchNotes}
            onChange={(e) => setSearchNotes(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
          />
        </div>

        <div>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-700"
          >
            <option value="All">All Team Members</option>
            {data.members.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.departmentName})</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-700"
          >
            <option value="All">All Projects</option>
            {data.projects.map(p => (
              <option key={p.id} value={p.id}>{p.code}: {p.title}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-700"
          >
            <option value="All">All Departments</option>
            <option value="2D">2D Team</option>
            <option value="3D">3D Team</option>
          </select>
        </div>

      </div>

      {/* Timesheets Data Table */}
      <div className="rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="dark:bg-[#0d1117] bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b dark:border-[#21262d] border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Visualizer / Artist</th>
                <th className="py-3 px-4">Dept</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Task & Notes</th>
                <th className="py-3 px-4 text-right">Hours</th>
                <th className="py-3 px-4 text-right">Rate</th>
                <th className="py-3 px-4 text-right">Work Value (BDT)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-[#21262d] divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No time logs recorded for this criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const is2D = log.departmentName?.includes('2D');
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-[#21262d]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="py-3.5 px-4 font-bold dark:text-white text-slate-900">
                        {log.memberName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          is2D
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          {log.departmentName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {log.projectTitle}
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-medium dark:text-slate-200 text-slate-800">{log.taskTitle}</div>
                        {log.notes && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{log.notes}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono text-sm font-extrabold text-[#E5252A]">
                          {log.hours}h
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {formatBDT(log.hourlyRateBDT || 1500)}/h
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs font-bold text-emerald-500 whitespace-nowrap">
                        {formatBDT(log.monetaryValueBDT || (log.hours * (log.hourlyRateBDT || 1500)))}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteTimeLog(log.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                          title="Delete log entry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
