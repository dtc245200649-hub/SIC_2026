import React, { useState } from 'react';
import { Layers, Upload, FileText, Image as ImageIcon, Video, ArrowRight, AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const MultimodalAnalysisPage: React.FC = () => {
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim() && !selectedFile) return;

    setAnalyzing(true);
    // Giả lập tiến trình phân tích đa phương thức kết nối API
    setTimeout(() => {
      setResult({
        overall_prediction: 'GAY_HIEU_LAM',
        confidence_score: 0.88,
        inconsistency_score: 0.76,
        summary: 'Phát hiện mâu thuẫn ngữ nghĩa nghiêm trọng giữa mô tả văn bản (bão lũ tại miền Trung) và hình ảnh đính kèm (ảnh chụp từ trận lụt năm 2020 tại địa phương khác).',
        modality_breakdown: [
          { modality: 'Văn bản (PhoBERT)', label: 'Gây hiểu lầm', confidence: 0.82, weight: 0.45 },
          { modality: 'Hình ảnh (ViT)', label: 'Sai sự thật (Tái sử dụng ảnh cũ)', confidence: 0.91, weight: 0.55 },
        ],
        evidence_found: [
          {
            title: 'Báo Tuổi Trẻ: Cảnh giác với hình ảnh bão lũ cũ lan truyền sai lệch',
            domain: 'tuoitre.vn',
            verdict: 'REFUTES',
            url: 'https://tuoitre.vn',
          },
        ],
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-mono">
            CORE MODULE
          </span>
          <h2 className="text-xl font-bold text-white">Phân tích Thông tin Đa phương thức (Multimodal Fusion)</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Tiếp nhận đồng thời văn bản, hình ảnh hoặc video để đánh giá mức độ tương thích và phát hiện tin giả qua Cross-modal Co-Attention.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
          <form onSubmit={handleStartAnalysis} className="space-y-5">
            {/* Text Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-400" />
                  Nội dung Văn bản / Tiêu đề bài đăng
                </span>
                <span className="text-[11px] text-slate-400">Hỗ trợ tiếng Việt</span>
              </label>
              <textarea
                rows={5}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Dán nội dung bài đăng, phát biểu hoặc thông tin mạng xã hội cần kiểm chứng tại đây..."
                className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition leading-relaxed"
              />
            </div>

            {/* Media Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-brand-400" />
                Tệp Đa phương tiện Kèm theo (Ảnh hoặc Video)
              </label>
              <div className="border-2 border-dashed border-slate-700/80 hover:border-brand-500/50 rounded-2xl p-6 text-center bg-slate-900/40 transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3 group-hover:text-brand-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  {selectedFile ? (
                    <div className="text-xs text-brand-400 font-medium">
                      Đã chọn: <span className="text-white font-semibold">{selectedFile.name}</span> ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-slate-200">
                        Kéo thả tệp vào đây, hoặc click để tải lên
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Hỗ trợ PNG, JPG, MP4, MKV (Tối đa 50MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Supported Modalities Pill Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <span>Backbone Encoders:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">PhoBERT v2</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">ViT Base</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">VideoMAE Temporal</span>
            </div>

            <button
              type="submit"
              disabled={analyzing || (!textContent.trim() && !selectedFile)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 text-white font-medium text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-40"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang trích xuất đặc trưng & chạy Cross-modal Attention...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Kích hoạt Phân tích Đa phương thức</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Real-time Result / Instructions */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Kết quả Suy luận AI
            </h3>

            {result ? (
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold">Cảnh báo: Nội dung Gây hiểu lầm</span>
                  </div>
                  <p className="text-xs mt-2 text-slate-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Độ tin cậy mô hình:</span>
                    <span className="font-bold text-white">{(result.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Chỉ số Mâu thuẫn chéo:</span>
                    <span className="font-bold text-rose-400">{(result.inconsistency_score * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <h4 className="text-xs font-semibold text-slate-200 mb-2">Đóng góp từng phương thức:</h4>
                  {result.modality_breakdown.map((m: any) => (
                    <div key={m.modality} className="mb-2 p-2 rounded-lg bg-slate-900/60 text-xs">
                      <div className="flex justify-between font-medium text-slate-300">
                        <span>{m.modality}</span>
                        <span className="text-brand-400">Trọng số: {(m.weight * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Nhãn: {m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Layers className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-xs">Chưa có kết quả phân tích.</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Hãy nhập nội dung hoặc tải lên file ở khung bên trái để bắt đầu suy luận học sâu.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <p>Nguyên tắc: Không khẳng định tin giả chỉ bằng AI nếu chưa có bằng chứng kiểm chứng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
