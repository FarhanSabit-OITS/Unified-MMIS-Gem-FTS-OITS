
import React, { useState, useEffect } from 'react';
import { MOCK_TOKENS, MOCK_BIDS, MOCK_REQUISITIONS } from '../constants';
import { GateToken, VehicleCategory, Bid, Requisition } from '../types';
import { PaymentGateway } from './PaymentGateway';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  QrCode, CheckCircle, Truck, Printer, Search, DollarSign, ShieldAlert,
  Calendar, ArrowRight, Smartphone, ShieldCheck, Download, X, Car, Bike, Info,
  LogOut, LogIn, Activity, History, Trash2, Camera, PackageCheck, ClipboardCheck,
  ShieldX, UserPlus, Zap, Monitor, Cpu
} from 'lucide-react';

const VEHICLE_FEES = {
  [VehicleCategory.HEAVY_TRUCK]: 15000,
  [VehicleCategory.LIGHT_VAN]: 7000,
  [VehicleCategory.SALOON_CAR]: 5000,
  [VehicleCategory.MOTORBIKE]: 2000
};

export const GateManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'EXIT' | 'DELIVERIES' | 'LOGS'>('TERMINAL');
  const [tokens, setTokens] = useState<GateToken[]>(MOCK_TOKENS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>(VehicleCategory.SALOON_CAR);
  
  // Terminal Logic State
  const [manifestCode, setManifestCode] = useState('');
  const [foundBid, setFoundBid] = useState<Bid | null>(null);
  const [foundReq, setFoundReq] = useState<Requisition | null>(null);
  const [securityCheckPassed, setSecurityCheckPassed] = useState(false);
  
  // Flow State
  const [pendingPayment, setPendingPayment] = useState<any | null>(null);
  const [receiptToken, setReceiptToken] = useState<GateToken | null>(null);

  // Filter accepted bids for incoming logistics
  const acceptedDeliveries = MOCK_BIDS.filter(b => b.status === 'ACCEPTED');

  const handleScanManifest = (codeOverride?: string) => {
      const code = codeOverride || manifestCode;
      if(!code) return;
      setIsLoading(true);
      
      setTimeout(() => {
          const match = acceptedDeliveries.find(d => code.includes(d.id.toUpperCase())) || acceptedDeliveries[0];
          const reqMatch = MOCK_REQUISITIONS.find(r => r.id === match.requisitionId);
          setFoundBid(match);
          setFoundReq(reqMatch || null);
          setIsLoading(false);
      }, 800);
  };

  const calculateFees = () => {
      if (!foundBid) return;
      const parkingFee = VEHICLE_FEES[selectedVehicle];
      const vat = parkingFee * 0.18;
      const total = parkingFee + vat;

      setPendingPayment({
          amount: total,
          taxAmount: vat,
          description: `Logistics Node Entry: ${foundBid.supplierName}`,
          parking: parkingFee
      });
  };

  const finalizeEntry = (txId: string) => {
      const newToken: GateToken = {
          id: `gt${Date.now()}`,
          code: `MMIS-ENT-${Math.floor(Math.random()*9000)+1000}`,
          type: 'ENTRY',
          entityName: foundBid?.supplierName || 'General Logistics',
          status: 'ACTIVE',
          generatedAt: new Date().toISOString(),
          vehicleType: selectedVehicle,
          associatedFee: pendingPayment.amount,
          taxAmount: pendingPayment.taxAmount
      };

      setTokens([newToken, ...tokens]);
      setReceiptToken(newToken);
      setPendingPayment(null);
      setFoundBid(null);
      setSecurityCheckPassed(false);
      setManifestCode('');
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
       {pendingPayment && (
           <PaymentGateway 
              amount={pendingPayment.amount}
              taxAmount={pendingPayment.taxAmount}
              description={pendingPayment.description}
              onClose={() => setPendingPayment(null)}
              onSuccess={(txId) => finalizeEntry(txId)}
           />
       )}

       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-slate-950 text-white rounded-[32px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
                <Smartphone size={40} className="text-indigo-400" />
             </div>
             <div>
                <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Terminal Console</h2>
                <p className="text-slate-500 font-medium text-lg mt-2 flex items-center gap-2">
                   <Monitor size={18} className="text-indigo-600" /> Centralized Hub Triage Node
                </p>
             </div>
          </div>
          <div className="flex bg-slate-100 p-2 rounded-[28px] shadow-inner border border-slate-200 overflow-x-auto max-w-full">
             {[
                 { id: 'TERMINAL', label: 'Inbound', icon: LogIn },
                 { id: 'EXIT', label: 'Outbound', icon: LogOut },
                 { id: 'DELIVERIES', label: 'Manifests', icon: ClipboardCheck },
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

       {activeTab === 'TERMINAL' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <div className="lg:col-span-2 space-y-8">
                <Card className="p-12 rounded-[64px] border-none shadow-2xl bg-white relative overflow-hidden ring-1 ring-slate-100">
                    <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12 scale-150"><Truck size={400} /></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-12">
                           <h3 className="text-3xl font-black text-slate-950 flex items-center gap-5 tracking-tighter uppercase">
                              <div className="p-5 bg-slate-950 text-white rounded-[24px] shadow-2xl"><QrCode size={32} className="text-indigo-400"/></div>
                              Registry Sync
                           </h3>
                           <div className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border-2 border-indigo-100">
                              HUB-01-NKR
                           </div>
                        </div>
                        
                        <div className="space-y-12 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-lg">1</div>
                                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em]">Vehicle Classification Matrix</h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                    {Object.entries(VEHICLE_FEES).map(([type, fee]) => (
                                        <button 
                                            key={type}
                                            onClick={() => setSelectedVehicle(type as VehicleCategory)}
                                            className={`p-8 rounded-[40px] border-4 transition-all flex flex-col items-center gap-5 group ${selectedVehicle === type ? 'border-indigo-600 bg-indigo-50/30 text-indigo-950 shadow-2xl' : 'border-slate-50 text-slate-300 hover:bg-slate-50 hover:border-slate-100'}`}
                                        >
                                            <div className={`p-5 rounded-[24px] transition-all duration-500 ${selectedVehicle === type ? 'bg-indigo-600 text-white scale-110 shadow-indigo-200 shadow-2xl' : 'bg-slate-100 group-hover:bg-white'}`}>
                                                {type === VehicleCategory.HEAVY_TRUCK ? <Truck size={32}/> : type === VehicleCategory.MOTORBIKE ? <Bike size={32}/> : <Car size={32}/>}
                                            </div>
                                            <div className="text-center">
                                                <span className="text-[11px] font-black uppercase tracking-tighter block group-hover:text-indigo-600">{type.replace('_', ' ')}</span>
                                                <span className="text-lg font-black text-slate-900 mt-2 block tracking-tighter">{(fee/1000).toFixed(1)}K <span className="text-[10px] opacity-30 font-bold">UGX</span></span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black shadow-lg">2</div>
                                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.3em]">Manifest Authorization Buffer</h4>
                                </div>
                                <div className="flex gap-5">
                                    <div className="relative flex-1 group">
                                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={28} />
                                        <input 
                                            type="text" 
                                            className="w-full pl-20 pr-10 py-8 rounded-[40px] border-4 border-slate-50 bg-slate-50 font-mono text-3xl tracking-[0.3em] focus:bg-white focus:border-indigo-600 outline-none transition-all uppercase placeholder:text-slate-200 shadow-inner text-slate-950 font-black" 
                                            placeholder="SCAN-ID"
                                            value={manifestCode}
                                            onChange={e => setManifestCode(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <Button onClick={() => handleScanManifest()} loading={isLoading} className="h-full px-16 rounded-[40px] uppercase font-black tracking-[0.3em] text-sm shadow-2xl shadow-indigo-100 bg-slate-950 hover:bg-black border-none transition-transform active:scale-95">Verify</Button>
                                </div>
                            </div>
                        </div>

                        {foundBid && (
                            <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-10 p-12 rounded-[56px] border-4 border-emerald-500/20 bg-emerald-50/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12"><ShieldCheck size={200} className="text-emerald-600"/></div>
                                
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                                    <div>
                                        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                           <CheckCircle size={18}/> Entity Matrix Validated
                                        </p>
                                        <p className="text-5xl font-black text-slate-950 leading-none tracking-tighter">{foundBid.supplierName}</p>
                                        <p className="text-sm font-bold text-slate-500 mt-4 uppercase tracking-[0.2em] bg-white/50 w-fit px-4 py-1.5 rounded-full border border-white">Segment: {foundReq?.items[0].name} ({foundReq?.items[0].qty} {foundReq?.items[0].unit})</p>
                                    </div>
                                    <div className="text-right bg-white p-6 rounded-[32px] border border-emerald-100 shadow-xl min-w-[200px]">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contract Value</p>
                                        <p className="text-3xl font-black text-indigo-600 tracking-tighter">{foundBid.amount.toLocaleString()} <span className="text-sm opacity-40 font-bold">UGX</span></p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                                    <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 p-8 rounded-[40px] flex gap-6 items-center shadow-lg">
                                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-[24px] flex items-center justify-center shrink-0 border-2 border-amber-100 shadow-sm">
                                            <ShieldAlert size={32} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em] mb-1">Fiscal Matrix</p>
                                            <p className="text-xs font-medium text-slate-500 leading-relaxed">System has flagged 18% URA VAT remittance required for entry.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSecurityCheckPassed(!securityCheckPassed)}
                                        className={`p-8 rounded-[40px] flex gap-6 items-center transition-all border-4 duration-500 ${securityCheckPassed ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl shadow-emerald-200' : 'bg-white border-slate-50 text-slate-400 hover:border-indigo-200 group'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 transition-all duration-500 ${securityCheckPassed ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'}`}>
                                            {securityCheckPassed ? <PackageCheck size={32} /> : <Camera size={32} />}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-1">{securityCheckPassed ? 'Tally Confirmed' : 'Visual Inspection'}</p>
                                            <p className={`text-xs font-medium leading-relaxed ${securityCheckPassed ? 'text-emerald-100' : 'text-slate-400'}`}>Physical inventory node verification.</p>
                                        </div>
                                    </button>
                                </div>

                                <Button 
                                    disabled={!securityCheckPassed}
                                    onClick={calculateFees} 
                                    className="w-full h-28 rounded-[48px] font-black uppercase tracking-[0.4em] text-base shadow-[0_30px_60px_-15px_rgba(79,70,229,0.5)] bg-indigo-600 hover:bg-indigo-700 border-none transition-all hover:-translate-y-1 active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none"
                                >
                                    Authorize Entry & Settlement
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
             </div>

             <div className="space-y-10">
                <Card className="p-10 rounded-[56px] border-none shadow-2xl bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.05] scale-150 rotate-45"><Activity size={120} className="text-indigo-400"/></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-10">
                           <h4 className="font-black uppercase tracking-[0.4em] text-[11px] text-indigo-400">Live Telemetry</h4>
                           <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Link</span>
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]"></div>
                           </div>
                        </div>
                        <div className="space-y-6">
                            {tokens.slice(0, 4).map(t => (
                                <div key={t.id} className="flex items-center justify-between p-6 rounded-[32px] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.07] transition-all cursor-pointer group shadow-inner">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-[20px] transition-all group-hover:scale-110 ${t.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                                            <Truck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight uppercase group-hover:text-indigo-400 transition-colors leading-none">{t.entityName}</p>
                                            <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-2 opacity-40 uppercase">{t.code}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${t.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>{t.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-10 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] border border-white/[0.05] py-5 rounded-[24px] hover:bg-white/[0.02]">Full Registry Ledger &rarr;</Button>
                    </div>
                </Card>

                <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-2xl text-center group hover:border-rose-100 transition-all relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500/10"></div>
                   <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-xl shadow-rose-100 border border-rose-100/50">
                      <LogOut size={44} />
                   </div>
                   <h5 className="font-black uppercase text-xs tracking-[0.4em] text-slate-950 mb-4">Outbound Triage</h5>
                   <p className="text-xs text-slate-500 mb-10 font-medium max-w-[220px] mx-auto leading-relaxed">Verify release authorization matrix for departing logistics units.</p>
                   
                   <div className="relative mb-8">
                      <input 
                        className="w-full px-8 py-6 rounded-[24px] bg-slate-50 border-4 border-slate-50 outline-none text-center font-mono font-black text-2xl tracking-[0.4em] focus:border-rose-500 focus:bg-white transition-all shadow-inner placeholder:text-slate-200 text-rose-600 uppercase" 
                        placeholder="TK-CODE" 
                      />
                   </div>
                   
                   <Button variant="secondary" className="w-full h-20 uppercase font-black text-[11px] tracking-[0.3em] border-2 rounded-[32px] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 shadow-2xl shadow-slate-100 transition-all active:scale-95">Release Node</Button>
                </div>
             </div>
         </div>
       )}

       {/* Other tabs remain similar with CSS Polish applied... */}
       {receiptToken && (
           <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-700">
               <div className="bg-white w-[560px] p-24 rounded-[80px] shadow-[0_50px_150px_rgba(0,0,0,0.8)] relative font-sans text-center">
                   <button onClick={() => setReceiptToken(null)} className="absolute top-12 right-12 text-slate-300 hover:text-slate-950 transition-all hover:rotate-90 duration-500"><X size={44}/></button>
                   
                   <div className="w-40 h-40 bg-emerald-50 text-emerald-600 rounded-[56px] flex items-center justify-center mx-auto mb-16 shadow-2xl ring-[12px] ring-emerald-50/50 border-4 border-emerald-100">
                       <CheckCircle size={80} />
                   </div>
                   
                   <h3 className="text-6xl font-black text-slate-950 tracking-tighter mb-6 uppercase">Node Sync Success</h3>
                   <p className="text-slate-500 text-base font-bold mb-20 leading-relaxed uppercase tracking-[0.1em]">Entry node authorized for <br/><span className="text-indigo-600 font-black decoration-indigo-200 underline underline-offset-8 decoration-8 block mt-2">{receiptToken.entityName}</span>.</p>
                   
                   <div className="bg-slate-950 p-20 rounded-[72px] shadow-2xl mb-16 border-4 border-slate-900 group transition-all duration-700 hover:scale-[1.03]">
                       <div className="bg-white p-12 rounded-[48px] shadow-inner inline-block relative z-10 transition-transform duration-700 group-hover:rotate-1">
                           <QrCode size={240} className="text-slate-950" />
                       </div>
                       <p className="text-indigo-400 mt-12 font-mono font-black tracking-[0.6em] text-4xl uppercase">{receiptToken.code.split('-').pop()}</p>
                       <div className="mt-10 flex items-center justify-center gap-4 text-slate-500 font-black text-[11px] uppercase tracking-[0.4em] border-t border-white/[0.05] pt-10">
                           <ShieldCheck size={24} className="text-emerald-500"/> Digital Manifest Validated
                       </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                        <Button variant="secondary" className="h-24 rounded-[40px] font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl border-4 border-slate-100 hover:bg-slate-50"><Download size={28} className="mr-4 text-indigo-500"/> PDF Dossier</Button>
                        <Button className="h-24 rounded-[40px] font-black uppercase tracking-[0.3em] text-[12px] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.5)] bg-indigo-600 hover:bg-indigo-700 border-none transition-all hover:-translate-y-1 active:scale-95" onClick={() => { alert("Printing Gate Pass..."); setReceiptToken(null); }}>
                            <Printer size={28} className="mr-4"/> Thermal Print
                        </Button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
