import React, { useState } from 'react';
import { UserRole, Transaction } from '../types';
import { MOCK_TRANSACTIONS, MOCK_VENDORS } from '../constants';
import { 
  DollarSign, Download, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, 
  PieChart, TrendingUp, Lock, Filter, Calendar, Check, X, AlertTriangle,
  Building2, Truck, Gavel, Zap, FileText
} from 'lucide-react';

interface FinancialsModuleProps {
  role: UserRole;
  marketId?: string;
}

export const FinancialsModule: React.FC<FinancialsModuleProps> = ({ role, marketId }) => {
  const isVendor = role === UserRole.VENDOR;
  const isSupplier = role === UserRole.SUPPLIER;
  const isAdmin = role === UserRole.SUPER_ADMIN || role === UserRole.MARKET_ADMIN;
  const isMarketAdmin = role === UserRole.MARKET_ADMIN;

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [filterType, setFilterType] = useState('ALL');

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    // 1. RBAC Scope
    if (isMarketAdmin && marketId) {
        // Find if transaction entity belongs to market
        // Note: For demo, we link tx.entityId to vendor.id. In real app, check tx.marketId directly if available.
        const vendor = MOCK_VENDORS.find(v => v.id === tx.entityId);
        // Only show if vendor is in this market OR if it's a generic market transaction (mock logic needed here)
        // For simplicity, strict vendor check:
        if (!vendor || vendor.marketId !== marketId) return false;
    }

    if (filterType !== 'ALL' && tx.type !== filterType) return false;
    
    if (isAdmin) return true;
    if (isSupplier) return tx.type === 'INCOME' || tx.type === 'WITHDRAWAL';
    if (isVendor) return tx.type === 'RENT' || tx.type === 'VAT' || tx.type === 'EXPENDITURE';
    return false;
  });

  const handleAudit = (id: string, action: 'APPROVE' | 'FLAG') => {
      setTransactions(prev => prev.map(tx => {
          if (tx.id === id) return { ...tx, status: action === 'APPROVE' ? 'PAID' : 'FLAGGED', verifiedBy: 'Admin' };
          return tx;
      }));
  };

  // --- ADMIN REVENUE DASHBOARD ---
  if (isAdmin) {
      // Calculate revenue streams based on FILTERED transactions only
      const calculateStream = (types: string[]) => 
          filteredTransactions
            .filter(t => types.includes(t.type) && t.status === 'PAID')
            .reduce((acc, curr) => acc + curr.amount, 0);

      const revenueStreams = [
          { label: 'Shop Rent', value: calculateStream(['RENT']), icon: Building2, color: 'bg-blue-500' },
          { label: 'Gate Fees', value: calculateStream(['GATE_FEE']), icon: Truck, color: 'bg-emerald-500' },
          { label: 'Fines/Penalties', value: calculateStream(['FINE']), icon: Gavel, color: 'bg-red-500' },
          { label: 'Utilities', value: calculateStream(['UTILITY']), icon: Zap, color: 'bg-amber-500' },
      ];

      const totalRevenue = revenueStreams.reduce((acc, curr) => acc + curr.value, 0);
      const estimatedTax = totalRevenue * 0.18; // Flat 18% VAT estimation for dashboard
      const netRevenue = totalRevenue - estimatedTax;

      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Revenue Command Center</h2>
                    <p className="text-slate-500 font-medium">
                        {isMarketAdmin ? 'Market-Specific Financial Oversight' : 'Global Financial Oversight'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg font-bold text-sm hover:bg-slate-50">
                        <Calendar size={16}/> This Month
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 shadow-lg">
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* Top Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-3 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end">
                        <div>
                            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Gross Collections (Oct)</div>
                            <div className="text-5xl font-black tracking-tighter mb-4">
                                {totalRevenue.toLocaleString()} <span className="text-2xl text-slate-500 font-medium">UGX</span>
                            </div>
                            <div className="flex gap-6 border-t border-slate-700 pt-4 mt-2">
                                <div>
                                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Net Revenue</div>
                                    <div className="text-xl font-bold text-emerald-400">{netRevenue.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Tax Liability (VAT/LST)</div>
                                    <div className="text-xl font-bold text-orange-400">{estimatedTax.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-right">
                             <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                 <FileText size={16}/> Remit Taxes to URA
                             </button>
                        </div>
                    </div>
                    <div className="absolute right-[-50px] top-[-50px] opacity-10">
                        <DollarSign size={300} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Pending Audit</div>
                        <div className="text-3xl font-black text-amber-600 mb-2">
                            {filteredTransactions.filter(t => t.status === 'PENDING').length}
                        </div>
                        <p className="text-xs text-slate-400">Transactions flagged for manual review.</p>
                    </div>
                    <button className="w-full py-3 bg-amber-50 text-amber-700 font-bold rounded-xl hover:bg-amber-100 transition mt-4 flex items-center justify-center gap-2">
                        Review Queue <ArrowUpRight size={16}/>
                    </button>
                </div>
            </div>

            {/* Breakdown & Audit Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Streams */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg">Revenue Streams</h3>
                    {revenueStreams.map((stream, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl text-white ${stream.color}`}>
                                    <stream.icon size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{stream.label}</div>
                                    <div className="text-xs text-slate-500">{totalRevenue > 0 ? Math.round((stream.value/totalRevenue)*100) : 0}% Contribution</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-slate-900">{stream.value.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-400">UGX</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Audit Table */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-900 text-lg">Live Transaction Ledger</h3>
                        <div className="flex gap-2">
                            <select 
                                className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white outline-none"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="ALL">All Types</option>
                                <option value="RENT">Rent</option>
                                <option value="GATE_FEE">Gate</option>
                                <option value="VAT">VAT</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 max-h-[500px]">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100 sticky top-0 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3">Ref ID</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.id} className={`hover:bg-slate-50 transition-colors ${tx.status === 'PENDING' ? 'bg-amber-50/30' : ''}`}>
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{tx.reference || tx.id}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                {tx.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {tx.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">UGX</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                tx.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                tx.status === 'FLAGGED' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {tx.status === 'PENDING' && (
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleAudit(tx.id, 'APPROVE')}
                                                        className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Verify"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAudit(tx.id, 'FLAG')}
                                                        className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Flag Issue"
                                                    >
                                                        <AlertTriangle size={14} />
                                                    </button>
                                                </div>
                                            )}
                                            {tx.status === 'PAID' && <span className="text-[10px] text-slate-400 font-mono">Verified</span>}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr><td colSpan={5} className="text-center py-8 text-slate-400 italic">No records found for this market context.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- VENDOR / SUPPLIER VIEW (Standard) ---
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isSupplier ? 'Settlement Hub' : 'Business Financials'}
          </h2>
          <p className="text-slate-500 text-sm">
            {isSupplier ? 'Manage wallet, escrow releases, and withdrawals.' : 
             'Track profitability, pay dues, and manage expenses.'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition text-slate-700">
          <Download size={16} /> Export Statement
        </button>
      </div>

      {/* --- DASHBOARD CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Main Balance / Revenue */}
        <div className={`text-white p-6 rounded-xl shadow-lg relative overflow-hidden ${isSupplier ? 'bg-blue-900' : 'bg-emerald-900'}`}>
           <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4 text-slate-300">
                 {isSupplier ? <Wallet size={20} /> : <TrendingUp size={20} />}
                 <span className="text-sm font-medium">
                    {isSupplier ? 'Available Balance' : 'Net Profit (This Month)'}
                 </span>
               </div>
               <div className="text-3xl font-bold mb-2">
                 {isSupplier ? '12,450,000' : '2,100,000'} <span className="text-lg font-normal opacity-70">UGX</span>
               </div>
               
               {isSupplier && (
                 <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 mt-2"
                 >
                   Request Withdrawal <ArrowDownLeft size={16} />
                 </button>
               )}
               {isVendor && (
                  <div className="text-xs text-emerald-200 mt-2 flex items-center gap-1">
                      <ArrowUpRight size={12} /> +15% vs Last Month
                  </div>
               )}
           </div>
           {/* Background Decor */}
           <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
               <DollarSign size={150} />
           </div>
        </div>

        {/* Card 2: Secondary Metric */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <div>
               <div className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                   {isSupplier ? <Lock size={16} /> : <PieChart size={16} />}
                   {isSupplier ? 'Escrow Holdings' : 'Total Expenses'}
               </div>
               <div className="text-2xl font-bold text-slate-900">
                  {isSupplier ? '2,500,000' : '850,000'} <span className="text-sm font-normal text-slate-400">UGX</span>
               </div>
               {isSupplier && <p className="text-xs text-slate-400 mt-1">Funds locked in active requisitions.</p>}
           </div>
           
           {isVendor && (
             <button onClick={() => setShowPaymentModal(true)} className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-bold transition">
                Record Expense
             </button>
           )}
        </div>

        {/* Card 3: Dues / Taxes / Actions */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <div>
               <div className="text-sm font-medium text-slate-500 mb-2">
                  {isVendor ? 'Pending Rent/Tax' : 'Completed Jobs'}
               </div>
               <div className={`text-2xl font-bold ${isVendor && 650000 > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {isVendor ? '650,000' : '14'} {isVendor ? <span className="text-sm font-normal text-slate-400">UGX</span> : ''}
               </div>
           </div>

           {isVendor && (
               <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
               >
                 Pay Rent & Taxes <CreditCard size={16} />
               </button>
           )}
        </div>
      </div>

      {/* --- TRANSACTIONS TABLE --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Transaction History</h3>
            <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Income</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">Expense</span>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-600 font-medium">{tx.reference || tx.id}</td>
                  <td className="px-6 py-4 text-slate-900">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-700 uppercase tracking-wide">{tx.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                      {tx.method === 'MTN_MOMO' && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
                      {tx.method === 'AIRTEL_MONEY' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                      {tx.method === 'BANK' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      {tx.method.replace('_', ' ')}
                  </td>
                  <td className={`px-6 py-4 font-bold ${
                      ['INCOME', 'GATE_FEE'].includes(tx.type) ? 'text-green-600' : 'text-slate-800'
                  }`}>
                    {['INCOME', 'GATE_FEE'].includes(tx.type) ? '+' : '-'}{tx.amount.toLocaleString()} UGX
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                      tx.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                      tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                      tx.status === 'ESCROW' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status === 'ESCROW' && <Lock size={10} />}
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ... (Modals remain same for Vendor/Supplier) ... */}
      {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Withdraw Funds</h3>
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4 flex justify-between">
                    <span>Available:</span>
                    <span className="font-bold">12,450,000 UGX</span>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                        <input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="Enter amount" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destination</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white">
                            <option>Registered Bank Account (**** 4432)</option>
                            <option>MTN Merchant Code</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
                    <button onClick={() => { alert('Withdrawal Initiated!'); setShowWithdrawModal(false); }} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Confirm</button>
                </div>
            </div>
          </div>
      )}

      {/* Replaced Dummy Payment Modal with Dummy Trigger logic for simplicity in this file, real payment logic is inside specific modules */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Selection</h3>
              <p className="text-sm text-slate-500 mb-6">Proceed to payment gateway?</p>
              <div className="flex gap-3">
                 <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                 <button onClick={() => { alert('In a real scenario, this opens the PaymentGateway component.'); setShowPaymentModal(false); }} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Proceed</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};