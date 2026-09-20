import React from 'react';
import { ShieldCheck, Settings, Sparkles } from 'lucide-react';

interface SideAdminButtonProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const SideAdminButton: React.FC<SideAdminButtonProps> = ({
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  return (
    <aside
      aria-label="أدوات إدارة الرحلة"
      className="fixed bottom-20 md:bottom-24 right-3 md:right-4 z-40 group"
    >
      <button
        id="side-admin-floating-btn"
        onClick={onOpenAdmin}
        className={`flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
          isAdminLoggedIn
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50 shadow-emerald-950/40'
            : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700/80 hover:border-amber-500/50 shadow-slate-950/50 backdrop-blur-md'
        }`}
        title="دخول الأدمن لتعديل المواعيد والبيانات"
      >
        <div className="relative">
          <ShieldCheck className={`w-4 h-4 ${isAdminLoggedIn ? 'text-white' : 'text-amber-400'}`} />
          {isAdminLoggedIn && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
          )}
        </div>

        <span className="text-xs font-bold hidden sm:inline">
          {isAdminLoggedIn ? 'تحكم الأدمن (نشط)' : 'لوحة الأدمن'}
        </span>

        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 group-hover:scale-150 transition-transform" />
      </button>
    </aside>
  );
};
