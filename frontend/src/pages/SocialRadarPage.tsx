import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  SlidersHorizontal,
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Share2,
  Cloud,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';

export const SocialRadarPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HOT' | 'NEWS' | 'SOCIAL'>('ALL');

  // Bursting Trending Topics
  const trendingTopics = [
    {
      id: 1,
      tag: '#vodelonghong',
      growth: '+418%',
      risk: 'Cực đoan',
      riskColor: 'text-rose-600',
      description: 'Tin đồn vỡ đê hồ thủy điện',
      sampleText: 'Khẩn cấp: Đang có tin vỡ đê Thác Bà lúc rạng sáng nay, chính quyền địa phương đang giấu thông tin mọi người sơ tán ngay lập tức!!',
    },
    {
      id: 2,
      tag: '#dichbenhx',
      growth: '+295%',
      risk: 'Nghi vấn',
      riskColor: 'text-amber-600',
      description: 'Video cắt ghép bệnh lạ',
      sampleText: 'Hình ảnh bệnh nhân thở máy nghi nhiễm chủng virus lạ X tại viện TW. Người dân tích trữ lương thực ngay!',
    },
    {
      id: 3,
      tag: '#chinhsachthue_gap',
      growth: '+188%',
      risk: 'Cần xác thực',
      riskColor: 'text-sky-700',
      description: 'Văn bản giả thu thuế ví số',
      sampleText: 'Rò rỉ dự thảo thông tư mới: Áp thuế 35% giao dịch tài sản số và điều chỉnh ví điện tử từ tháng tới.',
    },
    {
      id: 4,
      tag: '#kinhte_nganhang',
      growth: '+142%',
      risk: 'Chính thống',
      riskColor: 'text-emerald-700',
      description: 'Diễn biến lãi suất ngân hàng',
      sampleText: 'Lãi suất huy động giảm, lãi vay bất động sản vẫn neo cao ở mức 9-11%/năm theo báo cáo thị trường quý 4.',
    },
  ];

  // Full Social Feed Items (Bao gồm TOÀN BỘ luồng tin bình thường lẫn tin cảnh báo)
  const allFeedItems = [
    {
      id: 'feed-1',
      category: 'HOT',
      platform: 'TikTok Video • 12s trước',
      sourceType: 'SOCIAL',
      riskBadge: 'Đột biến / Rủi ro cao',
      riskBadgeColor: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      text: '“Khẩn cấp: Đang có tin vỡ đê Thác Bà lúc rạng sáng nay, chính quyền địa phương đang giấu thông tin mọi người sơ tán ngay lập tức!!”',
      meta: '@tinnhanh24h_vn • 3.4k chia sẻ',
      buttonStyle: 'bg-slate-950 hover:bg-slate-800 text-white',
    },
    {
      id: 'feed-2',
      category: 'NEWS',
      platform: 'Báo điện tử VnExpress • 25s trước',
      sourceType: 'NEWS',
      riskBadge: 'Chính thống / An toàn',
      riskBadgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      text: '“Lãi suất huy động giảm, lãi vay bất động sản vẫn neo cao ở mức 9-11%/năm theo khảo sát biểu lãi suất các ngân hàng thương mại.”',
      meta: 'Kênh Tài chính - Kinh tế • 1.2k lượt đọc',
      buttonStyle: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
    {
      id: 'feed-3',
      category: 'HOT',
      platform: 'Facebook Group • 48s trước',
      sourceType: 'SOCIAL',
      riskBadge: 'Nghi vấn / Cần đối chứng',
      riskBadgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      text: '“Hình ảnh bệnh nhân thở máy nghi nhiễm chủng virus lạ X tại viện TW. Người dân tích trữ lương thực ngay!”',
      meta: 'Dân cư Hà Nội Xanh • 420 bình luận',
      buttonStyle: 'bg-slate-950 hover:bg-slate-800 text-white',
    },
    {
      id: 'feed-4',
      category: 'SOCIAL',
      platform: 'Facebook Page • 1m trước',
      sourceType: 'SOCIAL',
      riskBadge: 'Đời sống / Giải trí',
      riskBadgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
      text: '“Linh vật ngựa \'gây bão\' mạng xã hội vì dùng ốp lưng iPhone 17 Pro Max tại phố hoa Quy Nhơn, thu hút đông đảo du khách chụp ảnh.”',
      meta: 'Cộng đồng Quy Nhơn • 2.8k tương tác',
      buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300',
    },
    {
      id: 'feed-5',
      category: 'HOT',
      platform: 'Zalo Feed • 1m trước',
      sourceType: 'SOCIAL',
      riskBadge: 'Chính sách / Nghi vấn',
      riskBadgeColor: 'bg-sky-50 text-sky-700 border border-sky-200/60',
      text: '“Rò rỉ dự thảo thông tư mới: Áp thuế 35% giao dịch tài sản số và điều chỉnh ví điện tử từ tháng tới.”',
      meta: 'Đính kèm PDF • 890 tương tác',
      buttonStyle: 'bg-slate-950 hover:bg-slate-800 text-white',
    },
    {
      id: 'feed-6',
      category: 'NEWS',
      platform: 'Cổng TTĐT Chính Phủ • 2m trước',
      sourceType: 'NEWS',
      riskBadge: 'Chính thống / Xác thực',
      riskBadgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      text: '“Bộ trưởng Y tế Đào Hồng Lan thăm và chúc mừng các y bác sĩ Bệnh viện Bạch Mai nhân kỷ niệm Ngày Thầy thuốc Việt Nam.”',
      meta: 'Thông tin Chính phủ • 850 lượt xem',
      buttonStyle: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
    {
      id: 'feed-7',
      category: 'NEWS',
      platform: 'Báo Tuổi Trẻ • 3m trước',
      sourceType: 'NEWS',
      riskBadge: 'Chính thống / Khoa học',
      riskBadgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      text: '“30 nhà khoa học trẻ Việt Nam được trao giải thưởng Khoa học công nghệ Quả Cầu Vàng năm 2024 trong lĩnh vực Trí tuệ nhân tạo.”',
      meta: 'Mục Giáo dục & Đổi mới • 1.6k lượt đọc',
      buttonStyle: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    },
  ];

  // Lọc luồng tin dựa trên chế độ người dùng chọn
  const filteredFeedItems = allFeedItems.filter((item) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'HOT') return item.category === 'HOT';
    if (activeFilter === 'NEWS') return item.sourceType === 'NEWS';
    if (activeFilter === 'SOCIAL') return item.sourceType === 'SOCIAL';
    return true;
  });

  const handleVerifyNow = (claimText: string) => {
    navigate('/kiem-chung', {
      state: { text: claimText.replace(/^[“”"]|[“”"]$/g, '') },
    });
  };

  const handleFilterReaction = () => {
    setActiveFilter('HOT');
  };

  return (
    <div className="space-y-6">
      {/* Top Radar Active Banner */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          <span className="font-extrabold text-rose-600 uppercase tracking-wide">
            RADAR ACTIVE
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-mono text-[11px]">SYS_ID: VN-CYBER-OBS-05</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium text-[11px]">Lọc tiếng Việt: PhoBERT-Tokenized (Unicode)</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-[11px]">
          <Cloud className="w-3.5 h-3.5 text-sky-600" />
          <span>Hạ tầng thu thập ổn định</span>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Trung tâm Giám sát Mạng xã hội Thời gian thực &amp; Radar Cảnh báo Sớm
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Hạ tầng phân tích luồng dữ liệu đa phương thức, tự động phát hiện dị biệt ngôn luận và đột biến thông tin trên không gian mạng Việt Nam.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-500 font-medium">Tần suất quét tổng</div>
            <div className="text-sm font-black text-slate-900">1,420 bản tin/phút</div>
          </div>
          <button
            onClick={handleFilterReaction}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Bộ lọc Phản ứng khẩn</span>
          </button>
        </div>
      </div>

      {/* Channels Status Strip */}
      <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-700 font-medium">
          <span className="text-slate-500 font-bold">Nguồn giám sát:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> Facebook (820 b/p)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-900" /> TikTok Video (340 v/p)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" /> Zalo OA (260 b/p)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> Báo chí điện tử (195 b/p)
          </span>
        </div>
        <div className="text-slate-400 text-[11px] font-medium hidden lg:block">
          Độ trễ truyền tải &lt; 150ms
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Bursting Topics & Sentiment (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Box 1: Chủ đề Đột biến */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">Chủ đề Đột biến</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Tự động
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Xu hướng ngôn luận tăng vọt 24h
            </p>

            {/* Topics List */}
            <div className="space-y-3">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => handleVerifyNow(topic.sampleText)}
                  className="p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">
                      {topic.tag}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {topic.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-rose-600">
                      {topic.growth}
                    </div>
                    <div className={`text-[10px] font-bold ${topic.riskColor}`}>
                      {topic.risk}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Sắc thái Dư luận */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Sắc thái Dư luận</h2>
              <span className="text-xs font-bold text-rose-600">
                Tiêu cực chiếm ưu thế
              </span>
            </div>

            {/* Sentiment Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
                <div className="bg-rose-600 h-2.5" style={{ width: '65%' }} />
                <div className="bg-sky-600 h-2.5" style={{ width: '25%' }} />
                <div className="bg-emerald-500 h-2.5" style={{ width: '10%' }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-1">
                <span className="flex items-center gap-1 text-rose-600">
                  <span className="w-2 h-2 rounded-full bg-rose-600" /> Tiêu cực 65%
                </span>
                <span className="flex items-center gap-1 text-sky-700">
                  <span className="w-2 h-2 rounded-full bg-sky-600" /> Trung tính 25%
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Tích cực 10%
                </span>
              </div>
            </div>

            {/* Key Hotspot Regions */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                VÙNG ĐIỂM NÓNG TRỌNG TÂM
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">Miền Bắc (Hà Nội, Phú Thọ, Lào Cai)</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  46% Lưu lượng
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">Miền Nam (TP. Hồ Chí Minh, Bình Dương)</span>
                <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  32% Lưu lượng
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">Miền Trung &amp; Tây Nguyên (Đà Nẵng, Đắk Lắk)</span>
                <span className="font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  22% Lưu lượng
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Stream Social Feed (7/12) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900">Dòng Tin Trực Tiếp (Toàn luồng &amp; Mạng xã hội)</h2>
              </div>
              <span className="text-[11px] text-slate-400">Cập nhật luồng thời gian thực</span>
            </div>

            {/* Filter Tabs for ALL vs Categories */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả dòng tin (ALL - {allFeedItems.length})
              </button>
              <button
                onClick={() => setActiveFilter('HOT')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'HOT'
                    ? 'bg-rose-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                Đột biến / Cảnh báo ({allFeedItems.filter((i) => i.category === 'HOT').length})
              </button>
              <button
                onClick={() => setActiveFilter('NEWS')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'NEWS'
                    ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Báo chí chính thống ({allFeedItems.filter((i) => i.sourceType === 'NEWS').length})
              </button>
              <button
                onClick={() => setActiveFilter('SOCIAL')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === 'SOCIAL'
                    ? 'bg-sky-700 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-sky-700'
                }`}
              >
                Mạng xã hội MXH ({allFeedItems.filter((i) => i.sourceType === 'SOCIAL').length})
              </button>
            </div>

            {/* Live Feed Items */}
            <div className="space-y-3.5">
              {filteredFeedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all space-y-2.5 bg-white"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">{item.platform}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${item.riskBadgeColor}`}>
                      {item.riskBadge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {item.text}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.meta}
                    </span>

                    <button
                      onClick={() => handleVerifyNow(item.text)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${item.buttonStyle}`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Kiểm chứng ngay</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Tiếp nhận toàn diện mọi dòng tin (ALL) • PhoBERT v2 phân tích đa luồng</span>
            <span className="text-emerald-600 font-semibold">Tự động làm mới 5s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialRadarPage;
