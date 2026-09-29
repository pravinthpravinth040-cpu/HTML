import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Code,
  Layers,
  Sparkles,
  Save,
  Link as LinkIcon
} from 'lucide-react';
import { GithubIcon } from '../common/BrandIcons';
import { useData } from '../../context/DataContext';
import { Project, ProjectProgress, ProjectStatus } from '../../types';
import { EmptyState } from '../common/EmptyState';

export const ProjectTracker: React.FC = () => {
  const { projects, projectProgress, updateProjectProgress } = useData();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [status, setStatus] = useState<ProjectStatus>('not_started');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Show only published projects
  const publishedProjects = projects.filter(p => p.status === 'published');

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    const progress = projectProgress.find(pp => pp.projectId === project.id);
    setStatus(progress?.status || 'not_started');
    setGithubUrl(progress?.githubUrl || '');
    setLiveDemoUrl(progress?.liveDemoUrl || '');
    setNotes(progress?.notes || '');
  };

  const handleSave = async () => {
    if (!selectedProject) return;
    setIsSaving(true);
    await updateProjectProgress(
      selectedProject.id,
      status,
      githubUrl,
      liveDemoUrl,
      notes
    );
    setIsSaving(false);
    setSelectedProject(null);
  };

  const completedCount = publishedProjects.filter(p =>
    projectProgress.some(pp => pp.projectId === p.id && pp.status === 'completed')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Production Portfolio Builder</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Project Portfolio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Build real software applications, track development milestones, and attach verified GitHub repos and live deployments.
          </p>
        </div>

        {publishedProjects.length > 0 && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400">Deployed:</span>
            <span className="font-bold text-slate-200">
              {completedCount} / {publishedProjects.length} Completed
            </span>
          </div>
        )}
      </div>

      {/* Projects List or Empty State */}
      {publishedProjects.length === 0 ? (
        <EmptyState
          icon="project"
          title="No Projects Assigned"
          description="No projects have been assigned yet. When your administrator adds capstone and milestone projects, you will track them here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedProjects.map(project => {
            const progress = projectProgress.find(pp => pp.projectId === project.id);
            const currentStatus = progress?.status || 'not_started';

            const statusColors: Record<ProjectStatus, string> = {
              not_started: 'bg-slate-800 text-slate-400 border-slate-700',
              planning: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
              development: 'bg-blue-950/40 text-blue-300 border-blue-800/40',
              testing: 'bg-purple-950/40 text-purple-300 border-purple-800/40',
              completed: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
            };

            return (
              <div
                key={project.id}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        statusColors[currentStatus]
                      }`}
                    >
                      {currentStatus.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {project.estimatedDuration}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-100">{project.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  {project.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Submission Links Preview */}
                  {(progress?.githubUrl || progress?.liveDemoUrl) && (
                    <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center gap-3 text-xs">
                      {progress.githubUrl && (
                        <a
                          href={progress.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-300 hover:text-white flex items-center gap-1"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          Repository
                        </a>
                      )}
                      {progress.liveDemoUrl && (
                        <a
                          href={progress.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-400 hover:text-brand-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Difficulty: <strong className="text-slate-300">{project.difficulty}</strong>
                  </span>
                  <button
                    onClick={() => openEditModal(project)}
                    className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Update Progress
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Update Progress Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-100">
              Update Project: {selectedProject.name}
            </h3>

            {/* Status Select */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Development Stage
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="not_started">Not Started</option>
                <option value="planning">Planning (Architecture & Wireframes)</option>
                <option value="development">Development (Writing Code)</option>
                <option value="testing">Testing (QA & Debugging)</option>
                <option value="completed">Completed & Deployed</option>
              </select>
            </div>

            {/* GitHub URL */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project-repo"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Live Demo URL */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Live Deployment URL
              </label>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={e => setLiveDemoUrl(e.target.value)}
                placeholder="https://myproject.vercel.app"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Submission Notes & Challenges Solved
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Briefly describe your implementation, decisions, and outcomes..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
