import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  FileText,
  Video,
  Layers,
  Award,
  Check
} from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { useData } from '../../context/DataContext';
import { MaterialType } from '../../types';

export const StudyMaterials: React.FC = () => {
  const { materials, toggleMaterial } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Programming',
    'Frontend',
    'Backend',
    'Database',
    'Git/GitHub',
    'DevOps',
    'AI',
    'DSA',
    'System Design',
    'Interview Preparation'
  ];

  const types = ['All', 'PDF', 'Documentation', 'Article', 'Course', 'GitHub Repository'];

  const filteredMaterials = materials.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesType = selectedType === 'All' || m.type === selectedType;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'Video':
        return <Video className="w-4 h-4 text-indigo-400" />;
      case 'GitHub Repository':
        return <GithubIcon className="w-4 h-4 text-slate-300" />;
      case 'Course':
        return <Award className="w-4 h-4 text-amber-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-brand-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Curated Technical Library</span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Study Materials & Engineering Handbooks
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            High-yield documentation, architecture blueprints, cheat sheets, and verified guides.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(mat => (
          <div
            key={mat.id}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              mat.isCompleted
                ? 'bg-slate-900/60 border-emerald-500/30'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                    {getTypeIcon(mat.type)}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {mat.type}
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  mat.difficulty === 'Beginner'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : mat.difficulty === 'Intermediate'
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {mat.difficulty}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white line-clamp-2">
                  {mat.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mt-1.5 leading-relaxed">
                  {mat.description}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate mr-2 font-mono text-[10px]">
                  By: {mat.authorOrProvider || 'CareerForge'}
                </span>
                <span className="flex items-center shrink-0">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" /> {mat.estimatedMinutes}m
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={mat.resourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => toggleMaterial(mat.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    mat.isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                  title={mat.isCompleted ? 'Completed' : 'Mark as Studied'}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
