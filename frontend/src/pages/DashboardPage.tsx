import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Image,
  Video,
  Mic,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '../components/cards/StatCard';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const trendData = [
  { name: 'Thứ 2', total: 12, fake: 4, verified: 8 },
  { name: 'Thứ 3', total: 18, fake: 7, verified: 11 },
  { name: 'Thứ 4', total: 24, fake: 9, verified: 15 },
  { name: 'Thứ 5', total: 32, fake: 14, verified: 18 },
  { name: 'Thứ 6', total: 28, fake: 10, verified: 18 },
  { name: 'Thứ 7', total: 42, fake: 19, verified: 23 },
  { name: 'CN', total: 35, fake: 15, verified: 20 },
];

const modalityDistribution = [
  { name: 'Đa phương thức (Multimodal)', value: 45, color: '#10b981' },
  { name: 'Văn bản (Text)', value: 25, color: '#38bdf8' },
  { name: 'Hình ảnh (Image)', value: 15, color: '#f59e0b' },
  { name: 'Video & Keyframes', value: 10, color: '#ec4899' },
  { name: 'Âm thanh (Audio)', value: 5, color: '#a855f7' },
];

const recentAnalyses = [
  {
    id: 101,
    title: 'Tin giả: Đột biến giá vàng và lời kêu gọi rút tiền ngân hàng',
    modality: 'MULTIMODAL',
    prediction: 'SAI_SU_THAT',
    confidence: 0.94,
    inconsistency: 0.82,
    date: '10 phút trước',
  },
  {
    id: 102,
    title: 'Thông cáo chính thức: Lịch thi tốt nghiệp THPT Quốc gia 2026',
    modality: 'TEXT',
    prediction: 'CHINH_XAC',
    confidence: 0.98,
    inconsistency: 0.05,
    date: '1 giờ trước',
  },
  {
    id: 103,
    title: 'Hình ảnh chỉnh sửa AI: Vỡ đập thủy điện miền Trung',
    modality: 'IMAGE',
    prediction: 'GAY_HIEU_LAM',
    confidence: 0.87,
    inconsistency: 0.74,
    date: '3 giờ trước',
  },
  {
    id: 104,
    title: 'Băng ghi âm cắt ghép phát ngôn lãnh đạo về chính sách đất đai',
    modality: 'AUDIO',
    prediction: 'CHUA_DU_THONG_TIN',
    confidence: 0.61,
    inconsistency: 0.40,
    date: 'Hôm qua',
  },
];

