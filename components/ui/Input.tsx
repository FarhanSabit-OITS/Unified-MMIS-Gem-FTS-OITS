import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  icon?: LucideIcon;
  multiline?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  icon: Icon, 
  className = '', 
  multiline = false,
  ...props 
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        {multiline ? (
          <textarea 
            className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm`}
            rows={4}
            {...(props as any)}
          />
        ) : (
          <input 
            className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400`}
            {...(props as any)}
          />
        )}
      </div>
    </div>
  );
};