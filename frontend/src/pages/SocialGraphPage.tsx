import React, { useState } from 'react';
import { Share2, Users, GitFork, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { StatCard } from '../components/cards/StatCard';

export const SocialGraphPage: React.FC = () => {
  const [modelType, setModelType] = useState('GAT');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
            GNN & SOCIAL PROPAGATION
          </span>
          <h2 className="text-xl font-bold text-white">Phân Tích Mạng Xã Hội Bằng Graph Neural Networks (GNN)</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Mô hình hóa quá trình lan truyền thông tin, phát hiện cộng đồng và đo lường tốc độ phát tán (Virality Score) qua PyTorch Geometric.
        </p>
      </div>

      {/* Model Selection Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Kiến trúc GNN:</span>
          {['GAT (Graph Attention)', 'GraphSAGE', 'GCN'].map((m) => (
            <button
              key={m}
              onClick={() => setModelType(m.split(' ')[0])}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                modelType === m.split(' ')[0]
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-300 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
            Dữ liệu đồ thị mô phỏng thực nghiệm (Cascading Benchmark)
          </span>
        </div>
      </div>

      {/* Graph Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tổng Nodes (Người dùng)"
          value="2,480"
          subtitle="Tài khoản tham gia tương tác"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Tổng Cạnh (Chia sẻ / Bình luận)"
          value="8,920"
          subtitle="Tương tác kết nối lan truyền"
          icon={Share2}
          color="brand"
        />
        <StatCard
          title="Độ sâu Tầng lan truyền"
          value="7 Tầng"
          subtitle="Cascade Depth"
          icon={GitFork}
          color="purple"
        />
        <StatCard
          title="Tốc độ Lan truyền"
          value="182 nodes/h"
          subtitle="Virality Speed"
          icon={Activity}
          color="red"
        />
      </div>

      {/* Graph Visualization Simulation Canvas */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2">Trực Quan Hóa Cây Lan Truyền (Information Cascade Tree)</h3>
        <p className="text-xs text-slate-400 mb-6">
          Nút gốc màu đỏ là bài đăng khởi phát tin giả. Các nhánh con thể hiện hành vi chia sẻ và khuếch đại thông tin của các nhóm người dùng.
        </p>

        {/* CSS-based Graph Node Mockup */}
        <div className="relative h-72 w-full bg-slate-900/90 rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between overflow-hidden">
          {/* Level 0: Root */}
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-300 text-xs font-bold shadow-lg shadow-rose-500/30 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Nút Gốc (Bài đăng sai sự thật #101)</span>
            </div>
          </div>

          {/* Level 1: Key Influencers / Bots */}
          <div className="flex justify-around">
            <div className="p-2 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-medium">
              KOL A (50k followers)
            </div>
            <div className="p-2 px-3 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 text-[11px] font-medium">
              Cộng đồng Nhóm B
            </div>
            <div className="p-2 px-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[11px] font-medium">
              Mạng lưới Bot C
            </div>
          </div>

          {/* Level 2: Amplification */}
          <div className="flex justify-between px-8 text-[10px] text-slate-400">
            <span className="p-1.5 px-2.5 rounded bg-slate-800 border border-slate-700">Tầng 3: 140 shares</span>
            <span className="p-1.5 px-2.5 rounded bg-slate-800 border border-slate-700">Tầng 4: 520 shares</span>
            <span className="p-1.5 px-2.5 rounded bg-slate-800 border border-slate-700">Tầng 5: 1,200 shares</span>
            <span className="p-1.5 px-2.5 rounded bg-slate-800 border border-slate-700">Tầng 6: 2,480 shares</span>
          </div>
        </div>
      </div>
    </div>
  );
};
