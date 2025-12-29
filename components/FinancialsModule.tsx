import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { DollarSign, Download, CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, PieChart, TrendingUp, Lock } from 'lucide-react';

interface FinancialsModuleProps {
  role: UserRole;
}

export const FinancialsModule: React.FC<FinancialsModuleProps> = ({ role }) => {
  const isVendor = role === UserRole.VENDOR;
  const isSupplier = role === UserRole.SUPPLIER;
  const isAdmin = role === UserRole.SUPER_ADMIN || role === UserRole.MARKET_ADMIN;

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Filter transactions based on role (Simulation)
  const transactions = MOCK_TRANSACTIONS.filter(tx => {
    if (isAdmin) return true;
    if (isSupplier) return tx.type === 'INCOME' || tx.type === 'WITHDRAWAL';
    if (isVendor) return tx.type === 'RENT' || tx.type === 'VAT' || tx.type === 'EXPENDITURE';
    return false;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isAdmin ? 'Revenue Intelligence' : isSupplier ? 'Settlement Hub' : 'Business Financials'}
          </h2>
          <p className="text-slate-500 text-sm">
            {isAdmin ? 'System-wide revenue tracking: VAT, Tax, Rent, Gate Fees.' : 
             isSupplier ? 'Manage wallet, escrow releases, and withdrawals.' : 
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
        <div className={`text-white p-6 rounded-xl shadow-lg relative overflow-hidden ${isAdmin ? 'bg-slate-900' : isSupplier ? 'bg-blue-900' : 'bg-emerald-900'}`}>
           <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4 text-slate-300">
                 {isSupplier ? <Wallet size={20} /> : <TrendingUp size={20} />}
                 <span className="text-sm font-medium">
                    {isAdmin ? 'Total Revenue Collected' : isSupplier ? 'Available Balance' : 'Net Profit (This Month)'}
                 </span>
               </div>
               <div className="text-3xl font-bold mb-2">
                 {isAdmin ? '124,500,000' : isSupplier ? '12,450,000' : '2,100,000'} <span className="text-lg font-normal opacity-70">UGX</span>
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
                   {isAdmin ? 'Gate & Parking Fees' : isSupplier ? 'Escrow Holdings' : 'Total Expenses'}
               </div>
               <div className="text-2xl font-bold text-slate-900">
                  {isAdmin ? '8,450,000' : isSupplier ? '2,500,000' : '850,000'} <span className="text-sm font-normal text-slate-400">UGX</span>
               </div>
               {isSupplier && <p className="text-xs text-slate-400 mt-1">Funds locked in active requisitions.</p>}
               {isAdmin && <p className="text-xs text-green-600 mt-1">Daily Avg: 280k UGX</p>}
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
                  {isAdmin ? 'Pending Dues (Market-wide)' : isVendor ? 'Pending Rent/Tax' : 'Completed Jobs'}
               </div>
               <div className={`text-2xl font-bold ${isVendor && 650000 > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {isAdmin ? '45,000,000' : isVendor ? '650,000' : '14'} {isVendor || isAdmin ? <span className="text-sm font-normal text-slate-400">UGX</span> : ''}
               </div>
           </div>

           {isVendor && (
               <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
               >
                 Clear Dues <CreditCard size={16} />
               </button>
           )}
           {isAdmin && (
               <button className="mt-4 w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition">
                  View Defaulters
               </button>
           )}
        </div>
      </div>

      {/* --- TRANSACTIONS TABLE --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">
                {isAdmin ? 'Global Ledger' : 'Transaction History'}
            </h3>
            <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Income</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">Expense</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Escrow</span>
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
              {transactions.map(tx => (
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
              {transactions.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- WITHDRAWAL MODAL (Supplier) --- */}
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

      {/* --- PAYMENT MODAL (Vendor) --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Gateway</h3>
              <p className="text-sm text-slate-500 mb-6">Securely clear pending dues or record expenses.</p>
              
              <div className="space-y-3 mb-6">
                <button className="w-full p-4 border border-slate-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition flex items-center justify-between group">
                   <span className="font-medium text-slate-800">MTN Mobile Money</span>
                   <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:bg-yellow-400"></div>
                </button>
                <button className="w-full p-4 border border-slate-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition flex items-center justify-between group">
                   <span className="font-medium text-slate-800">Airtel Money</span>
                   <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:bg-red-400"></div>
                </button>
                <button className="w-full p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-between group">
                   <span className="font-medium text-slate-800">VISA / MasterCard</span>
                   <CreditCard size={18} className="text-slate-400 group-hover:text-blue-500"/>
                </button>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                 <button onClick={() => { alert('Transaction Processed!'); setShowPaymentModal(false); }} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Pay Now</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
