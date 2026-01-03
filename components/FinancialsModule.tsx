
import React, { useState, useMemo } from 'react';
import { UserRole, Transaction, PaymentType } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  Download, Wallet, History, ShieldCheck, 
  Search, ArrowUpDown, Receipt, Landmark, 
  CheckCircle, AlertTriangle, SortAsc, SortDesc,
  Filter, Calendar, DollarSign, LayoutGrid, Info
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface FinancialsModuleProps {
  role: UserRole;
  marketId?: string;
  userId?: string;
}

export const FinancialsModule: React.FC<FinancialsModuleProps> = ({ role, marketId, userId = 'v1' }) => {
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;
  const isMarketAdmin = role === UserRole.MARKET_ADMIN;
  const isAdmin = isSuperAdmin || isMarketAdmin;
  const isVendor = role === UserRole.VENDOR;
  const isSupplier = role === UserRole.SUPPLIER;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE' | 'ESCROW' | 'FLAGGED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  // Filtered Ledger Logic (Role-Based Isolation)
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      // 1. RBAC Isolation
      if (isVendor) {
        // Vendors only see their own transactions (Rent, Utility, VAT, Fines)
        if (tx.entityId !== userId) return false;
      } else if (isSupplier) {
        // Suppliers only see their own transactions (Escrow, Service Charges)
        if (tx.entityId !== userId) return false;
      } else if (isMarketAdmin) {
        // Market Admins only see transactions within their market
        if (tx.marketId !== marketId) return false;
      }
      // Super Admin sees all

      // 2. Search Filter
      const term = searchTerm.toLowerCase();
      const matchesSearch = tx.id.toLowerCase().includes(term) || 
                           (tx.reference && tx.reference.toLowerCase().includes(term)) ||
                           (tx.description && tx.description.toLowerCase().includes(term));
      
      // 3. Status Filter
      const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
      
      // 4. Type Filter
      const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;

      // 5. Date Filter
      const matchesDate = (!dateFilter.start || tx.date >= dateFilter.start) &&
                          (!dateFilter.end || tx.date <= dateFilter.end);
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    }).sort((a, b) => {
      // 6. Sort Logic
      const valA = sortField === 'date' ? new Date(a.date).getTime() : a.amount;
      const valB = sortField === 'date' ? new Date(b.date).getTime() : b.amount;
      return sortOrder === 'ASC' ? valA - valB : valB - valA;
    });
  }, [searchTerm, statusFilter, typeFilter, sortField, sortOrder, isVendor, isSupplier, isMarketAdmin, marketId, userId, dateFilter]);

  // Dynamic Statistics Node
  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const paid = filteredTransactions.filter(t => t.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
    const arrears = filteredTransactions.filter(t => t.status === 'OVERDUE' || t.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
    const escrow = filteredTransactions.filter(t => t.status === 'ESCROW').reduce((acc, curr) => acc + curr.amount, 0);
    return { total, paid, arrears, escrow };
  }, [filteredTransactions]);

  return (
    <div className="space-y-10 animate-in fade-in pb-24">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-slate-200">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-slate-950 text-white rounded-[32px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50 group">
             <Wallet size={40} className="text-indigo-400 group-hover:scale-110 transition-transform" />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">Fiscal Terminal</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                   <Landmark size={12}/> {isSuperAdmin ? 'Central Bank' : `Hub: ${marketId || 'N/A'}`}
                </span>
                <span className="text-slate-400 font-bold text-sm tracking-tight">Financial Registry Operational</span>
              </div>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-14 border-2 px-8 font-black uppercase text-[11px] tracking-widest rounded-2xl bg-white hover:bg-slate-50 transition-all shadow-sm">
             <Download size={20} className="mr-3 text-slate-400"/> Export Dossier
           </Button>
           {isAdmin && (
             <Button className="h-14 px-10 font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-200 bg-indigo-600 border-none rounded-2xl hover:translate-y-[-2px] transition-transform">
                <ShieldCheck size={20} className="mr-3"/> Master Audit
             </Button>
           )}
        </div>
      </div>

      {/* Cyber-Fiscal Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Registry Magnitude" 
            value={stats.total} 
            icon={<History size={32}/>} 
            color="indigo" 
            desc="Total lifecycle volume across visible nodes."
          />
          <StatCard 
            title="Liquidated Assets" 
            value={stats.paid} 
            icon={<CheckCircle size={32}/>} 
            color="emerald" 
            desc="Verified remittances finalized in ledger."
          />
          <StatCard 
            title="Arrears Pressure" 
            value={stats.arrears} 
            icon={<AlertTriangle size={32}/>} 
            color="rose" 
            desc="Total obligation backlog flagged by system."
          />
          <StatCard 
            title="Locked Escrow" 
            value={stats.escrow} 
            icon={<ShieldCheck size={32}/>} 
            color="amber" 
            desc="Funds held pending logistics verification."
          />
      </div>

      {/* Controller Block */}
      <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-xl flex flex-wrap gap-6 items-end justify-between">
          <div className="flex flex-wrap gap-6 flex-1">
              <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                  <input 
                      type="text" 
                      placeholder="Scan Node ID, Protocol Ref or Meta..." 
                      className="w-full pl-16 pr-8 py-5 rounded-[24px] border-4 border-slate-50 bg-slate-50 font-bold text-sm text-slate-950 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              
              <div className="flex gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1.5"><Filter size={10}/> State</label>
                    <select className="px-6 py-4 border-2 border-slate-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none focus:border-indigo-600 transition-all min-w-[150px] cursor-pointer shadow-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                        <option value="ALL">All States</option>
                        <option value="PAID">Liquidated</option>
                        <option value="PENDING">Sync Pending</option>
                        <option value="OVERDUE">Arrears Pressure</option>
                        <option value="ESCROW">Locked Node</option>
                        <option value="FLAGGED">High Risk</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1.5"><LayoutGrid size={10}/> Class</label>
                    <select className="px-6 py-4 border-2 border-slate-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none focus:border-indigo-600 transition-all min-w-[150px] cursor-pointer shadow-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
                        <option value="ALL">All Classes</option>
                        {Object.values(PaymentType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={10}/> Timeline Start</label>
                    <input type="date" value={dateFilter.start} onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})} className="px-6 py-4 border-2 border-slate-100 rounded-[20px] text-[10px] font-black uppercase bg-slate-50 outline-none focus:border-indigo-600 shadow-sm" />
                </div>
              </div>
          </div>

          <div className="flex gap-3 border-l border-slate-100 pl-6">
            <button 
                onClick={() => { setSortField('date'); toggleSortOrder(); }} 
                className={`h-16 px-8 border-2 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${sortField === 'date' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'bg-white text-slate-400 border-slate-100'}`}
            >
                Timeline {sortField === 'date' && (sortOrder === 'ASC' ? <SortAsc size={16}/> : <SortDesc size={16}/>)}
            </button>
            <button 
                onClick={() => { setSortField('amount'); toggleSortOrder(); }} 
                className={`h-16 px-8 border-2 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${sortField === 'amount' ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'bg-white text-slate-400 border-slate-100'}`}
            >
                Magnitude {sortField === 'amount' && (sortOrder === 'ASC' ? <SortAsc size={16}/> : <SortDesc size={16}/>)}
            </button>
          </div>
      </div>

      {/* High-Fidelity Ledger Table */}
      <div className="bg-white rounded-[64px] border border-slate-200 shadow-2xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-950 text-indigo-400 font-black uppercase text-[11px] tracking-[0.4em] border-b border-slate-900">
                      <tr>
                          <th className="px-12 py-10">Registry Vector</th>
                          <th className="px-12 py-10">Classification</th>
                          <th className="px-12 py-10">Remittance Flow</th>
                          <th className="px-12 py-10 text-right">Volume (UGX)</th>
                          <th className="px-12 py-10">Integrity Node</th>
                          <th className="px-12 py-10">Registry Time</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-indigo-50/40 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600">
                              <td className="px-12 py-8">
                                  <div className="font-mono text-sm font-black text-slate-950 uppercase group-hover:text-indigo-600 transition-colors tracking-tighter">#{tx.id}</div>
                                  <div className="text-[10px] text-slate-400 font-bold mt-2 tracking-widest flex items-center gap-2">
                                     <Info size={10}/> {tx.reference || 'SYSTEM_AUTO_GEN'}
                                  </div>
                              </td>
                              <td className="px-12 py-8">
                                  <div className="flex items-center gap-4">
                                      <div className={`p-3 rounded-[18px] bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm`}>
                                          <Receipt size={20} />
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                                          {tx.type.replace('_', ' ')}
                                      </span>
                                  </div>
                              </td>
                              <td className="px-12 py-8">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-2.5 h-2.5 rounded-full ${tx.method.includes('MOMO') ? 'bg-yellow-400 shadow-[0_0_12px_#facc15]' : tx.method === 'BANK' ? 'bg-blue-500 shadow-[0_0_12px_#3b82f6]' : 'bg-slate-400 shadow-[0_0_12px_#94a3b8]'} animate-pulse`}></div>
                                      <span className="font-black text-slate-800 text-[10px] uppercase tracking-widest">{tx.method.replace('_', ' ')}</span>
                                  </div>
                              </td>
                              <td className="px-12 py-8 text-right">
                                  <div className="font-black text-slate-950 text-2xl tracking-tighter leading-none">{tx.amount.toLocaleString()}</div>
                                  {tx.taxAmount && <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Incl. VAT: {tx.taxAmount.toLocaleString()}</div>}
                              </td>
                              <td className="px-12 py-8">
                                  <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest border-2 transition-all group-hover:scale-105 ${
                                      tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                      tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                      tx.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                      tx.status === 'ESCROW' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                      'bg-slate-50 text-slate-700 border-slate-100'
                                  }`}>
                                      {tx.status}
                                  </div>
                              </td>
                              <td className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-tighter font-mono group-hover:text-slate-600 transition-colors">
                                  {tx.date}
                              </td>
                          </tr>
                      ))}
                      {filteredTransactions.length === 0 && (
                          <tr>
                              <td colSpan={6} className="px-12 py-32 text-center text-slate-400">
                                 <div className="flex flex-col items-center gap-8">
                                     <div className="p-10 bg-slate-50 rounded-[56px] text-slate-200 shadow-inner">
                                        <History size={100}/>
                                     </div>
                                     <div className="space-y-2">
                                        <p className="font-black uppercase tracking-[0.4em] text-sm text-slate-950">Registry Nullification</p>
                                        <p className="text-sm font-medium max-w-xs mx-auto">No telemetry found in this quadrant. Recalibrate filters or verify node connectivity.</p>
                                     </div>
                                     <Button variant="outline" onClick={() => {setSearchTerm(''); setStatusFilter('ALL'); setTypeFilter('ALL'); setDateFilter({start:'', end:''}); }} className="font-black uppercase text-[10px] tracking-[0.2em] border-2">Full Registry Reset</Button>
                                 </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );

  function toggleSortOrder() {
    setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
  }
};

