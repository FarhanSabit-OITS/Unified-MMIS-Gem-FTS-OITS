
import React, { useState, useMemo } from 'react';
import { UserRole, Transaction, PaymentType } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  Download, Wallet, History, ShieldCheck, 
  Search, ArrowUpDown, Receipt, Landmark, 
  CheckCircle, AlertTriangle, SortAsc, SortDesc,
  Filter, Calendar, DollarSign, LayoutGrid, Info,
  ArrowUpRight, ArrowDownLeft, CreditCard, PieChart,
  RefreshCw, FileText, ChevronRight
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

  // Ledger Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE' | 'ESCROW' | 'FLAGGED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  // RBAC Enforcement & Data Triage
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      // 1. RBAC Data Isolation Layer
      if (isVendor) {
        if (tx.entityId !== userId) return false;
      } else if (isSupplier) {
        if (tx.entityId !== userId) return false;
      } else if (isMarketAdmin) {
        if (tx.marketId !== marketId) return false;
      }
      // Super Admin bypasses isolation

      // 2. Search Logic (Deep Indexing)
      const term = searchTerm.toLowerCase();
      const matchesSearch = tx.id.toLowerCase().includes(term) || 
                           (tx.reference && tx.reference.toLowerCase().includes(term)) ||
                           (tx.description && tx.description.toLowerCase().includes(term));
      
      // 3. Multi-Select Status Mapping
      const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
      
      // 4. Categorical Type Mapping
      const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;

      // 5. Chronological Window Filtering
      const matchesDate = (!dateRange.start || tx.date >= dateRange.start) &&
                          (!dateRange.end || tx.date <= dateRange.end);
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    }).sort((a, b) => {
      // 6. Multi-Factor Sorting
      const valA = sortField === 'date' ? new Date(a.date).getTime() : a.amount;
      const valB = sortField === 'date' ? new Date(b.date).getTime() : b.amount;
      return sortOrder === 'ASC' ? valA - valB : valB - valA;
    });
  }, [searchTerm, statusFilter, typeFilter, sortField, sortOrder, isVendor, isSupplier, isMarketAdmin, marketId, userId, dateRange]);

  // Aggregated Fiscal Analytics
  const analytics = useMemo(() => {
    const successful = filteredTransactions.filter(t => t.status === 'PAID');
    const volume = successful.reduce((acc, curr) => acc + curr.amount, 0);
    const arrears = filteredTransactions.filter(t => t.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0);
    const locked = filteredTransactions.filter(t => t.status === 'ESCROW').reduce((acc, curr) => acc + curr.amount, 0);
    const growth = volume > 0 ? 12.5 : 0; // Mocked delta
    
    return { volume, arrears, locked, growth, count: filteredTransactions.length };
  }, [filteredTransactions]);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('DESC');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      {/* Module Navigation & Identity */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-slate-950 text-white rounded-[32px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50/50">
             <Wallet size={36} className="text-indigo-400" />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Wallet Ledger</h2>
              <div className="flex items-center gap-3 mt-3">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                    <ShieldCheck size={12}/> {isSuperAdmin ? 'Global Treasury' : `Terminal: ${marketId || 'UNASSIGNED'}`}
                 </span>
                 <p className="text-slate-400 font-bold text-sm tracking-tight">Real-time Remittance Stream</p>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button variant="outline" className="flex-1 lg:flex-none h-14 border-2 px-8 font-black uppercase text-[10px] tracking-widest rounded-2xl bg-white">
            <Download size={18} className="mr-2 text-slate-400"/> Export Audit
          </Button>
          {(isVendor || isSupplier) && (
            <Button className="flex-1 lg:flex-none h-14 px-10 font-black uppercase text-[10px] tracking-widest bg-indigo-600 shadow-2xl shadow-indigo-100 rounded-2xl">
              <RefreshCw size={18} className="mr-2"/> Request Sync
            </Button>
          )}
          {isAdmin && (
            <Button className="flex-1 lg:flex-none h-14 px-10 font-black uppercase text-[10px] tracking-widest bg-slate-950 text-white shadow-2xl rounded-2xl">
              <Landmark size={18} className="mr-2 text-indigo-400"/> Reconcile All
            </Button>
          )}
        </div>
      </div>

      {/* Dynamic Summary Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard 
            title="Total Liquidity" 
            value={analytics.volume} 
            icon={<History size={24}/>} 
            color="indigo" 
            sub="Settled Node Volume"
            trend="+12% VS LAST CYCLE"
          />
          <StatCard 
            title="Arrears Pressure" 
            value={analytics.arrears} 
            icon={<AlertTriangle size={24}/>} 
            color="rose" 
            sub="Active Liability Flags"
            trend="NEEDS ATTENTION"
            isAlert
          />
          <StatCard 
            title="Escrow Node" 
            value={analytics.locked} 
            icon={<ShieldCheck size={24}/>} 
            color="amber" 
            sub="Funds Pending Verification"
            trend="STABLE"
          />
          <StatCard 
            title="Registry Count" 
            value={analytics.count} 
            icon={<FileText size={24}/>} 
            color="slate" 
            sub="Visible Protocol Logs"
            isCount
          />
      </div>

      {/* Control Console (Search & Filters) */}
      <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
              <input 
                type="text" 
                placeholder="Search by Protocol ID, Ref, or Narrative..." 
                className="w-full pl-16 pr-8 py-5 rounded-[28px] border-4 border-slate-50 bg-slate-50 font-bold text-sm text-slate-950 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-3 w-full lg:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 px-8 h-16 rounded-[24px] border-2 font-black uppercase text-[10px] tracking-widest transition-all ${showFilters ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}
              >
                <Filter size={18} /> {showFilters ? 'Hide Matrix' : 'Triage Logic'}
              </button>
              <div className="flex bg-slate-100 p-1.5 rounded-[24px] border border-slate-200">
                <button 
                  onClick={() => toggleSort('date')}
                  className={`p-3 rounded-[18px] transition-all ${sortField === 'date' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Sort by Timeline"
                >
                  {sortField === 'date' && sortOrder === 'ASC' ? <SortAsc size={20}/> : <SortDesc size={20}/>}
                </button>
                <button 
                  onClick={() => toggleSort('amount')}
                  className={`p-3 rounded-[18px] transition-all ${sortField === 'amount' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Sort by Magnitude"
                >
                  {sortField === 'amount' && sortOrder === 'ASC' ? <SortAsc size={20}/> : <SortDesc size={20}/>}
                </button>
              </div>
           </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-50 animate-in slide-in-from-top-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Integrity Node Status</label>
                <select 
                  className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase bg-slate-50 outline-none focus:border-indigo-600 appearance-none shadow-sm cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                   <option value="ALL">ALL STATES</option>
                   <option value="PAID">SETTLED</option>
                   <option value="PENDING">IN TRANSIT</option>
                   <option value="OVERDUE">ARREARS PRESSURE</option>
                   <option value="ESCROW">LOCKED PROTOCOL</option>
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Classification</label>
                <select 
                  className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase bg-slate-50 outline-none focus:border-indigo-600 appearance-none shadow-sm cursor-pointer"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                >
                   <option value="ALL">ALL CLASSES</option>
                   {Object.values(PaymentType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timeline Floor</label>
                <input 
                  type="date" 
                  className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase bg-slate-50 outline-none focus:border-indigo-600 shadow-sm"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timeline Ceiling</label>
                <input 
                  type="date" 
                  className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase bg-slate-50 outline-none focus:border-indigo-600 shadow-sm"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
             </div>
          </div>
        )}
      </div>

      {/* High-Fidelity Protocol Ledger */}
      <div className="bg-white rounded-[64px] border border-slate-200 shadow-2xl overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950 text-indigo-400 font-black uppercase text-[11px] tracking-[0.4em] border-b border-slate-900">
              <tr>
                <th className="px-12 py-10">Registry Vector</th>
                <th className="px-12 py-10">Classification</th>
                <th className="px-12 py-10">Protocol Logic</th>
                <th className="px-12 py-10 text-right">Volume (UGX)</th>
                <th className="px-12 py-10 text-center">Integrity Node</th>
                <th className="px-12 py-10 text-right">Node Sync Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-indigo-50/40 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-600">
                  <td className="px-12 py-8">
                     <div className="font-mono text-sm font-black text-slate-950 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">#{tx.id}</div>
                     <div className="text-[10px] text-slate-400 font-bold mt-2 tracking-widest flex items-center gap-1.5 uppercase">
                       <Info size={10} /> {tx.reference || 'SYSTEM-GEN'}
                     </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <Receipt size={22} />
                       </div>
                       <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{tx.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-3">
                       <div className={`w-2.5 h-2.5 rounded-full ${tx.method.includes('MOMO') ? 'bg-yellow-400 shadow-[0_0_12px_#facc15]' : tx.method === 'BANK' ? 'bg-blue-500 shadow-[0_0_12px_#3b82f6]' : 'bg-slate-300'} animate-pulse`}></div>
                       <span className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em]">{tx.method.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="text-2xl font-black text-slate-950 tracking-tighter tabular-nums leading-none">
                       {tx.amount.toLocaleString()}
                    </div>
                    {tx.taxAmount && <div className="text-[9px] text-slate-400 font-bold mt-2 tracking-widest uppercase">Incl. Tax: {tx.taxAmount.toLocaleString()}</div>}
                  </td>
                  <td className="px-12 py-8 text-center">
                     <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest border-2 transition-all group-hover:scale-105 ${
                        tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        tx.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        tx.status === 'ESCROW' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                     }`}>
                        {tx.status}
                     </div>
                  </td>
                  <td className="px-12 py-8 text-right font-mono text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                     {tx.date}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-12 py-32 text-center text-slate-400 bg-slate-50/50">
                     <div className="flex flex-col items-center gap-6">
                        <History size={80} className="opacity-10" />
                        <div className="space-y-2">
                           <p className="font-black uppercase tracking-[0.4em] text-sm text-slate-950">Protocol Nullification</p>
                           <p className="text-xs font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">No telemetry data triangulated in this quadrant of the fiscal registry.</p>
                        </div>
                        <Button variant="outline" onClick={() => {setSearchTerm(''); setStatusFilter('ALL'); setTypeFilter('ALL'); setDateRange({start:'', end:''}); }} className="font-black text-[10px] border-2 rounded-2xl px-8 h-12 uppercase tracking-widest">Registry Reset</p>
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
};

const StatCard = ({ title, value, icon, color, sub, trend, isAlert, isCount }: { 
  title: string, 
  value: number, 
  icon: any, 
  color: string, 
  sub: string, 
  trend?: string, 
  isAlert?: boolean,
  isCount?: boolean
}) => {
  const variants: Record<string, string> = {
    indigo: 'bg-indigo-600 text-white shadow-indigo-200 border-indigo-500',
    rose: 'bg-white text-rose-700 border-rose-100 shadow-rose-50 shadow-inner',
    amber: 'bg-white text-amber-700 border-amber-100 shadow-amber-50 shadow-inner',
    slate: 'bg-slate-950 text-white shadow-slate-200 border-slate-800'
  };

  return (
    <Card className={`p-10 rounded-[56px] border-2 transition-all hover:-translate-y-2 group relative overflow-hidden flex flex-col justify-between min-h-[280px] ${variants[color]}`}>
       <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700">
         {icon}
       </div>
       
       <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className={`w-2 h-2 rounded-full animate-pulse ${isAlert ? 'bg-rose-500' : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]'}`}></div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">{title}</p>
          </div>
          <h3 className="text-4xl font-black tracking-tighter flex items-end gap-2">
             {value.toLocaleString()} 
             {!isCount && <span className="text-sm font-bold opacity-40 uppercase tracking-widest mb-1.5">UGX</span>}
          </h3>
          <p className="text-[10px] font-bold mt-4 uppercase tracking-[0.2em] opacity-40">{sub}</p>
       </div>

       <div className="mt-8 pt-8 border-t border-current/10 relative z-10 flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">{trend || 'SYSTEM NOMINAL'}</span>
          <ChevronRight size={16} className="opacity-40 group-hover:translate-x-2 transition-transform" />
       </div>
    </Card>
  );
};
