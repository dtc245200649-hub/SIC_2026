import React from 'react';
import { LogOut, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { authService } from '../../services/auth.service';

export const Navbar: React.FC = () => {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
  };

  const primaryRole = user?.roles?.[0]?.name || (user?.is_superuser ? 'Admin' : 'Analyst');

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-slate-100 hidden sm:block">
          Học sâu Đa phương thức & Giải thích XAI
        </h1>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PhoBERT + ViT + VideoMAE</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-slate-200 leading-none">
                  {user.full_name || user.username}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Shield className="w-2.5 h-2.5 text-brand-400" />
                  {primaryRole}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="text-xs px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
          >
            Đăng nhập
          </a>
        )}
      </div>
    </header>
  );
};
