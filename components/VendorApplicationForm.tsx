import React, { useState } from 'react';
import { CITIES, MARKETS } from '../constants';
import { ShieldCheck, CheckCircle2, User, MapPin, Mail, Phone, ShoppingBag, Upload, FileText, AlertCircle, X } from 'lucide-react';
import { z } from 'zod';

interface VendorApplicationFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

// Zod Schema Definition
const vendorSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be valid"),
  cityId: z.string().min(1, "Please select a city"),
  marketId: z.string().min(1, "Please select a market"),
  shopNumber: z.string().min(1, "Shop number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const VendorApplicationForm: React.FC<VendorApplicationFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cityId: '',
    marketId: '',
    shopNumber: '',
    password: ''
  });
  
  const [documents, setDocuments] = useState<{
    nid: File | null;
    license: File | null;
  }>({ nid: null, license: null });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileErrors, setFileErrors] = useState<{ nid?: string; license?: string }>({});
  const [globalError, setGlobalError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setGlobalError('');
  };

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Use JPG, PNG, or PDF.';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const handleFileChange = (type: 'nid' | 'license', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const error = validateFile(file);

        if (error) {
            setFileErrors(prev => ({ ...prev, [type]: error }));
            setDocuments(prev => ({ ...prev, [type]: null }));
        } else {
            setFileErrors(prev => ({ ...prev, [type]: undefined }));
            setDocuments(prev => ({ ...prev, [type]: file }));
        }
        setGlobalError('');
    }
  };

  const removeFile = (type: 'nid' | 'license') => {
      setDocuments(prev => ({ ...prev, [type]: null }));
      setFileErrors(prev => ({ ...prev, [type]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    
    // Validate with Zod
    const result = vendorSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setGlobalError('Please fix the errors in the form.');
      return;
    }

    if (!documents.nid || !documents.license) {
        setGlobalError('Both National ID and Trading License are required.');
        return;
    }

    if (fileErrors.nid || fileErrors.license) {
        setGlobalError('Please resolve file validation errors.');
        return;
    }

    // Submit payload
    onSubmit({ ...formData, documents });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
        <h3 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
          <ShoppingBag size={16} /> Vendor Application
        </h3>
        <p className="text-xs text-blue-700">
          Complete your profile and upload identification to request shop allocation.
        </p>
      </div>

      {globalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          {globalError}
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Business Details</h4>
        
        {/* Personal Info */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Full Legal Name" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.fullName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Phone Number" 
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
            </div>
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                    value={formData.cityId}
                    onChange={(e) => handleChange('cityId', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none ${errors.cityId ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                >
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.cityId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.cityId}</p>}
            </div>
            <div className="relative">
                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                    value={formData.marketId}
                    onChange={(e) => handleChange('marketId', e.target.value)}
                    disabled={!formData.cityId}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none disabled:bg-slate-100 disabled:text-slate-400 ${errors.marketId ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                >
                    <option value="">Select Market</option>
                    {MARKETS.filter(m => m.cityId === formData.cityId).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
                {errors.marketId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.marketId}</p>}
            </div>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Requested Shop Number (e.g. A-101)" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.shopNumber ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.shopNumber}
            onChange={(e) => handleChange('shopNumber', e.target.value)}
          />
          {errors.shopNumber && <p className="text-xs text-red-500 mt-1 ml-1">{errors.shopNumber}</p>}
        </div>

        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mt-6">Security</h4>
        <div className="relative">
            <input 
                type="password" 
                placeholder="Create Password" 
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
        </div>

        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mt-6">KYC Documents</h4>
        
        <div className="grid grid-cols-1 gap-4">
            {/* National ID Upload */}
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">1. National ID / Passport *</label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer relative ${documents.nid ? 'border-green-400 bg-green-50' : fileErrors.nid ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                    <input 
                        type="file" 
                        id="nid-upload-reg" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange('nid', e)}
                        accept=".pdf,.jpg,.png"
                    />
                    {documents.nid ? (
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2 text-green-700 font-bold">
                                <CheckCircle2 size={18} />
                                <span className="truncate max-w-[180px] text-sm">{documents.nid.name}</span>
                            </div>
                            <button onClick={(e) => { e.preventDefault(); removeFile('nid'); }} className="z-10 p-1 bg-white rounded-full shadow hover:text-red-500">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-slate-500 py-2">
                            <Upload size={20} className="mb-1 text-blue-500" />
                            <span className="text-xs">Upload Scan (Max 5MB)</span>
                        </div>
                    )}
                </div>
                {fileErrors.nid && <p className="text-xs text-red-500 mt-1">{fileErrors.nid}</p>}
            </div>

            {/* Trading License Upload */}
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">2. Trading License *</label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer relative ${documents.license ? 'border-green-400 bg-green-50' : fileErrors.license ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                    <input 
                        type="file" 
                        id="license-upload-reg" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange('license', e)}
                        accept=".pdf,.jpg,.png"
                    />
                    {documents.license ? (
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2 text-green-700 font-bold">
                                <CheckCircle2 size={18} />
                                <span className="truncate max-w-[180px] text-sm">{documents.license.name}</span>
                            </div>
                            <button onClick={(e) => { e.preventDefault(); removeFile('license'); }} className="z-10 p-1 bg-white rounded-full shadow hover:text-red-500">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-slate-500 py-2">
                            <FileText size={20} className="mb-1 text-purple-500" />
                            <span className="text-xs">Upload License (Max 5MB)</span>
                        </div>
                    )}
                </div>
                {fileErrors.license && <p className="text-xs text-red-500 mt-1">{fileErrors.license}</p>}
            </div>
        </div>

      </div>

      <div className="pt-4 flex gap-3">
        <button 
          onClick={onCancel}
          type="button" 
          className="flex-1 py-3 text-slate-500 hover:bg-slate-50 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          type="button" 
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          Submit & Apply <CheckCircle2 size={18} />
        </button>
      </div>
    </div>
  );
};