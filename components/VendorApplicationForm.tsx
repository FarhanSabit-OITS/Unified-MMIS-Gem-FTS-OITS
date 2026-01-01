import React, { useState } from 'react';
import { CITIES, MARKETS } from '../constants';
import { ShieldCheck, CheckCircle2, User, MapPin, Mail, Phone, ShoppingBag, Upload, FileText } from 'lucide-react';

interface VendorApplicationFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

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
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        // Validate File Size (Max 5MB) & Type
        if (file.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit.');
            return;
        }
        if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
            setError('Invalid file type. Only JPG, PNG, and PDF are allowed.');
            return;
        }

        setKycFile(file);
        setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.marketId || !formData.shopNumber || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!kycFile) {
        setError('Please upload a valid KYC document (ID or Trading License).');
        return;
    }

    // Submit payload
    onSubmit({ ...formData, kycFile });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
        <h3 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
          <ShoppingBag size={16} /> Vendor Application
        </h3>
        <p className="text-xs text-blue-700">
          Complete your profile and upload identification to request shop allocation.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Personal Info */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
            </div>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Phone Number" 
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                />
            </div>
        </div>

        {/* Location Info */}
        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                    value={formData.cityId}
                    onChange={(e) => handleChange('cityId', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                >
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div className="relative">
                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select 
                    value={formData.marketId}
                    onChange={(e) => handleChange('marketId', e.target.value)}
                    disabled={!formData.cityId}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none disabled:bg-slate-100 disabled:text-slate-400"
                >
                    <option value="">Select Market</option>
                    {MARKETS.filter(m => m.cityId === formData.cityId).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Requested Shop Number (e.g. A-101)" 
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.shopNumber}
            onChange={(e) => handleChange('shopNumber', e.target.value)}
          />
        </div>

        <div className="relative">
            <input 
                type="password" 
                placeholder="Create Password" 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
            />
        </div>

        {/* KYC Upload */}
        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer relative ${kycFile ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:bg-slate-50'}`}>
            <input 
                type="file" 
                id="kyc-upload-reg" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png"
            />
            {kycFile ? (
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                    <CheckCircle2 size={20} />
                    <span className="truncate max-w-[200px]">{kycFile.name}</span>
                    <span className="text-xs text-green-500">({(kycFile.size/1024/1024).toFixed(2)}MB)</span>
                </div>
            ) : (
                <div className="flex flex-col items-center text-slate-500">
                    <Upload size={24} className="mb-2 text-blue-500" />
                    <span className="text-sm font-bold">Upload KYC Document</span>
                    <span className="text-xs">National ID or Trading License (Max 5MB)</span>
                </div>
            )}
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
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Submit & Apply <CheckCircle2 size={18} />
        </button>
      </div>
    </div>
  );
};