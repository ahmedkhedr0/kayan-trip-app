import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sun, Sparkles, CheckCircle2, Ticket, Bell } from 'lucide-react';

interface CountdownCardProps {
  tripStartDate: string;
  countdownHeadline?: string;
  destinationBadge?: string;
  tripTitle: string;
  destination: string;
  tripPrice: string;
  weather: {
    temp: number;
    condition: string;
    tip: string;
    high: number;
    low: number;
  };
  onOpenBooking: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({
  tripStartDate,
  countdownHeadline,
  destinationBadge,
  tripTitle,
  destination,
  tripPrice,
  weather,
  onOpenBooking
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(tripStartDate) - +new Date();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPast: false
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [tripStartDate]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const formattedDate = new Date(tripStartDate).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = new Date(tripStartDate).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const generateGoogleCalendarUrl = () => {
    const start = new Date(tripStartDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(+new Date(tripStartDate) + 3 * 24 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      tripTitle
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      `رحلة طلبة شركة كيان إلى ${destination}`
    )}&location=${encodeURIComponent(destination)}`;
  };

  return (
    <section id="countdown-section" className="py-6 sm:py-8 relative z-20 -mt-6 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Main Countdown Box (Span 2) */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{countdownHeadline || 'العد التنازلي لانطلاق الفوج'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {timeLeft.isPast ? 'بدأت المغامرة الآن! 🎉' : 'الوقت المتبقي حتى ساعة التحرك'}
              </h2>
            </div>

            <div className="text-right sm:text-left">
              <span className="text-xs text-slate-400 block font-medium">موعد الانطلاق المحدد</span>
              <span className="text-xs sm:text-sm font-bold text-amber-300">
                {formattedDate} • {formattedTime}
              </span>
            </div>
          </div>

          {/* Countdown Digit Blocks */}
          {timeLeft.isPast ? (
            <div className="py-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white mb-1">الفوج انطلق رسمياً!</h3>
              <p className="text-xs text-emerald-300">نتمنى لجميع طلاب كيان أمتع وأسعد الأوقات في هذه الرحلة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-3.5">
              {/* Days */}
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-inner group hover:border-amber-500/40 transition-colors">
                <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-amber-400 font-mono tracking-tight">
                  {pad(timeLeft.days)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1">يـوم</span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-inner group hover:border-amber-500/40 transition-colors">
                <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                  {pad(timeLeft.hours)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1">ساعة</span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-inner group hover:border-amber-500/40 transition-colors">
                <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                  {pad(timeLeft.minutes)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1">دقيقة</span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-[#0b1120] border border-slate-800 shadow-inner group hover:border-amber-500/40 transition-colors">
                <span className="text-2xl sm:text-4xl lg:text-5xl font-black text-amber-300 font-mono tracking-tight animate-pulse">
                  {pad(timeLeft.seconds)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1">ثانية</span>
              </div>
            </div>
          )}

          {/* Quick Tools & Booking trigger */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>العداد متزامن لحظياً بتوقيت مصر</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-colors"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>احجز مكانك</span>
              </button>

              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">تقويم Google</span>
              </a>
            </div>
          </div>

        </div>

        {/* Destination Weather & Advice Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>طقس الوجهة المتوقع</span>
              </div>
              <span className="text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                {destination.split('،')[0]}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white">{weather.temp}°</span>
              <span className="text-xs font-medium text-slate-400">مئوية</span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-amber-300 mb-2">
              {weather.condition}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
              <span>العظمى: <strong className="text-slate-200">{weather.high}°</strong></span>
              <span>•</span>
              <span>الصغرى: <strong className="text-slate-200">{weather.low}°</strong></span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0b1120] border border-slate-800/90 text-xs text-slate-300 leading-relaxed">
              💡 <strong className="text-amber-300">نصيحة الفريق: </strong>
              {weather.tip}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>تحديثات مستمرة لسلامتكم</span>
            <span className="text-emerald-400 font-semibold">جاهزية تامة</span>
          </div>
        </div>

      </div>
    </section>
  );
};
