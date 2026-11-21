import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Image,
  Video,
  Mic,
  BrainCircuit,
  ShieldCheck,
  Share2,
  History,
  Users,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SubNavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

interface NavItem {
  name: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  children?: SubNavItem[];
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const isAnalysisActive = location.pathname.startsWith('/analysis');
  const [analysisOpen, setAnalysisOpen] = useState(true);

  // Tự động mở nhóm khi người dùng chuyển trang vào bất kỳ mục con nào trong /analysis
  useEffect(() => {
    if (isAnalysisActive) {
      setAnalysisOpen(true);
    }
  }, [isAnalysisActive]);

  const analysisSubItems: SubNavItem[] = [
    { name: 'Đa phương thức (Core)', path: '/analysis/multimodal', icon: Layers, tag: 'Core' },
    { name: 'Phân tích Văn bản', path: '/analysis/text', icon: FileText },
    { name: 'Phân tích Hình ảnh', path: '/analysis/image', icon: Image },
    { name: 'Phân tích Video', path: '/analysis/video', icon: Video },
    { name: 'Phân tích Âm thanh', path: '/analysis/audio', icon: Mic },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-900/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            SIC DETECT <span className="text-[10px] bg-brand-500/20 text-brand-400 font-mono px-1.5 py-0.5 rounded border border-brand-500/30">AI</span>
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-[150px]">Đa phương thức VN</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu Nghiên Cứu & Phân Tích
        </div>

        {/* 1. Dashboard Tổng quan */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Dashboard Tổng quan</span>
          </div>
        </NavLink>

        {/* 2. NHÓM PHÂN TÍCH AI (GOM GỌN 5 MỤC VÀO 1 DROPDOWN) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setAnalysisOpen(!analysisOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isAnalysisActive
                ? 'bg-slate-800/80 text-brand-400 border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 flex-shrink-0 text-brand-400" />
              <span className="truncate font-semibold">Phân tích AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-mono">
                AI Core
              </span>
              {analysisOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" />
              )}
            </div>
          </button>

          {/* Sub-items được thụt lề và gom gọn khi mở */}
          {analysisOpen && (
            <div className="ml-3 pl-3 border-l border-slate-800 space-y-1 pt-1 animate-fadeIn">
              {analysisSubItems.map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <SubIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{sub.name}</span>
                    </div>
                    {sub.tag && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                        {sub.tag}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Giải thích AI (XAI) */}
        <NavLink
          to="/results/xai"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Giải thích AI (XAI)</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            XAI
          </span>
        </NavLink>

        {/* 4. Kiểm chứng Bằng chứng */}
        <NavLink
          to="/fact-check"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Kiểm chứng Bằng chứng</span>
          </div>
        </NavLink>

        {/* 5. Đồ thị Mạng xã hội (GNN) */}
        <NavLink
          to="/social-graph"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <Share2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Đồ thị Mạng xã hội (GNN)</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            GNN
          </span>
        </NavLink>

        {/* 6. Lịch sử Phân tích */}
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <History className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Lịch sử Phân tích</span>
          </div>
        </NavLink>

        {/* 7. Quản lý Người dùng */}
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Quản lý Người dùng</span>
          </div>
        </NavLink>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-slate-300">Hệ thống AI v0.1.0</span>
          <span className="inline-block w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
        </div>
        <p className="text-[11px] text-slate-400">Đề tài NCKH Mạng xã hội VN</p>
      </div>
    </aside>
  );
};

export default Sidebar;
