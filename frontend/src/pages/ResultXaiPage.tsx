import React from 'react';
import { BrainCircuit, Info, Sparkles, CheckCircle2, AlertTriangle, Eye, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const modalityWeights = [
  { name: 'Văn bản (PhoBERT)', weight: 0.42, color: '#38bdf8' },
  { name: 'Thị giác (ViT)', weight: 0.38, color: '#f59e0b' },
  { name: 'Âm thanh (Whisper)', weight: 0.12, color: '#a855f7' },
  { name: 'Đồ thị lan truyền (GNN)', weight: 0.08, color: '#10b981' },
];

const tokenAttributions = [
  { word: 'Khẩn', weight: 0.85, positive: true },
  { word: 'cấp:', weight: 0.82, positive: true },
  { word: 'vỡ', weight: 0.94, positive: true },
  { word: 'đập', weight: 0.91, positive: true },
  { word: 'thủy', weight: 0.70, positive: true },
  { word: 'điện', weight: 0.72, positive: true },
  { word: 'sông', weight: 0.40, positive: false },
  { word: 'Tranh', weight: 0.45, positive: false },
  { word: 'người', weight: 0.30, positive: false },
  { word: 'dân', weight: 0.32, positive: false },
  { word: 'di', weight: 0.88, positive: true },
  { word: 'tản', weight: 0.90, positive: true },
  { word: 'ngay', weight: 0.86, positive: true },
];

export const ResultXaiPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
            EXPLAINABLE AI (XAI)
          </span>
          <h2 className="text-xl font-bold text-white">Minh Bạch & Giải Thích Quyết Định AI</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Mô hình không phải là hộp đen. Hệ thống bóc tách các yếu tố nhân quả: từ ngữ kích hoạt, vùng thị giác trọng yếu và bằng chứng đối chiếu.
        </p>
      </div>

      {/* Uncertainty & Prediction Summary */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-xs text-slate-400">Kết luận Suy luận:</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-sm font-bold">
              SAI SỰ THẬT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Dựa trên đối soát đa phương thức và bằng chứng báo chí.</p>
        </div>

        <div>
          <span className="text-xs text-slate-400">Độ tin cậy mô hình:</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white">93.4%</span>
            <span className="text-xs text-emerald-400">Độ bất định thấp (Low Uncertainty)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '93.4%' }} />
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-400">Chỉ số Mâu thuẫn chéo (Cross-modal Inconsistency):</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rose-400">84.2%</span>
            <span className="text-xs text-rose-400">Mâu thuẫn cao</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Hình ảnh chụp sự kiện năm 2020 không khớp mốc thời gian văn bản 2026.</p>
        </div>
      </div>

      {/* Modality Attribution Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          Phân rã Trọng số Đóng góp của từng Phương thức (Reliability-aware Gated Fusion)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Cơ chế gating tự động hạ trọng số của phương thức thiếu dữ liệu hoặc có độ nhiễu cao.
        </p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modalityWeights} layout="vertical">
              <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} stroke="#64748b" fontSize={11} />
              <YAxis dataKey="name" type="category" width={180} stroke="#cbd5e1" fontSize={12} />
              <Tooltip
                formatter={(value: any) => [`${(Number(value) * 100).toFixed(1)}%`, 'Trọng số']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="weight" radius={[0, 6, 6, 0]}>
                {modalityWeights.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Word Attribution (Integrated Gradients / LIME) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          Giải thích Ngôn ngữ Tự nhiên (Word Attribution Heatmap)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Các từ màu đỏ đậm làm tăng xác suất dự đoán nhãn 'Sai sự thật'. Các từ trung tính có tác động không đáng kể.
        </p>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 leading-relaxed flex flex-wrap gap-2 text-xs">
          {tokenAttributions.map((token, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-md border font-medium cursor-help transition"
              style={{
                backgroundColor: token.positive ? `rgba(244, 63, 94, ${token.weight * 0.4})` : 'rgba(100, 116, 139, 0.15)',
                borderColor: token.positive ? `rgba(244, 63, 94, ${token.weight * 0.7})` : 'rgba(100, 116, 139, 0.3)',
                color: token.positive && token.weight > 0.8 ? '#fecdd3' : '#cbd5e1',
              }}
              title={`Trọng số ảnh hưởng: ${(token.weight * 100).toFixed(1)}%`}
            >
              {token.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
