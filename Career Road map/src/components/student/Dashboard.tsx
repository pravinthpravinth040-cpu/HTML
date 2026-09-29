import React from 'react';
import {
  Compass,
  Map,
  CheckSquare,
  Clock,
  Flame,
  Award,
  TrendingUp,
  ArrowRight,
  BookOpen,
  FolderGit2,
  Sparkles,
  UserCheck,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../common/EmptyState';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const {
    careers,
    selectedCareer,
    currentRoadmap,
    phases,
    modules,
    topics,
    completedTopicIds,
    totalStudyHours,
    currentStreak,
    overallProgressPercentage,
    tasks,
    taskProgress,
    projects,
    projectProgress,
    quizAttempts,
  } = useData();

  // Find current phase and module in roadmap
  const roadmapPhases = currentRoadmap
    ? phases.filter(p => p.roadmapId === currentRoadmap.id && p.status === 'published')
    : [];
  const currentPhase = roadmapPhases.length > 0 ? roadmapPhases[0] : null;

  // Real today's tasks
  const studentTasks = tasks.filter(t => t.status === 'published');
  const todayTasks = studentTasks.slice(0, 3);
  const completedTasksCount = taskProgress.filter(tp => tp.status === 'completed').length;

  // Real projects
  const studentProjects = projects.filter(p => p.status === 'published');
  const completedProjectsCount = projectProgress.filter(p => p.status === 'completed').length;

  // Real quiz average
  const averageQuizScore =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + q.score, 0) / quizAttempts.length)
      : 0;

  // Check if student has no selected career
  const isBrandNewStudent = !selectedCareer;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Welcome to CareerPath 👋</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hello, {profile?.fullName || 'Student'}
          </h1>

          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {isBrandNewStudent
              ? "Your learning journey hasn't started yet. Choose a career goal published by your administrator to generate your custom roadmap."
              : `You are currently training for: ${selectedCareer.title}. Follow your roadmap phases and log study sessions to build job readiness.`}
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('careers')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4" />
              {selectedCareer ? 'Change Career Goal' : 'Choose Career'}
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <Map className="w-4 h-4 text-cyan-400" />
              Explore Roadmap
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all hover:scale-[1.02]"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Complete Profile
            </button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Real Database Metrics Cards (strictly 0 if no records exist) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Progress */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Overall Progress</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">{overallProgressPercentage}%</span>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${overallProgressPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            {completedTopicIds.length} topics completed
          </span>
        </div>

        {/* Metric 2: Study Hours */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Study Hours</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">{totalStudyHours} hrs</span>
            <p className="text-[11px] text-slate-500 mt-2">
              From logged study timer sessions
            </p>
          </div>
          <button
            onClick={() => onNavigate('timer')}
            className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 mt-2 text-left"
          >
            Start Timer <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 3: Current Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Current Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">{currentStreak} Days</span>
            <p className="text-[11px] text-slate-500 mt-2">
              {currentStreak === 0 ? 'Study today to start your streak' : 'Active learning streak!'}
            </p>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            Recorded daily activity
          </span>
        </div>

        {/* Metric 4: Quiz Score */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Quiz Score</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">
              {quizAttempts.length > 0 ? `${averageQuizScore}%` : '0%'}
            </span>
            <p className="text-[11px] text-slate-500 mt-2">
              {quizAttempts.length} quizzes completed
            </p>
          </div>
          <button
            onClick={() => onNavigate('quizzes')}
            className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 mt-2 text-left"
          >
            View Quizzes <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Career & Roadmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Roadmap / Career Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-base text-slate-100">Career & Current Roadmap</h2>
              </div>
              {selectedCareer && (
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                >
                  View Full Roadmap <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Empty State checks */}
            {!selectedCareer ? (
              <EmptyState
                icon="career"
                title="No Career Selected"
                description={
                  careers.length === 0
                    ? 'No career paths are available yet. Please check back later or contact your administrator.'
                    : 'Choose your desired career path to generate your personalized learning roadmap and start tracking your preparation.'
                }
                actionText={careers.length > 0 ? 'Choose Career' : undefined}
                onAction={() => onNavigate('careers')}
                compact
              />
            ) : !currentRoadmap ? (
              <EmptyState
                icon="roadmap"
                title="Roadmap Not Published"
                description={`This career (${selectedCareer.title}) does not have a published roadmap yet. Your administrator will publish modules soon.`}
                secondaryActionText="Choose Another Career"
                onSecondaryAction={() => onNavigate('careers')}
                compact
              />
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">
                      Current Track
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">{selectedCareer.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{selectedCareer.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {currentRoadmap.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {roadmapPhases.length} Phases
                      </span>
                      {currentPhase && (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 font-medium">
                          Active: {currentPhase.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-400">
                    Roadmap Progress:{' '}
                    <strong className="text-slate-200">{overallProgressPercentage}%</strong> (
                    {completedTopicIds.length} topics mastered)
                  </div>
                  <button
                    onClick={() => onNavigate('roadmap')}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-base text-slate-100">Today&apos;s Plan & Tasks</h2>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                View All Tasks <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {studentTasks.length === 0 ? (
              <EmptyState
                icon="task"
                title="No Tasks Assigned"
                description="No tasks assigned for today. Complete topics in your roadmap or ask your administrator to create tasks."
                compact
              />
            ) : (
              <div className="space-y-2">
                {todayTasks.map(task => {
                  const progress = taskProgress.find(tp => tp.taskId === task.id);
                  const isDone = progress?.status === 'completed';

                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-3 h-3 rounded-full border ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-400'
                              : 'border-slate-600'
                          }`}
                        />
                        <div>
                          <p
                            className={`font-semibold ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-200'
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {task.description || `${task.estimatedDurationMinutes} mins estimated`}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {task.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Projects & Career Readiness Quick Look */}
        <div className="space-y-6">
          {/* Projects Card */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-pink-400" />
                <h2 className="font-bold text-base text-slate-100">Projects</h2>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                Track
              </button>
            </div>

            {studentProjects.length === 0 ? (
              <EmptyState
                icon="project"
                title="No Projects Assigned"
                description="No projects assigned yet. Practical project tasks will appear here as your admin creates them."
                compact
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Completed:</span>
                  <strong className="text-slate-200">
                    {completedProjectsCount} / {studentProjects.length}
                  </strong>
                </div>

                {studentProjects.slice(0, 2).map(project => (
                  <div
                    key={project.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                  >
                    <p className="font-bold text-slate-200">{project.name}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Career Assistant Prompt Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-purple-950/40 border border-indigo-800/40">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Career Assistant</span>
            </div>
            <h3 className="font-bold text-sm text-slate-100">Have questions about your roadmap?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Ask about next study topics, project architectures, or get interview prep tailored to your progress.
            </p>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Open AI Assistant <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
