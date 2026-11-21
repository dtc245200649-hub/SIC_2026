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
  CartesianGrid,
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
  { name: 'Đa phương thức (Multimodal)', value: 45, color: '#059669' },
  { name: 'Văn bản (Text)', value: 25, color: '#0284c7' },
  { name: 'Hình ảnh (Image)', value: 15, color: '#d97706' },
  { name: 'Video & Keyframes', value: 10, color: '#e11d48' },
  { name: 'Âm thanh (Audio)', value: 5, color: '#7c3aed' },
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
        color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
        icon: CheckCircle2,
      };
    case 'GAY_HIEU_LAM':
      return {
        label: 'Gây hiểu lầm',
        color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        icon: AlertTriangle,
      };
    case 'SAI_SU_THAT':
      return {
        label: 'Sai sự thật',
        color: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
        icon: XCircle,
      };
    default:
      return {
        label: 'Chưa đủ chứng cứ',
        color: 'bg-slate-100 text-slate-800 border-slate-300 font-bold',
        icon: HelpCircle,
      };
  }
};

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner - Deep Solid Navy with Sharp White Typography */}
      <div className="p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0a192f] border border-slate-700 shadow-md">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
            Học sâu Đa phương thức & Giải thích XAI
          </span>
          <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
            Nền tảng Giám sát & Phát hiện Tin giả Mạng xã hội Việt Nam
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-medium">
            Hệ thống phân tích đồng thời Văn bản (PhoBERT), Thị giác (ViT), Giọng nói (Whisper) kết hợp cơ chế Cross-modal Attention và đối soát chứng cứ báo chí chính thống.
          </p>
        </div>

        <Link
          to="/checker"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2 whitespace-nowrap transition"
        >
          <Layers className="w-4 h-4" />
          <span>Kiểm chứng trực tiếp & XAI</span>
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
      <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Lối tắt Phân tích theo Phương thức
          </h3>
          <span className="text-xs text-slate-500 font-medium">5 mô hình đơn / đa phương thức</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link
            to="/analysis/multimodal"
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-300 hover:border-emerald-500 transition group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition border border-emerald-300">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-900">Đa phương thức</span>
            <span className="text-[11px] text-slate-600 mt-0.5 font-medium">Text + Visual + Audio</span>
          </Link>

          <Link
            to="/analysis/text"
            className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-300 hover:border-sky-500 transition group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-2 group-hover:scale-105 transition border border-sky-300">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-900">Văn bản (Text)</span>
            <span className="text-[11px] text-slate-600 mt-0.5 font-medium">PhoBERT v2</span>
          </Link>

          <Link
            to="/analysis/image"
            className="p-4 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-300 hover:border-amber-500 transition group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition border border-amber-300">
              <Image className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-900">Hình ảnh (Image)</span>
            <span className="text-[11px] text-slate-600 mt-0.5 font-medium">Vision Transformer ViT</span>
          </Link>

          <Link
            to="/analysis/video"
            className="p-4 rounded-xl bg-slate-50 hover:bg-rose-50/60 border border-slate-300 hover:border-rose-500 transition group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-2 group-hover:scale-105 transition border border-rose-300">
              <Video className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-900">Video (Keyframes)</span>
            <span className="text-[11px] text-slate-600 mt-0.5 font-medium">OpenCV Temporal</span>
          </Link>

          <Link
            to="/analysis/audio"
            className="p-4 rounded-xl bg-slate-50 hover:bg-purple-50/60 border border-slate-300 hover:border-purple-500 transition group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition border border-purple-300">
              <Mic className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-slate-900">Âm thanh (Audio)</span>
            <span className="text-[11px] text-slate-600 mt-0.5 font-medium">Whisper STT</span>
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-300 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Xu hướng Phân tích trong tuần</h3>
              <p className="text-xs text-slate-600 font-medium">Tỷ lệ nội dung được xác minh vs sai sự thật</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 font-semibold">
              7 ngày qua
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#334155" fontSize={11} fontWeight={600} />
                <YAxis stroke="#334155" fontSize={11} fontWeight={600} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#ffffff',
                    fontWeight: 500,
                  }}
                />
                <Area type="monotone" dataKey="total" name="Tổng phân tích" stroke="#059669" strokeWidth={2.5} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="fake" name="Sai sự thật" stroke="#e11d48" strokeWidth={2.5} fill="url(#colorFake)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modality Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Phân bổ Phương thức</h3>
            <p className="text-xs text-slate-600 font-medium">Tỷ trọng các luồng dữ liệu tiếp nhận</p>
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
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 text-xs">
            {modalityDistribution.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900 font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Phiên Phân tích Gần đây</h3>
            <p className="text-xs text-slate-600 font-medium">Lịch sử đánh giá với chỉ số mâu thuẫn chéo (Inconsistency Score)</p>
          </div>
          <Link to="/history" className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 hover:underline">
            Xem tất cả
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-700 font-bold">
                <th className="pb-3 pr-4">Tiêu đề bài đăng / Nội dung</th>
                <th className="pb-3 px-2">Phương thức</th>
                <th className="pb-3 px-2">Dự đoán AI</th>
                <th className="pb-3 px-2">Độ tin cậy</th>
                <th className="pb-3 px-2">Mâu thuẫn chéo</th>
                <th className="pb-3 px-2">Thời gian</th>
                <th className="pb-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentAnalyses.map((item) => {
                const badge = getBadge(item.prediction);
                const BadgeIcon = badge.icon;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 pr-4 font-semibold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 font-mono text-[11px] font-bold">
                        {item.modality}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] ${badge.color}`}>
                        <BadgeIcon className="w-3 h-3 stroke-[2.2]" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-900">
                      {(item.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                          <div
                            className={`h-full rounded-full ${
                              item.inconsistency > 0.6
                                ? 'bg-rose-600'
                                : item.inconsistency > 0.3
                                ? 'bg-amber-600'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${item.inconsistency * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-700 font-mono font-bold">
                          {(item.inconsistency * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600 font-medium">{item.date}</td>
                    <td className="py-3.5 text-right">
                      <Link
                        to="/checker"
                        className="text-sky-700 hover:text-sky-800 font-bold inline-flex items-center gap-0.5"
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

export default DashboardPage;
