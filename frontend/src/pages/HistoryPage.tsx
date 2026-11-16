import React from 'react';
import { History, Eye, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const historyItems = [
  { id: 101, title: 'Tin giả: Đột biến giá vàng và lời kêu gọi rút tiền ngân hàng', modality: 'MULTIMODAL', prediction: 'SAI_SU_THAT', confidence: 0.94, date: '16/11/2026 20:30' },
  { id: 102, title: 'Thông cáo chính thức: Lịch thi tốt nghiệp THPT Quốc gia 2026', modality: 'TEXT', prediction: 'CHINH_XAC', confidence: 0.98, date: '16/11/2026 19:15' },
  { id: 103, title: 'Hình ảnh chỉnh sửa AI: Vỡ đập thủy điện miền Trung', modality: 'IMAGE', prediction: 'GAY_HIEU_LAM', confidence: 0.87, date: '16/11/2026 17:40' },
  { id: 104, title: 'Băng ghi âm cắt ghép phát ngôn lãnh đạo về chính sách đất đai', modality: 'AUDIO', prediction: 'CHUA_DU_THONG_TIN', confidence: 0.61, date: '15/11/2026 21:05' },
  { id: 105, title: 'Video tuyên truyền sai lệch về đợt đổi tiền mới', modality: 'VIDEO', prediction: 'SAI_SU_THAT', confidence: 0.92, date: '15/11/2026 14:20' },
];

export const HistoryPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-brand-400" />
          <h2 className="text-xl font-bold text-white">Lịch Sử Phân Tích Thông Tin</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Lưu vết toàn bộ các phiên làm việc, dự đoán mô hình và bằng chứng đối soát đã thực hiện.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">Mã phiên</th>
                <th className="pb-3 font-medium">Tiêu đề bài viết / Nội dung</th>
                <th className="pb-3 font-medium">Phương thức</th>
                <th className="pb-3 font-medium">Kết quả AI</th>
                <th className="pb-3 font-medium">Độ tin cậy</th>
                <th className="pb-3 font-medium">Thời gian</th>
                <th className="pb-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {historyItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono text-slate-400">#{item.id}</td>
                  <td className="py-3 pr-4 font-medium text-slate-200 max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px]">
                      {item.modality}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-[11px] font-semibold text-rose-400">
                      {item.prediction}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-slate-200">
                    {(item.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 text-slate-400">{item.date}</td>
                  <td className="py-3 text-right">
                    <Link
                      to="/results/xai"
                      className="text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1"
                    >
                      Chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
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
