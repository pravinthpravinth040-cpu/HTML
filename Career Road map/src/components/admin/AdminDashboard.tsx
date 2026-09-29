import React from 'react';
import {
  Shield,
  Users,
  Compass,
  Map,
  BookOpen,
  HelpCircle,
  FolderGit2,
  CheckSquare,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Database,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenCreateModal: (type: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenCreateModal,
}) => {
  const { adminStats, careers, roadmaps, materials } = useData();

  const statCards = [
    { label: 'Total Students', value: adminStats.totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Students', value: adminStats.activeStudents, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Career Paths', value: adminStats.careerPaths, icon: Compass, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Roadmaps', value: adminStats.roadmaps, icon: Map, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Study Materials', value: adminStats.studyMaterials, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Quizzes', value: adminStats.quizzes, icon: HelpCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Projects', value: adminStats.projects, icon: FolderGit2, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Completed Tasks', value: adminStats.completedTasks, icon: CheckSquare, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Study Hours', value: `${adminStats.totalStudyHours}h`, icon: Clock, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Management Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              All metrics below reflect real PostgreSQL / Supabase rows. Starting empty by design, without fake or demo data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenCreateModal('career')}
              className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Career Path
            </button>
            <button
              onClick={() => onNavigateTab('admin-content')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              Manage Curriculum
            </button>
          </div>
        </div>
      </div>

      {/* Real Database Metrics Cards (Strictly 0 if DB is empty) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">{card.label}</span>
                <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-100">{card.value}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Live DB Count</span>
            </div>
          );
        })}
      </div>

      {/* Content Quick Access & Publishing Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Hierarchy Pipeline */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-100">Educational Hierarchy Pipeline</h2>
            <button
              onClick={() => onNavigateTab('admin-content')}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
            >
              Open Builder <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Follow the 5-step curriculum creation pipeline. Students only see content once marked as <strong>Published</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
            {[
              { step: '1', title: 'Career', count: careers.length, type: 'career' },
              { step: '2', title: 'Roadmap', count: roadmaps.length, type: 'roadmap' },
              { step: '3', title: 'Phase', count: adminStats.roadmaps > 0 ? 'Phased' : 0, type: 'phase' },
              { step: '4', title: 'Modules', count: 'Active', type: 'module' },
              { step: '5', title: 'Materials', count: materials.length, type: 'material' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => onOpenCreateModal(p.type)}
                className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-left transition-colors"
              >
                <span className="w-5 h-5 rounded-md bg-brand-500/10 text-brand-400 font-bold text-[10px] flex items-center justify-center mb-1">
                  {p.step}
                </span>
                <p className="text-xs font-bold text-slate-200">{p.title}</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">+ Add New</span>
              </button>
            ))}
          </div>

          {careers.length === 0 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Initial Setup Step:</strong> The database currently has 0 career paths. Click <strong>&quot;New Career Path&quot;</strong> to create your first career track (e.g. Full-Stack Developer, AI Engineer, Cloud Specialist).
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Quick Admin Actions */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <h2 className="font-bold text-base text-slate-100">Admin Actions</h2>

          <div className="space-y-2">
            <button
              onClick={() => onOpenCreateModal('career')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
            >
              <span>+ Create Career Path</span>
              <Compass className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => onOpenCreateModal('material')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
            >
              <span>+ Upload Study Material</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => onOpenCreateModal('quiz')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
            >
              <span>+ Create Topic Quiz</span>
              <HelpCircle className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={() => onOpenCreateModal('project')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
            >
              <span>+ Create Capstone Project</span>
              <FolderGit2 className="w-4 h-4 text-pink-400" />
            </button>

            <button
              onClick={() => onOpenCreateModal('aiTool')}
              className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
            >
              <span>+ Add AI Developer Tool</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
