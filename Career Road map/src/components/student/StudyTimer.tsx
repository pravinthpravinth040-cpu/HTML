import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Volume2,
  VolumeX,
  History
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { triggerConfetti } from '../common/Confetti';
import { EmptyState } from '../common/EmptyState';

export const StudyTimer: React.FC = () => {
  const { logStudySession, studySessions, topics, totalStudyHours, currentStreak } = useData();

  const [mode, setMode] = useState<'25_min' | '50_min' | 'custom'>('25_min');
  const [customMinutes, setCustomMinutes] = useState(15);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  // Timer state
  const initialSeconds = mode === '25_min' ? 25 * 60 : mode === '50_min' ? 50 * 60 : customMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedInSession, setElapsedInSession] = useState(0);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<any>(null);

  // Sync initial seconds when mode changes (if not running)
  useEffect(() => {
    if (!isRunning) {
      const sec = mode === '25_min' ? 25 * 60 : mode === '50_min' ? 50 * 60 : customMinutes * 60;
      setTimeLeft(sec);
      setElapsedInSession(0);
    }
  }, [mode, customMinutes]);

  // Tick timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSessionComplete();
            return 0;
          }
          setElapsedInSession(el => el + 1);
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleSessionComplete = async () => {
    setIsRunning(false);

    const totalSecondsCompleted =
      mode === '25_min' ? 25 * 60 : mode === '50_min' ? 50 * 60 : customMinutes * 60;

    const matchedTopic = topics.find(t => t.id === selectedTopicId);

    // Save session in database
    await logStudySession(
      totalSecondsCompleted,
      mode,
      selectedTopicId || undefined,
      matchedTopic?.name
    );

    triggerConfetti();

    // Play completion tone if sound is enabled
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (e) {
        // Fallback
      }
    }

    // Reset
    setTimeLeft(totalSecondsCompleted);
    setElapsedInSession(0);
  };

  const handleManualSave = async () => {
    if (elapsedInSession < 60) {
      alert('A session must be at least 1 minute long to be recorded in your database.');
      return;
    }

    setIsRunning(false);
    const matchedTopic = topics.find(t => t.id === selectedTopicId);
    await logStudySession(
      elapsedInSession,
      mode,
      selectedTopicId || undefined,
      matchedTopic?.name
    );

    triggerConfetti();
    const sec = mode === '25_min' ? 25 * 60 : mode === '50_min' ? 50 * 60 : customMinutes * 60;
    setTimeLeft(sec);
    setElapsedInSession(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    const sec = mode === '25_min' ? 25 * 60 : mode === '50_min' ? 50 * 60 : customMinutes * 60;
    setTimeLeft(sec);
    setElapsedInSession(0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = Math.min(
    100,
    Math.round(((initialSeconds - timeLeft) / initialSeconds) * 100)
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
          <Clock className="w-4 h-4" />
          <span>Focused Study Timer & Log</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Study Session Timer</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete Pomodoro sessions to automatically log your study hours, maintain your streak, and improve career readiness.
        </p>
      </div>

      {/* Timer Container */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center shadow-xl">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 mb-8">
          <button
            onClick={() => {
              setMode('25_min');
              setIsRunning(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === '25_min'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            25 Minutes (Standard)
          </button>

          <button
            onClick={() => {
              setMode('50_min');
              setIsRunning(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === '50_min'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            50 Minutes (Deep Work)
          </button>

          <button
            onClick={() => {
              setMode('custom');
              setIsRunning(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'custom'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Custom Minutes Input */}
        {mode === 'custom' && (
          <div className="flex items-center gap-2 mb-6 text-xs text-slate-300">
            <span>Duration (minutes):</span>
            <input
              type="number"
              min={1}
              max={180}
              value={customMinutes}
              onChange={e => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 15))}
              className="w-16 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs font-bold text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        )}

        {/* Optional Topic Link */}
        {topics.length > 0 && (
          <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
            <span>Link session to topic:</span>
            <select
              value={selectedTopicId}
              onChange={e => setSelectedTopicId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">General Study Session</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Big Digital Clock Display */}
        <div className="relative w-64 h-64 flex flex-col items-center justify-center my-4">
          {/* Circular Progress SVG */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="#6366f1"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Clock Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-black text-white tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
              {isRunning ? 'Focus Mode' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/25'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            {isRunning ? 'Pause' : 'Start Focus'}
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {elapsedInSession >= 60 && !isRunning && (
            <button
              onClick={handleManualSave}
              className="px-4 py-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
            >
              Log Elapsed ({Math.round(elapsedInSession / 60)}m)
            </button>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3.5 rounded-2xl border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-brand-400" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Real Study History (from DB study_sessions) */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-base text-slate-100">Verified Study History</h2>
          </div>
          <span className="text-xs text-slate-400">
            Total Logged: <strong className="text-slate-200">{totalStudyHours} hrs</strong>
          </span>
        </div>

        {studySessions.length === 0 ? (
          <EmptyState
            icon="study"
            title="No Study Sessions Recorded"
            description="Your study activity log is currently empty. Run a focus timer session above to automatically record verified study hours."
            compact
          />
        ) : (
          <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
            {studySessions.slice(0, 10).map(session => (
              <div
                key={session.id}
                className="py-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">
                      {session.topicName || 'Focus Study Session'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Mode: {session.mode.replace('_', ' ')} • {session.date}
                    </p>
                  </div>
                </div>

                <span className="font-mono font-bold text-slate-100 bg-slate-800 px-2.5 py-1 rounded-lg">
                  {Math.round(session.durationSeconds / 60)} mins
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
