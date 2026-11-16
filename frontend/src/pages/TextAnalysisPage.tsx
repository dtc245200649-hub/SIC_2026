import React, { useState } from 'react';
import { FileText, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const TextAnalysisPage: React.FC = () => {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        predicted_label: 'SAI_SU_THAT',
        confidence: 0.92,
        tokens_highlight: [
          { word: 'Khẩn', weight: 0.85 },
          { word: 'cấp:', weight: 0.80 },
          { word: 'rút', weight: 0.94 },
          { word: 'tiền', weight: 0.91 },
          { word: 'ngân', weight: 0.70 },
          { word: 'hàng', weight: 0.70 },
          { word: 'sắp', weight: 0.88 },
          { word: 'phá', weight: 0.95 },
          { word: 'sản', weight: 0.96 },
        ],
        model: 'vinai/phobert-base-v2',
      });
      setAnalyzing(false);
    }, 1200);
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
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Nhập đoạn văn bản hoặc dán tin bài cần phân tích:
            </label>
            <textarea
              rows={6}
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
                <span>Đang xử lý NLP...</span>
              ) : (
                <>
                  <span>Phân tích văn bản</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {result && (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Dự đoán: Nội dung Sai sự thật</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  Độ tự tin: {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-200 mb-2">
                Trọng số chú ý từ ngữ then chốt (Token Importance):
              </h4>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                {result.tokens_highlight.map((t: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border"
                    style={{
                      backgroundColor: `rgba(244, 63, 94, ${t.weight * 0.35})`,
                      borderColor: `rgba(244, 63, 94, ${t.weight * 0.6})`,
                      color: t.weight > 0.8 ? '#fecdd3' : '#cbd5e1',
                    }}
                  >
                    {t.word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
