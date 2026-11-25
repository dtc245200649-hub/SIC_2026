import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Radio,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { authService } from '../../services/auth.service';

interface NavbarProps {
  activeTabTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Tổng quan', badge: 'Dashboard' },
    { path: '/kiem-chung', label: 'Kiểm chứng & XAI', badge: 'XAI' },
    { path: '/lan-truyen', label: 'Lan truyền', badge: 'Lan truyền & Tác động' },
    { path: '/tri-thuc', label: 'Cơ Sở Dữ Liệu và Đối Chứng', badge: 'Cơ Sở Dữ Liệu và Đối Chứng' },
    { path: '/giam-sat', label: 'Giám sát MXH', badge: 'Giám sát MXH' },
  ];

  // Determine current active badge
  const currentNav = navLinks.find((link) => {
    if (link.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(link.path);
  }) || navLinks[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo + Pill + Navigation Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <NavLink to="/" className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>VietXAI</span>
            </NavLink>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60">
              {currentNav.badge}
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isActive
                      ? 'text-slate-950 font-bold bg-slate-100/90 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right: Status Indicator + Notifications + User Menu */}
        <div className="flex items-center gap-4">
          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hệ thống trực tuyến</span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Thông báo khẩn"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                7
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-900">
                  <span>Cảnh báo hệ thống (7)</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Realtime</span>
                </div>
                <div className="space-y-2.5 py-2 max-h-64 overflow-y-auto">
                  <div
                    onClick={() => {
                      setShowNotificationMenu(false);
                      navigate('/lan-truyen');
                    }}
                    className="p-2 rounded-lg bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/60 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-rose-700 font-semibold text-[11px]">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-600" /> BÙNG PHÁT R0: 4.82
                      </span>
                      <span className="text-[10px] text-slate-400">2p trước</span>
                    </div>
                    <p className="text-slate-800 text-[11px] mt-1 font-medium">
                      Cụm tin đồn vỡ đập tràn sông Hồng xuất hiện 18 tài khoản ma phối hợp.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setShowNotificationMenu(false);
                      navigate('/giam-sat');
                    }}
                    className="p-2 rounded-lg bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/60 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-amber-800 font-semibold text-[11px]">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> CẢNH BÁO TIKTOK
                      </span>
                      <span className="text-[10px] text-slate-400">12s trước</span>
                    </div>
                    <p className="text-slate-800 text-[11px] mt-1 font-medium">
                      Phát hiện clip giả mạo phong tỏa ngân hàng đạt 1,280 lượt share/phút.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold text-slate-800"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                <UserIcon className="w-4 h-4 text-slate-600" />
              </div>
              <span className="hidden sm:inline">
                {user?.full_name || 'Chuyên viên'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{user?.full_name || user?.username || 'Chuyên viên'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'analyst@vietxai.gov.vn'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
