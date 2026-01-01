import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ShieldCheck, Loader2 } from 'lucide-react';

interface VendorKYCFormProps {
  onSuccess: () => void;
}

export const VendorKYCForm: React.FC<VendorKYCFormProps> = ({ onSuccess }) => {
  const [documents, setDocuments] = useState<{
    nid: File | null;
    license: File | null;
  }>({ nid: null, license: null });

  const [errors, setErrors] = useState<{ nid?: string; license?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, or PDF.';
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const handleFileChange = (type: 'nid' | 'license', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);
      
      if (error) {
        setErrors(prev => ({ ...prev, [type]: error }));
        setDocuments(prev => ({ ...prev, [type]: null }));
      } else {
        setErrors(prev => ({ ...prev, [type]: undefined }));
        setDocuments(prev => ({ ...prev, [type]: file }));
      }
    }
  };

  const removeFile = (type: 'nid' | 'license') => {
      setDocuments(prev => ({ ...prev, [type]: null }));
      setErrors(prev => ({ ...prev, [type]: undefined }));
  };

  const handleSubmit = () => {
    if (!documents.nid || !documents.license) {
      alert("Please upload both required documents.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate Backend API Upload
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
        <ShieldCheck className="text-blue-600 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Vendor Verification Required</h4>
          <p className="text-xs text-blue-700 mt-1">
            Per Market Authority regulations, all vendors must provide a valid National ID/Passport 
            and a current Trading License to operate.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NID Upload */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">1. National ID / Passport *</label>
          <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition relative h-40 ${
            documents.nid ? 'border-green-400 bg-green-50' : errors.nid ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              id="nid-upload" 
              accept=".jpg,.png,.pdf"
              onChange={(e) => handleFileChange('nid', e)} 
            />
            {documents.nid ? (
                <div className="flex flex-col items-center z-10 pointer-events-none">
                  <CheckCircle2 className="text-green-600 mb-2" size={32} />
                  <p className="font-bold text-green-800 text-sm truncate max-w-[150px]">{documents.nid.name}</p>
                  <p className="text-xs text-green-600">{(documents.nid.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            ) : (
                <div className="flex flex-col items-center z-10 pointer-events-none">
                  <Upload className={`${errors.nid ? 'text-red-400' : 'text-slate-400'} mb-2`} size={32} />
                  <p className="font-bold text-slate-600 text-sm">Drag & Drop or Click</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                </div>
            )}
            {documents.nid && (
                <button 
                    onClick={(e) => { e.preventDefault(); removeFile('nid'); }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:text-red-500 z-20"
                >
                    <X size={14} />
                </button>
            )}
          </div>
          {errors.nid && (
            <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.nid}
            </div>
          )}
        </div>

        {/* License Upload */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">2. Trading License *</label>
          <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition relative h-40 ${
            documents.license ? 'border-green-400 bg-green-50' : errors.license ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              id="license-upload" 
              accept=".jpg,.png,.pdf"
              onChange={(e) => handleFileChange('license', e)} 
            />
            {documents.license ? (
                <div className="flex flex-col items-center z-10 pointer-events-none">
                  <CheckCircle2 className="text-green-600 mb-2" size={32} />
                  <p className="font-bold text-green-800 text-sm truncate max-w-[150px]">{documents.license.name}</p>
                  <p className="text-xs text-green-600">{(documents.license.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            ) : (
                <div className="flex flex-col items-center z-10 pointer-events-none">
                  <FileText className={`${errors.license ? 'text-red-400' : 'text-slate-400'} mb-2`} size={32} />
                  <p className="font-bold text-slate-600 text-sm">Drag & Drop or Click</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                </div>
            )}
            {documents.license && (
                <button 
                    onClick={(e) => { e.preventDefault(); removeFile('license'); }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:text-red-500 z-20"
                >
                    <X size={14} />
                </button>
            )}
          </div>
          {errors.license && (
            <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.license}
            </div>
          )}
        </div>
      </div>

      <button 
        disabled={!documents.nid || !documents.license || isSubmitting}
        onClick={handleSubmit}
        className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
      >
        {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : 'Submit Documents for Verification'}
      </button>
    </div>
  );
};