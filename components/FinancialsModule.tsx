
import React, { useState } from 'react';
import { UserRole, Transaction, PaymentType } from '../types';
import { MOCK_TRANSACTIONS, MOCK_VENDORS } from '../constants';
import { 
  DollarSign, Download, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, 
  PieChart, TrendingUp, Lock, Filter, Calendar, Check, AlertTriangle,
  Building2, Truck, Gavel, Zap, FileText, X
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

  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== 'ALL' && tx.type !== filterType) return false;
    if (isAdmin) return true;
    if (isSupplier) return tx.type === PaymentType.SUPPLY_ESCROW || tx.type === PaymentType.SERVICE_CHARGE;
    if (isVendor) return tx.type === PaymentType.RENT || tx.type === PaymentType.URA_VAT || tx.type === PaymentType.UTILITY;
    return false;
  });

  if (isAdmin) {
      const totalRevenue = filteredTransactions
        .filter(t => t.status === 'PAID')
        .reduce((acc, curr) => acc + curr.amount, 0);
      
      const totalVAT = filteredTransactions
        .filter(t => t.type === PaymentType.URA_VAT && t.status === 'PAID')
        .reduce((acc, curr) => acc + curr.amount, 0);

      const netRevenue = totalRevenue - totalVAT;

      return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Revenue Analytics</h2>
                    <p className="text-slate-500 font-medium">Classified financial triangulation ledger.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                        <Download size={16} /> Export Ledger
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-3 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">Total Realized Revenue</p>
                        <h3 className="text-6xl font-black tracking-tighter mb-8">{totalRevenue.toLocaleString()} <span className="text-xl font-medium opacity-40">UGX</span></h3>
                        <div className="grid grid-cols-3 gap-10 border-t border-white/10 pt-8">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Net Magnitude</p>
                                <p className="text-2xl font-black text-emerald-400">{netRevenue.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">URA VAT Liability</p>
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

                <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Registry Audit</div>
                        <p className="text-4xl font-black text-red-600 mb-2">12</p>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tighter opacity-60">Overdue rent nodes detected in quadrant A.</p>
                    </div>
                    <button className="w-full py-4 bg-red-50 text-red-700 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-100 transition shadow-sm">
                        Issue Summons
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Transaction Matrix</h3>
                    <div className="flex gap-3">
                        <select 
                            className="bg-black text-white border-none rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none shadow-lg appearance-none cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                        >
                            <option value="ALL">ALL CLASSIFICATIONS</option>
                            {Object.values(PaymentType).map(type => (
                                <option key={type} value={type}>{type.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5">Registry ID</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5 text-right">Magnitude</th>
                                <th className="px-8 py-5 text-center">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-8 py-5 font-mono text-xs font-bold text-slate-900">{tx.reference || tx.id}</td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{tx.type.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-8 py-5 font-black text-slate-900 text-right">
                                        {tx.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-medium">UGX</span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            tx.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {tx.status}
                                        </span>
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
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Ledger Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl">
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2">Account Magnitude</p>
                <h4 className="text-4xl font-black tracking-tighter">1,200,000 <span className="text-sm font-medium opacity-50">UGX</span></h4>
            </div>
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Next Obligation</p>
                <h4 className="text-4xl font-black tracking-tighter text-slate-900">45,000 <span className="text-sm font-medium opacity-30 text-red-600">DUE</span></h4>
            </div>
        </div>
    </div>
  );
};
