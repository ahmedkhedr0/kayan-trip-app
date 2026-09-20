import React from 'react';
import { Heart, ArrowUp, Ticket, Download } from 'lucide-react';

interface FooterProps {
  companyName: string;
  companySlogan: string;
  whatsappGroupUrl: string;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenInstall?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  companyName,
  companySlogan,
  onOpenBooking,
  onOpenAdmin,
  onOpenInstall
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#081120] border-t border-slate-850 pt-8 pb-24 md:pb-10 text-slate-400 text-xs relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3 text-center sm:text-right">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-cyan-400/40 shadow-md shadow-cyan-950/40 shrink-0 bg-slate-900">
              <img
                src="/kayan-logo.jpg"
                alt="شعار كيان الرسمي"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/kayan-logo.jpg';
                }}
              />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-white">{companyName}</h4>

            </div>
          </div>

          {/* Clean Professional Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold">
            {onOpenInstall && (
              <button
                onClick={onOpenInstall}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل التطبيق على الهاتف</span>
              </button>
            )}
            <button
              onClick={onOpenBooking}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>احجز مقعدك</span>
            </button>
            <a href="#schedule-section" className="text-slate-300 hover:text-cyan-400 transition-colors">
              برنامج الرحلة
            </a>
            <a href="#safety-faq-section" className="text-slate-300 hover:text-cyan-400 transition-colors">
              إرشادات السلامة
            </a>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-white transition-colors"
            >
              لوحة الإدارة
            </button>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:text-white text-slate-300 text-xs transition-colors"
          >
            <span>للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <p>
            المنصة الرسمية لشركه كيان © {new Date().getFullYear()} — تنظيم <span className="text-white font-semibold">{companyName}</span>
          </p>
          <p className="flex items-center justify-center gap-1 text-slate-400">
            تجربة سفر شبابية بمعايير عالمية
            <Heart className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
