import React, { useState } from 'react';
import { Clock, MapPin, Compass, Utensils, Hotel, Sparkles, Waves, Sun, MessageSquare } from 'lucide-react';
import { ScheduleItem } from '../types';

interface ScheduleTimelineProps {
  schedule: ScheduleItem[];
  showSchedule?: boolean;
  scheduleUnannouncedText?: string;
  whatsappGroupUrl?: string;
  onOpenBooking?: () => void;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  schedule,
  showSchedule = true,
  scheduleUnannouncedText,
  whatsappGroupUrl
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'activity' | 'food' | 'departure'>('all');

  // Hidden for now — will be re-enabled once the day's program is finalized
  const scheduleReady = false;

  // If schedule is hidden or not determined yet
  if (!showSchedule || !scheduleReady) {
    return (
      <section id="schedule-section" className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-[#0b172a]/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>جدول الفعاليات والأنشطة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2.5">
            ستعرض قريباً ⏳
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mx-auto mb-6 leading-relaxed">
            {scheduleUnannouncedText ||
              'يجري حالياً تنسيق جدول الفقرات والمفاجآت الميدانية وسوف يتم الإعلان عنها وتحديثها هنا وقبل موعد الرحلة عبر جروب الواتساب الرسمي.'}
          </p>
          {whatsappGroupUrl && (
            <a
              href={whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>متابعة إعلان تفاصيل البرنامج عبر جروب الواتساب</span>
            </a>
          )}
        </div>
      </section>
    );
  }

  const filteredSchedule = activeFilter === 'all'
    ? schedule
    : schedule.filter((item) => {
        if (activeFilter === 'activity') {
          return item.category === 'activity' || item.category === 'entertainment';
        }
        return item.category === activeFilter;
      });

  const getCategoryMeta = (category: ScheduleItem['category']) => {
    switch (category) {
      case 'departure':
        return {
          label: 'انطلاق وسفر',
          bg: 'bg-sky-500/15 text-sky-200 border-sky-400/30',
          dot: 'border-sky-400 bg-sky-900',
          icon: Compass
        };
      case 'hotel':
        return {
          label: 'استقبال وكبائن',
          bg: 'bg-indigo-500/15 text-indigo-200 border-indigo-400/30',
          dot: 'border-indigo-400 bg-indigo-900',
          icon: Hotel
        };
      case 'activity':
        return {
          label: 'فعاليات ومغامرة',
          bg: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30',
          dot: 'border-cyan-400 bg-cyan-900',
          icon: Waves
        };
      case 'food':
        return {
          label: 'بوفيه وطعام',
          bg: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
          dot: 'border-amber-400 bg-amber-900',
          icon: Utensils
        };
      case 'entertainment':
        return {
          label: 'غروب وسهرة',
          bg: 'bg-rose-500/15 text-rose-200 border-rose-400/30',
          dot: 'border-rose-400 bg-rose-900',
          icon: Sun
        };
      case 'rest':
      default:
        return {
          label: 'استرخاء بحري',
          bg: 'bg-teal-500/15 text-teal-200 border-teal-400/30',
          dot: 'border-teal-400 bg-teal-900',
          icon: Sparkles
        };
    }
  };

  return (
    <section id="schedule-section" className="py-8 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
      
      {/* Creative Section Header - Compact */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/25 px-3 py-0.5 rounded-full mb-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>مسار رحلة السخنة الرسمية | الجمعة 28/11/2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            برنامج اليوم الميداني الشامل
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            تسلسل زمني مريح لجميع فعاليات الرحلة من لحظة التجمع وحتى العودة
          </p>
        </div>

        {/* Category Filter Pills - Compact */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900/80 border border-slate-700/60 rounded-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            الكل ({schedule.length})
          </button>
          <button
            onClick={() => setActiveFilter('activity')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'activity'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🌊 الفوم والألوان
          </button>
          <button
            onClick={() => setActiveFilter('food')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'food'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🍽️ الغداء
          </button>
          <button
            onClick={() => setActiveFilter('departure')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFilter === 'departure'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🚌 السفر والعودة
          </button>
        </div>
      </div>

      {/* Timeline Cards - Sleek & Comfortable */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-4 bottom-4 right-3.5 sm:right-5 w-0.5 bg-gradient-to-b from-cyan-400/50 via-slate-700/40 to-transparent pointer-events-none" />

        <div className="space-y-3 sm:space-y-3.5">
          {filteredSchedule.map((item, idx) => {
            const meta = getCategoryMeta(item.category);
            const IconComp = meta.icon;
            const stepNumber = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={item.id || idx}
                className="relative pr-8 sm:pr-12 group transition-all"
              >
                {/* Node Dot */}
                <div
                  className={`absolute right-2 sm:right-3.5 top-4 w-3.5 h-3.5 rounded-full border-2 ${meta.dot} shadow-[0_0_8px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform shrink-0`}
                />

                {/* Event Card */}
                <div className="bg-slate-900/60 border border-slate-700/50 hover:border-cyan-400/40 rounded-2xl p-3.5 sm:p-4 transition-all shadow-sm backdrop-blur-sm">
                  
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                        #{stepNumber}
                      </span>
                      <span className="text-xs font-black text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{item.time}</span>
                      </span>
                    </div>

                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.bg}`}>
                      <IconComp className="w-3 h-3" />
                      <span>{meta.label}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-300 transition-colors mb-1">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Location footer */}
                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/70">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
