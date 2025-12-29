import React, { useState } from 'react';
import { Vendor, UserRole, Transaction } from '../types';
import { MOCK_VENDORS, CITIES, MARKETS, MOCK_TRANSACTIONS } from '../constants';
import { 
  Filter, 
  Search, 
  MoreHorizontal, 
  Eye, 
  QrCode, 
  Ban, 
  CheckCircle, 
  DollarSign,
  Gavel,
  Power,
  CreditCard,
  Download,
  AlertOctagon,
  X,
  History,
  ArrowUpDown,
  FileText,
  Save,
  AlertTriangle
} from 'lucide-react';

interface VendorModuleProps {
  userRole?: UserRole;
}

export const VendorModule: React.FC<VendorModuleProps> = ({ userRole = UserRole.USER }) => {
  // Use local state initialized with MOCK data to allow updates
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rentDueFilter, setRentDueFilter] = useState('ALL');
  
  // Modals
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'OVERVIEW' | 'DUES'>('OVERVIEW');
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);

  // Notes Editing State
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  // Dues Sorting & Search State
  const [duesSort, setDuesSort] = useState<'DATE' | 'AMOUNT'>('DATE');
  const [duesFilter, setDuesFilter] = useState('ALL'); // ALL, PENDING, PAID, OVERDUE
  const [duesSearchTerm, setDuesSearchTerm] = useState('');

  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.shopNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesMarket = selectedMarket ? v.marketId === selectedMarket : true;
    
    // City filter logic (indirect relationship via market)
    const market = MARKETS.find(m => m.id === v.marketId);
    const matchesCity = selectedCity ? market?.cityId === selectedCity : true;

    // Rent Range Logic
    let matchesRent = true;
    if (rentDueFilter === '0-50K') matchesRent = v.rentDue >= 0 && v.rentDue <= 50000;
    else if (rentDueFilter === '50K-200K') matchesRent = v.rentDue > 50000 && v.rentDue <= 200000;
    else if (rentDueFilter === '200K+') matchesRent = v.rentDue > 200000;

    return matchesSearch && matchesStatus && matchesMarket && matchesCity && matchesRent;
  });

  const availableMarkets = MARKETS.filter(m => !selectedCity || m.cityId === selectedCity);

  // Get transactions for selected vendor
  const vendorTransactions = selectedVendor 
    ? MOCK_TRANSACTIONS.filter(t => t.entityId === selectedVendor.id)
    : [];
  
  const filteredTransactions = vendorTransactions
    .filter(t => {
        const matchesStatus = duesFilter === 'ALL' || t.status === duesFilter;
        const matchesSearch = !duesSearchTerm || 
            (t.reference?.toLowerCase().includes(duesSearchTerm.toLowerCase()) || 
             t.amount.toString().includes(duesSearchTerm));
        return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
        if (duesSort === 'DATE') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return b.amount - a.amount;
    });

  // --- Handlers ---
  
  const logAuditAction = (action: string, vendorName: string, details: string) => {
    const timestamp = new Date().toISOString();
    // Simulate logging to a backend service
    console.log(`[AUDIT LOG] | Time: ${timestamp} | Admin: ${userRole} | Action: ${action} | Target: ${vendorName} | Details: ${details}`);
  };

  const handleToggleStatus = (vendor: Vendor, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = vendor.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    
    if (confirm(`Are you sure you want to change status of ${vendor.name} to ${newStatus}?`)) {
        setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, status: newStatus } : v));
        logAuditAction('STATUS_CHANGE', vendor.name, `Changed status from ${vendor.status} to ${newStatus}`);
    }
  };
  
  const handleToggleDues = (vendorId: string, vendorName: string, action: 'MARK_PAID' | 'FLAG_AUDIT', e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (action === 'MARK_PAID') {
        if(confirm(`Confirm payment clearance for ${vendorName}?`)) {
            setVendors(prev => prev.map(v => {
                if (v.id === vendorId) return { ...v, rentDue: 0 };
                return v;
            }));
            logAuditAction('DUES_CLEARED', vendorName, 'Marked outstanding rent as PAID');
        }
    } else if (action === 'FLAG_AUDIT') {
        alert(`Vendor ${vendorName} flagged for audit.`);
        logAuditAction('AUDIT_INITIATED', vendorName, 'Flagged vendor account for detailed financial audit');
    }
  };

  const handleShowQR = (vendor: Vendor, e: React.MouseEvent) => {
    e.stopPropagation();
    setQrModalVendor(vendor);
  };

  const handleOpenVendor = (vendor: Vendor) => {
      setSelectedVendor(vendor);
      setActiveModalTab('OVERVIEW');
      setIsEditingNote(false);
      setNoteDraft(vendor.notes || '');
  };

  const handleSaveNote = () => {
      if (!selectedVendor) return;
      
      const updatedVendors = vendors.map(v => v.id === selectedVendor.id ? { ...v, notes: noteDraft } : v);
      setVendors(updatedVendors);
      setSelectedVendor({ ...selectedVendor, notes: noteDraft });
      setIsEditingNote(false);
      logAuditAction('NOTE_UPDATE', selectedVendor.name, 'Updated vendor administrative notes');
  };

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1 overflow-x-auto pb-1 sm:pb-0">
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
            value={selectedCity}
            onChange={(e) => { setSelectedCity(e.target.value); setSelectedMarket(''); }}
          >
            <option value="">All Cities</option>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Conditional Market Dropdown */}
          {selectedCity && (
             <select 
             className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
             value={selectedMarket}
             onChange={(e) => setSelectedMarket(e.target.value)}
           >
             <option value="">All Markets in City</option>
             {availableMarkets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
           </select>
          )}

          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
            value={rentDueFilter}
            onChange={(e) => setRentDueFilter(e.target.value)}
          >
            <option value="ALL">All Rent Ranges</option>
            <option value="0-50K">0 - 50,000 UGX</option>
            <option value="50K-200K">50,000 - 200,000 UGX</option>
            <option value="200K+">200,000+ UGX</option>
          </select>
        </div>
        
        {isAdmin && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-200 whitespace-nowrap">
            + Add Vendor
          </button>
        )}
      </div>

      {/* Vendor Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Vendor Info</th>
                <th className="px-6 py-4 whitespace-nowrap">Shop #</th>
                <th className="px-6 py-4 whitespace-nowrap">Rent Status</th>
                <th className="px-6 py-4 whitespace-nowrap">KYC</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                {isAdmin && <th className="px-6 py-4 text-center whitespace-nowrap">Admin Actions</th>}
                <th className="px-6 py-4 text-right whitespace-nowrap">QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.map(vendor => (
                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleOpenVendor(vendor)}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{vendor.name}</div>
                    <div className="text-xs text-slate-500">{vendor.gender} • {vendor.age} yrs</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{vendor.shopNumber}</td>
                  <td className="px-6 py-4">
                    {vendor.rentDue > 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1.5 rounded-full text-xs font-bold border border-red-100">
                        <AlertTriangle size={12} /> {vendor.rentDue.toLocaleString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full text-xs font-bold border border-green-100">
                        <CheckCircle size={12} /> Paid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {vendor.kycVerified ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <span className="text-amber-500 text-xs font-medium">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vendor.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  
                  {isAdmin && (
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                         <button 
                            onClick={(e) => handleToggleDues(vendor.id, vendor.name, 'MARK_PAID', e)}
                            className={`p-1.5 rounded transition ${vendor.rentDue === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-green-600 hover:bg-green-50'}`}
                            title="Mark Dues as Paid"
                            disabled={vendor.rentDue === 0}
                         >
                           <CreditCard size={16} />
                         </button>
                         <button 
                            onClick={(e) => handleToggleDues(vendor.id, vendor.name, 'FLAG_AUDIT', e)}
                            className="p-1.5 hover:bg-orange-50 rounded text-slate-500 hover:text-orange-600" 
                            title="Flag for Audit"
                         >
                           <Gavel size={16} />
                         </button>
                         <button 
                            onClick={(e) => handleToggleStatus(vendor, e)}
                            className={`p-1.5 rounded transition ${vendor.status === 'ACTIVE' ? 'text-slate-500 hover:text-red-600 hover:bg-red-50' : 'text-slate-500 hover:text-green-600 hover:bg-green-50'}`} 
                            title="Toggle Active Status"
                         >
                           <Power size={16} />
                         </button>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4 text-right">
                     <button 
                        onClick={(e) => handleShowQR(vendor, e)}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                     >
                       <QrCode size={16} className="text-slate-600" />
                     </button>
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                    No vendors found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start shrink-0">
               <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedVendor.name}</h3>
                  <p className="text-sm text-slate-500">ID: {selectedVendor.id}</p>
               </div>
               <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
            </div>
            
            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 gap-6 shrink-0">
                <button 
                    onClick={() => setActiveModalTab('OVERVIEW')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeModalTab === 'OVERVIEW' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveModalTab('DUES')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeModalTab === 'DUES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
                >
                    <History size={14} /> Dues History
                </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
               {activeModalTab === 'OVERVIEW' ? (
                   <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rent Due</div>
                            <div className="text-2xl font-bold text-slate-900">{selectedVendor.rentDue.toLocaleString()} UGX</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Products</div>
                            <div className="text-2xl font-bold text-slate-900">{selectedVendor.productsCount}</div>
                        </div>
                    </div>

                    <div className="bg-yellow-50/50 rounded-lg border border-yellow-100 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <FileText size={16} className="text-yellow-600" /> Admin Notes
                            </h4>
                            {isAdmin && !isEditingNote && (
                                <button onClick={() => setIsEditingNote(true)} className="text-xs text-blue-600 font-bold hover:underline">Edit</button>
                            )}
                        </div>
                        {isEditingNote ? (
                            <div className="space-y-2">
                                <textarea 
                                    className="w-full p-2 text-sm border border-yellow-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    rows={3}
                                    value={noteDraft}
                                    onChange={(e) => setNoteDraft(e.target.value)}
                                    placeholder="Add notes about this vendor..."
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setIsEditingNote(false)} className="text-xs text-slate-500 hover:text-slate-800 font-medium">Cancel</button>
                                    <button onClick={handleSaveNote} className="flex items-center gap-1 text-xs bg-yellow-600 text-white px-2 py-1 rounded font-bold hover:bg-yellow-700">
                                        <Save size={12} /> Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-600 italic">
                                {selectedVendor.notes || "No notes available."}
                            </p>
                        )}
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Quick Actions</h4>
                        <div className="flex gap-2">
                        <button 
                            onClick={() => { setQrModalVendor(selectedVendor); setSelectedVendor(null); }}
                            className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2"
                        >
                            <QrCode size={16}/> Print Shop QR
                        </button>
                        {isAdmin && (
                            <button className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-200">
                            <Ban size={16}/> Suspend
                            </button>
                        )}
                        </div>
                    </div>
                   </>
               ) : (
                   /* DUES / HISTORY TAB */
                   <div className="space-y-4">
                       <div className="flex flex-col sm:flex-row justify-between gap-2">
                           <div className="relative flex-1">
                               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                               <input 
                                   type="text" 
                                   placeholder="Search Ref ID or Amount..." 
                                   className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   value={duesSearchTerm}
                                   onChange={(e) => setDuesSearchTerm(e.target.value)}
                               />
                           </div>
                           <div className="flex gap-2 shrink-0">
                               <button 
                                  onClick={() => setDuesSort(duesSort === 'DATE' ? 'AMOUNT' : 'DATE')}
                                  className="text-xs flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-2 py-1.5 rounded hover:bg-slate-200"
                               >
                                   <ArrowUpDown size={12} /> Sort by {duesSort === 'DATE' ? 'Date' : 'Amount'}
                               </button>
                               <select 
                                  value={duesFilter} 
                                  onChange={(e) => setDuesFilter(e.target.value)}
                                  className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white outline-none"
                               >
                                   <option value="ALL">All Status</option>
                                   <option value="PAID">Paid</option>
                                   <option value="PENDING">Pending</option>
                                   <option value="OVERDUE">Overdue</option>
                               </select>
                           </div>
                       </div>

                       <div className="border border-slate-200 rounded-lg overflow-hidden">
                           <table className="w-full text-xs text-left">
                               <thead className="bg-slate-50 text-slate-500 font-bold">
                                   <tr>
                                       <th className="px-3 py-2">Ref</th>
                                       <th className="px-3 py-2">Date</th>
                                       <th className="px-3 py-2">Type</th>
                                       <th className="px-3 py-2">Amount</th>
                                       <th className="px-3 py-2">Status</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                   {filteredTransactions.map(tx => (
                                       <tr key={tx.id}>
                                           <td className="px-3 py-2 font-mono text-slate-400">{tx.reference || tx.id}</td>
                                           <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{tx.date}</td>
                                           <td className="px-3 py-2 text-slate-700">{tx.type}</td>
                                           <td className="px-3 py-2 font-bold text-slate-800">{tx.amount.toLocaleString()}</td>
                                           <td className="px-3 py-2">
                                               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                   tx.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                   tx.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                                   'bg-amber-100 text-amber-700'
                                               }`}>
                                                   {tx.status}
                                               </span>
                                           </td>
                                       </tr>
                                   ))}
                                   {filteredTransactions.length === 0 && (
                                       <tr>
                                           <td colSpan={5} className="text-center py-4 text-slate-400 italic">No transaction history found.</td>
                                       </tr>
                                   )}
                               </tbody>
                           </table>
                       </div>
                   </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalVendor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in-95 relative">
                <button 
                    onClick={() => setQrModalVendor(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <X size={20} />
                </button>
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{qrModalVendor.name}</h3>
                    <p className="text-sm text-slate-500">Shop: {qrModalVendor.shopNumber}</p>
                </div>
                <div className="bg-white p-4 border-2 border-slate-900 rounded-xl inline-block mb-6">
                     <QrCode size={150} className="text-slate-900" />
                </div>
                <p className="text-xs text-slate-400 mb-6 font-mono break-all">
                    mmis://vendor/{qrModalVendor.id}
                </p>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2">
                    <Download size={18} /> Download Code
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
