import React from 'react';
import { History, Eye, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const historyItems = [
  { id: 101, title: 'Tin giả: Đột biến giá vàng và lời kêu gọi rút tiền ngân hàng', modality: 'MULTIMODAL', prediction: 'SAI_SU_THAT', confidence: 0.94, date: '16/11/2026 20:30' },
  { id: 102, title: 'Thông cáo chính thức: Lịch thi tốt nghiệp THPT Quốc gia 2026', modality: 'TEXT', prediction: 'CHINH_XAC', confidence: 0.98, date: '16/11/2026 19:15' },
  { id: 103, title: 'Hình ảnh chỉnh sửa AI: Vỡ đập thủy điện miền Trung', modality: 'IMAGE', prediction: 'GAY_HIEU_LAM', confidence: 0.87, date: '16/11/2026 17:40' },
  { id: 104, title: 'Video cắt ghép phát ngôn lãnh đạo về chính sách đất đai', modality: 'VIDEO', prediction: 'CHUA_DU_THONG_TIN', confidence: 0.61, date: '15/11/2026 21:05' },
  { id: 105, title: 'Video tuyên truyền sai lệch về đợt đổi tiền mới', modality: 'VIDEO', prediction: 'SAI_SU_THAT', confidence: 0.92, date: '15/11/2026 14:20' },
];

export const HistoryPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2.5">
          <History className="w-6 h-6 text-sky-600 stroke-[2.2]" />
          <h2 className="text-xl font-black text-slate-950">Lịch Sử Phân Tích Thông Tin</h2>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Lưu vết toàn bộ các phiên làm việc, dự đoán mô hình và bằng chứng đối soát đã thực hiện.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-900 font-black">
                <th className="pb-3 pr-2">Mã phiên</th>
                <th className="pb-3 pr-4">Tiêu đề bài viết / Nội dung</th>
                <th className="pb-3 px-2">Phương thức</th>
                <th className="pb-3 px-2">Kết quả AI</th>
                <th className="pb-3 px-2">Độ tin cậy</th>
                <th className="pb-3 px-2">Thời gian</th>
                <th className="pb-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {historyItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 font-mono text-slate-700 font-bold">#{item.id}</td>
                  <td className="py-3.5 pr-4 font-bold text-slate-950 max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300 font-mono text-[11px] font-bold">
                      {item.modality}
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    {item.prediction === 'SAI_SU_THAT' ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[11px]">
                        Sai sự thật
                      </span>
                    ) : item.prediction === 'CHINH_XAC' ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                        Chính xác
                      </span>
                    ) : item.prediction === 'GAY_HIEU_LAM' ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px]">
                        Gây hiểu lầm
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-bold text-[11px]">
                        Cần kiểm chứng
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-2 font-black text-slate-900 font-mono">
                    {(item.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-3.5 px-2 text-slate-600 font-medium">{item.date}</td>
                  <td className="py-3.5 text-right">
                    <Link
                      to="/checker"
                      className="text-sky-700 hover:text-sky-900 font-bold inline-flex items-center gap-1"
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
export default HistoryPage;
