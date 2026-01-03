
import React, { useState, useEffect } from 'react';
import { MOCK_TOKENS, MOCK_BIDS, MOCK_REQUISITIONS, MOCK_VENDORS } from '../constants';
import { GateToken, VehicleCategory, Bid, Requisition, Vendor } from '../types';
import { PaymentGateway } from './PaymentGateway';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  QrCode, CheckCircle, Truck, Printer, Search, DollarSign, ShieldAlert,
  Calendar, ArrowRight, Smartphone, ShieldCheck, Download, X, Car, Bike, Info,
  LogOut, LogIn, Activity, History, Trash2, Camera, PackageCheck, ClipboardCheck,
  ShieldX, UserPlus, Zap, Monitor, Cpu, UserCheck, AlertTriangle
} from 'lucide-react';

const VEHICLE_FEES = {
  [VehicleCategory.HEAVY_TRUCK]: 15000,
  [VehicleCategory.LIGHT_VAN]: 7000,
  [VehicleCategory.SALOON_CAR]: 5000,
  [VehicleCategory.MOTORBIKE]: 2000
};

export const GateManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'VENDOR_TRIAGE' | 'EXIT' | 'LOGS'>('TERMINAL');
  const [tokens, setTokens] = useState<GateToken[]>(MOCK_TOKENS);
  const [isLoading, setIsLoading] = useState(false);
  
  // Terminal Logic State
  const [manifestCode, setManifestCode] = useState('');
  const [foundBid, setFoundBid] = useState<Bid | null>(null);
  const [foundReq, setFoundReq] = useState<Requisition | null>(null);
  
  // Vendor Triage State
  const [vendorCode, setVendorCode] = useState('');
  const [scannedVendor, setScannedVendor] = useState<Vendor | null>(null);

  const handleScanVendor = () => {
      if(!vendorCode) return;
      setIsLoading(true);
      setTimeout(() => {
          const match = MOCK_VENDORS.find(v => vendorCode.includes(v.id.toUpperCase())) || null;
          setScannedVendor(match);
          setIsLoading(false);
      }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-slate-950 text-white rounded-[32px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
                <Smartphone size={40} className="text-indigo-400" />
             </div>
             <div>
                <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Terminal Console</h2>
                <p className="text-slate-500 font-medium text-lg mt-2 flex items-center gap-2">
                   <Monitor size={18} className="text-indigo-600" /> Hub Access Protocol
                </p>
             </div>
          </div>
          <div className="flex bg-slate-100 p-2 rounded-[28px] shadow-inner border border-slate-200 overflow-x-auto max-w-full">
             {[
                 { id: 'TERMINAL', label: 'Logistics', icon: Truck },
                 { id: 'VENDOR_TRIAGE', label: 'Vendor Scan', icon: UserCheck },
                 { id: 'EXIT', label: 'Outbound', icon: LogOut },
                 { id: 'LOGS', label: 'Telemetry', icon: Activity }
             ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
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
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 scale-150"><QrCode size={300}/></div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Registry Verification</h3>
                    <p className="text-slate-500 mb-10 font-medium">Scan Vendor store profile to verify Registry Node integrity and Fiscal Health.</p>
                    
                    <div className="flex gap-4 mb-10">
                        <div className="relative flex-1">
                            <QrCode className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                            <input 
                                className="w-full pl-16 pr-6 py-6 rounded-[28px] bg-slate-50 border-4 border-slate-50 outline-none font-mono text-xl tracking-[0.2em] focus:border-indigo-600 focus:bg-white transition-all shadow-inner uppercase" 
                                placeholder="ENTITY-CODE-ALPHA"
                                value={vendorCode}
                                onChange={e => setVendorCode(e.target.value.toUpperCase())}
                            />
                        </div>
                        <Button onClick={handleScanVendor} loading={isLoading} className="px-10 rounded-[28px] bg-slate-950 hover:bg-black font-black uppercase tracking-widest text-[10px]">Verify Node</Button>
                    </div>

                    {scannedVendor && (
                        <div className="animate-in zoom-in-95 bg-slate-50 rounded-[40px] p-10 border-4 border-white shadow-inner space-y-8 text-left relative z-10">
                             <div className="flex justify-between items-start">
                                 <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Entity Profile</p>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{scannedVendor.name}</h4>
                                    <p className="text-sm font-bold text-slate-400 mt-1">Shop Node #{scannedVendor.shopNumber}</p>
                                 </div>
                                 <div className={`p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center min-w-[120px] ${scannedVendor.status === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span>
                                    <span className="text-lg font-black uppercase tracking-tighter">{scannedVendor.status}</span>
                                 </div>
                             </div>

                             <div className="grid grid-cols-2 gap-6">
                                 <div className={`p-6 rounded-3xl border-2 ${scannedVendor.rentDue > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fiscal Health</p>
                                     <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${scannedVendor.rentDue > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                        <p className={`text-xl font-black ${scannedVendor.rentDue > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                                            {scannedVendor.rentDue > 0 ? `${scannedVendor.rentDue.toLocaleString()} UGX Arrears` : 'Remittance Clear'}
                                        </p>
                                     </div>
                                 </div>
                                 <div className="p-6 bg-white rounded-3xl border-2 border-slate-100">
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">KYC Registry</p>
                                     <div className="flex items-center gap-2">
                                        {scannedVendor.kycVerified ? <ShieldCheck className="text-indigo-600" size={24}/> : <AlertTriangle className="text-amber-500" size={24}/>}
                                        <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">{scannedVendor.kycVerified ? 'Validated' : 'Pending Sync'}</p>
                                     </div>
                                 </div>
                             </div>

                             <div className="flex gap-4">
                                <Button className={`flex-1 h-20 rounded-[28px] font-black uppercase tracking-widest text-[11px] shadow-2xl ${scannedVendor.status === 'ACTIVE' && scannedVendor.rentDue <= 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-950'}`}>Authorize Hub Entry</Button>
                                <Button variant="secondary" onClick={() => setScannedVendor(null)} className="h-20 w-20 rounded-[28px] p-0 border-2"><X size={24}/></Button>
                             </div>
                        </div>
                    )}
                </Card>
           </div>
       )}

       {activeTab === 'TERMINAL' && (
          <div className="text-center py-20 bg-slate-900/5 rounded-[48px] border-4 border-dashed border-slate-200">
             <Truck size={64} className="mx-auto text-slate-300 mb-4 opacity-40"/>
             <p className="font-black text-slate-400 uppercase tracking-widest">Logistics Manifest Scanner Active</p>
          </div>
       )}
    </div>
  );
};
