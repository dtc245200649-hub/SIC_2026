import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, FlaskConical, Database, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { authService } from '../services/auth.service';
import { NetworkIllustration } from '../components/common/NetworkIllustration';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Sinh viên / Học viên trình bày đồ án');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Mật khẩu phải có tối thiểu 8 ký tự.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với điều khoản sử dụng dữ liệu nghiên cứu.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const username = email.split('@')[0] + Math.floor(Math.random() * 100);
      await authService.register({
        email: email.trim(),
        username: username,
        full_name: fullName.trim(),
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Đã có lỗi xảy ra khi tạo tài khoản.';
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex items-center justify-center p-4 lg:p-8 select-none">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: RESEARCH INVITATION SHOWCASE (7/12) */}
        <div className="lg:col-span-7 space-y-6 pr-0 lg:pr-6">
          {/* Top Logo & Version Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0a192f] flex items-center justify-center text-white shadow-md border border-slate-800">
                <Sparkles className="w-5 h-5 text-sky-400 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">
                  ViFact XAI
                </h1>
                <p className="text-xs text-slate-600 font-semibold mt-1">Hệ thống Học sâu Đa phương thức</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border-2 border-sky-300 shadow-2xs">
              v2.4 · Research
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-950 tracking-tight leading-snug">
              Tham gia không gian <br />nghiên cứu ViFact XAI
            </h2>
            <p className="text-xs lg:text-sm text-slate-700 font-medium leading-relaxed max-w-xl">
              Đăng ký tài khoản để truy cập bộ công cụ kiểm chứng thông tin đa phương thức, lưu lịch sử giải thích XAI và xuất báo cáo phân tích tác động xã hội.
            </p>
          </div>

          {/* Network Graph Illustration */}
          <NetworkIllustration />

          {/* 2 Feature Callout Boxes */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 shrink-0 mt-0.5">
                <FlaskConical className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-950 block font-bold mb-0.5 text-[13px]">
                  Thử nghiệm & So sánh mô hình
                </strong>
                <p className="text-slate-700 leading-relaxed text-xs font-medium">
                  Chạy suy luận trực tiếp trên bài đăng văn bản kết hợp hình ảnh với các cấu hình PhoBERT, ViLT và CLIP.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 shrink-0 mt-0.5">
                <Database className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-950 block font-bold mb-0.5 text-[13px]">
                  Lưu trữ phiên & Dữ liệu kiểm chứng
                </strong>
                <p className="text-slate-700 leading-relaxed text-xs font-medium">
                  Quản lý các mẫu đã gán nhãn, bản đồ chú ý Grad-CAM và biểu đồ lan truyền phục vụ báo cáo đồ án.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Dataset Stat Footer */}
          <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t-2 border-slate-300 font-mono font-bold">
            <span>Tập dữ liệu chuẩn hóa tiếng Việt · ViSocial-Fake</span>
            <span className="text-slate-950 font-black">12,480 mẫu</span>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTER CARD (5/12) */}
        <div className="lg:col-span-5">
          <div className="bg-white border-2 border-slate-300 rounded-3xl p-7 lg:p-9 shadow-sm space-y-5">
            <div>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">Đăng ký tài khoản</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Tạo tài khoản nghiên cứu viên hoặc sử dụng liên kết học thuật để bắt đầu.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Tạo tài khoản thành công! Đang chuyển hướng sang Đăng nhập...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Minh Anh"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ten@email.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-500 transition"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                  Dùng email cá nhân hoặc email tổ chức để nhận mã xác thực
                </span>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Vai trò trong hệ thống
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-500 transition"
                >
                  <option value="Sinh viên / Học viên trình bày đồ án">Sinh viên / Học viên trình bày đồ án</option>
                  <option value="Giảng viên / Hội đồng đánh giá">Giảng viên / Hội đồng đánh giá</option>
                  <option value="Nghiên cứu viên Độc lập (XAI)">Nghiên cứu viên Độc lập (XAI)</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-slate-300 text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Agree terms */}
              <div className="text-xs pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-slate-700 font-semibold leading-snug">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-slate-400 text-slate-900 focus:ring-sky-500 mt-0.5"
                  />
                  <span>
                    Tôi đồng ý sử dụng dữ liệu mạng xã hội cho mục đích nghiên cứu học thuật và kiểm chứng thông tin.
                  </span>
                </label>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Đang khởi tạo...' : 'Tạo tài khoản nghiên cứu'}
              </button>

              {/* Divider */}
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-slate-200"></div>
                </div>
                <span className="relative px-3 bg-white text-xs text-slate-500 font-bold">
                  hoặc
                </span>
              </div>

              {/* Quick OTP Register */}
              <button
                type="button"
                onClick={() => alert('Mã kích hoạt nhanh sẽ được gửi về hộp thư điện tử.')}
                className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>Đăng ký nhanh qua Email (OTP)</span>
              </button>
            </form>

            {/* Back to Login */}
            <div className="pt-3 border-t-2 border-slate-200 text-center text-xs">
              <span className="text-slate-600 font-medium">Đã có tài khoản? </span>
              <Link to="/login" className="text-sky-800 hover:text-sky-950 font-black underline">
                Đăng nhập hệ thống
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
