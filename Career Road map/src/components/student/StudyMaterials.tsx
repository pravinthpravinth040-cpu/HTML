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
  Check,
  FolderX
} from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { useData } from '../../context/DataContext';
import { MaterialType, StudyMaterial } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const StudyMaterials: React.FC = () => {
  const {
    materials,
    materialProgress,
    toggleMaterialComplete,
    selectedCareer,
    topics,
  } = useData();

  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Show only PUBLISHED materials
  const publishedMaterials = materials.filter(m => m.status === 'published');

  const types = [
    'All',
    'Video',
    'PDF',
    'Article',
    'Documentation',
    'Website',
    'GitHub Repository',
    'Course',
    'Notes',
    'Assignment',
  ];

  const filteredMaterials = publishedMaterials.filter(m => {
    const matchesType = selectedType === 'All' || m.materialType === selectedType;
    const matchesTopic = selectedTopicFilter === 'All' || m.topicId === selectedTopicFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesTopic && matchesSearch;
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
      case 'Documentation':
      case 'Article':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      default:
        return <Layers className="w-4 h-4 text-brand-400" />;
    }
  };

  const completedCount = publishedMaterials.filter(m =>
    materialProgress.some(mp => mp.materialId === m.id && mp.isCompleted)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Curated Resources & Documentation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Study Materials</h1>
          <p className="text-xs text-slate-400 mt-1">
            Handpicked articles, official docs, videos, and repositories assigned by the administrator.
          </p>
        </div>

        {publishedMaterials.length > 0 && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400">Progress:</span>
            <span className="font-bold text-slate-200">
              {completedCount} / {publishedMaterials.length} completed
            </span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {publishedMaterials.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search materials by title or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              {types.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Materials List or Empty State */}
      {publishedMaterials.length === 0 ? (
        <EmptyState
          icon="material"
          title="No Study Materials Available"
          description="No study materials have been added yet. Your administrator will publish guides, articles, videos, and documentation for your career roadmap."
        />
      ) : filteredMaterials.length === 0 ? (
        <EmptyState
          title="No Materials Found"
          description={`No materials match your current search and filter settings.`}
          compact
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(material => {
            const isCompleted = materialProgress.some(
              mp => mp.materialId === material.id && mp.isCompleted
            );
            const parentTopic = topics.find(t => t.id === material.topicId);

            return (
              <div
                key={material.id}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-950/70 border-emerald-800/40 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {getTypeIcon(material.materialType)}
                      {material.materialType}
                    </span>

                    {material.durationMinutes > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {material.durationMinutes}m
                      </span>
                    )}
                  </div>

                  <h3
                    className={`font-bold text-sm leading-snug ${
                      isCompleted ? 'text-slate-300' : 'text-slate-100'
                    }`}
                  >
                    {material.title}
                  </h3>

                  {parentTopic && (
                    <span className="text-[10px] text-brand-400 font-medium block mt-1">
                      Topic: {parentTopic.name}
                    </span>
                  )}

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {material.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                  {material.url ? (
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
                      Open Resource
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Attached file</span>
                  )}

                  <button
                    onClick={() => toggleMaterialComplete(material.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800/80 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-700/50'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        isCompleted ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    {isCompleted ? 'Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
