
import React, { useState } from 'react';
import { Mail, Lock, User, Fingerprint, MessageSquare, Info, X, LayoutGrid, ArrowLeft, Loader2, Phone } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, UserRole, ApplicationStatus } from '../../types';
import { Header } from '../ui/Header';
import { Footer } from '../ui/Footer';
import { DUMMY_CREDENTIALS } from '../../constants';
import { ApiService } from '../../services/api';

interface AuthPageProps {
  onSuccess: (user: UserProfile) => void;
}

export const AuthPage = ({ onSuccess }: AuthPageProps) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'MFA' | 'FORGOT' | 'CONTACT'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);
  
  const [loading, setLoading] = useState(false);
  const [showVerificationTooltip, setShowVerificationTooltip] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async () => {
    setErrorMsg('');
    setLoading(true);
    
    // 1. Attempt Backend Login
    try {
      if (mode === 'LOGIN') {
        // Attempt Real API Call
        try {
          const response = await ApiService.auth.login({ email, password });
          const { user, token } = response.data;
          
          localStorage.setItem('mmis_token', token);
          onSuccess(user);
          return;
        } catch (apiError) {
          // Fallback to Mock if API unavailable (Demo Mode)
          console.warn("Backend unavailable, using mock credentials.");
          const userMatch = DUMMY_CREDENTIALS.find(u => u.email === email && u.password === password);
          if (userMatch) {
             onSuccess({
                 id: 'u-mock',
                 name: userMatch.label,
                 email: userMatch.email,
                 role: userMatch.role,
                 marketId: userMatch.marketId,
                 isVerified: true
             });
          } else {
             setErrorMsg('Invalid credentials.');
          }
        }
      } else if (mode === 'SIGNUP') {
         if (!email || !name || !password) {
            setErrorMsg('Please fill all fields.');
            setLoading(false);
            return;
         }
         
         try {
             await ApiService.auth.register({ name, email, password, role: selectedRole });
             setShowVerificationTooltip(true);
         } catch (e) {
             setErrorMsg("Registration failed. Email might be in use.");
         }
      } 
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const closeTooltipAndReset = () => {
    setShowVerificationTooltip(false);
    setMode('LOGIN');
  };

  const fillCredential = (cred: typeof DUMMY_CREDENTIALS[0]) => {
      setEmail(cred.email);
      setPassword(cred.password);
      setErrorMsg('');
  };

  const navigateToContact = () => {
      // Redirect or scroll on landing page
      window.location.href = '#contact';
      // If we are already in the SPA, the above might not work if it's not the landing page view.
      // But based on the structure, we can assume the user will see the contact form on landing.
      setMode('CONTACT');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      <Header 
        user={null} 
        isSimplified={true}
        onLogoClick={() => setMode('LOGIN')}
      />
      
      {showVerificationTooltip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <Card className="max-w-md w-full relative overflow-hidden rounded-[32px] p-8 border-none shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <button onClick={closeTooltipAndReset} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Mail size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Check Verification Node</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                A secure entry link has been dispatched to <span className="font-black text-indigo-600">{email}</span>.
              </p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 text-left mb-8">
                <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed font-bold uppercase tracking-tight">
                  Registry Latency: Check <span className="underline">Spam or Junk</span> if not visible within 60s. The link is valid for 24 cycles.
                </p>
              </div>

              <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100" onClick={closeTooltipAndReset}>
                Return to Login
              </Button>
            </div>
          </Card>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-3">
              MMIS <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-2xl">HUB</span>
            </h1>
            <p className="text-slate-500 mt-3 font-bold uppercase text-[10px] tracking-[0.2em] opacity-60">Regional Logistics Intelligence</p>
          </div>

          <Card className="shadow-2xl border-none rounded-[40px] p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
            
            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-6 flex gap-2 items-center">
                    <Info size={16} /> {errorMsg}
                </div>
            )}

            {mode === 'LOGIN' && (
              <>
                <h2 className="text-xl font-black mb-8 text-center text-slate-800 tracking-tight">Operator Authentication</h2>
                <Input label="Registry ID / Email" icon={Mail} placeholder="operator@mmis.ug" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
                <Input label="Master Key" type="password" icon={Lock} placeholder="••••••••" value={password} onChange={(e:any)=>setPassword(e.target.value)} />
                
                <div className="flex items-center justify-between mb-8 px-1">
                  <label className="flex items-center text-xs text-slate-500 cursor-pointer font-black uppercase tracking-widest hover:text-indigo-600 transition-colors">
                    <input type="checkbox" className="mr-2 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Persistent Session
                  </label>
                  <button onClick={() => setMode('FORGOT')} className="text-xs text-indigo-600 font-black uppercase tracking-widest hover:underline">Lost Access?</button>
                </div>

                <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 mb-8" onClick={handleAuth} loading={loading}>Authorize Terminal</Button>
                
                <div className="mb-6 grid grid-cols-2 gap-2">
                    {DUMMY_CREDENTIALS.map((cred) => (
                        <button 
                            key={cred.label}
                            onClick={() => fillCredential(cred)}
                            className="text-[10px] text-left px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-lg text-slate-500 transition-colors font-bold uppercase"
                        >
                            {cred.label}
                        </button>
                    ))}
                </div>

                <div className="text-center space-y-4 pt-6 border-t border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    New entity? <button onClick={() => setMode('SIGNUP')} className="text-indigo-600 hover:underline">Register Now</button>
                  </p>
                  <button onClick={navigateToContact} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                    Contact Admin
                  </button>
                </div>
              </>
            )}

             {mode === 'SIGNUP' && (
              <>
                <h2 className="text-xl font-black mb-8 text-center text-slate-800 tracking-tight">Create Entity Ledger</h2>
                <Input label="Legal Entity Name" icon={User} placeholder="e.g. Mukasa James" value={name} onChange={(e:any)=>setName(e.target.value)} />
                <Input label="Registry Email" icon={Mail} placeholder="name@domain.com" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
                <Input label="Master Key Generation" type="password" icon={Lock} placeholder="Secure passphrase" value={password} onChange={(e:any)=>setPassword(e.target.value)} />
                
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                        <LayoutGrid size={14} className="text-indigo-600"/> Entity Role
                    </label>
                    <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                    >
                        <option value={UserRole.USER}>General User</option>
                        <option value={UserRole.VENDOR}>Vendor</option>
                        <option value={UserRole.SUPPLIER}>Supplier</option>
                    </select>
                </div>

                <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 mb-6" onClick={handleAuth} loading={loading}>Dispatch Credentials</Button>
                
                <div className="text-center flex flex-col gap-4">
                    <button 
                        onClick={() => setMode('LOGIN')} 
                        className="flex items-center justify-center gap-2 mx-auto text-xs text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wide"
                    >
                        <ArrowLeft size={12} /> Back to Login
                    </button>
                    <button onClick={navigateToContact} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                        Contact Admin
                    </button>
                </div>
              </>
            )}

            {mode === 'CONTACT' && (
              <>
                <h2 className="text-xl font-black mb-8 text-center text-slate-800 tracking-tight">Contact Administration</h2>
                
                <div className="space-y-6 mb-8">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4 cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => window.location.href = '#contact'}>
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900">Contact Form</h4>
                            <p className="text-xs text-slate-500 mt-1">Submit an official requisition.</p>
                            <p className="text-[10px] text-indigo-500 mt-1 font-bold uppercase">Direct Access Node</p>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900">System Helpline</h4>
                            <p className="text-xs text-slate-500 mt-1">+256 800 123 456</p>
                            <p className="text-[10px] text-slate-400 mt-1">Mon-Fri, 8am - 5pm</p>
                        </div>
                    </div>
                </div>

                <Button className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 mb-6" onClick={() => setMode('LOGIN')}>
                    Return to Login
                </Button>
              </>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
