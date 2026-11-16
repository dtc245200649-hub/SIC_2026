import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Lock, User, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { authService } from '../services/auth.service';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLocked(false);
    setLoading(true);

    try {
      await authService.login({
        username_or_email: usernameOrEmail,
        password,
      });
      navigate('/');
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Đã có lỗi xảy ra khi đăng nhập.';
      setErrorMsg(detail);
      if (err.response?.status === 403 && detail.includes('khóa')) {
        setIsLocked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 shadow-xl shadow-brand-500/20 mb-4">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Hệ Thống SIC DETECT</h2>
          <p className="text-sm text-slate-400 mt-1">
            Phát hiện Thông tin Sai lệch Đa phương thức & Phân tích Mạng xã hội
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Đăng nhập tài khoản</h3>
          <p className="text-xs text-slate-400 mb-6">
            Nhập tài khoản hoặc địa chỉ email của bạn để truy cập hệ thống.
          </p>

          {/* Error / Lockout Alert */}
          {errorMsg && (
            <div
              className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm ${
                isLocked
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
              }`}
            >
              {isLocked ? (
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{isLocked ? 'Cảnh báo bảo mật:' : 'Thông báo:'}</p>
                <p className="text-xs mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tên đăng nhập hoặc Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="ví dụ: analyst@sic.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Bảo vệ Brute-force: Khóa 15 phút sau 5 lần sai</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-medium text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Đăng nhập hệ thống</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Chưa có tài khoản nghiên cứu viên?{' '}
              <Link to="/register" className="text-brand-400 hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
