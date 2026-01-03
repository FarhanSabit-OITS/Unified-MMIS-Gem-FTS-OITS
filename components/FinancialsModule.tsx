
import React, { useState, useMemo } from 'react';
import { UserRole, Transaction, PaymentType } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  DollarSign, Download, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, 
  PieChart, TrendingUp, Lock, Filter, Calendar, Check, AlertTriangle,
  Building2, Truck, Gavel, Zap, FileText, X, ChevronRight, Search, ArrowUpDown,
  History, Activity, ShieldCheck, ListFilter, SortAsc, SortDesc, CheckCircle,
  Receipt, Landmark
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface FinancialsModuleProps {
  role: UserRole;
  marketId?: string;
}

export const FinancialsModule: React.FC<FinancialsModuleProps> = ({ role, marketId }) => {
  const isSuperAdmin = role === UserRole.SUPER_ADMIN;
  const isMarketAdmin = role === UserRole.MARKET_ADMIN;
  const isAdmin = isSuperAdmin || isMarketAdmin;
  const isVendor = role === UserRole.VENDOR;
  const isSupplier = role === UserRole.SUPPLIER;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE' | 'ESCROW'>('ALL');
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      // Role-Based Data Ledger Isolation
      if (isVendor) {
        if (![PaymentType.RENT, PaymentType.URA_VAT, PaymentType.UTILITY, PaymentType.FINE].includes(tx.type)) return false;
      }
      if (isSupplier) {
        if (![PaymentType.SUPPLY_ESCROW, PaymentType.SERVICE_CHARGE].includes(tx.type)) return false;
      }

      const term = searchTerm.toLowerCase();
      const matchesSearch = tx.id.toLowerCase().includes(term) || (tx.reference && tx.reference.toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => {
      const valA = sortField === 'date' ? new Date(a.date).getTime() : a.amount;
      const valB = sortField === 'date' ? new Date(b.date).getTime() : b.amount;
      return sortOrder === 'ASC' ? valA - valB : valB - valA;
    });
  }, [searchTerm, statusFilter, typeFilter, sortField, sortOrder, isVendor, isSupplier]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const paid = filteredTransactions.filter(t => t.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = filteredTransactions.filter(t => t.status === 'PENDING' || t.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0);
    return { total, paid, pending };
  }, [filteredTransactions]);

  const toggleSortOrder = () => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');

  return (
    <div className="space-y-10 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-slate-200">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 bg-slate-950 text-white rounded-[32px] flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
             <Wallet size={40} className="text-indigo-400" />
           </div>
           <div>
              <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">Fiscal Registry</h2>
              <p className="text-slate-500 font-medium text-lg flex items-center gap-2">
                <Landmark size={18} className="text-indigo-600" /> 
                {isSuperAdmin ? 'Global Remittance Triage' : 'Regional Revenue Node'}
              </p>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-14 border-2 px-8 font-black uppercase text-[11px] tracking-widest rounded-2xl bg-white hover:bg-slate-50 shadow-sm"><Download size={20} className="mr-3 text-slate-400"/> Export Dossier</Button>
           {isAdmin && (
             <Button className="h-14 px-10 font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-200 bg-indigo-600 border-none rounded-2xl">
                <ShieldCheck size={20} className="mr-3"/> Master Audit
             </Button>
           )}
        </div>
      </div>

      {/* Analytics Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-10 border-none bg-slate-950 text-white rounded-[56px] shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <History size={200}/>
              </div>
              <p className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div> Total Magnitude
              </p>
              <h3 className="text-5xl font-black tracking-tighter mb-3 leading-none">{stats.total.toLocaleString()} <span className="text-sm font-bold text-slate-500 tracking-normal">UGX</span></h3>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Lifecycle flow indexed by registry node filters.</p>
          </Card>
          
          <Card className="p-10 border-none bg-emerald-50 rounded-[56px] shadow-sm relative group overflow-hidden border-2 border-emerald-100">
              <div className="absolute top-0 right-0 p-10 opacity-[0.05] text-emerald-600">
                <CheckCircle size={200}/>
              </div>
              <p className="text-[11px] font-black uppercase text-emerald-600 tracking-[0.3em] mb-6">Liquidated Assets</p>
              <h3 className="text-5xl font-black text-emerald-700 tracking-tighter mb-3 leading-none">{stats.paid.toLocaleString()} <span className="text-sm font-bold text-emerald-600/40 tracking-normal">UGX</span></h3>
              <p className="text-[11px] font-bold text-emerald-600/50 uppercase tracking-widest leading-relaxed">Verified remittances confirmed in ledger.</p>
          </Card>

          <Card className="p-10 border-none bg-rose-50 rounded-[56px] shadow-sm relative group overflow-hidden border-2 border-rose-100">
              <div className="absolute top-0 right-0 p-10 opacity-[0.05] text-rose-600">
                <AlertTriangle size={200}/>
              </div>
              <p className="text-[11px] font-black uppercase text-rose-600 tracking-[0.3em] mb-6">Obligation Backlog</p>
              <h3 className="text-5xl font-black text-rose-700 tracking-tighter mb-3 leading-none">{stats.pending.toLocaleString()} <span className="text-sm font-bold text-rose-600/40 tracking-normal">UGX</span></h3>
              <p className="text-[11px] font-bold text-rose-600/50 uppercase tracking-widest leading-relaxed">Arrears detection triggered in current cycle.</p>
          </Card>
      </div>

      {/* Control Node */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-6 flex-1">
              <div className="relative flex-1 min-w-[350px]">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                  <input 
                      type="text" 
                      placeholder="Deep search by Node ID or Protocol Reference..." 
                      className="w-full pl-16 pr-8 py-5 rounded-[24px] border-2 border-slate-100 bg-slate-50 font-bold text-sm text-slate-950 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-inner"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="flex gap-3">
                <select className="px-6 py-5 border-2 border-slate-100 rounded-[24px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none focus:border-indigo-600 transition-all min-w-[180px] shadow-inner cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                    <option value="ALL">All States</option>
                    <option value="PAID">Liquidated</option>
                    <option value="PENDING">Pending</option>
                    <option value="OVERDUE">Arrears</option>
                    <option value="ESCROW">Locked Node</option>
                </select>
                <select className="px-6 py-5 border-2 border-slate-100 rounded-[24px] text-[10px] font-black uppercase tracking-widest bg-slate-50 outline-none focus:border-indigo-600 transition-all min-w-[180px] shadow-inner cursor-pointer" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
                    <option value="ALL">All Classes</option>
                    {Object.values(PaymentType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
          </div>
          <div className="flex gap-3 border-l border-slate-100 pl-6 ml-2">
            <Button variant="secondary" onClick={() => setSortField('date')} className={`h-16 px-6 border-2 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${sortField === 'date' ? 'border-indigo-600 text-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100'}`}>Timeline</Button>
            <Button variant="secondary" onClick={() => setSortField('amount')} className={`h-16 px-6 border-2 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${sortField === 'amount' ? 'border-indigo-600 text-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border-slate-100'}`}>Volume</Button>
            <button onClick={toggleSortOrder} className="h-16 w-16 bg-slate-950 text-white rounded-[24px] flex items-center justify-center shadow-2xl transition-all active:scale-95">
                {sortOrder === 'ASC' ? <SortAsc size={24}/> : <SortDesc size={24}/>}
            </button>
          </div>
      </div>

      {/* Ledger Grid */}
      <div className="bg-white rounded-[64px] border border-slate-200 shadow-2xl overflow-hidden mb-20">
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-950 text-indigo-400 font-black uppercase text-[11px] tracking-[0.3em]">
                      <tr>
                          <th className="px-12 py-8">Event Vector</th>
                          <th className="px-12 py-8">Classification</th>
                          <th className="px-12 py-8">Remittance Channel</th>
                          <th className="px-12 py-8 text-right">Settlement (UGX)</th>
                          <th className="px-12 py-8">Status Node</th>
                          <th className="px-12 py-8">Registry Time</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-indigo-50/40 transition-all group cursor-pointer">
                              <td className="px-12 py-8">
                                  <div className="font-mono text-xs font-black text-slate-950 uppercase group-hover:text-indigo-600 transition-colors">{tx.id}</div>
                                  <div className="text-[10px] text-slate-400 font-bold mt-1.5 tracking-widest">{tx.reference || 'SYS_GEN_NODE'}</div>
                              </td>
                              <td className="px-12 py-8">
                                  <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                                          <Receipt size={16} />
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                          {tx.type.replace('_', ' ')}
                                      </span>
                                  </div>
                              </td>
                              <td className="px-12 py-8">
                                  <div className="font-black text-slate-950 text-xs flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${tx.method.includes('MOMO') ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' : tx.method === 'BANK' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-slate-400'}`}></div>
                                      {tx.method.replace('_', ' ')}
                                  </div>
                              </td>
                              <td className="px-12 py-8 text-right font-black text-slate-950 text-lg tracking-tighter">
                                  {tx.amount.toLocaleString()}
                              </td>
                              <td className="px-12 py-8">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full animate-pulse ${tx.status === 'PAID' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : tx.status === 'PENDING' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`}></div>
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
                                          tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                          tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                          'bg-rose-50 text-rose-700 border-rose-100'
                                      }`}>
                                          {tx.status}
                                      </span>
                                  </div>
                              </td>
                              <td className="px-12 py-8 text-[11px] font-bold text-slate-400 uppercase tracking-tighter font-mono">
                                  {tx.date}
                              </td>
                          </tr>
                      ))}
                      {filteredTransactions.length === 0 && (
                          <tr>
                              <td colSpan={6} className="px-12 py-32 text-center text-slate-400">
                                 <div className="flex flex-col items-center gap-6">
                                     <div className="p-8 bg-slate-50 rounded-[40px] text-slate-200">
                                        <History size={80}/>
                                     </div>
                                     <div className="space-y-1">
                                        <p className="font-black uppercase tracking-[0.3em] text-xs text-slate-900">Zero Telemetry Nodes Found</p>
                                        <p className="text-sm font-medium">Verify your synchronization filters or search registry.</p>
                                     </div>
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
