import React, { useState } from 'react';
import {
  Flame,
  Radio,
  Share2,
  Users,
  ShieldAlert,
  AlertTriangle,
  Download,
  Send,
  CheckCircle2,
  ShieldCheck,
  Ban,
  Activity,
  Layers,
} from 'lucide-react';
import api from '../services/api';

export const PropagationGnnPage: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [countermeasureStatus, setCountermeasureStatus] = useState<string | null>(null);
  const [botBlocked, setBotBlocked] = useState(false);

  const handlePublishDebunk = () => {
    setCountermeasureStatus('Đã phát hành thông cáo báo chí khẩn và truyền thông hình ảnh đập an toàn.');
    alert('Hệ thống VietXAI đã kích hoạt luồng phát hành Đính chính Chính thức tới Cổng TTĐT và Đài PT-TH.');
  };

  const handleBlockBots = () => {
    setBotBlocked(true);
    alert('Đã gửi yêu cầu kỹ thuật tới TikTok & Meta hạ chỉ số phân phối của 18 tài khoản CIB.');
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleSendA05 = () => {
    alert('Đã chuyển toàn bộ gói dữ liệu giám định SHA256 tới Cục An ninh Mạng và Phòng chống Tội phạm Công nghệ cao (A05) - Bộ Công An.');
  };

  return (
    <div className="space-y-6">
      {/* Top Crisis Banner */}
      <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-rose-700 uppercase tracking-wide">
            MỨC BÁO ĐỘNG CẤP IV: KHỦNG HOẢNG
          </span>
          <span className="hidden sm:inline text-rose-300">|</span>
          <span className="text-slate-700 font-medium">
            Vụ việc: <span className="font-bold">#VN-2024-X892 "Vỡ Đập Tràn Trọng Hạ Du Sông Hồng"</span>
          </span>
        </div>
        <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Theo dõi thời gian thực</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Phân tích Lan truyền Đồ thị (GNN) & Đánh giá Tác động Tâm lý Xã hội
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>LIVE ATTACK TRACE | Thuật toán: GATv2-DeepWalk-VI</span>
          </div>
          <button
            onClick={handlePublishDebunk}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Khởi tạo Phản bác Khẩn</span>
          </button>
        </div>
      </div>

      {/* 3 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: R0 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Hệ số lây nhiễm R₀
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
              Cảnh báo đỏ
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-600 tracking-tight">
              4.82
            </span>
            <span className="text-xs font-bold text-rose-600">
              +1.35/h
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Ngưỡng an toàn &lt; 1.0 (Vượt ngưỡng 382%)
          </div>
        </div>

        {/* Card 2: Virality Velocity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tốc độ lan truyền
            </span>
            <Share2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              125
            </span>
            <span className="text-xs font-medium text-slate-500">
              lượt chia sẻ / phút
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Tập trung chính trên TikTok (54%) &amp; Facebook (31%)
          </div>
        </div>

        {/* Card 3: Reach Scale */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Quy mô tiếp cận
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60">
              Ước tính mô hình
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              850,000
            </span>
            <span className="text-xs font-medium text-slate-500">
              người xem
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Đã tiếp cận thực tế 324.6K người trong khu vực hạ du
          </div>
        </div>
      </div>

      {/* Row 2: GNN Canvas & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: GNN Visual Graph Tree (7/12) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Mô hình Lan truyền GNN</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sơ đồ hóa tuyến phát tán thông tin từ nguồn tới cộng đồng.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Đang giám sát</span>
              </div>
            </div>

            {/* Dark Interactive Canvas for GNN Node Diffusion */}
            <div className="relative mt-4 w-full h-80 rounded-xl bg-[#0f172a] p-4 flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 600 300">
                <defs>
                  <linearGradient id="linkRed" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="linkGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Connecting Edges */}
                <path
                  d="M 90 150 Q 180 80 250 110"
                  stroke="url(#linkRed)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="4 2"
                />
                <path
                  d="M 90 150 Q 180 220 250 200"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  fill="none"
                  strokeOpacity="0.7"
                />
                <path
                  d="M 250 110 Q 360 140 450 160"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  fill="none"
                  strokeOpacity="0.6"
                />
                <path
                  d="M 250 200 Q 360 180 450 160"
                  stroke="#ef4444"
                  strokeWidth="2"
                  fill="none"
                  strokeOpacity="0.6"
                />
                <path
                  d="M 380 60 Q 420 110 450 160"
                  stroke="url(#linkGreen)"
                  strokeWidth="2.5"
                  fill="none"
                />

                {/* Node F0: Source */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setActiveNode('F0')}
                >
                  <circle cx="90" cy="150" r="22" fill="#ef4444" />
                  <circle cx="90" cy="150" r="28" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.4" className="animate-ping" />
                  <text x="90" y="154" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    F0
                  </text>
                  <text x="90" y="185" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Nguồn phát tán
                  </text>
                  <text x="90" y="198" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    @tinmoi_vxx
                  </text>
                </g>

                {/* Node CIB: Bot cluster */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setActiveNode('CIB')}
                >
                  <circle cx="250" cy="110" r="18" fill="#0284c7" />
                  <text x="250" y="114" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    CIB
                  </text>
                  <text x="250" y="138" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Cụm Bot Phối hợp
                  </text>
                  <text x="250" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    18 tài khoản ma
                  </text>
                </g>

                {/* Node F1: Reshare channel */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setActiveNode('F1')}
                >
                  <circle cx="250" cy="200" r="16" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  <text x="250" y="204" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                    F1
                  </text>
                  <text x="250" y="226" fill="#fca5a5" fontSize="10" textAnchor="middle">
                    Kênh chia sẻ lại
                  </text>
                </g>

                {/* Node F2: Downstream public */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setActiveNode('F2')}
                >
                  <circle cx="450" cy="160" r="26" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <text x="450" y="164" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    F2
                  </text>
                  <text x="450" y="198" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Cộng đồng hạ du
                  </text>
                  <text x="450" y="210" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    ~850,000 lượt tiếp cận
                  </text>
                </g>

                {/* Node Official Debunk */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setActiveNode('OFFICIAL')}
                >
                  <circle cx="380" cy="60" r="16" fill="#10b981" />
                  <text x="380" y="64" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ✓
                  </text>
                  <text x="380" y="40" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Đính chính chính thức
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>1. Nguồn tin rác ban đầu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>2. Trung gian khuếch đại</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span>3. Vùng ảnh hưởng</span>
            </div>
          </div>
        </div>

        {/* Right: Anomalous CIB Accounts & Rapid Actions (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Anomalous CIB Accounts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span>Tài khoản Bất thường (CIB)</span>
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
                18 tài khoản
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Hệ thống phát hiện hành vi đồng bộ bất thường (đăng bài cùng lúc, lặp lại nội dung trong vòng 7 giây).
            </p>

            {/* Account List */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-800">user_782012a (TikTok)</span>
                </div>
                <span className="text-slate-500 font-semibold">28 lượt share</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-800">hoang.nam.9912 (Facebook)</span>
                </div>
                <span className="text-slate-500 font-semibold">19 lượt share</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-800">tin_nhanh_song_hong (TikTok)</span>
                </div>
                <span className="text-slate-500 font-semibold">45 lượt share</span>
              </div>
            </div>
          </div>

          {/* Card 2: Rapid Counter-Actions */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
                <span>Hành động Phản bác Nhanh</span>
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                KHUYẾN NGHỊ
              </span>
            </div>

            {/* Action 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  1. Đăng đính chính từ chính quyền
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  Hiệu quả +88%
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Phát hình ảnh Flycam trực tiếp hiện trạng an toàn đập qua Đài PT-TH địa phương.
              </p>
              <button
                onClick={handlePublishDebunk}
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Phát hành Đính chính
              </button>
            </div>

            {/* Action 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  2. Khoanh vùng &amp; Chặn 18 tài khoản ma
                </span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded">
                  Giảm 72% lan truyền
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Gửi yêu cầu cảnh báo thuật toán và hạn chế phân phối tới các nền tảng mạng xã hội.
              </p>
              <button
                onClick={handleBlockBots}
                disabled={botBlocked}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {botBlocked ? 'Đã Gửi Yêu cầu Hạn chế ✓' : 'Gửi Yêu cầu Hạn chế'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Forensic Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-medium">
        <div className="space-y-1 text-slate-600">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="font-sans font-bold text-slate-900">Hash Bằng chứng Đồ thị:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
              SHA256: 9b2d8f99e4b7c120a11c03de4844390bce712
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Bộ giải mã: VietXAI Forensic Engine 2024.11
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Báo cáo Giám định (PDF - Legal)</span>
          </button>

          <button
            onClick={handleSendA05}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Chuyển Cục An ninh Mạng (A05)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropagationGnnPage;
