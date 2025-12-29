import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { VendorModule } from './components/VendorModule';
import { SuppliersNetwork } from './components/SuppliersNetwork';
import { TicketSystem } from './components/TicketSystem';
import { MarketRegistry } from './components/MarketRegistry';
import { MyShopModule } from './components/MyShopModule';
import { FinancialsModule } from './components/FinancialsModule';
import { GateManagementModule } from './components/GateManagementModule';
import { MarketAdminApplicationForm } from './components/MarketAdminApplicationForm';
import { VendorApplicationForm } from './components/VendorApplicationForm';
import { UserApplications } from './components/UserApplications';
import { ProfileSettings } from './components/ProfileSettings';
import { SupplyRequisitions } from './components/SupplyRequisitions';
import { AssetManagementModule } from './components/AssetManagementModule';
import { KYCModule } from './components/KYCModule';
import { LandingPage } from './components/LandingPage';
import { UserRole, ApplicationStatus } from './types';
import { CITIES, MARKETS, DUMMY_CREDENTIALS } from './constants';
import { ShieldAlert, CheckCircle2, Lock, Key, User, ArrowRight, LogIn, UserPlus, Clock, FileText } from 'lucide-react';

const App: React.FC = () => {
  // Session State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.USER);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Auth Inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration State
  const [regStep, setRegStep] = useState(0); // 0: Login, 1: Register
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regRole, setRegRole] = useState<UserRole>(UserRole.USER);
  const [errorMsg, setErrorMsg] = useState('');

  // --- Auth Handlers ---

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg('');

    // Check against dummy credentials for RBAC demo
    const user = DUMMY_CREDENTIALS.find(u => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      setCurrentUserRole(user.role);
      setIsLoggedIn(true);
      setShowLandingPage(false);
      setCurrentView('dashboard');
    } else {
      // Basic fallback validation
      if (loginEmail.length > 0 && loginPassword.length > 0) {
        setErrorMsg('Invalid credentials. Please use the "Quick Login" buttons for the demo.');
      } else {
        setErrorMsg('Please enter email and password.');
      }
    }
  };

  const handleRegister = () => {
    setErrorMsg('');
    
    // RBAC Domain Validation for Market Admin is now handled in MarketAdminApplicationForm component
    if (!regEmail || !regRole) {
        setErrorMsg('Please fill in all required fields.');
        return;
    }

    // Additional check for Market Admin if they bypass the specific form
    if (regRole === UserRole.MARKET_ADMIN) {
        if (!regEmail.endsWith('@mmis.tevas.ug')) {
            alert("Security Alert: Registration Blocked.\n\nMarket Admin accounts require a verified organization domain (@mmis.tevas.ug). Please contact Super Admin.");
            return;
        }
    }

    // Success Simulation for Standard Users
    setIsLoggedIn(true);
    setShowLandingPage(false);
    setCurrentUserRole(regRole); // Note: In real app, this would be USER until approved. Keeping detailed logic for demo.
    setCurrentView('dashboard');
  };

  const handleMarketAdminSubmit = (data: any) => {
      // Mock submission for Market Admin form
      alert('Application Submitted! Sent to Super Admin for validation.');
      setIsLoggedIn(true);
      setShowLandingPage(false);
      setCurrentUserRole(UserRole.MARKET_ADMIN);
      setCurrentView('dashboard');
  };

  const handleVendorSubmit = (data: any) => {
      alert(`Application Submitted for ${data.fullName}! Redirecting to application status...`);
      setIsLoggedIn(true);
      setShowLandingPage(false);
      // Vendor remains a general USER until approved, but sees the Pending Dashboard
      setCurrentUserRole(UserRole.USER);
      setCurrentView('applications');
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setShowLandingPage(true);
      setCurrentUserRole(UserRole.USER);
      setCurrentView('dashboard');
      setLoginEmail('');
      setLoginPassword('');
      setRegStep(0);
      setRegEmail('');
      setRegRole(UserRole.USER);
  };

  const fillCredential = (cred: typeof DUMMY_CREDENTIALS[0]) => {
      setLoginEmail(cred.email);
      setLoginPassword(cred.password);
      setErrorMsg('');
  };

  // --- View Router ---
  const renderContent = () => {
    switch(currentView) {
      // Shared / Admin
      case 'vendors': return <VendorModule userRole={currentUserRole} />;
      case 'suppliers': return <SuppliersNetwork />;
      case 'tickets': return <TicketSystem userRole={currentUserRole} />;
      case 'market-registry': return <MarketRegistry />;
      case 'assets': return <AssetManagementModule />;
      
      // Vendor
      case 'my-shop': return <MyShopModule isSupplier={false} />;
      case 'requisitions': return <SupplyRequisitions />;
      
      // Supplier
      case 'bidding': return <SuppliersNetwork />; 
      
      // Gate Staff
      case 'logistics': return <GateManagementModule />;

      // Financials (Vendor/Supplier)
      case 'financials': return <FinancialsModule role={currentUserRole} />;

      // General User
      case 'applications': return <UserApplications />;
      case 'kyc': return <KYCModule />;

      // Profile (All)
      case 'profile': return <ProfileSettings />;

      case 'audit': return (
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold mb-4">System Audit Logs</h2>
            <p className="text-slate-500">Log history and activity tracking module.</p>
            {/* Placeholder for future Audit Log implementation */}
            <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-100 text-xs font-mono text-slate-600">
                [INFO] 2023-10-27 10:23:45 - User Login (Super Admin)<br/>
                [WARN] 2023-10-27 10:25:12 - Failed Login Attempt (IP: 192.168.1.1)<br/>
                [INFO] 2023-10-27 10:30:00 - Vendor v1 payment processed
            </div>
        </div>
      );
      case 'dashboard': 
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">
                Dashboard <span className="text-slate-400 text-lg font-normal">/ {currentUserRole.replace('_', ' ')}</span>
            </h2>
            
            {/* Conditional Stats based on Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(currentUserRole === UserRole.SUPER_ADMIN || currentUserRole === UserRole.MARKET_ADMIN) && (
                  <>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-medium">Total Revenue</div>
                        <div className="text-2xl font-bold text-slate-900 mt-2">124.5M UGX</div>
                        <div className="text-green-600 text-xs mt-1">+12% vs last month</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-medium">Active Vendors</div>
                        <div className="text-2xl font-bold text-slate-900 mt-2">1,240</div>
                    </div>
                  </>
              )}
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="text-slate-500 text-sm font-medium">Open Tickets</div>
                <div className="text-2xl font-bold text-blue-600 mt-2">12</div>
              </div>
              
              {currentUserRole === UserRole.VENDOR && (
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-medium">Rent Status</div>
                        <div className="text-2xl font-bold text-green-600 mt-2">Paid</div>
                   </div>
              )}
              
              {currentUserRole === UserRole.GATE_STAFF && (
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-medium">Today's Entries</div>
                        <div className="text-2xl font-bold text-slate-900 mt-2">142</div>
                   </div>
              )}
            </div>
            
            {/* GENERAL USER APPLICATION TRACKER */}
            {currentUserRole === UserRole.USER && (
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center mb-4">
                     <div>
                        <h3 className="text-lg font-bold text-slate-900">Application Status</h3>
                        <p className="text-sm text-slate-500">Track your role access requests.</p>
                     </div>
                     <button 
                        onClick={() => setCurrentView('applications')}
                        className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                     >
                        View Full Details <ArrowRight size={14} />
                     </button>
                  </div>
                  
                  {/* Mock Summary Card */}
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-4">
                     <div className="p-3 bg-white rounded-full text-amber-500 shadow-sm">
                        <Clock size={24} className="animate-pulse" />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-amber-900">Vendor Access (Pending)</h4>
                           <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-bold">In Review</span>
                        </div>
                        <p className="text-sm text-amber-800 mt-1">
                           Your application for <span className="font-semibold">Nakasero Market</span> is currently being reviewed by the administration.
                        </p>
                        <div className="mt-3 w-full bg-amber-200 rounded-full h-1.5">
                           <div className="bg-amber-500 h-1.5 rounded-full w-1/2"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-amber-700 mt-1 font-medium">
                           <span>Submission</span>
                           <span>Review (Current)</span>
                           <span>Approval</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}
            
            {/* Quick Actions / Notices */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">System Notice</h3>
                <p className="text-blue-700 text-sm">
                    Welcome to the MMIS RBAC Demo. You are currently logged in as <strong>{currentUserRole}</strong>. 
                    Navigate using the sidebar to explore role-specific modules.
                </p>
            </div>
          </div>
        );
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10">
            <Lock size={48} className="mb-4 text-slate-200" />
            <h3 className="text-lg font-semibold text-slate-500">Restricted or Under Construction</h3>
            <p className="text-sm">This module ({currentView}) is not available in the demo version.</p>
        </div>
      );
    }
  };

  // --- Auth Screen Render ---

  if (showLandingPage && !isLoggedIn) {
     return <LandingPage onLoginClick={() => setShowLandingPage(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
           <div className="text-center mb-8">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <ShieldAlert size={24} />
             </div>
             <h1 className="text-3xl font-bold text-slate-900 mb-1">MMIS</h1>
             <p className="text-slate-500 text-sm">Market Management Information System</p>
           </div>

           {regStep === 0 ? (
             <div className="space-y-6">
               <form onSubmit={handleLogin} className="space-y-4">
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                        <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                        {errorMsg}
                        </div>
                    )}
                   <div className="space-y-3">
                       <input 
                            type="email" 
                            placeholder="Email" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                        />
                       <input 
                            type="password" 
                            placeholder="Password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                        />
                   </div>
                   <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                     <LogIn size={18} /> Sign In
                   </button>
               </form>

               {/* Quick Login Section */}
               <div className="pt-6 border-t border-slate-100">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Demo Quick Login</p>
                   <div className="grid grid-cols-2 gap-2">
                       {DUMMY_CREDENTIALS.slice(0, 4).map((cred) => (
                           <button 
                                key={cred.label}
                                type="button"
                                onClick={() => fillCredential(cred)}
                                className="text-xs text-left px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-600 transition-colors flex items-center justify-between group"
                           >
                               {cred.label}
                               <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                           </button>
                       ))}
                   </div>
                   <div className="flex gap-2 mt-2">
                        {DUMMY_CREDENTIALS.slice(4).map((cred) => (
                           <button 
                                key={cred.label}
                                type="button"
                                onClick={() => fillCredential(cred)}
                                className="flex-1 text-xs text-center px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-600 transition-colors"
                           >
                               {cred.label}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="text-center pt-2">
                 <button onClick={() => { setRegStep(1); setErrorMsg(''); }} className="text-blue-600 hover:underline text-sm font-medium">Create New Account</button>
               </div>
               <div className="text-center pt-2">
                 <button onClick={() => setShowLandingPage(true)} className="text-slate-400 hover:text-slate-600 text-xs font-medium">Back to Home</button>
               </div>
             </div>
           ) : (
             <div className="space-y-4">
               {errorMsg && (
                 <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                   <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                   {errorMsg}
                 </div>
               )}
               
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">Application Form</h3>
                    <p className="text-xs text-slate-500">Register to access specific dashboards. Market Admins require strict domain verification.</p>
               </div>
               
               {/* Role Selection always visible if not Market Admin form */}
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <select 
                    value={regRole} 
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                   >
                    <option value={UserRole.USER}>General User</option>
                    <option value={UserRole.VENDOR}>Vendor</option>
                    <option value={UserRole.SUPPLIER}>Supplier</option>
                    <option value={UserRole.MARKET_ADMIN}>Market Admin (Restricted)</option>
                   </select>
               </div>

               {/* Conditional Rendering: Market Admin Form OR Vendor Form OR Standard Fields */}
               {regRole === UserRole.MARKET_ADMIN ? (
                 <MarketAdminApplicationForm 
                    onCancel={() => setRegRole(UserRole.USER)}
                    onSubmit={handleMarketAdminSubmit}
                 />
               ) : regRole === UserRole.VENDOR ? (
                 <VendorApplicationForm 
                    onCancel={() => setRegRole(UserRole.USER)}
                    onSubmit={handleVendorSubmit}
                 />
               ) : (
                 <>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                    />

                    {/* City & Market Selection Logic */}
                    {(regRole === UserRole.SUPPLIER) && (
                      <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
                          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                              <Key size={12} /> Location Assignment
                          </label>
                          <select 
                            value={regCity}
                            onChange={(e) => setRegCity(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                            <option value="">Select City</option>
                            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          
                          {regCity && (
                            <select className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white animate-in fade-in">
                              <option value="">Select Market</option>
                              {MARKETS.filter(m => m.cityId === regCity).map(m => (
                                <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                              ))}
                            </select>
                          )}
                      </div>
                    )}

                    <button onClick={handleRegister} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4">
                      <UserPlus size={18} /> Register & Apply
                    </button>
                 </>
               )}

               <div className="text-center mt-4">
                 <button onClick={() => { setRegStep(0); setErrorMsg(''); }} className="text-slate-500 hover:text-slate-800 text-sm">Back to Login</button>
               </div>
             </div>
           )}

           <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <a href="#" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">Contact System Administrator</a>
           </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      role={currentUserRole} 
      currentView={currentView}
      onNavigate={setCurrentView}
      onLogout={handleLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default App;
