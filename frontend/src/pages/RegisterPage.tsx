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
      // Tự động tạo username từ email
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex items-center justify-center p-4 lg:p-8 select-none">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: RESEARCH INVITATION SHOWCASE (7/12) */}
        <div className="lg:col-span-7 space-y-6 pr-0 lg:pr-6">
          {/* Top Logo & Version Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0a192f] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  ViFact XAI
                </h1>
                <p className="text-[11px] text-slate-500 mt-1">Hệ thống Học sâu Đa phương thức</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              v2.4 · Research
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Tham gia không gian <br />nghiên cứu ViFact XAI
            </h2>
            <p className="text-xs lg:text-sm text-slate-600 leading-relaxed max-w-xl">
              Đăng ký tài khoản để truy cập bộ công cụ kiểm chứng thông tin đa phương thức, lưu lịch sử giải thích XAI và xuất báo cáo phân tích tác động xã hội.
            </p>
          </div>

          {/* Network Graph Illustration */}
          <NetworkIllustration />

          {/* 2 Feature Callout Boxes */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  Thử nghiệm & So sánh mô hình
                </strong>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Chạy suy luận trực tiếp trên bài đăng văn bản kết hợp hình ảnh với các cấu hình PhoBERT, ViLT và CLIP.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  Lưu trữ phiên & Dữ liệu kiểm chứng
                </strong>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Quản lý các mẫu đã gán nhãn, bản đồ chú ý Grad-CAM và biểu đồ lan truyền phục vụ báo cáo đồ án.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Dataset Stat Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/70 font-mono">
            <span>Tập dữ liệu chuẩn hóa tiếng Việt · ViSocial-Fake</span>
            <span className="font-semibold text-slate-700">12,480 mẫu</span>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTER CARD (5/12) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 lg:p-9 shadow-sm space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Đăng ký tài khoản</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tạo tài khoản nghiên cứu viên hoặc sử dụng liên kết học thuật để bắt đầu.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Đăng ký thành công! Đang chuyển hướng về trang đăng nhập...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Họ và tên */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Minh Anh"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              {/* Địa chỉ Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ten@email.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Dùng email cá nhân hoặc email tổ chức để nhận mã xác thực
                </span>
              </div>

              {/* Vai trò trong hệ thống */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vai trò trong hệ thống
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                >
                  <option value="Sinh viên / Học viên trình bày đồ án">Sinh viên / Học viên trình bày đồ án</option>
                  <option value="Nghiên cứu viên (Researcher)">Nghiên cứu viên (Researcher)</option>
                  <option value="Chuyên viên phân tích (Analyst)">Chuyên viên phân tích (Analyst)</option>
                  <option value="Quản trị viên (Admin)">Quản trị viên (Admin)</option>
                </select>
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer text-slate-600 text-[11px] pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-sky-500"
                />
                <span className="leading-tight">
                  Tôi đồng ý sử dụng dữ liệu mạng xã hội cho mục đích nghiên cứu học thuật và kiểm chứng thông tin.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản nghiên cứu'}
              </button>

              {/* Divider */}
              <div className="relative my-2.5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative px-3 bg-white text-[11px] text-slate-400 font-medium">
                  hoặc
                </span>
              </div>

              {/* Secondary Button */}
              <button
                type="button"
                onClick={() => alert('Đăng ký qua email OTP sẽ gửi mã xác thực về hòm thư của bạn.')}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Đăng ký nhanh qua Email (OTP)</span>
              </button>
            </form>

            {/* Bottom Link */}
            <div className="pt-2 text-center text-xs text-slate-500">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-slate-900 font-semibold hover:underline">
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
