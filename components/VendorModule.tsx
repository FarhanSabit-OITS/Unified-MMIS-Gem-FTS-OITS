
import React, { useState, useMemo } from 'react';
import { Vendor, UserRole, ProductCategory } from '../types';
import { MOCK_VENDORS, MARKETS } from '../constants';
import { 
  Search, QrCode, UserPlus, Store, ArrowUpDown, ArrowUp, ArrowDown, 
  ShieldCheck, Play, Ban, X, Download, Printer, Filter, 
  CheckSquare, Square, DollarSign, ListFilter, MoreVertical,
  Building2, MapPin, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from './ui/Button';
import { VendorDetailsModal } from './VendorDetailsModal';

interface VendorModuleProps {
  userRole?: UserRole;
  currentUserId?: string;
  marketId?: string;
}

export const VendorModule: React.FC<VendorModuleProps> = ({ 
  userRole = UserRole.USER, 
  currentUserId, 
  marketId 
}) => {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  
  // Selection State for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Toolbar Filters & Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(marketId || 'ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [nameSortOrder, setNameSortOrder] = useState<'ASC' | 'DESC' | null>(null);
  const [rentSortOrder, setRentSortOrder] = useState<'LOW_HIGH' | 'HIGH_LOW' | null>(null);
  
  // Modals
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);
  
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;
  const isMarketAdmin = userRole === UserRole.MARKET_ADMIN;
  const isAdmin = isSuperAdmin || isMarketAdmin;

  // Helper to calculate status visual metadata
  const getRentStatus = (vendor: Vendor) => {
    if (vendor.rentDue <= 0) {
      return { 
        label: 'PAID', 
        color: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]', 
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
        color: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]', 
        text: 'text-rose-700', 
        bg: 'bg-rose-50', 
        border: 'border-rose-100' 
      };
    }
    
    return { 
      label: 'PENDING', 
      color: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]', 
      text: 'text-amber-700', 
      bg: 'bg-amber-50', 
      border: 'border-amber-100' 
    };
  };

  // Complex Filtering & Sorting logic implementing RBAC isolation
  const filteredAndSortedVendors = useMemo(() => {
    let result = vendors.filter(v => {
      // Market Admin Isolation: Only see vendors in their hub
      if (isMarketAdmin && v.marketId !== marketId) return false;
      
      const term = searchTerm.toLowerCase();
      const matchesSearch = v.name.toLowerCase().includes(term) || v.shopNumber.toLowerCase().includes(term) || v.id.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
      
      // If we are super admin, we can filter by market. If example 'm1' is needed:
      const matchesMarket = selectedMarket === 'ALL' || v.marketId === selectedMarket;
      const matchesCategory = categoryFilter === 'ALL' || v.storeType === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesMarket && matchesCategory;
    });

    // Primary Sort: Rent Magnitude
    if (rentSortOrder) {
      result = [...result].sort((a, b) => {
        return rentSortOrder === 'LOW_HIGH' ? a.rentDue - b.rentDue : b.rentDue - a.rentDue;
      });
    } 
    // Secondary Sort: Alphabetical
    else if (nameSortOrder) {
      result = [...result].sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return nameSortOrder === 'ASC' ? comparison : -comparison;
      });
    }

    return result;
  }, [vendors, searchTerm, statusFilter, categoryFilter, selectedMarket, nameSortOrder, rentSortOrder, isMarketAdmin, marketId]);

  // Handler: Individual Selection
  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Handler: Select All
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedVendors.length && filteredAndSortedVendors.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedVendors.map(v => v.id)));
    }
  };

  // Handler: Bulk Status Updates
  const handleBulkAction = (action: 'ACTIVATE' | 'SUSPEND') => {
    if (selectedIds.size === 0) return;
    const nextStatus = action === 'ACTIVATE' ? 'ACTIVE' : 'SUSPENDED';
    
    setVendors(prev => prev.map(v => 
      selectedIds.has(v.id) ? { ...v, status: nextStatus as any } : v
    ));
    setSelectedIds(new Set());
    alert(`Bulk Registry Update: ${selectedIds.size} entities transitioned to ${nextStatus}.`);
  };

  const toggleNameSort = () => {
    setRentSortOrder(null);
    setNameSortOrder(prev => {
      if (prev === null) return 'ASC';
      if (prev === 'ASC') return 'DESC';
      return null;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-24">
      {/* Dynamic Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-slate-950 text-white rounded-[32px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50 group hover:scale-105 transition-transform duration-500">
             <Store size={36} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Vendor Ledger</h2>
              <div className="flex items-center gap-3 mt-3">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                    <ShieldCheck size={12}/> {isSuperAdmin ? 'Global Registry' : `Hub: ${marketId || 'm1'}`}
                 </span>
                 <p className="text-slate-400 font-bold text-sm">Entity Monitor v2.1</p>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isAdmin && selectedIds.size > 0 && (
            <div className="flex gap-2 animate-in slide-in-from-right-4">
               <button 
                  onClick={() => handleBulkAction('ACTIVATE')} 
                  className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95"
               >
                  <Play size={16}/> Activate All ({selectedIds.size})
               </button>
               <button 
                  onClick={() => handleBulkAction('SUSPEND')} 
                  className="flex items-center gap-3 bg-slate-950 hover:bg-black text-white px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
               >
                  <Ban size={16}/> Suspend All ({selectedIds.size})
               </button>
            </div>
          )}
          {isAdmin && (
            <Button className="h-14 px-10 font-black uppercase text-[11px] tracking-[0.2em] bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-100 rounded-2xl">
              <UserPlus size={20} className="mr-3"/> Register Entity
            </Button>
          )}
        </div>
      </div>

      {/* Control Block */}
      <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-xl space-y-8">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="relative flex-1 min-w-[320px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
            <input 
              type="text" 
              placeholder="Search entity name, shop ID, or registry node..." 
              className="w-full pl-16 pr-8 py-5 rounded-[28px] border-4 border-slate-50 bg-slate-50 font-bold text-sm text-slate-950 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Building2 size={10}/> Market Hub</label>
                <select 
                  className={`px-6 py-4 border-2 border-slate-100 rounded-[22px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none focus:border-indigo-600 appearance-none min-w-[180px] shadow-sm cursor-pointer hover:bg-white transition-all ${!isSuperAdmin ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`} 
                  value={selectedMarket} 
                  disabled={!isSuperAdmin}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                >
                    <option value="ALL">All Hubs</option>
                    {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><DollarSign size={10}/> Rent Sort</label>
                <select 
                  className={`px-6 py-4 border-2 rounded-[22px] text-[10px] font-black uppercase tracking-widest outline-none appearance-none min-w-[180px] shadow-sm cursor-pointer transition-all ${rentSortOrder ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white'}`}
                  value={rentSortOrder || 'NONE'} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setRentSortOrder(val === 'NONE' ? null : val as any);
                    setNameSortOrder(null);
                  }}
                >
                    <option value="NONE" className="text-slate-900 bg-white">Unsorted</option>
                    <option value="LOW_HIGH" className="text-slate-900 bg-white">Arrears: Low → High</option>
                    <option value="HIGH_LOW" className="text-slate-900 bg-white">Arrears: High → Low</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><ArrowUpDown size={10}/> Alpha Sort</label>
                <button 
                    onClick={toggleNameSort}
                    className={`px-8 py-4 border-2 rounded-[22px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all h-[52px] ${nameSortOrder ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white'}`}
                >
                    {nameSortOrder === 'ASC' ? <ArrowUp size={16}/> : nameSortOrder === 'DESC' ? <ArrowDown size={16}/> : <ArrowUpDown size={16}/>}
                    Sort
                </button>
              </div>
          </div>
        </div>
      </div>

      {/* Main Table Ledger */}
      <div className="bg-white rounded-[64px] border border-slate-200 shadow-2xl overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950 text-indigo-400 font-black uppercase text-[11px] tracking-[0.4em] border-b border-slate-900">
              <tr>
                {isAdmin && (
                  <th className="px-10 py-10 w-10">
                    <button onClick={toggleSelectAll} className="text-indigo-400 hover:text-white transition-colors">
                      {selectedIds.size > 0 && selectedIds.size === filteredAndSortedVendors.length ? <CheckSquare size={24}/> : <Square size={24}/>}
                    </button>
                  </th>
                )}
                <th className="px-10 py-10">Entity Profile</th>
                <th className="px-10 py-10">Allocation</th>
                <th className="px-10 py-10">Fiscal Status</th>
                <th className="px-10 py-10">State</th>
                <th className="px-10 py-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedVendors.map(vendor => {
                const rentStatus = getRentStatus(vendor);
                const isSelected = selectedIds.has(vendor.id);
                return (
                  <tr key={vendor.id} className={`hover:bg-indigo-50/40 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600 ${isSelected ? 'bg-indigo-50/60 border-l-indigo-600' : ''}`} onClick={() => setSelectedVendor(vendor)}>
                    {isAdmin && (
                      <td className="px-10 py-8" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => toggleSelect(vendor.id, e)} className={`transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-200 group-hover:text-indigo-300'}`}>
                           {isSelected ? <CheckSquare size={24}/> : <Square size={24}/>}
                        </button>
                      </td>
                    )}
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-950 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-base leading-none">{vendor.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-2 tracking-widest flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded uppercase">{vendor.storeType || 'GENERAL'}</span>
                        • {vendor.email}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                        <div className="font-mono text-xs font-black text-slate-800 tracking-[0.2em] group-hover:text-indigo-600 transition-colors">#{vendor.shopNumber}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2 flex items-center gap-1.5">
                           <MapPin size={10}/> {vendor.section || 'General'}
                        </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${rentStatus.color} ${rentStatus.label === 'OVERDUE' ? 'animate-pulse' : ''}`}></div>
                          <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border-2 transition-all group-hover:scale-105 ${rentStatus.bg} ${rentStatus.text} ${rentStatus.border}`}>
                            {rentStatus.label}
                          </span>
                        </div>
                        {vendor.rentDue > 0 && (
                          <span className="text-[11px] font-black text-slate-400 ml-1 tracking-tighter">UGX {vendor.rentDue.toLocaleString()} Arrears</span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border-2 transition-all group-hover:scale-105 ${vendor.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {vendor.status === 'ACTIVE' ? 'OPERATIONAL' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-3">
                         <button 
                            onClick={() => setQrModalVendor(vendor)} 
                            className="p-4 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-[22px] transition-all shadow-sm border border-slate-100 group/qr active:scale-90"
                            title="Generate Store Profile QR"
                         >
                           <QrCode size={20} className="group-hover/qr:scale-110 transition-transform" />
                         </button>
                         <button className="p-4 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-[22px] transition-all shadow-sm border border-slate-100 active:scale-90" title="More Options">
                           <MoreVertical size={20} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Profile QR Modal */}
      {qrModalVendor && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-[72px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] max-w-sm w-full p-16 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
            <button onClick={() => setQrModalVendor(null)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-950 transition-all hover:rotate-90 duration-500"><X size={44}/></button>
            
            <div className="mb-12">
              <div className="w-28 h-28 bg-indigo-50 text-indigo-600 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl ring-[12px] ring-white group-hover:scale-110 transition-transform duration-700">
                <Store size={56} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Entity Node</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{qrModalVendor.name}</p>
            </div>

            <div className="bg-slate-950 p-12 rounded-[56px] shadow-2xl mb-12 border-4 border-slate-900 flex flex-col items-center justify-center transition-all hover:scale-[1.02] duration-700">
               <div className="bg-white p-8 rounded-[40px] shadow-inner relative z-10">
                  <QrCode size={200} className="text-slate-900" />
                  <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay"></div>
               </div>
               <p className="text-indigo-400 mt-10 font-mono font-black tracking-[0.4em] text-sm opacity-80 uppercase leading-none">REG-MMIS-{qrModalVendor.id.toUpperCase()}</p>
               <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 font-black text-[9px] uppercase tracking-[0.3em]">
                  <ShieldCheck size={14} className="text-emerald-500" /> Registry Verified
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Button variant="secondary" className="h-20 rounded-3xl font-black uppercase text-[10px] tracking-widest border-4 border-slate-50 shadow-sm transition-all hover:bg-slate-50 active:scale-95"><Printer size={22} className="mr-3 text-indigo-500"/> Thermal</Button>
               <Button className="h-20 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-[0_20px_40px_rgba(79,70,229,0.3)] bg-indigo-600 border-none transition-all hover:-translate-y-1 active:scale-95"><Download size={22} className="mr-3"/> Digital Key</Button>
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
