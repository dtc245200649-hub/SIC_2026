import React, { useState } from 'react';
import { Image as ImageIcon, Upload, ArrowRight, ShieldCheck, Eye, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const ImageAnalysisPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('title', `Ảnh: ${selectedImage.name}`);

      const response = await api.post('/analysis/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err: any) {
      console.error('Lỗi khi phân tích hình ảnh:', err);
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
            <AlertTriangle className="w-4 h-4 text-rose-700 stroke-[2.5]" /> Sai sự thật / Chỉnh sửa
          </span>
        );
      case 'CHINH_XAC':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border-2 border-emerald-400 font-black text-xs shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> Ảnh Nguyên bản
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border-2 border-amber-400 font-black text-xs shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-700 stroke-[2.5]" /> Cần giám định thêm
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border-2 border-amber-300 text-xs font-mono font-bold">
            CV MODULE
          </span>
          <h2 className="text-xl font-black text-slate-950">Phân tích Hình ảnh (Vision Transformer ViT)</h2>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Trích xuất đặc trưng thị giác patch-based, phát hiện ảnh chỉnh sửa, ghép nối và xác định vùng nghi vấn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 hover:border-amber-600 rounded-2xl p-6 text-center bg-slate-50 relative cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Preview" className="max-h-56 mx-auto rounded-xl object-contain border-2 border-slate-300 shadow-2xs" />
                  <p className="text-xs text-amber-800 font-bold">Click để chọn ảnh khác</p>
                </div>
              ) : (
                <div className="py-8">
                  <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2.5" />
                  <p className="text-xs text-slate-800 font-bold">Tải ảnh lên để phân tích</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">PNG, JPG, WEBP</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={analyzing || !selectedImage}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-40 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Đang trích xuất đặc trưng ViT...</span>
                </>
              ) : (
                <>
                  <span>Bắt đầu phân tích hình ảnh</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-950 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-600 stroke-[2.5]" /> Kết quả giám định hình ảnh
            </h3>

            {result ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-300">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    {getLabelBadge(result.predicted_label)}
                    <span className="text-xs text-slate-900 font-mono font-black">
                      {(result.confidence_score * 100).toFixed(1)}% tin cậy
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono font-bold">Phiên giám định: #{result.session_id}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-300 space-y-2">
                  <span className="text-xs font-black text-slate-950 block">Dấu hiệu phát hiện:</span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">{result.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-300">
                    <span className="text-slate-500 font-bold block mb-0.5">Tệp xử lý:</span>
                    <strong className="text-slate-900 truncate block font-mono">{result.file_name}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-300">
                    <span className="text-slate-500 font-bold block mb-0.5">Mô hình:</span>
                    <strong className="text-amber-800 font-mono font-bold">{result.model_name}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-xs text-slate-600 font-medium">Chọn hoặc kéo thả hình ảnh để hiển thị kết quả phân loại và bản đồ nhiệt giả mạo.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageAnalysisPage;
