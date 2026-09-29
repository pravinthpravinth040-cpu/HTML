import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../common/EmptyState';
import { triggerConfetti } from '../common/Confetti';

interface CareerSelectionProps {
  onSuccess?: () => void;
}

export const CareerSelection: React.FC<CareerSelectionProps> = ({ onSuccess }) => {
  const { careers, selectCareerGoal, selectedCareer } = useData();
  const { role } = useAuth();
  const [selectedId, setSelectedId] = useState<string>(selectedCareer?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  // Show only PUBLISHED careers
  const publishedCareers = careers.filter(c => c.status === 'published');

  const filtered = publishedCareers.filter(
    c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (careerId: string) => {
    setSelectedId(careerId);
    setIsSubmitting(true);
    const success = await selectCareerGoal(careerId);
    setIsSubmitting(false);

    if (success) {
      triggerConfetti();
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5 text-brand-400" />
          <span>Career Path Enrollment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          What career are you preparing for?
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Select an administrator-published career path to unlock its structured roadmaps, modules, learning materials, and projects.
        </p>
      </div>

      {/* Filter / Search if multiple careers exist */}
      {publishedCareers.length > 3 && (
        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search career titles, categories, or skills..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      )}

      {/* Careers Grid or Empty State */}
      {publishedCareers.length === 0 ? (
        <EmptyState
          icon="career"
          title="No Career Paths Available"
          description="No career paths are currently available. Please check back later or notify your platform administrator to publish roadmaps."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Matching Careers"
          description={`No careers match your search term "${search}".`}
          compact
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filtered.map(career => {
            const isCurrent = selectedCareer?.id === career.id;
            const isPending = selectedId === career.id && isSubmitting;

            return (
              <div
                key={career.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-900/90 border-brand-500 shadow-xl shadow-brand-500/10 ring-1 ring-brand-500'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                {/* Active selection badge */}
                {isCurrent && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Enrolled
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {career.category}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-100 leading-snug">
                        {career.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {career.description}
                  </p>

                  <div className="space-y-2 mb-4 pt-3 border-t border-slate-800/70 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        Est. Duration
                      </span>
                      <span className="font-semibold text-slate-300">
                        {career.estimatedDuration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        Difficulty
                      </span>
                      <span className="font-semibold text-slate-300">
                        {career.difficulty}
                      </span>
                    </div>
                  </div>

                  {career.requiredSkills.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Core Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {career.requiredSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSelect(career.id)}
                  disabled={isSubmitting || isCurrent}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:scale-[1.01]'
                  }`}
                >
                  {isPending ? (
                    'Enrolling...'
                  ) : isCurrent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Currently Selected
                    </>
                  ) : (
                    <>
                      Select Career Goal <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
