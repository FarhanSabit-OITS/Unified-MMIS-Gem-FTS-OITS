
import React, { useState, useEffect } from 'react';
import { Vendor, Transaction, UserRole, Market, PaymentType } from '../types';
import { MOCK_TRANSACTIONS, MARKETS, CITIES } from '../constants';
import { 
  X, User, History, FileText, StickyNote, AlertTriangle, Building2, MapPin, 
  Phone, Mail, Ban, Search, ArrowUpDown, Save, ShieldAlert, CreditCard, 
  Store, UserCheck, CheckCircle, Edit3, Loader2, Clock, ShieldCheck, Tag,
  Calendar, Wallet, Info, Filter, Receipt
} from 'lucide-react';
import { Button } from './ui/Button';

interface VendorDetailsModalProps {
  vendor: Vendor;
  userRole: UserRole;
  onClose: () => void;
  onUpdateVendor: (updatedVendor: Vendor) => void;
}

export const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({ 
  vendor, userRole, onClose, onUpdateVendor 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'DOCUMENTS' | 'EDIT'>('OVERVIEW');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'RENT' | 'VAT'>('ALL');
  const [editedData, setEditedData] = useState<Vendor>({ ...vendor });
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;

  // Resolve Market and City details
  const market = MARKETS.find(m => m.id === vendor.marketId);
  const city = CITIES.find(c => c.id === market?.cityId);

  // Filter transactions for this specific vendor, specifically focusing on Rent and VAT
  const vendorTransactions = MOCK_TRANSACTIONS.filter(t => {
    const isOwner = t.entityId === vendor.id;
    if (!isOwner) return false;
    if (historyFilter === 'RENT') return t.type === PaymentType.RENT;
    if (historyFilter === 'VAT') return t.type === PaymentType.URA_VAT;
    return true;
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateVendor(editedData);
      setIsSaving(false);
      setActiveTab('OVERVIEW');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-3xl w-full overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-start shrink-0 bg-slate-50/50">
           <div className="flex gap-5">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-100">
                {vendor.name[0]}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{vendor.name}</h3>
                <div className="flex gap-2 mt-1.5">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${vendor.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {vendor.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">Node ID: {vendor.id}</span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-8 gap-8 shrink-0 bg-white overflow-x-auto scrollbar-hide">
            {[
                { id: 'OVERVIEW', label: 'Overview', icon: User },
                { id: 'HISTORY', label: 'Ledger & Transactions', icon: History },
                { id: 'DOCUMENTS', label: 'Identity', icon: ShieldCheck },
                { id: 'EDIT', label: 'Edit Node', icon: Edit3 }
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-5 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                    <tab.icon size={14} /> {tab.label}
                </button>
            ))}
        </div>

        <div className="p-8 space-y-6 overflow-y-auto bg-white flex-1">
           {activeTab === 'OVERVIEW' && (
               <div className="space-y-8 animate-in fade-in">
                {/* Financial & Inventory Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-[24px] border-2 flex flex-col justify-between ${vendor.rentDue > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <div>
                            <div className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Arrears Balance</div>
                            <div className={`text-2xl font-black ${vendor.rentDue > 0 ? 'text-red-700' : 'text-green-700'}`}>{vendor.rentDue.toLocaleString()} UGX</div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200/50">
                            <div className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Next Due Cycle</div>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Calendar size={14} className="text-slate-400" />
                                {vendor.rentDueDate || 'Not Defined'}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-900 text-white rounded-[24px] shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Active Stock</div>
                            <div className="text-2xl font-black">{vendor.productsCount} SKUs</div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-indigo-400">
                            <Tag size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Node Registry Active</span>
                        </div>
                    </div>
                </div>

                {/* Market Allocation Information */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Info size={14} className="text-indigo-500" /> Market Allocation Profile
                  </h4>
                  <div className="bg-indigo-50/30 rounded-2xl border border-indigo-100/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Hub</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight">{market?.name || 'No Market Assigned'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Classification</p>
                          <p className="text-sm font-bold text-slate-700">{market?.type || 'N/A'}</p>
                       </div>
                       <div className="border-l border-indigo-100 pl-8">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={10} className="text-red-400" /> Regional Node
                          </p>
                          <p className="text-sm font-bold text-slate-700">{city?.name || 'Unknown Region'}</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Entity Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Mail className="text-slate-400" size={20} />
                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Channel</p><p className="text-sm font-bold text-slate-800">{vendor.email || 'Not Provided'}</p></div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Phone className="text-slate-400" size={20} />
                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Contact</p><p className="text-sm font-bold text-slate-800">{vendor.phone || '+256 000 000 000'}</p></div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Store className="text-slate-400" size={20} />
                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Allocated Unit</p><p className="text-sm font-bold text-slate-800">Unit {vendor.shopNumber} • {vendor.section || 'General Sector'}</p></div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Tag className="text-slate-400" size={20} />
                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business Type</p><p className="text-sm font-bold text-slate-800">{vendor.storeType || 'Retail Node'}</p></div>
                    </div>
                </div>
               </div>
           )}

           {activeTab === 'HISTORY' && (
               <div className="space-y-4 animate-in fade-in">
                   <div className="flex justify-between items-center mb-2">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Fiscal History Ledger</h4>
                       <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setHistoryFilter('ALL')} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${historyFilter === 'ALL' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>All</button>
                            <button onClick={() => setHistoryFilter('RENT')} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${historyFilter === 'RENT' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>Rent Only</button>
                            <button onClick={() => setHistoryFilter('VAT')} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${historyFilter === 'VAT' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>VAT Only</button>
                       </div>
                   </div>
                   <div className="bg-slate-900 rounded-[24px] overflow-hidden border border-slate-800 shadow-2xl">
                       <table className="w-full text-[11px] text-left text-slate-300">
                           <thead className="bg-slate-800/50 text-slate-400 font-black uppercase tracking-widest border-b border-slate-800">
                               <tr>
                                   <th className="px-5 py-5 text-indigo-400">Classification</th>
                                   <th className="px-5 py-5">Event Date</th>
                                   <th className="px-5 py-5">Settlement Method</th>
                                   <th className="px-5 py-5 text-right">Magnitude (UGX)</th>
                                   <th className="px-5 py-5 text-center">Status</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-800 font-medium">
                               {vendorTransactions.map(tx => (
                                   <tr key={tx.id} className="hover:bg-indigo-600/5 transition-colors group">
                                       <td className="px-5 py-5">
                                           <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${tx.type === PaymentType.RENT ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {tx.type === PaymentType.RENT ? <Store size={14}/> : <Receipt size={14}/>}
                                                </div>
                                                <div>
                                                    <div className="font-mono text-indigo-400 font-bold uppercase tracking-tight group-hover:text-indigo-300">{tx.reference || tx.id}</div>
                                                    <div className="text-[9px] text-slate-500 font-black uppercase mt-0.5">{tx.type.replace('_', ' ')}</div>
                                                </div>
                                           </div>
                                       </td>
                                       <td className="px-5 py-5 text-slate-400 font-bold">{tx.date}</td>
                                       <td className="px-5 py-5">
                                            <div className="flex items-center gap-2">
                                                {tx.method === 'MTN_MOMO' && <div className="w-2 h-2 rounded-full bg-yellow-400"></div>}
                                                {tx.method === 'AIRTEL_MONEY' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                                {tx.method === 'BANK' && <div className="w-2 h-2 rounded-full bg-blue-400"></div>}
                                                {tx.method === 'CASH' && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
                                                <span className="text-[10px] uppercase font-bold text-slate-500">{tx.method.replace('_', ' ')}</span>
                                            </div>
                                       </td>
                                       <td className="px-5 py-5 font-black text-white text-right text-sm">
                                           {tx.amount.toLocaleString()}
                                       </td>
                                       <td className="px-5 py-5 text-center">
                                           <span className={`px-3 py-1 rounded-full font-black uppercase text-[8px] tracking-widest border ${
                                               tx.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                                               tx.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                               'bg-red-500/20 text-red-400 border-red-500/30'
                                           }`}>
                                               {tx.status}
                                           </span>
                                       </td>
                                   </tr>
                               ))}
                               {vendorTransactions.length === 0 && (
                                   <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-600 italic font-medium uppercase tracking-widest text-[9px]">No financial telemetry triangulated for this node.</td></tr>
                               )}
                           </tbody>
                       </table>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                            <Wallet size={18} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Total Lifetime Remittance</span>
                       </div>
                       <span className="font-black text-slate-900 text-lg">
                           {vendorTransactions.filter(t => t.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-medium">UGX</span>
                       </span>
                   </div>
               </div>
           )}

           {activeTab === 'EDIT' && (
              <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Entity Label</label>
                          <input className="w-full p-3 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 focus:bg-white outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all shadow-sm" value={editedData.name} onChange={e => setEditedData({...editedData, name: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Registry Unit</label>
                          <input className="w-full p-3 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 focus:bg-white outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all shadow-sm font-mono" value={editedData.shopNumber} onChange={e => setEditedData({...editedData, shopNumber: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Arrears Correction</label>
                          <input type="number" className="w-full p-3 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 focus:bg-white outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all shadow-sm" value={editedData.rentDue} onChange={e => setEditedData({...editedData, rentDue: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Next Due Date</label>
                          <input type="date" className="w-full p-3 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 focus:bg-white outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all shadow-sm" value={editedData.rentDueDate || ''} onChange={e => setEditedData({...editedData, rentDueDate: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Primary Email</label>
                          <input className="w-full p-3 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 focus:bg-white outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all shadow-sm" value={editedData.email || ''} onChange={e => setEditedData({...editedData, email: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                          <input className="w-full p-3 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 focus:bg-white outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all shadow-sm" value={editedData.phone || ''} onChange={e => setEditedData({...editedData, phone: e.target.value})} />
                      </div>
                  </div>
                  <Button onClick={handleSave} loading={isSaving} className="w-full h-14 rounded-[20px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100">
                      Commit Registry Synchronisation
                  </Button>
              </div>
           )}

           {activeTab === 'DOCUMENTS' && (
               <div className="space-y-6 animate-in fade-in">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-4 border border-slate-100">
                                <FileText size={24} />
                            </div>
                            <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">National ID Registry</h5>
                            <p className="text-xs text-slate-500 mt-1 mb-4 font-medium">Digital copy of NID triangulated via KYC module.</p>
                            <Button variant="outline" className="w-full text-[10px] uppercase font-black tracking-widest py-2 h-9">View Document</Button>
                       </div>
                       <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-4 border border-slate-100">
                                <Store size={24} />
                            </div>
                            <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight">Trading License</h5>
                            <p className="text-xs text-slate-500 mt-1 mb-4 font-medium">Verification for current operational cycle.</p>
                            <Button variant="outline" className="w-full text-[10px] uppercase font-black tracking-widest py-2 h-9">View Document</Button>
                       </div>
                   </div>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};
