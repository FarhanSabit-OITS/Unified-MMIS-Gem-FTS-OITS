
import React, { useState, useEffect } from 'react';
import { Vendor, Transaction, UserRole, Market, PaymentType } from '../types';
import { MOCK_TRANSACTIONS, MARKETS, CITIES } from '../constants';
// Added LayoutGrid for Market Type representation
import { 
  X, User, History, FileText, Building2, MapPin, 
  Phone, Mail, Calendar, Wallet, Info, Receipt,
  CheckCircle, AlertTriangle, Clock, ShieldCheck, Tag, Edit3,
  Download, DollarSign, LayoutGrid
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

  const market = MARKETS.find(m => m.id === vendor.marketId);
  const city = CITIES.find(c => c.id === market?.cityId);

  const vendorTransactions = MOCK_TRANSACTIONS.filter(t => {
    const isOwner = t.entityId === vendor.id;
    if (!isOwner) return false;
    if (historyFilter === 'RENT') return t.type === PaymentType.RENT;
    if (historyFilter === 'VAT') return t.type === PaymentType.URA_VAT;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[48px] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
           <div className="flex gap-8">
              <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center font-black text-4xl shadow-2xl">
                {vendor.name[0]}
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">{vendor.name}</h3>
                <div className="flex gap-3">
                    <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] border-2 ${vendor.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {vendor.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                       <Tag size={12}/> NODE: {vendor.id}
                    </span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-300 hover:text-slate-950 hover:rotate-90 duration-300"><X size={32} /></button>
        </div>
        
        {/* Tabs HUD */}
        <div className="flex border-b border-slate-100 px-10 gap-10 bg-white overflow-x-auto scrollbar-hide">
            {[
                { id: 'OVERVIEW', label: 'Telemetry', icon: Info },
                { id: 'HISTORY', label: 'Fiscal Ledger', icon: History },
                { id: 'DOCUMENTS', label: 'Registry KYC', icon: ShieldCheck },
                { id: 'EDIT', label: 'Node Control', icon: Edit3 }
            ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`py-6 text-[10px] font-black uppercase tracking-[0.3em] border-b-[6px] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        <div className="p-10 space-y-8 overflow-y-auto bg-white flex-1">
           {activeTab === 'OVERVIEW' && (
               <div className="space-y-10 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`p-8 rounded-[40px] border-4 flex flex-col justify-between shadow-inner ${vendor.rentDue > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <div>
                            <div className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Fiscal Liability</div>
                            <div className={`text-4xl font-black tracking-tighter ${vendor.rentDue > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{vendor.rentDue.toLocaleString()} <span className="text-lg opacity-40">UGX</span></div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-900/5 flex items-center justify-between">
                            <div>
                                <div className="text-[9px] font-black uppercase text-slate-400 mb-1">Target Cycle</div>
                                <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                                    <Calendar size={14} className="text-indigo-500" />
                                    {vendor.rentDueDate || 'Lifecycle Pending'}
                                </div>
                            </div>
                            <button className="px-5 py-2 bg-white text-slate-950 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-slate-100 shadow-sm hover:bg-slate-50">Adjust Ledger</button>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-950 text-white rounded-[40px] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700"><Wallet size={120}/></div>
                        <div className="relative z-10">
                            <div className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-[0.2em]">Inventory Nodes</div>
                            <div className="text-4xl font-black tracking-tighter">{vendor.productsCount} <span className="text-lg opacity-40 uppercase tracking-widest ml-1">SKUs</span></div>
                        </div>
                        <div className="relative z-10 mt-8 flex items-center gap-3 text-indigo-400">
                            <ShieldCheck size={20} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Readiness Validated</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Building2 size={16} className="text-indigo-500" /> Registry Context Matrix
                  </h4>
                  <div className="bg-slate-50 rounded-[32px] border-2 border-slate-100 p-8 flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-3xl shadow-md border border-slate-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <Building2 size={32} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Market Hub</p>
                            <p className="text-2xl font-black text-slate-950 tracking-tighter uppercase">{market?.name || 'Unassigned Hub'}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-white border border-slate-200 text-slate-600 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                    <LayoutGrid size={10} className="text-indigo-500"/> {market?.type || 'MIXED'} HUB
                                </span>
                                <span className="bg-white border border-slate-200 text-slate-600 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                    <MapPin size={10} className="text-rose-500"/> {city?.name || 'UNKNOWN LOCATION'}
                                </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8 md:border-l md:border-slate-200 md:pl-8">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sector Node</p>
                              <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{vendor.section || 'General'}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Tag</p>
                              <p className="text-sm font-black text-indigo-600 font-mono tracking-widest">#{vendor.shopNumber}</p>
                           </div>
                        </div>
                    </div>
                  </div>
                </div>
               </div>
           )}

           {activeTab === 'HISTORY' && (
               <div className="space-y-6 animate-in fade-in">
                   <div className="flex justify-between items-center bg-slate-50 p-4 rounded-[28px] border border-slate-100">
                       <div className="flex gap-2">
                            <button onClick={() => setHistoryFilter('ALL')} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${historyFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>All Remittances</button>
                            <button onClick={() => setHistoryFilter('RENT')} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${historyFilter === 'RENT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>Rent Ledger</button>
                            <button onClick={() => setHistoryFilter('VAT')} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${historyFilter === 'VAT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white'}`}>VAT Compliance</button>
                       </div>
                       <Button variant="secondary" className="h-11 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-white"><Download size={16} className="mr-2"/> Export Ledger</Button>
                   </div>
                   
                   <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl">
                       <table className="w-full text-sm text-left">
                           <thead className="bg-slate-950 text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em] border-b border-slate-900">
                               <tr>
                                   <th className="px-8 py-8">Remittance Node</th>
                                   <th className="px-8 py-8">Protocol Flow</th>
                                   <th className="px-8 py-8 text-right">Volume (UGX)</th>
                                   <th className="px-8 py-8 text-center">Integrity</th>
                                   <th className="px-8 py-8 text-right">Registry Time</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                               {vendorTransactions.map(tx => (
                                   <tr key={tx.id} className="hover:bg-indigo-50/30 transition-all group">
                                       <td className="px-8 py-6">
                                           <div className="flex items-center gap-5">
                                                <div className={`p-4 rounded-2xl transition-transform group-hover:rotate-12 ${tx.type === PaymentType.RENT ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {tx.type === PaymentType.RENT ? <Building2 size={20}/> : <Receipt size={20}/>}
                                                </div>
                                                <div>
                                                    <div className="font-mono text-xs font-black text-slate-900 uppercase tracking-tighter">{tx.reference || tx.id}</div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">{tx.type.replace('_', ' ')}</div>
                                                </div>
                                           </div>
                                       </td>
                                       <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${tx.method === 'MTN_MOMO' ? 'bg-yellow-400 animate-pulse' : tx.method === 'AIRTEL_MONEY' ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'}`}></div>
                                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{tx.method.replace('_', ' ')}</span>
                                            </div>
                                       </td>
                                       <td className="px-8 py-6 text-right font-black text-slate-950 text-base tabular-nums">
                                           {tx.amount.toLocaleString()}
                                       </td>
                                       <td className="px-8 py-6 text-center">
                                           <span className={`px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-widest border-2 ${
                                               tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                               tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                               'bg-rose-50 text-rose-700 border-rose-100'
                                           }`}>
                                               {tx.status}
                                           </span>
                                       </td>
                                       <td className="px-8 py-6 text-right text-[11px] font-bold text-slate-400 uppercase font-mono tracking-tighter">
                                           {tx.date}
                                       </td>
                                   </tr>
                               ))}
                               {vendorTransactions.length === 0 && (
                                   <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-300 font-black uppercase tracking-[0.4em] text-[11px]">No fiscal telemetry found in node ledger</td></tr>
                               )}
                           </tbody>
                       </table>
                   </div>

                   <div className="p-10 bg-slate-950 rounded-[40px] border-none shadow-2xl flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={100}/></div>
                       <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-indigo-400">
                                <Wallet size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Total Remittance Flow</p>
                                <p className="text-3xl font-black tracking-tighter">
                                    {vendorTransactions.filter(t => t.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} <span className="text-sm opacity-40 font-medium">UGX</span>
                                </p>
                            </div>
                       </div>
                       <div className="relative z-10 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Integrity Status</p>
                           <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                               <ShieldCheck size={14}/> Node Fiscal Health: Prime
                           </p>
                       </div>
                   </div>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};
