import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const viralTrendData = [
  { time: '0h', fake: 12, real: 8 },
  { time: '2h (Đỉnh)', fake: 95, real: 28 },
  { time: '6h', fake: 64, real: 42 },
  { time: '12h', fake: 35, real: 38 },
  { time: '24h', fake: 18, real: 26 },
];

const monitoredClusters = [
  {
    id: 1,
    topic: 'Tin đồn vỡ đê sông Hồng & ngập nội thành (Báo VnExpress đã bác bỏ)',
    platforms: 'Facebook, TikTok',
    interactions: '128,400',
    sentiment: 'Hoang mang (74%)',
    sentimentType: 'negative',
    status: 'Sai lệch',
    statusType: 'fake',
  },
  {
    id: 2,
    topic: 'Tin đồn đổi tiền và phong tỏa tài khoản (Công an đã xử phạt đối tượng tung tin)',
    platforms: 'Facebook, Zalo',
    interactions: '95,300',
    sentiment: 'Lo lắng / Hoang mang (82%)',
    sentimentType: 'negative',
    status: 'Sai lệch',
    statusType: 'fake',
  },
  {
    id: 3,
    topic: 'Thông báo mưa lớn cục bộ từ Trung tâm Dự báo Khí tượng Thủy văn Quốc gia',
    platforms: 'Facebook, Cổng TTĐT',
    interactions: '46,190',
    sentiment: 'Chủ động phòng tránh (68%)',
    sentimentType: 'positive',
    status: 'Xác thực',
    statusType: 'verified',
  },
];

