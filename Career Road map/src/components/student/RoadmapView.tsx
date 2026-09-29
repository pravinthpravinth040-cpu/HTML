import React, { useState } from 'react';
import {
  Map,
  Layers,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Award,
  HelpCircle,
  FolderGit2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../common/EmptyState';
import { Topic, Module, RoadmapPhase } from '../../types';

interface RoadmapViewProps {
  onNavigate: (tab: string, targetId?: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onNavigate }) => {
  const {
    selectedCareer,
    currentRoadmap,
    phases,
    modules,
    topics,
    materials,
    completedTopicIds,
    toggleMaterialComplete,
    materialProgress,
    overallProgressPercentage,
    quizzes,
    projects,
  } = useData();

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  if (!selectedCareer) {
    return (
      <EmptyState
        icon="career"
        title="No Career Selected"
        description="Please select a career goal from the career catalog to unlock its roadmap."
        actionText="Choose Career Goal"
        onAction={() => onNavigate('careers')}
      />
    );
  }

  if (!currentRoadmap) {
    return (
      <EmptyState
        icon="roadmap"
        title="Roadmap Not Published"
        description={`The administrator has not published a learning roadmap for ${selectedCareer.title} yet.`}
        secondaryActionText="Choose Another Career"
        onSecondaryAction={() => onNavigate('careers')}
      />
    );
  }

  // Get published phases for this roadmap
  const roadmapPhases = phases
    .filter(p => p.roadmapId === currentRoadmap.id && p.status === 'published')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (roadmapPhases.length === 0) {
    return (
      <EmptyState
        icon="roadmap"
        title="No Phases Published Yet"
        description="This roadmap does not have any published phases yet. The administrator will be adding roadmap phases soon."
      />
    );
  }

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <div className="space-y-6">
      {/* Roadmap Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
            <Map className="w-4 h-4" />
            <span>Interactive Learning Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
            {selectedCareer.title} Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {currentRoadmap.description || selectedCareer.description}
          </p>
        </div>

        {/* Real Progress Box */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 min-w-[220px]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Roadmap Progress</span>
            <span className="font-bold text-slate-200">{overallProgressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgressPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">
            {completedTopicIds.length} topics completed
          </span>
        </div>
      </div>

      {/* Visual Phase Timeline */}
      <div className="space-y-6">
        {roadmapPhases.map((phase, phaseIndex) => {
          const isPhaseOpen = expandedPhases[phase.id] !== false; // default open
          const phaseModules = modules
            .filter(m => m.phaseId === phase.id && m.status === 'published')
            .sort((a, b) => a.sortOrder - b.sortOrder);

          // Calculate phase progress from real topics
          const phaseTopicIds = topics
            .filter(t => phaseModules.some(m => m.id === t.moduleId) && t.status === 'published')
            .map(t => t.id);
          const completedInPhase = phaseTopicIds.filter(id => completedTopicIds.includes(id)).length;
          const phasePct =
            phaseTopicIds.length > 0 ? Math.round((completedInPhase / phaseTopicIds.length) * 100) : 0;

          return (
            <div
              key={phase.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-all"
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(phase.id)}
                className="p-5 bg-slate-900/80 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-800/80"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm">
                    {phaseIndex + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Phase {phaseIndex + 1}
                      </span>
                      {phase.estimatedDuration && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {phase.estimatedDuration}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-slate-100">{phase.title}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-300">
                      {completedInPhase} / {phaseTopicIds.length} topics
                    </span>
                    <span className="text-[10px] text-slate-500">{phasePct}% complete</span>
                  </div>
                  <button className="p-1 rounded-lg text-slate-400">
                    {isPhaseOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phase Body: Modules */}
              {isPhaseOpen && (
                <div className="p-5 space-y-4">
                  {phase.description && (
                    <p className="text-xs text-slate-400 mb-3">{phase.description}</p>
                  )}

                  {phaseModules.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-500 text-center">
                      No modules added to this phase yet.
                    </div>
                  ) : (
                    phaseModules.map((mod, modIdx) => {
                      const isModOpen = expandedModules[mod.id] !== false;
                      const modTopics = topics
                        .filter(t => t.moduleId === mod.id && t.status === 'published')
                        .sort((a, b) => a.sortOrder - b.sortOrder);

                      return (
                        <div
                          key={mod.id}
                          className="rounded-xl border border-slate-800/70 bg-slate-950/60 overflow-hidden"
                        >
                          {/* Module Header */}
                          <div
                            onClick={() => toggleModule(mod.id)}
                            className="p-3.5 hover:bg-slate-900/60 cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <Layers className="w-4 h-4 text-indigo-400" />
                              <span className="font-semibold text-xs sm:text-sm text-slate-200">
                                {mod.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                {modTopics.length} topics
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {mod.difficulty && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 hidden sm:inline">
                                  {mod.difficulty}
                                </span>
                              )}
                              {isModOpen ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>

                          {/* Module Topics */}
                          {isModOpen && (
                            <div className="p-3 border-t border-slate-800/60 divide-y divide-slate-800/40">
                              {modTopics.length === 0 ? (
                                <p className="text-xs text-slate-500 py-2 text-center">
                                  No topics published in this module yet.
                                </p>
                              ) : (
                                modTopics.map(topic => {
                                  const isDone = completedTopicIds.includes(topic.id);
                                  const topicMaterials = materials.filter(m => m.topicId === topic.id && m.status === 'published');
                                  const topicQuizzes = quizzes.filter(q => q.topicId === topic.id && q.status === 'published');

                                  return (
                                    <div
                                      key={topic.id}
                                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                    >
                                      <div className="flex items-start gap-2.5">
                                        <span
                                          className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                                            isDone
                                              ? 'bg-emerald-500 border-emerald-400 text-white'
                                              : 'border-slate-700 bg-slate-900 text-transparent'
                                          }`}
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                        </span>
                                        <div>
                                          <h4
                                            className={`font-semibold ${
                                              isDone ? 'text-slate-300' : 'text-slate-100'
                                            }`}
                                          >
                                            {topic.name}
                                          </h4>
                                          {topic.description && (
                                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                              {topic.description}
                                            </p>
                                          )}
                                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                                            <span>{topic.estimatedLearningTimeMinutes} min</span>
                                            <span>•</span>
                                            <span>{topic.difficulty}</span>
                                            {topicMaterials.length > 0 && (
                                              <>
                                                <span>•</span>
                                                <span className="text-emerald-400 font-medium">
                                                  {topicMaterials.length} materials
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Topic Quick Actions */}
                                      <div className="flex items-center gap-2 pl-6 sm:pl-0">
                                        {topicMaterials.length > 0 && (
                                          <button
                                            onClick={() => onNavigate('materials', topic.id)}
                                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                                          >
                                            <BookOpen className="w-3 h-3 text-emerald-400" />
                                            Materials ({topicMaterials.length})
                                          </button>
                                        )}

                                        {topicQuizzes.length > 0 && (
                                          <button
                                            onClick={() => onNavigate('quizzes')}
                                            className="px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-800/40 text-[11px] font-medium flex items-center gap-1 transition-colors"
                                          >
                                            <HelpCircle className="w-3 h-3 text-purple-400" />
                                            Quiz
                                          </button>
                                        )}

                                        <button
                                          onClick={() => onNavigate('timer')}
                                          className="px-2.5 py-1 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-blue-300 border border-blue-800/40 text-[11px] font-medium flex items-center gap-1 transition-colors"
                                        >
                                          <Clock className="w-3 h-3 text-blue-400" />
                                          Study
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
