import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/common/AuthModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Student Views
import { Dashboard } from './components/student/Dashboard';
import { CareerSelection } from './components/student/CareerSelection';
import { RoadmapView } from './components/student/RoadmapView';
import { StudyMaterials } from './components/student/StudyMaterials';
import { TodaysPlan } from './components/student/TodaysPlan';
import { StudyTimer } from './components/student/StudyTimer';
import { QuizSystem } from './components/student/QuizSystem';
import { ProjectTracker } from './components/student/ProjectTracker';
import { CareerReadinessModal } from './components/student/CareerReadinessModal';
import { AICareerAssistant } from './components/student/AICareerAssistant';
import { AIToolsDirectory } from './components/student/AIToolsDirectory';
import { AchievementsView } from './components/student/AchievementsView';
import { AnalyticsView } from './components/student/AnalyticsView';
import { ProfileView } from './components/student/ProfileView';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminContentManager } from './components/admin/AdminContentManager';
import { AdminStudentsList } from './components/admin/AdminStudentsList';

const AppContent: React.FC = () => {
  const { user, role, isLoading } = useAuth();

  // Landing page auth modal triggers
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'student-login' | 'student-register' | 'admin-login'>('student-login');

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Admin content manager default modal trigger
  const [adminModalType, setAdminModalType] = useState<string | null>(null);

  // Initial loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-xl animate-pulse mb-3">
          C
        </div>
        <p className="text-xs">Initializing CareerPath...</p>
      </div>
    );
  }

  // If unauthenticated, show public high-converting Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenStudentLogin={() => {
            setAuthModalMode('student-login');
            setAuthModalOpen(true);
          }}
          onOpenStudentRegister={() => {
            setAuthModalMode('student-register');
            setAuthModalOpen(true);
          }}
          onOpenAdminLogin={() => {
            setAuthModalMode('admin-login');
            setAuthModalOpen(true);
          }}
        />

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={newRole => {
            if (newRole === 'admin') {
              setCurrentTab('admin-dashboard');
            } else {
              setCurrentTab('dashboard');
            }
          }}
        />
      </>
    );
  }

  // Active Tab View Renderer
  const renderTabContent = () => {
    // Admin exclusive tabs
    if (role === 'admin') {
      if (currentTab === 'admin-dashboard') {
        return (
          <AdminDashboard
            onNavigateTab={tab => setCurrentTab(tab)}
            onOpenCreateModal={type => {
              setAdminModalType(type);
              setCurrentTab('admin-content');
            }}
          />
        );
      }
      if (currentTab === 'admin-content') {
        return (
          <AdminContentManager
            defaultModalType={adminModalType}
            onClearDefaultModal={() => setAdminModalType(null)}
          />
        );
      }
      if (currentTab === 'admin-students') {
        return <AdminStudentsList />;
      }
    }

    // Student tabs (also previewable by Admin)
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onNavigate={tab => setCurrentTab(tab)} />;
      case 'careers':
        return <CareerSelection onSuccess={() => setCurrentTab('roadmap')} />;
      case 'roadmap':
        return <RoadmapView onNavigate={tab => setCurrentTab(tab)} />;
      case 'materials':
        return <StudyMaterials />;
      case 'tasks':
        return <TodaysPlan />;
      case 'timer':
        return <StudyTimer />;
      case 'quizzes':
        return <QuizSystem />;
      case 'projects':
        return <ProjectTracker />;
      case 'readiness':
        return <CareerReadinessModal onNavigate={tab => setCurrentTab(tab)} />;
      case 'ai-assistant':
        return <AICareerAssistant />;
      case 'ai-tools':
        return <AIToolsDirectory />;
      case 'achievements':
        return <AchievementsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <Dashboard onNavigate={tab => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-200">
      <Header
        onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      <div className="flex-1 flex">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={tab => setCurrentTab(tab)}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderTabContent()}
        </main>
      </div>

      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={tab => setCurrentTab(tab)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
