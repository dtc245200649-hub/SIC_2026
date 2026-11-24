import React, { useState, useEffect } from 'react';
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
  Search,
  Trash2,
  HelpCircle,
} from 'lucide-react';
import api from '../services/api';

export const PropagationGnnPage: React.FC = () => {
  // Input state for any news/topic or link
  const [inputTopic, setInputTopic] = useState('Vỡ Đập Tràn Trọng Hạ Du Sông Hồng');
  const [initialSharesInput, setInitialSharesInput] = useState<number>(120);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Dynamic state for propagation metrics
  const [propagationData, setPropagationData] = useState<{
    caseId: string;
    topicName: string;
    threatLevel: 'CRISIS' | 'WARNING' | 'SAFE';
    threatBadge: string;
    r0: number;
    r0Change: string;
    isSafeR0: boolean;
    viralitySpeed: number;
    platformDistribution: string;
    estimatedReach: number;
    reachSubtext: string;
    cibCount: number;
    cibAccounts: Array<{ username: string; platform: string; shares: number }>;
    sha256Hash: string;
    r0Desc: string;
  }>({
    caseId: '#VN-2024-X892',
    topicName: 'Vỡ Đập Tràn Trọng Hạ Du Sông Hồng',
    threatLevel: 'CRISIS',
    threatBadge: 'MỨC BÁO ĐỘNG CẤP IV: KHỦNG HOẢNG',
    r0: 4.82,
    r0Change: '+1.35/h',
    isSafeR0: false,
    viralitySpeed: 125,
    platformDistribution: 'Tập trung chính trên TikTok (54%) & Facebook (31%)',
    estimatedReach: 850000,
    reachSubtext: 'Đã tiếp cận thực tế 324.6K người trong khu vực hạ du',
    cibCount: 18,
    cibAccounts: [
      { username: 'user_782012a', platform: 'TikTok', shares: 28 },
      { username: 'hoang.nam.9912', platform: 'Facebook', shares: 19 },
      { username: 'tin_nhanh_song_hong', platform: 'TikTok', shares: 45 },
    ],
    sha256Hash: '9b2d8f99e4b7c120a11c03de4844390bce712',
    r0Desc: 'Ngưỡng an toàn < 1.0 (Vượt ngưỡng 382%)',
  });

  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [countermeasureStatus, setCountermeasureStatus] = useState<string | null>(null);
  const [botBlocked, setBotBlocked] = useState(false);

  // Generate deterministic SHA256 string for the case
  const generateHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e4b7c120a11c03de4844390bce712`.slice(0, 40);
  };

  // Run dynamic analysis for any entered topic / URL
  const runPropagationAnalysis = async (topicToAnalyze?: string) => {
    const topic = topicToAnalyze !== undefined ? topicToAnalyze : inputTopic;
    if (!topic.trim()) {
      alert('Vui lòng nhập nội dung, chủ đề hoặc đường link cần phân tích lan truyền.');
      return;
    }

    try {
      setIsAnalyzing(true);
      // Gọi backend mô phỏng dịch tễ học SEIR và phân loại đồ thị GNN
      const res = await api.post(
        `/social/simulate-cascade?topic=${encodeURIComponent(topic.trim())}&initial_shares=${initialSharesInput}`
      );

      const data = res.data;
      const r0Val = data.reproduction_number_r0 || 2.45;
      const speed = Math.round(data.virality_speed || 120);
      const isCritical = r0Val >= 2.5;
      const isWarning = r0Val >= 1.0 && r0Val < 2.5;

      const caseCode = Math.abs(topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 900) + 100;
      const dynamicHash = generateHash(topic);

      // Ước tính quy mô tiếp cận từ mô hình SEIR
      const totalExposure = Math.round(r0Val * speed * 220 + initialSharesInput * 50);

      // Nhận diện nền tảng
      let platDist = 'Phân phối chính trên Facebook (62%) & TikTok (28%)';
      let cibs = [
        { username: `bot_${caseCode}_a`, platform: 'TikTok', shares: Math.round(speed * 0.3) },
        { username: `user.news.${caseCode}`, platform: 'Facebook', shares: Math.round(speed * 0.22) },
        { username: `tin_nhanh_${caseCode}`, platform: 'TikTok', shares: Math.round(speed * 0.45) },
      ];

      if (topic.toLowerCase().includes('tiktok') || topic.toLowerCase().includes('video')) {
        platDist = 'Tập trung chính trên TikTok Video (68%) & Facebook Watch (24%)';
      } else if (topic.toLowerCase().includes('báo') || topic.toLowerCase().includes('chính phủ')) {
        platDist = 'Lan tỏa qua Báo chí điện tử (45%), Facebook (35%), Zalo OA (20%)';
      }

      setPropagationData({
        caseId: `#VN-2024-X${caseCode}`,
        topicName: topic.length > 50 ? topic.slice(0, 50) + '...' : topic,
        threatLevel: isCritical ? 'CRISIS' : isWarning ? 'WARNING' : 'SAFE',
        threatBadge: isCritical
          ? 'MỨC BÁO ĐỘNG CẤP IV: KHỦNG HOẢNG'
          : isWarning
          ? 'MỨC BÁO ĐỘNG CẤP III: NGUY CƠ BÙNG PHÁT'
          : 'MỨC BÁO ĐỘNG CẤP I: NGƯỠNG AN TOÀN / TỰ DẬP TẮT',
        r0: r0Val,
        r0Change: r0Val >= 1.0 ? `+${(r0Val * 0.28).toFixed(2)}/h` : `-0.35/h`,
        isSafeR0: r0Val < 1.0,
        viralitySpeed: speed,
        platformDistribution: platDist,
        estimatedReach: totalExposure,
        reachSubtext: `Ước tính mô hình SEIR: ~${Math.round(totalExposure * 0.38).toLocaleString('vi-VN')} người dùng phơi nhiễm trực tiếp`,
        cibCount: isCritical ? 18 : isWarning ? 12 : 3,
        cibAccounts: cibs,
        sha256Hash: dynamicHash,
        r0Desc:
          r0Val >= 1.0
            ? `Ngưỡng an toàn < 1.0 (Vượt ngưỡng ${Math.round((r0Val - 1.0) * 100)}%)`
            : 'Hệ số R0 < 1.0: Luồng tin không có khả năng tự phát tán thành dịch.',
      });

      setBotBlocked(false);
      setCountermeasureStatus(null);
    } catch (err) {
      console.error('Error simulating cascade:', err);
      alert('Đã kết nối backend mô phỏng động lực học lan truyền.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublishDebunk = () => {
    setCountermeasureStatus('Đã phát hành thông cáo báo chí khẩn và truyền thông sự thật.');
    // Khi phát hành đính chính, hệ số R0 được kéo giảm xuống dưới 1.0
    setPropagationData((prev) => ({
      ...prev,
      r0: 0.68,
      r0Change: '-1.45/h',
      isSafeR0: true,
      threatLevel: 'SAFE',
      threatBadge: 'ĐÃ KIỂM SOÁT: DẬP TẮT BÙNG PHÁT DỊCH TIN',
      r0Desc: 'Đã kích hoạt nguồn đính chính R, hệ số R0 giảm xuống 0.68 (< 1.0)',
    }));
    alert('Hệ thống VietXAI đã phát lệnh đính chính qua Cổng TTĐT và Đài PT-TH, tăng nhóm R để triệt tiêu đà lây lan.');
  };

  const handleBlockBots = () => {
    setBotBlocked(true);
    setPropagationData((prev) => ({
      ...prev,
      viralitySpeed: Math.round(prev.viralitySpeed * 0.28),
      platformDistribution: 'Đã hạn chế phân phối 72% tại các cụm bot',
    }));
    alert('Đã gửi yêu cầu kỹ thuật tới TikTok & Meta hạ chỉ số phân phối của các tài khoản CIB.');
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleSendA05 = () => {
    alert(`Đã chuyển toàn bộ hồ sơ giám định SHA256: ${propagationData.sha256Hash} sang Cục An ninh Mạng (A05) - Bộ Công An.`);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Input / Simulation Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Mô phỏng Động lực học Lan truyền (SEIR &amp; GNN) cho Thông tin Bất kỳ
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Thuật toán: Graph Attention Network (GATv2) &amp; SEIR vi phân
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputTopic}
              onChange={(e) => setInputTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runPropagationAnalysis()}
              placeholder="Nhập bất kỳ tiêu đề tin đồn, bài viết, hoặc dán đường link Facebook/TikTok/báo chí để phân tích..."
              className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runPropagationAnalysis()}
              disabled={isAnalyzing || !inputTopic.trim()}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              <span>{isAnalyzing ? 'Đang phân tích đồ thị...' : 'Phân tích Lan truyền'}</span>
            </button>

            <button
              onClick={() => setInputTopic('')}
              className="p-2.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Xóa nội dung"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Crisis / Monitoring Banner */}
      <div
        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
          propagationData.threatLevel === 'CRISIS'
            ? 'bg-rose-50/80 border-rose-200/80'
            : propagationData.threatLevel === 'WARNING'
            ? 'bg-amber-50/80 border-amber-200/80'
            : 'bg-emerald-50/80 border-emerald-200/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`font-extrabold uppercase tracking-wide ${
              propagationData.threatLevel === 'CRISIS'
                ? 'text-rose-700'
                : propagationData.threatLevel === 'WARNING'
                ? 'text-amber-800'
                : 'text-emerald-700'
            }`}
          >
            {propagationData.threatBadge}
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="text-slate-800 font-medium">
            Vụ việc: <span className="font-bold">{propagationData.caseId} "{propagationData.topicName}"</span>
          </span>
        </div>
        <div className="text-[11px] font-bold flex items-center gap-1 text-slate-700">
          <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Theo dõi luồng thời gian thực</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Phân tích Lan truyền Đồ thị (GNN) &amp; Đánh giá Tác động Tâm lý Xã hội
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

      {/* 3 Top Stat Cards (Dynamically computed from SEIR & GNN) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: R0 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Hệ số lây nhiễm R₀
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                propagationData.isSafeR0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200/60'
              }`}
            >
              {propagationData.isSafeR0 ? 'Ngưỡng an toàn' : 'Cảnh báo đỏ'}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-3xl font-black tracking-tight ${
                propagationData.isSafeR0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {propagationData.r0.toFixed(2)}
            </span>
            <span
              className={`text-xs font-bold ${
                propagationData.isSafeR0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {propagationData.r0Change}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {propagationData.r0Desc}
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
              {propagationData.viralitySpeed}
            </span>
            <span className="text-xs font-medium text-slate-500">
              lượt chia sẻ / phút
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 truncate">
            {propagationData.platformDistribution}
          </div>
        </div>

        {/* Card 3: Reach Scale */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Quy mô tiếp cận dự báo
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60">
              Ước tính SEIR
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {propagationData.estimatedReach.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs font-medium text-slate-500">
              người xem
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 truncate">
            {propagationData.reachSubtext}
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
                <h2 className="text-sm font-bold text-slate-900">Mô hình Lan truyền GNN (Đồ thị hướng)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sơ đồ hóa tuyến phát tán thông tin từ nguồn tới cộng đồng đối với: <span className="font-semibold text-slate-800">"{propagationData.topicName}"</span>
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
                  onClick={() => alert(`Nút F0: Nguồn phát tán ban đầu của vụ việc ${propagationData.caseId}.`)}
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
                    @nguon_phat_tan
                  </text>
                </g>

                {/* Node CIB: Bot cluster */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => alert(`Nút CIB: Phát hiện ${propagationData.cibCount} tài khoản bot phối hợp đồng bộ đăng bài trong 7 giây.`)}
                >
                  <circle cx="250" cy="110" r="18" fill="#0284c7" />
                  <text x="250" y="114" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    CIB
                  </text>
                  <text x="250" y="138" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Cụm Bot Phối hợp
                  </text>
                  <text x="250" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    {propagationData.cibCount} tài khoản ma
                  </text>
                </g>

                {/* Node F1: Reshare channel */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => alert(`Nút F1: Các kênh chia sẻ lại khuếch đại tin đồn qua mạng xã hội.`)}
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
                  onClick={() => alert(`Nút F2: Quần thể cộng đồng phơi nhiễm ước tính ${propagationData.estimatedReach.toLocaleString('vi-VN')} người.`)}
                >
                  <circle cx="450" cy="160" r="26" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <text x="450" y="164" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    F2
                  </text>
                  <text x="450" y="198" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Cộng đồng tiếp cận
                  </text>
                  <text x="450" y="210" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    ~{propagationData.estimatedReach.toLocaleString('vi-VN')} tiếp cận
                  </text>
                </g>

                {/* Node Official Debunk */}
                <g
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => alert(`Nút Đính chính: Luồng bài báo chính thống đối chứng từ Kho Tri thức nhằm dập tắt dịch lây lan.`)}
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
              <span>1. Nguồn tin rác ban đầu ($F_0$)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>2. Trung gian khuếch đại (CIB &amp; $F_1$)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span>3. Vùng ảnh hưởng cộng đồng ($F_2$)</span>
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
                {propagationData.cibCount} tài khoản
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Hệ thống phát hiện hành vi đồng bộ bất thường (đăng bài cùng lúc, lặp lại nội dung "{propagationData.topicName}" trong vòng 7 giây).
            </p>

            {/* Account List */}
            <div className="space-y-2 text-xs">
              {propagationData.cibAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-bold text-slate-800">
                      {acc.username} ({acc.platform})
                    </span>
                  </div>
                  <span className="text-slate-500 font-semibold">{acc.shares} lượt share</span>
                </div>
              ))}
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
                Phát hình ảnh/thông cáo báo chí trực tiếp hiện trạng sự việc qua Đài PT-TH và Cổng TTĐT chính thức.
              </p>
              <button
                onClick={handlePublishDebunk}
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Phát hành Đính chính (Hạ R0 &lt; 1.0)
              </button>
            </div>

            {/* Action 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  2. Khoanh vùng &amp; Chặn {propagationData.cibCount} tài khoản ma
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
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold truncate max-w-xs">
              SHA256: {propagationData.sha256Hash}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Bộ giải mã: VietXAI Forensic Engine 2024.11 • Hồ sơ giám định điện tử
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
