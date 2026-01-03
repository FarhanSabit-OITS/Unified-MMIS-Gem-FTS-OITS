
import React, { useState } from 'react';
import { 
  ShieldCheck, BarChart3, Truck, Users, ArrowRight, LayoutDashboard, 
  Menu, X, Check, Building2, Wallet, Zap, Camera, Globe, Mail, 
  Phone, MapPin, Send, HelpCircle, Briefcase, Store
} from 'lucide-react';

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

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Contact</h2>
              <h3 className="text-5xl font-black tracking-tighter mb-8 leading-tight">Let's build your <br/> digital market.</h3>
              <p className="text-slate-400 font-medium text-lg leading-relaxed mb-12 max-w-md">Our technical team is ready to assist with onboarding your market or enterprise supply chain.</p>
              
              <div className="space-y-8">
                <ContactInfo icon={<Mail size={24}/>} title="Email Inquiries" value="deploy@mmis.tevas.ug" subtitle="Technical & Sales" />
                <ContactInfo icon={<Phone size={24}/>} title="Support Line" value="+256 800 123 456" subtitle="Mon - Fri, 8am - 5pm" />
                <ContactInfo icon={<MapPin size={24}/>} title="Regional HQ" value="Kampala IT Park, Level 4" subtitle="Block C, Nakawa" />
              </div>
            </div>

            <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-white/20 relative group">
              <div className="absolute inset-0 bg-indigo-600/10 rounded-[48px] blur-xl group-hover:bg-indigo-600/20 transition-all duration-700"></div>
              <div className="relative z-10">
                {contactStatus === 'SENT' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 ring-4 ring-emerald-500/10">
                      <CheckCircle2 size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2">Message Dispatched</h4>
                    <p className="text-slate-500 font-medium">A regional trade specialist will contact <br/> you within 24 operational hours.</p>
                    <button onClick={() => setContactStatus('IDLE')} className="mt-8 text-indigo-600 font-black uppercase text-xs tracking-widest hover:text-indigo-700 underline">Send another</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                        <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium" placeholder="James Mukasa" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Work Email</label>
                        <input required type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium" placeholder="james@market.ug" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Request Category</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium appearance-none">
                        <option>Market Administration Demo</option>
                        <option>Bulk Supplier Registration</option>
                        <option>Technical Partnership</option>
                        <option>General Support</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Message</label>
                      <textarea required rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium resize-none" placeholder="How can we help your operations?" />
                    </div>
                    <button 
                      disabled={contactStatus === 'SENDING'}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-2xl shadow-indigo-900/20 flex items-center justify-center gap-3"
                    >
                      {contactStatus === 'SENDING' ? <><Loader2 className="animate-spin" size={18}/> Routing...</> : <><Send size={18}/> Initiate Contact</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/5 py-16 text-slate-500">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
               <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-2 text-white mb-6">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                      <LayoutDashboard size={20} />
                    </div>
                    <span className="font-black text-xl tracking-tighter">MMIS</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6 font-medium">Standardizing African trade with regional logistics and digital identity layers.</p>
               </div>
               <div>
                 <h5 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">Platform</h5>
                 <ul className="space-y-4 text-sm font-bold">
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">Registry</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">Gate Control</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">Finance</a></li>
                 </ul>
               </div>
               <div>
                 <h5 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">Resources</h5>
                 <ul className="space-y-4 text-sm font-bold">
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">Developer API</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">User Guides</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">Security</a></li>
                 </ul>
               </div>
               <div>
                 <h5 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">Legal</h5>
                 <ul className="space-y-4 text-sm font-bold">
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">Trade Terms</a></li>
                    <li><a href="#" className="hover:text-indigo-400 transition-colors uppercase tracking-widest text-[10px]">License</a></li>
                 </ul>
               </div>
            </div>
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="text-[10px] font-black uppercase tracking-widest">
                  &copy; {new Date().getFullYear()} Tevas Technologies. MMIS Regional v2.4.0
               </div>
               <div className="flex gap-8">
                  <Globe size={18} className="hover:text-white cursor-pointer transition-colors" />
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 group">
     <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
        {icon}
     </div>
     <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
     <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
  </div>
);

const ContactInfo = ({ icon, title, value, subtitle }: { icon: any, title: string, value: string, subtitle: string }) => (
  <div className="flex gap-6 group">
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-xl font-bold mb-0.5">{value}</p>
      <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
    </div>
  </div>
);

const CheckCircle2 = ({ size, className = "" }: { size: number, className?: string }) => (
  <Check size={size} className={className} />
);

const Loader2 = ({ size, className = "" }: { size: number, className?: string }) => (
  <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
