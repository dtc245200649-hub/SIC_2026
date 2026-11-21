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
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-900 hidden sm:block">
          ViFact XAI · Hệ thống Học sâu Đa phương thức
        </h1>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PhoBERT + ViT + Whisper</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-[#0a192f] text-white flex items-center justify-center text-xs font-bold">
                <UserIcon className="w-4 h-4 text-sky-300" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-none">
                  {user.full_name || user.username}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                  <Shield className="w-2.5 h-2.5 text-sky-600" />
                  {primaryRole}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="text-xs px-3.5 py-1.5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-semibold transition-colors"
          >
            Đăng nhập
          </a>
        )}
      </div>
    </header>
  );
};

export default Navbar;
