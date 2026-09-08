import React, { useState, useMemo } from 'react';
import { useStudio } from '../context/StudioContext';
import { formatBDT } from '../utils/formatters';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Tv,
  CheckCircle2,
  AlertCircle,
  Users,
  Layers,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  List,
  Banknote,
  Trash2
} from 'lucide-react';

export function ProjectsView({ onOpenNewProject, onOpenNewTask }) {
  const { data, updateProject, deleteProject, clearSampleWork, setActiveTab, startTimer, isManager, isAdmin } = useStudio();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return data.projects.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.screenSpecs?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === 'All' || p.department.toLowerCase().includes(selectedDept.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [data.projects, searchQuery, selectedDept, selectedStatus]);

  // Aggregate project monetary values (BDT)
  const filteredPipelineBDT = filteredProjects.reduce(
    (sum, p) => sum + (p.budgetAmountBDT || (p.budgetHours ? p.budgetHours * 1500 : 0)),
    0
  );
  const filteredDeliveredBDT = filteredProjects.reduce((sum, p) => {
    const pDelivered = data.timelogs
      .filter(l => l.projectId === p.id)
      .reduce((s, l) => s + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);
    return sum + pDelivered;
  }, 0);

  const kanbanColumns = [
    { id: 'Pending', label: 'Pending & Pre-Prod', color: 'border-slate-500/40 text-slate-400' },
    { id: 'Ongoing', label: 'In Active Production', color: 'border-blue-500/40 text-blue-500' },
    { id: 'Revision', label: 'Client Revision', color: 'border-amber-500/40 text-amber-500' },
    { id: 'Delivered', label: 'Delivered / Tech QC', color: 'border-emerald-500/40 text-emerald-500' },
    { id: 'Completed', label: 'Completed & Wrapped', color: 'border-purple-500/40 text-purple-500' }
  ];

  const handleStatusChange = (projectId, newStatus) => {
    updateProject(projectId, { status: newStatus });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <FolderKanban className="text-[#E5252A]" size={26} />
            Studio Projects & Experiential Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Experiential stage LED canvas, 2D/3D visualizer assignments, media server delivery formats, and milestone timelines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Switcher */}
          <div className="h-9 flex items-center p-1 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`h-7 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                viewMode === 'kanban'
                  ? 'bg-[#E5252A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`h-7 px-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                viewMode === 'list'
                  ? 'bg-[#E5252A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
              title="Detailed List View"
            >
              <List size={15} />
            </button>
          </div>

          {isAdmin && data.projects.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all sample projects, tasks, briefs, and logged hours? Your team members and studio structure will be preserved.')) {
                  clearSampleWork();
                }
              }}
              className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 hover:border-rose-500 hover:text-rose-500 dark:text-slate-300 text-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Clear all sample client projects and tasks"
            >
              <Trash2 size={14} className="text-rose-500" />
              <span>Clear Sample Work</span>
            </button>
          )}

          {isManager && (
            <button
              onClick={onOpenNewProject}
              className="h-9 flex items-center gap-2 px-4 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white text-xs font-bold transition-all shadow-md shadow-red-900/10 cursor-pointer"
            >
              <Plus size={15} />
              <span>Create Studio Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
          <input
            type="text"
            placeholder="Search projects, clients, or screen specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 focus:outline-none focus:border-[#E5252A] dark:text-white text-slate-900 font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-9 px-3 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-700 focus:outline-none focus:border-[#E5252A]"
          >
            <option value="All">All Departments</option>
            <option value="2D">2D Team</option>
            <option value="3D">3D Team</option>
            <option value="Hybrid">Hybrid 2D+3D</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-700 focus:outline-none focus:border-[#E5252A]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Revision">Revision</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

      </div>

      {/* Projects Financial Valuation Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Filtered Projects</span>
            <div className="text-xl font-extrabold dark:text-white text-slate-900 mt-0.5">
              {filteredProjects.length} Projects
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Of {data.projects.length} total across all boards</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
            <FolderKanban size={22} />
          </div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Contract Pipeline</span>
            <div className="text-xl font-black dark:text-white text-slate-900 font-mono mt-0.5">
              {formatBDT(filteredPipelineBDT)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Agreed project budgets in BDT</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Banknote size={22} />
          </div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-500">Delivered Monetary Work</span>
            <div className="text-xl font-black text-emerald-500 font-mono mt-0.5">
              {formatBDT(filteredDeliveredBDT)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {filteredPipelineBDT > 0 ? Math.round((filteredDeliveredBDT / filteredPipelineBDT) * 100) : 0}% value realized
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map(col => {
            const columnProjects = filteredProjects.filter(p => p.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl dark:bg-[#0d1117] bg-slate-100/70 border dark:border-[#21262d] border-slate-200 p-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between pb-3 mb-3 border-b border-dashed ${col.color}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 text-slate-700 dark:text-slate-300">
                    {columnProjects.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {columnProjects.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-xs text-slate-400 border border-dashed dark:border-[#21262d] border-slate-200 rounded-xl">
                      No projects
                    </div>
                  ) : (
                    columnProjects.map(proj => {
                      const pctBudget = proj.budgetHours > 0 ? Math.min(100, Math.round((proj.loggedHours / proj.budgetHours) * 100)) : 0;
                      const assignedMembers = data.members.filter(m => proj.assignedMemberIds?.includes(m.id));
                      const projBudgetBDT = proj.budgetAmountBDT || (proj.budgetHours ? proj.budgetHours * 1500 : 0);
                      const projDeliveredBDT = data.timelogs
                        .filter(l => l.projectId === proj.id)
                        .reduce((sum, l) => sum + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);
                      const pctValRealized = projBudgetBDT > 0 ? Math.min(100, Math.round((projDeliveredBDT / projBudgetBDT) * 100)) : 0;

                      return (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm hover:border-[#E5252A] transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-[#E5252A]">{proj.code}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold dark:bg-[#21262d] bg-slate-100 dark:text-slate-300 text-slate-600">
                                {proj.department}
                              </span>
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Delete project "${proj.title}"?`)) {
                                      deleteProject(proj.id);
                                    }
                                  }}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold dark:text-white text-slate-900 leading-snug">
                              {proj.title}
                            </h4>
                            <div className="text-[11px] text-slate-400 mt-0.5">{proj.client}</div>
                          </div>

                          {/* BDT Contract & Delivered Valuation */}
                          <div className="p-2 rounded-lg dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 text-[10px] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 uppercase font-bold text-[9px]">Contract Value</span>
                              <span className="font-mono font-bold text-emerald-500 text-[11px]">{formatBDT(projBudgetBDT)}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400 text-[10px]">
                              <span>Delivered: <strong className="text-slate-700 dark:text-slate-200">{formatBDT(projDeliveredBDT)}</strong></span>
                              <span className="font-semibold text-emerald-500">{pctValRealized}%</span>
                            </div>
                          </div>

                          {/* Experiential Specs Pill */}
                          <div className="p-2 rounded-lg dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 text-[11px] space-y-1">
                            <div className="text-slate-400 text-[9px] uppercase font-bold flex items-center gap-1">
                              <Tv size={11} /> Screen Resolution
                            </div>
                            <div className="font-mono text-[10px] font-semibold dark:text-slate-200 text-slate-700 truncate" title={proj.screenSpecs}>
                              {proj.screenSpecs}
                            </div>
                          </div>

                          {/* Hours Progress */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Hours: <strong className="dark:text-white text-slate-900">{proj.loggedHours}h</strong> / {proj.budgetHours}h</span>
                              <span>{pctBudget}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full overflow-hidden dark:bg-[#21262d] bg-slate-200">
                              <div
                                className={`h-full rounded-full transition-all ${pctBudget > 90 ? 'bg-amber-500' : 'bg-[#E5252A]'}`}
                                style={{ width: `${pctBudget}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Assigned Visualizers Avatars & Event Date */}
                          <div className="flex items-center justify-between pt-2 border-t dark:border-[#21262d] border-slate-100 text-[11px]">
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {assignedMembers.slice(0, 3).map(m => (
                                <img
                                  key={m.id}
                                  src={m.avatar}
                                  alt={m.name}
                                  title={`${m.name} (${m.roleTitle})`}
                                  className="w-5 h-5 rounded-full object-cover border border-white dark:border-[#161b22]"
                                />
                              ))}
                              {assignedMembers.length > 3 && (
                                <span className="w-5 h-5 rounded-full bg-slate-600 text-white text-[9px] flex items-center justify-center font-bold">
                                  +{assignedMembers.length - 3}
                                </span>
                              )}
                            </div>

                            <span className="text-slate-400 flex items-center gap-0.5 text-[10px]">
                              <Calendar size={10} /> {proj.eventDate}
                            </span>
                          </div>

                          {/* Quick Move Select */}
                          <div className="pt-1">
                            <select
                              value={proj.status}
                              onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                              className="w-full text-[10px] py-1 px-2 rounded-lg dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-700"
                            >
                              <option value="Pending">Move to: Pending</option>
                              <option value="Ongoing">Move to: Ongoing</option>
                              <option value="Revision">Move to: Revision</option>
                              <option value="Delivered">Move to: Delivered</option>
                              <option value="Completed">Move to: Completed</option>
                            </select>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed List View */
        <div className="rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="dark:bg-[#0d1117] bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b dark:border-[#21262d] border-slate-200">
                <tr>
                  <th className="py-3 px-4">Code & Project</th>
                  <th className="py-3 px-4">Client & Venue</th>
                  <th className="py-3 px-4">Dept</th>
                  <th className="py-3 px-4">Screen Specs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Studio Hours</th>
                  <th className="py-3 px-4">Contract (BDT)</th>
                  <th className="py-3 px-4">Delivered (BDT)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-[#21262d] divide-slate-100">
                {filteredProjects.map(proj => {
                  const projBudgetBDT = proj.budgetAmountBDT || (proj.budgetHours ? proj.budgetHours * 1500 : 0);
                  const projDeliveredBDT = data.timelogs
                    .filter(l => l.projectId === proj.id)
                    .reduce((sum, l) => sum + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);
                  const pctValRealized = projBudgetBDT > 0 ? Math.min(100, Math.round((projDeliveredBDT / projBudgetBDT) * 100)) : 0;

                  return (
                    <tr key={proj.id} className="hover:bg-slate-50/50 dark:hover:bg-[#21262d]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[11px] font-bold text-[#E5252A]">{proj.code}</div>
                        <div className="font-bold dark:text-white text-slate-900 mt-0.5">{proj.title}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700 dark:text-slate-200">{proj.client}</div>
                        <div className="text-[11px] text-slate-400">{proj.venue || 'Main Stage'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold dark:bg-[#21262d] bg-slate-100 text-slate-600 dark:text-slate-300">
                          {proj.department}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate" title={proj.screenSpecs}>
                          {proj.screenSpecs}
                        </div>
                        <div className="text-[10px] text-slate-400">{proj.frameRate} • {proj.mediaServerFormat}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          proj.status === 'Ongoing'
                            ? 'bg-blue-500/10 text-blue-500'
                            : proj.status === 'Revision'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {proj.eventDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold dark:text-white text-slate-900">{proj.loggedHours}h</span>
                        <span className="text-slate-400 text-[11px]"> / {proj.budgetHours}h</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-emerald-500">{formatBDT(projBudgetBDT)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold dark:text-slate-200 text-slate-800">{formatBDT(projDeliveredBDT)}</div>
                        <div className="text-[10px] text-slate-400">{pctValRealized}% realized</div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveTab('tasks')}
                            className="text-[#E5252A] hover:underline font-bold text-xs cursor-pointer"
                          >
                            Tasks &rarr;
                          </button>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete project "${proj.title}"?`)) {
                                  deleteProject(proj.id);
                                }
                              }}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