export const SocialGraphPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7 ngày qua');
  const [selectedPlatform, setSelectedPlatform] = useState('Tất cả nền tảng');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Title & Filter Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-950 tracking-tight">
            Giám sát Xu hướng Lan truyền Mạng xã hội (Toàn cảnh Vĩ mô)
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium max-w-3xl leading-relaxed">
            Theo dõi lượt tương tác, phân cực cảm xúc dư luận, các cụm chủ đề nóng và động lực học lây
            lan tin sai lệch trên không gian mạng xã hội Việt Nam.
          </p>
        </div>

        {/* 2 Filters Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border-2 border-slate-300 hover:border-slate-400 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:border-sky-600 cursor-pointer"
            >
              <option value="7 ngày qua">7 ngày qua</option>
              <option value="24 giờ qua">24 giờ qua</option>
              <option value="30 ngày qua">30 ngày qua</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
          </div>

          <div className="relative">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="appearance-none bg-white border-2 border-slate-300 hover:border-slate-400 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-bold text-slate-800 shadow-2xs focus:outline-none focus:border-sky-600 cursor-pointer"
            >
              <option value="Tất cả nền tảng">Tất cả nền tảng</option>
              <option value="Facebook">Facebook</option>
              <option value="TikTok">TikTok</option>
              <option value="Zalo / Hội nhóm">Zalo / Hội nhóm</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Row 1: 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-600 font-bold">
            Tổng lượt tương tác mẫu sai lệch
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl lg:text-3xl font-black text-slate-950 font-mono tracking-tight">
              482,910
            </span>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              +18.4%
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-600 font-bold">
            Tỷ lệ cảm xúc tiêu cực / lo âu
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl lg:text-3xl font-black text-rose-600 font-mono tracking-tight">
              64.8%
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              n = 38,420
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-600 font-bold">
            Hệ số lan truyền trung bình
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl lg:text-3xl font-black text-slate-950 font-mono tracking-tight">
              2.9x
            </span>
            <span className="text-xs font-bold text-slate-600">
              2 giờ đầu
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-600 font-bold">
            Chủ đề tác động cao nhất
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-xl lg:text-2xl font-black text-slate-950 tracking-tight">
              Thiên tai & Y tế
            </span>
            <span className="text-xs font-black text-slate-700 font-mono">
              41.2%
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: 2 Analysis Cards (Chart & Sentiment Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column (7 / 12): Xu hướng lan truyền theo khung giờ */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-950">
                Xu hướng lan truyền theo khung giờ (24h sau đăng)
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                So sánh tốc độ chia sẻ lại giữa tin sai lệch và tin xác thực
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] inline-block shadow-2xs"></span>
                Tin sai lệch
              </span>
              <span className="flex items-center gap-1.5 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488] inline-block shadow-2xs"></span>
                Tin xác thực
              </span>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-60 w-full bg-slate-50/70 rounded-xl p-3 border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viralTrendData} margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#475569"
                  fontSize={11}
                  fontWeight={700}
                  tickLine={false}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                />
                {/* Red Line: Tin sai lệch */}
                <Line
                  type="monotone"
                  dataKey="fake"
                  name="Tin sai lệch"
                  stroke="#dc2626"
                  strokeWidth={2.8}
                  dot={{ r: 3, fill: '#dc2626' }}
                  activeDot={{ r: 6 }}
                />
                {/* Teal Line: Tin xác thực */}
                <Line
                  type="monotone"
                  dataKey="real"
                  name="Tin xác thực"
                  stroke="#0d9488"
                  strokeWidth={2.8}
                  dot={{ r: 3, fill: '#0d9488' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column (5 / 12): Phân bố cảm xúc & Chủ đề */}
        <div className="lg:col-span-5 bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-950">
              Phân bố cảm xúc & Chủ đề
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-4">
              Phân tích từ bình luận người dùng Việt Nam
            </p>

            {/* 3 Emotion Progress Bars */}
            <div className="space-y-3.5">
              {/* Bar 1 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">Hoang mang / Phẫn nộ</span>
                  <span className="font-black text-rose-700 font-mono">64.8%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <div
                    style={{ width: '64.8%' }}
                    className="h-full rounded-full bg-[#b91c1c] transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* Bar 2 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">Nghi ngờ / Kiểm chứng lại</span>
                  <span className="font-black text-teal-800 font-mono">23.5%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <div
                    style={{ width: '23.5%' }}
                    className="h-full rounded-full bg-[#0d9488] transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* Bar 3 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900">Trung tính / Khác</span>
                  <span className="font-black text-slate-800 font-mono">11.7%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <div
                    style={{ width: '11.7%' }}
                    className="h-full rounded-full bg-[#1e293b] transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Hashtags Badges */}
          <div className="pt-4 mt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg border-2 border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-800 shadow-2xs">
              #ThienTai (41%)
            </span>
            <span className="px-3 py-1 rounded-lg border-2 border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-800 shadow-2xs">
              #YTeSucKhoe (27%)
            </span>
            <span className="px-3 py-1 rounded-lg border-2 border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-800 shadow-2xs">
              #TaiChinh (19%)
            </span>
            <span className="px-3 py-1 rounded-lg border-2 border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-800 shadow-2xs">
              #GiaoThong (13%)
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Cụm tin lan truyền mạnh đang theo dõi (Table) */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide">
            Cụm tin lan truyền mạnh đang theo dõi
          </h3>
          <span className="text-xs text-slate-600 font-mono font-bold">
            Cập nhật: 21/11/2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-800 font-black">
                <th className="pb-3 pr-4">Chủ đề / Cụm nội dung</th>
                <th className="pb-3 px-3">Nền tảng</th>
                <th className="pb-3 px-3">Tương tác</th>
                <th className="pb-3 px-3">Cảm xúc chủ đạo</th>
                <th className="pb-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {monitoredClusters.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 pr-4 font-bold text-slate-950 max-w-sm">
                    {row.topic}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700">
                    {row.platforms}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    {row.interactions}
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    {row.sentimentType === 'negative' && (
                      <span className="text-rose-700">{row.sentiment}</span>
                    )}
                    {row.sentimentType === 'warning' && (
                      <span className="text-amber-800">{row.sentiment}</span>
                    )}
                    {row.sentimentType === 'positive' && (
                      <span className="text-teal-800">{row.sentiment}</span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    {row.statusType === 'fake' ? (
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                        {row.status}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                        {row.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SocialGraphPage;
