
import React, { useState } from 'react';
import { UserRole, Transaction, PaymentType } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { 
  DollarSign, Download, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, 
  PieChart, TrendingUp, Lock, Filter, Calendar, Check, AlertTriangle,
  Building2, Truck, Gavel, Zap, FileText, X, ChevronRight, Search, ArrowUpDown
} from 'lucide-react';

interface FinancialsModuleProps {
  role: UserRole;
  marketId?: string;
}

export const FinancialsModule: React.FC<FinancialsModuleProps> = ({ role, marketId }) => {
  const isVendor = role === UserRole.VENDOR;
  const isSupplier = role === UserRole.SUPPLIER;
  const isAdmin = role === UserRole.SUPER_ADMIN || role === UserRole.MARKET_ADMIN;

  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [filterType, setFilterType] = useState<PaymentType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE' | 'FLAGGED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');

  const filteredTransactions = transactions.filter(tx => {
    // 1. RBAC Context
    if (isAdmin) {
      // Admins see all for their market context or global
    } else if (isSupplier) {
      if (tx.type !== PaymentType.SUPPLY_ESCROW && tx.type !== PaymentType.SERVICE_CHARGE) return false;
    } else if (isVendor) {
      if (tx.type !== PaymentType.RENT && tx.type !== PaymentType.URA_VAT && tx.type !== PaymentType.UTILITY) return false;
    } else {
      return false;
    }

    // 2. Local Filters
    if (filterType !== 'ALL' && tx.type !== filterType) return false;
    if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;
    
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || 
        (tx.reference && tx.reference.toLowerCase().includes(term)) ||
        tx.id.toLowerCase().includes(term) ||
        tx.method.toLowerCase().includes(term);

    return matchesSearch;
  }).sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
        return sortDir === 'ASC' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
    }
    return sortDir === 'ASC' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
        setSortDir(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
        setSortField(field);
        setSortDir('DESC');
    }
  };

  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  if (isAdmin) {
      const totalVAT = filteredTransactions
        .filter(t => t.status === 'PAID')
        .reduce((acc, curr) => acc + (curr.taxAmount || 0), 0);

      const netRevenue = totalRevenue - totalVAT;

      return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Revenue Triage</h2>
                    <p className="text-slate-500 font-medium">Classified financial triangulation ledger & URA remittance.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-slate-800 transition-all">
                        <Download size={16} /> Export Treasury Ledger
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-3 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">Total Liquidized Revenue</p>
                        <h3 className="text-6xl font-black tracking-tighter mb-8">{totalRevenue.toLocaleString()} <span className="text-xl font-medium opacity-40">UGX</span></h3>
                        <div className="grid grid-cols-3 gap-10 border-t border-white/10 pt-8">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Net Magnitude</p>
                                <p className="text-2xl font-black text-emerald-400">{netRevenue.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">URA VAT Protocol</p>
                                <p className="text-2xl font-black text-orange-400">{totalVAT.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">System Remittance</p>
                                <p className="text-2xl font-black text-indigo-400">98.4%</p>
                            </div>
                        </div>
                    </div>
                    <DollarSign className="absolute -right-10 -bottom-10 text-white opacity-5" size={350} />
                </div>

                <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-red-200 transition-all">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Audit Registry</div>
                        <p className="text-4xl font-black text-red-600 mb-2">12</p>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tighter opacity-60">Overdue rent nodes detected in sector A-C.</p>
                    </div>
                    <button className="w-full py-4 bg-red-50 text-red-700 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-100 transition shadow-sm">
                        Initiate Summons
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl flex items-center gap-3">
                            <Filter className="text-indigo-600" size={20} /> Transaction Matrix
                        </h3>
                        <div className="flex flex-wrap gap-2">
                             <div className="relative">
                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                                 <input 
                                    type="text" 
                                    placeholder="Triangulate Ref..." 
                                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-100 transition-all w-48"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                 />
                             </div>
                             <select 
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer hover:bg-slate-50"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                             >
                                <option value="ALL">ALL STATUS</option>
                                <option value="PAID">PAID</option>
                                <option value="PENDING">PENDING</option>
                                <option value="OVERDUE">OVERDUE</option>
                                <option value="FLAGGED">FLAGGED</option>
                             </select>
                             <select 
                                className="bg-black text-white border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-lg cursor-pointer"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                             >
                                <option value="ALL">ALL CATEGORIES</option>
                                {Object.values(PaymentType).map(type => (
                                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                ))}
                             </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-slate-400 font-black uppercase text-[9px] tracking-[0.2em] border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5">Registry Reference</th>
                                <th className="px-8 py-5">Classification</th>
                                <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('date')}>
                                    Time Node {sortField === 'date' && (sortDir === 'ASC' ? '↑' : '↓')}
                                </th>
                                <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors text-right" onClick={() => toggleSort('amount')}>
                                    Magnitude {sortField === 'amount' && (sortDir === 'ASC' ? '↑' : '↓')}
                                </th>
                                <th className="px-8 py-5 text-center">Status Protocol</th>
                                <th className="px-8 py-5 text-right">Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-5 font-mono text-xs font-black text-slate-900">{tx.reference || tx.id}</td>
                                    <td className="px-8 py-5">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">{tx.type.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-slate-500 text-xs">
                                        {tx.date}
                                    </td>
                                    <td className="px-8 py-5 font-black text-slate-900 text-right">
                                        {tx.amount.toLocaleString()} <span className="text-[9px] opacity-30">UGX</span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                            tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{tx.method.replace('_', ' ')}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Wallet Ledger</h2>
            <div className="flex gap-2">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <Calendar className="text-slate-400" size={20} />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Cycle: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Accumulated Magnitude (MTD)</p>
                <h4 className="text-4xl font-black tracking-tighter relative z-10">{totalRevenue.toLocaleString()} <span className="text-sm font-medium opacity-50">UGX</span></h4>
                <TrendingUp className="absolute -right-4 -bottom-4 text-white opacity-10" size={120} />
            </div>
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Pending Remittance</p>
                <h4 className="text-4xl font-black tracking-tighter text-slate-900">
                    {filteredTransactions.filter(t => t.status === 'PENDING').reduce((a,c) => a+c.amount, 0).toLocaleString()} 
                    <span className="text-sm font-medium opacity-30 text-red-600 tracking-normal ml-2 uppercase">Pending</span>
                </h4>
            </div>
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Compliance Rating</p>
                    <h4 className="text-4xl font-black text-emerald-600 tracking-tighter">94.2%</h4>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center">
                    <Check className="text-emerald-500" size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden mt-8">
            <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
                 <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Financial Log</h4>
                 <div className="flex gap-2">
                     <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                         <option value="ALL">All Status</option>
                         <option value="PAID">Paid</option>
                         <option value="PENDING">Pending</option>
                     </select>
                 </div>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                    <tr>
                        <th className="px-6 py-4">Reference</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Amount (UGX)</th>
                        <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono font-black text-xs text-slate-700">{tx.reference || tx.id}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{tx.date}</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">{tx.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${tx.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {tx.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
