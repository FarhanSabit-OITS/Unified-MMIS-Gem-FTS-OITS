import React, { useState } from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { VendorKYCForm } from './VendorKYCForm';

export const KYCModule: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleSubmitSuccess = () => {
      setStep(2); // Processing state handled by Form, jump to Success or Intermediate
      setTimeout(() => {
          setStep(3); // Success/Pending
      }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Identity Verification (KYC)</h2>
            <p className="text-slate-500 text-sm mt-1">To ensure safety, all vendors and suppliers must be verified.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
            {step === 1 && (
                <VendorKYCForm onSuccess={handleSubmitSuccess} />
            )}

            {step === 2 && (
                <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in-95">
                    <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-900">Finalizing...</h3>
                    <p className="text-slate-500 text-sm">Encrypting and storing your documents.</p>
                </div>
            )}

            {step === 3 && (
                <div className="py-8 flex flex-col items-center justify-center animate-in zoom-in-95 text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">KYC Pending Approval</h3>
                    <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                        Your National ID and Trading License have been successfully uploaded. 
                        A Market Administrator will review your application within 24 hours.
                    </p>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full max-w-md mb-6">
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <span>Status</span>
                            <span className="text-amber-600">Under Review</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full w-1/2 animate-pulse"></div>
                        </div>
                    </div>

                    <button onClick={() => setStep(1)} className="text-blue-600 font-bold hover:underline text-sm">Back to Dashboard</button>
                </div>
            )}
        </div>
    </div>
  );
};