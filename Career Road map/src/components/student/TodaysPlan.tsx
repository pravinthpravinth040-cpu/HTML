import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  Circle,
  FileEdit,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../common/EmptyState';
import { Task } from '../../types';

export const TodaysPlan: React.FC = () => {
  const { tasks, taskProgress, updateTaskStatus, topics } = useData();
  const [selectedTaskForNotes, setSelectedTaskForNotes] = useState<Task | null>(null);
  const [taskNotes, setTaskNotes] = useState('');

  // Show only published tasks
  const publishedTasks = tasks.filter(t => t.status === 'published');

  const handleToggle = async (task: Task) => {
    const current = taskProgress.find(tp => tp.taskId === task.id);
    const newStatus = current?.status === 'completed' ? 'not_started' : 'completed';
    await updateTaskStatus(task.id, newStatus, current?.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedTaskForNotes) return;
    const current = taskProgress.find(tp => tp.taskId === selectedTaskForNotes.id);
    await updateTaskStatus(
      selectedTaskForNotes.id,
      current?.status || 'not_started',
      taskNotes
    );
    setSelectedTaskForNotes(null);
    setTaskNotes('');
  };

  const completedCount = publishedTasks.filter(t =>
    taskProgress.some(tp => tp.taskId === t.id && tp.status === 'completed')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Structured Daily Roadmap Plan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Today&apos;s Plan & Tasks</h1>
          <p className="text-xs text-slate-400 mt-1">
            Step-by-step assigned exercises and assignments linked to your current roadmap topics.
          </p>
        </div>

        {publishedTasks.length > 0 && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400">Completion:</span>
            <span className="font-bold text-slate-200">
              {completedCount} / {publishedTasks.length} Done
            </span>
          </div>
        )}
      </div>

      {/* Task List or Empty State */}
      {publishedTasks.length === 0 ? (
        <EmptyState
          icon="task"
          title="No Tasks Assigned"
          description="No tasks assigned for today. When your administrator publishes tasks and assignments for your roadmap topics, they will appear here."
        />
      ) : (
        <div className="space-y-3">
          {publishedTasks.map(task => {
            const progress = taskProgress.find(tp => tp.taskId === task.id);
            const isCompleted = progress?.status === 'completed';
            const isInProgress = progress?.status === 'in_progress';
            const parentTopic = topics.find(t => t.id === task.topicId);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-950/60 border-emerald-900/30'
                    : isInProgress
                    ? 'bg-slate-900/80 border-brand-500/40'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggle(task)}
                      className="mt-0.5 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                      )}
                    </button>

                    <div>
                      <h3
                        className={`text-sm font-semibold ${
                          isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-[11px] text-slate-500">
                        {parentTopic && (
                          <span className="text-brand-400 font-medium">
                            Topic: {parentTopic.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {task.estimatedDurationMinutes} mins
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {task.difficulty}
                        </span>
                        {task.deadline && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Calendar className="w-3 h-3" />
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {progress?.notes && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                          <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                            My Notes:
                          </span>
                          {progress.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTaskForNotes(task);
                      setTaskNotes(progress?.notes || '');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
                    title="Add Study Notes"
                  >
                    <FileEdit className="w-4 h-4" />
                    <span className="hidden sm:inline">Notes</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Notes Modal */}
      {selectedTaskForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-bold text-base text-slate-100 mb-1">
              Task Notes: {selectedTaskForNotes.title}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Write any findings, formulas, or links related to this study task.
            </p>
            <textarea
              value={taskNotes}
              onChange={e => setTaskNotes(e.target.value)}
              placeholder="e.g. Completed step 1, encountered issue with CORS, resolved using proxy..."
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedTaskForNotes(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
