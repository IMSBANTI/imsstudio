import React, { useState, useMemo } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Clock,
  Play,
  Pause,
  Calendar,
  AlertCircle,
  Sparkles,
  Layers,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  UserCheck,
  Lock,
  Trash2,
  Pencil,
  UserPlus,
  LayoutGrid,
  List
} from 'lucide-react';
import { EditTaskModal, AddCollaboratorModal, getProductionVisualizers } from './Modals';

export function TasksView({ onOpenNewTask }) {
  const { data, updateTask, deleteTask, startTimer, pauseTimer, timerState, currentUser, isManager, isAdmin } = useStudio();

  const [editingTask, setEditingTask] = useState(null);
  const [collaboratingTask, setCollaboratingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedAssignee, setSelectedAssignee] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showRevisionOnly, setShowRevisionOnly] = useState(false);
  const [filterMyTasks, setFilterMyTasks] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('ims_tasks_view_mode') || 'kanban';
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('ims_tasks_view_mode', mode);
  };

  const statuses = ['Pending', 'Ongoing', 'Revision', 'Delivered', 'Completed'];

  const filteredTasks = useMemo(() => {
    return data.tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.screenSpecs?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assigneeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.deliverableSpec?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProject = selectedProject === 'All' || task.projectId === selectedProject;
      const effectiveAssignee = filterMyTasks ? (currentUser?.id || '') : selectedAssignee;
      const matchesAssignee = effectiveAssignee === 'All' || task.assigneeId === effectiveAssignee;
      const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
      const matchesRevision = !showRevisionOnly || task.status === 'Revision' || task.revisionCount > 0;

      return matchesSearch && matchesProject && matchesAssignee && matchesStatus && matchesRevision;
    });
  }, [data.tasks, searchQuery, selectedProject, selectedAssignee, selectedStatus, showRevisionOnly, filterMyTasks, currentUser?.id]);

  const handleStatusChange = (taskId, newStatus) => {
    const task = data.tasks.find(t => t.id === taskId);
    const updates = { status: newStatus };
    if (newStatus === 'Revision' && task.status !== 'Revision') {
      updates.revisionCount = (task.revisionCount || 0) + 1;
    }
    updateTask(taskId, updates);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'High':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Revision':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'Delivered':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'Completed' || status === 'Delivered') return false;
    const today = new Date().toISOString().slice(0, 10);
    return dueDate < today;
  };

  const getTaskLoggedHours = (taskId) => {
    const logs = data.timelogs?.filter(l => l.taskId === taskId) || [];
    const sum = logs.reduce((acc, l) => acc + (parseFloat(l.hours) || 0), 0);
    return sum.toFixed(1);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <CheckSquare className="text-[#E5252A]" size={26} />
            Studio Task Pipeline & Revision Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Granular visualizer assignments, deliverable output specs, client revision logs, and stopwatch integration.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {/* View Mode Switcher */}
          <div className="h-9 flex items-center p-1 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
            <button
              onClick={() => handleViewModeChange('kanban')}
              className={`h-7 px-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'kanban'
                  ? 'bg-[#E5252A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`h-7 px-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'list'
                  ? 'bg-[#E5252A] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
              title="Detailed List View"
            >
              <List size={15} />
              <span className="hidden sm:inline">Detail List</span>
            </button>
          </div>

          {/* Assign New Task (Admins & Managers) */}
          {isManager ? (
            <button
              onClick={onOpenNewTask}
              className="h-9 flex items-center gap-2 px-4 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white text-xs font-bold transition-all shadow-md shadow-red-900/10 cursor-pointer"
            >
              <Plus size={15} />
              <span>Assign New Task</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Lock size={14} className="text-slate-400" />
              <span>Managed by Studio Managers</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-3">
        
        <div className="flex flex-col md:flex-row gap-3">
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search tasks, visualizers, or deliverable formats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 focus:outline-none focus:border-[#E5252A] dark:text-white text-slate-900"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-900"
            >
              <option value="All">All Studio Projects</option>
              {data.projects.map(p => (
                <option key={p.id} value={p.id}>{p.code}: {p.title}</option>
              ))}
            </select>
          </div>

          {!filterMyTasks && (
            <div className="w-full md:w-48">
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-900"
              >
                <option value="All">All Visualizers</option>
                {getProductionVisualizers(data.members, data.departments).map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.departmentName || m.roleTitle})</option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* Quick Filter Status Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t dark:border-[#21262d] border-slate-100 text-xs">
          
          {/* Quick Filter: My Assigned Tasks */}
          <button
            onClick={() => setFilterMyTasks(!filterMyTasks)}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 font-bold cursor-pointer ${
              filterMyTasks
                ? 'bg-blue-600 text-white shadow-sm'
                : 'dark:bg-[#21262d] bg-slate-100 text-blue-500 hover:bg-blue-500/10'
            }`}
          >
            <UserCheck size={13} />
            My Assigned Tasks
          </button>

          <button
            onClick={() => setSelectedStatus('All')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedStatus === 'All'
                ? 'bg-[#E5252A] text-white font-semibold'
                : 'dark:bg-[#21262d] bg-slate-100 text-slate-600 dark:text-slate-300'
            }`}
          >
            All ({data.tasks.length})
          </button>

          {statuses.map(st => {
            const count = data.tasks.filter(t => t.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-[#E5252A] text-white font-semibold'
                    : 'dark:bg-[#21262d] bg-slate-100 text-slate-600 dark:text-slate-300'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}

          <button
            onClick={() => setShowRevisionOnly(!showRevisionOnly)}
            className={`ml-auto px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 font-bold cursor-pointer ${
              showRevisionOnly
                ? 'bg-amber-500 text-white'
                : 'dark:bg-[#21262d] bg-slate-100 text-amber-500'
            }`}
          >
            <RotateCcw size={12} />
            Show Revision Tasks Only
          </button>

        </div>

      </div>

      {/* Task Views: Kanban Board or Detailed List View */}
      {viewMode === 'kanban' ? (
        /* Task Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {statuses.map(status => {
            const tasksInCol = filteredTasks.filter(t => t.status === status);

            return (
              <div
                key={status}
                className="flex flex-col rounded-2xl dark:bg-[#0d1117] bg-slate-100/70 border dark:border-[#21262d] border-slate-200 p-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed dark:border-[#30363d] border-slate-300">
                  <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
                    {status}
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 text-slate-700 dark:text-slate-300">
                    {tasksInCol.length}
                  </span>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {tasksInCol.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-xs text-slate-400 border border-dashed dark:border-[#21262d] border-slate-200 rounded-xl">
                      No tasks
                    </div>
                  ) : (
                    tasksInCol.map(task => {
                      const assignee = data.members.find(m => m.id === task.assigneeId);
                      const project = data.projects.find(p => p.id === task.projectId);
                      const isMyTask = task.assigneeId === currentUser?.id;

                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-xl dark:bg-[#161b22] bg-white border shadow-sm transition-all space-y-3 ${
                            isMyTask
                              ? 'border-blue-500/70 dark:border-blue-500/70 ring-1 ring-blue-500/30'
                              : 'dark:border-[#30363d] border-slate-200 hover:border-[#E5252A]'
                          }`}
                        >
                          {/* Header: Priority & Revisions */}
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getPriorityBadge(task.priority)}`}>
                              {task.priority}
                            </span>

                            <div className="flex items-center gap-1">
                              {isMyTask && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-500 font-extrabold">
                                  YOUR TASK
                                </span>
                              )}
                              {task.revisionCount > 0 && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold flex items-center gap-1">
                                  <RotateCcw size={10} /> Rev {task.revisionCount}
                                </span>
                              )}
                              {isManager && (
                                <div className="flex items-center gap-0.5 ml-1">
                                  <button
                                    onClick={() => setCollaboratingTask(task)}
                                    title="Add another visualizer to collaborate on this task"
                                    className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                  >
                                    <UserPlus size={12} />
                                  </button>
                                  <button
                                    onClick={() => setEditingTask(task)}
                                    title="Edit Task & Canvas Specs"
                                    className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete task "${task.title}"?`)) {
                                        deleteTask(task.id);
                                      }
                                    }}
                                    title="Delete Task"
                                    className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Title & Project */}
                          <div>
                            <h4 className="text-xs font-bold dark:text-white text-slate-900 leading-snug">
                              {task.title}
                            </h4>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate font-medium">
                              {project ? `${project.code} • ${project.title}` : 'Studio Task'}
                            </div>
                          </div>

                          {/* Task Description */}
                          {task.description && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-50/60 dark:bg-[#12161d] p-2 rounded-lg border dark:border-[#21262d] border-slate-100">
                              {task.description}
                            </div>
                          )}

                          {/* Revision feedback note if available */}
                          {task.revisionNotes && (
                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400">
                              <strong>Feedback:</strong> {task.revisionNotes}
                            </div>
                          )}

                          {/* Assignee & Timer Trigger */}
                          <div className="flex items-center justify-between pt-2 border-t dark:border-[#21262d] border-slate-100 text-xs">
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              {assignee ? (
                                <>
                                  <img
                                    src={assignee.avatar}
                                    alt={assignee.name}
                                    className="w-5 h-5 rounded-full object-cover border flex-shrink-0"
                                  />
                                  <span className="text-[11px] font-semibold dark:text-slate-300 text-slate-700 truncate max-w-[110px]" title={assignee.name?.trim()}>
                                    {assignee.name?.trim()}
                                  </span>
                                </>
                              ) : task.assigneeName ? (
                                <span className="text-[11px] font-semibold dark:text-slate-300 text-slate-700 truncate max-w-[110px]" title={task.assigneeName.trim()}>
                                  {task.assigneeName.trim()}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Unassigned</span>
                              )}
                            </div>

                            {/* Quick Punch In / Out Timer */}
                            {timerState.isRunning && timerState.taskId === task.id ? (
                              <button
                                onClick={() => pauseTimer()}
                                title="Pause Stopwatch for this Task"
                                className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 cursor-pointer shadow-xs"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                <Pause size={10} /> Tracking
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (task.status === 'Pending') {
                                    handleStatusChange(task.id, 'Ongoing');
                                  }
                                  startTimer(task.projectId, task.id);
                                }}
                                title="Start Stopwatch for this Task"
                                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[#E5252A]/10 hover:bg-[#E5252A] text-[#E5252A] hover:text-white font-bold transition-all cursor-pointer"
                              >
                                <Play size={10} /> Track
                              </button>
                            )}
                          </div>

                          {/* Move Status Dropdown (Visualizer can move their own task or Managers can move any) */}
                          <div className="pt-1">
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className="w-full text-[10px] py-1 px-2 rounded-lg dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-700 cursor-pointer"
                            >
                              {statuses.map(st => (
                                <option key={st} value={st}>Move to: {st}</option>
                              ))}
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
                  <th className="py-3 px-4">Task & Specs</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Assigned Visualizer</th>
                  <th className="py-3 px-4">Priority & Rev</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Hours & Stopwatch</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-[#21262d] divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CheckSquare size={32} className="text-slate-400/40" />
                        <span className="text-sm font-semibold">No tasks found matching your filters</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => {
                    const assignee = data.members.find(m => m.id === task.assigneeId);
                    const project = data.projects.find(p => p.id === task.projectId);
                    const isMyTask = task.assigneeId === currentUser?.id;
                    const isTaskOverdue = isOverdue(task.dueDate, task.status);
                    const loggedHours = getTaskLoggedHours(task.id);
                    const isTracking = timerState.isRunning && timerState.taskId === task.id;

                    return (
                      <tr
                        key={task.id}
                        className={`hover:bg-slate-50/50 dark:hover:bg-[#21262d]/50 transition-colors ${
                          isMyTask ? 'bg-blue-500/5' : ''
                        }`}
                      >
                        {/* Task & Deliverable Specs */}
                        <td className="py-3.5 px-4 max-w-[280px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold dark:text-white text-slate-900 text-xs">
                              {task.title}
                            </span>
                            {isMyTask && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-500 font-extrabold border border-blue-500/20">
                                YOU
                              </span>
                            )}
                          </div>
                          {(task.screenSpecs || task.deliverableSpec) && (
                            <div className="text-[10px] text-slate-400 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                              <Sparkles size={10} className="text-[#E5252A]" />
                              {task.screenSpecs || task.deliverableSpec}
                            </div>
                          )}
                          {task.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 leading-relaxed" title={task.description}>
                              {task.description}
                            </p>
                          )}
                          {task.revisionNotes && (
                            <div className="mt-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 inline-flex items-center gap-1">
                              <RotateCcw size={9} /> Note: {task.revisionNotes}
                            </div>
                          )}
                        </td>

                        {/* Project */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {project ? (
                            <div>
                              <div className="font-mono text-[11px] font-bold text-[#E5252A]">{project.code}</div>
                              <div className="font-semibold dark:text-slate-200 text-slate-800 text-[11px] max-w-[150px] truncate" title={project.title}>
                                {project.title}
                              </div>
                              <div className="text-[10px] text-slate-400">{project.client}</div>
                            </div>
                          ) : (
                            <div className="text-slate-400 text-[11px]">{task.projectTitle || 'Studio Task'}</div>
                          )}
                        </td>

                        {/* Assigned Visualizer */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {assignee ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-6 h-6 rounded-full object-cover border dark:border-[#30363d] border-slate-200"
                              />
                              <div>
                                <div className="font-bold dark:text-slate-200 text-slate-800 text-[11px]">
                                  {assignee.name}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {assignee.departmentName || assignee.roleTitle}
                                </div>
                              </div>
                            </div>
                          ) : task.assigneeName ? (
                            <div className="font-semibold dark:text-slate-300 text-slate-700 text-[11px]">
                              {task.assigneeName}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Priority & Revisions */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getPriorityBadge(task.priority)}`}>
                              {task.priority}
                            </span>
                            {task.revisionCount > 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold flex items-center gap-1 border border-amber-500/20">
                                <RotateCcw size={9} /> Rev {task.revisionCount}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className={isTaskOverdue ? 'text-rose-500' : 'text-slate-400'} />
                            <span className={`font-mono text-[11px] ${
                              isTaskOverdue ? 'text-rose-500 font-bold' : 'dark:text-slate-300 text-slate-700'
                            }`}>
                              {task.dueDate || 'No date'}
                            </span>
                          </div>
                          {isTaskOverdue && (
                            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider block mt-0.5">
                              Overdue
                            </span>
                          )}
                        </td>

                        {/* Tracked Hours & Stopwatch */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold dark:text-white text-slate-900 text-xs">
                              {loggedHours}h
                            </span>
                            {isTracking ? (
                              <button
                                onClick={() => pauseTimer()}
                                title="Pause Stopwatch for this Task"
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 cursor-pointer shadow-xs"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                <Pause size={10} /> Tracking
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (task.status === 'Pending') {
                                    handleStatusChange(task.id, 'Ongoing');
                                  }
                                  startTimer(task.projectId, task.id);
                                }}
                                title="Start Stopwatch for this Task"
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-[#E5252A]/10 hover:bg-[#E5252A] text-[#E5252A] hover:text-white font-bold transition-all cursor-pointer"
                              >
                                <Play size={10} /> Track
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Pipeline Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border cursor-pointer transition-colors ${getStatusBadge(task.status)} dark:bg-[#0d1117] bg-white`}
                          >
                            {statuses.map(st => (
                              <option key={st} value={st} className="dark:bg-[#161b22] bg-white text-slate-900 dark:text-white">
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {isManager && (
                              <button
                                onClick={() => setCollaboratingTask(task)}
                                title="Add collaborator to task"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                              >
                                <UserPlus size={14} />
                              </button>
                            )}
                            {isManager && (
                              <button
                                onClick={() => setEditingTask(task)}
                                title="Edit Task"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                              >
                                <Pencil size={14} />
                              </button>
                            )}
                            {isManager && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete task "${task.title}"?`)) {
                                    deleteTask(task.id);
                                  }
                                }}
                                title="Delete Task"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="px-4 py-3 dark:bg-[#0d1117] bg-slate-50 border-t dark:border-[#21262d] border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
            <span>Showing <strong className="text-slate-900 dark:text-white">{filteredTasks.length}</strong> tasks</span>
            <div className="flex items-center gap-4">
              <span>
                Total Logged: <strong className="text-slate-900 dark:text-white">
                  {filteredTasks.reduce((acc, t) => acc + parseFloat(getTaskLoggedHours(t.id)), 0).toFixed(1)}h
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />

      {/* Add Collaborator Modal */}
      <AddCollaboratorModal
        isOpen={!!collaboratingTask}
        task={collaboratingTask}
        onClose={() => setCollaboratingTask(null)}
      />

    </div>
  );
}
