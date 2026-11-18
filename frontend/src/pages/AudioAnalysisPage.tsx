import React, { useState } from 'react';
import { Mic, Volume2, ArrowRight, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../services/api';

export const AudioAnalysisPage: React.FC = () => {
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedAudio(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudio) return;

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedAudio);
      formData.append('title', `Âm thanh: ${selectedAudio.name}`);

      const response = await api.post('/analysis/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err: any) {
      console.error('Lỗi khi phân tích âm thanh:', err);
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
            <AlertTriangle className="w-3.5 h-3.5" /> Giả mạo giọng nói (Deepfake Voice)
          </span>
        );
      case 'CHINH_XAC':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Giọng nói thật
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" /> Cần đối chiếu thêm
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono">
            AUDIO MODULE
          </span>
          <h2 className="text-xl font-bold text-white">Phân tích Âm thanh & Chuyển Giọng nói (Whisper STT)</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Chuyển đổi lời nói tiếng Việt thành văn bản bằng Whisper, trích xuất đặc trưng âm học bằng Librosa để nhận diện giọng đọc nhân tạo.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 rounded-2xl p-6 text-center bg-slate-900/40 relative cursor-pointer">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="py-6">
              <Volume2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              {selectedAudio ? (
                <p className="text-xs text-purple-400 font-semibold">{selectedAudio.name} ({(selectedAudio.size / 1024 / 1024).toFixed(2)} MB)</p>
              ) : (
                <>
                  <p className="text-xs text-slate-300 font-medium">Tải tệp âm thanh lên để phân tích</p>
                  <p className="text-[11px] text-slate-400 mt-1">MP3, WAV, M4A, OGG, FLAC</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Mô hình: openai/whisper-tiny + Librosa MFCC & Mel-spectrogram
            </span>
            <button
              type="submit"
              disabled={analyzing || !selectedAudio}
              className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/25 flex items-center gap-2 transition disabled:opacity-40"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang phân tích âm học...</span>
                </>
              ) : (
                <>
                  <span>Bắt đầu phân tích âm thanh</span>
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
              <span className="text-xs text-purple-400 font-mono">{result.model_name}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <strong className="text-white text-xs block">Kết luận âm học:</strong>
              <p className="text-xs text-slate-300">{result.summary}</p>
            </div>

            {result.audio_transcript && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-200 block flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-purple-400" />
                  Kết quả nhận dạng tiếng nói (Whisper STT):
                </span>
                <p className="text-xs text-slate-200 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  "{result.audio_transcript}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default AudioAnalysisPage;
