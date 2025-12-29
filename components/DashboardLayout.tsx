import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { VendorModule } from './VendorModule';
import { SuppliersNetwork } from './SuppliersNetwork';
import { TicketSystem } from './TicketSystem';
import { MarketRegistry } from './MarketRegistry';
import { MyShopModule } from './MyShopModule';
import { FinancialsModule } from './FinancialsModule';
import { GateManagementModule } from './GateManagementModule';
import { AssetManagementModule } from './AssetManagementModule';
import { KYCModule } from './KYCModule';
import { UserApplications } from './UserApplications';
import { ProfileSettings } from './ProfileSettings';
import { SupplyRequisitions } from './SupplyRequisitions';
import { OrdersModule } from './OrdersModule';
import { QRModule } from './QRModule';
import { UserManagementModule } from './UserManagementModule'; // New Import
import { Header } from './ui/Header';
import { NotificationCenter } from './NotificationCenter';
import { AIChatbot } from './AIChatbot';
import { 
  LayoutDashboard, 
  Store, 
  Truck, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Wallet, 
  QrCode, 
  ShoppingBag,
  Camera,
  Map,
  FileText,
  Menu,
  X,
  UserPlus
} from 'lucide-react';

interface DashboardLayoutProps {
  user: UserProfile;
  setUser: (user: UserProfile | null) => void;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, setUser, onLogout }) => {
  const [currentView, setCurrentView] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.MARKET_ADMIN;
  const isVendor = user.role === UserRole.VENDOR;
  const isSupplier = user.role === UserRole.SUPPLIER;
  const isGateStaff = user.role === UserRole.GATE_STAFF;
  const isUser = user.role === UserRole.USER;

  const renderContent = () => {
    switch(currentView) {
      // Shared / Admin
      case 'vendors': return <VendorModule userRole={user.role} currentUserId={user.id} />;
      case 'suppliers': return <SuppliersNetwork userRole={user.role} userId={user.id} />;
      case 'tickets': return <TicketSystem userRole={user.role} marketId={user.marketId} />;
      case 'users': return <UserManagementModule currentUser={user} />;
      
      // Admin Specific
      case 'registry': return <MarketRegistry />;
      case 'assets': return <AssetManagementModule userRole={user.role} marketId={user.marketId} />;
      
      // Business Logic
      case 'myshop': return <MyShopModule isSupplier={isSupplier} />;
      case 'financials': return <FinancialsModule role={user.role} />;
      case 'orders': return <OrdersModule user={user} />;
      case 'requisitions': return <SupplyRequisitions />;
      
      // Gate
      case 'gate': return <GateManagementModule />;
      
      // Common / User
      case 'kyc': return <KYCModule />;
      case 'applications': return <UserApplications />;
      case 'profile': return <ProfileSettings />;
      case 'qr': return <QRModule />;
      
      default: 
        if (isAdmin) return <FinancialsModule role={user.role} />; // Default dashboard for admin
        if (isVendor) return <MyShopModule />;
        if (isSupplier) return <SuppliersNetwork userRole={user.role} userId={user.id} />;
        if (isGateStaff) return <GateManagementModule />;
        return <UserApplications />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => { setCurrentView(view); if(window.innerWidth < 768) setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium mb-1 ${
        currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
         <div className="flex items-center gap-2 font-bold text-slate-800">
            <LayoutDashboard className="text-indigo-600" /> MMIS
         </div>
         <div className="flex items-center gap-4">
            <NotificationCenter />
            <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X /> : <Menu />}
            </button>
         </div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
           <div className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tight">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <LayoutDashboard size={20} />
              </div>
              MMIS
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
           <div className="mb-6">
              <div className="px-4 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Main Menu</div>
              
              {/* Dashboard / Home View */}
              <NavItem view="overview" icon={LayoutDashboard} label="Dashboard" />

              {/* Role Based Links */}
              {isAdmin && (
                  <>
                    <NavItem view="registry" icon={Map} label="Market Registry" />
                    <NavItem view="users" icon={UserPlus} label="User Management" />
                    <NavItem view="vendors" icon={Store} label="Vendor Database" />
                    <NavItem view="suppliers" icon={Truck} label="Supplier Network" />
                    <NavItem view="financials" icon={Wallet} label="Financials" />
                    <NavItem view="assets" icon={Camera} label="Assets & Staff" />
                    <NavItem view="gate" icon={ShieldCheck} label="Gate Control" />
                    <NavItem view="qr" icon={QrCode} label="QR Ledger" />
                  </>
              )}

              {isVendor && (
                  <>
                    <NavItem view="myshop" icon={Store} label="My Shop" />
                    <NavItem view="orders" icon={ShoppingBag} label="Orders" />
                    <NavItem view="requisitions" icon={Truck} label="Restock" />
                    <NavItem view="financials" icon={BarChart3} label="Financials" />
                    <NavItem view="qr" icon={QrCode} label="My QR" />
                  </>
              )}

              {isSupplier && (
                  <>
                    <NavItem view="suppliers" icon={LayoutDashboard} label="Bidding Hub" />
                    <NavItem view="myshop" icon={Store} label="Inventory" />
                    <NavItem view="orders" icon={ShoppingBag} label="Orders" />
                    <NavItem view="financials" icon={BarChart3} label="Revenue" />
                    <NavItem view="qr" icon={QrCode} label="Manifests" />
                  </>
              )}

              {isGateStaff && (
                  <>
                    <NavItem view="gate" icon={ShieldCheck} label="Gate Terminal" />
                    <NavItem view="qr" icon={QrCode} label="Scanner" />
                  </>
              )}

              {isUser && (
                  <>
                     <NavItem view="applications" icon={FileText} label="Applications" />
                  </>
              )}
           </div>

           <div className="mb-6">
              <div className="px-4 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Support</div>
              <NavItem view="tickets" icon={Users} label="Help Desk" />
              {(isVendor || isSupplier) && !user.isVerified && (
                  <NavItem view="kyc" icon={ShieldCheck} label="Verify Identity" />
              )}
           </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
           <NavItem view="profile" icon={Settings} label="Settings" />
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium mt-1"
           >
             <LogOut size={20} />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
         {/* Desktop Header */}
         <div className="hidden md:block">
            <Header user={user} onLogoClick={() => setCurrentView('overview')} />
         </div>

         <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            {renderContent()}
         </div>

         {/* Floating Actions */}
         <AIChatbot />
         <div className="fixed bottom-6 right-24 z-40 hidden md:block">
             <NotificationCenter />
         </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-20 md:hidden glass"
            onClick={() => setSidebarOpen(false)}
          ></div>
      )}
    </div>
  );
};