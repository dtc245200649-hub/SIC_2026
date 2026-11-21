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
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex items-center justify-center p-4 lg:p-8 select-none">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: BRANDING & RESEARCH SHOWCASE (7/12) */}
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
              Phát hiện thông tin sai lệch <br />& Phân tích tác động xã hội
            </h2>
            <p className="text-xs lg:text-sm text-slate-700 font-medium leading-relaxed max-w-xl">
              Không gian nghiên cứu tích hợp mô hình học sâu đa phương thức (văn bản tiếng Việt, hình ảnh) cùng cơ chế giải thích XAI và đồ thị lan truyền trên mạng xã hội Việt Nam.
            </p>
          </div>

          {/* Network Graph Illustration */}
          <NetworkIllustration />

          {/* 2 Feature Callout Boxes */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-950 block font-bold mb-0.5 text-[13px]">
                  Giải thích XAI đa phương thức
                </strong>
                <p className="text-slate-700 leading-relaxed text-xs font-medium">
                  Trực quan hóa trọng số chú ý trên văn bản (PhoBERT) và vùng ảnh nghi vấn (Grad-CAM) cho từng kết luận.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-800 shrink-0 mt-0.5">
                <BarChart3 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-950 block font-bold mb-0.5 text-[13px]">
                  Đo lường tác động & Lan truyền
                </strong>
                <p className="text-slate-700 leading-relaxed text-xs font-medium">
                  Theo dõi tốc độ khuếch tán, độ phân cực bình luận và mức độ ảnh hưởng theo từng cụm chủ đề.
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

        {/* RIGHT COLUMN: LOGIN CARD (5/12) */}
        <div className="lg:col-span-5">
          <div className="bg-white border-2 border-slate-300 rounded-3xl p-7 lg:p-9 shadow-sm space-y-5">
            <div>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">Đăng nhập hệ thống</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Truy cập không gian thử nghiệm mô hình và bảng phân tích tác động xã hội.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Địa chỉ Email hoặc Tên đăng nhập
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="ten@email.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-500 transition"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                  Nhập email đã đăng ký hoặc dùng tài khoản trình diễn
                </span>
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
                    placeholder="Nhập mật khẩu"
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

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-400 text-slate-900 focus:ring-sky-500"
                  />
                  <span>Ghi nhớ phiên làm việc</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Vui lòng liên hệ Quản trị viên để đặt lại mật khẩu.')}
                  className="text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0a192f] hover:bg-slate-800 text-white font-black text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
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

              {/* Secondary Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => alert('Tính năng đăng nhập OTP qua Email đã sẵn sàng cho tài khoản liên kết.')}
                  className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span>Đăng nhập bằng mã OTP qua Email</span>
                </button>

                <Link
                  to="/register"
                  className="w-full py-2.5 px-3 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition block text-center"
                >
                  <span>Đăng ký tài khoản mới</span>
                </Link>
              </div>
            </form>

            {/* Demo Credentials Helper */}
            <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Chế độ trình diễn đồ án:</span>
              <button
                type="button"
                onClick={() => handleFillDemo('admin', 'Admin@123456')}
                className="text-sky-800 hover:text-sky-950 font-black cursor-pointer underline"
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
