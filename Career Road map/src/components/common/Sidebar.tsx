import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Map,
  BookOpen,
  CheckSquare,
  Clock,
  HelpCircle,
  FolderGit2,
  TrendingUp,
  Bot,
  Wrench,
  Award,
  BarChart3,
  User,
  Shield,
  Layers,
  Users,
  Database,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { role } = useAuth();
  const { selectedCareer, currentStreak, totalStudyHours } = useData();

  const studentNavItems: { id: string; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'careers', label: 'Choose Career', icon: Compass },
    { id: 'roadmap', label: 'Visual Roadmap', icon: Map },
    { id: 'materials', label: 'Study Materials', icon: BookOpen },
    { id: 'tasks', label: "Today's Plan", icon: CheckSquare },
    { id: 'timer', label: 'Study Timer', icon: Clock },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'readiness', label: 'Career Readiness', icon: TrendingUp },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Smart' },
    { id: 'ai-tools', label: 'AI Tools Directory', icon: Wrench },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const adminNavItems: { id: string; label: string; icon: any; badge?: string }[] = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: Shield },
    { id: 'admin-content', label: 'Content Manager', icon: Layers },
    { id: 'admin-students', label: 'Student Directory', icon: Users },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    if (isOpenMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {/* Mobile close button */}
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-800/80 md:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Status Summary Chip (Only for students) */}
          {role === 'student' && selectedCareer && (
            <div className="mb-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider block">
                Target Career
              </span>
              <p className="text-xs font-bold text-slate-200 truncate mt-0.5">
                {selectedCareer.title}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Streak: <strong className="text-amber-400">{currentStreak}d</strong></span>
                <span>Time: <strong className="text-indigo-400">{totalStudyHours}h</strong></span>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              {role === 'admin' ? 'Admin Portal' : 'Student Learning'}
            </span>

            {(role === 'admin' ? adminNavItems : studentNavItems).map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick toggle for Demo / Admin test access */}
          {role === 'admin' && (
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Preview As Student
              </span>
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Student View</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Brand Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-medium text-slate-400">Zero-Data Policy Enforced</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            All records dynamic from DB
          </p>
        </div>
      </aside>
    </>
  );
};
