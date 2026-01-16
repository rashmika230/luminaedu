
import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../types';

const AdminManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Rashmika Perera', studentId: 'LUM/2024/00001', role: 'ADMIN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', email: 'rashmika@lumina.edu', status: 'active', joinedDate: 'Jan 12, 2024' },
    { id: '2', name: 'Dr. Sarah Mitchell', studentId: 'TEA/2024/10201', role: 'TEACHER', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', email: 'sarah.m@lumina.edu', status: 'active', joinedDate: 'Feb 05, 2024' },
    { id: '3', name: 'Alice Thompson', studentId: 'LUM/2024/01221', role: 'STUDENT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice', email: 'alice.t@gmail.com', status: 'active', joinedDate: 'Mar 01, 2024' },
    { id: '4', name: 'Bob Roberts', studentId: 'LUM/2024/05432', role: 'STUDENT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', email: 'bob.r@outlook.com', status: 'suspended', joinedDate: 'Mar 15, 2024' }
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.studentId.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  const changeRole = (id: string, newRole: UserRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Control</h1>
          <p className="text-slate-500 font-medium">Manage user credentials, roles, and security status.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <i className="fa-solid fa-user-tag absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search by ID or Full Name..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option>All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TEACHER">Teachers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">System Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined On</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <img src={u.avatar} className="w-11 h-11 rounded-xl bg-slate-100" alt="" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{u.email}</p>
                        <p className="text-[10px] text-indigo-500 font-black uppercase mt-0.5 tracking-tighter">{u.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <select 
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest focus:outline-none"
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-500">{u.joinedDate}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => toggleStatus(u.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${u.status === 'active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                      title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                    >
                      <i className={`fa-solid ${u.status === 'active' ? 'fa-user-slash' : 'fa-user-check'} text-xs`}></i>
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

export default AdminManageUsers;
