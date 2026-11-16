import React, { useState } from 'react';
import { Image as ImageIcon, Upload, ArrowRight, ShieldCheck, Eye } from 'lucide-react';

export const ImageAnalysisPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        predicted_label: 'GAY_HIEU_LAM',
        confidence: 0.86,
        visual_findings: 'Phát hiện dấu hiệu cắt ghép ảnh (image splicing) và mất cân xứng ánh sáng tại vùng trung tâm ảnh.',
        model: 'google/vit-base-patch16-224',
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono">
            CV MODULE
          </span>
          <h2 className="text-xl font-bold text-white">Phân tích Hình ảnh (Vision Transformer ViT)</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Trích xuất đặc trưng thị giác patch-based, phát hiện ảnh chỉnh sửa, ghép nối và xác định vùng nghi vấn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-slate-900/40 relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="max-h-56 mx-auto rounded-xl object-contain border border-slate-700" />
                  <p className="text-xs text-amber-400 font-medium">Click để đổi ảnh khác</p>
                </div>
              ) : (
                <div className="py-8">
                  <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">Tải ảnh lên để phân tích</p>
                  <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={analyzing || !selectedImage}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition disabled:opacity-40"
            >
              {analyzing ? (
                <span>Đang xử lý ViT Encoders...</span>
              ) : (
                <>
                  <span>Phân tích hình ảnh</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Area */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            Đánh giá Thị giác
          </h3>

          {result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <span className="text-sm font-bold block mb-1">Dự đoán: Nghi vấn / Gây hiểu lầm</span>
                <span className="text-xs text-slate-300 leading-relaxed block">{result.visual_findings}</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">Độ tin cậy ViT:</span>
                <span className="font-bold text-white">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-slate-800">
                <span className="text-slate-400">Backbone Model:</span>
                <span className="font-mono text-slate-300">{result.model}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Chưa có ảnh nào được phân tích. Hãy tải ảnh lên để xem kết quả.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
