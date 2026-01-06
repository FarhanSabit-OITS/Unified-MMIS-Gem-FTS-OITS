
import React, { useState } from 'react';
import { MOCK_VENDORS, MARKETS } from '../constants';
import { Vendor, UserRole } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
// Fix: Added missing DollarSign icon import
import { 
  QrCode, Truck, Smartphone, ShieldCheck, X, Monitor, UserCheck, 
  ShieldAlert, AlertTriangle, History, CheckCircle, DollarSign
} from 'lucide-react';

interface GateManagementModuleProps {
  currentMarketId?: string;
  userRole?: UserRole;
}

export const GateManagementModule: React.FC<GateManagementModuleProps> = ({ currentMarketId = 'm1', userRole }) => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'VENDOR_TRIAGE' | 'HISTORY'>('TERMINAL');
  const [isLoading, setIsLoading] = useState(false);
  const [vendorCode, setVendorCode] = useState('');
  const [scannedVendor, setScannedVendor] = useState<Vendor | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isMarketAdmin = userRole === UserRole.MARKET_ADMIN;
  const currentMarket = MARKETS.find(m => m.id === currentMarketId);

  const handleScanVendor = () => {
      if(!vendorCode) return;
      setIsLoading(true);
      setValidationError(null);
      
      // Artificial latency for triangulation simulation
      setTimeout(() => {
          const match = MOCK_VENDORS.find(v => v.id.toUpperCase() === vendorCode || `KEY-${v.id.slice(-8)}`.toUpperCase() === vendorCode) || null;
          
          if (!match) {
            setValidationError("REGISTRY ERROR: Identity Node not triangulated in database.");
            setScannedVendor(null);
          } else if (match.marketId !== currentMarketId) {
            setValidationError(`CROSS-HUB ALERT: Entity is scoped to ${MARKETS.find(m => m.id === match.marketId)?.name}. Unauthorized for ${currentMarket?.name}.`);
            setScannedVendor(match);
          } else if (match.status !== 'ACTIVE') {
            setValidationError(`ACCESS DENIED: Account status is ${match.status}. Administrative clearance required.`);
            setScannedVendor(match);
          } else if (match.rentDue > 1000000) {
            setValidationError("FISCAL ALERT: Liability ceiling exceeded. Access suspended until settlement.");
            setScannedVendor(match);
          } else {
            setScannedVendor(match);
          }
          setIsLoading(false);
      }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-slate-950 text-white rounded-[32px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
                <Smartphone size={40} className="text-indigo-400" />
             </div>
             <div>
                <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Gate Terminal</h2>
                <p className="text-slate-500 font-medium text-lg mt-2 flex items-center gap-2 tracking-widest uppercase">
                   <Monitor size={18} className="text-indigo-600" /> HUB: {currentMarket?.name || 'TERMINAL-01'}
                </p>
             </div>
          </div>
          <div className="flex bg-slate-100 p-2 rounded-[28px] shadow-inner border border-slate-200">
             {[
                 { id: 'TERMINAL', label: 'Logistics', icon: Truck },
                 { id: 'VENDOR_TRIAGE', label: 'Entity Scan', icon: UserCheck },
                 { id: 'HISTORY', label: 'Logs', icon: History }
             ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setScannedVendor(null); setValidationError(null); }} 
                    className={`px-8 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-white shadow-2xl text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                 >
                    <tab.icon size={16}/> {tab.label}
                 </button>
             ))}
          </div>
       </div>

       {activeTab === 'VENDOR_TRIAGE' && (
           <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-6">
                <Card className="p-12 rounded-[56px] bg-white shadow-2xl border-none text-center relative overflow-hidden">
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Identity Synchronization</h3>
                    <p className="text-slate-500 mb-10 font-medium max-w-md mx-auto uppercase text-[10px] tracking-widest">Validate Operator Key & Fiscal Compliance</p>
                    
                    <div className="flex gap-4 mb-10">
                        <div className="relative flex-1">
                            <QrCode className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                            <input 
                                className="w-full pl-16 pr-6 py-6 rounded-[28px] bg-slate-50 border-4 border-slate-50 outline-none font-mono text-xl tracking-[0.2em] focus:border-indigo-600 focus:bg-white transition-all uppercase" 
                                placeholder="INPUT OPERATOR KEY"
                                value={vendorCode}
                                onChange={e => setVendorCode(e.target.value.toUpperCase())}
                            />
                        </div>
                        <Button onClick={handleScanVendor} loading={isLoading} className="px-10 rounded-[28px] bg-slate-950 hover:bg-black font-black uppercase tracking-widest text-[10px]">Execute Sync</Button>
                    </div>

                    {validationError && (
                      <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[40px] mb-8 text-left flex items-start gap-5 animate-in shake duration-500">
                        <ShieldAlert size={32} className="text-rose-600 shrink-0" />
                        <div>
                          <p className="text-rose-700 font-black text-xs uppercase tracking-widest mb-1">Authorization Fault</p>
                          <p className="text-rose-600 font-bold text-sm leading-relaxed">{validationError}</p>
                        </div>
                      </div>
                    )}

                    {scannedVendor && !validationError && (
                        <div className="animate-in zoom-in-95 bg-slate-50 rounded-[48px] p-10 border-4 border-white shadow-inner space-y-10 text-left relative z-10">
                             <div className="flex justify-between items-start">
                                 <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Authenticated Registry Node</p>
                                    <h4 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{scannedVendor.name}</h4>
                                    <p className="text-sm font-bold text-slate-400 mt-2 tracking-widest">UNIT NODE: #{scannedVendor.shopNumber}</p>
                                 </div>
                                 <div className="bg-emerald-600 text-white p-6 rounded-[32px] shadow-2xl flex flex-col items-center justify-center min-w-[160px]">
                                    <ShieldCheck size={32} className="mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span>
                                    <span className="text-xl font-black uppercase tracking-tighter">VERIFIED</span>
                                 </div>
                             </div>

                             <div className="grid grid-cols-2 gap-6">
                                 {/* Fix: Added missing DollarSign icon */}
                                 <div className="p-8 bg-white rounded-[32px] border-2 border-slate-100 shadow-sm">
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><DollarSign size={10}/> Remittance Node</p>
                                     <p className="text-2xl font-black text-emerald-600">CLEARED</p>
                                 </div>
                                 <div className="p-8 bg-white rounded-[32px] border-2 border-slate-100 shadow-sm">
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle size={10}/> Registry Node</p>
                                     <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">PRIMARY HUB</p>
                                 </div>
                             </div>

                             <div className="flex gap-4">
                                <Button className="flex-1 h-20 rounded-[32px] font-black uppercase tracking-widest text-[11px] bg-indigo-600 hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.3)]">Authorize Entry Protocol</Button>
                                <Button variant="secondary" onClick={() => { setScannedVendor(null); setVendorCode(''); }} className="h-20 w-20 rounded-[32px] p-0 border-2"><X size={24}/></Button>
                             </div>
                        </div>
                    )}
                </Card>
           </div>
       )}

       {activeTab === 'TERMINAL' && (
          <div className="text-center py-32 bg-slate-900/5 rounded-[64px] border-4 border-dashed border-slate-200">
             <Truck size={64} className="mx-auto text-slate-300 mb-6 opacity-40 animate-pulse"/>
             <p className="font-black text-slate-400 uppercase tracking-[0.4em] text-sm">Logistics Bridge Waiting for Manifest Sync</p>
          </div>
       )}
    </div>
  );
};
