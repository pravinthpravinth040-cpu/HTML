import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  HelpCircle,
  FolderGit2,
  Calendar,
  Sparkles,
  Flame
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../common/EmptyState';

export const AnalyticsView: React.FC = () => {
  const {
    studySessions,
    totalStudyHours,
    currentStreak,
    completedTopicIds,
    topics,
    quizAttempts,
    projectProgress,
    projects,
  } = useData();

  const hasActivity =
    studySessions.length > 0 ||
    completedTopicIds.length > 0 ||
    quizAttempts.length > 0 ||
    projectProgress.length > 0;

  // Calculate past 7 days study minutes strictly from DB
  const past7DaysData = (() => {
    const days: { day: string; date: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayMinutes = studySessions
        .filter(s => s.date === dateStr)
        .reduce((sum, s) => sum + Math.round(s.durationSeconds / 60), 0);

      days.push({
        day: dayName,
        date: dateStr,
        minutes: dayMinutes,
      });
    }
    return days;
  })();

  // Real quiz attempts progression
  const quizScoresData = quizAttempts.slice(-10).map((qa, index) => ({
    attempt: `Q${index + 1}`,
    score: qa.score,
    passed: qa.passed,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Verified Student Telemetry</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Study & Performance Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real telemetry visual graphs generated strictly from your database study sessions, quiz submissions, and topics completed.
        </p>
      </div>

      {!hasActivity ? (
        <EmptyState
          icon="analytics"
          title="No Learning Activity Recorded"
          description="Your analytics dashboard requires real learning activity. Start a timer session or complete roadmap topics to populate your personal metrics charts."
        />
      ) : (
        <div className="space-y-6">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Total Study Time</span>
              <p className="text-xl font-bold text-slate-100 mt-1">{totalStudyHours} hrs</p>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {studySessions.length} total sessions
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Consecutive Streak</span>
              <p className="text-xl font-bold text-amber-400 mt-1">{currentStreak} Days</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Active daily habit</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Topics Mastered</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{completedTopicIds.length}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Out of {topics.length} total</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Quizzes Completed</span>
              <p className="text-xl font-bold text-purple-400 mt-1">{quizAttempts.length}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {quizAttempts.filter(q => q.passed).length} passed
              </span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Daily Study Minutes Past 7 Days */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">Weekly Study Minutes</h3>
                  <p className="text-[11px] text-slate-400">Minutes focused over the last 7 days</p>
                </div>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={past7DaysData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => [`${val} minutes`, 'Study Time']}
                    />
                    <Bar dataKey="minutes" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Quiz Score History */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">Quiz Retention Curve</h3>
                  <p className="text-[11px] text-slate-400">Scores across recent quiz submissions</p>
                </div>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
              </div>

              {quizScoresData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-xs text-slate-500">
                  <HelpCircle className="w-8 h-8 text-slate-600 mb-2" />
                  No quizzes taken yet. Pass topic quizzes to populate this trend.
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={quizScoresData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="attempt" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                        formatter={(val: any) => [`${val}%`, 'Score']}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#a855f7"
                        strokeWidth={3}
                        dot={{ fill: '#a855f7', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
