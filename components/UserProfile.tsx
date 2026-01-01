import React from 'react';
import { UserProfile as UserProfileType, UserRole } from '../types';
import { User, Shield, Briefcase, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';

interface UserProfileProps {
  user: UserProfileType;
  onEdit?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-purple-100 text-purple-700 border-purple-200';
      case UserRole.MARKET_ADMIN: return 'bg-blue-100 text-blue-700 border-blue-200';
      case UserRole.VENDOR: return 'bg-green-100 text-green-700 border-green-200';
      case UserRole.SUPPLIER: return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
               <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 text-2xl font-bold">
                  {user.name[0]}
               </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                 <Mail size={14} /> {user.email}
              </p>
            </div>
            <button 
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
                <Edit size={16} /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Left Column: Role & Status */}
             <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Account Role</h3>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold border ${getRoleBadgeColor(user.role)}`}>
                        <Shield size={16} /> {user.role.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {user.role === UserRole.SUPER_ADMIN && "Full system access. Can manage admins and global settings."}
                        {user.role === UserRole.MARKET_ADMIN && "Market-level access. Can manage vendors, staff, and tickets."}
                        {user.role === UserRole.VENDOR && "Vendor access. Can manage shop inventory, orders, and payments."}
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <div className="text-slate-400 mb-1"><Briefcase size={20} /></div>
                        <div className="font-bold text-slate-900">Active</div>
                        <div className="text-xs text-slate-500">Account Status</div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <div className="text-slate-400 mb-1"><Calendar size={20} /></div>
                        <div className="font-bold text-slate-900">Oct 2023</div>
                        <div className="text-xs text-slate-500">Member Since</div>
                    </div>
                </div>
             </div>

             {/* Right Column: Details */}
             <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Entity Details</h3>
                
                <div className="flex items-center gap-4 p-3 border-b border-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <MapPin size={16} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Assigned Market</div>
                        <div className="text-sm font-bold text-slate-800">{user.marketId || 'Global / Not Assigned'}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-3 border-b border-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <Shield size={16} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">KYC Status</div>
                        <div className={`text-sm font-bold ${user.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                            {user.isVerified ? 'Verified' : 'Pending Verification'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-3 border-b border-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Phone size={16} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Contact Number</div>
                        <div className="text-sm font-bold text-slate-800">+256 700 000000</div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};