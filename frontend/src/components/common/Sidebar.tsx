import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Image,
  Video,
  Database,
  Share2,
  History,
  Users,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  tagColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Tổng quan',
    items: [
      { name: 'Dashboard Tổng quan', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Phân tích AI',
    items: [
      {
        name: 'Đa phương thức (Core)',
        path: '/checker',
        icon: Sparkles,
        tag: 'AI Core',
        tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      },
      { name: 'Phân tích Văn bản', path: '/analysis/text', icon: FileText },
      { name: 'Phân tích Hình ảnh', path: '/analysis/image', icon: Image },
      { name: 'Phân tích Video', path: '/analysis/video', icon: Video },
    ],
  },
  {
    title: 'Mạng xã hội & Lan truyền',
    items: [
      {
        name: 'Giám sát Xu hướng Xã hội',
        path: '/social-graph',
        icon: Share2,
        tag: 'GNN Model',
        tagColor: 'bg-amber-50 text-amber-800 border-amber-300',
      },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { name: 'Lịch sử Phân tích', path: '/history', icon: History },
      { name: 'Quản lý Người dùng', path: '/users', icon: Users },
    ],
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r-2 border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-30 select-none shadow-sm">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b-2 border-slate-200 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0a192f] flex items-center justify-center text-white shadow-sm border border-slate-800">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight text-slate-900 leading-tight">
              ViFact XAI
            </span>
            <span className="text-[10px] text-slate-600 font-semibold truncate max-w-[140px]">
              Hệ thống Học sâu Đa phương thức
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border-2 border-sky-300 font-extrabold">
          v2.4
        </span>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-black tracking-wider text-slate-500 uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#0a192f] text-white shadow-sm font-black border border-slate-900'
                        : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 font-bold'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 stroke-[2.2] ${isActive ? 'text-sky-400' : 'text-slate-700'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.tag && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-extrabold border ${
                            isActive
                              ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                              : item.tagColor || 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {item.tag}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3.5 border-t-2 border-slate-200 bg-slate-50 text-xs text-slate-700">
        <div className="flex items-center justify-between mb-1">
          <span className="font-extrabold text-slate-900 text-[11px]">Không gian Nghiên cứu</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
        </div>
        <p className="text-[10px] text-slate-600 font-medium">Đề tài NCKH Mạng xã hội VN</p>
      </div>
    </aside>
  );
};

export default Sidebar;
