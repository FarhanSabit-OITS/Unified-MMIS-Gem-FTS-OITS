import React, { useState } from 'react';
import { UserRole } from '../types';
import { NotificationCenter } from './NotificationCenter';
import { AIChatbot } from './AIChatbot';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  ShoppingBasket, 
  CreditCard, 
  Ticket, 
  ShieldCheck, 
  LogOut,
  MapPin,
  FileText,
  Menu,
  X,
  Camera,
  Activity,
  Search
} from 'lucide-react';

interface DashboardLayoutProps {
  role: UserRole;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, currentView, onNavigate, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const getMenuItems = () => {
    const common = [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'profile', label: 'Profile', icon: ShieldCheck },
    ];

    switch (role) {
      case UserRole.SUPER_ADMIN:
        return [
          ...common,
          { id: 'vendors', label: 'Vendor Mgmt', icon: Users },
          { id: 'suppliers', label: 'Supplier Net', icon: Truck },
          { id: 'market-registry', label: 'Registry', icon: MapPin },
          { id: 'assets', label: 'Assets & Staff', icon: Camera },
          { id: 'tickets', label: 'Support', icon: Ticket },
          { id: 'audit', label: 'Logs', icon: FileText },
        ];
      case UserRole.MARKET_ADMIN:
        return [
          ...common,
          { id: 'vendors', label: 'Vendor Mgmt', icon: Users },
          { id: 'assets', label: 'Assets & Staff', icon: Camera },
          { id: 'market-registry', label: 'Registry', icon: MapPin },
          { id: 'tickets', label: 'Support', icon: Ticket },
        ];
      case UserRole.VENDOR:
        return [
          ...common,
          { id: 'my-shop', label: 'My Shop', icon: ShoppingBasket },
          { id: 'requisitions', label: 'Requisitions', icon: Truck },
          { id: 'financials', label: 'Financials', icon: CreditCard },
          { id: 'kyc', label: 'KYC Verify', icon: FileText },
          { id: 'tickets', label: 'Support', icon: Ticket },
        ];
      case UserRole.SUPPLIER:
        return [
          ...common,
          { id: 'bidding', label: 'War-Room', icon: Truck },
          { id: 'logistics', label: 'Logistics', icon: MapPin },
          { id: 'financials', label: 'Wallet', icon: CreditCard },
          { id: 'kyc', label: 'KYC Verify', icon: FileText },
          { id: 'tickets', label: 'Support', icon: Ticket },
        ];
      case UserRole.GATE_STAFF:
        return [
           ...common,
           { id: 'logistics', label: 'Gate Terminal', icon: MapPin },
           { id: 'tickets', label: 'Incidents', icon: Ticket },
        ];
      default: // USER
        return [
          ...common,
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'kyc', label: 'Identity', icon: FileText },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-blue-400">MMIS</h1>
            <p className="text-xs text-slate-400 mt-1">Market Mgmt System</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-medium text-sm truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-slate-400">System Online</span>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 capitalize truncate w-32 md:w-auto">
              {menuItems.find(m => m.id === currentView)?.label || 'Dashboard'}
            </h2>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all focus:bg-white focus:shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationCenter />
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-700 leading-none">{role.replace('_', ' ')}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">ID: 8821</div>
               </div>
               <button 
                 onClick={() => onNavigate('profile')}
                 className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200 shadow-sm hover:ring-2 hover:ring-blue-300 transition-all"
               >
                 {role.charAt(0)}
               </button>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 relative">
           {children}
        </div>
        
        {/* Floating Chatbot */}
        <AIChatbot />
      </main>
    </div>
  );
};
