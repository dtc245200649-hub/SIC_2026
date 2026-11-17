import React, { useState } from 'react';
import { Video, Upload, ArrowRight, Film, Clock, Sparkles } from 'lucide-react';

export const VideoAnalysisPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
      setResult(null);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideo) return;

    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        predicted_label: 'SAI_SU_THAT',
        confidence: 0.91,
        keyframes_count: 5,
        temporal_analysis: 'Phát hiện sự xáo trộn chuỗi khung hình (frame temporal inconsistency) và dấu hiệu deepfake chèn mặt (face-swapping).',
        findings: 'Các khung hình đại diện (Keyframes 2, 4) chứa vết ghép điểm ảnh (boundary artifacts) từ thuật toán sinh ảnh nhân tạo (Generative AI).',
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-mono">
            VIDEO MODULE
          </span>
          <h2 className="text-xl font-bold text-white">Phân tích Video & Trích xuất Keyframes</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Trích xuất khung hình đại diện (Keyframes), phân tích chuỗi chuyển động thời gian bằng OpenCV & Video Transformer. Tối ưu chạy nhẹ nhàng trên PC.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-pink-500/50 rounded-2xl p-6 text-center bg-slate-900/40 relative cursor-pointer">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="py-6">
              <Film className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              {selectedVideo ? (
                <p className="text-xs text-pink-400 font-semibold">{selectedVideo.name} ({(selectedVideo.size / 1024 / 1024).toFixed(2)} MB)</p>
              ) : (
                <>
                  <p className="text-xs text-slate-300 font-medium">Tải tệp video lên (MP4, MKV, AVI)</p>
                  <p className="text-[11px] text-slate-400 mt-1">Tối ưu cho video ngắn (dưới 60 giây)</p>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={analyzing || !selectedVideo}
            className="w-full py-3 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition disabled:opacity-40"
          >
            {analyzing ? (
              <span>Đang trích xuất Keyframes bằng OpenCV & phân tích đặc trưng thị giác...</span>
            ) : (
              <>
                <span>Bắt đầu phân tích Video</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <span className="text-sm font-bold block">Dự đoán: Video Sai sự thật</span>
              <p className="text-xs text-slate-300 mt-1">{result.findings}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                Phân tích chuỗi thời gian (Temporal Inconsistency):
              </h4>
              <p className="text-xs text-slate-300 italic">{result.temporal_analysis}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
