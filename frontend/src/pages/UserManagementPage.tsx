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
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2.5">
          <Users className="w-6 h-6 text-sky-600 stroke-[2.2]" />
          <h2 className="text-xl font-black text-slate-950">Quản Lý Người Dùng & Phân Quyền Hệ Thống</h2>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Quản lý tài khoản nghiên cứu viên, phân quyền truy cập và giám sát trạng thái khóa tài khoản Brute-force.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-900 font-black">
                <th className="pb-3 pr-2">ID</th>
                <th className="pb-3 pr-4">Họ và Tên</th>
                <th className="pb-3 px-3">Email / Username</th>
                <th className="pb-3 px-3">Vai trò</th>
                <th className="pb-3 px-3">Trạng thái khóa</th>
                <th className="pb-3 text-right">Quyền hạn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sampleUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 font-mono text-slate-700 font-bold">#{u.id}</td>
                  <td className="py-3.5 font-bold text-slate-950">{u.full_name}</td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800">{u.email}</div>
                    <div className="text-[11px] text-slate-500 font-mono">@{u.username}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-300 font-bold text-[11px] shadow-2xs">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {u.lock_status.includes('Khóa') ? (
                      <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                        <Lock className="w-3.5 h-3.5" />
                        {u.lock_status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        <UserCheck className="w-3.5 h-3.5" />
                        {u.lock_status}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 text-xs font-bold transition cursor-pointer shadow-2xs">
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
export default UserManagementPage;
