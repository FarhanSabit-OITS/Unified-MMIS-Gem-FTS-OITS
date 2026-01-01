import React, { useState } from 'react';
import { CITIES } from '../constants';
import { ShieldAlert, CheckCircle2, Building2, User, MapPin, Mail, Lock } from 'lucide-react';
import { z } from 'zod';

interface MarketAdminApplicationFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

// Zod Schema for Admin
const adminSchema = z.object({
  businessName: z.string().min(3, "Business/Entity Name is too short"),
  contactPerson: z.string().min(3, "Contact Person Name is required"),
  email: z.string().email("Invalid email").refine(val => val.endsWith('@mmis.tevas.ug'), {
    message: "Restricted Access: Must use an official @mmis.tevas.ug domain"
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  cityId: z.string().min(1, "Please select a target city"),
});

export const MarketAdminApplicationForm: React.FC<MarketAdminApplicationFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    password: '',
    cityId: ''
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit Requirement: Alert Popup for Invalid Domain
    if (!formData.email.endsWith('@mmis.tevas.ug')) {
        alert("SECURITY ALERT: Access Denied.\n\nYou must use an official '@mmis.tevas.ug' domain to apply for Market Administration.");
        setGlobalError("Invalid Domain: Official credentials required.");
        return;
    }

    // Validate with Zod
    const result = adminSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setGlobalError('Please fix the validation errors.');
      return;
    }

    // Submit payload
    onSubmit(formData);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
        <h3 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
          <Building2 size={16} /> Market Admin Application
        </h3>
        <p className="text-xs text-blue-700">
          This application will be routed to the Super Admin for verification. 
          Official domain credentials are required.
        </p>
      </div>

      {globalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          {globalError}
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Official Business/Entity Name" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.businessName ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
          />
          {errors.businessName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.businessName}</p>}
        </div>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Contact Person Name" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.contactPerson ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
          />
          {errors.contactPerson && <p className="text-xs text-red-500 mt-1 ml-1">{errors.contactPerson}</p>}
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="email" 
            placeholder="Official Email (@mmis.tevas.ug)" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="password" 
            placeholder="Set Password" 
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={formData.cityId}
            onChange={(e) => handleChange('cityId', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white ${errors.cityId ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
          >
            <option value="">Select Target City</option>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.cityId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.cityId}</p>}
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
          className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          Submit Application <CheckCircle2 size={18} />
        </button>
      </div>
    </div>
  );
};