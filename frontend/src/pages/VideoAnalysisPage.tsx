import React, { useState } from 'react';
import { Video, Film, ArrowRight, Clock, Sparkles, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export const VideoAnalysisPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideo) return;

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedVideo);
      formData.append('title', `Video: ${selectedVideo.name}`);

      const response = await api.post('/analysis/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err: any) {
      console.error('Lỗi khi phân tích video:', err);
      setError(err.response?.data?.detail || 'Không thể kết nối đến máy chủ AI.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getLabelBadge = (label: string) => {
    switch (label) {
      case 'SAI_SU_THAT':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs">
            <AlertTriangle className="w-3.5 h-3.5" /> Video Giả mạo / Cắt ghép
          </span>
        );
      case 'CHINH_XAC':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Video Xác thực
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> Cần đối soát thêm
          </span>
        );
    }
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
          Trích xuất khung hình đại diện (Keyframes), phân tích chuỗi thời gian kết hợp luồng âm thanh phiên âm. Tối ưu chạy nhẹ nhàng trên PC.
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
                  <p className="text-xs text-slate-300 font-medium">Tải tệp video lên để phân tích</p>
                  <p className="text-[11px] text-slate-400 mt-1">MP4, MOV, AVI, WEBM</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Mô hình: OpenCV Keyframe Extractor + Video Transformer
            </span>
            <button
              type="submit"
              disabled={analyzing || !selectedVideo}
              className="py-2.5 px-5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs shadow-lg shadow-pink-600/25 flex items-center gap-2 transition disabled:opacity-40"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang bóc tách Keyframes...</span>
                </>
              ) : (
                <>
                  <span>Bắt đầu phân tích video</span>
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
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[11px] text-slate-400 font-mono mb-1">MÃ PHIÊN: #{result.session_id}</p>
                <div className="flex items-center gap-3">
                  {getLabelBadge(result.predicted_label)}
                  <span className="text-xs text-slate-300">
                    Độ tin cậy: <strong className="text-white font-mono">{(result.confidence_score * 100).toFixed(1)}%</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs text-pink-400 font-mono">{result.model_name}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <strong className="text-white text-xs block">Kết luận kiểm tra:</strong>
              <p className="text-xs text-slate-300">{result.summary}</p>
              {result.audio_transcript && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">Phiên âm âm thanh trong video:</span>
                  <p className="text-xs text-slate-200 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                    "{result.audio_transcript}"
                  </p>
                </div>
              )}
            </div>

            {/* Keyframes list */}
            {result.keyframes && result.keyframes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  Các khung hình đại diện tiêu biểu (Keyframes đã bóc tách):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {result.keyframes.map((kf: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                      <div className="h-16 rounded-lg bg-slate-800/80 flex items-center justify-center mb-2 border border-slate-700/60">
                        <Film className="w-6 h-6 text-pink-400" />
                      </div>
                      <span className="text-[11px] text-slate-300 font-mono block">Khung #{kf.frame_idx}</span>
                      <span className="text-[10px] text-pink-400 font-mono">{kf.timestamp_sec}s</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default VideoAnalysisPage;
