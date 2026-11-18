import React, { useState } from 'react';
import { Layers, Upload, FileText, Globe, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, RefreshCw, Share2, Eye, Heart, MessageSquare, ExternalLink, ShieldAlert, Database } from 'lucide-react';
import api from '../services/api';

export const MultimodalAnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'social_url' | 'manual_upload'>('social_url');
  
  // State cho Tab 1: Phân tích liên kết mạng xã hội
  const [socialUrl, setSocialUrl] = useState('');
  const [userCaption, setUserCaption] = useState('');
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [analyzingSocial, setAnalyzingSocial] = useState(false);
  const [socialResult, setSocialResult] = useState<any | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);

  // State cho Tab 2: Tải tệp thủ công
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzingManual, setAnalyzingManual] = useState(false);
  const [manualResult, setManualResult] = useState<any | null>(null);

  const sampleLinks = [
    {
      label: 'TikTok: Cảnh báo lừa đảo tài khoản',
      url: 'https://www.tiktok.com/@vtv24news/video/7182938491028374820',
      caption: 'Cảnh báo thủ đoạn mạo danh cán bộ cơ quan thuế gọi điện yêu cầu cài app lạ để lừa tiền.',
    },
    {
      label: 'Facebook: Tin xả lũ thủy điện',
      url: 'https://www.facebook.com/thongtinchinhphu/posts/1029384756102938',
      caption: 'Bác bỏ thông tin thất thiệt về việc đập thủy điện xả lũ bất ngờ không báo trước gây hoang mang dư luận.',
    },
  ];

  const handleAnalyzeSocialUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialUrl.trim()) return;

    setAnalyzingSocial(true);
    setSocialError(null);

    try {
      const response = await api.post('/social/analyze-url', {
        url: socialUrl.trim(),
        user_provided_caption: userCaption.trim() ? userCaption.trim() : null,
        analyze_cascade: true,
      });
      setSocialResult(response.data);
    } catch (err: any) {
      console.error('Lỗi khi phân tích liên kết MXH:', err);
      setSocialError(err.response?.data?.detail || 'Không thể kết nối đến máy chủ AI.');
    } finally {
      setAnalyzingSocial(false);
    }
  };

  const handleStartManualAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim() && !selectedFile) return;

    setAnalyzingManual(true);
    setTimeout(() => {
      setManualResult({
        overall_prediction: 'GAY_HIEU_LAM',
        confidence_score: 0.88,
        inconsistency_score: 0.76,
        summary: 'Phát hiện mâu thuẫn ngữ nghĩa nghiêm trọng giữa mô tả văn bản (bão lũ miền Trung) và hình ảnh đính kèm (ảnh chụp từ trận lụt năm 2020 tại địa phương khác).',
        modality_breakdown: [
          { modality: 'Văn bản (PhoBERT)', label: 'Gây hiểu lầm', confidence: 0.82, weight: 0.45 },
          { modality: 'Hình ảnh (ViT)', label: 'Sai sự thật (Tái sử dụng ảnh cũ)', confidence: 0.91, weight: 0.55 },
        ],
      });
      setAnalyzingManual(false);
    }, 1500);
  };

  const getBadge = (label: string) => {
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-mono">
            CORE MULTIMODAL
          </span>
          <h2 className="text-xl font-bold text-white">Phân tích Học sâu Đa phương thức & Mạng Xã hội</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Hệ thống kiểm chứng đối soát tri thức thực tế (Ground-Truth Evidence) từ VnExpress, Tuổi Trẻ, Thanh Niên kết hợp mô hình lan truyền GNN.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('social_url')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'social_url'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg shadow-sky-500/10'
              : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Liên kết Mạng Xã hội (TikTok / Facebook)</span>
        </button>
        <button
          onClick={() => setActiveTab('manual_upload')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'manual_upload'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-lg shadow-brand-500/10'
              : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800'
          }`}
        >
          <Upload className="w-4 h-4 text-brand-400" />
          <span>Tải tệp đa phương thức thủ công</span>
        </button>
      </div>

      {/* TAB 1: SOCIAL URL */}
      {activeTab === 'social_url' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Mẫu liên kết thử nghiệm:</span>
              {sampleLinks.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSocialUrl(item.url);
                    setUserCaption(item.caption);
                  }}
                  className="text-[11px] px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-sky-300 border border-slate-700/60 transition"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleAnalyzeSocialUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-2">
                  Dán đường dẫn bài đăng Facebook hoặc video TikTok:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder="https://www.tiktok.com/@.../video/... hoặc https://facebook.com/.../posts/..."
                    className="flex-1 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={analyzingSocial || !socialUrl.trim()}
                    className="py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-lg shadow-sky-600/25 flex items-center gap-2 transition disabled:opacity-40"
                  >
                    {analyzingSocial ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang đối soát tri thức...</span>
                      </>
                    ) : (
                      <>
                        <span>Kiểm chứng liên kết</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tùy chọn điền caption thủ công nếu Facebook yêu cầu Login */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowCaptionInput(!showCaptionInput)}
                  className="text-[11px] text-sky-400 hover:text-sky-300 underline cursor-pointer"
                >
                  {showCaptionInput ? 'Ẩn ô nhập nội dung bổ sung' : '+ Thêm nội dung bài viết nếu mạng xã hội yêu cầu đăng nhập (Login Wall)'}
                </button>
                {showCaptionInput && (
                  <textarea
                    rows={2}
                    value={userCaption}
                    onChange={(e) => setUserCaption(e.target.value)}
                    placeholder="Dán nội dung bài viết nếu liên kết yêu cầu đăng nhập để xem..."
                    className="w-full mt-2 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                )}
              </div>
            </form>

            {socialError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {socialError}
              </div>
            )}
          </div>

          {/* Result Card for Social URL */}
          {socialResult && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold">
                      {socialResult.platform}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                      Nguồn bóc tách: {socialResult.metadata_source}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Tác giả: {socialResult.author_name}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Kết luận Kiểm chứng Tri thức (Ground-Truth Verified)</h3>
                </div>
                <div className="flex items-center gap-3">
                  {getBadge(socialResult.predicted_label)}
                  <span className="text-xs text-slate-300 font-mono font-bold">
                    {(socialResult.confidence_score * 100).toFixed(1)}% tin cậy
                  </span>
                </div>
              </div>

              {/* Caption & Content */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 font-semibold block">Nội dung xác thực từ bài đăng:</span>
                <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  "{socialResult.caption}"
                </p>
                {socialResult.hashtags && socialResult.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {socialResult.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Matched Official Evidence from VnExpress, Tuổi Trẻ, Thanh Niên */}
              {socialResult.evidence_matches && socialResult.evidence_matches.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Bằng chứng đối soát trực tiếp từ Báo chí chính thống:
                  </span>
                  <div className="space-y-2">
                    {socialResult.evidence_matches.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                              {item.source_name}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              item.verdict === 'REFUTES' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {item.verdict === 'REFUTES' ? 'BÁC BỎ TIN ĐỒN' : 'XÁC NHẬN SỰ KIỆN'}
                            </span>
                            <span className="text-[10px] text-slate-400">Độ tương thích: {(item.similarity_score * 100).toFixed(0)}%</span>
                          </div>
                          <p className="text-slate-200 font-medium">{item.title}</p>
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 flex items-center gap-1 text-[11px] shrink-0 transition"
                        >
                          <span>Xem gốc</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Cascade Impact with Epidemic R0 */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Động lực học Lan truyền Dịch tễ mạng xã hội (GNN Epidemic Model):
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-300 font-mono">Hệ số lây lan cơ bản: <strong className="text-amber-400">R0 = {socialResult.cascade_r0}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      Nguy cơ: {socialResult.propagation_risk_level}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Dự báo quy mô lan tỏa: <strong className="text-white font-mono">~{socialResult.cascade_nodes_predicted.toLocaleString()}</strong> tài khoản mạng xã hội bị phơi nhiễm nếu không có thông tin đính chính kịp thời.
                </p>
              </div>

              {/* Data Integrity Transparency Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 block mb-0.5">Tiêu chuẩn Minh bạch Dữ liệu (Zero-Hallucination):</strong>
                  {socialResult.data_integrity_notes}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANUAL UPLOAD */}
      {activeTab === 'manual_upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
            <form onSubmit={handleStartManualAnalysis} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-400" />
                    Nội dung Văn bản / Tiêu đề bài đăng
                  </span>
                  <span className="text-[11px] text-slate-400">Hỗ trợ tiếng Việt</span>
                </label>
                <textarea
                  rows={4}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Dán nội dung bài đăng, phát biểu cần kiểm chứng tại đây..."
                  className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-brand-400" />
                  Tệp Đa phương tiện Kèm theo (Ảnh, Video hoặc Âm thanh)
                </label>
                <div className="border-2 border-dashed border-slate-700/80 hover:border-brand-500/50 rounded-2xl p-6 text-center bg-slate-900/40 cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-slate-500 mb-2" />
                    {selectedFile ? (
                      <span className="text-xs text-brand-400 font-semibold">{selectedFile.name}</span>
                    ) : (
                      <>
                        <span className="text-xs text-slate-300 font-medium">Tải tệp đa phương tiện lên</span>
                        <span className="text-[11px] text-slate-500 mt-1">Ảnh (JPG, PNG), Video (MP4), Âm thanh (MP3)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={analyzingManual || (!textContent.trim() && !selectedFile)}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 transition disabled:opacity-40"
              >
                {analyzingManual ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang trích xuất & kết hợp đa phương thức...</span>
                  </>
                ) : (
                  <>
                    <span>Bắt đầu phân tích kết hợp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-4">Kết quả phân tích</h3>
            {manualResult ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700">
                  {getBadge(manualResult.overall_prediction)}
                  <p className="text-xs text-slate-400 mt-2">Độ tin cậy: {(manualResult.confidence_score * 100).toFixed(0)}%</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300">
                  {manualResult.summary}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                Nhập nội dung hoặc tải tệp để xem kết luận phân tích đa phương thức.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default MultimodalAnalysisPage;
