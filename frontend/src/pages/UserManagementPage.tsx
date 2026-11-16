import React from 'react';
import { Users, Shield, UserCheck, Lock, AlertCircle } from 'lucide-react';

const sampleUsers = [
  { id: 1, email: 'admin@sic.edu.vn', username: 'admin', full_name: 'Quản trị viên Hệ thống', role: 'Admin', is_active: true, lock_status: 'Bình thường' },
  { id: 2, email: 'researcher@sic.edu.vn', username: 'researcher_vn', full_name: 'Nguyễn Văn Nghiên Cứu', role: 'Researcher', is_active: true, lock_status: 'Bình thường' },
  { id: 3, email: 'analyst@sic.edu.vn', username: 'analyst_01', full_name: 'Trần Thị Phân Tích', role: 'Analyst', is_active: true, lock_status: 'Bình thường' },
  { id: 4, email: 'victim@sic.edu.vn', username: 'victim_user', full_name: 'Tài khoản Kiểm thử Khóa', role: 'Analyst', is_active: true, lock_status: 'Khóa 15 phút (Nhập sai 5 lần)' },
];

export const UserManagementPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-400" />
          <h2 className="text-xl font-bold text-white">Quản Lý Người Dùng & Phân Quyền Hệ Thống</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Quản lý tài khoản nghiên cứu viên, phân quyền truy cập và giám sát trạng thái khóa tài khoản Brute-force.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Họ và Tên</th>
                <th className="pb-3 font-medium">Email / Username</th>
                <th className="pb-3 font-medium">Vai trò</th>
                <th className="pb-3 font-medium">Trạng thái khóa</th>
                <th className="pb-3 text-right font-medium">Quyền hạn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sampleUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono text-slate-400">#{u.id}</td>
                  <td className="py-3 font-semibold text-slate-200">{u.full_name}</td>
                  <td className="py-3 text-slate-300">
                    <div>{u.email}</div>
                    <div className="text-[10px] text-slate-400">@{u.username}</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-brand-400 border border-slate-700 font-medium text-[11px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    {u.lock_status.includes('Khóa') ? (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                        <Lock className="w-3 h-3" />
                        {u.lock_status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <UserCheck className="w-3 h-3" />
                        {u.lock_status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition">
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
