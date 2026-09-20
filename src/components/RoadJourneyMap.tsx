import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Coffee,
  Compass,
  Bus,
  Waves,
  Mountain,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Fuel
} from 'lucide-react';
import { RoadStop } from '../types';

interface StopMilestone {
  id: string;
  time: string;
  title: string;
  location: string;
  desc: string;
  type?: 'departure' | 'highway' | 'rest' | 'scenic' | 'arrival';
  icon?: any;
  distanceFromStart: string;
}

const DEFAULT_ROAD_STOPS: StopMilestone[] = [
  {
    id: 'stop-1',
    time: '06:00 ص',
    title: 'نقطة التجمع والانطلاق',
    location: 'طنطا — شارع الاستاد أمام مسجد الاستاد',
    desc: 'حضور جميع الطلبة، مطابقة الأسماء والكشوفات مع مشرف كل باص، والصعود للمقاعد.',
    type: 'departure',
    icon: MapPin,
    distanceFromStart: '0 كم'
  },
  {
    id: 'stop-2',
    time: '07:15 ص',
    title: 'الدائري الإقليمي وطريق السويس',
    location: 'الطريق السريع المفتوح',
    desc: 'بداية الأجواء الحماسية وتوزيع السناكس ومسابقات وتحديات الباص الصباحية.',
    type: 'highway',
    icon: Bus,
    distanceFromStart: '85 كم'
  },
  {
    id: 'stop-3',
    time: '08:00 ص',
    title: 'محطة الاستراحة الرئيسية (استراحة وطنية)',
    location: 'طريق العين السخنة السريع',
    desc: 'توقف مريح لمدة 25 دقيقة (دورات مياه، فريش كوفي، فطور، وشراء أي مستلزمات متبقية).',
    type: 'rest',
    icon: Coffee,
    distanceFromStart: '160 كم'
  },
  {
    id: 'stop-4',
    time: '08:50 ص',
    title: 'بوابة السخنة وطريق جبل الجلالة الساحلي',
    location: 'مدخل العين السخنة',
    desc: 'إطلالات طبيعية ساحرة بين الجبال والبحر الأحمر، مع أول لمحة لمياه السخنة الفيروزية.',
    type: 'scenic',
    icon: Mountain,
    distanceFromStart: '215 كم'
  },
  {
    id: 'stop-5',
    time: '09:30 ص',
    title: 'شاطئ ونادي الجوهرة — العين السخنة',
    location: 'الوجهة الرسمية للرحلة',
    desc: 'الوصول واستلام مقاعد الشاطئ والشماسي وبدء برنامج اليوم والسباحة الحرة.',
    type: 'arrival',
    icon: Waves,
    distanceFromStart: '245 كم'
  }
];

interface RoadJourneyMapProps {
  gatheringLocation?: string;
  destination?: string;
  gatheringMapsUrl?: string;
  roadStops?: RoadStop[];
}

export const RoadJourneyMap: React.FC<RoadJourneyMapProps> = ({
  gatheringLocation = 'طنطا — شارع الاستاد',
  destination = 'العين السخنة — نادي الجوهرة',
  gatheringMapsUrl,
  roadStops
}) => {
  const stopsToRender = roadStops && roadStops.length > 0
    ? roadStops.map((s, idx) => ({
        ...s,
        icon: idx === 0 ? MapPin : idx === roadStops.length - 1 ? Waves : idx === 1 ? Bus : idx === 2 ? Coffee : Mountain
      }))
    : DEFAULT_ROAD_STOPS;

  const [activeStop, setActiveStop] = useState<string>(
    stopsToRender[Math.min(2, stopsToRender.length - 1)]?.id || 'stop-1'
  );

  const lastStop = stopsToRender[stopsToRender.length - 1];
  const totalDistance = lastStop?.distanceFromStart || '~245 كم';

  return (
    <section id="road-journey-section" className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="bg-gradient-to-br from-[#081528]/95 via-[#05101f]/98 to-[#020710]/98 border border-cyan-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800/90 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-sky-400/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-inner shrink-0">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase font-tech">
                  INTERACTIVE ROAD MAP & STOPS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                  خط سير مباشر
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                خريطة المسار ومحطات توقف الحافلات 🗺️🚌
              </h2>
            </div>
          </div>

          {gatheringMapsUrl && (
            <a
              href={gatheringMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all self-start sm:self-auto shadow-sm"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>فتح المسار في Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">إجمالي المسافة</span>
            <div className="text-lg sm:text-xl font-black text-white font-tech">
              {totalDistance}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">وقت الطريق المتوقع</span>
            <div className="text-lg sm:text-xl font-black text-cyan-300 font-tech">
              ~3.5 <span className="text-xs font-sans text-slate-400">ساعات</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">محطات ووقفات المسار</span>
            <div className="text-lg sm:text-xl font-black text-amber-300 font-tech">
              {stopsToRender.length} <span className="text-xs font-sans text-slate-400">محطات</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">نوع الحافلات</span>
            <div className="text-lg sm:text-xl font-black text-emerald-300 font-tech">
              VIP <span className="text-xs font-sans text-slate-400">سياحي مكيف</span>
            </div>
          </div>
        </div>

        {/* Vertical Timeline / Milestones */}
        <div className="relative z-10 space-y-4">
          <div className="relative pr-6 before:absolute before:top-3 before:bottom-3 before:right-2.5 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-sky-400 before:to-emerald-500">
            {stopsToRender.map((stop) => {
              const IconComp = stop.icon || MapPin;
              const isActive = activeStop === stop.id;

              return (
                <div
                  key={stop.id}
                  onClick={() => setActiveStop(stop.id)}
                  className={`relative mb-4 last:mb-0 p-4 rounded-2xl transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-slate-900/95 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  {/* Node Circle */}
                  <div
                    className={`absolute -right-6 top-5 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-cyan-400 border-white ring-4 ring-cyan-500/30'
                        : 'bg-slate-900 border-slate-600'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-300">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white">
                        {stop.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-md">
                        {stop.time}
                      </span>
                      {stop.distanceFromStart && (
                        <span className="font-mono text-slate-400 text-[11px]">
                          ({stop.distanceFromStart})
                        </span>
                      )}
                    </div>
                  </div>

                  {stop.location && (
                    <div className="text-xs text-cyan-400 font-semibold mb-1">
                      📍 {stop.location}
                    </div>
                  )}

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {stop.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bus Journey Etiquette & Tips */}
        <div className="mt-6 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white block">
              تعليمات مهمة لراحة وأمان جميع الطلاب أثناء الطريق:
            </span>
            <p className="leading-relaxed">
              الالتزام بالمقاعد المخصصة، اتباع تعليمات مشرف الباص، الحفاظ على نظافة الحافلة، وعدم التأخر عن مدة الاستراحة لضمان وصول الفوج مبكراً للشاطئ.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

