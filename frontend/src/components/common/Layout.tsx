import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-slate-800 selection:text-white">
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      {/* Platform Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div>
            <span>© 2026 VietXAI Forensic Platform. Trung tâm Giám định Kỹ thuật số Không gian mạng.</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="#quy-chuan"
              onClick={(e) => {
                e.preventDefault();
                alert('Quy chuẩn Giám định Kỹ thuật số Không gian mạng VietXAI 2026 v2.4 tuân thủ tiêu chuẩn A05 & ViFactCheck.');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Quy chuẩn
            </a>
            <Link to="/tri-thuc" className="hover:text-slate-900 transition-colors">
              Tài liệu RAG
            </Link>
            <a
              href="#ho-tro"
              onClick={(e) => {
                e.preventDefault();
                alert('Đường dây nóng Kỹ thuật VietXAI: support@vietxai.gov.vn | Tổng đài giám định: 1900-XAI-VN');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Hỗ trợ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
