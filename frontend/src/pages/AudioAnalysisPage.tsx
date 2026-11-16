import React, { useState } from 'react';
import { Mic, Upload, ArrowRight, Volume2, Sparkles } from 'lucide-react';

export const AudioAnalysisPage: React.FC = () => {
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedAudio(e.target.files[0]);
      setResult(null);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAudio) return;

    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        predicted_label: 'CHUA_DU_THONG_TIN',
        confidence: 0.65,
        transcript: 'Theo nguồn tin nội bộ chưa được xác thực, việc thay đổi tiền tệ sẽ diễn ra trong tuần này...',
        audio_features: 'Tần số pitch ổn định bất thường, nghi ngờ giọng đọc Text-to-Speech (TTS).',
        model: 'openai/whisper-tiny + Librosa',
      });
      setAnalyzing(false);
    }, 1500);
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
                  <p className="text-xs text-slate-300 font-medium">Tải tệp âm thanh lên (MP3, WAV, M4A, OGG)</p>
                  <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ nhận diện giọng nói đa vùng miền tiếng Việt</p>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={analyzing || !selectedAudio}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition disabled:opacity-40"
          >
            {analyzing ? (
              <span>Đang nhận diện giọng nói bằng Whisper...</span>
            ) : (
              <>
                <span>Bắt đầu phân tích Âm thanh</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
              <span className="text-sm font-bold block mb-1">Dự đoán: Chưa đủ thông tin kết luận</span>
              <p className="text-xs text-slate-400">{result.audio_features}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 mb-1">Bản ghi lời nói (Transcript):</h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{result.transcript}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
