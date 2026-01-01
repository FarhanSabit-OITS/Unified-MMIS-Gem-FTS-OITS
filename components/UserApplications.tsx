import React, { useState } from 'react';
import { ApplicationStatus } from '../types';
import { VendorApplicationForm } from './VendorApplicationForm';
import { MarketAdminApplicationForm } from './MarketAdminApplicationForm';
import { SupplierApplicationForm } from './SupplierApplicationForm';
import { ApiService } from '../services/api';
import { 
  FileText, Clock, CheckCircle2, XCircle, Building2, MapPin, Calendar,
  AlertCircle, Plus, Store, Briefcase, Loader2, ArrowLeft, Truck
} from 'lucide-react';

export const UserApplications: React.FC = () => {
  const [view, setView] = useState<'LIST' | 'NEW_VENDOR' | 'NEW_ADMIN' | 'NEW_SUPPLIER' | 'SUCCESS_VENDOR'>('LIST');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock Data for User Applications (In real app, fetch via useEffect)
  const [applications, setApplications] = useState([
    {
      id: 'app-001',
      type: 'VENDOR_ACCESS',
      marketName: 'Nakasero Market',
      location: 'Kampala',
      submittedAt: '2023-10-26',
      status: ApplicationStatus.PENDING,
      remarks: 'Your application is currently under review by the Market Administrator.',
      steps: [
        { label: 'Submission', status: 'COMPLETED', date: 'Oct 26, 10:00 AM' },
        { label: 'Document Review', status: 'IN_PROGRESS', date: 'Est. Oct 27' },
        { label: 'KYC Verification', status: 'PENDING', date: '-' },
        { label: 'Final Approval', status: 'PENDING', date: '-' },
      ]
    }
  ]);

  const handleCreateApplication = async (data: any, type: 'VENDOR' | 'ADMIN' | 'SUPPLIER') => {
    setIsSubmitting(true);
    try {
        const formData = new FormData();
        formData.append('type', type);
        
        // Handle different data structures
        if (type === 'VENDOR' && data.documents) {
            // Flatten vendor data
            Object.keys(data).forEach(key => {
                if (key !== 'documents') formData.append(key, data[key]);
            });
            if (data.documents.nid) formData.append('nidDocument', data.documents.nid);
            if (data.documents.license) formData.append('licenseDocument', data.documents.license);
        } else if (type === 'SUPPLIER' && data.document) {
            Object.keys(data).forEach(key => {
                if (key !== 'document') formData.append(key, data[key]);
            });
            formData.append('incorporationDocument', data.document);
        } else {
            // Handle Admin data
            Object.keys(data).forEach(key => formData.append(key, data[key]);
        }

        // API Call
        await ApiService.applications.submit(formData);

        // Optimistic UI Update (Mocking the response structure)
        const newApp = {
            id: `app-${Date.now()}`,
            type: type === 'VENDOR' ? 'VENDOR_ACCESS' : type === 'SUPPLIER' ? 'SUPPLIER_ACCESS' : 'MARKET_ADMIN_ACCESS',
            marketName: type === 'VENDOR' ? 'Pending Assignment' : 'N/A (Global)',
            location: type === 'VENDOR' ? 'Kampala' : data.warehouseLocation || 'Kampala',
            submittedAt: new Date().toISOString().split('T')[0],
            status: ApplicationStatus.PENDING,
            remarks: 'Application submitted successfully. Awaiting administrative review.',
            steps: [
                { label: 'Submission', status: 'COMPLETED', date: 'Just now' },
                { label: 'Document Review', status: 'PENDING', date: '-' },
                { label: 'KYC Verification', status: 'PENDING', date: '-' },
                { label: 'Final Approval', status: 'PENDING', date: '-' },
            ]
        };
        setApplications([newApp, ...applications]);
        
        if (type === 'VENDOR') {
            setView('SUCCESS_VENDOR');
        } else {
            setView('LIST');
        }
    } catch (err) {
        alert("Application submission failed. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED: return 'bg-green-100 text-green-700 border-green-200';
      case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED: return <CheckCircle2 size={18} />;
      case ApplicationStatus.REJECTED: return <XCircle size={18} />;
      default: return <Clock size={18} />;
    }
  };

  if (view === 'SUCCESS_VENDOR') {
      return (
        <div className="max-w-lg mx-auto py-12 text-center animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">KYC Pending</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
                Your application has been successfully submitted. Your documents are currently under review by our compliance team. You will be notified once the verification is complete.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-500 font-bold">Status</span>
                    <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-100">Under Review</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-1/3 animate-pulse"></div>
                </div>
            </div>
            <button 
                onClick={() => setView('LIST')}
                className="text-blue-600 font-bold hover:text-blue-700 flex items-center justify-center gap-2 mx-auto"
            >
                <ArrowLeft size={16} /> Return to Applications
            </button>
        </div>
      );
  }

  if (view === 'NEW_VENDOR') {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">New Vendor Application</h2>
        {isSubmitting ? (
            <div className="text-center py-20">
                <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                <p>Submitting your documents securely...</p>
            </div>
        ) : (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <VendorApplicationForm 
                onCancel={() => setView('LIST')}
                onSubmit={(data) => handleCreateApplication(data, 'VENDOR')}
            />
            </div>
        )}
      </div>
    );
  }

  if (view === 'NEW_ADMIN') {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Market Admin Application</h2>
            {isSubmitting ? (
                <div className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                    <p>Verifying domain credentials...</p>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <MarketAdminApplicationForm
                    onCancel={() => setView('LIST')}
                    onSubmit={(data) => handleCreateApplication(data, 'ADMIN')}
                />
                </div>
            )}
        </div>
    );
  }

  if (view === 'NEW_SUPPLIER') {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">New Supplier Application</h2>
            {isSubmitting ? (
                <div className="text-center py-20">
                    <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                    <p>Submitting business details...</p>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <SupplierApplicationForm
                    onCancel={() => setView('LIST')}
                    onSubmit={(data) => handleCreateApplication(data, 'SUPPLIER')}
                />
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>
          <p className="text-slate-500 text-sm">Track the status of your role access requests.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
            <button 
            onClick={() => setView('NEW_ADMIN')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors text-sm"
            >
            <Briefcase size={16} /> Market Admin
            </button>
            <button 
            onClick={() => setView('NEW_SUPPLIER')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors text-sm"
            >
            <Truck size={16} /> Supplier Access
            </button>
            <button 
            onClick={() => setView('NEW_VENDOR')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors text-sm"
            >
            <Plus size={16} /> Vendor Access
            </button>
        </div>
      </div>

      <div className="grid gap-6">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600 h-fit">
                  {app.type === 'VENDOR_ACCESS' ? <Store size={24} /> : 
                   app.type === 'SUPPLIER_ACCESS' ? <Truck size={24} /> :
                   <FileText size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {app.type.replace('_', ' ')}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status}
                    </span>
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Building2 size={14} /> {app.marketName}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {app.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> Submitted: {app.submittedAt}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">ID: {app.id}</span>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="p-6 bg-slate-50/50 overflow-x-auto">
              <div className="relative flex justify-between mb-8 min-w-[600px]">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                
                {app.steps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center bg-transparent group">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                      step.status === 'COMPLETED' ? 'bg-green-600 border-green-600 text-white' :
                      step.status === 'FAILED' ? 'bg-red-600 border-red-600 text-white' :
                      step.status === 'IN_PROGRESS' ? 'bg-amber-500 border-amber-500 text-white animate-pulse' :
                      'bg-white border-slate-300 text-slate-400'
                    }`}>
                      {step.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : 
                       step.status === 'FAILED' ? <XCircle size={14} /> :
                       idx + 1}
                    </div>
                    <span className={`text-xs font-bold mt-2 ${
                        step.status === 'PENDING' ? 'text-slate-400' : 'text-slate-800'
                    }`}>{step.label}</span>
                    <span className="text-[10px] text-slate-400">{step.date}</span>
                  </div>
                ))}
              </div>

              {/* Feedback / Remarks */}
              <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                 app.status === ApplicationStatus.REJECTED ? 'bg-red-50 border-red-100 text-red-800' :
                 app.status === ApplicationStatus.APPROVED ? 'bg-green-50 border-green-100 text-green-800' :
                 'bg-blue-50 border-blue-100 text-blue-800'
              }`}>
                 <AlertCircle size={20} className="shrink-0 mt-0.5" />
                 <div>
                    <div className="font-bold text-sm uppercase mb-1">Status Update</div>
                    <p className="text-sm">{app.remarks}</p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};