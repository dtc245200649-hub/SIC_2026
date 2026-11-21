import React, { useState } from 'react';
import { FileText, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import api from '../services/api';

export const TextAnalysisPage: React.FC = () => {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleTexts = [
    'Khẩn cấp: Vỡ đập thủy điện sông Tranh khiến hàng triệu người dân miền Trung chìm trong biển nước.',
    'Chính phủ vừa ban hành nghị định mới nhằm hỗ trợ doanh nghiệp chuyển đổi số và phát triển bền vững.',
    'Cảnh báo: Toàn bộ hệ thống ngân hàng sắp bị đóng băng tài khoản, người dân phải rút tiền mặt ngay.',
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await api.post('/analysis/text', {
        text: text.trim(),
        title: text.trim().slice(0, 50) + (text.length > 50 ? '...' : ''),
      });
      setResult(response.data);
    } catch (err: any) {
      console.error('Lỗi khi phân tích văn bản:', err);
      setError(err.response?.data?.detail || 'Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra dịch vụ backend.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getLabelBadge = (label: string) => {
    switch (label) {
      case 'SAI_SU_THAT':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 border-2 border-rose-400 font-black text-xs shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-rose-700 stroke-[2.5]" /> Sai sự thật (Fake News)
          </span>
        );
      case 'CHINH_XAC':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border-2 border-emerald-400 font-black text-xs shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> Thông tin Chính xác
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-400 font-black text-xs shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-700 stroke-[2.5]" /> Cần kiểm chứng thêm
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border-2 border-sky-300 text-xs font-mono font-bold">
            NLP MODULE
          </span>
          <h2 className="text-xl font-black text-slate-950">Phân tích Tin giả Văn bản (PhoBERT v2)</h2>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Chuẩn hóa tiếng Việt, tách từ và phân loại nội dung gây hiểu lầm hoặc sai lệch dựa trên mô hình ngôn ngữ PhoBERT.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-xs space-y-5">
        {/* Sample clickers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-700 font-bold">Mẫu thử nhanh:</span>
          {sampleTexts.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setText(sample)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold transition truncate max-w-[260px] cursor-pointer"
              title={sample}
            >
              Mẫu {idx + 1}: {sample.slice(0, 25)}...
            </button>
          ))}
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Nhập đoạn văn bản hoặc dán tin bài cần phân tích:
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập nội dung bài viết tiếng Việt tại đây..."
              className="w-full p-4 rounded-xl bg-white border-2 border-slate-300 text-slate-950 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-500 transition leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Mô hình: vinai/phobert-base-v2 (ViTokenizer + Fast Segmenter)
            </span>
            <button
              type="submit"
              disabled={analyzing || !text.trim()}
              className="py-2.5 px-5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition disabled:opacity-40 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Đang xử lý NLP...</span>
                </>
              ) : (
                <>
                  <span>Phân tích văn bản</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs font-medium">
            {error}
          </div>
        )}

        {result && (
          <div className="pt-6 border-t-2 border-slate-200 space-y-4 animate-fadeIn">
            <div className="p-5 rounded-xl bg-slate-50 border-2 border-slate-300 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-slate-600 font-mono font-bold mb-1.5">KẾT QUẢ ĐÁNH GIÁ (Mã phiên: #{result.session_id})</p>
                <div className="flex items-center gap-3">
                  {getLabelBadge(result.predicted_label)}
                  <span className="text-xs text-slate-800 font-medium">
                    Độ tin cậy mô hình: <strong className="text-slate-950 font-black font-mono text-sm">{(result.confidence_score * 100).toFixed(1)}%</strong>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold block">Mô hình</span>
                <span className="text-xs text-sky-800 font-mono font-bold">{result.model_name}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-300 text-xs text-slate-800 font-medium leading-relaxed">
              <strong className="text-slate-950 block mb-1 text-sm font-black">Tóm tắt kết luận AI:</strong>
              {result.summary}
            </div>

            {result.tokens_highlight && result.tokens_highlight.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">
                  Trọng số chú ý từ ngữ then chốt (Token Attention Weights):
                </h4>
                <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-50 border-2 border-slate-300">
                  {result.tokens_highlight.map((tokenObj: any, idx: number) => {
                    const score = tokenObj.score || tokenObj.weight || 0.5;
                    const isHigh = score > 0.8;
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                          isHigh
                            ? 'bg-rose-200 text-rose-950 border-2 border-rose-400 font-extrabold shadow-2xs'
                            : 'bg-white text-slate-800 border-2 border-slate-300 font-bold'
                        }`}
                        title={`Trọng số: ${score}`}
                      >
                        {tokenObj.token || tokenObj.word}
                        <span className="ml-1 text-[11px] opacity-75">({score})</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default TextAnalysisPage;
