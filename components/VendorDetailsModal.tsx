
import React, { useState, useEffect } from 'react';
import { Vendor, Transaction, UserRole } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  X, User, History, FileText, StickyNote, AlertTriangle, Briefcase, 
  Building2, MapPin, Phone, Mail, QrCode, Ban, Search, ArrowUpDown, 
  Banknote, Upload, Download, Save, ShieldAlert, CreditCard, Gavel, Power,
  Layers, Store, Tag, UserCheck, CheckCircle, Edit3, Loader2, Clock, ShieldCheck
} from 'lucide-react';
import { Button } from './ui/Button';

interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetVendor: string;
  timestamp: string;
}

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

  // Admin Notes State
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(vendor.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => { setTempNotes(vendor.notes || ''); }, [vendor.notes]);

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

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    setTimeout(() => {
        const updatedVendor = { ...vendor, notes: tempNotes };
        onUpdateVendor(updatedVendor);
        
        const newAudit: AuditLogEntry = {
            id: `log-${Date.now()}`,
            adminId: 'ADMIN-SESSION-01',
            action: 'EDIT_ADMIN_NOTES',
            targetVendor: vendor.id,
            timestamp: new Date().toLocaleString()
        };
        setAuditLogs(prev => [newAudit, ...prev]);
        setIsSavingNotes(false);
        setIsEditingNotes(false);
    }, 800);
  };

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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${vendor.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {vendor.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {vendor.id}</span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
        </div>
        
        {/* Navigation */}
        <div className="flex border-b border-slate-100 px-6 gap-6 shrink-0 bg-white">
            {[
                { id: 'OVERVIEW', label: 'Overview', icon: User },
                { id: 'HISTORY', label: 'Dues History', icon: History },
                { id: 'DOCUMENTS', label: 'Documents', icon: FileText },
                { id: 'NOTES', label: 'Admin Notes', icon: StickyNote }
            ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                    <tab.icon size={14} /> {tab.label}
                </button>
            ))}
        </div>

        <div className="p-6 space-y-6 overflow-y-auto bg-white flex-1">
           {activeTab === 'OVERVIEW' ? (
               <div className="space-y-6 animate-in slide-in-from-right-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${vendor.rentDue > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Outstanding Balance</div>
                        <div className={`text-xl font-black ${vendor.rentDue > 0 ? 'text-red-700' : 'text-green-700'}`}>{vendor.rentDue.toLocaleString()} UGX</div>
                    </div>
                    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-black uppercase mb-1">Stock Ledger</div>
                        <div className="text-xl font-black">{vendor.productsCount} SKUs</div>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <UserCheck size={18} className="text-slate-400" />
                        <div><p className="text-[10px] text-slate-400 font-bold uppercase">Demographics</p><p className="text-sm font-bold">{vendor.gender} • {vendor.age}y</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Store size={18} className="text-slate-400" />
                        <div><p className="text-[10px] text-slate-400 font-bold uppercase">Store Category</p><p className="text-sm font-bold">{vendor.storeType || 'Retail'}</p></div>
                    </div>
                </div>
               </div>
           ) : activeTab === 'HISTORY' ? (
               <div className="space-y-4 animate-in slide-in-from-right-2">
                   <div className="flex flex-wrap gap-2">
                       <div className="relative flex-1">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                           <input type="text" placeholder="Filter..." className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg outline-none" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} />
                       </div>
                       <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border rounded-lg px-2 bg-white outline-none"><option value="ALL">Status: All</option><option value="PAID">Paid</option><option value="OVERDUE">Overdue</option></select>
                       <button onClick={() => setHistorySort(historySort === 'DATE' ? 'AMOUNT' : 'DATE')} className="p-2 border rounded-lg bg-white text-slate-400 hover:text-indigo-600"><ArrowUpDown size={14}/></button>
                   </div>
                   <div className="border rounded-xl overflow-hidden shadow-inner">
                       <table className="w-full text-xs text-left">
                           <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest sticky top-0 z-10"><tr className="border-b"><th className="px-4 py-3">Transaction ID</th><th className="px-4 py-3">Date</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3">Type</th><th className="px-4 py-3 text-center">Status</th></tr></thead>
                           <tbody className="divide-y divide-slate-50">
                               {filteredTransactions.map(tx => (
                                   <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                       <td className="px-4 py-3 font-mono text-slate-400 uppercase">{tx.reference || tx.id}</td>
                                       <td className="px-4 py-3">{tx.date}</td>
                                       <td className="px-4 py-3 font-black text-right">{tx.amount.toLocaleString()}</td>
                                       <td className="px-4 py-3"><span className="bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-600">{tx.type}</span></td>
                                       <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${tx.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{tx.status}</span></td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           ) : activeTab === 'DOCUMENTS' ? (
              <div className="space-y-4 animate-in slide-in-from-right-2">
                 <div className="p-8 bg-slate-50 rounded-xl border-2 border-dashed text-center">
                    <ShieldCheck size={32} className="mx-auto mb-4 text-indigo-600" />
                    <h4 className="font-bold text-slate-700">KYC Registry</h4>
                    <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">Access verified identity assets.</p>
                    <div className="space-y-2 max-w-xs mx-auto">
                        {['Trading_License.pdf', 'National_ID_Scan.jpg'].map(doc => (
                            <div key={doc} className="flex items-center justify-between p-3 bg-white border rounded-xl group hover:border-indigo-400 cursor-pointer transition-all">
                                <span className="text-xs font-bold text-slate-700">{doc}</span>
                                <Download size={14} className="text-slate-300 group-hover:text-indigo-600" />
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
           ) : (
              <div className="space-y-4 animate-in slide-in-from-right-2">
                  <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2"><StickyNote size={18} /> Admin Notes</h4>
                        {isAdmin && !isEditingNotes && <button onClick={() => setIsEditingNotes(true)} className="text-[10px] font-black uppercase text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm flex items-center gap-2"><Edit3 size={12} /> Edit Notes</button>}
                    </div>

                    {isEditingNotes ? (
                        <div className="space-y-4 animate-in fade-in">
                            <textarea className="w-full p-4 rounded-xl border-2 border-indigo-200 outline-none text-sm min-h-[140px]" value={tempNotes} onChange={(e) => setTempNotes(e.target.value)} placeholder="Administrative flags, audit details..." autoFocus />
                            <div className="flex gap-3"><Button variant="secondary" onClick={() => { setIsEditingNotes(false); setTempNotes(vendor.notes || ''); }} className="flex-1">Cancel</Button><Button onClick={handleSaveNotes} className="flex-1" disabled={isSavingNotes}>{isSavingNotes ? <Loader2 className="animate-spin" size={14}/> : <Save size={14} />} Save & Audit</Button></div>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-indigo-100 min-h-[100px] shadow-sm leading-relaxed whitespace-pre-wrap">{vendor.notes || "No administrative notes recorded."}</div>
                    )}
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2"><ShieldAlert size={14} /> Audit Trail</h5>
                    <div className="space-y-3">
                        {auditLogs.length > 0 ? auditLogs.map(log => (
                            <div key={log.id} className="flex gap-3 items-start text-[11px] border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                <Clock size={12} className="text-slate-400 mt-0.5" />
                                <div><p className="font-bold text-slate-700">[{log.adminId}] modified notes for #{log.targetVendor}</p><p className="text-[10px] text-slate-400">{log.timestamp}</p></div>
                            </div>
                        )) : <p className="text-[10px] text-slate-400 font-bold uppercase italic text-center py-4">No recent audit logs.</p>}
                    </div>
                </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
