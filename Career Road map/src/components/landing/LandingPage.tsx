import React from 'react';
import {
  Compass,
  Map,
  BookOpen,
  CheckSquare,
  Clock,
  Award,
  Bot,
  Shield,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  Database,
  Lock,
  ChevronRight,
  FileText,
  HelpCircle,
  FolderGit2
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface LandingPageProps {
  onOpenStudentLogin: () => void;
  onOpenStudentRegister: () => void;
  onOpenAdminLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenStudentLogin,
  onOpenStudentRegister,
  onOpenAdminLogin,
}) => {
  const { careers, adminStats } = useData();

  // Show only published careers
  const publishedCareers = careers.filter(c => c.status === 'published');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-brand-500/25">
            C
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">CareerPath</span>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Learn. Build. Track. Become Job Ready.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdminLogin}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Admin Portal
          </button>

          <button
            onClick={onOpenStudentLogin}
            className="text-xs font-semibold px-4 py-1.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={onOpenStudentRegister}
            className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-16 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Engineering Career Learning & Study Management Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Learn. Build. Track.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400">
            Become Job Ready.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The comprehensive career preparation platform for college students. Follow administrator-curated engineering roadmaps, study official documentation, complete hands-on projects, verify skills with quizzes, and calculate your true job readiness.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenStudentRegister}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenStudentLogin}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-bold transition-all"
          >
            Student Login
          </button>
        </div>

        {/* Real Live Database Counters (Strictly 0 if DB is empty) */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Students</span>
            <p className="text-2xl font-black text-slate-100 mt-0.5">{adminStats.totalStudents}</p>
            <span className="text-[10px] text-slate-500">Live verified accounts</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Published Careers</span>
            <p className="text-2xl font-black text-brand-400 mt-0.5">{publishedCareers.length}</p>
            <span className="text-[10px] text-slate-500">Curated by admin</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Study Materials</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">{adminStats.studyMaterials}</p>
            <span className="text-[10px] text-slate-500">Handpicked guides & docs</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Logged Study Hours</span>
            <p className="text-2xl font-black text-cyan-400 mt-0.5">{adminStats.totalStudyHours}h</p>
            <span className="text-[10px] text-slate-500">From Pomodoro timer</span>
          </div>
        </div>
      </section>

      {/* Published Career Paths Showcase (Starts empty if no careers published) */}
      <section className="px-4 sm:px-8 py-16 bg-slate-900/30 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                Career Specializations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
                Explore Available Career Tracks
              </h2>
            </div>
            <button
              onClick={onOpenStudentRegister}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start sm:self-auto"
            >
              Enroll in Track <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {publishedCareers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
              <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              No career paths are currently published. Platform administrator creates career tracks dynamically.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedCareers.map(career => (
                <div
                  key={career.id}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {career.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-100 mt-1">{career.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {career.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>{career.estimatedDuration}</span>
                    <button
                      onClick={onOpenStudentRegister}
                      className="text-brand-400 hover:text-brand-300 font-semibold"
                    >
                      Explore →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="px-4 sm:px-8 py-20 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
            Core Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Built for Serious Engineering Careers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every feature is backed by transparent Supabase tables, row-level security, and zero fabricated numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Visual Roadmaps</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Step-by-step phases, modules, and topics created by the administrator to eliminate analysis paralysis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Study Timer & Streak</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Built-in Pomodoro timer automatically logs every focused minute into verified PostgreSQL sessions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Verified Quizzes</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Admin-authored topic verification questions with instant grading and historical retention tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Production Projects</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Track multi-stage software projects from planning to deployment with linked GitHub repositories.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Evidence Career Readiness</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Mathematically computed from actual completed topics, projects, DSA topics, resume, and study streaks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">AI Career Assistant</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Context-aware mentor that answers questions using only your real learning records, not hallucinated data.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-8 py-16 max-w-4xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950/40 to-slate-900 border border-slate-800 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Take Control of Your Career?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
            Create your student profile today, enroll in an administrator-curated roadmap, and start logging focused study sessions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenStudentRegister}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all"
            >
              Sign Up as Student
            </button>
            <button
              onClick={onOpenAdminLogin}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              Administrator Access
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 px-4 sm:px-8 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} CareerPath. Learn. Build. Track. Become Job Ready.</p>
          <p className="text-[11px] text-slate-600">
            Powered by React, TypeScript, Tailwind CSS, & Supabase PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  );
};
