import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Share2,
  History,
  Users,
  BrainCircuit,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard Tổng quan', path: '/', icon: LayoutDashboard },
  {
    name: 'Kiểm chứng & Giải thích XAI',
    path: '/checker',
    icon: Sparkles,
    tag: 'Core XAI',
  },
  { name: 'Đồ thị Mạng xã hội (GNN)', path: '/social-graph', icon: Share2, tag: 'GNN' },
  { name: 'Lịch sử Phân tích', path: '/history', icon: History },
  { name: 'Quản lý Người dùng', path: '/users', icon: Users },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-900/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            ViFact XAI <span className="text-[10px] bg-sky-500/20 text-sky-400 font-mono px-1.5 py-0.5 rounded border border-sky-500/30">AI</span>
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-[150px]">Kiểm chứng Đa phương thức</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu Nghiên Cứu & Kiểm Chứng
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </div>
              {item.tag && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700 font-mono">
                  {item.tag}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-slate-300">ViFact XAI v1.0</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <p className="text-[11px] text-slate-400">Đề tài NCKH Mạng xã hội VN</p>
      </div>
    </aside>
  );
};

export default Sidebar;
