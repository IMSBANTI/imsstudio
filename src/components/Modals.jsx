import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  X,
  Plus,
  Sparkles,
  Briefcase,
  FolderKanban,
  CheckSquare,
  Clock,
  UserPlus,
  Building,
  Upload,
  Download,
  RotateCcw,
  Network,
  Globe,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Banknote
} from 'lucide-react';

// --- 1. New BD Brief Modal ---
export function NewBriefModal({ isOpen, onClose }) {
  const { data, addBrief } = useStudio();
  const bdMembers = data.members.filter(m => m.departmentId === 'dept-bd');

  const [formData, setFormData] = useState({
    projectTitle: '',
    clientName: '',
    eventType: '',
    projectType: 'Submission', // Pitch | Submission | Execution
    projectSource: 'Direct Client', // Direct Client, Business Development Team, Existing Client, Referral, Other
    bdMemberId: bdMembers[0]?.id || '',
    briefReceivedDate: new Date().toISOString().slice(0, 10),
    eventDate: '',
    briefStatus: 'Received',
    outcomeStatus: 'Pitch Under Review',
    targetDepartment: 'Hybrid 2D+3D',
    notes: '',
    originalBriefLink: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const bdMember = data.members.find(m => m.id === formData.bdMemberId);
    addBrief({
      ...formData,
      bdMemberName: bdMember ? bdMember.name : 'BD Team',
      bdMemberEmail: bdMember ? bdMember.email : '',
      bdMemberContact: bdMember ? bdMember.phone : ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Ingest New BD Brief / Pitch</h2>
              <p className="text-xs text-slate-400">Track client requirements, submission type, source, and BD contact</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Brief / Presentation Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. Coca-Cola Summer Fest 3D Anamorphic"
                value={formData.projectTitle}
                onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Client / Brand Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Coca-Cola Beverages"
                value={formData.clientName}
                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Project Type *</label>
              <select
                value={formData.projectType}
                onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Pitch">Pitch (Pre-bid)</option>
                <option value="Submission">Submission (Event RFP)</option>
                <option value="Execution">Execution (Confirmed)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Project Source *</label>
              <select
                value={formData.projectSource}
                onChange={e => setFormData({ ...formData, projectSource: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Direct Client">Direct Client</option>
                <option value="Business Development Team">Business Development Team</option>
                <option value="Existing Client">Existing Client</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">BD Executive *</label>
              <select
                value={formData.bdMemberId}
                onChange={e => setFormData({ ...formData, bdMemberId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {bdMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.roleTitle})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Brief Received Date</label>
              <input
                type="date"
                value={formData.briefReceivedDate}
                onChange={e => setFormData({ ...formData, briefReceivedDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Event / Delivery Date</label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Brief Status</label>
              <select
                value={formData.briefStatus}
                onChange={e => setFormData({ ...formData, briefStatus: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Received">Received</option>
                <option value="Need Clarification">Need Clarification</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Revised Brief Received">Revised Brief Received</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Original Brief Link / Cloud URL</label>
            <input
              type="url"
              placeholder="https://drive.google.com/... or Figma link"
              value={formData.originalBriefLink}
              onChange={e => setFormData({ ...formData, originalBriefLink: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Notes & Instructions from BD Team</label>
            <textarea
              rows={3}
              placeholder="Provide event overview, screen requirements, pitch focus, or questions for client..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Save BD Brief
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// --- 2. Handover to Studio Modal ---
export function HandoverToStudioModal({ isOpen, onClose, brief }) {
  const { data, handoverBrief } = useStudio();

  const [formData, setFormData] = useState({
    title: brief?.projectTitle || '',
    department: brief?.targetDepartment || 'Hybrid 2D+3D',
    screenSpecs: '11520 x 2160 (Curved Main LED)',
    mediaServerFormat: 'ProRes 4444 / Disguise D3',
    frameRate: '60 fps',
    budgetHours: 120,
    budgetAmountBDT: 240000,
    leadVisualizerId: data.members[0]?.id || '',
    priority: 'High',
    venue: 'Main Event Convention Center',
    eventDate: brief?.eventDate || new Date().toISOString().slice(0, 10),
    loadInDate: brief?.eventDate || new Date().toISOString().slice(0, 10),
    description: brief?.notes || ''
  });

  React.useEffect(() => {
    if (brief) {
      setFormData(prev => ({
        ...prev,
        title: brief.projectTitle || prev.title,
        department: brief.targetDepartment || prev.department,
        eventDate: brief.eventDate || prev.eventDate,
        loadInDate: brief.eventDate || prev.loadInDate,
        description: brief.notes || prev.description || ''
      }));
    }
  }, [brief]);

  if (!isOpen || !brief) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handoverBrief(brief.id, {
      ...formData,
      screenSpecs: formData.screenSpecs || 'Standard LED Wall',
      mediaServerFormat: formData.mediaServerFormat || 'ProRes 4444',
      frameRate: formData.frameRate || '60 fps'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Handover Pitch to Studio Production</h2>
              <p className="text-xs text-slate-400">Transform this won BD brief into an active 2D/3D studio project</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Studio Project Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Studio Department *</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="2D Team">2D Team</option>
                <option value="3D Team">3D Team</option>
                <option value="Hybrid 2D+3D">Hybrid 2D+3D</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Lead Visualizer</label>
              <select
                value={formData.leadVisualizerId}
                onChange={e => setFormData({ ...formData, leadVisualizerId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {getProductionVisualizers(data.members, data.departments).map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.roleTitle})</option>
              ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Budgeted Hours</label>
              <input
                type="number"
                value={formData.budgetHours}
                onChange={e => setFormData({ ...formData, budgetHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Contract Value (BDT ৳)</label>
              <input
                type="number"
                step="10000"
                value={formData.budgetAmountBDT}
                onChange={e => setFormData({ ...formData, budgetAmountBDT: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Project Details</label>
            <textarea
              rows={4}
              placeholder="Enter comprehensive project details, creative directives, stage setup notes, or deliverables..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 resize-none leading-relaxed"
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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Launch in Studio
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Helper to filter only 2D and 3D production team members who execute studio tasks (excludes BD and Executive Directors)
export const getProductionVisualizers = (members = [], departments = []) => {
  return members.filter(m => {
    if (m.roleType === 'admin' || m.roleType === 'bd') return false;
    const dept = departments.find(d => d.id === m.departmentId);
    const deptName = (m.departmentName || dept?.name || '').toLowerCase();
    const deptCode = (dept?.code || '').toLowerCase();
    const deptId = (m.departmentId || '').toLowerCase();
    return deptId === 'dept-2d' || deptId === 'dept-3d' || /2d|3d/.test(deptName) || /2d|3d/.test(deptCode);
  });
};

// --- 3. New Studio Project Modal ---
export function NewProjectModal({ isOpen, onClose }) {
  const { data, addProject } = useStudio();
  const productionMembers = getProductionVisualizers(data.members, data.departments);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    department: '3D Team',
    status: 'Ongoing',
    priority: 'High',
    venue: '',
    eventDate: new Date().toISOString().slice(0, 10),
    loadInDate: new Date().toISOString().slice(0, 10),
    screenSpecs: '7680 x 1080 Ultra-wide LED',
    frameRate: '60 fps',
    mediaServerFormat: 'ProRes 4444',
    budgetHours: 100,
    budgetAmountBDT: 200000,
    leadVisualizerId: productionMembers[0]?.id || data.members[0]?.id || '',
    description: ''
  });
  const [assignedMemberIds, setAssignedMemberIds] = useState([]);

  if (!isOpen) return null;

  const toggleMember = (id) => {
    setAssignedMemberIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject({
      ...formData,
      assignedMemberIds,
      screenSpecs: formData.screenSpecs || 'Standard LED Wall'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <FolderKanban size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Create New Studio Project</h2>
              <p className="text-xs text-slate-400">Configure experiential project specifications and visualizer allocation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Project Title *</label>
              <input
                required
                type="text"
                placeholder="e.g. Banglalink Digital Expo - 360 Tunnel"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Client Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Banglalink"
                value={formData.client}
                onChange={e => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Target Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="3D Team">3D Team</option>
                <option value="2D Team">2D Team</option>
                <option value="Hybrid 2D+3D">Hybrid 2D+3D</option>
                <option value="Interactive Tech">Interactive Tech</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Revision">Revision</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Budgeted Hours</label>
              <input
                type="number"
                value={formData.budgetHours}
                onChange={e => setFormData({ ...formData, budgetHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Contract Value (BDT ৳)</label>
              <input
                type="number"
                step="10000"
                value={formData.budgetAmountBDT}
                onChange={e => setFormData({ ...formData, budgetAmountBDT: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Multi-member assignment for the Project */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-600 dark:text-slate-300">
                Assigned Team Members ({assignedMemberIds.length} selected)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAssignedMemberIds(productionMembers.map(m => m.id))}
                  className="text-[10px] text-[#E5252A] hover:underline font-bold cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-400 text-[10px]">•</span>
                <button
                  type="button"
                  onClick={() => setAssignedMemberIds([])}
                  className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200">
              {productionMembers.map(m => {
                const isSelected = assignedMemberIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                      isSelected
                        ? 'border-[#E5252A] bg-[#E5252A]/10 text-slate-900 dark:text-white shadow-xs'
                        : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-[#161b22] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-5 h-5 rounded-full object-cover border flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold truncate">{m.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{m.departmentName || m.roleTitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Project Details</label>
            <textarea
              rows={3}
              placeholder="Enter comprehensive project details, creative directives, or deliverables..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t dark:border-[#21262d] border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 3.5 Edit Project Modal ---
export function EditProjectModal({ isOpen, onClose, project }) {
  const { data, updateProject } = useStudio();
  const productionMembers = getProductionVisualizers(data.members, data.departments);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    department: '3D Team',
    status: 'Ongoing',
    priority: 'High',
    venue: '',
    eventDate: '',
    budgetHours: 100,
    budgetAmountBDT: 200000,
    description: '',
    screenSpecs: ''
  });
  const [assignedMemberIds, setAssignedMemberIds] = useState([]);

  React.useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        client: project.client || '',
        department: project.department || '3D Team',
        status: project.status || 'Ongoing',
        priority: project.priority || 'High',
        venue: project.venue || '',
        eventDate: project.eventDate || '',
        budgetHours: project.budgetHours || 0,
        budgetAmountBDT: project.budgetAmountBDT || 0,
        description: project.description || '',
        screenSpecs: project.screenSpecs || ''
      });
      const taskAssigneeIds = data.tasks.filter(t => t.projectId === project.id && t.assigneeId).map(t => t.assigneeId);
      const combined = Array.from(new Set([...(project.assignedMemberIds || []), ...taskAssigneeIds]));
      setAssignedMemberIds(combined);
    }
  }, [project, data.tasks]);

  if (!isOpen || !project) return null;

  const toggleMember = (id) => {
    setAssignedMemberIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProject(project.id, {
      ...formData,
      assignedMemberIds
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Edit2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Edit Project & Team Allocation</h2>
              <p className="text-xs text-slate-400">{project.code}: Update project deliverables, budget, and assigned team members</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Project Title *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Client Name *</label>
              <input
                required
                type="text"
                value={formData.client}
                onChange={e => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Target Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="3D Team">3D Team</option>
                <option value="2D Team">2D Team</option>
                <option value="Hybrid 2D+3D">Hybrid 2D+3D</option>
                <option value="Interactive Tech">Interactive Tech</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Revision">Revision</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Budgeted Hours</label>
              <input
                type="number"
                value={formData.budgetHours}
                onChange={e => setFormData({ ...formData, budgetHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Contract Value (BDT ৳)</label>
              <input
                type="number"
                step="10000"
                value={formData.budgetAmountBDT}
                onChange={e => setFormData({ ...formData, budgetAmountBDT: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Multi-member assignment for the Project */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-600 dark:text-slate-300">
                Assigned Team Members ({assignedMemberIds.length} selected)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAssignedMemberIds(productionMembers.map(m => m.id))}
                  className="text-[10px] text-[#E5252A] hover:underline font-bold cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-400 text-[10px]">•</span>
                <button
                  type="button"
                  onClick={() => setAssignedMemberIds([])}
                  className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200">
              {productionMembers.map(m => {
                const isSelected = assignedMemberIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                      isSelected
                        ? 'border-[#E5252A] bg-[#E5252A]/10 text-slate-900 dark:text-white shadow-xs'
                        : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-[#161b22] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-5 h-5 rounded-full object-cover border flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold truncate">{m.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{m.departmentName || m.roleTitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Project Details</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t dark:border-[#21262d] border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 4. New Task Modal ---
// --- 4. Assign New Task Modal ---
export function NewTaskModal({ isOpen, onClose }) {
  const { data, addTask } = useStudio();

  const firstProj = data.projects[0];
  const [formData, setFormData] = useState({
    title: '',
    projectId: firstProj?.id || '',
    status: 'Pending',
    priority: 'High',
    dueDate: new Date().toISOString().slice(0, 10),
    estimatedHours: 20,
    screenSpecs: firstProj?.screenSpecs || '7680 x 1080 Ultra-wide LED',
    deliverableSpec: firstProj?.screenSpecs || '7680 x 1080 Ultra-wide LED',
    description: '',
    revisionNotes: ''
  });

  const availableVisualizers = getProductionVisualizers(data.members, data.departments);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState([]);

  React.useEffect(() => {
    if (isOpen && availableVisualizers.length > 0 && selectedAssigneeIds.length === 0) {
      setSelectedAssigneeIds([availableVisualizers[0].id]);
    }
  }, [isOpen, availableVisualizers]);

  React.useEffect(() => {
    if (isOpen && data.projects.length > 0) {
      const validProject = data.projects.find(p => p.id === formData.projectId) || data.projects[0];
      setFormData(prev => ({
        ...prev,
        projectId: validProject.id,
        screenSpecs: prev.screenSpecs || validProject.screenSpecs || '7680 x 1080 Ultra-wide LED',
        deliverableSpec: prev.deliverableSpec || validProject.screenSpecs || '7680 x 1080 Ultra-wide LED'
      }));
    }
  }, [isOpen, data.projects]);

  if (!isOpen) return null;

  const toggleAssignee = (id) => {
    setSelectedAssigneeIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter(mId => mId !== id);
      }
      return [...prev, id];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetProjId = formData.projectId || data.projects[0]?.id || '';
    const proj = data.projects.find(p => p.id === targetProjId);
    const resolvedSpecs = formData.screenSpecs || formData.deliverableSpec || proj?.screenSpecs || '7680 x 1080 Ultra-wide LED';

    const assignees = selectedAssigneeIds.length > 0
      ? selectedAssigneeIds
      : [availableVisualizers[0]?.id || data.members[0]?.id || ''];

    assignees.forEach(assigneeId => {
      const member = data.members.find(m => m.id === assigneeId);
      addTask({
        ...formData,
        projectId: targetProjId,
        screenSpecs: resolvedSpecs,
        deliverableSpec: resolvedSpecs,
        description: formData.description || '',
        projectTitle: proj ? proj.title : 'Studio Project',
        assigneeId: assigneeId,
        assigneeName: member ? member.name : 'Artist',
        assigneeRole: member ? member.roleTitle : 'Visualizer',
        departmentId: member ? member.departmentId : 'dept-3d'
      });
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <CheckSquare size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Assign Studio Task</h2>
              <p className="text-xs text-slate-400">Allocate visualizer(s), specify canvas specs, and outline task details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Task Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. 3D Holographic Product Reveal Loop"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Studio Project *</label>
            <select
              required
              value={formData.projectId || data.projects[0]?.id || ''}
              onChange={e => {
                const newProjId = e.target.value;
                const p = data.projects.find(proj => proj.id === newProjId);
                setFormData(prev => ({
                  ...prev,
                  projectId: newProjId,
                  screenSpecs: p?.screenSpecs || prev.screenSpecs,
                  deliverableSpec: p?.screenSpecs || prev.deliverableSpec
                }));
              }}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            >
              {data.projects.map(p => (
                <option key={p.id} value={p.id}>{p.code}: {p.title}</option>
              ))}
            </select>
          </div>

          {/* Multi-Visualizer Assignment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-600 dark:text-slate-300">
                Assign Visualizer(s) *
              </label>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="font-bold text-slate-400">
                  {selectedAssigneeIds.length} visualizer{selectedAssigneeIds.length === 1 ? '' : 's'} selected
                </span>
                <span className="text-slate-400">•</span>
                <button
                  type="button"
                  onClick={() => setSelectedAssigneeIds(availableVisualizers.map(m => m.id))}
                  className="text-[#E5252A] hover:underline font-bold cursor-pointer"
                >
                  Select All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200">
              {availableVisualizers.map(m => {
                const isChecked = selectedAssigneeIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleAssignee(m.id)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'border-[#E5252A] bg-[#E5252A]/10 text-slate-900 dark:text-white shadow-xs'
                        : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-[#161b22] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-[#E5252A] rounded cursor-pointer"
                    />
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-5 h-5 rounded-full object-cover border flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold truncate">{m.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{m.departmentName || m.roleTitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedAssigneeIds.length > 1 && (
              <p className="text-[10px] text-emerald-500 font-medium">
                ✓ Distributes this task to {selectedAssigneeIds.length} visualizers. Each receives their own trackable card.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Revision">Revision</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>
          </div>

          {/* Task Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Task Description</label>
            <textarea
              rows={3}
              placeholder="Describe the task details, visualizer notes, creative references, and execution requirements..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 resize-none leading-relaxed"
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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              {selectedAssigneeIds.length > 1 ? `Distribute to ${selectedAssigneeIds.length} Visualizers` : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Edit Task Modal ---
export function EditTaskModal({ isOpen, onClose, task }) {
  const { data, updateTask } = useStudio();

  const [formData, setFormData] = useState({
    title: '',
    projectId: '',
    assigneeId: '',
    status: 'Pending',
    priority: 'High',
    dueDate: '',
    screenSpecs: '',
    deliverableSpec: '',
    description: '',
    revisionNotes: ''
  });

  React.useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        projectId: task.projectId || data.projects[0]?.id || '',
        assigneeId: task.assigneeId || data.members[0]?.id || '',
        status: task.status || 'Pending',
        priority: task.priority || 'High',
        dueDate: task.dueDate || new Date().toISOString().slice(0, 10),
        screenSpecs: task.screenSpecs || task.deliverableSpec || '7680 x 1080 Ultra-wide LED',
        deliverableSpec: task.screenSpecs || task.deliverableSpec || '7680 x 1080 Ultra-wide LED',
        description: task.description || '',
        revisionNotes: task.revisionNotes || ''
      });
    }
  }, [task, data.projects, data.members, isOpen]);

  if (!isOpen || !task) return null;

  const selectedProj = data.projects.find(p => p.id === formData.projectId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const proj = data.projects.find(p => p.id === formData.projectId);
    const member = data.members.find(m => m.id === formData.assigneeId);
    const resolvedSpecs = formData.screenSpecs || formData.deliverableSpec || proj?.screenSpecs || '7680 x 1080 Ultra-wide LED';
    updateTask(task.id, {
      ...formData,
      screenSpecs: resolvedSpecs,
      deliverableSpec: resolvedSpecs,
      description: formData.description || '',
      projectTitle: proj ? proj.title : task.projectTitle,
      assigneeName: member ? member.name : task.assigneeName,
      assigneeRole: member ? member.roleTitle : task.assigneeRole,
      departmentId: member ? member.departmentId : task.departmentId
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <CheckSquare size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Edit Task</h2>
              <p className="text-xs text-slate-400">Update task details, instructions, and canvas resolution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Task Title *</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Studio Project *</label>
              <select
                value={formData.projectId}
                onChange={e => {
                  const newProjId = e.target.value;
                  const p = data.projects.find(proj => proj.id === newProjId);
                  setFormData(prev => ({
                    ...prev,
                    projectId: newProjId,
                    screenSpecs: p?.screenSpecs || prev.screenSpecs,
                    deliverableSpec: p?.screenSpecs || prev.deliverableSpec
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {data.projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code}: {p.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Assignee (Visualizer) *</label>
              <select
                value={formData.assigneeId}
                onChange={e => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {getProductionVisualizers(data.members, data.departments).map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.departmentName || m.roleTitle})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Revision">Revision</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>
          </div>

          {/* Task Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Task Description</label>
            <textarea
              rows={3}
              placeholder="Describe the task details, visualizer notes, creative references, and execution requirements..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 resize-none leading-relaxed"
            />
          </div>

          {formData.status === 'Revision' && (
            <div className="space-y-1">
              <label className="font-bold text-amber-500">Revision Feedback Notes</label>
              <textarea
                rows={2}
                placeholder="What changes or revisions does the client need on this deliverable?"
                value={formData.revisionNotes}
                onChange={e => setFormData({ ...formData, revisionNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-amber-500/5 border border-amber-500/30 text-amber-300 text-xs resize-none"
              />
            </div>
          )}

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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 5. Manual Log Time Modal ---
export function LogTimeModal({ isOpen, onClose }) {
  const { data, addTimeLog, currentUser } = useStudio();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    memberId: currentUser?.id || data?.members?.[0]?.id || '',
    projectId: data?.projects?.[0]?.id || '',
    taskId: data?.tasks?.[0]?.id || '',
    hours: 4.0,
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const proj = data.projects.find(p => p.id === formData.projectId);
    const task = data.tasks.find(t => t.id === formData.taskId);
    const member = data.members.find(m => m.id === formData.memberId);

    addTimeLog({
      ...formData,
      hours: parseFloat(formData.hours),
      projectTitle: proj ? proj.title : 'General Studio',
      taskTitle: task ? task.title : 'Production',
      memberName: member ? member.name : (currentUser?.name || 'Artist'),
      departmentName: member ? member.departmentName : 'Studio'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Manual Time Log Entry</h2>
              <p className="text-xs text-slate-400">Record billable hours for project and visualizer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Hours Logged *</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                required
                value={formData.hours}
                onChange={e => setFormData({ ...formData, hours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Team Member *</label>
            <select
              value={formData.memberId}
              onChange={e => setFormData({ ...formData, memberId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            >
              {data.members.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.departmentName})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Project *</label>
            <select
              value={formData.projectId}
              onChange={e => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            >
              {data.projects.map(p => (
                <option key={p.id} value={p.id}>{p.code}: {p.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Work Notes / Deliverables</label>
            <textarea
              rows={2}
              placeholder="e.g. Completed color pass and light simulation..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Log Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 6. New Member Modal ---
export function NewMemberModal({ isOpen, onClose }) {
  const { data, addMember } = useStudio();

  const inferRoleType = (roleTitle, roleId, deptId) => {
    const t = (roleTitle || '').toLowerCase();
    const r = (roleId || '').toLowerCase();
    const d = (deptId || '').toLowerCase();
    if (/admin|director/i.test(t)) return 'admin';
    if (/manager|lead.*studio|lead.*3d|lead.*2d/i.test(t) || /manager|mgr/i.test(r)) return 'manager';
    if (/bd|business/i.test(t) || /bd/i.test(d)) return 'bd';
    return 'visualizer';
  };

  const firstRole = data.roles[0];
  const initialRoleType = inferRoleType(firstRole?.title, firstRole?.id, data.departments[0]?.id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: data.departments[0]?.id || 'dept-2d',
    roleId: firstRole?.id || '',
    roleType: initialRoleType,
    hourlyRateBDT: firstRole?.hourlyRateBDT || 1500,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const dept = data.departments.find(d => d.id === formData.departmentId);
    const role = data.roles.find(r => r.id === formData.roleId);
    const finalRoleType = formData.roleType || inferRoleType(role?.title, formData.roleId, formData.departmentId);
    addMember({
      ...formData,
      roleType: finalRoleType,
      departmentName: dept ? dept.name : 'Studio',
      roleTitle: role ? role.title : 'Visualizer',
      hourlyRateBDT: Number(formData.hourlyRateBDT) || role?.hourlyRateBDT || 1500
    });
    onClose();
  };

  const availableRoles = data.roles.filter(r => r.departmentId === formData.departmentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Add Team Member</h2>
              <p className="text-xs text-slate-400">Add new artist, manager, or executive anytime</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Full Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Mahir Faysal"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Department *</label>
              <select
                value={formData.departmentId}
                onChange={e => {
                  const newDeptId = e.target.value;
                  const matchingRoles = data.roles.filter(r => r.departmentId === newDeptId);
                  const firstMatching = matchingRoles[0];
                  setFormData({
                    ...formData,
                    departmentId: newDeptId,
                    roleId: firstMatching ? firstMatching.id : '',
                    roleType: inferRoleType(firstMatching?.title, firstMatching?.id, newDeptId),
                    hourlyRateBDT: firstMatching?.hourlyRateBDT || formData.hourlyRateBDT
                  });
                }}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {data.departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Role Designation *</label>
              <select
                value={formData.roleId}
                onChange={e => {
                  const roleId = e.target.value;
                  const role = data.roles.find(r => r.id === roleId);
                  setFormData({
                    ...formData,
                    roleId,
                    roleType: inferRoleType(role?.title, roleId, formData.departmentId),
                    hourlyRateBDT: role?.hourlyRateBDT || formData.hourlyRateBDT
                  });
                }}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {availableRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Privilege & System Role *</label>
            <select
              value={formData.roleType}
              onChange={e => setFormData({ ...formData, roleType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-medium"
            >
              <option value="manager">Studio Manager (Can create projects, assign tasks, review deliverables)</option>
              <option value="visualizer">Artist / Visualizer (Assigned tasks, logs hours)</option>
              <option value="bd">Business Development (Client briefs & handovers)</option>
              <option value="admin">Studio Director / Admin (Full admin privileges)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Hourly Billable Rate (BDT ৳/hr) *</span>
              <span className="text-[10px] text-emerald-500 font-mono">Calculates Work Value</span>
            </label>
            <input
              required
              type="number"
              step="100"
              placeholder="1500"
              value={formData.hourlyRateBDT}
              onChange={e => setFormData({ ...formData, hourlyRateBDT: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Email Address *</label>
            <input
              required
              type="email"
              placeholder="e.g. mahir@ims-studio.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Phone Contact</label>
            <input
              type="text"
              placeholder="+880 17..."
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 7. New Department Modal ---
export function NewDeptModal({ isOpen, onClose }) {
  const { addDepartment } = useStudio();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#10B981');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addDepartment({
      name,
      code: code || name.slice(0, 3).toUpperCase(),
      description,
      color
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <Building size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Create New Department</h2>
              <p className="text-xs text-slate-400">e.g. Creative Tech, Virtual Production, Motion Design</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Department Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Unreal & Virtual Production"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Code / Abbreviation</label>
              <input
                type="text"
                placeholder="e.g. VP"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 uppercase font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Theme Color</label>
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full h-9 rounded-xl border dark:border-[#30363d] border-slate-200 p-1 cursor-pointer bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Description</label>
            <textarea
              rows={2}
              placeholder="Describe department scope and creative outputs..."
              value={description}
              onChange={e => setDescription(e.target.value)}
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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Create Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 8. New Role Modal ---
export function NewRoleModal({ isOpen, onClose }) {
  const { data, addRole } = useStudio();
  const [departmentId, setDepartmentId] = useState(data.departments[0]?.id || '');
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('Senior');
  const [hourlyRateBDT, setHourlyRateBDT] = useState(1800);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addRole({ departmentId, title, level, hourlyRateBDT: Number(hourlyRateBDT) || 1800 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Add Custom Studio Role</h2>
              <p className="text-xs text-slate-400">Add designation to 2D, 3D or custom team</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Department *</label>
            <select
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            >
              {data.departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Role Title *</label>
            <input
              required
              type="text"
              placeholder="e.g. Lead Technical Animator"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Seniority Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            >
              <option value="Senior Management">Senior Management</option>
              <option value="Management">Management</option>
              <option value="Lead">Lead</option>
              <option value="Senior">Senior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Junior / Associate">Junior / Associate</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Standard Hourly Rate (BDT ৳/hr) *</span>
              <span className="text-[10px] text-emerald-500 font-mono">Billable Valuation</span>
            </label>
            <input
              required
              type="number"
              step="100"
              placeholder="1800"
              value={hourlyRateBDT}
              onChange={e => setHourlyRateBDT(Number(e.target.value))}
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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Add Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 9. Multi-Location Database Sync & Backup Modal ---
export function DataSyncModal({ isOpen, onClose }) {
  const { data, resetAllData, importData, clearSampleMembers, clearAllSampleData, clearSampleWork, isAdmin } = useStudio();
  const [importStatus, setImportStatus] = useState('');

  if (!isOpen) return null;

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
          setTimeout(() => setImportStatus(''), 3000);
        } else {
          setImportStatus('Invalid JSON database format.');
        }
      } catch (err) {
        setImportStatus('Error reading file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#E5252A]/10 text-[#E5252A]">
              <Network size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Multi-Location Access & Cloud Sync</h2>
              <p className="text-xs text-slate-400">Database backup, snapshot restore, and multi-user network sharing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Multi-Location Web Access Card */}
          <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold dark:text-white text-slate-900">
              <Globe size={16} className="text-[#E5252A]" />
              <span>Multi-Location Web Access (Local Network & Cloud)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              IMS Studio runs on a distributed web server architecture. Any visualizer, manager, or BD executive across your studio offices can connect directly:
            </p>
            <div className="p-2.5 rounded-lg dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 font-mono text-[11px] text-[#E5252A] flex items-center justify-between">
              <span>http://[YOUR-STUDIO-IP]:5173</span>
              <span className="text-emerald-500 text-[10px] font-sans font-bold">● Multi-Device Web Ready</span>
            </div>
          </div>

          {/* Backup & Restore Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Export Snapshot */}
            <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                  <Download size={15} className="text-[#E5252A]" />
                  <span>Export Studio Database</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Download a complete backup snapshot of all projects, briefs, tasks, and timesheets.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="w-full py-2 px-3 rounded-lg bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all text-xs cursor-pointer shadow-sm"
              >
                Download Snapshot (.json)
              </button>
            </div>

            {/* Import Snapshot */}
            <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                  <Upload size={15} className="text-blue-500" />
                  <span>Restore Database Snapshot</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload a previously exported JSON backup file to sync state from another location.
                </p>
              </div>
              <label className="w-full py-2 px-3 rounded-lg dark:bg-[#21262d] bg-white border dark:border-[#30363d] border-slate-300 text-center font-bold text-slate-700 dark:text-slate-200 text-xs cursor-pointer hover:border-[#E5252A] transition-all">
                Select Backup File
                <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
              </label>
            </div>

          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle size={16} /> {importStatus}
            </div>
          )}

          {/* Production Slate & Sample Data Removal */}
          {isAdmin && (
            <div className="p-4 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#21262d] border-slate-200 space-y-3">
              <div>
                <div className="font-bold text-xs dark:text-white text-slate-800">
                  Sample / Demo Data Management
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Clear out pre-seeded demo records to run your studio in clean production mode.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Clear all sample briefs, projects, tasks, and timesheets? Your team roster and custom members will be preserved.')) {
                      clearSampleWork();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  Clear Sample Work (Keep Team)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Remove all pre-seeded demo team members? Your Admin account and custom members will be preserved.')) {
                      clearSampleMembers();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  Clear Demo Members Only
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Clear ALL sample briefs, projects, tasks, timelogs and demo members? This starts a 100% clean production studio workspace (Admin preserved).')) {
                      clearAllSampleData();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Start Fresh (Clear All Demo Data)
                </button>
              </div>
            </div>
          )}

          {/* Reset to Seed Data */}
          <div className="pt-2 border-t dark:border-[#21262d] border-slate-100 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Need to reset back to demo studio seed?</span>
            <button
              onClick={() => {
                if (confirm('Reset studio database to initial experiential seed records?')) {
                  resetAllData();
                  onClose();
                }
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Reset to Demo Records
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- 10. Edit Role Modal (Hierarchy & Pricing) ---
export function EditRoleModal({ isOpen, onClose, role }) {
  const { data, updateRole, deleteRole, isAdmin } = useStudio();
  const [departmentId, setDepartmentId] = useState('');
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('Senior');
  const [hourlyRateBDT, setHourlyRateBDT] = useState(1800);

  React.useEffect(() => {
    if (role) {
      setDepartmentId(role.departmentId || data.departments[0]?.id || '');
      setTitle(role.title || '');
      setLevel(role.level || 'Senior');
      setHourlyRateBDT(role.hourlyRateBDT || 1800);
    }
  }, [role, data.departments]);

  if (!isOpen || !role) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRole(role.id, {
      departmentId,
      title,
      level,
      hourlyRateBDT: Number(hourlyRateBDT) || 1500
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the role "${role.title}"?`)) {
      deleteRole(role.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Edit2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">Edit Role & Pricing</h2>
              <p className="text-xs text-slate-400">Update standard hourly billing rate & hierarchy level</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Department *</label>
            <select
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            >
              {data.departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Role Title *</label>
            <input
              required
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Seniority Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            >
              <option value="Senior Management">Senior Management</option>
              <option value="Management">Management</option>
              <option value="Lead">Lead</option>
              <option value="Senior">Senior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Junior / Associate">Junior / Associate</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Standard Hourly Rate (BDT ৳/hr) *</span>
              <span className="text-[11px] text-emerald-500 font-mono font-bold">
                ৳{Number(hourlyRateBDT || 0).toLocaleString('en-US')}/hr
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-slate-400">৳</span>
              <input
                required
                type="number"
                step="100"
                min="0"
                value={hourlyRateBDT}
                onChange={e => setHourlyRateBDT(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              New team members assigned to this role will default to this standard hourly billable rate.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t dark:border-[#21262d] border-slate-100">
            {isAdmin ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={13} /> Delete Role
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- 11. Edit Team Member Modal (Profile, Capacity & Pricing) ---
export function EditMemberModal({ isOpen, onClose, member }) {
  const { data, updateMember } = useStudio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    departmentName: '',
    roleId: '',
    roleTitle: '',
    roleType: 'visualizer',
    hourlyRateBDT: 1500,
    weeklyCapacityHours: 40
  });

  React.useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        departmentId: member.departmentId || data.departments[0]?.id || '',
        departmentName: member.departmentName || '',
        roleId: member.roleId || '',
        roleTitle: member.roleTitle || '',
        roleType: member.roleType || 'visualizer',
        hourlyRateBDT: member.hourlyRateBDT || 1500,
        weeklyCapacityHours: member.weeklyCapacityHours || 40
      });
    }
  }, [member, data.departments]);

  if (!isOpen || !member) return null;

  const availableRoles = data.roles.filter(r => r.departmentId === formData.departmentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMember(member.id, {
      ...formData,
      hourlyRateBDT: Number(formData.hourlyRateBDT) || 1500,
      weeklyCapacityHours: Number(formData.weeklyCapacityHours) || 40
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b dark:border-[#21262d] border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Edit2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold dark:text-white text-slate-900">
                Edit Team Member & Valuation
              </h2>
              <p className="text-xs text-slate-400">Update artist pricing, role assignment & weekly capacity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Full Name *</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Department *</label>
              <select
                value={formData.departmentId}
                onChange={e => {
                  const dept = data.departments.find(d => d.id === e.target.value);
                  const firstRole = data.roles.find(r => r.departmentId === e.target.value);
                  setFormData({
                    ...formData,
                    departmentId: e.target.value,
                    departmentName: dept ? dept.name : '',
                    roleId: firstRole?.id || '',
                    roleTitle: firstRole?.title || '',
                    hourlyRateBDT: firstRole?.hourlyRateBDT || formData.hourlyRateBDT
                  });
                }}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {data.departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Role Designation</label>
              <select
                value={formData.roleId}
                onChange={e => {
                  const roleObj = data.roles.find(r => r.id === e.target.value);
                  setFormData({
                    ...formData,
                    roleId: e.target.value,
                    roleTitle: roleObj ? roleObj.title : formData.roleTitle,
                    hourlyRateBDT: roleObj?.hourlyRateBDT || formData.hourlyRateBDT
                  });
                }}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                {availableRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Billable Rate Highlight Box */}
          <div className="p-3.5 rounded-xl dark:bg-[#0d1117] bg-emerald-50/50 border dark:border-[#30363d] border-emerald-200 space-y-2">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Banknote size={15} /> Individual Billable Hourly Rate (BDT ৳/hr) *
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ৳{Number(formData.hourlyRateBDT || 0).toLocaleString('en-US')}/hr
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-400">৳</span>
                <input
                  required
                  type="number"
                  step="100"
                  min="0"
                  value={formData.hourlyRateBDT}
                  onChange={e => setFormData({ ...formData, hourlyRateBDT: Number(e.target.value) })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl dark:bg-[#161b22] bg-white border dark:border-[#30363d] border-slate-300 dark:text-white text-slate-900 font-mono font-bold"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              💡 <strong>Productivity Valuation:</strong> When this member logs time, this individual rate calculates the exact monetary value (৳) of work completed across projects and displays on their productivity card.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Weekly Capacity (Hours)</label>
              <input
                type="number"
                min="1"
                max="80"
                value={formData.weeklyCapacityHours}
                onChange={e => setFormData({ ...formData, weeklyCapacityHours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 dark:text-slate-300">Role Privilege Level</label>
              <select
                value={formData.roleType}
                onChange={e => setFormData({ ...formData, roleType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
              >
                <option value="visualizer">Artist / Visualizer</option>
                <option value="manager">Studio Manager</option>
                <option value="bd">Business Development</option>
                <option value="admin">Studio Director / Admin</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Email Address *</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl dark:bg-[#0d1117] bg-slate-50 border dark:border-[#30363d] border-slate-200 dark:text-white text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-600 dark:text-slate-300">Phone Contact</label>
            <input
              type="text"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
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
              className="px-5 py-2 rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white font-bold transition-all shadow-md shadow-red-900/20 cursor-pointer"
            >
              Save Member & Rates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

