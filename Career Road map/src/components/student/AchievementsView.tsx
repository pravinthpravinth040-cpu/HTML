import React from 'react';
import {
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  BookOpen,
  FolderGit2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../common/EmptyState';

export const AchievementsView: React.FC = () => {
  const {
    achievements,
    studentAchievements,
    currentStreak,
    totalStudyHours,
    completedTopicIds,
    projectProgress,
    quizAttempts,
  } = useData();

  // Evaluated earned achievements
  const earnedAchievementIds = new Set(studentAchievements.map(sa => sa.achievementId));

  // Auto-check dynamic eligibility from real DB records
  const dynamicUnlockedAchievements = achievements.filter(ach => {
    if (earnedAchievementIds.has(ach.id)) return true;

    // Check criteria against real metrics
    switch (ach.criteriaType) {
      case 'streak':
        return currentStreak >= ach.criteriaValue;
      case 'study_hours':
        return totalStudyHours >= ach.criteriaValue;
      case 'topics_completed':
        return completedTopicIds.length >= ach.criteriaValue;
      case 'projects_completed':
        return projectProgress.filter(p => p.status === 'completed').length >= ach.criteriaValue;
      case 'quizzes_passed':
        return quizAttempts.filter(q => q.passed).length >= ach.criteriaValue;
      default:
        return false;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Verified Milestones & Badges</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Achievements</h1>
          <p className="text-xs text-slate-400 mt-1">
            Badges unlocked through real study hours, roadmap topics mastered, quizzes passed, and streak milestones.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300">
          <strong className="text-amber-400 font-bold">{dynamicUnlockedAchievements.length}</strong> Unlocked
        </div>
      </div>

      {/* Earned Achievements or Empty State */}
      {dynamicUnlockedAchievements.length === 0 ? (
        <EmptyState
          icon="achievement"
          title="No Achievements Earned Yet"
          description="You haven't unlocked any milestone achievements yet. Complete your first study session, topic, or quiz to earn badges!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dynamicUnlockedAchievements.map(ach => (
            <div
              key={ach.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 border border-amber-500/30 shadow-lg shadow-amber-500/5 flex items-start gap-4 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                <Award className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  Unlocked Badge
                </div>
                <h3 className="font-bold text-sm text-slate-100 mt-0.5">{ach.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
                <span className="text-[10px] text-slate-500 block mt-2">
                  Criteria: {ach.criteriaValue} {ach.criteriaType.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
