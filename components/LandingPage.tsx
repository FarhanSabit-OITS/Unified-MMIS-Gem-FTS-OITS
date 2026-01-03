
import React, { useState } from 'react';
import { 
  ShieldCheck, BarChart3, Truck, Users, ArrowRight, LayoutDashboard, 
  Menu, X, Check, Building2, Wallet, Zap, Camera, Globe, Mail, 
  Phone, MapPin, Send, HelpCircle, Briefcase, Store, CheckCircle2, Loader2
} from 'lucide-react';
// Fixed: Added missing Card import
import { Card } from './ui/Card';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSolution, setActiveSolution] = useState<'ADMIN' | 'VENDOR' | 'SUPPLIER'>('ADMIN');
  const [contactStatus, setContactStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('SENDING');
    setTimeout(() => setContactStatus('SENT'), 1500);
  };

  const solutions = {
    ADMIN: {
      title: "Market Administrators",
      subtitle: "Full-scale regional oversight",
      description: "Manage thousands of vendors, track real-time revenue collection, and maintain physical assets from a unified command center.",
      features: ["Revenue Triangulation", "Staff Roster Management", "Asset Maintenance Tracking", "Digital Tenant Ledger"],
      icon: <Building2 className="text-blue-600" size={32} />
    },
    VENDOR: {
      title: "Market Vendors",
      subtitle: "Digitalize your physical store",
      description: "Manage your inventory, process sales via POS, and handle rent payments directly from your mobile device.",
      features: ["Inventory Tracking", "Mobile POS System", "Rent Cycle Alerts", "Supply Requisitions"],
      icon: <Store className="text-emerald-600" size={32} />
    },
    SUPPLIER: {
      title: "Bulk Suppliers",
      subtitle: "Optimize your supply chain",
      description: "Access a wider market of vendors, bid on open requisitions, and automate your logistics with digital gate passes.",
      features: ["Bidding War-room", "Logistics Gate Tokens", "AI Trust Scoring", "Escrow Settlements"],
      icon: <Truck className="text-purple-600" size={32} />
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans scroll-smooth">
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <LayoutDashboard size={24} />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">MMIS</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Features</a>
              <a href="#solutions" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Solutions</a>
              <a href="#contact" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Contact</a>
              <button 
                onClick={onLoginClick}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-xl shadow-slate-200"
              >
                Access Portal
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-6 space-y-4 animate-in slide-in-from-top-4">
             <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-black text-slate-600 uppercase tracking-widest">Features</a>
             <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-black text-slate-600 uppercase tracking-widest">Solutions</a>
             <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-black text-slate-600 uppercase tracking-widest">Contact</a>
             <button onClick={onLoginClick} className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg">Access Portal</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] opacity-60 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Next-Gen Regional Trade OS
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-6">
             The Future of <span className="text-indigo-600">Market Management</span> <br/> is Here.
           </h1>
           <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 font-medium">
             MMIS integrates finance, logistics, and identity verification into a single unified platform. 
             Empowering markets across East Africa with digital intelligence.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-5 animate-in fade-in slide-in-from-bottom-10">
              <button onClick={onLoginClick} className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
                 Launch Console <ArrowRight size={20} />
              </button>
              <a href="#contact" className="px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl border-2 border-slate-100 transition-all shadow-sm flex items-center justify-center">
                 Book a Demo
              </a>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-50 border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
               <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Core Ecosystem</h2>
               <h3 className="text-4xl font-black text-slate-900 tracking-tight">Built for Market Scale</h3>
               <p className="text-slate-500 mt-4 max-w-lg mx-auto font-medium">Standardizing regional commerce through high-fidelity data nodes and automated workflows.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <FeatureCard 
                  icon={<BarChart3 className="text-indigo-600" />}
                  title="Revenue Triangulation"
                  desc="Real-time collection audits and automated URA VAT compliance. Track every shilling from gate to shop."
               />
               <FeatureCard 
                  icon={<ShieldCheck className="text-emerald-600" />}
                  title="Biometric KYC Nodes"
                  desc="Verify identity via NID triangulation. Prevent registry ghosting and ensure secure shop allocations."
               />
               <FeatureCard 
                  icon={<Truck className="text-purple-600" />}
                  title="Logistics Bridge"
                  desc="Synchronized supply chain with QR-based gate passes. Bidding war-rooms for high-volume requisitions."
               />
               <FeatureCard 
                  icon={<Camera className="text-red-600" />}
                  title="Smart Asset Tracking"
                  desc="Live CCTV telemetry and power consumption auditing. Maintain physical infrastructure via AI-driven tickets."
               />
               <FeatureCard 
                  icon={<Wallet className="text-amber-600" />}
                  title="Escrow Settlements"
                  desc="Multi-party transaction security. Funds are locked during supply transit and released upon verification."
               />
               <FeatureCard 
                  icon={<Globe className="text-blue-600" />}
                  title="Multi-Tenant Hub"
                  desc="Scale from a single retail market to a national network of specialized trade hubs seamlessly."
               />
            </div>
         </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Solutions</h2>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">Tailored for every <br/> trade participant.</h3>
              
              <div className="space-y-4">
                {(Object.keys(solutions) as Array<keyof typeof solutions>).map((key) => (
                  <button 
                    key={key}
                    onClick={() => setActiveSolution(key)}
                    className={`w-full text-left p-6 rounded-3xl transition-all border-2 flex items-center justify-between group ${
                      activeSolution === key ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        activeSolution === key ? 'bg-white/10' : 'bg-slate-50'
                      }`}>
                        {key === 'ADMIN' ? <Building2 size={24}/> : key === 'VENDOR' ? <Store size={24}/> : <Truck size={24}/>}
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-widest">{solutions[key].title}</h4>
                        <p className={`text-xs ${activeSolution === key ? 'text-slate-400' : 'text-slate-400'}`}>{solutions[key].subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight size={20} className={`transition-transform ${activeSolution === key ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-[48px] p-12 border border-slate-100 relative min-h-[500px] flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500" key={activeSolution}>
              <div className="mb-8">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
                  {solutions[activeSolution].icon}
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{solutions[activeSolution].title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">{solutions[activeSolution].description}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {solutions[activeSolution].features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={14} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200">
                <button onClick={onLoginClick} className="text-indigo-600 font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                  Join the Network <ArrowRight size={16}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced Colors */}
      <section id="contact" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Registry Access</h2>
              <h3 className="text-6xl font-black tracking-tighter mb-10 leading-none">Let's build your <br/> <span className="text-indigo-400 underline decoration-indigo-400/20 underline-offset-8">digital market</span>.</h3>
              <p className="text-slate-400 font-medium text-xl leading-relaxed mb-12 max-w-md">Our regional deployment specialists are ready to onboard your supply chain network or market infrastructure.</p>
              
              <div className="space-y-8">
                <ContactInfo icon={<Mail size={24}/>} title="Direct Registry" value="deploy@mmis.tevas.ug" subtitle="Technical & Sales Engineering" />
                <ContactInfo icon={<Phone size={24}/>} title="System Support" value="+256 800 123 456" subtitle="Operational Readiness (Mon - Fri)" />
                <ContactInfo icon={<MapPin size={24}/>} title="Regional HQ" value="Kampala IT Park, Level 4" subtitle="Block C, Nakawa Division" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-[64px]"></div>
              <Card className="bg-white p-12 rounded-[56px] shadow-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                <div className="relative z-10">
                  {contactStatus === 'SENT' ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl ring-4 ring-emerald-500/10">
                        <CheckCircle2 size={48} />
                      </div>
                      <h4 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Dispatch Verified</h4>
                      <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xs mx-auto">A regional trade specialist will contact your node within 24 operational cycles.</p>
                      <button onClick={() => setContactStatus('IDLE')} className="mt-10 px-8 py-3 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-indigo-600 transition-all">Send Another Requisition</button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Entity Head</label>
                          <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm shadow-inner" placeholder="James Mukasa" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Registry Email</label>
                          <input required type="email" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm shadow-inner" placeholder="james@market.ug" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Inquiry Classification</label>
                        <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm shadow-inner appearance-none">
                          <option>Market Administration Demo</option>
                          <option>Bulk Supplier Integration</option>
                          <option>System Node Partnership</option>
                          <option>General Support Request</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Message Buffer</label>
                        <textarea required rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm shadow-inner resize-none" placeholder="Describe your operational requirements..." />
                      </div>
                      <button 
                        disabled={contactStatus === 'SENDING'}
                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-3xl transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3"
                      >
                        {contactStatus === 'SENDING' ? <><Loader2 className="animate-spin" size={20}/> Routing Node...</> : <><Send size={20}/> Initiate Contact</>}
                      </button>
                    </form>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/5 py-24 text-slate-500">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
               <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-2 text-white mb-8">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                      <LayoutDashboard size={24} />
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase">MMIS HUB</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-8 font-medium">Standardizing African regional trade with high-fidelity logistics and digital identity layers. Engineered for market scale.</p>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer"><Globe size={18} className="text-white"/></div>
                  </div>
               </div>
               <div>
                 <h5 className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-8">Ecosystem Hub</h5>
                 <ul className="space-y-5 text-xs font-bold">
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Market Registry</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Gate Terminal</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Revenue Triage</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Supply Bridge</a></li>
                 </ul>
               </div>
               <div>
                 <h5 className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-8">Operator Nodes</h5>
                 <ul className="space-y-5 text-xs font-bold">
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Developer API</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Registry Guides</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Compliance Doc</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Trust Matrix</a></li>
                 </ul>
               </div>
               <div>
                 <h5 className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-8">System Entity</h5>
                 <ul className="space-y-5 text-xs font-bold">
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Privacy Protocol</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Trade Governance</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest opacity-60 hover:opacity-100">Identity License</a></li>
                 </ul>
               </div>
            </div>
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                  &copy; {new Date().getFullYear()} Tevas Technologies. MMIS-OS v2.5.0-ALPHA
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">All Systems Operational</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-12 rounded-[48px] border-2 border-slate-50 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-3 group overflow-hidden relative">
     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-600 group-hover:w-[1000px] group-hover:h-[1000px] transition-all duration-700 -z-0"></div>
     <div className="relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-inner">
            {icon}
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-white transition-colors">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed font-medium group-hover:text-indigo-100 transition-colors">{desc}</p>
     </div>
  </div>
);

const ContactInfo = ({ icon, title, value, subtitle }: { icon: any, title: string, value: string, subtitle: string }) => (
  <div className="flex gap-8 group">
    <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300 shadow-xl">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <p className="text-2xl font-black mb-1 group-hover:text-indigo-400 transition-colors">{value}</p>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{subtitle}</p>
    </div>
  </div>
);
