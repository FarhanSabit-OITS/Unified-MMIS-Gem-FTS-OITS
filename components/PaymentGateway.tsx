import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle2, Loader2, X, ShieldCheck } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  description: string;
  onSuccess: (txId: string, method: string) => void;
  onClose: () => void;
  taxAmount?: number;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, description, onSuccess, onClose, taxAmount = 0 }) => {
  const [method, setMethod] = useState<'MTN' | 'AIRTEL' | 'CARD' | 'CASH'>('MTN');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

  const handlePay = () => {
    setStatus('PROCESSING');
    // Simulate API Delay
    setTimeout(() => {
        setStatus('SUCCESS');
        // Auto close after success
        setTimeout(() => {
            onSuccess(`TX-${Math.floor(Math.random() * 1000000)}`, method === 'MTN' ? 'MTN_MOMO' : method === 'AIRTEL' ? 'AIRTEL_MONEY' : method === 'CARD' ? 'VISA' : 'CASH');
        }, 1500);
    }, 2000);
  };

  const total = amount; // Assumption: amount passed is already total (Net + Tax)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Secure Checkout</span>
                </div>
                <h3 className="text-xl font-bold">MMIS Payments</h3>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24}/></button>
        </div>

        <div className="p-6 space-y-6">
            {/* Amount Display */}
            <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Payable</p>
                <div className="text-3xl font-black text-slate-900">{total.toLocaleString()} <span className="text-sm text-slate-500 font-medium">UGX</span></div>
                {taxAmount > 0 && (
                    <div className="text-xs text-slate-400 mt-1 flex justify-center gap-2">
                        <span>Net: {(total - taxAmount).toLocaleString()}</span>
                        <span>•</span>
                        <span>VAT (18%): {taxAmount.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {status === 'SUCCESS' ? (
                <div className="py-10 flex flex-col items-center justify-center text-center animate-in zoom-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">Payment Approved</h4>
                    <p className="text-sm text-slate-500">Transaction completed successfully.</p>
                </div>
            ) : status === 'PROCESSING' ? (
                <div className="py-10 flex flex-col items-center justify-center text-center animate-pulse">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                    <h4 className="text-lg font-bold text-slate-900">Processing Request...</h4>
                    <p className="text-sm text-slate-500 max-w-xs">Please check your mobile phone for the approval prompt (PIN).</p>
                </div>
            ) : (
                <>
                    {/* Method Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setMethod('MTN')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'MTN' ? 'border-yellow-400 bg-yellow-50 text-slate-900' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center font-black text-xs">MTN</div>
                            <span className="text-xs font-bold">MoMo</span>
                        </button>
                        <button 
                            onClick={() => setMethod('AIRTEL')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'AIRTEL' ? 'border-red-500 bg-red-50 text-slate-900' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-xs">Airtel</div>
                            <span className="text-xs font-bold">Money</span>
                        </button>
                        <button 
                            onClick={() => setMethod('CARD')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'CARD' ? 'border-blue-600 bg-blue-50 text-slate-900' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><CreditCard size={20}/></div>
                            <span className="text-xs font-bold">Card</span>
                        </button>
                        <button 
                            onClick={() => setMethod('CASH')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'CASH' ? 'border-emerald-600 bg-emerald-50 text-slate-900' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">UGX</div>
                            <span className="text-xs font-bold">Cash</span>
                        </button>
                    </div>

                    {/* Inputs */}
                    {(method === 'MTN' || method === 'AIRTEL') && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
                            <div className="flex items-center border border-slate-300 rounded-lg px-3 bg-white">
                                <Smartphone size={16} className="text-slate-400 mr-2"/>
                                <span className="text-sm font-medium text-slate-600 mr-1">+256</span>
                                <input 
                                    type="text" 
                                    className="flex-1 py-3 outline-none text-sm font-bold tracking-widest"
                                    placeholder="7XX 123 456"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handlePay}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Pay {total.toLocaleString()} UGX
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};