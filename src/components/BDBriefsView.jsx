import React, { useState, useMemo } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  Briefcase,
  Plus,
  Filter,
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
  Layers,
  Building,
  DollarSign,
  Trash2
} from 'lucide-react';

export function BDBriefsView({ onOpenNewBrief, onOpenHandoverModal }) {
  const { data, updateBrief, deleteBrief } = useStudio();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBDMember, setSelectedBDMember] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // Pitch | Submission | Execution
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedBriefStatus, setSelectedBriefStatus] = useState('All');
  const [selectedOutcome, setSelectedOutcome] = useState('All');

  // BD Team Members list
  const bdMembers = data.members.filter(m => m.departmentId === 'dept-bd');

  // Filtered briefs
  const filteredBriefs = useMemo(() => {
    return data.briefs.filter(brief => {
      const matchesSearch =
        brief.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brief.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brief.eventType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brief.bdMemberName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBD = selectedBDMember === 'All' || brief.bdMemberId === selectedBDMember || brief.bdMemberName === selectedBDMember;
      const matchesType = selectedType === 'All' || brief.projectType === selectedType;
      const matchesSource = selectedSource === 'All' || brief.projectSource === selectedSource;
      const matchesStatus = selectedBriefStatus === 'All' || brief.briefStatus === selectedBriefStatus;
      const matchesOutcome = selectedOutcome === 'All' || brief.outcomeStatus === selectedOutcome;

      return matchesSearch && matchesBD && matchesType && matchesSource && matchesStatus && matchesOutcome;
    });
  }, [data.briefs, searchQuery, selectedBDMember, selectedType, selectedSource, selectedBriefStatus, selectedOutcome]);

  // BD Performance Stats
  const totalSubmissions = data.briefs.length;
  const wonCount = data.briefs.filter(b => b.outcomeStatus === 'Won / Handed to Studio').length;
  const underReviewCount = data.briefs.filter(b => b.outcomeStatus === 'Pitch Under Review').length;
  const followUpCount = data.briefs.filter(b => b.outcomeStatus === 'Follow-up for Smaller Work').length;
  const lostCount = data.briefs.filter(b => b.outcomeStatus === 'Lost').length;
  const needClarificationCount = data.briefs.filter(b => b.briefStatus === 'Need Clarification').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'Need Clarification':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'Revised Brief Received':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'Won / Handed to Studio':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-bold';
      case 'Pitch Under Review':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/40 font-semibold';
      case 'Follow-up for Smaller Work':
        return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/40 font-semibold';
      case 'Lost':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Pitch':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Submission':
        return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'Execution':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Header & BD Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <Briefcase className="text-[#E5252A]" size={26} />
            Business Development Brief & Pitch Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track client pitches, submissions, win/loss conversion, source channels, and handover won projects to 2D/3D studio.
          </p>
        </div>

        <button
          onClick={onOpenNewBrief}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white text-xs font-bold transition-all shadow-md shadow-red-900/10 cursor-pointer self-start md:self-auto"
        >
          <Plus size={16} />
          Create New BD Brief / Pitch
        </button>
      </div>

      {/* BD KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Total Briefs</div>
          <div className="mt-1 text-2xl font-extrabold dark:text-white text-slate-900">{totalSubmissions}</div>
          <div className="text-[10px] text-slate-400 mt-1">Pitches & Executions</div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-emerald-500 tracking-wider">Won / Handed Over</div>
          <div className="mt-1 text-2xl font-extrabold text-emerald-500">{wonCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Active in Studio</div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-blue-400 tracking-wider">Pitch Under Review</div>
          <div className="mt-1 text-2xl font-extrabold text-blue-400">{underReviewCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Awaiting Client Vote</div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-amber-500 tracking-wider">Need Clarification</div>
          <div className="mt-1 text-2xl font-extrabold text-amber-500">{needClarificationCount}</div>
          <div className="text-[10px] text-amber-500/80 mt-1">Missing Specs/Rider</div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider">Follow-up Works</div>
          <div className="mt-1 text-2xl font-extrabold text-indigo-400">{followUpCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Smaller Add-on Scope</div>
        </div>

        <div className="p-4 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-rose-400 tracking-wider">Lost Pitches</div>
          <div className="mt-1 text-2xl font-extrabold text-rose-400">{lostCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Archived Records</div>
        </div>

      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by brief title, client name, event type, or BD member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 focus:outline-none focus:border-[#E5252A] dark:text-white text-slate-900"
            />
          </div>

          {/* BD Member Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedBDMember}
              onChange={(e) => setSelectedBDMember(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 focus:outline-none focus:border-[#E5252A] dark:text-white text-slate-900"
            >
              <option value="All">All BD Team Members</option>
              {bdMembers.map(m => (
                <option key={m.id} value={m.name}>{m.name} ({m.roleTitle})</option>
              ))}
            </select>
          </div>

          {/* Project Type Filter (Pitch | Submission | Execution) */}
          <div className="w-full md:w-44">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 focus:outline-none focus:border-[#E5252A] dark:text-white text-slate-900"
            >
              <option value="All">All Project Types</option>
              <option value="Pitch">Pitch (Pre-bid)</option>
              <option value="Submission">Submission (Event RFP)</option>
              <option value="Execution">Execution (Confirmed)</option>
            </select>
          </div>

        </div>

        {/* Secondary Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t dark:border-[#21262d] border-slate-100 text-xs">
          
          <span className="text-slate-400 font-semibold text-[11px] mr-1 flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>

          {/* Brief Status Chips */}
          <button
            onClick={() => setSelectedBriefStatus('All')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              selectedBriefStatus === 'All'
                ? 'bg-[#E5252A] text-white font-semibold'
                : 'dark:bg-[#21262d] bg-slate-100 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Statuses
          </button>

          <button
            onClick={() => setSelectedBriefStatus('Need Clarification')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              selectedBriefStatus === 'Need Clarification'
                ? 'bg-amber-500 text-white font-semibold'
                : 'dark:bg-[#21262d] bg-slate-100 text-amber-500'
            }`}
          >
            <AlertCircle size={12} /> Need Clarification ({needClarificationCount})
          </button>

          <button
            onClick={() => setSelectedBriefStatus('Confirmed')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              selectedBriefStatus === 'Confirmed'
                ? 'bg-emerald-500 text-white font-semibold'
                : 'dark:bg-[#21262d] bg-slate-100 text-emerald-500'
            }`}
          >
            Confirmed
          </button>

          <button
            onClick={() => setSelectedBriefStatus('Revised Brief Received')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              selectedBriefStatus === 'Revised Brief Received'
                ? 'bg-purple-500 text-white font-semibold'
                : 'dark:bg-[#21262d] bg-slate-100 text-purple-400'
            }`}
          >
            Revised Brief
          </button>

          {/* Source Filter Dropdown */}
          <div className="ml-auto">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-2.5 py-1 rounded-lg text-xs dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-slate-300 text-slate-700"
            >
              <option value="All">All Brief Sources</option>
              <option value="Direct Client">Direct Client</option>
              <option value="Business Development Team">Business Development Team</option>
              <option value="Existing Client">Existing Client</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </select>
          </div>

        </div>

      </div>

      {/* Briefs Cards Grid */}
      {filteredBriefs.length === 0 ? (
        <div className="text-center py-16 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200">
          <Briefcase className="mx-auto text-slate-400 mb-3" size={40} />
          <h3 className="text-base font-bold dark:text-white text-slate-800">No briefs match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting the search keywords or filters above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBriefs.map(brief => {
            const hasConvertedProject = !!brief.convertedProjectId;
            const convertedProject = hasConvertedProject
              ? data.projects.find(p => p.id === brief.convertedProjectId)
              : null;

            return (
              <div
                key={brief.id}
                className="flex flex-col justify-between p-5 rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-sm hover:border-[#E5252A]/50 transition-all space-y-4"
              >
                {/* Top Badges */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getTypeBadge(brief.projectType)}`}>
                      {brief.projectType}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadge(brief.briefStatus)} font-semibold`}>
                      {brief.briefStatus}
                    </span>
                  </div>

                  {/* Title & Client */}
                  <div>
                    <h3 className="text-sm font-bold dark:text-white text-slate-900 leading-snug">
                      {brief.projectTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{brief.clientName}</span>
                      <span>•</span>
                      <span>{brief.eventType || 'Event Presentation'}</span>
                    </div>
                  </div>
                </div>

                {/* BD Member & Source Details */}
                <div className="p-3 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Brief Source</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{brief.projectSource}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">BD Executive</span>
                    <span className="font-semibold text-[#E5252A]">{brief.bdMemberName}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1"><Calendar size={11} /> Received: {brief.briefReceivedDate}</span>
                    {brief.eventDate && <span>Event: {brief.eventDate}</span>}
                  </div>

                  {brief.bdMemberEmail && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 border-t dark:border-[#21262d] border-slate-200 truncate">
                      <Mail size={11} /> {brief.bdMemberEmail}
                    </div>
                  )}
                </div>

                {/* Outcome Badge & Notes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Pitch Outcome</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-md border ${getOutcomeBadge(brief.outcomeStatus)}`}>
                      {brief.outcomeStatus}
                    </span>
                  </div>

                  {brief.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-50/50 dark:bg-[#1f2631]/50 p-2 rounded-lg border dark:border-[#2c3545] border-slate-200">
                      {brief.notes}
                    </p>
                  )}
                </div>

                {/* Actions & Links Footer */}
                <div className="pt-2 border-t dark:border-[#21262d] border-slate-100 flex items-center justify-between gap-2 text-xs">
                  
                  {brief.originalBriefLink ? (
                    <a
                      href={brief.originalBriefLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#E5252A] hover:underline font-semibold"
                    >
                      <ExternalLink size={13} /> Original Brief
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[11px]">No link attached</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    {/* Handover or View Project Button */}
                    {hasConvertedProject ? (
                      <div className="flex items-center gap-1 text-emerald-500 font-bold">
                        <CheckCircle size={14} />
                        <span>{convertedProject?.code || 'In Studio'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onOpenHandoverModal(brief)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all text-xs cursor-pointer shadow-sm"
                      >
                        <Sparkles size={13} />
                        <span>Handover</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Delete brief "${brief.projectTitle}"?`)) {
                          deleteBrief(brief.id);
                        }
                      }}
                      title="Delete Brief"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
