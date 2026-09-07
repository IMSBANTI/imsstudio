import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { BDBriefsView } from './components/BDBriefsView';
import { ProjectsView } from './components/ProjectsView';
import { TasksView } from './components/TasksView';
import { TimeTrackingView } from './components/TimeTrackingView';
import { TeamAdminView } from './components/TeamAdminView';
import { Toast } from './components/Toast';
import { ChangePasswordModal, AdminResetPasswordModal } from './components/ChangePasswordModal';
import {
  NewBriefModal,
  HandoverToStudioModal,
  NewProjectModal,
  NewTaskModal,
  LogTimeModal,
  NewMemberModal,
  NewDeptModal,
  NewRoleModal,
  DataSyncModal
} from './components/Modals';

function StudioApp() {
  const { activeTab, theme, currentUser } = useStudio();

  // Modal visibility states
  const [isNewBriefOpen, setIsNewBriefOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isLogTimeOpen, setIsLogTimeOpen] = useState(false);
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [isNewDeptOpen, setIsNewDeptOpen] = useState(false);
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [adminResetMember, setAdminResetMember] = useState(null);
  const [handoverBrief, setHandoverBrief] = useState(null);

  const handleOpenHandover = (brief) => {
    setHandoverBrief(brief);
  };

  // If user is not logged in, render authentication portal
  if (!currentUser) {
    return (
      <>
        <Toast />
        <LoginView />
      </>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-200 dark:bg-[#0B0F14] bg-[#F8FAFC] dark:text-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* Real-time Toast Notifications */}
      <Toast />

      {/* Top Navbar */}
      <Navbar
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenNewBrief={() => setIsNewBriefOpen(true)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenNewBrief={() => setIsNewBriefOpen(true)}
            onOpenNewProject={() => setIsNewProjectOpen(true)}
          />
        )}

        {activeTab === 'briefs' && (
          <BDBriefsView
            onOpenNewBrief={() => setIsNewBriefOpen(true)}
            onOpenHandoverModal={handleOpenHandover}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            onOpenNewProject={() => setIsNewProjectOpen(true)}
            onOpenNewTask={() => setIsNewTaskOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            onOpenNewTask={() => setIsNewTaskOpen(true)}
          />
        )}

        {activeTab === 'timetracking' && (
          <TimeTrackingView
            onOpenLogTimeModal={() => setIsLogTimeOpen(true)}
          />
        )}

        {activeTab === 'team' && (
          <TeamAdminView
            onOpenNewMember={() => setIsNewMemberOpen(true)}
            onOpenNewDept={() => setIsNewDeptOpen(true)}
            onOpenNewRole={() => setIsNewRoleOpen(true)}
            onOpenAdminResetPassword={(member) => setAdminResetMember(member)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-[#21262d] border-slate-200 py-6 text-xs text-slate-400 dark:bg-[#0d1117] bg-white transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-[#E5252A] p-0.5 bg-white flex items-center justify-center">
              <img src="/ims-logo.png" alt="IMS Studio" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold dark:text-white text-slate-800">IMS Studio</span>
            <span>• Experiential Design & Work Management</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Multi-Location Local/Network Ready
            </span>
            <span>Authenticated Session: <strong className="text-[#E5252A]">{currentUser?.name}</strong></span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <AdminResetPasswordModal
        isOpen={!!adminResetMember}
        targetMember={adminResetMember}
        onClose={() => setAdminResetMember(null)}
      />

      <NewBriefModal
        isOpen={isNewBriefOpen}
        onClose={() => setIsNewBriefOpen(false)}
      />

      <HandoverToStudioModal
        isOpen={!!handoverBrief}
        brief={handoverBrief}
        onClose={() => setHandoverBrief(null)}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />

      <LogTimeModal
        isOpen={isLogTimeOpen}
        onClose={() => setIsLogTimeOpen(false)}
      />

      <NewMemberModal
        isOpen={isNewMemberOpen}
        onClose={() => setIsNewMemberOpen(false)}
      />

      <NewDeptModal
        isOpen={isNewDeptOpen}
        onClose={() => setIsNewDeptOpen(false)}
      />

      <NewRoleModal
        isOpen={isNewRoleOpen}
        onClose={() => setIsNewRoleOpen(false)}
      />

      <DataSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <StudioApp />
    </StudioProvider>
  );
}
