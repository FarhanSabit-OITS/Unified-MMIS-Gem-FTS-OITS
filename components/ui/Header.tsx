import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile | null;
  isSimplified?: boolean;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, isSimplified, onLogoClick }) => {
  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
          <LayoutDashboard size={20} />
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">MMIS</span>
      </div>
      
      {!isSimplified && user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{user.role}</div>
          </div>
          <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
            {user.name[0]}
          </div>
        </div>
      )}
    </header>
  );
};