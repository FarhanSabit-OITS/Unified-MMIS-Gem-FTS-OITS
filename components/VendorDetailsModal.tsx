
import React, { useState, useEffect } from 'react';
import { Vendor, Transaction, UserRole, Market, PaymentType, Product } from '../types';
import { MOCK_TRANSACTIONS, MARKETS, CITIES, MOCK_PRODUCTS } from '../constants';
import { 
  X, User, History, FileText, Building2, MapPin, 
  Phone, Mail, Calendar, Wallet, Info, Receipt,
  CheckCircle, AlertTriangle, Clock, ShieldCheck, Tag, Edit3,
  Download, DollarSign, LayoutGrid, ShoppingBag, Package
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
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'PRODUCTS' | 'DOCUMENTS' | 'EDIT'>('OVERVIEW');
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

  const vendorProducts = MOCK_PRODUCTS.filter(p => p.vendorId === vendor.id);

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
                { id: 'PRODUCTS', label: 'Inventory', icon: ShoppingBag },
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
               <div className="space-y-12 animate-in fade-in">
                {/* Financial Summary Cards */}
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
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Registry Validated</span>
                        </div>
                    </div>
                </div>

                {/* Explicit Market Registration Details */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Building2 size={16} className="text-indigo-500" /> Market Hub Enrollment
                  </h4>
                  <div className="bg-slate-50 rounded-[40px] border-2 border-slate-100 p-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Building2 size={12} className="text-indigo-500"/> Registered Hub
                            </p>
                            <p className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                                {market?.name || 'PENDING ASSIGNMENT'}
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <LayoutGrid size={12} className="text-indigo-500"/> Hub Classification
                            </p>
                            <div className="flex">
                                <span className="bg-white border-2 border-slate-200 text-indigo-700 px-4 py-1 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {market?.type || 'MIXED'} NODE
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={12} className="text-rose-500"/> Geographic Location
                            </p>
                            <p className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                                {city?.name || 'UNKNOWN REGION'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-10 pt-8 border-t border-slate-200 flex flex-wrap gap-8">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sector Node</p>
                          <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">{vendor.section || 'General'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Tag</p>
                          <p className="text-sm font-black text-indigo-600 font-mono tracking-widest">#{vendor.shopNumber}</p>
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
               </div>
           )}

           {activeTab === 'PRODUCTS' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-950 text-indigo-400 font-black uppercase text-[10px] tracking-[0.4em] border-b border-slate-900">
                      <tr>
                        <th className="px-8 py-8">Product Node</th>
                        <th className="px-8 py-8">Classification</th>
                        <th className="px-8 py-8">Stock Metric</th>
                        <th className="px-8 py-8 text-right">Unit Value (UGX)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vendorProducts.map(product => (
                        <tr key={product.id} className="hover:bg-indigo-50/30 transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              <div className="p-4 bg-slate-100 rounded-2xl text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Package size={20} />
                              </div>
                              <div>
                                <div className="font-black text-slate-900 uppercase tracking-tight text-base leading-none">{product.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono font-bold mt-2 tracking-widest">SKU: {product.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-widest border-2 bg-slate-50 text-slate-500 border-slate-100">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                              <span className={`text-[11px] font-black uppercase tracking-widest ${product.stock < 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                                {product.stock} Units Available
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-slate-950 text-base tabular-nums">
                            {product.price.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
