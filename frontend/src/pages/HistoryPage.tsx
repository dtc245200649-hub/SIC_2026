import React, { useState, useEffect } from 'react';
import { History, Eye, ArrowUpRight, CheckCircle2, AlertTriangle, XCircle, HelpCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface HistoryItem {
  id: number;
  title: string;
  modality: string;
  status: string;
  predicted_label: string;
  confidence_score: number;
  created_at: string;
}

export const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analysis/history');
        if (Array.isArray(res.data)) {
          setSessions(res.data);
        }
      } catch (err) {
        console.warn('Chưa có kết nối tới máy chủ hoặc danh sách trống:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2.5">
          <History className="w-6 h-6 text-sky-600 stroke-[2.2]" />
          <h2 className="text-xl font-black text-slate-950">Lịch Sử Phân Tích Thông Tin</h2>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Lưu vết toàn bộ các phiên làm việc, dự đoán mô hình và bằng chứng đối soát thực tế đã được lưu trong CSDL.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-xs">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mb-2" />
            <p className="text-xs text-slate-700 font-bold">Đang tải lịch sử phiên từ CSDL...</p>
          </div>
        ) : sessions.length > 0 ? (
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
                {sessions.map((item) => (
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
                      {item.predicted_label === 'SAI_SU_THAT' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[11px]">
                          Sai sự thật
                        </span>
                      ) : item.predicted_label === 'CHINH_XAC' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px]">
                          Chính xác
                        </span>
                      ) : item.predicted_label === 'GAY_HIEU_LAM' ? (
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
                      {(item.confidence_score * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-2 text-slate-600 font-medium">{item.created_at}</td>
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
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center p-6">
            <History className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-sm font-black text-slate-900 mb-1">Chưa có phiên phân tích nào</h3>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed mb-4">
              Toàn bộ dữ liệu tại đây được ghi lại trực tiếp từ các phiên thẩm định thực tế trong cơ sở dữ liệu. Hãy thực hiện kiểm chứng bài đăng để lưu phiên làm việc.
            </p>
            <Link
              to="/checker"
              className="px-4 py-2 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs shadow-sm inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Thực hiện kiểm chứng ngay</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default HistoryPage;
