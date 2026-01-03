
import React, { useState } from 'react';
import { MOCK_TOKENS, MOCK_PARKING_SLOTS, MOCK_REQUISITIONS, MOCK_BIDS } from '../constants';
import { GateToken, ParkingSlot, Requisition, Bid } from '../types';
import { PaymentGateway } from './PaymentGateway';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  QrCode, CheckCircle, XCircle, Plus, Truck, Printer, Package, AlertOctagon, 
  LogOut, FileText, X, Calculator, Loader2, Search, Gavel, DollarSign, ShieldAlert,
  Calendar, ArrowRight, Wallet, UserCheck, Smartphone, ShieldCheck, Download
} from 'lucide-react';

export const GateManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'DELIVERIES' | 'PARKING'>('TERMINAL');
  
  const [tokens, setTokens] = useState<GateToken[]>(MOCK_TOKENS);
  const [parkingSlots] = useState<ParkingSlot[]>(MOCK_PARKING_SLOTS);
  const [isLoading, setIsLoading] = useState(false);

  // Accepted Bids (Upcoming Deliveries)
  const acceptedDeliveries = MOCK_BIDS.filter(b => b.status === 'ACCEPTED');

  // Flow State
  const [manifestCode, setManifestCode] = useState('');
  const [foundBid, setFoundBid] = useState<Bid | null>(null);
  const [pendingPayment, setPendingPayment] = useState<any | null>(null);
  const [receiptToken, setReceiptToken] = useState<GateToken | null>(null);

  // --- Handlers: Logic ---
  
  const handleScanManifest = (codeOverride?: string) => {
      const code = codeOverride || manifestCode;
      if(!code) return;
      setIsLoading(true);
      
      // Simulate finding an accepted bid matching the manifest
      // In real scenario, code would be tied to b.id or b.manifestCode
      setTimeout(() => {
          const match = acceptedDeliveries.find(d => code.includes(d.id.toUpperCase())) || acceptedDeliveries[0];
          setFoundBid(match);
          setIsLoading(false);
      }, 800);
  };

  const calculateFees = () => {
      if (!foundBid) return;
      
      const supplyAmount = foundBid.amount;
      const parkingFee = 5000;
      const vatRate = 0.18; // URA Compliance
      
      const vat = supplyAmount * vatRate;
      const total = parkingFee + vat;

      setPendingPayment({
          amount: total,
          taxAmount: vat,
          description: `Logistics Manifest Entry: ${foundBid.supplierName}`,
          supplyValue: supplyAmount,
          parking: parkingFee
      });
  };

  const finalizeEntry = (txId: string) => {
      const newToken: GateToken = {
          id: `gt${Date.now()}`,
          code: `MMIS-ENT-${Math.floor(Math.random()*9000)+1000}`,
          type: 'ENTRY',
          entityName: foundBid?.supplierName || 'Guest Logistics',
          status: 'ACTIVE',
          generatedAt: new Date().toISOString(),
          generatedBy: 'Gate Terminal Alpha',
          associatedFee: pendingPayment.amount,
          taxAmount: pendingPayment.taxAmount,
          paymentStatus: 'PAID'
      };

      setTokens([newToken, ...tokens]);
      setReceiptToken(newToken);
      setPendingPayment(null);
      setFoundBid(null);
      setManifestCode('');
      setActiveTab('TERMINAL');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
       {pendingPayment && (
           <PaymentGateway 
              amount={pendingPayment.amount}
              taxAmount={pendingPayment.taxAmount}
              description={pendingPayment.description}
              onClose={() => setPendingPayment(null)}
              onSuccess={(txId) => finalizeEntry(txId)}
           />
       )}

       <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-slate-200">
          <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Gate Operations</h2>
             <p className="text-slate-500 font-medium">Logistics triangulation, parking control & URA compliance.</p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
             <button onClick={() => setActiveTab('TERMINAL')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TERMINAL' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Node Terminal</button>
             <button onClick={() => setActiveTab('DELIVERIES')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'DELIVERIES' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Expected Manifests</button>
             <button onClick={() => setActiveTab('PARKING')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PARKING' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Slot Status</button>
          </div>
       </div>

       {activeTab === 'TERMINAL' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <Card className="p-10 rounded-[48px] border-none shadow-2xl bg-white relative overflow-hidden ring-1 ring-slate-100">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Truck size={250} /></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 tracking-tight uppercase">
                           <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200"><QrCode size={28}/></div>
                           Process Logistics Inbound
                        </h3>
                        
                        <div className="space-y-4 mb-10">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Scan or Entry Manifest Token</label>
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-mono text-xl tracking-[0.2em] focus:bg-white focus:border-indigo-600 outline-none transition-all uppercase placeholder:text-slate-300 shadow-inner" 
                                        placeholder="MMIS-MAN-XXXX"
                                        value={manifestCode}
                                        onChange={e => setManifestCode(e.target.value.toUpperCase())}
                                    />
                                </div>
                                <Button onClick={() => handleScanManifest()} loading={isLoading} className="h-full px-10 rounded-2xl uppercase font-black tracking-widest text-xs shadow-xl shadow-indigo-100">Sync Node</Button>
                            </div>
                        </div>

                        {foundBid && (
                            <div className="animate-in slide-in-from-bottom-6 space-y-8 p-8 rounded-[32px] border-2 border-indigo-100 bg-indigo-50/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-white border border-indigo-100 rounded-3xl shadow-sm">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><UserCheck size={14}/> Verified Supplier</p>
                                        <p className="text-xl font-black text-slate-900 leading-tight">{foundBid.supplierName}</p>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-tighter">
                                            <Calendar size={12} /> Delivered: {foundBid.deliveryDate}
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col justify-between">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 text-indigo-300"><DollarSign size={14}/> Node Value</p>
                                        <p className="text-2xl font-black text-white">{foundBid.amount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">UGX</span></p>
                                    </div>
                                </div>
                                
                                <div className="bg-amber-100/50 border-2 border-amber-200 p-6 rounded-3xl flex gap-5 items-center">
                                    <div className="w-14 h-14 bg-amber-200 rounded-2xl flex items-center justify-center shrink-0">
                                        <ShieldAlert className="text-amber-700" size={32} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">URA Compliance Protocol</p>
                                        <p className="text-sm font-medium text-amber-800 leading-relaxed">
                                            System will auto-calculate 18% VAT on the manifest value and a fixed entry surcharge. Proceed to transaction.
                                        </p>
                                    </div>
                                </div>

                                <Button onClick={calculateFees} className="w-full h-20 rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-indigo-200 ring-4 ring-white">
                                    Initialize Compliance Token
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
             </div>

             <div className="space-y-6">
                <Card className="p-8 rounded-[40px] border-none shadow-xl bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent"></div>
                    <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-500 mb-8 relative z-10">Terminal Activity Ledger</h4>
                    <div className="space-y-6 relative z-10">
                        {tokens.slice(0, 5).map(t => (
                            <div key={t.id} className="group flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer shadow-inner">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${t.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black tracking-tight">{t.entityName}</p>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-0.5">{t.code}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${t.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {t.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors relative z-10">View Full Quadrant Ledger &rarr;</button>
                </Card>

                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h5 className="font-black uppercase text-[10px] tracking-widest text-slate-400">Exit Protocol</h5>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                   </div>
                   <p className="text-xs font-bold text-slate-600 mb-6 leading-relaxed">Triangulate active entry tokens for exit validation and overstay calculation.</p>
                   <div className="relative group mb-4">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                      <input className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white transition-all text-xs font-mono font-black" placeholder="SCAN EXIT CODE" />
                   </div>
                   <Button variant="secondary" className="w-full h-12 uppercase font-black text-[10px] tracking-widest">Verify Departure</Button>
                </div>
             </div>
         </div>
       )}

       {activeTab === 'DELIVERIES' && (
           <div className="animate-in fade-in space-y-6">
               <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
                   <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center shadow-inner">
                           <FileText size={32} />
                       </div>
                       <div>
                           <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Accepted Supply Hub</h3>
                           <p className="text-slate-500 font-medium">Bids transitioned to delivery manifests.</p>
                       </div>
                   </div>
                   <div className="flex gap-3">
                       <div className="bg-slate-100 px-6 py-4 rounded-3xl border border-slate-200 text-center">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Today</p>
                           <p className="text-2xl font-black text-indigo-600">{acceptedDeliveries.length}</p>
                       </div>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {acceptedDeliveries.map(bid => (
                       <Card key={bid.id} className="p-8 rounded-[40px] border-none shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden bg-white">
                           <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                           <div className="flex justify-between items-start mb-6">
                               <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                   <Truck size={24} />
                               </div>
                               <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-widest">ACCEPTED</span>
                           </div>
                           <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight uppercase tracking-tight">{bid.supplierName}</h4>
                           <p className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                               <Calendar size={14} /> Schedule: {bid.deliveryDate}
                           </p>
                           <div className="bg-slate-50 p-5 rounded-3xl mb-8 flex justify-between items-center group-hover:bg-slate-100 transition-colors border border-slate-100">
                               <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Value</p>
                                   <p className="text-lg font-black text-slate-900">{bid.amount.toLocaleString()} UGX</p>
                               </div>
                               <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                   <ArrowRight size={20} className="text-indigo-600" />
                               </div>
                           </div>
                           <Button 
                                onClick={() => {
                                    setManifestCode(`MMIS-MAN-${bid.id.toUpperCase()}`);
                                    setActiveTab('TERMINAL');
                                    handleScanManifest(`MMIS-MAN-${bid.id.toUpperCase()}`);
                                }}
                                className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200"
                           >
                               Process Entry
                           </Button>
                       </Card>
                   ))}
               </div>
           </div>
       )}

       {activeTab === 'PARKING' && (
           <div className="animate-in fade-in grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-3 space-y-8">
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {parkingSlots.map(slot => (
                            <div key={slot.id} className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden group ${
                                slot.status === 'AVAILABLE' ? 'bg-white border-slate-100 hover:border-emerald-400 cursor-pointer shadow-sm hover:shadow-xl' : 
                                slot.status === 'OCCUPIED' ? 'bg-slate-900 border-slate-800 text-white shadow-2xl' : 
                                'bg-amber-50 border-amber-100 text-amber-900'
                            }`}>
                                <div className={`mb-3 p-3 rounded-2xl ${slot.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600' : slot.status === 'OCCUPIED' ? 'bg-indigo-600 text-white' : 'bg-amber-200 text-amber-700'}`}>
                                    <Truck size={20} />
                                </div>
                                <p className="text-xl font-black tracking-tight">{slot.number}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-60">Zone {slot.zone}</p>
                                {slot.vehiclePlate && (
                                    <div className="mt-3 pt-3 border-t border-white/10 w-full">
                                        <p className="text-[9px] font-mono font-bold uppercase tracking-tight text-indigo-400">{slot.vehiclePlate}</p>
                                    </div>
                                )}
                                {slot.status === 'AVAILABLE' && (
                                    <div className="absolute inset-0 bg-emerald-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Select Slot</p>
                                    </div>
                                )}
                            </div>
                        ))}
                   </div>
               </div>
               
               <div className="space-y-6">
                   <Card className="p-8 rounded-[40px] border-none shadow-xl bg-white border border-slate-100">
                       <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 mb-6">Slot Inventory</h4>
                       <div className="space-y-4">
                           <div className="flex justify-between items-center p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
                               <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                                       <CheckCircle size={20} />
                                   </div>
                                   <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">Available</span>
                               </div>
                               <span className="text-xl font-black text-emerald-700">{parkingSlots.filter(s => s.status === 'AVAILABLE').length}</span>
                           </div>
                           <div className="flex justify-between items-center p-5 bg-slate-900 rounded-3xl text-white">
                               <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400">
                                       <Truck size={20} />
                                   </div>
                                   <span className="text-xs font-black uppercase tracking-widest">Occupied</span>
                               </div>
                               <span className="text-xl font-black text-white">{parkingSlots.filter(s => s.status === 'OCCUPIED').length}</span>
                           </div>
                           <div className="flex justify-between items-center p-5 bg-amber-50 rounded-3xl border border-amber-100">
                               <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600">
                                       <AlertOctagon size={20} />
                                   </div>
                                   <span className="text-xs font-black text-amber-900 uppercase tracking-widest">Reserved</span>
                               </div>
                               <span className="text-xl font-black text-amber-700">{parkingSlots.filter(s => s.status === 'RESERVED').length}</span>
                           </div>
                       </div>
                       <Button className="w-full mt-8 h-12 uppercase font-black text-[10px] tracking-widest border-none shadow-lg">Manage Zones</Button>
                   </Card>
               </div>
           </div>
       )}

       {receiptToken && (
           <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[120] flex items-center justify-center p-4 animate-in fade-in">
               <div className="bg-white w-[420px] p-12 rounded-[64px] shadow-2xl relative font-sans text-center ring-4 ring-white/20">
                   <button onClick={() => setReceiptToken(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"><X size={32}/></button>
                   <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-emerald-50">
                       <CheckCircle size={48} />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 uppercase">Gate Pass Issued</h3>
                   <p className="text-slate-500 text-sm font-bold mb-10 leading-relaxed uppercase tracking-tight">Access triangulated for <span className="text-indigo-600 font-black">{receiptToken.entityName}</span>.</p>
                   
                   <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl mb-10 border-4 border-slate-800 relative group">
                       <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                       <div className="bg-white p-5 rounded-3xl shadow-inner inline-block relative z-10">
                           <QrCode size={180} className="text-slate-900" />
                       </div>
                       <p className="text-white mt-6 font-mono font-black tracking-[0.2em] text-lg">{receiptToken.code}</p>
                       <div className="mt-4 flex items-center justify-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
                           {/* FIX: ShieldCheck was missing from imports */}
                           <ShieldCheck size={14} className="text-indigo-400"/> Authenticated
                       </div>
                   </div>

                   <div className="flex gap-4">
                        {/* FIX: Download was missing from imports */}
                        <Button variant="secondary" className="flex-1 h-16 rounded-3xl font-black uppercase tracking-widest text-[10px]"><Download size={20} className="mr-2"/> Save PDF</Button>
                        <Button className="flex-1 h-16 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100" onClick={() => { alert("Printing..."); setReceiptToken(null); }}>
                            <Printer size={20} className="mr-2"/> Print Pass
                        </Button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
