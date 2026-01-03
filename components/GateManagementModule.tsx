
import React, { useState } from 'react';
import { MOCK_TOKENS, MOCK_BIDS } from '../constants';
import { GateToken, VehicleCategory, Bid } from '../types';
import { PaymentGateway } from './PaymentGateway';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  QrCode, CheckCircle, Truck, Printer, Search, DollarSign, ShieldAlert,
  Calendar, ArrowRight, Smartphone, ShieldCheck, Download, X, Car, Bike
} from 'lucide-react';

const VEHICLE_FEES = {
  [VehicleCategory.HEAVY_TRUCK]: 15000,
  [VehicleCategory.LIGHT_VAN]: 7000,
  [VehicleCategory.SALOON_CAR]: 5000,
  [VehicleCategory.MOTORBIKE]: 2000
};

export const GateManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'DELIVERIES'>('TERMINAL');
  const [tokens, setTokens] = useState<GateToken[]>(MOCK_TOKENS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>(VehicleCategory.SALOON_CAR);

  // Accepted Bids (Upcoming Deliveries)
  const acceptedDeliveries = MOCK_BIDS.filter(b => b.status === 'ACCEPTED');

  // Flow State
  const [manifestCode, setManifestCode] = useState('');
  const [foundBid, setFoundBid] = useState<Bid | null>(null);
  const [pendingPayment, setPendingPayment] = useState<any | null>(null);
  const [receiptToken, setReceiptToken] = useState<GateToken | null>(null);

  const handleScanManifest = (codeOverride?: string) => {
      const code = codeOverride || manifestCode;
      if(!code) return;
      setIsLoading(true);
      
      setTimeout(() => {
          const match = acceptedDeliveries.find(d => code.includes(d.id.toUpperCase())) || acceptedDeliveries[0];
          setFoundBid(match);
          setIsLoading(false);
      }, 800);
  };

  const calculateFees = () => {
      if (!foundBid) return;
      
      const supplyAmount = foundBid.amount;
      const parkingFee = VEHICLE_FEES[selectedVehicle];
      const vatRate = 0.18; // URA VAT Standard
      
      const vat = supplyAmount * vatRate;
      const total = parkingFee + vat;

      setPendingPayment({
          amount: total,
          taxAmount: vat,
          description: `Compliance Pass: ${foundBid.supplierName} (${selectedVehicle})`,
          supplyValue: supplyAmount,
          parking: parkingFee
      });
  };

  const finalizeEntry = (txId: string) => {
      const newToken: GateToken = {
          id: `gt${Date.now()}`,
          code: `MMIS-ENT-${Math.floor(Math.random()*9000)+1000}`,
          type: 'ENTRY',
          entityName: foundBid?.supplierName || 'Logistics Node',
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
      setManifestCode('');
  };

  const VehicleIcon = ({ type }: { type: VehicleCategory }) => {
      switch(type) {
          case VehicleCategory.HEAVY_TRUCK: return <Truck size={20}/>;
          case VehicleCategory.MOTORBIKE: return <Bike size={20}/>;
          default: return <Car size={20}/>;
      }
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
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Gate Terminal</h2>
             <p className="text-slate-500 font-medium">Logistics triangulation & URA tax compliance.</p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
             <button onClick={() => setActiveTab('TERMINAL')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TERMINAL' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Gate Inbound</button>
             <button onClick={() => setActiveTab('DELIVERIES')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'DELIVERIES' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Manifest Queue</button>
          </div>
       </div>

       {activeTab === 'TERMINAL' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <Card className="p-10 rounded-[48px] border-none shadow-2xl bg-white relative overflow-hidden ring-1 ring-slate-100">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 tracking-tight uppercase">
                           <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl"><QrCode size={28}/></div>
                           Triangulate Manifest
                        </h3>
                        
                        <div className="space-y-6 mb-10">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-3 block">1. Classify Vehicle Node</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {Object.entries(VEHICLE_FEES).map(([type, fee]) => (
                                        <button 
                                            key={type}
                                            onClick={() => setSelectedVehicle(type as VehicleCategory)}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedVehicle === type ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            <VehicleIcon type={type as VehicleCategory} />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">{type.replace('_', ' ')}</span>
                                            <span className="text-[10px] font-bold opacity-60">{fee.toLocaleString()} UGX</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-3 block">2. Scan Registry Token</label>
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                                        <input 
                                            type="text" 
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-mono text-xl tracking-[0.2em] focus:bg-white focus:border-indigo-600 outline-none transition-all uppercase placeholder:text-slate-200" 
                                            placeholder="TOKEN-ID"
                                            value={manifestCode}
                                            onChange={e => setManifestCode(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <Button onClick={() => handleScanManifest()} loading={isLoading} className="h-full px-10 rounded-2xl uppercase font-black tracking-widest text-xs shadow-xl">Verify</Button>
                                </div>
                            </div>
                        </div>

                        {foundBid && (
                            <div className="animate-in slide-in-from-bottom-6 space-y-8 p-8 rounded-[32px] border-2 border-emerald-100 bg-emerald-50/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1.5"><ShieldCheck size={14}/> Node Validated</p>
                                        <p className="text-2xl font-black text-slate-900 leading-tight">{foundBid.supplierName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Manifest Value</p>
                                        <p className="text-2xl font-black text-indigo-600">{foundBid.amount.toLocaleString()} UGX</p>
                                    </div>
                                </div>
                                
                                <div className="bg-white border border-slate-200 p-6 rounded-3xl flex gap-5 items-center shadow-sm">
                                    <ShieldAlert className="text-amber-500" size={32} />
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Taxation Logic Applied</p>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                            Compliance surcharge: 18% VAT on Supply Amount + Entry Base Fee.
                                        </p>
                                    </div>
                                </div>

                                <Button onClick={calculateFees} className="w-full h-20 rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-indigo-100">
                                    Generate Exit manifest & Pay
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
             </div>

             <div className="space-y-6">
                <Card className="p-8 rounded-[40px] border-none shadow-xl bg-slate-900 text-white">
                    <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-500 mb-8">Active Pass Ledger</h4>
                    <div className="space-y-6">
                        {tokens.slice(0, 5).map(t => (
                            <div key={t.id} className="flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/10 shadow-inner">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${t.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black tracking-tight">{t.entityName}</p>
                                        <p className="text-[10px] text-slate-500 font-mono tracking-widest">{t.code}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm text-center">
                   <Smartphone className="mx-auto mb-4 text-slate-300" size={40} />
                   <h5 className="font-black uppercase text-[10px] tracking-widest text-slate-400 mb-2">Exit Scanner</h5>
                   <input className="w-full px-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none mb-4 text-center font-mono font-black" placeholder="PASS CODE" />
                   <Button variant="secondary" className="w-full h-12 uppercase font-black text-[10px] tracking-widest">Mark Exit</Button>
                </div>
             </div>
         </div>
       )}

       {activeTab === 'DELIVERIES' && (
           <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {acceptedDeliveries.map(bid => (
                   <Card key={bid.id} className="p-8 rounded-[40px] border-none shadow-xl bg-white group hover:shadow-2xl transition-all">
                       <div className="flex justify-between items-start mb-6">
                           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                               <Truck size={24} />
                           </div>
                           <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">ACCEPTED</span>
                       </div>
                       <h4 className="text-xl font-black text-slate-900 mb-1 leading-tight uppercase">{bid.supplierName}</h4>
                       <p className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                           <Calendar size={14} /> Schedule: {bid.deliveryDate}
                       </p>
                       <div className="bg-slate-50 p-5 rounded-3xl mb-8 flex justify-between items-center border border-slate-100">
                           <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Value</p>
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
                            className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]"
                       >
                           Initialize Entry
                       </Button>
                   </Card>
               ))}
           </div>
       )}

       {receiptToken && (
           <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[120] flex items-center justify-center p-4 animate-in fade-in">
               <div className="bg-white w-[420px] p-12 rounded-[64px] shadow-2xl relative font-sans text-center">
                   <button onClick={() => setReceiptToken(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"><X size={32}/></button>
                   <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                       <CheckCircle size={48} />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 uppercase">Gate Pass Issued</h3>
                   <p className="text-slate-500 text-sm font-bold mb-10 leading-relaxed uppercase tracking-tight">Access triangulated for <span className="text-indigo-600 font-black">{receiptToken.entityName}</span>.</p>
                   
                   <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl mb-10 border-4 border-slate-800">
                       <div className="bg-white p-5 rounded-3xl shadow-inner inline-block relative z-10">
                           <QrCode size={180} className="text-slate-900" />
                       </div>
                       <p className="text-white mt-6 font-mono font-black tracking-[0.2em] text-lg">{receiptToken.code}</p>
                       <div className="mt-4 flex items-center justify-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
                           <ShieldCheck size={14} className="text-indigo-400"/> Authenticated
                       </div>
                   </div>

                   <div className="flex gap-4">
                        <Button variant="secondary" className="flex-1 h-16 rounded-3xl font-black uppercase tracking-widest text-[10px]"><Download size={20} className="mr-2"/> Save</Button>
                        <Button className="flex-1 h-16 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100" onClick={() => { alert("Printing..."); setReceiptToken(null); }}>
                            <Printer size={20} className="mr-2"/> Print
                        </Button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
