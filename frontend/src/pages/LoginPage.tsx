import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, BarChart3, AlertCircle, Sparkles } from 'lucide-react';
import { authService } from '../services/auth.service';
import { NetworkIllustration } from '../components/common/NetworkIllustration';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ tài khoản/email và mật khẩu.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      await authService.login({
        username_or_email: emailOrUsername.trim(),
        password,
      });
      navigate('/');
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Đã có lỗi xảy ra khi đăng nhập vào hệ thống.';
      setErrorMsg(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (username: string, pass: string) => {
    setEmailOrUsername(username);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex items-center justify-center p-4 lg:p-8 select-none">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: BRANDING & RESEARCH SHOWCASE (7/12) */}
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
              Phát hiện thông tin sai lệch <br />& Phân tích tác động xã hội
            </h2>
            <p className="text-xs lg:text-sm text-slate-600 leading-relaxed max-w-xl">
              Không gian nghiên cứu tích hợp mô hình học sâu đa phương thức (văn bản tiếng Việt, hình ảnh) cùng cơ chế giải thích XAI và đồ thị lan truyền trên mạng xã hội Việt Nam.
            </p>
          </div>

          {/* Network Graph Illustration */}
          <NetworkIllustration />

          {/* 2 Feature Callout Boxes */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-600 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  Giải thích XAI đa phương thức
                </strong>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Trực quan hóa trọng số chú ý trên văn bản (PhoBERT) và vùng ảnh nghi vấn (Grad-CAM) cho từng kết luận.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  Đo lường tác động & Lan truyền
                </strong>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Theo dõi tốc độ khuếch tán, độ phân cực bình luận và mức độ ảnh hưởng theo từng cụm chủ đề.
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

        {/* RIGHT COLUMN: LOGIN CARD (5/12) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 lg:p-9 shadow-sm space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Đăng nhập hệ thống</h3>
              <p className="text-xs text-slate-500 mt-1">
                Truy cập không gian thử nghiệm mô hình và bảng phân tích tác động xã hội.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="ten@email.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Nhập email đã đăng ký hoặc dùng tài khoản trình diễn
                </span>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
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

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-sky-500"
                  />
                  <span>Ghi nhớ phiên làm việc</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Vui lòng liên hệ Quản trị viên để đặt lại mật khẩu.')}
                  className="text-slate-500 hover:text-slate-800 text-[11px]"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
              </button>

              {/* Divider */}
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative px-3 bg-white text-[11px] text-slate-400 font-medium">
                  hoặc
                </span>
              </div>

              {/* Secondary Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => alert('Tính năng đăng nhập OTP qua Email đã sẵn sàng cho tài khoản liên kết.')}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Đăng nhập bằng mã OTP qua Email</span>
                </button>

                <Link
                  to="/register"
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition block text-center"
                >
                  <span>Đăng ký tài khoản mới</span>
                </Link>
              </div>
            </form>

            {/* Demo Credentials Helper */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Chế độ trình diễn đồ án:</span>
              <button
                type="button"
                onClick={() => handleFillDemo('admin', 'Admin@123456')}
                className="text-sky-700 hover:text-sky-900 font-semibold cursor-pointer underline"
              >
                Điền tài khoản Demo
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
