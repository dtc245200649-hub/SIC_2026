import React, { useState } from 'react';
import { ShieldCheck, Search, ExternalLink, CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

const sampleEvidence = [
  {
    id: 1,
    source: 'Báo Tuổi Trẻ',
    domain: 'tuoitre.vn',
    url: 'https://tuoitre.vn',
    title: 'Bác bỏ tin đồn thất thiệt về việc vỡ đập thủy điện tại miền Trung',
    snippet: 'Đại diện Ban chỉ huy Phòng chống thiên tai khẳng định các hồ đập thủy điện trên lưu vực sông đang vận hành an toàn, thông tin lan truyền trên mạng xã hội là hoàn toàn bịa đặt.',
    published_date: '16/11/2026',
    verdict: 'REFUTES',
    similarity: 0.94,
  },
  {
    id: 2,
    source: 'Cổng thông tin Trung tâm Xử lý tin giả Việt Nam (VAFC)',
    domain: 'tingia.gov.vn',
    url: 'https://tingia.gov.vn',
    title: 'Cảnh báo tin giả mạo kêu gọi người dân rút tiền ồ ạt',
    snippet: 'Ngân hàng Nhà nước khuyến cáo người dân cần cẩn trọng trước các luận điệu kích động, không có căn cứ. Mọi khoản tiền gửi tiết kiệm của người dân đều được bảo đảm tuyệt đối.',
    published_date: '15/11/2026',
    verdict: 'REFUTES',
    similarity: 0.91,
  },
  {
    id: 3,
    source: 'Báo VnExpress',
    domain: 'vnexpress.net',
    url: 'https://vnexpress.net',
    title: 'Bộ Công an xử phạt đối tượng tung tin sai sự thật trên không gian mạng',
    snippet: 'Cơ quan an ninh mạng đã triệu tập và lập biên bản xử phạt hành chính đối với chủ tài khoản mạng xã hội đăng tải nội dung sai sự thật gây hoang mang dư luận.',
    published_date: '14/11/2026',
    verdict: 'SUPPORTS',
    similarity: 0.82,
  },
];

export const FactCheckPage: React.FC = () => {
  const [claim, setClaim] = useState('');
  const [searching, setSearching] = useState(false);
  const [evidenceList, setEvidenceList] = useState<any[]>(sampleEvidence);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;

    setSearching(true);
    setTimeout(() => {
      setEvidenceList(sampleEvidence);
      setSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
            FACT-CHECKING MODULE
          </span>
          <h2 className="text-xl font-bold text-white">Kiểm Chứng Bằng Chứng & Đối Soát Báo Chí</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Truy xuất tài liệu từ kho dữ liệu báo chí chính thống (Dense Retrieval + BM25) và kiểm chứng phát biểu bằng mô hình suy luận logic (NLI).
        </p>
      </div>

      {/* Claim Input Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Phát biểu hoặc luận điểm cần kiểm chứng (Claim Extraction):
            </label>
            <div className="relative">
              <input
                type="text"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Ví dụ: Đập thủy điện sông Tranh bị nứt và sắp vỡ trong đêm..."
                className="w-full pl-4 pr-32 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={searching}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{searching ? 'Đang truy xuất...' : 'Tìm bằng chứng'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Evidence Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Tài liệu Dẫn chứng Đối chiếu ({evidenceList.length} nguồn)</h3>
          <span className="text-xs text-slate-400">100% nguồn từ báo chí chính thống</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {evidenceList.map((item) => (
            <div key={item.id} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-200">{item.source}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({item.domain})</span>
                    <span className="text-[10px] text-slate-400">• {item.published_date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white hover:text-emerald-400 transition cursor-pointer">
                    {item.title}
                  </h4>
                </div>

                {item.verdict === 'REFUTES' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold whitespace-nowrap">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    Bác bỏ (REFUTES)
                  </span>
                ) : item.verdict === 'SUPPORTS' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Ủng hộ (SUPPORTS)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-500/15 border border-slate-500/30 text-slate-300 text-xs font-semibold whitespace-nowrap">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    Chưa đủ thông tin
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                "{item.snippet}"
              </p>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">
                  Độ tương đồng ngữ nghĩa S-BERT: <span className="font-semibold text-white">{(item.similarity * 100).toFixed(0)}%</span>
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                >
                  Xem bài báo gốc <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
