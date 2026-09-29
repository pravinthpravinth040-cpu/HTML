import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  BookOpen,
  FolderGit2,
  HelpCircle,
  FileCheck2,
  Flame,
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { calculateCareerReadiness } from '../../services/readinessEngine';
import { EmptyState } from '../common/EmptyState';

export const CareerReadinessModal: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const {
    topics,
    completedTopicIds,
    projects,
    projectProgress,
    studySessions,
    currentStreak,
    quizAttempts,
  } = useData();

  const avgQuizScore =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
      : 0;

  const report = calculateCareerReadiness(
    profile,
    topics,
    completedTopicIds,
    projects,
    projectProgress,
    studySessions,
    currentStreak,
    avgQuizScore,
    quizAttempts.length
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Transparent & Evidence-Based Verification</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Career Readiness Score</h1>
        <p className="text-xs text-slate-400 mt-1">
          Unlike black-box AI scores, your job readiness is mathematically computed from verified database milestones.
        </p>
      </div>

      {/* Main Readiness Card or Empty State */}
      {!report.hasSufficientData ? (
        <EmptyState
          icon="analytics"
          title="Not enough data to calculate career readiness"
          description={report.emptyReason || 'Complete roadmap topics, study sessions, quizzes, or link your GitHub to calculate your readiness.'}
          actionText={onNavigate ? 'Go to Visual Roadmap' : undefined}
          onAction={onNavigate ? () => onNavigate('roadmap') : undefined}
        />
      ) : (
        <div className="space-y-6">
          {/* Top Score Box */}
          <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Overall Job-Readiness Index
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-100 mt-1">
                {report.overallScore}
                <span className="text-xl text-slate-500 font-bold"> / 100</span>
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
                Aggregated from 6 verified dimensions: Roadmap Mastery, Deployed Projects, Quiz Scores, GitHub, Resume, and Study Consistency.
              </p>
            </div>

            <div className="w-36 h-36 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="#10b981"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - report.overallScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-extrabold text-2xl text-white">{report.overallScore}%</span>
                <span className="text-[9px] uppercase font-bold text-emerald-400">Verified</span>
              </div>
            </div>
          </div>

          {/* Transparent Category Breakdown */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-200">Dimension Score Breakdown</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-200 flex items-center gap-2">
                        {cat.name}
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({cat.weight}% weight)
                        </span>
                      </span>
                      <span className="font-mono font-bold text-slate-100">{cat.score}%</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-brand-500 h-1.5 rounded-full"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                      {cat.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          {report.recommendations.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Actionable Steps to Increase Your Readiness Score
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
