
import React, { useState } from 'react';
import { Vendor, Transaction, UserRole } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  X, User, History, FileText, StickyNote, AlertTriangle, Briefcase, 
  Building2, MapPin, Phone, Mail, QrCode, Ban, Search, ArrowUpDown, 
  Banknote, Upload, Download, Save, ShieldAlert, CreditCard, Gavel, Power,
  Layers, Store, Tag, UserCheck, CheckCircle
} from 'lucide-react';

interface VendorDetailsModalProps {
  vendor: Vendor;
  userRole: UserRole;
  onClose: () => void;
  onUpdateVendor: (updatedVendor: Vendor) => void;
  onAuditAction: (action: string, details: string) => void;
  onToggleStatus: (vendor: Vendor) => void;
}

export const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({ 
  vendor, 
  userRole, 
  onClose, 
  onUpdateVendor, 
  onAuditAction,
  onToggleStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'DOCUMENTS' | 'NOTES'>('OVERVIEW');
  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;

  // History Tab State
  const [historySort, setHistorySort] = useState<'DATE' | 'AMOUNT'>('DATE');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [historySearch, setHistorySearch] = useState('');

  const vendorTransactions = MOCK_TRANSACTIONS.filter(t => t.entityId === vendor.id);
  
  const filteredTransactions = vendorTransactions
    .filter(t => {
        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
        const matchesSearch = !historySearch || 
            (t.reference?.toLowerCase().includes(historySearch.toLowerCase()) || 
             t.amount.toString().includes(historySearch));
        return matchesStatus && matchesType && matchesSearch;
    })
    .sort((a, b) => {
        if (historySort === 'DATE') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return b.amount - a.amount;
    });

  const getMarketName = (id: string) => id === 'm1' ? 'Nakasero Market' : id === 'm2' ? 'Owino Market' : 'Central Market';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start shrink-0 bg-slate-50/50">
           <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xl">{vendor.name[0]}</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{vendor.name}</h3>
                <div className="flex gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest bg-slate-200 px-1.5 py-0.5 rounded">ID: {vendor.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${vendor.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {vendor.status}
                    </span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"><X size={24} /></button>
        </div>
        
        {/* Navigation */}
        <div className="flex border-b border-slate-100 px-6 gap-6 shrink-0 overflow-x-auto bg-white">
            {[
                { id: 'OVERVIEW', label: 'Identity & Store', icon: User },
                { id: 'HISTORY', label: 'Transaction History', icon: History },
                { id: 'DOCUMENTS', label: 'KYC Assets', icon: FileText },
                { id: 'NOTES', label: 'Internal Logs', icon: StickyNote }
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                    <tab.icon size={14} /> {tab.label}
                </button>
            ))}
        </div>

        <div className="p-6 space-y-6 overflow-y-auto bg-white">
           {activeTab === 'OVERVIEW' ? (
               <div className="space-y-6 animate-in slide-in-from-right-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl border flex flex-col justify-between ${vendor.rentDue > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <div className="flex justify-between items-start">
                            <div className={`text-[10px] font-black uppercase tracking-widest ${vendor.rentDue > 0 ? 'text-red-700' : 'text-green-700'}`}>Credit Status</div>
                            {vendor.rentDue > 0 && <AlertTriangle size={14} className="text-red-600" />}
                        </div>
                        <div className="mt-4">
                            <div className={`text-2xl font-black ${vendor.rentDue > 0 ? 'text-red-700' : 'text-green-700'}`}>
                                {vendor.rentDue.toLocaleString()} <span className="text-xs font-bold opacity-60">UGX</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Outstanding Rent/VAT</div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Stock Ledger</div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-900/40"><Briefcase size={20} /></div>
                            <div>
                                <div className="text-2xl font-black">{vendor.productsCount}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase">SKUs Registered</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 border border-slate-100"><UserCheck size={18} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Demographics</p>
                            <p className="text-sm font-bold text-slate-800">{vendor.gender} • {vendor.age} Years</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 border border-slate-100"><Store size={18} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Store Category</p>
                            <p className="text-sm font-bold text-slate-800">{vendor.storeType || 'Mixed Retail'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 border border-slate-100"><Layers size={18} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Zone Mapping</p>
                            <p className="text-sm font-bold text-slate-800">{vendor.level || 'Ground'} • {vendor.section || 'General'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 border border-slate-100"><Tag size={18} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Ownership Type</p>
                            <p className="text-sm font-bold text-slate-800">{vendor.ownershipType || 'Individual'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <MapPin size={18} className="text-indigo-500 mt-0.5" />
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Entity</p><p className="text-sm font-bold text-slate-800">{getMarketName(vendor.marketId)}</p><p className="text-xs text-slate-500 font-mono">Unit: {vendor.shopNumber}</p></div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <Phone size={18} className="text-indigo-500 mt-0.5" />
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Contact</p><p className="text-sm font-bold text-slate-800">{vendor.phone || 'N/A'}</p><p className="text-xs text-slate-500 truncate max-w-[150px]">{vendor.email || 'No email'}</p></div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all hover:bg-slate-800">
                        <QrCode size={16}/> Print QR Terminal
                    </button>
                    {isAdmin && (
                        <button onClick={() => onToggleStatus(vendor)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 transition-all ${vendor.status === 'ACTIVE' ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-green-100 text-green-600 hover:bg-green-50'}`}>
                            {vendor.status === 'ACTIVE' ? <Ban size={16}/> : <CheckCircle size={16}/>}
                            {vendor.status === 'ACTIVE' ? 'Suspend Node' : 'Activate Node'}
                        </button>
                    )}
                </div>
               </div>
           ) : activeTab === 'HISTORY' ? (
               <div className="space-y-4 animate-in slide-in-from-right-2">
                   <div className="flex flex-wrap gap-2">
                       <div className="relative flex-1 min-w-[200px]">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                           <input type="text" placeholder="Filter references..." className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg outline-none" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} />
                       </div>
                       <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 bg-white outline-none">
                           <option value="ALL">Status: All</option><option value="PAID">Paid</option><option value="OVERDUE">Overdue</option><option value="PENDING">Pending</option>
                       </select>
                       <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 bg-white outline-none">
                           <option value="ALL">Type: All</option><option value="RENT">Rent</option><option value="VAT">VAT</option><option value="UTILITY">Utility</option>
                       </select>
                       <button onClick={() => setHistorySort(historySort === 'DATE' ? 'AMOUNT' : 'DATE')} className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-indigo-600"><ArrowUpDown size={14}/></button>
                   </div>

                   <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto shadow-inner">
                       <table className="w-full text-xs text-left">
                           <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest sticky top-0 z-10">
                               <tr className="border-b border-slate-100">
                                   <th className="px-4 py-3">Reference</th>
                                   <th className="px-4 py-3">Date</th>
                                   <th className="px-4 py-3 text-right">Amount (UGX)</th>
                                   <th className="px-4 py-3 text-center">Status</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50 font-medium">
                               {filteredTransactions.map(tx => (
                                   <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                       <td className="px-4 py-3 font-mono text-slate-400 uppercase">{tx.reference || tx.id}</td>
                                       <td className="px-4 py-3 text-slate-700">{tx.date}</td>
                                       <td className="px-4 py-3 font-black text-slate-900 text-right">{tx.amount.toLocaleString()}</td>
                                       <td className="px-4 py-3 text-center">
                                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${tx.status === 'PAID' ? 'bg-green-100 text-green-700' : tx.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                               {tx.status}
                                           </span>
                                       </td>
                                   </tr>
                               ))}
                               {filteredTransactions.length === 0 && (
                                   <tr><td colSpan={4} className="text-center py-20 text-slate-400"><History size={40} className="mx-auto mb-2 opacity-10"/>No matching transactions.</td></tr>
                               )}
                           </tbody>
                       </table>
                   </div>
               </div>
           ) : activeTab === 'NOTES' && isAdmin ? (
              <div className="space-y-4 animate-in slide-in-from-right-2">
                  <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2"><StickyNote size={18} /> Compliance Records</h4>
                        {isAdmin && <button className="text-[10px] font-black uppercase text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">New Entry</button>}
                    </div>
                    <div className="text-sm text-slate-700 bg-white p-5 rounded-xl border border-indigo-100 min-h-[120px] shadow-sm leading-relaxed">
                        {vendor.notes || "No operational flags or administrative notes registered for this entity."}
                    </div>
                </div>
              </div>
           ) : (
              <div className="space-y-6 animate-in slide-in-from-right-2">
                 <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                    <Upload size={32} className="mx-auto text-slate-300 mb-4" />
                    <h4 className="font-bold text-slate-700">Digital KYC Vault</h4>
                    <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">Access securely stored identification and licenses for compliance verification.</p>
                    <div className="flex flex-col gap-2 max-w-xs mx-auto">
                        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group hover:border-indigo-200 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-500 rounded-lg"><FileText size={18} /></div>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Trading_License.pdf</span>
                            </div>
                            <Download size={14} className="text-slate-300 group-hover:text-indigo-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm group hover:border-indigo-200 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><User size={18} /></div>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">National_ID_Scan.jpg</span>
                            </div>
                            <Download size={14} className="text-slate-300 group-hover:text-indigo-500" />
                        </div>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
