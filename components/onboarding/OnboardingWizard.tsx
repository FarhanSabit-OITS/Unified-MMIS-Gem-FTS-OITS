import React, { useState } from 'react';
import { Store, User, ShieldCheck, ChevronRight, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile, UserRole } from '../../types';
import { VendorKYCForm } from '../VendorKYCForm';

interface OnboardingWizardProps {
  user: UserProfile;
  onComplete: () => void;
  onCancel: () => void;
}

export const OnboardingWizard = ({ user, onComplete, onCancel }: OnboardingWizardProps) => {
  const [step, setStep] = useState(1);
  const steps = [
    { title: 'Welcome', description: 'Let\'s get you set up in MMIS.', icon: Store },
    { title: 'Identity', description: 'Confirm your profile details.', icon: User },
    { title: 'Security', description: 'Configure your security settings.', icon: ShieldCheck },
  ];

  const needsKYC = user.role === UserRole.VENDOR || user.role === UserRole.SUPPLIER;

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl p-10 animate-in fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(step/steps.length)*100}%` }} />
        </div>

        <div className="flex justify-between items-center mb-8">
           <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Step {step} of {steps.length}</span>
           <div className="flex gap-1">
             {steps.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full ${i+1 <= step ? 'bg-indigo-600' : 'bg-slate-200'}`} />)}
           </div>
        </div>

        <div className="flex gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0">
            {React.createElement(steps[step-1].icon, { className: 'text-white w-8 h-8' })}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{steps[step-1].title}</h2>
            <p className="text-slate-500 text-lg">{steps[step-1].description}</p>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <p className="text-slate-600 leading-relaxed">
              MMIS is a powerful ecosystem for scaling e-commerce operations. Whether you are buying or selling, we've got you covered.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-indigo-100 rounded-xl p-4 hover:border-indigo-600 cursor-pointer transition-all bg-indigo-50/30">
                <Users className="text-indigo-600 mb-2" />
                <h4 className="font-bold">Consumer</h4>
                <p className="text-xs text-slate-500">I want to browse products.</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 hover:border-indigo-600 cursor-pointer transition-all">
                <Store className="text-slate-400 mb-2" />
                <h4 className="font-bold">Partner</h4>
                <p className="text-xs text-slate-500">I want to sell or supply.</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            {needsKYC ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <VendorKYCForm onSuccess={() => setStep(3)} />
                </div>
            ) : (
                <>
                    <Input label="Display Name" value={user.name} readOnly />
                    <Input label="Email" value={user.email} disabled />
                    <div className="p-4 bg-amber-50 rounded-lg flex gap-3 border border-amber-100">
                        <AlertCircle className="text-amber-600 shrink-0" />
                        <p className="text-sm text-amber-800">Your current role is <strong>{user.role}</strong>. You can apply for upgrades in the dashboard.</p>
                    </div>
                </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><CheckCircle2 /></div>
                <div>
                  <h4 className="font-bold">Email Verified</h4>
                  <p className="text-xs text-slate-500">Authenticated via token.</p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-semibold">Ready</span>
            </div>
            
            {needsKYC && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><ShieldCheck /></div>
                        <div>
                        <h4 className="font-bold">KYC Documents Submitted</h4>
                        <p className="text-xs text-slate-500">Pending administrative review.</p>
                        </div>
                    </div>
                    <span className="text-blue-600 text-sm font-semibold">Submitted</span>
                </div>
            )}

            <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center"><ShieldCheck /></div>
                <div>
                  <h4 className="font-bold">Two-Factor Auth</h4>
                  <p className="text-xs text-slate-500">Secure your account.</p>
                </div>
              </div>
              <Button variant="secondary" className="text-xs">Configure</Button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          <Button variant="ghost" onClick={() => step > 1 ? setStep(step-1) : onCancel()}>
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {/* Hide Continue on Step 2 if KYC is required, as the form handles progression */}
          {!(step === 2 && needsKYC) && (
              <Button onClick={() => step < steps.length ? setStep(step+1) : onComplete()}>
                {step === steps.length ? 'Go to Dashboard' : 'Continue'} <ChevronRight className="w-4 h-4" />
              </Button>
          )}
        </div>
      </Card>
    </div>
  );
};