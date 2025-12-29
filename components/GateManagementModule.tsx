import React, { useState } from 'react';
import { MOCK_TOKENS, MOCK_PARKING_SLOTS } from '../constants';
import { GateToken, ParkingSlot } from '../types';
import { PaymentGateway } from './PaymentGateway';
import { ApiService } from '../services/api';
import { 
  QrCode, CheckCircle, XCircle, Plus, Truck, 
  Printer, Package, AlertOctagon, RefreshCw, LogOut, FileText, X, Calculator, Loader2
} from 'lucide-react';

export const GateManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'STOCK' | 'REGISTRY'>('TERMINAL');
  const [terminalMode, setTerminalMode] = useState<'ENTRY' | 'EXIT'>('ENTRY');
  
  // Data State
  const [tokens, setTokens] = useState<GateToken[]>(MOCK_TOKENS);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>(MOCK_PARKING_SLOTS);

  // Scan State
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ status: 'VALID' | 'INVALID' | 'EXPIRED' | 'EXIT_READY' | null, msg: string, token?: GateToken }>({ status: null, msg: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Entry Form State
  const [entryForm, setEntryForm] = useState({
    plate: '',
    category: 'TRUCK',
  });

  // Payment State
  const [pendingPayment, setPendingPayment] = useState<{ amount: number, desc: string, tax: number, type: 'ENTRY' | 'EXIT' } | null>(null);
  const [receiptToken, setReceiptToken] = useState<GateToken | null>(null);

  // Stock Verification State
  const [stockScanInput, setStockScanInput] = useState('');
  const [verifiedManifest, setVerifiedManifest] = useState<any[] | null>(null);

  // --- HANDLERS: ENTRY ---
  const handleInitiateEntry = async () => {
     if (!entryForm.plate) return;
     setIsLoading(true);

     try {
       // 1. Get Fee Structure from Backend (BFF)
       // MOCKING RESPONSE for now, but code is structured for API
       // const res = await ApiService.gate.getFeeStructure(entryForm.category);
       // const fees = res.data;
       
       // Simulation of Backend Logic:
       let base = 1000;
       if(entryForm.category === 'TRUCK') base = 10000;
       else if(entryForm.category === 'VAN') base = 5000;
       else if(entryForm.category === 'CAR') base = 3000;
       
       const fees = {
           base: base,
           vat: base * 0.18,
           total: base + (base * 0.18)
       };
       
       // 2. Open Payment Gateway
       setPendingPayment({
           amount: fees.total,
           tax: fees.vat,
           desc: `Gate Fee: ${entryForm.category} (${entryForm.plate})`,
           type: 'ENTRY'
       });
     } catch (err) {
       alert("Failed to calculate fees. Check network.");
     } finally {
       setIsLoading(false);
     }
  };

  const finalizeEntry = async (txId: string, method: string) => {
     setIsLoading(true);
     try {
         // 3. Call Backend to Create Token (Requires Payment Proof)
         // const res = await ApiService.gate.createEntryToken({ ...entryForm, paymentRef: txId });
         // const newToken = res.data;

         // Simulation:
         const fees = pendingPayment!;
         const newToken: GateToken = {
             id: `gt${Date.now()}`,
             code: `MMIS-${Math.floor(Math.random()*10000)}`,
             type: 'ENTRY',
             entityName: entryForm.plate,
             status: 'ACTIVE',
             generatedAt: new Date().toISOString(),
             generatedBy: 'Gate A',
             associatedFee: fees.amount,
             taxAmount: fees.tax,
             paymentStatus: 'PAID'
         };

         setTokens([newToken, ...tokens]);
         setEntryForm({ plate: '', category: 'TRUCK' });
         setPendingPayment(null);
         setReceiptToken(newToken); // Show Receipt
     } catch (err) {
         alert("Payment successful but Token Generation failed. Contact Admin.");
     } finally {
         setIsLoading(false);
     }
  };

  // --- HANDLERS: EXIT ---
  const handleExitScan = async () => {
      const inputCode = scanInput.trim();
      if (!inputCode) return;
      setIsLoading(true);

      try {
          // 1. Ask Backend to check token and calculate overstay
          // const res = await ApiService.gate.scanForExit(inputCode);
          // const { token, overstayFee, duration } = res.data;

          // Simulation:
          const token = tokens.find(t => t.code === inputCode);
          if (!token) throw new Error("Token not found");
          
          const entryTime = new Date(token.generatedAt).getTime();
          const exitTime = new Date().getTime();
          const duration = Math.floor((exitTime - entryTime) / 60000);
          const overstayFee = duration > 120 ? 2000 : 0; // Backend rule logic

          setScanResult({ 
              status: 'EXIT_READY', 
              msg: `Duration: ${duration} mins.`,
              token: { ...token, overstayFee, durationMinutes: duration }
          });
      } catch (err) {
          setScanResult({ status: 'INVALID', msg: 'Invalid or Expired Token.' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleInitiateExit = () => {
      if (!scanResult.token) return;
      
      if ((scanResult.token.overstayFee || 0) > 0) {
          setPendingPayment({
              amount: scanResult.token.overstayFee!,
              tax: scanResult.token.overstayFee! * 0.18, // Backend would handle tax calc
              desc: `Overstay Surcharge: ${scanResult.token.entityName}`,
              type: 'EXIT'
          });
      } else {
          finalizeExit();
      }
  };

  const finalizeExit = async () => {
      if (!scanResult.token) return;
      setIsLoading(true);
      
      try {
          // await ApiService.gate.processExit(scanResult.token.code);
          
          // Simulation Update
          setTokens(prev => prev.map(t => t.id === scanResult.token!.id ? { 
              ...t, 
              status: 'USED', 
              exitAt: new Date().toISOString() 
          } : t));

          setScanResult({ status: 'VALID', msg: `Gate Released for ${scanResult.token.entityName}.` });
          setScanInput('');
          setPendingPayment(null);
          setTimeout(() => setScanResult({ status: null, msg: '' }), 3000);
      } catch (err) {
          alert("System Error: Could not release gate.");
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="space-y-6">
       {pendingPayment && (
           <PaymentGateway 
              amount={pendingPayment.amount}
              taxAmount={pendingPayment.tax}
              description={pendingPayment.desc}
              onClose={() => setPendingPayment(null)}
              onSuccess={(txId, method) => {
                  if(pendingPayment.type === 'ENTRY') finalizeEntry(txId, method);
                  else if (pendingPayment.type === 'EXIT') finalizeExit();
              }}
           />
       )}

       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
             <h2 className="text-2xl font-bold text-slate-900">Gate & Logistics Terminal</h2>
             <p className="text-slate-500 text-sm">Manage vehicle flow and stock manifest verification.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button onClick={() => setActiveTab('TERMINAL')} className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'TERMINAL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Vehicle Gate</button>
             <button onClick={() => setActiveTab('STOCK')} className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'STOCK' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Stock Counter</button>
             <button onClick={() => setActiveTab('REGISTRY')} className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'REGISTRY' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Logs</button>
          </div>
       </div>

       {activeTab === 'TERMINAL' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
             <div className={`p-6 rounded-xl border-2 transition-all ${terminalMode === 'ENTRY' ? 'border-indigo-600 bg-white shadow-lg ring-4 ring-indigo-50' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setTerminalMode('ENTRY')}>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${terminalMode === 'ENTRY' ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}><Plus size={20} /></div>
                        ENTRY TERMINAL
                    </h3>
                    {terminalMode === 'ENTRY' && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">ACTIVE</span>}
                </div>

                {terminalMode === 'ENTRY' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Plate</label>
                            <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none uppercase font-mono text-lg tracking-widest" placeholder="UBD 000X" value={entryForm.plate} onChange={(e) => setEntryForm({...entryForm, plate: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white" value={entryForm.category} onChange={(e) => setEntryForm({...entryForm, category: e.target.value})}>
                                    <option value="TRUCK">Truck</option>
                                    <option value="VAN">Van</option>
                                    <option value="CAR">Car</option>
                                    <option value="BIKE">Bike</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estimated Fee (Inc. VAT)</label>
                                <div className="px-4 py-2 bg-slate-100 rounded-lg font-bold text-slate-900 border border-slate-200 text-sm">
                                    {(entryForm.category === 'TRUCK' ? 11800 : entryForm.category === 'VAN' ? 5900 : 3540).toLocaleString()} UGX
                                </div>
                            </div>
                        </div>
                        <button disabled={isLoading} onClick={handleInitiateEntry} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Printer size={20} />} Process Payment & Print
                        </button>
                    </div>
                )}
             </div>

             <div className={`p-6 rounded-xl border-2 transition-all ${terminalMode === 'EXIT' ? 'border-orange-600 bg-white shadow-lg ring-4 ring-orange-50' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setTerminalMode('EXIT')}>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${terminalMode === 'EXIT' ? 'bg-orange-600 text-white' : 'bg-slate-200'}`}><LogOut size={20} /></div>
                        EXIT TERMINAL
                    </h3>
                    {terminalMode === 'EXIT' && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">ACTIVE</span>}
                </div>

                {terminalMode === 'EXIT' && (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input type="text" className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 outline-none uppercase font-mono" placeholder="Scan Token Code..." value={scanInput} onChange={(e) => setScanInput(e.target.value)} />
                            <button onClick={handleExitScan} className="px-4 bg-orange-600 text-white rounded-lg font-bold">Check</button>
                        </div>

                        {scanResult.status === 'EXIT_READY' && scanResult.token && (
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-bold text-orange-800">Vehicle:</span>
                                    <span className="font-mono">{scanResult.token.entityName}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-sm font-bold text-orange-800">Surcharge:</span>
                                    <span className={`font-bold ${scanResult.token.overstayFee ? 'text-red-600' : 'text-green-600'}`}>
                                        {scanResult.token.overstayFee ? `${scanResult.token.overstayFee.toLocaleString()} UGX` : 'None'}
                                    </span>
                                </div>
                                <button onClick={handleInitiateExit} className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">
                                    {(scanResult.token.overstayFee || 0) > 0 ? 'Pay Surcharge & Release' : 'Release Gate'}
                                </button>
                            </div>
                        )}

                        {scanResult.status === 'VALID' && (
                            <div className="bg-green-100 p-4 rounded-lg text-green-800 font-bold text-center flex flex-col items-center gap-2"><CheckCircle size={32} />{scanResult.msg}</div>
                        )}
                    </div>
                )}
             </div>
         </div>
       )}

       {receiptToken && (
           <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
               <div className="bg-white w-80 p-6 rounded shadow-2xl relative font-mono text-sm border-t-8 border-slate-900">
                   <button onClick={() => setReceiptToken(null)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                   <div className="text-center mb-4 border-b border-dashed border-slate-300 pb-4">
                       <h3 className="font-bold text-xl mb-1">MMIS GATE PASS</h3>
                       <p className="text-xs text-slate-500">Nakasero Market - Gate A</p>
                       <p className="text-xs text-slate-500">{new Date(receiptToken.generatedAt).toLocaleString()}</p>
                       <p className="text-[10px] text-slate-400 mt-1">TIN: 10005522XX (MMIS Ltd)</p>
                   </div>
                   
                   <div className="space-y-2 mb-6">
                       <div className="flex justify-between"><span>Vehicle:</span> <span className="font-bold">{receiptToken.entityName}</span></div>
                       <div className="border-t border-dashed border-slate-200 my-2"></div>
                       <div className="flex justify-between"><span>Base Fee:</span> <span>{((receiptToken.associatedFee || 0) - (receiptToken.taxAmount || 0)).toLocaleString()}</span></div>
                       <div className="flex justify-between"><span>VAT (18%):</span> <span>{(receiptToken.taxAmount || 0).toLocaleString()}</span></div>
                       <div className="flex justify-between font-bold text-lg mt-1"><span>TOTAL:</span> <span>{receiptToken.associatedFee?.toLocaleString()} UGX</span></div>
                   </div>

                   <div className="text-center mb-6">
                       <div className="bg-white p-2 inline-block border-4 border-black">
                           <QrCode size={120} />
                       </div>
                       <p className="text-xs mt-2 font-bold">{receiptToken.code}</p>
                   </div>

                   <button 
                      onClick={() => { alert("Printing..."); setReceiptToken(null); }}
                      className="w-full py-2 bg-slate-900 text-white font-bold rounded hover:bg-slate-800"
                   >
                       PRINT TICKET
                   </button>
               </div>
           </div>
       )}
    </div>
  );
};