const getBadge = (pred: string) => {
  switch (pred) {
    case 'CHINH_XAC':
      return {
        label: 'Chính xác',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: CheckCircle2,
      };
    case 'GAY_HIEU_LAM':
      return {
        label: 'Gây hiểu lầm',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: AlertTriangle,
      };
    case 'SAI_SU_THAT':
      return {
        label: 'Sai sự thật',
        color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: XCircle,
      };
    default:
      return {
        label: 'Chưa đủ chứng cứ',
        color: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        icon: HelpCircle,
      };
  }
};

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-brand-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/40">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
            Học sâu Đa phương thức & Giải thích XAI
          </span>
          <h2 className="text-2xl font-bold text-white mt-2">
            Nền tảng Giám sát & Phát hiện Tin giả Mạng xã hội Việt Nam
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Hệ thống phân tích đồng thời Văn bản (PhoBERT), Thị giác (ViT), Giọng nói (Whisper) kết hợp cơ chế Cross-modal Attention và đối soát chứng cứ báo chí chính thống.
          </p>
        </div>

        <Link
          to="/analysis/multimodal"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 text-white font-medium text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 whitespace-nowrap transition"
        >
          <Layers className="w-4 h-4" />
          <span>Bắt đầu Phân tích Đa phương thức</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Tổng lượt phân tích"
          value="1,248"
          subtitle="Tất cả các phương thức"
          icon={TrendingUp}
          change="+18.4%"
          color="blue"
        />
        <StatCard
          title="Nội dung Sai sự thật"
          value="412"
          subtitle="Đã đối soát chứng cứ"
          icon={XCircle}
          change="-4.2%"
          isPositive={false}
          color="red"
        />
        <StatCard
          title="Nghi vấn / Gây hiểu lầm"
          value="320"
          subtitle="Mâu thuẫn ảnh - lời"
          icon={AlertTriangle}
          change="+6.1%"
          color="amber"
        />
        <StatCard
          title="Chính xác / Được xác thực"
          value="516"
          subtitle="Khớp nguồn chính thống"
          icon={CheckCircle2}
          change="+12.0%"
          color="brand"
        />
      </div>

      {/* Quick Launch Analysis Tools */}
      <div className="glass-panel p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-white mb-3">Lối tắt Phân tích theo Phương thức</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            to="/analysis/multimodal"
            className="p-3.5 rounded-xl bg-slate-800/70 hover:bg-brand-600/15 border border-slate-700/60 hover:border-brand-500/40 transition group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Đa phương thức</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Text + Visual + Audio</span>
          </Link>

          <Link
            to="/analysis/text"
            className="p-3.5 rounded-xl bg-slate-800/70 hover:bg-sky-600/15 border border-slate-700/60 hover:border-sky-500/40 transition group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Văn bản (Text)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">PhoBERT v2</span>
          </Link>

          <Link
            to="/analysis/image"
            className="p-3.5 rounded-xl bg-slate-800/70 hover:bg-amber-600/15 border border-slate-700/60 hover:border-amber-500/40 transition group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Image className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Hình ảnh (Image)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Vision Transformer ViT</span>
          </Link>

          <Link
            to="/analysis/video"
            className="p-3.5 rounded-xl bg-slate-800/70 hover:bg-pink-600/15 border border-slate-700/60 hover:border-pink-500/40 transition group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Video (Keyframes)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">OpenCV Temporal</span>
          </Link>

          <Link
            to="/analysis/audio"
            className="p-3.5 rounded-xl bg-slate-800/70 hover:bg-purple-600/15 border border-slate-700/60 hover:border-purple-500/40 transition group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-white">Âm thanh (Audio)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Whisper STT</span>
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Xu hướng Phân tích trong tuần</h3>
              <p className="text-xs text-slate-400">Tỷ lệ nội dung được xác minh vs sai sự thật</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="total" name="Tổng phân tích" stroke="#10b981" fill="url(#colorTotal)" strokeWidth={2} />
                <Area type="monotone" dataKey="fake" name="Sai sự thật" stroke="#f43f5e" fill="url(#colorFake)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modality Donut Chart */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Phân bổ Phương thức</h3>
            <p className="text-xs text-slate-400">Tỷ trọng các luồng dữ liệu tiếp nhận</p>
          </div>
          <div className="h-48 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modalityDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {modalityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {modalityDistribution.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Phiên Phân tích Gần đây</h3>
            <p className="text-xs text-slate-400">Lịch sử đánh giá với chỉ số mâu thuẫn chéo (Inconsistency Score)</p>
          </div>
          <Link to="/history" className="text-xs font-medium text-brand-400 hover:underline flex items-center gap-1">
            Xem tất cả
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Tiêu đề bài đăng / Nội dung</th>
                <th className="pb-3 font-medium">Phương thức</th>
                <th className="pb-3 font-medium">Dự đoán AI</th>
                <th className="pb-3 font-medium">Độ tin cậy</th>
                <th className="pb-3 font-medium">Mâu thuẫn chéo</th>
                <th className="pb-3 font-medium">Thời gian</th>
                <th className="pb-3 text-right font-medium">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentAnalyses.map((item) => {
                const badge = getBadge(item.prediction);
                const BadgeIcon = badge.icon;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 pr-4 font-medium text-slate-200 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]">
                        {item.modality}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium ${badge.color}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-200">
                      {(item.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.inconsistency > 0.6
                                ? 'bg-rose-500'
                                : item.inconsistency > 0.3
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.inconsistency * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(item.inconsistency * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400">{item.date}</td>
                    <td className="py-3 text-right">
                      <Link
                        to="/results/xai"
                        className="text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-0.5"
                      >
                        XAI <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
