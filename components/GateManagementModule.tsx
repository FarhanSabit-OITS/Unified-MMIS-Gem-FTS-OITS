import React, { useState, useEffect } from 'react';
import { MOCK_TOKENS, MOCK_PARKING_SLOTS } from '../constants';
import { GateToken, ParkingSlot } from '../types';
import { 
  QrCode, 
  Scan, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit, 
  Plus, 
  Truck, 
  Car, 
  Bike, 
  MapPin, 
  DollarSign,
  Printer,
  Package,
  ClipboardList,
  AlertOctagon,
  CreditCard,
  UserCheck,
  Search,
  RefreshCw,
  Camera,
  AlertTriangle
} from 'lucide-react';

export const GateManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'PARKING' | 'REGISTRY' | 'STOCK'>('TERMINAL');
  
  // Data State
  const [tokens, setTokens] = useState<GateToken[]>(MOCK_TOKENS);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>(MOCK_PARKING_SLOTS);

  // Scan State
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ status: 'VALID' | 'INVALID' | 'EXPIRED' | null, msg: string }>({ status: null, msg: '' });
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Search State for Parking
  const [parkingSearch, setParkingSearch] = useState('');

  // Entry Form State
  const [entryForm, setEntryForm] = useState({
    plate: '',
    type: 'VISITOR',
    category: 'TRUCK',
    driver: '',
    paymentMethod: 'CASH'
  });

  // Stock Verification State
  const [stockScanInput, setStockScanInput] = useState('');
  const [verifiedManifest, setVerifiedManifest] = useState<{item: string, qty: number, checked: boolean}[] | null>(null);

  // Simulate Real-time Parking Updates
  useEffect(() => {
    if (activeTab === 'PARKING') {
      const interval = setInterval(() => {
        // Randomly flip a slot status to simulate real-time sensors
        setParkingSlots(currentSlots => {
           const newSlots = [...currentSlots];
           // Find a random index to update
           const randomIndex = Math.floor(Math.random() * newSlots.length);
           const slot = newSlots[randomIndex];
           
           // Don't flip reserved slots for demo stability
           if (slot.status !== 'RESERVED') {
              const newStatus = slot.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
              newSlots[randomIndex] = { 
                ...slot, 
                status: newStatus,
                vehiclePlate: newStatus === 'OCCUPIED' ? 'SIM-UPDT' : undefined 
              };
           }
           return newSlots;
        });
      }, 5000); // Every 5 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const getEntryFee = (cat: string) => {
    switch(cat) {
      case 'TRUCK': return 10000;
      case 'VAN': return 5000;
      case 'CAR': return 3000;
      default: return 1000;
    }
  };

  const handleScan = () => {
    // Determine input source
    const inputCode = scanInput.trim();
    if (!inputCode) return;

    const token = tokens.find(t => t.code === inputCode);
    if (!token) {
      setScanResult({ status: 'INVALID', msg: 'Token not found in system.' });
      return;
    }
    if (token.status !== 'ACTIVE') {
      setScanResult({ status: 'EXPIRED', msg: `Token is ${token.status}. Access Denied.` });
      return;
    }

    // Logic for Entry vs Exit
    if (token.type === 'ENTRY') {
       setScanResult({ status: 'VALID', msg: `ENTRY AUTHORIZED: ${token.entityName}. Please proceed to parking.` });
    } else {
       // Exit logic
       const slot = parkingSlots.find(s => s.vehiclePlate === token.entityName);
       if (slot) {
         setParkingSlots(prev => prev.map(s => s.id === slot.id ? { ...s, status: 'AVAILABLE', vehiclePlate: undefined } : s));
         setScanResult({ status: 'VALID', msg: `EXIT AUTHORIZED: ${token.entityName}. Parking Slot ${slot.number} Released.` });
       } else {
         setScanResult({ status: 'VALID', msg: `EXIT AUTHORIZED: ${token.entityName}.` });
       }
    }
    
    setTokens(tokens.map(t => t.id === token.id ? { ...t, status: 'USED' } : t));
    setScanInput('');
    setIsCameraActive(false);
  };

  const handleProcessEntry = () => {
     if (!entryForm.plate) return;

     // 1. Assign Parking Slot
     let assignedSlot = parkingSlots.find(s => s.status === 'AVAILABLE' && 
        (entryForm.category === 'TRUCK' ? s.zone === 'A' : entryForm.category === 'BIKE' ? s.zone === 'C' : s.zone === 'B')
     );
     
     if (!assignedSlot) assignedSlot = parkingSlots.find(s => s.status === 'AVAILABLE');

     if (assignedSlot) {
        setParkingSlots(prev => prev.map(s => s.id === assignedSlot!.id ? { ...s, status: 'OCCUPIED', vehiclePlate: entryForm.plate } : s));
     }

     const fee = entryForm.type === 'REGULAR' ? 0 : getEntryFee(entryForm.category);

     // 2. Generate Token
     const newToken: GateToken = {
         id: `gt${Date.now()}`,
         code: `MMIS-${Math.floor(Math.random()*10000)}`,
         type: 'ENTRY',
         entityName: entryForm.plate,
         status: 'ACTIVE',
         generatedAt: new Date().toISOString(),
         generatedBy: 'Gate A',
         associatedFee: fee,
         paymentStatus: 'PAID'
     };

     setTokens([newToken, ...tokens]);
     
     // Reset
     setEntryForm({ plate: '', type: 'VISITOR', category: 'TRUCK', driver: '', paymentMethod: 'CASH' });
     alert(`Entry Processed!\nToken: ${newToken.code}\nSlot: ${assignedSlot ? assignedSlot.number : 'GATE-WAITING'}\nFee: ${fee} UGX`);
  };

  const handleDeleteToken = (id: string) => {
      if(confirm('Delete this token record?')) {
        setTokens(tokens.filter(t => t.id !== id));
      }
  };

  const handleStockLookup = () => {
    if (stockScanInput === 'REQ-123') {
        setVerifiedManifest([
            { item: 'Organic Matooke (Bunches)', qty: 50, checked: false },
            { item: 'Fresh Tomatoes (Crates)', qty: 20, checked: false },
            { item: 'Potatoes (Sacks)', qty: 10, checked: false }
        ]);
    } else {
        alert("Requisition not found. Try 'REQ-123'");
        setVerifiedManifest(null);
    }
  };

  const toggleItemCheck = (idx: number) => {
    if (!verifiedManifest) return;
    const updated = [...verifiedManifest];
    updated[idx].checked = !updated[idx].checked;
    setVerifiedManifest(updated);
  };

  // Filter parking slots based on search
  const filteredSlots = parkingSlots.filter(s => 
     s.number.toLowerCase().includes(parkingSearch.toLowerCase()) || 
     s.vehiclePlate?.toLowerCase().includes(parkingSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
       {/* Top Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md flex items-center justify-between">
             <div>
                <div className="text-slate-400 text-xs font-bold uppercase">Vehicles Inside</div>
                <div className="text-3xl font-bold mt-1">{parkingSlots.filter(s => s.status === 'OCCUPIED').length}</div>
             </div>
             <div className="p-3 bg-slate-800 rounded-lg"><Truck size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                <div className="text-slate-500 text-xs font-bold uppercase">Available Slots</div>
                <div className="text-3xl font-bold mt-1 text-green-600">{parkingSlots.filter(s => s.status === 'AVAILABLE').length}</div>
             </div>
             <div className="p-3 bg-green-50 text-green-600 rounded-lg"><MapPin size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                <div className="text-slate-500 text-xs font-bold uppercase">Today's Revenue</div>
                <div className="text-3xl font-bold mt-1 text-blue-600">
                    {(tokens.reduce((acc, curr) => acc + (curr.associatedFee || 0), 0)).toLocaleString()} UGX
                </div>
             </div>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={24} /></div>
          </div>
       </div>

       {/* Module Navigation */}
       <div className="flex border-b border-slate-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('TERMINAL')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'TERMINAL' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
             Gate Terminal
          </button>
          <button 
            onClick={() => setActiveTab('PARKING')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'PARKING' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
             Parking Map
          </button>
          <button 
            onClick={() => setActiveTab('STOCK')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'STOCK' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
             <ClipboardList size={16} /> Stock Check
          </button>
          <button 
            onClick={() => setActiveTab('REGISTRY')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'REGISTRY' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
             Token Registry
          </button>
       </div>

       {/* TERMINAL VIEW */}
       {activeTab === 'TERMINAL' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
             {/* Scanner Column */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Scan size={20} className="text-blue-600" /> Scanner / Verify
                </h3>
                
                {/* Mock Camera View */}
                {isCameraActive ? (
                   <div className="bg-black rounded-lg h-64 mb-4 flex flex-col items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
                       <div className="w-48 h-48 border-2 border-green-500 rounded-lg relative z-10 animate-pulse">
                           <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_10px_#22c55e] animate-[scan_2s_infinite]"></div>
                       </div>
                       <p className="text-green-500 text-xs mt-2 font-mono">Scanning...</p>
                       <button onClick={() => setIsCameraActive(false)} className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded hover:bg-black/80"><XCircle size={20}/></button>
                       {/* Simulate auto-scan after 3s */}
                       <div className="hidden">{setTimeout(() => { if(isCameraActive) { setScanInput('MMIS-ENT-8832'); handleScan(); } }, 3000)}</div>
                   </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder="Scan QR or Enter Token Code..." 
                      className="w-full sm:flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button 
                        onClick={() => setIsCameraActive(true)}
                        className="px-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 border border-slate-200"
                        title="Open Camera"
                        >
                        <Camera size={20} />
                        </button>
                        <button 
                        onClick={handleScan}
                        className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition"
                        >
                        Check
                        </button>
                    </div>
                  </div>
                )}

                {scanResult.status && (
                  <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                     scanResult.status === 'VALID' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                     {scanResult.status === 'VALID' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                     <div>
                        <div className="font-bold">{scanResult.status === 'VALID' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}</div>
                        <div className="text-sm">{scanResult.msg}</div>
                     </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Recent Scans</h4>
                    <div className="space-y-2">
                        {tokens.slice(0,3).map(t => (
                            <div key={t.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                <span className="font-mono">{t.code}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${t.status === 'USED' ? 'bg-green-200 text-green-800' : 'bg-slate-200'}`}>{t.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
             </div>

             {/* Entry Processor Column */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Plus size={20} className="text-green-600" /> Process New Entry
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Plate Number</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono tracking-wider"
                          placeholder="UBD 000X"
                          value={entryForm.plate}
                          onChange={(e) => setEntryForm({...entryForm, plate: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Visit Type</label>
                            <select 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={entryForm.type}
                                onChange={(e) => setEntryForm({...entryForm, type: e.target.value})}
                            >
                                <option value="VISITOR">One-time Visitor</option>
                                <option value="REGULAR">Monthly Pass Holder</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Category</label>
                            <select 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={entryForm.category}
                                onChange={(e) => setEntryForm({...entryForm, category: e.target.value})}
                            >
                                <option value="TRUCK">Truck</option>
                                <option value="VAN">Van</option>
                                <option value="CAR">Saloon Car</option>
                                <option value="BIKE">Boda Boda</option>
                            </select>
                        </div>
                    </div>

                    {entryForm.type === 'VISITOR' ? (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Method</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setEntryForm({...entryForm, paymentMethod: 'MTN_MOMO'})}
                                    className={`py-2 text-sm font-bold rounded border ${entryForm.paymentMethod === 'MTN_MOMO' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    MTN MoMo
                                </button>
                                <button
                                    onClick={() => setEntryForm({...entryForm, paymentMethod: 'AIRTEL_MONEY'})}
                                    className={`py-2 text-sm font-bold rounded border ${entryForm.paymentMethod === 'AIRTEL_MONEY' ? 'bg-red-50 border-red-500 text-red-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    Airtel Money
                                </button>
                                <button
                                    onClick={() => setEntryForm({...entryForm, paymentMethod: 'VISA'})}
                                    className={`py-2 text-sm font-bold rounded border ${entryForm.paymentMethod === 'VISA' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    Visa/Card
                                </button>
                                <button
                                    onClick={() => setEntryForm({...entryForm, paymentMethod: 'CASH'})}
                                    className={`py-2 text-sm font-bold rounded border ${entryForm.paymentMethod === 'CASH' ? 'bg-green-50 border-green-500 text-green-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    Cash
                                </button>
                            </div>
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100 animate-in fade-in">
                                <div className="text-sm text-slate-500">Gate Fee</div>
                                <div className="text-xl font-bold text-slate-900">{getEntryFee(entryForm.category).toLocaleString()} UGX</div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3 animate-in fade-in">
                            <UserCheck className="text-blue-600" size={24} />
                            <div>
                                <div className="font-bold text-blue-900">Pass Holder</div>
                                <div className="text-xs text-blue-700">Fee waived. Verify pass validity manually.</div>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleProcessEntry}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                    >
                        <Printer size={18} /> Print Ticket & Open Gate
                    </button>
                </div>
             </div>
         </div>
       )}

       {/* PARKING MAP VIEW */}
       {activeTab === 'PARKING' && (
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                 <div>
                    <h3 className="font-bold text-slate-900">Live Parking Map</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <RefreshCw size={12} className="animate-spin text-green-600"/>
                        Updating real-time...
                    </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                        type="text"
                        placeholder="Find slot or plate..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={parkingSearch}
                        onChange={(e) => setParkingSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 text-xs font-medium shrink-0">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div> Available</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div> Occupied</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded"></div> Reserved</span>
                    </div>
                 </div>
              </div>

              {['A', 'B', 'C'].map(zone => (
                  <div key={zone} className="mb-6">
                      <h4 className="text-sm font-bold text-slate-400 mb-3 border-b border-slate-100 pb-1">
                          Zone {zone} - {zone === 'A' ? 'Heavy Trucks' : zone === 'B' ? 'Light Vehicles' : 'Motorcycles'}
                      </h4>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                          {filteredSlots.filter(s => s.zone === zone).map(slot => (
                              <div 
                                key={slot.id} 
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105 ${
                                    slot.status === 'AVAILABLE' ? 'bg-green-50 border-green-200' :
                                    slot.status === 'OCCUPIED' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                                }`}
                                onClick={() => {
                                    if(slot.status === 'OCCUPIED' && confirm(`Force release slot ${slot.number}?`)) {
                                        setParkingSlots(prev => prev.map(s => s.id === slot.id ? { ...s, status: 'AVAILABLE', vehiclePlate: undefined } : s));
                                    }
                                }}
                              >
                                  <span className={`text-xs font-bold ${
                                      slot.status === 'AVAILABLE' ? 'text-green-700' :
                                      slot.status === 'OCCUPIED' ? 'text-red-700' : 'text-amber-700'
                                  }`}>{slot.number}</span>
                                  {slot.status === 'OCCUPIED' ? (
                                      <>
                                        <Car size={16} className="text-red-400" />
                                        <span className="text-[10px] font-mono font-bold text-red-800">{slot.vehiclePlate}</span>
                                      </>
                                  ) : (
                                      <span className="text-[10px] text-slate-400">Free</span>
                                  )}
                              </div>
                          ))}
                          {filteredSlots.length === 0 && (
                            <div className="col-span-full text-center text-xs text-slate-400 py-2">No slots match your search in this zone.</div>
                          )}
                      </div>
                  </div>
              ))}
           </div>
       )}

       {/* STOCK VERIFICATION VIEW */}
       {activeTab === 'STOCK' && (
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4">
              <div className="mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Package className="text-blue-600" size={24} /> Supply Verification
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Scan Requisition/Gate Pass QR to verify incoming goods manifest.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="Scan Supply QR Code (Try 'REQ-123')" 
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase"
                    value={stockScanInput}
                    onChange={(e) => setStockScanInput(e.target.value)}
                  />
                  <button 
                    onClick={handleStockLookup}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                  >
                    Fetch Manifest
                  </button>
              </div>

              {verifiedManifest ? (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
                          <span className="font-bold text-slate-800">Manifest: REQ-123</span>
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">Pending Verification</span>
                      </div>
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-100 text-slate-500 font-medium">
                              <tr>
                                  <th className="px-6 py-3">Item Description</th>
                                  <th className="px-6 py-3">Expected Qty</th>
                                  <th className="px-6 py-3 text-center">Verify</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                              {verifiedManifest.map((item, idx) => (
                                  <tr key={idx} className={item.checked ? "bg-green-50/50" : ""}>
                                      <td className="px-6 py-4 font-medium">{item.item}</td>
                                      <td className="px-6 py-4">{item.qty}</td>
                                      <td className="px-6 py-4 text-center">
                                          <button 
                                            onClick={() => toggleItemCheck(idx)}
                                            className={`p-2 rounded-full transition-all ${item.checked ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                                          >
                                              <CheckCircle size={20} />
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                      <div className="p-6 bg-white border-t border-slate-200 text-right">
                          <button 
                            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!verifiedManifest.every(i => i.checked)}
                            onClick={() => { alert("Stock Verified and Added to Inventory Log."); setVerifiedManifest(null); setStockScanInput(''); }}
                          >
                              Confirm & Log Entry
                          </button>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      <AlertOctagon size={48} className="mb-2 opacity-20" />
                      <p>No manifest loaded. Scan a QR code to begin.</p>
                  </div>
              )}
           </div>
       )}

       {/* TOKEN REGISTRY VIEW */}
       {activeTab === 'REGISTRY' && (
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4">
               <div className="px-6 py-4 border-b border-slate-200 font-bold text-slate-800 flex justify-between items-center">
                   <span>All Active Tokens</span>
                   <button className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-slate-600 transition">Export CSV</button>
               </div>
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Token Code</th>
                      <th className="px-6 py-4">Vehicle/Entity</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Fee Paid</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tokens.map(token => {
                      // Check expiration logic (mock: if older than 24 hours and active)
                      const isExpired = token.status === 'ACTIVE' && (Date.now() - new Date(token.generatedAt).getTime() > 86400000);
                      const displayStatus = isExpired ? 'EXPIRED' : token.status;

                      return (
                      <tr key={token.id} className="hover:bg-slate-50">
                         <td className="px-6 py-4 font-mono font-medium text-slate-700 flex items-center gap-2">
                            <QrCode size={16} className="text-slate-400" />
                            {token.code}
                         </td>
                         <td className="px-6 py-4 text-slate-900 font-bold">{token.entityName}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${token.type === 'ENTRY' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                               {token.type}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-slate-600">
                            {token.associatedFee ? `${token.associatedFee.toLocaleString()} UGX` : '-'}
                         </td>
                         <td className="px-6 py-4 text-slate-500 text-xs">{new Date(token.generatedAt).toLocaleTimeString()}</td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                displayStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                                displayStatus === 'USED' ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-500'
                              }`}>
                                {displayStatus}
                              </span>
                              {displayStatus === 'EXPIRED' && <AlertTriangle size={14} className="text-red-500 animate-pulse" title="Expired Alert" />}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Edit size={16} /></button>
                               <button 
                                  onClick={() => handleDeleteToken(token.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                               ><Trash2 size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    )})}
                  </tbody>
               </table>
           </div>
       )}
    </div>
  );
};
