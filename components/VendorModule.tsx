
import React, { useState, useMemo, useEffect } from 'react';
import { Vendor, UserRole, ProductCategory } from '../types';
import { MOCK_VENDORS, CITIES, MARKETS } from '../constants';
import { ApiService } from '../services/api';
import { 
  Search, QrCode, CheckCircle, Save, AlertTriangle, UserPlus, Loader2,
  RefreshCcw, Store, ArrowUpDown, ArrowUp, ArrowDown, Calendar, ShieldCheck,
  Play, Ban, X, Download, FileText, Printer, MoreVertical, Check, ListFilter,
  CheckSquare, Square, Filter
} from 'lucide-react';
import { Button } from './ui/Button';
import { VendorDetailsModal } from './VendorDetailsModal';

interface VendorModuleProps {
  userRole?: UserRole;
  currentUserId?: string;
  marketId?: string;
}

export const VendorModule: React.FC<VendorModuleProps> = ({ userRole = UserRole.USER, currentUserId, marketId }) => {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [isLoading, setIsLoading] = useState(false);
  
  // Selection State for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Toolbar Filters & Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(marketId || 'ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [nameSortOrder, setNameSortOrder] = useState<'ASC' | 'DESC' | null>(null);
  
  // Modals
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);
  
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;
  const isMarketAdmin = userRole === UserRole.MARKET_ADMIN;
  const isAdmin = isSuperAdmin || isMarketAdmin;

  const getRentStatus = (vendor: Vendor) => {
    if (vendor.rentDue <= 0) {
      return { 
        label: 'PAID', 
        color: 'bg-emerald-500 shadow-[0_0_8px_#10b981]', 
        text: 'text-emerald-700', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-100' 
      };
    }
    
    const dueDate = vendor.rentDueDate ? new Date(vendor.rentDueDate) : null;
    const isOverdue = dueDate && dueDate < new Date();
    
    if (isOverdue) {
      return { 
        label: 'OVERDUE', 
        color: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]', 
        text: 'text-rose-700', 
        bg: 'bg-rose-50', 
        border: 'border-rose-100' 
      };
    }
    
    return { 
      label: 'PENDING', 
      color: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]', 
      text: 'text-amber-700', 
      bg: 'bg-amber-50', 
      border: 'border-amber-100' 
    };
  };

  const filteredAndSortedVendors = useMemo(() => {
    let result = vendors.filter(v => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = v.name.toLowerCase().includes(term) || v.shopNumber.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
      const matchesMarket = selectedMarket === 'ALL' || v.marketId === selectedMarket;
      const matchesCategory = categoryFilter === 'ALL' || v.storeType === categoryFilter;
      return matchesSearch && matchesStatus && matchesMarket && matchesCategory;
    });

    if (nameSortOrder) {
      result = [...result].sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return nameSortOrder === 'ASC' ? comparison : -comparison;
      });
    }

    return result;
  }, [vendors, searchTerm, statusFilter, categoryFilter, selectedMarket, nameSortOrder]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedVendors.length && filteredAndSortedVendors.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedVendors.map(v => v.id)));
    }
  };

  const handleBulkAction = (action: 'ACTIVATE' | 'SUSPEND') => {
    if (selectedIds.size === 0) return;
    const nextStatus = action === 'ACTIVATE' ? 'ACTIVE' : 'SUSPENDED';
    
    setVendors(prev => prev.map(v => 
      selectedIds.has(v.id) ? { ...v, status: nextStatus as any } : v
    ));
    setSelectedIds(new Set());
    alert(`Bulk Operation Successful: ${selectedIds.size} nodes updated.`);
  };

  const toggleNameSort = () => {
    setNameSortOrder(prev => {
      if (prev === null) return 'ASC';
      if (prev === 'ASC') return 'DESC';
      return null;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-950 text-white rounded-[24px] flex items-center justify-center shadow-2xl ring-4 ring-slate-100">
             <Store size={32} className="text-indigo-400" />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Vendor Ledger</h2>
              <p className="text-slate-500 font-medium text-lg">Real-time triangulation of commercial entities.</p>
           </div>
        </div>
        
        {isAdmin && selectedIds.size > 0 ? (
          <div className="flex gap-2 animate-in slide-in-from-right-4">
             <Button onClick={() => handleBulkAction('ACTIVATE')} className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-emerald-200">
                <Play size={14} className="mr-2"/> Bulk Activate
             </Button>
             <Button onClick={() => handleBulkAction('SUSPEND')} className="bg-slate-950 hover:bg-black h-14 px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl">
                <Ban size={14} className="mr-2"/> Bulk Suspend
             </Button>
          </div>
        ) : isAdmin && (
          <Button className="h-14 px-8 font-black uppercase text-[10px] tracking-[0.2em] bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-100">
            <UserPlus size={18} className="mr-2"/> Register New Node
          </Button>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl flex flex-wrap gap-6 items-end justify-between">
        <div className="flex flex-wrap gap-6 flex-1">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Deep search entity, unit or registry ID..." 
              className="w-full pl-16 pr-8 py-5 rounded-[24px] border-2 border-slate-100 bg-slate-50 font-bold text-sm text-slate-950 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Filter size={10}/> Region</label>
                <select 
                  className="px-6 py-4 border-2 border-slate-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none focus:border-indigo-600 appearance-none min-w-[160px] shadow-sm cursor-pointer" 
                  value={selectedMarket} 
                  onChange={(e) => setSelectedMarket(e.target.value)}
                >
                    <option value="ALL">All Hubs</option>
                    {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><ShieldCheck size={10}/> Integrity</label>
                <select 
                  className="px-6 py-4 border-2 border-slate-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none focus:border-indigo-600 appearance-none min-w-[160px] shadow-sm cursor-pointer" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Operational</option>
                    <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><ListFilter size={10}/> Sector</label>
                <select 
                  className="px-6 py-4 border-2 border-slate-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none focus:border-indigo-600 appearance-none min-w-[160px] shadow-sm cursor-pointer" 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="ALL">All Sectors</option>
                    {Object.values(ProductCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
              </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><ArrowUpDown size={10}/> Ordering</label>
            <button 
                onClick={toggleNameSort}
                className={`px-8 py-4 border-2 rounded-[20px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${nameSortOrder ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
            >
                Alpha {nameSortOrder === 'ASC' ? <ArrowUp size={14}/> : nameSortOrder === 'DESC' ? <ArrowDown size={14}/> : <ArrowUpDown size={14}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Table Node */}
      <div className="bg-white rounded-[48px] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950 text-indigo-400 font-black uppercase text-[11px] tracking-[0.3em] border-b border-slate-900">
              <tr>
                {isAdmin && (
                  <th className="px-10 py-8 w-10">
                    <button onClick={toggleSelectAll} className="text-indigo-400 hover:text-white transition-colors">
                      {selectedIds.size > 0 && selectedIds.size === filteredAndSortedVendors.length ? <CheckSquare size={22}/> : <Square size={22}/>}
                    </button>
                  </th>
                )}
                <th className="px-10 py-8">Entity Cluster</th>
                <th className="px-10 py-8">Registry Unit</th>
                <th className="px-10 py-8">Fiscal Status</th>
                <th className="px-10 py-8">Node State</th>
                <th className="px-10 py-8 text-right">Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedVendors.map(vendor => {
                const rentStatus = getRentStatus(vendor);
                const isSelected = selectedIds.has(vendor.id);
                return (
                  <tr key={vendor.id} className={`hover:bg-indigo-50/40 transition-all group cursor-pointer ${isSelected ? 'bg-indigo-50/60' : ''}`} onClick={() => setSelectedVendor(vendor)}>
                    {isAdmin && (
                      <td className="px-10 py-8" onClick={(e) => { e.stopPropagation(); toggleSelect(vendor.id); }}>
                        <button className={`transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-200 group-hover:text-indigo-300'}`}>
                           {isSelected ? <CheckSquare size={22}/> : <Square size={22}/>}
                        </button>
                      </td>
                    )}
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-950 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-base leading-none">{vendor.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-1.5 tracking-widest flex items-center gap-2">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase">{vendor.storeType || 'GENERAL'}</span>
                        • {vendor.email}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                        <div className="font-mono text-xs font-black text-slate-800 tracking-[0.2em]">#{vendor.shopNumber}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1.5">{vendor.section || 'N/A REGION'}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${rentStatus.color} ${rentStatus.label !== 'PAID' ? 'animate-pulse' : ''}`}></div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${rentStatus.bg} ${rentStatus.text} ${rentStatus.border}`}>
                          {rentStatus.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${vendor.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {vendor.status === 'ACTIVE' ? 'OPERATIONAL' : 'OFFLINE'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3">
                         <button 
                            onClick={(e) => { e.stopPropagation(); setQrModalVendor(vendor); }} 
                            className="p-4 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-[18px] transition-all shadow-sm border border-slate-100"
                            title="Generate Profile QR"
                         >
                           <QrCode size={20} />
                         </button>
                         <button className="p-4 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-[18px] transition-all shadow-sm border border-slate-100">
                           <ArrowUpDown size={20} className="rotate-90" />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAndSortedVendors.length === 0 && (
                  <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="px-10 py-32 text-center text-slate-400">
                         <div className="flex flex-col items-center gap-4">
                            <div className="p-8 bg-slate-50 rounded-[40px] text-slate-200">
                                <Search size={64} />
                            </div>
                            <p className="font-black uppercase tracking-[0.2em] text-xs text-slate-900">Zero Nodes Triangulated</p>
                            <p className="text-sm">No vendors found matching the current registry filters.</p>
                         </div>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {qrModalVendor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[64px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] max-w-sm w-full p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-indigo-600"></div>
            <button onClick={() => setQrModalVendor(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90"><X size={32}/></button>
            
            <div className="mb-10">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl ring-8 ring-white">
                <Store size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Entity Profile</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Registry ID: {qrModalVendor.id}</p>
            </div>

            <div className="bg-slate-950 p-10 rounded-[48px] shadow-2xl mb-12 border-4 border-slate-900 flex flex-col items-center justify-center group">
               <div className="bg-white p-6 rounded-3xl shadow-inner transition-transform group-hover:scale-105 duration-500">
                  <QrCode size={180} className="text-slate-900" />
               </div>
               <p className="text-white mt-6 font-mono font-black tracking-[0.3em] text-sm opacity-60">VAL-MMIS-{qrModalVendor.id.toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Button variant="secondary" className="h-16 rounded-[20px] font-black uppercase text-[10px] tracking-widest border-2"><Printer size={18} className="mr-2"/> Label Tag</Button>
               <Button className="h-16 rounded-[20px] font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-200 bg-indigo-600 border-none"><Download size={18} className="mr-2"/> Digital Key</Button>
            </div>
          </div>
        </div>
      )}

      {selectedVendor && (
        <VendorDetailsModal 
          vendor={selectedVendor} 
          userRole={userRole} 
          onClose={() => setSelectedVendor(null)} 
          onUpdateVendor={(u) => setVendors(prev => prev.map(v => v.id === u.id ? u : v))} 
        />
      )}
    </div>
  );
};