const StatCard = ({ title, value, icon, color, desc }: { title: string, value: number, icon: any, color: string, desc: string }) => {
    const variants: Record<string, string> = {
        indigo: 'bg-slate-950 text-white border-none shadow-indigo-200 ring-indigo-500/20',
        emerald: 'bg-emerald-50 text-emerald-950 border-emerald-100 shadow-emerald-100 ring-emerald-500/10',
        rose: 'bg-rose-50 text-rose-950 border-rose-100 shadow-rose-100 ring-rose-500/10',
        amber: 'bg-amber-50 text-amber-950 border-amber-100 shadow-amber-100 ring-amber-500/10'
    };
    
    const iconColors: Record<string, string> = {
        indigo: 'text-indigo-400',
        emerald: 'text-emerald-500',
        rose: 'text-rose-500',
        amber: 'text-amber-500'
    };

    const glowColors: Record<string, string> = {
        indigo: 'shadow-[0_0_20px_rgba(79,70,229,0.3)]',
        emerald: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
        rose: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
        amber: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]'
    };

    return (
        <Card className={`p-10 rounded-[56px] relative overflow-hidden group transition-all hover:-translate-y-2 border-2 ${variants[color]} ${glowColors[color]}`}>
            <div className={`absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity group-hover:rotate-12 duration-500`}>
                {icon}
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3 ${color === 'indigo' ? 'text-indigo-400' : 'text-slate-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${iconColors[color]} animate-pulse shadow-[0_0_8px] shadow-current`}></span>
                        {title}
                    </p>
                    <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none">
                        {value.toLocaleString()} <span className="text-[10px] font-bold opacity-40 tracking-widest uppercase">UGX</span>
                    </h3>
                </div>
                <p className={`text-[10px] font-bold leading-relaxed opacity-60 uppercase tracking-widest max-w-[180px]`}>{desc}</p>
            </div>
        </Card>
    );
};
