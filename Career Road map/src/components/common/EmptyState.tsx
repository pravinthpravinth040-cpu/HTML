import React from 'react';
import {
  FolderX,
  Compass,
  Map,
  BookOpen,
  CheckSquare,
  HelpCircle,
  FolderGit2,
  Clock,
  Award,
  Bell,
  BarChart3,
  Sparkles,
  LucideIcon
} from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | 'career' | 'roadmap' | 'material' | 'task' | 'quiz' | 'project' | 'study' | 'achievement' | 'notification' | 'analytics' | 'default';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'default',
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  compact = false,
}) => {
  const getIcon = () => {
    if (typeof icon !== 'string') {
      const CustomIcon = icon;
      return <CustomIcon className="w-8 h-8 text-brand-400" />;
    }

    switch (icon) {
      case 'career':
        return <Compass className="w-8 h-8 text-indigo-400" />;
      case 'roadmap':
        return <Map className="w-8 h-8 text-cyan-400" />;
      case 'material':
        return <BookOpen className="w-8 h-8 text-emerald-400" />;
      case 'task':
        return <CheckSquare className="w-8 h-8 text-amber-400" />;
      case 'quiz':
        return <HelpCircle className="w-8 h-8 text-purple-400" />;
      case 'project':
        return <FolderGit2 className="w-8 h-8 text-pink-400" />;
      case 'study':
        return <Clock className="w-8 h-8 text-blue-400" />;
      case 'achievement':
        return <Award className="w-8 h-8 text-amber-300" />;
      case 'notification':
        return <Bell className="w-8 h-8 text-slate-400" />;
      case 'analytics':
        return <BarChart3 className="w-8 h-8 text-teal-400" />;
      default:
        return <FolderX className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm transition-all ${
        compact ? 'p-6' : 'p-10 my-4'
      }`}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-center mb-4 shadow-inner">
        {getIcon()}
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              {actionText}
            </button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-[1.02]"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
