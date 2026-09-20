import React from 'react';
import { MessageSquare, Users, Sparkles, ExternalLink, ArrowLeft, ShieldCheck, HeartHandshake } from 'lucide-react';

interface WhatsAppCommunityProps {
  whatsappGroupUrl: string;
  whatsappSupportNumber: string;
  tripTitle: string;
  onOpenBooking: () => void;
}

export const WhatsAppCommunity: React.FC<WhatsAppCommunityProps> = ({
  whatsappGroupUrl,
  whatsappSupportNumber,
  tripTitle,
  onOpenBooking
}) => {
  return (
    <section id="whatsapp-section" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Text & Pitch */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>مجتمع طلبة رحلة كيان الرسمي</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-snug">
              انضم لجروب الواتساب الرسمي وتعرّف على زملائك بالفوج! 💬
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              كل التحديثات الحية لحظة بلحظة، صور وفيديوهات الرحلة، تنسيق تسكين الغرف بالباص والفندق، ومسابقات وأجواء الطريق اليومية مع المشرفين وزملائك في جروب واحد.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-lg">
                <Users className="w-3.5 h-3.5" />
                <span>جروب معتمد ومراقب من إدارة كيان</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/50 px-3 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>إعلانات مواعيد التجمع أولاً بأول</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <a
              href={whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 group"
            >
              <MessageSquare className="w-5 h-5 fill-slate-950" />
              <span>دخول جروب الواتساب الآن</span>
              <ExternalLink className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </a>

            <button
              onClick={onOpenBooking}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-105 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>احجز مكانك في الفوج الآن</span>
            </button>

            <p className="text-center text-[11px] text-slate-400">
              لأي استفسار فوري عبر الواتساب: <span className="text-emerald-400 font-semibold" dir="ltr">{whatsappSupportNumber}</span>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
