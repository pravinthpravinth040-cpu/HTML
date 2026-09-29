import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Shield,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'student-login' | 'student-register' | 'admin-login';
  onClose: () => void;
  onSuccess: (role: 'student' | 'admin') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const { login, adminLogin, register } = useAuth();

  const [mode, setMode] = useState<'student-login' | 'student-register' | 'admin-login'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'admin-login') {
        const res = await adminLogin(email, password);
        if (res.success) {
          onSuccess('admin');
          onClose();
        } else {
          setError(res.error || 'Admin credentials invalid.');
        }
      } else if (mode === 'student-login') {
        const res = await login(email, password);
        if (res.success) {
          onSuccess('student');
          onClose();
        } else {
          setError(res.error || 'Student login failed.');
        }
      } else {
        // Student Register (strictly registers with role 'student')
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }
        const res = await register(email, password, fullName);
        if (res.success) {
          onSuccess('student');
          onClose();
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = mode === 'admin-login';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div
            className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-lg ${
              isAdmin
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-amber-500/10'
                : 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-brand-500/10'
            }`}
          >
            {isAdmin ? <Shield className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
          </div>

          <h2 className="text-xl font-bold text-slate-100">
            {isAdmin
              ? 'Administrator Authentication'
              : mode === 'student-login'
              ? 'Welcome Back, Student'
              : 'Create Student Account'}
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            {isAdmin
              ? 'Restricted to authorized curriculum administrators.'
              : mode === 'student-login'
              ? 'Sign in to access your roadmaps, progress, and study timer.'
              : 'Join CareerPath with a clean zero-data profile.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'student-register' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isAdmin ? 'admin@careerpath.edu' : 'student@college.edu'}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {isAdmin && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300/90 leading-relaxed">
              <strong>Admin Policy:</strong> Students cannot register as administrators. Default admin credential format: <code className="text-amber-200">admin@careerpath.edu</code> (or your configured Supabase admin user).
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
              isAdmin
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25'
                : 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/25'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              'Authenticating...'
            ) : (
              <>
                {isAdmin
                  ? 'Access Admin Portal'
                  : mode === 'student-login'
                  ? 'Sign In'
                  : 'Complete Registration'}
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Mode Switchers */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-2">
          {mode === 'student-login' && (
            <>
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => {
                    setMode('student-register');
                    setError(null);
                  }}
                  className="text-brand-400 hover:underline font-semibold"
                >
                  Register as Student
                </button>
              </p>
              <p>
                Platform administrator?{' '}
                <button
                  onClick={() => {
                    setMode('admin-login');
                    setError(null);
                  }}
                  className="text-amber-400 hover:underline font-semibold"
                >
                  Admin Sign In
                </button>
              </p>
            </>
          )}

          {mode === 'student-register' && (
            <p>
              Already registered?{' '}
              <button
                onClick={() => {
                  setMode('student-login');
                  setError(null);
                }}
                className="text-brand-400 hover:underline font-semibold"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === 'admin-login' && (
            <p>
              Are you a student?{' '}
              <button
                onClick={() => {
                  setMode('student-login');
                  setError(null);
                }}
                className="text-brand-400 hover:underline font-semibold"
              >
                Student Portal
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
