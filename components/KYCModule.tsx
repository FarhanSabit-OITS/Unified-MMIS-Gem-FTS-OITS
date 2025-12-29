import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export const KYCModule: React.FC = () => {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('NID');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files) setFile(e.target.files[0]);
  };

  const submitKYC = () => {
      setTimeout(() => {
          setStep(3); // Success
      }, 1500);
      setStep(2); // Loading
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Identity Verification (KYC)</h2>
            <p className="text-slate-500 text-sm mt-1">To ensure safety, all vendors and suppliers must be verified.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Document Type</label>
                        <select 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                        >
                            <option value="NID">National ID Card</option>
                            <option value="PASSPORT">Passport</option>
                            <option value="LICENSE">Trading License</option>
                        </select>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                        <input type="file" className="hidden" id="doc-upload" onChange={handleUpload} />
                        <label htmlFor="doc-upload" className="cursor-pointer">
                            <Upload className="mx-auto text-blue-500 mb-2" size={32} />
                            <p className="font-bold text-slate-700">Click to Upload Document</p>
                            <p className="text-xs text-slate-500 mt-1">JPEG, PNG or PDF (Max 5MB)</p>
                            {file && <p className="mt-4 text-sm font-bold text-green-600 flex items-center justify-center gap-1"><FileText size={16}/> {file.name}</p>}
                        </label>
                    </div>

                    <button 
                        disabled={!file}
                        onClick={submitKYC}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-lg"
                    >
                        Submit for Verification
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in-95">
                    <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-900">Processing...</h3>
                    <p className="text-slate-500 text-sm">Validating document format and integrity.</p>
                </div>
            )}

            {step === 3 && (
                <div className="py-8 flex flex-col items-center justify-center animate-in zoom-in-95 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Verification Pending</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-sm">
                        Your document has been uploaded successfully. A market administrator will review your application within 24 hours.
                    </p>
                    <button onClick={() => setStep(1)} className="mt-6 text-blue-600 font-bold hover:underline">Back to Dashboard</button>
                </div>
            )}
        </div>
    </div>
  );
};
