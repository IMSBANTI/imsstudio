import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { formatBDT } from '../utils/formatters';
import {
  Users,
  Plus,
  ShieldCheck,
  Briefcase,
  Mail,
  Phone,
  Clock,
  Layers,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  Building,
  UserPlus,
  Award,
  KeyRound,
  Lock,
  Banknote
} from 'lucide-react';
import { EditRoleModal, EditMemberModal } from './Modals';

export function TeamAdminView({ onOpenNewMember, onOpenNewDept, onOpenNewRole, onOpenAdminResetPassword }) {
  const { data, deleteMember, isAdmin, isManager, currentUser } = useStudio();
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [editingRole, setEditingRole] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const filteredMembers = data.members.filter(m => {
    if (selectedDeptFilter === 'All') return true;
    return m.departmentId === selectedDeptFilter;
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <Users className="text-[#E5252A]" size={26} />
            Studio Structure & Team Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pre-configured 2D and 3D studio hierarchies with complete capability to add new departments, custom roles, and artists anytime.
          </p>
        </div>

        {/* Action Buttons (Admin Only) */}
        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewDept}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 hover:border-[#E5252A] dark:text-slate-200 text-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Building size={14} />
              Add Department
            </button>

            <button
              onClick={onOpenNewRole}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 hover:border-[#E5252A] dark:text-slate-200 text-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Award size={14} />
              Add Custom Role
            </button>

            <button
              onClick={onOpenNewMember}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white text-xs font-bold transition-all shadow-md shadow-red-900/10 cursor-pointer"
            >
              <UserPlus size={15} />
              Add Team Member
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl dark:bg-[#161b22] bg-slate-100 border dark:border-[#30363d] border-slate-200 text-xs text-slate-500">
            <Lock size={14} className="text-amber-500" />
            <span>Read-Only (Admin privileges required to modify structure)</span>
          </div>
        )}
      </div>

      {/* Non-Admin Notice Banner */}
      {!isAdmin && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs">
          <ShieldCheck size={18} className="text-amber-500 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-amber-500">Logged in as {currentUser?.roleTitle} ({currentUser?.roleType?.toUpperCase()})</div>
            <div className="text-slate-600 dark:text-slate-300">
              You can view studio departments, team hierarchies, and artist productivity. Administrative actions (creating departments, managing roles, or resetting other members' passwords) are restricted to Studio Admins.
            </div>
          </div>
        </div>
      )}

      {/* Departments Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <Building size={18} className="text-[#E5252A]" />
            Studio Departments & Hierarchy
          </h2>
          <span className="text-xs text-slate-400">{data.departments.length} Studio Departments Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.departments.map(dept => {
            const deptMembers = data.members.filter(m => m.departmentId === dept.id);
            const deptRoles = data.roles.filter(r => r.departmentId === dept.id);
            const deptHours = data.timelogs
              .filter(l => l.departmentName?.includes(dept.name) || l.departmentName?.includes(dept.code))
              .reduce((sum, l) => sum + (l.hours || 0), 0);

            return (
              <div
                key={dept.id}
                className="p-5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#E5252A]/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: dept.color || '#E5252A' }}
                      ></span>
                      <h3 className="text-base font-extrabold dark:text-white text-slate-900">
                        {dept.name}
                      </h3>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded dark:bg-[#21262d] bg-slate-100 text-slate-500 dark:text-slate-300">
                      {dept.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {dept.description || 'Experiential studio division'}
                  </p>
                </div>

                {/* Pre-configured Roles List */}
                <div className="space-y-1.5 p-3 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Configured Roles ({deptRoles.length})</span>
                    <span>Rate & Level</span>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {deptRoles.map(r => (
                      <div
                        key={r.id}
                        onClick={() => isAdmin && setEditingRole(r)}
                        className={`flex items-center justify-between text-[11px] py-1 px-1.5 rounded-lg transition-colors group ${
                          isAdmin ? 'hover:bg-slate-200/60 dark:hover:bg-[#161b22] cursor-pointer' : ''
                        }`}
                        title={isAdmin ? "Click to edit role pricing & hierarchy level" : undefined}
                      >
                        <span className="font-semibold dark:text-slate-200 text-slate-700 truncate pr-2">{r.title}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="font-mono font-bold text-emerald-500 text-[10px]">{formatBDT(r.hourlyRateBDT || 1500)}/h</span>
                          <span className="text-slate-400 text-[10px]">{r.level}</span>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRole(r);
                              }}
                              className="text-slate-400 hover:text-[#E5252A] p-0.5 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Edit role pricing"
                            >
                              <Edit2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dept Stats */}
                <div className="flex items-center justify-between pt-2 border-t dark:border-[#21262d] border-slate-100 text-xs text-slate-400">
                  <span><strong>{deptMembers.length}</strong> Team Members</span>
                  <span><strong>{deptHours.toFixed(1)}h</strong> Total Work</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Members Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-[#E5252A]" />
              Team Members & Individual Productivity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage artist profiles, track assigned tasks, completed projects, and logged studio hours
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 text-xs self-start">
            <button
              onClick={() => setSelectedDeptFilter('All')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedDeptFilter === 'All'
                  ? 'bg-[#E5252A] text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({data.members.length})
            </button>
            {data.departments.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDeptFilter(d.id)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedDeptFilter === d.id
                    ? 'bg-[#E5252A] text-white font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map(member => {
            const memberTasks = data.tasks.filter(t => t.assigneeId === member.id);
            const ongoingCount = memberTasks.filter(t => t.status === 'Ongoing' || t.status === 'Revision').length;
            const completedCount = memberTasks.filter(t => t.status === 'Completed' || t.status === 'Delivered').length;
            const memberHours = data.timelogs
              .filter(l => l.memberId === member.id)
              .reduce((sum, l) => sum + (l.hours || 0), 0);
            const memberEarnedBDT = data.timelogs
              .filter(l => l.memberId === member.id)
              .reduce((sum, l) => sum + (l.monetaryValueBDT || (l.hours * (l.hourlyRateBDT || member.hourlyRateBDT || 1500))), 0);

            const is2D = member.departmentId === 'dept-2d';
            const is3D = member.departmentId === 'dept-3d';

            return (
              <div
                key={member.id}
                className="p-5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#E5252A]/50 transition-all"
              >
                {/* Profile Header */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold dark:text-white text-slate-900 truncate">
                        {member.name}
                      </h3>
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingMember(member)}
                            className="text-slate-400 hover:text-blue-500 transition-colors p-1 cursor-pointer"
                            title="Edit member pricing, role & capacity"
                          >
                            <Edit2 size={13} />
                          </button>
                          {member.roleType !== 'admin' && (
                            <>
                              <button
                                type="button"
                                onClick={() => onOpenAdminResetPassword(member)}
                                className="text-slate-400 hover:text-[#E5252A] transition-colors p-1 cursor-pointer"
                                title="Reset password for this member"
                              >
                                <KeyRound size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteMember(member.id)}
                                className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                                title="Remove member"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        is2D
                          ? 'bg-blue-500/10 text-blue-500'
                          : is3D
                          ? 'bg-purple-500/10 text-purple-500'
                          : 'bg-[#E5252A]/10 text-[#E5252A]'
                      }`}>
                        {member.roleTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => isAdmin && setEditingMember(member)}
                        className={`text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono font-bold transition-colors ${
                          isAdmin ? 'hover:bg-emerald-500/20 hover:ring-1 hover:ring-emerald-500/30 cursor-pointer' : ''
                        }`}
                        title={isAdmin ? "Click to edit hourly billable rate" : undefined}
                      >
                        {formatBDT(member.hourlyRateBDT || 1500)}/h
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1">{member.departmentName}</div>
                  </div>
                </div>

                {/* Contact details */}
                <div className="p-2.5 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 text-xs space-y-1 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={12} className="text-slate-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* Productivity Velocity & Value Stats */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Active</div>
                    <div className="font-extrabold text-blue-500 text-sm mt-0.5">{ongoingCount}</div>
                  </div>

                  <div className="p-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Done</div>
                    <div className="font-extrabold text-emerald-500 text-sm mt-0.5">{completedCount}</div>
                  </div>

                  <div className="p-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Hours</div>
                    <div className="font-extrabold text-[#E5252A] font-mono text-sm mt-0.5">{memberHours.toFixed(1)}h</div>
                  </div>

                  <div className="p-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Value</div>
                    <div className="font-extrabold text-emerald-500 font-mono text-[11px] mt-1 truncate" title={formatBDT(memberEarnedBDT)}>
                      {formatBDT(memberEarnedBDT)}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Role Hierarchy & Pricing Edit Modal */}
      <EditRoleModal
        isOpen={!!editingRole}
        role={editingRole}
        onClose={() => setEditingRole(null)}
      />

      {/* Team Member Profile & Individual Pricing Edit Modal */}
      <EditMemberModal
        isOpen={!!editingMember}
        member={editingMember}
        onClose={() => setEditingMember(null)}
      />

    </div>
  );
}
