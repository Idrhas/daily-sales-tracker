import React from 'react';
import { 
  DollarSign, 
  Share2, 
  Database, 
  LogOut, 
  Calendar, 
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';

export default function Header({ 
  user, 
  isAdmin, 
  onLogout, 
  onOpenShare, 
  onOpenBackups,
  onGoToPublic,
  onGoToAdmin
}) {
  const currentDate = new Date().toLocaleDateString(undefined, { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & App Name */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <DollarSign className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">SalesTracker</span>
                {isAdmin ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-white flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" /> Admin Portal
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Live Records
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {currentDate}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isAdmin ? (
              /* REGULAR GENERAL VIEW: Completely clean, no sign-in buttons */
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Updated</span>
                </span>
              </div>
            ) : (
              /* ADMIN VIEW: Management tools */
              <>
                <button
                  onClick={onGoToPublic}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Switch to General Public View"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View Public Page</span>
                </button>

                <button
                  onClick={onOpenShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  title="Share Read-Only View"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Share Link</span>
                </button>

                <button
                  onClick={onOpenBackups}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  title="Manage Backups & Cloud Sync"
                >
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline">Backups</span>
                </button>

                {user && (
                  <div className="flex items-center pl-2 border-l border-slate-200 space-x-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-slate-800">{user.username}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
