import React, { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';

interface SystemUser {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  roles: Array<{ id: number; name: string }>;
}

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/users');
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        }
      } catch (err) {
        console.warn('Lỗi khi tải danh sách người dùng từ máy chủ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <div className="flex items-center gap-2.5">
          <Users className="w-6 h-6 text-sky-600 stroke-[2.2]" />
          <h2 className="text-xl font-black text-slate-950">Quản Lý Người Dùng & Phân Quyền Hệ Thống</h2>
        </div>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Dữ liệu người dùng thực tế từ hệ thống quản trị PostgreSQL/SQLite, phân quyền truy cập và kiểm soát trạng thái tài khoản.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-xs">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mb-2" />
            <p className="text-xs text-slate-700 font-bold">Đang tải danh sách người dùng từ CSDL...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-900 font-black">
                  <th className="pb-3 pr-2">ID</th>
                  <th className="pb-3 pr-4">Họ và Tên</th>
                  <th className="pb-3 px-3">Email / Username</th>
                  <th className="pb-3 px-3">Vai trò</th>
                  <th className="pb-3 px-3">Trạng thái</th>
                  <th className="pb-3 text-right">Quyền hạn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((u) => {
                  const roleName = u.roles?.[0]?.name || (u.is_superuser ? 'Admin' : 'Analyst');
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-mono text-slate-700 font-bold">#{u.id}</td>
                      <td className="py-3.5 font-bold text-slate-950">{u.full_name || u.username}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">{u.email}</div>
                        <div className="text-[11px] text-slate-500 font-mono">@{u.username}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-300 font-bold text-[11px] shadow-2xs">
                          {roleName}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {u.is_active ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                            <UserCheck className="w-3.5 h-3.5" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                            <Lock className="w-3.5 h-3.5" />
                            Đã khóa
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <button className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 text-xs font-bold transition cursor-pointer shadow-2xs">
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserManagementPage;
