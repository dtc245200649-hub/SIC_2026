import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Share2,
  History,
  Users,
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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-30 select-none shadow-sm">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0a192f] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-900 leading-tight">
              ViFact XAI
            </span>
            <span className="text-[10px] text-slate-500 truncate max-w-[140px]">Học sâu Đa phương thức</span>
          </div>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-bold">
          v2.4
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                    ? 'bg-[#0a192f] text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </div>
              {item.tag && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                  {item.tag}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/80 text-xs text-slate-600">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-slate-800 text-[11px]">Không gian Nghiên cứu</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <p className="text-[10px] text-slate-500">Đề tài NCKH Mạng xã hội VN</p>
      </div>
    </aside>
  );
};

export default Sidebar;
