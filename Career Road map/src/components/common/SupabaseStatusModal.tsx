import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { isSupabaseConfigured, testSupabaseConnection } from '../../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../../data/sqlSchema';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Supabase Database & Backend</h2>
              <p className="text-xs text-slate-400">PostgreSQL Schema, Storage & Connection Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="my-4 p-4 rounded-xl border flex items-start gap-3 bg-slate-950/60 border-slate-800">
          {isConfigured ? (
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-slate-200">
                {isConfigured ? 'Remote Supabase Configured' : 'Local Zero-Data Persistence Mode Active'}
              </span>
              <button
                onClick={handleTest}
                disabled={isTesting}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                Test Connection
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isConfigured
                ? 'Your app is configured with environment variables pointing to your remote Supabase instance.'
                : 'No remote Supabase credentials detected in .env. Running locally with PostgreSQL-equivalent zero-data storage.'}
            </p>
            {testResult && (
              <div
                className={`mt-2 text-xs p-2 rounded-lg border ${
                  testResult.success
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>
        </div>

        {/* Database Zero Data Rule Banner */}
        <div className="mb-4 p-3.5 rounded-xl bg-brand-950/40 border border-brand-800/40 flex items-start gap-2.5 text-xs text-brand-200">
          <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-brand-300">Strict Zero-Data Policy Active: </span>
            The database starts 100% empty. There are no preloaded courses, fake students, fake hours, or fake streaks. Everything is created dynamically by the Administrator.
          </div>
        </div>

        {/* SQL Schema View */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              PostgreSQL Schema (supabase-schema.sql)
            </span>
            <button
              onClick={handleCopySchema}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-500/20"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}
            </button>
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl p-3 overflow-auto font-mono text-xs text-slate-300">
            <pre className="whitespace-pre">{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>To connect live Supabase: Add URL and Anon Key in</span>
            <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded">.env</code>
          </div>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 font-medium"
          >
            Open Supabase Console <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
