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
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs">
            <AlertTriangle className="w-3.5 h-3.5" /> Sai sự thật (Fake News)
          </span>
        );
      case 'CHINH_XAC':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Thông tin Chính xác
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> Cần kiểm chứng thêm
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono">
            NLP MODULE
          </span>
          <h2 className="text-xl font-bold text-white">Phân tích Tin giả Văn bản (PhoBERT v2)</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Chuẩn hóa tiếng Việt, tách từ và phân loại nội dung gây hiểu lầm hoặc sai lệch dựa trên mô hình ngôn ngữ PhoBERT.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        {/* Sample clickers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Mẫu thử nhanh:</span>
          {sampleTexts.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setText(sample)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition truncate max-w-[240px]"
              title={sample}
            >
              Mẫu {idx + 1}: {sample.slice(0, 25)}...
            </button>
          ))}
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Nhập đoạn văn bản hoặc dán tin bài cần phân tích:
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập nội dung bài viết tiếng Việt tại đây..."
              className="w-full p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Mô hình: vinai/phobert-base-v2 (ViTokenizer + Fast Segmenter)
            </span>
            <button
              type="submit"
              disabled={analyzing || !text.trim()}
              className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-lg shadow-sky-600/25 flex items-center gap-2 transition disabled:opacity-40"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
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
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {result && (
          <div className="pt-6 border-t border-slate-800 space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[11px] text-slate-400 font-mono mb-1">KẾT QUẢ ĐÁNH GIÁ (Mã phiên: #{result.session_id})</p>
                <div className="flex items-center gap-3">
                  {getLabelBadge(result.predicted_label)}
                  <span className="text-xs text-slate-300">
                    Độ tin cậy mô hình: <strong className="text-white font-mono">{(result.confidence_score * 100).toFixed(1)}%</strong>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-mono block">Mô hình</span>
                <span className="text-xs text-sky-400 font-mono">{result.model_name}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
              <strong className="text-white block mb-1">Tóm tắt kết luận AI:</strong>
              {result.summary}
            </div>

            {result.tokens_highlight && result.tokens_highlight.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-200 mb-2">
                  Trọng số chú ý từ ngữ then chốt (Token Attention Weights):
                </h4>
                <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  {result.tokens_highlight.map((tokenObj: any, idx: number) => {
                    const score = tokenObj.score || tokenObj.weight || 0.5;
                    const isHigh = score > 0.8;
                    return (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                        title={`Trọng số: ${score}`}
                      >
                        {tokenObj.token || tokenObj.word}
                        <span className="ml-1 text-[10px] opacity-60">({score})</span>
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
