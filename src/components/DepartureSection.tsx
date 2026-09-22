import React from 'react';
import { Navigation, MapPin, MessageSquare, ExternalLink, CheckCircle, Ticket, Clock } from 'lucide-react';
import { Supervisor } from '../types';

interface DepartureSectionProps {
  departureTime: string;
  gatheringTime: string;
  gatheringLocation: string;
  gatheringMapsUrl: string;
  busCount: number;
  supervisors?: Supervisor[];
  whatsappGroupUrl: string;
  onOpenBooking: () => void;
}

export const DepartureSection: React.FC<DepartureSectionProps> = ({
  departureTime,
  gatheringTime,
  gatheringLocation,
  gatheringMapsUrl,
  whatsappGroupUrl,
  onOpenBooking
}) => {
  return (
    <section id="departure-section" className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
      
      {/* Section Header - Compact and clear */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/25 px-3 py-0.5 rounded-full mb-1.5">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-tech uppercase text-[11px]">Departure & Gathering</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            نقطة وموعد التجمع والانطلاق الرسمي
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
          حضورك قبل الموعد بنصف ساعة يضمن استلام كارت الباص والبادج  بسلاسة تامة.
        </p>
      </div>

      {/* Main Grid: Compact & Streamlined */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4">
        
        {/* Timing Highlights (5 cols on md/lg) */}
        <div className="md:col-span-5 flex flex-col gap-3">
          
          {/* Combined compact timing card */}
          <div className="bg-slate-900/70 border border-cyan-500/25 rounded-2xl p-4 shadow-md backdrop-blur-md flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-3 divide-x divide-x-reverse divide-slate-800">
              
              {/* Gathering Time */}
              <div className="text-right">
                <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>موعد التجمع</span>
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-tech">
                  {gatheringTime}
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  تسليم البادجات وكروت الباصات
                </p>
              </div>

              {/* Departure Time */}
              <div className="pr-3 text-right">
                <span className="text-[11px] font-bold text-sky-300 flex items-center gap-1 mb-1">
                  <Navigation className="w-3 h-3 text-sky-400" />
                  <span>انطلاق الأسطول</span>
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-tech">
                  {departureTime}
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  تحرك الباصات مباشرة للسخنة
                </p>
              </div>

            </div>

            {/* Micro action buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800">
              <button
                onClick={onOpenBooking}
                className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-sm transition-transform"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>احجز الآن</span>
              </button>

              <a
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-sm transition-transform"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>جروب الواتساب</span>
              </a>
            </div>
          </div>

        </div>

        {/* Location Card (7 cols) */}
        <div className="md:col-span-7 bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-md backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>موقع التجمع المحدد للرحلة</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md font-tech">
                STADIUM GATHERING POINT
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white mb-1.5 leading-snug">
              {gatheringLocation}
            </h3>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              تنتظر باصات شركة كيان أمام مسجد الاستاد مباشرة، مع لافتات باسم الرحلة و استقبال مخصص.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#0b1628] border border-slate-800 text-slate-200">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>موقع واسع وسهل الوصول</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#0b1628] border border-slate-800 text-slate-200">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>تواجد المنظمين من 5:45 ص</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">للوصول السهل بالملاحة:</span>
            <a
              href={gatheringMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>خرائط Google Maps</span>
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};
