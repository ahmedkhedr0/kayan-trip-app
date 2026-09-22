import React from 'react';
import { Navigation, Compass } from 'lucide-react';
import { RoadStop } from '../types';

interface RoadJourneyMapProps {
  gatheringLocation?: string;
  destination?: string;
  gatheringMapsUrl?: string;
  roadStops?: RoadStop[];
}

export const RoadJourneyMap: React.FC<RoadJourneyMapProps> = () => {
  return (
    <section id="road-journey-section" className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="bg-gradient-to-br from-[#081528]/95 via-[#05101f]/98 to-[#020710]/98 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-3">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>خريطة المسار ومحطات التوقف</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2.5">
            ستعرض قريباً 🗺️
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mx-auto leading-relaxed">
            جاري تجهيز خريطة المسار ومحطات توقف الحافلات بالتفصيل، وسيتم تفعيلها هنا قريباً قبل موعد الرحلة.
          </p>
        </div>

      </div>
    </section>
  );
};

