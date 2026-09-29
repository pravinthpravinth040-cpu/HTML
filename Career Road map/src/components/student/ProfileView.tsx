import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Clock,
  Globe,
  FileText,
  Save,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';
import { GithubIcon, LinkedInIcon } from '../common/BrandIcons';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { selectedCareer, totalStudyHours, currentStreak, completedTopicIds } = useData();

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    college: profile?.college || '',
    degree: profile?.degree || '',
    department: profile?.department || '',
    yearOfStudy: profile?.yearOfStudy || '',
    semester: profile?.semester || '',
    graduationYear: profile?.graduationYear || '',
    careerGoal: profile?.careerGoal || '',
    dailyAvailableHours: profile?.dailyAvailableHours || 2,
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    portfolioUrl: profile?.portfolioUrl || '',
    resumeUrl: profile?.resumeUrl || '',
    bio: profile?.bio || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const ok = await updateProfile(formData);
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <User className="w-4 h-4" />
          <span>Student Account & Career Profile</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">My Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Maintain your academic background, links, resume, and target career preferences stored securely in Supabase.
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-brand-500/25">
          {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'S'}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-bold text-slate-100">
            {formData.fullName || 'Student'}
          </h2>
          <p className="text-xs text-slate-400">{profile?.email}</p>

          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              Role: <strong>Student</strong>
            </span>
            {selectedCareer && (
              <span className="px-2.5 py-1 rounded-xl bg-brand-950/40 text-brand-300 border border-brand-800/40">
                Track: <strong>{selectedCareer.title}</strong>
              </span>
            )}
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              Study Time: <strong>{totalStudyHours}h</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              Streak: <strong>{currentStreak}d</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6">
        {/* Section 1: Academic Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            Academic Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                College / University
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. Stanford University / IIT"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Degree & Major
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={e => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Information Technology"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Year / Semester
              </label>
              <input
                type="text"
                value={formData.yearOfStudy}
                onChange={e => setFormData({ ...formData, yearOfStudy: e.target.value })}
                placeholder="e.g. 3rd Year / 6th Semester"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                value={formData.graduationYear}
                onChange={e => setFormData({ ...formData, graduationYear: e.target.value })}
                placeholder="e.g. 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Study Habits & Goals */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Study Habit Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Daily Available Study Time (Hours)
              </label>
              <input
                type="number"
                min={0.5}
                max={12}
                step={0.5}
                value={formData.dailyAvailableHours}
                onChange={e => setFormData({ ...formData, dailyAvailableHours: parseFloat(e.target.value) || 2 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Career Goal Summary
              </label>
              <input
                type="text"
                value={formData.careerGoal}
                onChange={e => setFormData({ ...formData, careerGoal: e.target.value })}
                placeholder="e.g. Land a Senior Frontend role at high-growth tech startup"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Links & Portfolio (Impacts Career Readiness!) */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Portfolio, GitHub & Resume
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5" /> GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/yourhandle"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <LinkedInIcon className="w-3.5 h-3.5 text-blue-400" /> LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourhandle"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Personal Portfolio URL
              </label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://yourname.dev"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> Resume / CV Document URL
              </label>
              <input
                type="url"
                value={formData.resumeUrl}
                onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/... or hosted PDF link"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button & Confirmation */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {saveSuccess ? (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Profile saved successfully to Supabase!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Changes sync with your career readiness score automatically.
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
