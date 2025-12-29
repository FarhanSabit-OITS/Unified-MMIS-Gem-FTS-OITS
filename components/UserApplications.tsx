import React from 'react';
import { ApplicationStatus } from '../types';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  MapPin, 
  Calendar,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const UserApplications: React.FC = () => {
  // Mock Data for User Applications
  const applications = [
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
    },
    {
      id: 'app-002',
      type: 'SUPPLIER_ACCESS',
      marketName: 'Owino Market',
      location: 'Kampala',
      submittedAt: '2023-09-15',
      status: ApplicationStatus.REJECTED,
      remarks: 'Application rejected due to missing tax clearance certificate.',
      steps: [
        { label: 'Submission', status: 'COMPLETED', date: 'Sep 15, 09:30 AM' },
        { label: 'Document Review', status: 'FAILED', date: 'Sep 16, 02:00 PM' },
        { label: 'Final Decision', status: 'COMPLETED', date: 'Sep 16, 02:00 PM' },
      ]
    }
  ];

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>
        <p className="text-slate-500 text-sm">Track the status of your role access requests.</p>
      </div>

      <div className="grid gap-6">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600 h-fit">
                  <FileText size={24} />
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
            <div className="p-6 bg-slate-50/50">
              <div className="relative flex justify-between mb-8">
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
