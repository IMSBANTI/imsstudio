import React from 'react';
import { useStudio } from '../context/StudioContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function Toast() {
  const { toast } = useStudio();
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold backdrop-blur-md ${
        isError
          ? 'bg-rose-950/90 text-rose-200 border-rose-800'
          : isInfo
          ? 'bg-blue-950/90 text-blue-200 border-blue-800'
          : 'bg-[#161b22]/95 text-white border-[#E5252A]/50'
      }`}>
        {isError ? (
          <AlertCircle size={17} className="text-rose-400" />
        ) : isInfo ? (
          <Info size={17} className="text-blue-400" />
        ) : (
          <CheckCircle2 size={17} className="text-emerald-400" />
        )}
        <span>{toast.text}</span>
      </div>
    </div>
  );
}
