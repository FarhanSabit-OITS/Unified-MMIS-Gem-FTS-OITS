import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DUMMY_CREDENTIALS, MARKETS } from '../constants';
import { Plus, Search, Shield, User, Store, Truck, MapPin, MoreVertical, Trash2, Lock } from 'lucide-react';

interface UserManagementModuleProps {
  currentUser: UserProfile;
}

export const UserManagementModule: React.FC<UserManagementModuleProps> = ({ currentUser }) => {
  const [users, setUsers] = useState(DUMMY_CREDENTIALS.map((c, i) => ({
    id: `u-${i}`,
    name: c.label,
    email: c.email,
    role: c.role,
    marketId: c.marketId || null,
    status: 'ACTIVE'
  })));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // RBAC: Filtering users based on current user's scope
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  
  const filteredUsers = users.filter(user => {
    // 1. RBAC Filter
    if (!isSuperAdmin && currentUser.marketId !== user.marketId) return false;
    
    // 2. Search & Role Filter
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getMarketName = (marketId: string | null) => {
    if (!marketId) return 'Global / N/A';
    return MARKETS.find(m => m.id === marketId)?.name || marketId;
  };

  const handleCreateUser = () => {
    const role = prompt(`Enter Role (${isSuperAdmin ? 'MARKET_ADMIN, GATE_STAFF, SUPPORT' : 'VENDOR, GATE_STAFF'}):`);
    if(!role) return;
    
    // Simple RBAC validation for creation
    if (!isSuperAdmin && (role === 'SUPER_ADMIN' || role === 'MARKET_ADMIN')) {
      alert("Insufficient permissions. Market Admins cannot create Admin accounts.");
      return;
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: 'New User',
      email: `new.${Date.now()}@mmis.ug`,
      role: role as UserRole,
      marketId: isSuperAdmin ? null : (currentUser.marketId ?? null), // Use nullish coalescing to ensure null instead of undefined
      status: 'ACTIVE'
    };

    setUsers([...users, newUser]);
  };

  const handleDeleteUser = (id: string, role: UserRole) => {
      if(!isSuperAdmin && role === UserRole.MARKET_ADMIN) {
          alert("Only Super Admin can remove Market Administrators.");
          return;
      }
      if(confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500 text-sm">
            {isSuperAdmin ? 'System-wide access control.' : `Manage users for ${getMarketName(currentUser.marketId ?? null)}`}
          </p>
        </div>
        <button 
          onClick={handleCreateUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search users..." 
             className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <select 
          className="px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 outline-none"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          {isSuperAdmin && <option value="MARKET_ADMIN">Market Admins</option>}
          <option value="VENDOR">Vendors</option>
          <option value="GATE_STAFF">Gate Staff</option>
          <option value="SUPPLIER">Suppliers</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Market Context</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                    user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    user.role === 'MARKET_ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    user.role === 'VENDOR' ? 'bg-green-50 text-green-700 border-green-100' :
                    'bg-slate-50 text-slate-700 border-slate-100'
                  }`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                   <MapPin size={14} className="text-slate-400" />
                   {getMarketName(user.marketId)}
                </td>
                <td className="px-6 py-4">
                   <span className="text-green-600 font-bold text-xs">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded">
                        <Lock size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.role)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};