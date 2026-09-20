import React from 'react';
import { MessageSquare, Ticket } from 'lucide-react';

interface MobileStickyCtaProps {
  onOpenBooking: () => void;
  whatsappGroupUrl: string;
  tripPrice: string;
}

export const MobileStickyCta: React.FC<MobileStickyCtaProps> = ({
  onOpenBooking,
  whatsappGroupUrl
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081120]/95 backdrop-blur-xl border-t border-slate-700/60 px-3.5 py-2 shadow-xl safe-area-bottom">
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        
        {/* Booking Button - No Price Inside */}
        <button
          onClick={onOpenBooking}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-transform"
        >
          <Ticket className="w-4 h-4" />
          <span>احجز الآن</span>
        </button>

        {/* Cheerful, Joyful WhatsApp Button (مبهج) */}
        <a
          href={whatsappGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 border border-emerald-300/40"
          title="جروب الواتساب"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-300 rounded-full animate-ping" />
          </div>
          <span>الجروب 💬✨</span>
        </a>

      </div>
    </div>
  );
};
