import React from 'react';
import { useStudio } from '../context/StudioContext';
import { formatBDT } from '../utils/formatters';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Layers,
  ArrowUpRight,
  UserCheck,
  Flame,
  MonitorPlay,
  RotateCcw,
  Banknote,
  Coins
} from 'lucide-react';

export function DashboardView({ onOpenNewBrief, onOpenNewProject }) {
  const { data, setActiveTab, startTimer } = useStudio();

  // Metrics calculations
  const totalProjects = data.projects.length;
  const ongoingProjects = data.projects.filter(p => p.status === 'Ongoing' || p.status === 'Revision').length;
  const deliveredProjects = data.projects.filter(p => p.status === 'Delivered').length;
  const completedProjects = data.projects.filter(p => p.status === 'Completed').length;

  const totalTasks = data.tasks.length;
  const pendingTasks = data.tasks.filter(t => t.status === 'Pending').length;
  const ongoingTasks = data.tasks.filter(t => t.status === 'Ongoing').length;
  const revisionTasks = data.tasks.filter(t => t.status === 'Revision').length;
  const deliveredTasks = data.tasks.filter(t => t.status === 'Delivered').length;
  const completedTasks = data.tasks.filter(t => t.status === 'Completed').length;

  const totalBriefs = data.briefs.length;
  const wonBriefs = data.briefs.filter(b => b.outcomeStatus === 'Won / Handed to Studio').length;
  const pendingClarificationBriefs = data.briefs.filter(b => b.briefStatus === 'Need Clarification').length;
  const underReviewBriefs = data.briefs.filter(b => b.outcomeStatus === 'Pitch Under Review').length;

  const winRate = totalBriefs > 0 ? Math.round((wonBriefs / totalBriefs) * 100) : 0;

  // Monetary & Work Value calculations (BDT ৳)
  const totalPipelineValueBDT = data.projects.reduce(
    (acc, p) => acc + (p.budgetAmountBDT || (p.budgetHours ? p.budgetHours * 1500 : 0)),
    0
  );
  const totalDeliveredWorkValueBDT = data.timelogs.reduce(
    (acc, log) => acc + (log.monetaryValueBDT || (log.hours * (log.hourlyRateBDT || 1500))),
    0
  );
  const deliveredValue2DBDT = data.timelogs
    .filter(l => l.departmentName?.includes('2D'))
    .reduce((acc, l) => acc + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);
  const deliveredValue3DBDT = data.timelogs
    .filter(l => l.departmentName?.includes('3D'))
    .reduce((acc, l) => acc + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);

  // Department-wise hours & workload
  const totalHoursLogged = data.timelogs.reduce((acc, log) => acc + (log.hours || 0), 0);
  const hours2D = data.timelogs
    .filter(l => l.departmentName?.includes('2D'))
    .reduce((acc, l) => acc + (l.hours || 0), 0);
  const hours3D = data.timelogs
    .filter(l => l.departmentName?.includes('3D'))
    .reduce((acc, l) => acc + (l.hours || 0), 0);

  const pct2D = totalHoursLogged > 0 ? Math.round((hours2D / totalHoursLogged) * 100) : 50;
  const pct3D = totalHoursLogged > 0 ? Math.round((hours3D / totalHoursLogged) * 100) : 50;

  // Visualizers live radar list
  const visualizers = data.members.filter(m => m.departmentId === 'dept-2d' || m.departmentId === 'dept-3d');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Studio Header Banner with IMS Brand Accent */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 dark:bg-gradient-to-r dark:from-[#161b22] dark:via-[#1c232d] dark:to-[#161b22] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-700/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5252A]/20 border border-[#E5252A]/40 text-red-300">
              <Flame size={14} className="text-[#E5252A]" />
              Experiential Media & CGI Studio Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              IMS Studio Operations & Work Velocity
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Live tracking for experiential design, 2D & 3D stage screen visuals, LED canvas specifications, Business Development event pitches, and team productivity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewBrief}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white text-xs font-bold transition-all shadow-lg shadow-red-900/20 cursor-pointer"
            >
              <Briefcase size={16} />
              Ingest BD Brief
            </button>
            <button
              onClick={onOpenNewProject}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl dark:bg-[#21262d] bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
            >
              <FolderKanban size={16} />
              Launch Studio Project
            </button>
          </div>
        </div>

        {/* Subtle Decorative Glow Ring */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#E5252A]/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Projects */}
        <div className="p-5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Running Projects
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <FolderKanban size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold dark:text-white text-slate-900">
              {ongoingProjects}
            </span>
            <span className="text-xs text-slate-400">
              of {totalProjects} total this month
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t dark:border-[#21262d] border-slate-100">
            <span>Delivered / Wrap: {deliveredProjects + completedProjects}</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-0.5">
              Active <ArrowUpRight size={12} />
            </span>
          </div>
        </div>

        {/* Task Velocity & Revisions */}
        <div className="p-5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tasks in Pipeline
            </span>
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <Layers size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold dark:text-white text-slate-900">
              {ongoingTasks + revisionTasks}
            </span>
            <span className="text-xs text-amber-500 font-medium">
              ({revisionTasks} in revision)
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t dark:border-[#21262d] border-slate-100">
            <span>Completed: {completedTasks}</span>
            <span className="text-blue-400 font-semibold">Pending: {pendingTasks}</span>
          </div>
        </div>

        {/* Hours Logged this Month */}
        <div className="p-5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Studio Logged Hours
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold dark:text-white text-slate-900">
              {totalHoursLogged.toFixed(1)}h
            </span>
            <span className="text-xs text-purple-400 font-medium">
              Across all boards
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t dark:border-[#21262d] border-slate-100">
            <span>2D: {hours2D}h</span>
            <span>3D: {hours3D}h</span>
          </div>
        </div>

        {/* BD Pitch Conversion & Pending */}
        <div className="p-5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              BD Pitch Win Ratio
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold dark:text-white text-slate-900">
              {winRate}%
            </span>
            <span className="text-xs text-emerald-500 font-medium">
              {wonBriefs} Won pitches
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t dark:border-[#21262d] border-slate-100">
            <span className="text-amber-500 font-semibold">{pendingClarificationBriefs} Need Clarification</span>
            <span>{underReviewBriefs} Under Review</span>
          </div>
        </div>

      </div>

      {/* Studio Monetary Work Value & Financial Realization (BDT) */}
      <div className="p-6 rounded-2xl dark:bg-gradient-to-r dark:from-[#161b22] dark:via-[#1c232d] dark:to-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Banknote size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                Studio Monetary Work Value & Contract Pipeline
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-extrabold">
                  BDT (৳)
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated monetary valuation based on visualizer hourly billable rates and signed project contract values
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('timetracking')}
            className="text-xs font-semibold text-[#E5252A] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            Detailed Timesheets & Valuations &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Contract Pipeline</div>
            <div className="mt-1.5 text-2xl font-black dark:text-white text-slate-900 font-mono">
              {formatBDT(totalPipelineValueBDT)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Sum of all signed project contract budgets</div>
          </div>

          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
            <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Delivered Monetary Value</div>
            <div className="mt-1.5 text-2xl font-black text-emerald-500 font-mono">
              {formatBDT(totalDeliveredWorkValueBDT)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {totalPipelineValueBDT > 0 ? Math.round((totalDeliveredWorkValueBDT / totalPipelineValueBDT) * 100) : 0}% of contract budget delivered
            </div>
          </div>

          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
            <div className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">2D Team Delivered Value</div>
            <div className="mt-1.5 text-2xl font-black text-blue-500 font-mono">
              {formatBDT(deliveredValue2DBDT)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">From {hours2D}h logged across 2D pipelines</div>
          </div>

          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
            <div className="text-[11px] font-bold text-purple-500 uppercase tracking-wider">3D Team Delivered Value</div>
            <div className="mt-1.5 text-2xl font-black text-purple-500 font-mono">
              {formatBDT(deliveredValue3DBDT)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">From {hours3D}h logged across 3D CGI pipelines</div>
          </div>
        </div>
      </div>

      {/* Main Section: Department Workload & Task Pipeline Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Workload & Distribution (2D vs 3D) */}
        <div className="lg:col-span-1 p-6 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-white text-slate-900">
                Department Workload
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hourly distribution & active pipeline balance
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-[#E5252A]/10 text-[#E5252A]">
              2D vs 3D
            </span>
          </div>

          {/* Comparative Balance Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-500">2D Team: {hours2D}h ({pct2D}%)</span>
              <span className="text-purple-500">3D Team: {hours3D}h ({pct3D}%)</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden flex dark:bg-[#21262d] bg-slate-100">
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${pct2D}%` }}
                title={`2D Team: ${pct2D}%`}
              ></div>
              <div
                className="bg-purple-500 h-full transition-all duration-500"
                style={{ width: `${pct3D}%` }}
                title={`3D Team: ${pct3D}%`}
              ></div>
            </div>
          </div>

          {/* Task Status Breakdown Visual */}
          <div className="space-y-3 pt-4 border-t dark:border-[#21262d] border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pipeline Status Distribution
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Ongoing</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </div>
                <div className="mt-1 text-lg font-bold dark:text-white text-slate-900">{ongoingTasks}</div>
              </div>

              <div className="p-3 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Revision</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                </div>
                <div className="mt-1 text-lg font-bold text-amber-500">{revisionTasks}</div>
              </div>

              <div className="p-3 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Pending</span>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                </div>
                <div className="mt-1 text-lg font-bold dark:text-white text-slate-900">{pendingTasks}</div>
              </div>

              <div className="p-3 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Delivered / Done</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="mt-1 text-lg font-bold text-emerald-500">{deliveredTasks + completedTasks}</div>
              </div>
            </div>
          </div>

          {/* Pending Clarification Alert Callout */}
          {pendingClarificationBriefs > 0 && (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                <AlertCircle size={16} />
                <span>{pendingClarificationBriefs} BD Briefs Require Clarification</span>
              </div>
              <p className="text-xs text-slate-300 dark:text-slate-300">
                Client technical rider or specs are missing before studio workload can be confirmed.
              </p>
              <button
                onClick={() => setActiveTab('briefs')}
                className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Review Briefs in BD Hub &rarr;
              </button>
            </div>
          )}

        </div>

        {/* Live Studio Radar: "Who is Doing What" */}
        <div className="lg:col-span-2 p-6 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <UserCheck size={18} className="text-[#E5252A]" />
                Visualizer Live Radar & Task Assignments
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time tracking of what each 2D and 3D artist is producing right now
              </p>
            </div>
            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-glow"></span>
              {visualizers.length} Active Artists
            </span>
          </div>

          {/* Visualizers Table / List */}
          <div className="divide-y dark:divide-[#21262d] divide-slate-100 overflow-x-auto">
            {visualizers.map(member => {
              // Find active tasks assigned to this member
              const memberTasks = data.tasks.filter(t => t.assigneeId === member.id);
              const activeTask = memberTasks.find(t => t.status === 'Ongoing' || t.status === 'Revision') || memberTasks[0];
              const project = activeTask ? data.projects.find(p => p.id === activeTask.projectId) : null;
              
              // Find hours logged today
              const todayStr = new Date().toISOString().slice(0, 10);
              const hoursToday = data.timelogs
                .filter(l => l.memberId === member.id && l.date === todayStr)
                .reduce((sum, l) => sum + (l.hours || 0), 0);

              const is2D = member.departmentId === 'dept-2d';

              return (
                <div key={member.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-[#21262d]/50 px-2 rounded-xl transition-colors">
                  
                  {/* Member Bio */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700"
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 dark:border-[#161b22] border-white ${
                        activeTask ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}></span>
                    </div>

                    <div>
                      <div className="text-xs font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                        {member.name}
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          is2D
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          {member.roleTitle}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{member.departmentName}</div>
                    </div>
                  </div>

                  {/* Current Active Task & Project */}
                  <div className="flex-1 min-w-[220px] hidden sm:block">
                    {activeTask ? (
                      <div>
                        <div className="text-xs font-semibold dark:text-slate-200 text-slate-800 truncate flex items-center gap-1.5">
                          {activeTask.status === 'Revision' ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold flex items-center gap-1">
                              <RotateCcw size={10} /> Rev {activeTask.revisionCount || 1}
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                              {activeTask.status}
                            </span>
                          )}
                          <span className="truncate">{activeTask.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {project ? `${project.code} • ${project.title}` : 'Studio Production'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No task currently assigned</span>
                    )}
                  </div>

                  {/* Today's Logged Hours & Action */}
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-xs font-mono font-bold dark:text-white text-slate-900">
                        {hoursToday > 0 ? `${hoursToday.toFixed(1)}h today` : '0h today'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {activeTask ? `${activeTask.loggedHours || 0}h total` : 'idle'}
                      </div>
                    </div>

                    {activeTask && (
                      <button
                        onClick={() => startTimer(activeTask.projectId, activeTask.id)}
                        title="Track Time for this Task"
                        className="p-2 rounded-lg text-slate-400 hover:text-[#E5252A] hover:bg-[#E5252A]/10 transition-colors cursor-pointer"
                      >
                        <Clock size={16} />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Running Experiential Projects Showcase */}
      <div className="p-6 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <MonitorPlay size={18} className="text-[#E5252A]" />
              Running Experiential Projects (This Month)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active stage screen resolutions, render formats, and load-in milestones
            </p>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-semibold text-[#E5252A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All Projects Pipeline &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.projects.slice(0, 3).map(proj => {
            const pctBudget = proj.budgetHours > 0 ? Math.min(100, Math.round((proj.loggedHours / proj.budgetHours) * 100)) : 0;
            const projBudgetBDT = proj.budgetAmountBDT || (proj.budgetHours ? proj.budgetHours * 1500 : 0);
            const projDeliveredBDT = data.timelogs
              .filter(l => l.projectId === proj.id)
              .reduce((sum, l) => sum + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || 1500))), 0);
            const pctValRealized = projBudgetBDT > 0 ? Math.min(100, Math.round((projDeliveredBDT / projBudgetBDT) * 100)) : 0;

            return (
              <div key={proj.id} className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[11px] font-bold text-[#E5252A]">{proj.code}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      proj.status === 'Ongoing'
                        ? 'bg-blue-500/10 text-blue-500'
                        : proj.status === 'Revision'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold dark:text-white text-slate-900 line-clamp-1">{proj.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{proj.client} • {proj.department}</p>
                </div>

                {/* BDT Contract & Delivered Valuation */}
                <div className="p-2.5 rounded-lg dark:bg-[#161b22] bg-white text-xs space-y-1.5 border dark:border-[#30363d] border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Contract Budget</span>
                    <span className="font-mono text-xs font-black text-emerald-500">{formatBDT(projBudgetBDT)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Delivered: <strong className="text-slate-800 dark:text-slate-200">{formatBDT(projDeliveredBDT)}</strong></span>
                    <span className="font-semibold text-emerald-500">{pctValRealized}%</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg dark:bg-[#161b22] bg-white text-xs space-y-0.5 border dark:border-[#30363d] border-slate-200">
                  <div className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Screen Specs</div>
                  <div className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate" title={proj.screenSpecs}>
                    {proj.screenSpecs}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Studio Hours: <strong className="dark:text-white text-slate-900">{proj.loggedHours}h</strong> / {proj.budgetHours}h</span>
                    <span>{pctBudget}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden dark:bg-[#21262d] bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pctBudget > 90 ? 'bg-red-500' : 'bg-[#E5252A]'
                      }`}
                      style={{ width: `${pctBudget}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t dark:border-[#21262d] border-slate-200">
                  <span>Event: <strong>{proj.eventDate}</strong></span>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-[#E5252A] hover:underline font-semibold cursor-pointer"
                  >
                    View Tasks
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
