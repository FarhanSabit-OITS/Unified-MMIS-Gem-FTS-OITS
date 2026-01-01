import React, { useState } from 'react';
import { Vendor, Transaction, TicketPriority, TicketContext, UserRole } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  X, User, History, FileText, StickyNote, AlertTriangle, Briefcase, 
  Building2, MapPin, Phone, Mail, QrCode, Ban, Search, ArrowUpDown, 
  Banknote, Upload, Download, Save, ShieldAlert, CreditCard, Gavel, Power
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
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DUES' | 'DOCUMENTS' | 'NOTES'>('OVERVIEW');
  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;

  // Dues Tab State
  const [duesSort, setDuesSort] = useState<'DATE' | 'AMOUNT'>('DATE');
  const [duesFilter, setDuesFilter] = useState('ALL');
  const [duesTypeFilter, setDuesTypeFilter] = useState('ALL');
  const [duesSearchTerm, setDuesSearchTerm] = useState('');

  // Admin Notes State
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(vendor.notes || '');

  // Filter Transactions Logic
  const vendorTransactions = MOCK_TRANSACTIONS.filter(t => t.entityId === vendor.id);
  
  const filteredTransactions = vendorTransactions
    .filter(t => {
        const matchesStatus = duesFilter === 'ALL' || t.status === duesFilter;
        const matchesType = duesTypeFilter === 'ALL' || t.type === duesTypeFilter;
        const matchesSearch = !duesSearchTerm || 
            (t.reference?.toLowerCase().includes(duesSearchTerm.toLowerCase()) || 
             t.amount.toString().includes(duesSearchTerm));
        return matchesStatus && matchesType && matchesSearch;
    })
    .sort((a, b) => {
        if (duesSort === 'DATE') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return b.amount - a.amount;
    });

  const handleSaveNote = () => {
      onUpdateVendor({ ...vendor, notes: noteDraft });
      setIsEditingNote(false);
      onAuditAction('NOTE_UPDATE', `Updated notes for ${vendor.name}. Length: ${noteDraft.length} chars.`);
  };

  const getMarketName = (id: string) => {
      // Simple mock look up or pass markets as prop if needed. 
      // For isolation, we can just display the ID or generic text if props aren't drilling deep.
      return id === 'm1' ? 'Nakasero Market' : id === 'm2' ? 'Owino Market' : 'Market';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start shrink-0 bg-slate-50/50">
           <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User size={20} className="text-slate-600" />
                  {vendor.name}
              </h3>
              <div className="flex gap-3 mt-1">
                  <p className="text-xs text-slate-500 font-mono">ID: {vendor.id}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${vendor.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {vendor.status}
                  </span>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
             <X size={20} />
           </button>
        </div>
        
        {/* Modal Tabs */}
        <div className="flex border-b border-slate-100 px-6 gap-6 shrink-0 overflow-x-auto bg-white">
            <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('DUES')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'DUES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <History size={14} /> Dues History
            </button>
            <button 
                onClick={() => setActiveTab('DOCUMENTS')}
                className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'DOCUMENTS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <FileText size={14} /> Documents
            </button>
            {isAdmin && (
              <button 
                  onClick={() => setActiveTab('NOTES')}
                  className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'NOTES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                  <StickyNote size={14} /> Admin Notes
                  {vendor.notes && <div className="w-2 h-2 rounded-full bg-amber-500" />}
              </button>
            )}
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
           {activeTab === 'OVERVIEW' ? (
               <>
                {/* Financial & Stock Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border flex flex-col justify-between ${vendor.rentDue > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                        <div className="flex justify-between items-start">
                            <div className={`text-xs font-bold uppercase tracking-wider ${vendor.rentDue > 0 ? 'text-red-700' : 'text-green-700'}`}>Financial Status</div>
                            {vendor.rentDue > 0 && <AlertTriangle size={14} className="text-red-600" />}
                        </div>
                        <div className="mt-2">
                            <div className={`text-2xl font-black ${vendor.rentDue > 0 ? 'text-red-700' : 'text-green-700'}`}>
                                {vendor.rentDue.toLocaleString()} <span className="text-sm font-normal">UGX</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">Rent Due</div>
                            {vendor.vatDue !== undefined && (
                                <div className="text-xs font-medium text-slate-600 mt-1">
                                    + {vendor.vatDue.toLocaleString()} VAT
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Store Inventory</div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{vendor.productsCount}</div>
                                <div className="text-[10px] text-slate-400">Total Products Listed</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location & Contact */}
                <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg mt-0.5"><Building2 size={16} /></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500">Shop</span>
                                <span className="text-sm font-bold text-slate-900">{vendor.shopNumber}</span>
                                <span className="text-[10px] text-slate-400">{vendor.level || 'Ground Floor'}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg mt-0.5"><MapPin size={16} /></div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500">Market</span>
                                <span className="text-sm font-bold text-slate-900">{getMarketName(vendor.marketId)}</span>
                                <span className="text-[10px] text-slate-400">{vendor.city || 'Kampala'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Phone size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">{vendor.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">{vendor.email || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div>
                    <h4 className="font-semibold text-slate-900 mb-2 text-sm">Quick Actions</h4>
                    <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                        <QrCode size={16}/> Print Shop QR
                    </button>
                    {isAdmin && (
                        <button onClick={() => onToggleStatus(vendor)} className={`flex-1 py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${vendor.status === 'ACTIVE' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                            <Ban size={16}/> {vendor.status === 'ACTIVE' ? 'Suspend Access' : 'Reactivate'}
                        </button>
                    )}
                    </div>
                </div>
               </>
           ) : activeTab === 'DUES' ? (
               /* DUES / HISTORY TAB */
               <div className="space-y-4">
                   <div className="flex flex-col gap-2">
                       <div className="relative flex-1">
                           <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                           <input type="text" placeholder="Search Ref ID or Amount..." className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={duesSearchTerm} onChange={(e) => setDuesSearchTerm(e.target.value)} />
                       </div>
                       <div className="flex gap-2 shrink-0 flex-wrap">
                           <button onClick={() => setDuesSort(duesSort === 'DATE' ? 'AMOUNT' : 'DATE')} className="text-xs flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 whitespace-nowrap">
                               <ArrowUpDown size={12} /> {duesSort === 'DATE' ? 'Date' : 'Amount'}
                            </button>
                           <select value={duesFilter} onChange={(e) => setDuesFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-2 bg-white outline-none flex-1">
                               <option value="ALL">All Status</option>
                               <option value="PAID">Paid</option>
                               <option value="PENDING">Pending</option>
                               <option value="OVERDUE">Overdue</option>
                            </select>
                           <select value={duesTypeFilter} onChange={(e) => setDuesTypeFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-2 bg-white outline-none flex-1">
                               <option value="ALL">All Types</option>
                               <option value="RENT">Rent</option>
                               <option value="VAT">VAT</option>
                               <option value="UTILITY">Utility</option>
                               <option value="FINE">Fine</option>
                           </select>
                       </div>
                   </div>

                   <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                       <table className="w-full text-xs text-left">
                           <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 shadow-sm border-b border-slate-200">
                               <tr>
                                   <th className="px-3 py-3">Ref ID</th>
                                   <th className="px-3 py-3">Date</th>
                                   <th className="px-3 py-3">Type</th>
                                   <th className="px-3 py-3 text-right">Amount</th>
                                   <th className="px-3 py-3 text-center">Status</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                               {filteredTransactions.map(tx => (
                                   <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                       <td className="px-3 py-2 font-mono text-slate-500 font-medium">{tx.reference || tx.id}</td>
                                       <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{tx.date}</td>
                                       <td className="px-3 py-2 text-slate-700">
                                           <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-600">{tx.type}</span>
                                       </td>
                                       <td className="px-3 py-2 font-bold text-slate-800 text-right">{tx.amount.toLocaleString()}</td>
                                       <td className="px-3 py-2 text-center">
                                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                               tx.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                               tx.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                           }`}>
                                               {tx.status}
                                           </span>
                                       </td>
                                   </tr>
                               ))}
                               {filteredTransactions.length === 0 && (
                                   <tr><td colSpan={5} className="text-center py-8 text-slate-400 italic"><Banknote size={24} className="mx-auto mb-2 opacity-20"/>No transaction history found.</td></tr>
                               )}
                           </tbody>
                       </table>
                   </div>
               </div>
           ) : activeTab === 'NOTES' && isAdmin ? (
              /* ADMIN NOTES TAB */
              <div className="space-y-4">
                  <div className="bg-amber-50/50 rounded-lg border border-amber-100 p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><FileText size={16} className="text-amber-600" /> Administrative Records</h4>
                        {!isEditingNote && <button onClick={() => setIsEditingNote(true)} className="text-xs text-blue-600 font-bold hover:underline">Edit Notes</button>}
                    </div>
                    {isEditingNote ? (
                        <div className="space-y-2">
                            <textarea className="w-full p-3 text-sm border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[150px] shadow-sm resize-none" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Add notes regarding vendor compliance, special requests, or behavioral flags..." autoFocus />
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => { setIsEditingNote(false); setNoteDraft(vendor.notes || ''); }} className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1">Cancel</button>
                                <button onClick={handleSaveNote} className="flex items-center gap-1 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-amber-700 shadow-sm transition-colors"><Save size={12} /> Save Note</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-700 bg-white p-4 rounded-lg border border-amber-100 min-h-[100px] whitespace-pre-wrap leading-relaxed shadow-sm">
                            {vendor.notes || <span className="text-slate-400 italic">No administrative notes available for this vendor. Click edit to add one.</span>}
                        </div>
                    )}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-100 text-[10px] text-amber-700/60 font-medium"><ShieldAlert size={12} /> Changes to these notes are logged in the system audit trail.</div>
                </div>
              </div>
           ) : (
              /* DOCUMENTS TAB */
              <div className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                    <h4 className="text-sm font-bold text-slate-700">Vendor Documents</h4>
                    <p className="text-xs text-slate-500 mb-4">KYC verification documents and licenses.</p>
                 </div>
                 <div className="space-y-2">
                    {/* Mock Documents */}
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-100 transition-colors"><FileText size={18} /></div>
                            <div>
                                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Trading_License_2023.pdf</div>
                                <div className="text-xs text-slate-500">Uploaded on 2023-01-15</div>
                            </div>
                        </div>
                        <button className="text-slate-300 hover:text-blue-600"><Download size={16}/></button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100 transition-colors"><FileText size={18} /></div>
                            <div>
                                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">National_ID_Scan.jpg</div>
                                <div className="text-xs text-slate-500">Uploaded on 2023-01-10</div>
                            </div>
                        </div>
                        <button className="text-slate-300 hover:text-blue-600"><Download size={16}/></button>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};