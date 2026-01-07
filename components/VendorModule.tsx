
import React, { useState, useMemo } from 'react';
import { Vendor, UserRole, ProductCategory } from '../types';
import { MOCK_VENDORS, MARKETS } from '../constants';
import { 
  Search, QrCode, UserPlus, Store, ArrowUpDown, 
  ShieldCheck, Play, Ban, X, Download, Printer, Filter, 
  CheckSquare, Square, DollarSign, ListFilter, MoreVertical,
  Building2, MapPin, User, ChevronDown, ExternalLink, Trash2,
  AlertCircle, CheckCircle2, FileJson, CalendarCheck, CreditCard,
  SortAsc, SortDesc
} from 'lucide-react';
import { Button } from './ui/Button';
import { VendorDetailsModal } from './VendorDetailsModal';

interface VendorModuleProps {
  userRole?: UserRole;
  currentUserId?: string;
  marketId?: string;
}

type SortConfig = {
  key: 'market' | 'name' | 'rent' | null;
  direction: 'asc' | 'desc';
};

export const VendorModule: React.FC<VendorModuleProps> = ({ 
  userRole = UserRole.USER, 
  currentUserId, 
  marketId 
}) => {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;
  const isMarketAdmin = userRole === UserRole.MARKET_ADMIN;
  const isAdmin = isSuperAdmin || isMarketAdmin;
  
  // Market filtering logic
  const initialMarket = isMarketAdmin ? marketId : 'ALL';
  const [selectedMarket, setSelectedMarket] = useState(initialMarket || 'ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);

  // Computed: Filtered and Sorted list for display and bulk logic
  const filteredVendors = useMemo(() => {
    let result = vendors.filter(v => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = v.name.toLowerCase().includes(term) || v.shopNumber.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
      
      let matchesMarket = true;
      if (isMarketAdmin) {
        matchesMarket = v.marketId === marketId;
      } else {
        matchesMarket = selectedMarket === 'ALL' || v.marketId === selectedMarket;
      }
      
      return matchesSearch && matchesStatus && matchesMarket;
    });

    // Enhanced Relational Sorting Logic
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortConfig.key === 'market') {
          // Sort by Market NAME instead of ID for better UX
          valA = MARKETS.find(m => m.id === a.marketId)?.name || '';
          valB = MARKETS.find(m => m.id === b.marketId)?.name || '';
        } else if (sortConfig.key === 'rent') {
          valA = a.rentDue;
          valB = b.rentDue;
        } else {
          valA = a.name;
          valB = b.name;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [vendors, searchTerm, statusFilter, selectedMarket, isMarketAdmin, marketId, sortConfig]);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportToCSV = () => {
    // Column Headers
    const headers = [
      'Registry ID', 
      'Vendor Name', 
      'Shop Number', 
      'Market Hub', 
      'Category',
      'Operational Status', 
      'Current Rent Arrears (UGX)', 
      'Due Date',
      'Contact Email',
      'Phone Number'
    ];

    // Map through the CURRENTLY FILTERED list
    const rows = filteredVendors.map(v => [
      v.id,
      `"${v.name}"`, // Quote strings to prevent issues with commas in names
      v.shopNumber,
      `"${MARKETS.find(m => m.id === v.marketId)?.name || 'Unknown'}"`,
      v.storeType || 'N/A',
      v.status,
      v.rentDue,
      v.rentDueDate || 'N/A',
      v.email || 'N/A',
      v.phone || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mmis_vendor_registry_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Selection Logic
  const isAllSelected = useMemo(() => {
    return filteredVendors.length > 0 && filteredVendors.every(v => selectedIds.has(v.id));
  }, [filteredVendors, selectedIds]);

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) {
      filteredVendors.forEach(v => next.delete(v.id));
    } else {
      filteredVendors.forEach(v => next.add(v.id));
    }
    setSelectedIds(next);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = (action: 'ACTIVATE' | 'SUSPEND' | 'DELETE' | 'MARK_PAID' | 'SET_DUE_DATE') => {
    if (selectedIds.size === 0) return;

    if (action === 'DELETE') {
      if (!isSuperAdmin) {
        alert("RBAC SECURITY: Mass Registry Nullification is exclusive to Super Admin level.");
        return;
      }
      if (!confirm(`CAUTION: Permanently purge ${selectedIds.size} entities from the registry? This action is irreversible.`)) return;
      setVendors(prev => prev.filter(v => !selectedIds.has(v.id)));
    } else if (action === 'MARK_PAID') {
      if (!confirm(`Confirm: Mark rent as PAID for ${selectedIds.size} selected vendors?`)) return;
      setVendors(prev => prev.map(v => selectedIds.has(v.id) ? { ...v, rentDue: 0 } : v));
    } else if (action === 'SET_DUE_DATE') {
      const date = prompt('Input Global Rent Due Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
      if (!date) return;
      setVendors(prev => prev.map(v => selectedIds.has(v.id) ? { ...v, rentDueDate: date } : v));
    } else {
      // Handle SUSPEND or ACTIVATE
      const nextStatus = action === 'ACTIVATE' ? 'ACTIVE' : 'SUSPENDED';
      if (!confirm(`Confirm: Change status to ${nextStatus} for ${selectedIds.size} vendors?`)) return;
      
      setVendors(prev => prev.map(v => selectedIds.has(v.id) ? { ...v, status: nextStatus as any } : v));
    }
    
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-32">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-slate-950 text-white rounded-[32px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
             <Store size={36} className="text-indigo-400" />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Vendor Registry</h2>
              <div className="flex items-center gap-3 mt-3">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                    <ShieldCheck size={12}/> {isSuperAdmin ? 'Global Treasury' : `Hub Terminal: ${marketId}`}
                 </span>
                 <p className="text-slate-400 font-bold text-sm tracking-tight uppercase tracking-widest">Node Operations Matrix</p>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={exportToCSV}
            className="h-14 px-8 border-2 font-black uppercase text-[11px] tracking-widest rounded-2xl bg-white transition-all hover:bg-slate-50 flex items-center gap-3 shadow-sm group"
          >
            <Download size={18} className="text-indigo-600 group-hover:scale-110 transition-transform"/> Export manifest (CSV)
          </Button>
          {isAdmin && (
            <Button className="h-14 px-10 font-black uppercase text-[11px] tracking-[0.2em] bg-indigo-600 hover:bg-indigo-700 shadow-2xl rounded-2xl transition-all active:scale-95">
              <UserPlus size={20} className="mr-3"/> Enroll Entity
            </Button>
          )}
        </div>
      </div>

      {/* Control Surface */}
      <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-xl space-y-8">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="relative flex-1 min-w-[320px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
            <input 
              type="text" 
              placeholder="Query node identity, unit, or UID..." 
              className="w-full pl-16 pr-8 py-5 rounded-[28px] border-4 border-slate-50 bg-slate-50 font-bold text-sm text-slate-950 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Scope Filter</label>
                <div className="relative group">
                  <select 
                    disabled={isMarketAdmin}
                    className={`px-6 py-4 border-2 border-slate-100 rounded-[22px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none appearance-none transition-all min-w-[240px] cursor-pointer ${isMarketAdmin ? 'opacity-50 grayscale' : 'group-hover:border-indigo-600 hover:bg-white'}`}
                    value={selectedMarket} 
                    onChange={(e) => setSelectedMarket(e.target.value)}
                  >
                      {isSuperAdmin && <option value="ALL">Global Registry View</option>}
                      {MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-600 transition-colors" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Status</label>
                <div className="relative group">
                  <select 
                    className="px-6 py-4 border-2 border-slate-100 rounded-[22px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none appearance-none transition-all min-w-[180px] cursor-pointer group-hover:border-indigo-600 hover:bg-white"
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                      <option value="ALL">All States</option>
                      <option value="ACTIVE">Active Nodes</option>
                      <option value="SUSPENDED">Suspended</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Registry Matrix */}
      <div className="bg-white rounded-[64px] border border-slate-200 shadow-2xl overflow-hidden relative">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-950 text-indigo-400 font-black uppercase text-[11px] tracking-[0.4em] border-b border-slate-900">
            <tr>
              <th className="px-10 py-10 w-10">
                <button 
                  onClick={toggleSelectAll}
                  className={`transition-all ${isAllSelected ? 'text-white' : 'text-indigo-400 hover:text-white'}`}
                >
                  {isAllSelected ? <CheckSquare size={24}/> : <Square size={24}/>}
                </button>
              </th>
              <th className="px-10 py-10 cursor-pointer group select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">
                  Registry Node
                  <span className="transition-opacity group-hover:opacity-100 opacity-40">
                    {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? <SortAsc size={14} className="text-white"/> : <SortDesc size={14} className="text-white"/>) : <ArrowUpDown size={14}/>}
                  </span>
                </div>
              </th>
              <th className="px-10 py-10 cursor-pointer group select-none" onClick={() => handleSort('market')}>
                <div className="flex items-center gap-2">
                  Unit & Hub
                  <span className="transition-opacity group-hover:opacity-100 opacity-40">
                    {sortConfig.key === 'market' ? (sortConfig.direction === 'asc' ? <SortAsc size={14} className="text-white"/> : <SortDesc size={14} className="text-white"/>) : <ArrowUpDown size={14}/>}
                  </span>
                </div>
              </th>
              <th className="px-10 py-10">Status</th>
              <th className="px-10 py-10 text-right">Node Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVendors.map(vendor => {
              const isSelected = selectedIds.has(vendor.id);
              return (
                <tr 
                  key={vendor.id} 
                  className={`hover:bg-indigo-50/40 transition-all group cursor-pointer border-l-4 ${isSelected ? 'bg-indigo-50/60 border-l-indigo-600' : 'border-l-transparent'}`} 
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <td className="px-10 py-8" onClick={(e) => toggleSelect(vendor.id, e)}>
                    <button className={`transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-200 group-hover:text-indigo-300'}`}>
                       {isSelected ? <CheckSquare size={24}/> : <Square size={24}/>}
                    </button>
                  </td>
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-950 uppercase tracking-tight text-base leading-none group-hover:text-indigo-600 transition-colors">{vendor.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-2 tracking-widest uppercase flex items-center gap-2">
                      <User size={10} className="text-indigo-300"/> ID: {vendor.id}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                      <div className="font-mono text-xs font-black text-slate-800 tracking-[0.2em]">#{vendor.shopNumber}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2 flex items-center gap-1.5">
                         <MapPin size={10} className="text-rose-400"/> {MARKETS.find(m => m.id === vendor.marketId)?.name}
                      </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border-2 transition-all ${vendor.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {vendor.status}
                     </span>
                  </td>
                  <td className="px-10 py-8 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setQrModalVendor(vendor)}
                        className="flex items-center gap-3 ml-auto px-6 py-3 bg-slate-950 hover:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg group/qr"
                      >
                        <QrCode size={16} className="group-hover/qr:scale-110 transition-transform" />
                        <span>Issue Token</span>
                      </button>
                  </td>
                </tr>
              );
            })}
            {filteredVendors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-10 py-32 text-center text-slate-400 bg-slate-50/50">
                  <Store size={64} className="mx-auto mb-6 opacity-10" />
                  <p className="font-black uppercase tracking-[0.4em] text-sm text-slate-950">No Entities Triangulated</p>
                  <p className="text-xs font-bold uppercase tracking-widest mt-2">Adjust registry filters or search parameters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-5xl px-4 animate-in slide-in-from-bottom-10">
           <div className="bg-slate-950 text-white rounded-[32px] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-4 border-slate-900 flex items-center justify-between gap-8">
              <div className="flex items-center gap-6 pl-4 border-l-4 border-indigo-600">
                 <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                    {selectedIds.size}
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Entities Selected</p>
                    <p className="text-sm font-bold text-slate-400">Perform Mass Ledger Transition</p>
                 </div>
              </div>

              <div className="flex gap-2">
                 <button 
                  onClick={() => handleBulkAction('ACTIVATE')}
                  className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                  title="Activate All"
                 >
                    <Play size={16}/> Activate
                 </button>
                 <button 
                  onClick={() => handleBulkAction('SUSPEND')}
                  className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                  title="Suspend All"
                 >
                    <Ban size={16}/> Suspend
                 </button>
                 
                 <button 
                  onClick={() => handleBulkAction('SET_DUE_DATE')}
                  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                  title="Set Rent Cycle"
                 >
                    <CalendarCheck size={16}/> Cycle
                 </button>
                 <button 
                  onClick={() => handleBulkAction('MARK_PAID')}
                  className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                  title="Bulk Payment Sync"
                 >
                    <CreditCard size={16}/> Paid
                 </button>

                 {isSuperAdmin && (
                   <button 
                    onClick={() => handleBulkAction('DELETE')}
                    className="flex items-center gap-3 bg-rose-600 hover:bg-rose-700 px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                    title="Purge Selection"
                   >
                      <Trash2 size={16}/> Purge
                   </button>
                 )}
                 <div className="w-px bg-slate-800 h-10 mx-2 self-center"></div>
                 <button 
                  onClick={() => setSelectedIds(new Set())}
                  className="p-4 hover:bg-slate-900 text-slate-500 hover:text-white rounded-2xl transition-colors"
                 >
                    <X size={24}/>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* QR Modal (Unchanged) */}
      {qrModalVendor && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-[72px] shadow-2xl max-w-md w-full p-16 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
              <button onClick={() => setQrModalVendor(null)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-950 transition-all hover:rotate-90 duration-500"><X size={44}/></button>
              
              <div className="mb-12">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl ring-8 ring-white">
                  <ShieldCheck size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Operator Token</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{qrModalVendor.name}</p>
              </div>

              <div className="bg-slate-950 p-12 rounded-[56px] shadow-2xl mb-12 border-4 border-slate-900 flex flex-col items-center justify-center">
                 <div className="bg-white p-6 rounded-[40px] shadow-inner relative z-10">
                    <QrCode size={180} className="text-slate-900" />
                 </div>
                 <p className="text-indigo-400 mt-10 font-mono font-black tracking-[0.4em] text-sm uppercase">KEY-{qrModalVendor.id.toUpperCase()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Button variant="secondary" className="h-16 rounded-3xl font-black uppercase text-[10px] tracking-widest border-4 border-slate-50 hover:bg-slate-50 transition-all"><Printer size={18} className="mr-3"/> Print</Button>
                 <Button className="h-16 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl bg-indigo-600 border-none transition-all active:scale-95"><Download size={18} className="mr-3"/> Export</Button>
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
