import React, { useState } from 'react';
import { Truck, CheckCircle2, Building2, User, MapPin, Mail, Phone, FileText, Upload, X, ShieldCheck } from 'lucide-react';
import { z } from 'zod';

interface SupplierApplicationFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const supplierSchema = z.object({
  companyName: z.string().min(3, "Company Name is required"),
  tinNumber: z.string().min(8, "Valid TIN Number is required"),
  contactPerson: z.string().min(3, "Contact Person Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be valid"),
  warehouseLocation: z.string().min(3, "Warehouse location is required"),
  categories: z.string().min(3, "Please specify supply categories"),
});

export const SupplierApplicationForm: React.FC<SupplierApplicationFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    tinNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    warehouseLocation: '',
    categories: ''
  });
  
  const [document, setDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setDocument(e.target.files[0]);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    
    // Validate with Zod
    const result = supplierSchema.safeParse(formData);

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

    if (!document) {
        setGlobalError('Please upload your Certificate of Incorporation.');
        return;
    }

    // Submit payload
    onSubmit({ ...formData, document });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-4">
        <h3 className="text-sm font-bold text-purple-900 mb-1 flex items-center gap-2">
          <Truck size={16} /> Supplier Network Application
        </h3>
        <p className="text-xs text-purple-700">
          Join the MMIS Supplier Network to view requisitions and bid on contracts. Verification required.
        </p>
      </div>

      {globalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          {globalError}
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Business Profile</h4>
        
        {/* Business Info */}
        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Registered Company Name" 
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none ${errors.companyName ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                />
                {errors.companyName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.companyName}</p>}
            </div>
            <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="TIN Number" 
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none ${errors.tinNumber ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    value={formData.tinNumber}
                    onChange={(e) => handleChange('tinNumber', e.target.value)}
                />
                {errors.tinNumber && <p className="text-xs text-red-500 mt-1 ml-1">{errors.tinNumber}</p>}
            </div>
        </div>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Contact Person Full Name" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none ${errors.contactPerson ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
          />
          {errors.contactPerson && <p className="text-xs text-red-500 mt-1 ml-1">{errors.contactPerson}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="email" 
                    placeholder="Official Email" 
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
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
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
            </div>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Warehouse / Headquarters Location" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none ${errors.warehouseLocation ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.warehouseLocation}
            onChange={(e) => handleChange('warehouseLocation', e.target.value)}
          />
          {errors.warehouseLocation && <p className="text-xs text-red-500 mt-1 ml-1">{errors.warehouseLocation}</p>}
        </div>

        <div className="relative">
          <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Supply Categories (e.g. Fresh Produce, Electronics, Packaging)" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none ${errors.categories ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.categories}
            onChange={(e) => handleChange('categories', e.target.value)}
          />
          {errors.categories && <p className="text-xs text-red-500 mt-1 ml-1">{errors.categories}</p>}
        </div>

        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mt-6">Compliance Documents</h4>
        
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition relative">
            <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png"
            />
            {document ? (
                <div className="flex flex-col items-center">
                    <CheckCircle2 className="text-green-600 mb-2" size={32} />
                    <p className="font-bold text-slate-800">{document.name}</p>
                    <p className="text-xs text-slate-500">{(document.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                        onClick={(e) => { e.preventDefault(); setDocument(null); }}
                        className="mt-2 text-xs text-red-600 hover:underline z-10 relative"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <>
                    <Upload className="text-slate-400 mb-2" size={32} />
                    <p className="font-bold text-slate-700">Upload Certificate of Incorporation</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                </>
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
          className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          Submit Application <CheckCircle2 size={18} />
        </button>
      </div>
    </div>
  );
};