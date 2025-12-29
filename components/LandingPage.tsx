import React from 'react';
import { ShieldCheck, BarChart3, Truck, Users, ArrowRight, LayoutDashboard, Menu, X, Check } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <LayoutDashboard size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">MMIS</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Features</a>
              <a href="#roles" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Solutions</a>
              <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Contact</a>
              <button 
                onClick={onLoginClick}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-slate-200"
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
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4">
             <a href="#features" className="block text-sm font-medium text-slate-600">Features</a>
             <a href="#roles" className="block text-sm font-medium text-slate-600">Solutions</a>
             <button onClick={onLoginClick} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg">Access Portal</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6 animate-in fade-in slide-in-from-bottom-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now Live in 4 Cities
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6">
             The Future of <span className="text-blue-600">Market Operations</span> <br/> is Digital.
           </h1>
           <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8">
             Connect Vendors, Suppliers, and Market Admins in a single unified ecosystem. 
             Manage payments, logistics, and assets with AI-driven insights.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10">
              <button onClick={onLoginClick} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl shadow-blue-200 transition-transform hover:-translate-y-1 flex items-center justify-center gap-2">
                 Get Started <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors">
                 Request Demo
              </button>
           </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-slate-900">Enterprise-Grade Modules</h2>
               <p className="text-slate-500 mt-2">Everything you need to run a modern marketplace.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <FeatureCard 
                  icon={<Users className="text-blue-600" />}
                  title="Vendor Management"
                  desc="Digital KYC, shop allocation, rent tracking, and performance analytics for thousands of vendors."
               />
               <FeatureCard 
                  icon={<Truck className="text-purple-600" />}
                  title="Supplier Logistics"
                  desc="Bidding war-rooms, AI trust scores, and automated gate entry tokens for seamless supply chains."
               />
               <FeatureCard 
                  icon={<BarChart3 className="text-green-600" />}
                  title="Financial Intelligence"
                  desc="Real-time revenue tracking, tax collection, expense audits, and mobile money integration."
               />
               <FeatureCard 
                  icon={<ShieldCheck className="text-amber-600" />}
                  title="Asset & Security"
                  desc="CCTV integration, power usage monitoring, and automated gate access controls."
               />
               <FeatureCard 
                  icon={<LayoutDashboard className="text-indigo-600" />}
                  title="Admin Dashboard"
                  desc="A powerful command center for Market Admins to oversee operations and resolve tickets."
               />
               <FeatureCard 
                  icon={<Users className="text-pink-600" />}
                  title="Public Access"
                  desc="Transparent application processes for aspiring vendors and suppliers."
               />
            </div>
         </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <div className="flex items-center gap-2 text-white mb-2">
                  <LayoutDashboard size={20} />
                  <span className="font-bold text-lg">MMIS</span>
               </div>
               <p className="text-sm">Empowering African Markets with Technology.</p>
            </div>
            <div className="text-sm">
               &copy; {new Date().getFullYear()} Tevas Technologies. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
     <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
        {icon}
     </div>
     <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
     <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);
