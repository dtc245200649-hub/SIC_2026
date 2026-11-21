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
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-900 border-2 border-rose-400 font-black text-xs shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-rose-700 stroke-[2.5]" /> Video Giả mạo / Cắt ghép
          </span>
        );
      case 'CHINH_XAC':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border-2 border-emerald-400 font-black text-xs shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> Video Xác thực
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-400 font-black text-xs shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-700 stroke-[2.5]" /> Cần đối soát thêm
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-800 border-2 border-pink-300 text-xs font-mono font-bold">
            VIDEO MODULE
          </span>
          <h2 className="text-xl font-black text-slate-950">Phân tích Video & Trích xuất Keyframes</h2>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Trích xuất khung hình đại diện (Keyframes), phân tích chuỗi thời gian kết hợp luồng âm thanh video. Tối ưu chạy nhẹ nhàng trên PC.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-xs space-y-5">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 hover:border-pink-500 rounded-2xl p-6 text-center bg-slate-50 relative cursor-pointer transition">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="py-6">
              <Film className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              {selectedVideo ? (
                <p className="text-xs text-pink-700 font-bold">{selectedVideo.name} ({(selectedVideo.size / 1024 / 1024).toFixed(2)} MB)</p>
              ) : (
                <>
                  <p className="text-xs text-slate-800 font-bold">Tải tệp video lên để phân tích</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">MP4, MOV, AVI, WEBM</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-600" />
              Mô hình: OpenCV Keyframe Extractor + Video Transformer
            </span>
            <button
              type="submit"
              disabled={analyzing || !selectedVideo}
              className="py-2.5 px-5 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center gap-2 transition disabled:opacity-40 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
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
          <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs font-medium">
            {error}
          </div>
        )}

        {result && (
          <div className="pt-6 border-t-2 border-slate-200 space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-300 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-slate-600 font-mono font-bold mb-1">MÃ PHIÊN: #{result.session_id}</p>
                <div className="flex items-center gap-3">
                  {getLabelBadge(result.predicted_label)}
                  <span className="text-xs text-slate-800 font-medium">
                    Độ tin cậy: <strong className="text-slate-950 font-mono font-black">{(result.confidence_score * 100).toFixed(1)}%</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs text-pink-800 font-mono font-bold">{result.model_name}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-300 space-y-2">
              <strong className="text-slate-950 text-xs font-black block">Kết luận kiểm tra:</strong>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">{result.summary}</p>
              {result.audio_transcript && (
                <div className="mt-3 pt-3 border-t border-slate-300">
                  <span className="text-xs text-slate-600 font-bold block mb-1">Phiên âm âm thanh trong video:</span>
                  <p className="text-xs text-slate-800 italic bg-white p-3 rounded-xl border border-slate-300 font-medium leading-relaxed">
                    "{result.audio_transcript}"
                  </p>
                </div>
              )}
            </div>

            {/* Keyframes list */}
            {result.keyframes && result.keyframes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-pink-600" />
                  Các khung hình đại diện tiêu biểu (Keyframes đã bóc tách):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {result.keyframes.map((kf: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border-2 border-slate-300 text-center shadow-2xs">
                      <div className="h-16 rounded-lg bg-white flex items-center justify-center mb-2 border border-slate-300">
                        <Film className="w-6 h-6 text-pink-600" />
                      </div>
                      <span className="text-xs text-slate-900 font-mono font-bold block">Khung #{kf.frame_idx}</span>
                      <span className="text-[11px] text-pink-700 font-mono font-bold">{kf.timestamp_sec}s</span>
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
