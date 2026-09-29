import React, { useState } from 'react';
import {
  Bell,
  Search,
  Database,
  LogOut,
  User,
  Shield,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SupabaseStatusModal } from './SupabaseStatusModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenSearch }) => {
  const { profile, role, logout } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  const isConfigured = isSupabaseConfigured();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand Tagline */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-brand-500/25">
              C
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-100 tracking-tight text-base">CareerPath</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Learn. Build. Track. Become Job Ready.</p>
            </div>
          </div>
        </div>

        {/* Center: Global Search trigger */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            onClick={onOpenSearch}
            className="w-full h-9 px-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-between transition-colors shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <span>Search careers, roadmap topics, materials, projects...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: DB Status + Notifications + Role Badge + User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase status indicator badge */}
          <button
            onClick={() => setShowSupabaseModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
            title="Supabase Database Status & SQL Schema"
          >
            <Database className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden lg:inline text-xs">Database:</span>
            {isConfigured ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Zero-Data Mode
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800/80 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white font-bold text-[10px] flex items-center justify-center shadow-lg shadow-brand-500/40 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-400" />
                    Notifications
                  </h4>
                  <span className="text-xs text-slate-400">
                    {unreadCount} unread
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50 my-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center">
                      <Bell className="w-8 h-8 text-slate-600 mb-2" />
                      <span>No notifications yet</span>
                      <p className="text-[11px] text-slate-500 mt-1">
                        System events and milestones will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-colors text-xs flex items-start gap-2.5 ${
                          n.read ? 'hover:bg-slate-800/40 text-slate-400' : 'bg-slate-800/60 text-slate-200'
                        }`}
                      >
                        <div className="mt-0.5">
                          {n.type === 'success' || n.type === 'achievement' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-brand-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-100">{n.title}</p>
                          <p className="text-slate-400 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800">
            {role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Admin</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300">Student</span>
              </>
            )}
          </div>

          {/* User profile button & Logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden xl:inline text-xs font-medium text-slate-200 max-w-[120px] truncate">
                {profile?.fullName || 'Account'}
              </span>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Supabase Status & SQL Schema Modal */}
      <SupabaseStatusModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </>
  );
};
