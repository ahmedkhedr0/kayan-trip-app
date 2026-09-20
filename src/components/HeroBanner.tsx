import React, { useState, useEffect } from 'react';
import { Calendar, MessageSquare, Ticket, AlertCircle, Sparkles, Clock, Compass } from 'lucide-react';
import defaultBannerImage from '../assets/images/kayan_sokhna_banner.jpg';

interface HeroBannerProps {
  companyName: string;
  companySlogan: string;
  tripTitle: string;
  destination: string;
  destinationBadge?: string;
  tripStartDate: string;
  countdownHeadline?: string;
  departureTime: string;
  gatheringLocation: string;
  bannerHeadline: string;
  bannerSubheadline: string;
  customBannerImage?: string;
  urgentNotice?: string;
  showNotice?: boolean;
  busCount: number;
  totalSeats: number;
  supervisorsCount: number;
  whatsappGroupUrl: string;
  tripPrice: string;
  onShare: () => void;
  onOpenBooking: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  companyName,
  tripTitle,
  destination,
  destinationBadge,
  tripStartDate,
  countdownHeadline,
  bannerHeadline,
  bannerSubheadline,
  customBannerImage,
  urgentNotice,
  showNotice,
  whatsappGroupUrl,
  onOpenBooking
}) => {
  const bannerSrc = customBannerImage && customBannerImage.trim() !== '' ? customBannerImage : defaultBannerImage;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      let target: number;
      if (tripStartDate) {
        const parsed = new Date(tripStartDate).getTime();
        target = !isNaN(parsed) ? parsed : new Date(2026, 10, 28, 6, 0, 0).getTime();
      } else {
        target = new Date(2026, 10, 28, 6, 0, 0).getTime();
      }
      const now = Date.now();

      if (target <= now) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const difference = target - now;

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

  const dateObj = tripStartDate ? new Date(tripStartDate) : null;
  const dynamicDateBadge = dateObj && !isNaN(dateObj.getTime())
    ? `${dateObj.getDate()}/${dateObj.getMonth() + 1}`
    : '';
  const dynamicDateString = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })
    : '28 نوفمبر';

  return (
    <section id="hero-banner-section" className="relative pt-20 pb-6 sm:pt-24 sm:pb-8 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Featured Official Banner Image - Sleek and proportional */}
        <div className="rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/80 shadow-xl mb-5 relative group">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-slate-950">
            <img
              src="/banner.jpg"
              alt="بانر رحلة كيان الرسمية"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = bannerSrc;
              }}
            />
          </div>
        </div>

        {/* Content Box - Streamlined, cheerful, light on the eyes */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          
          {/* Friendly Status Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-400/30 text-cyan-200 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-tech tracking-wider text-cyan-300 font-bold">
              {dynamicDateString}
            </span>
            <span className="text-slate-500">•</span>
            <span>{destinationBadge || destination ? `${tripTitle} | ${destinationBadge || destination}` : tripTitle}</span>
          </div>

          {/* Main Title - Balanced Scale */}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {bannerHeadline || tripTitle}
          </h1>

          {/* Subtitle - Pleasant readable size */}
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
            {bannerSubheadline || `${destinationBadge || destination} — شمس وبحر وفوم وكالر فستيفال وتصوير درون سينمائي ولمة باص الضحكة فيها طالعة من القلب.`}
          </p>

          {/* 🏖️ COMPACT, CHEERFUL & EYE-FRIENDLY COUNTDOWN TIMER 🌊 */}
          <div className="my-4 max-w-md mx-auto">
            <div className="bg-slate-900/70 border border-cyan-500/25 rounded-2xl p-3 sm:p-3.5 shadow-lg backdrop-blur-md">
              
              {/* Cheerful Mini Title */}
              <div className="flex items-center justify-center gap-1.5 mb-2.5 text-xs font-bold text-cyan-200">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{countdownHeadline && countdownHeadline.trim() !== '' ? countdownHeadline : 'متبقي على موعد انطلاق الرحلة'}</span>
                {dynamicDateBadge && (
                  <span className="font-tech text-amber-300 font-black" dir="ltr">({dynamicDateBadge})</span>
                )}
              </div>

              {/* Countdown Content */}
              {timeLeft.isPast ? (
                <div className="py-3 px-3 text-center bg-emerald-950/60 border border-emerald-500/30 rounded-xl my-1">
                  <span className="text-sm font-bold text-emerald-300 block mb-0.5">
                    🎉 انطلقت الرحلة رسمياً!
                  </span>
                  <p className="text-[11px] text-slate-300">
                    نتمنى لجميع مسافري كيان قضاء أسعد اللحظات والذكريات
                  </p>
                </div>
              ) : (
                /* 4 Compact Digital Cards */
                <div className="grid grid-cols-4 gap-2" dir="rtl">
                  
                  {/* Days */}
                  <div className="bg-[#0e1b30] border border-cyan-500/20 rounded-xl py-2 px-1 text-center shadow-sm">
                    <span className="block text-xl sm:text-2xl font-black font-tech text-cyan-300">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold block mt-0.5">
                      يوم
                    </span>
                  </div>

                  {/* Hours */}
                  <div className="bg-[#0e1b30] border border-cyan-500/20 rounded-xl py-2 px-1 text-center shadow-sm">
                    <span className="block text-xl sm:text-2xl font-black font-tech text-sky-300">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold block mt-0.5">
                      ساعة
                    </span>
                  </div>

                  {/* Minutes */}
                  <div className="bg-[#0e1b30] border border-cyan-500/20 rounded-xl py-2 px-1 text-center shadow-sm">
                    <span className="block text-xl sm:text-2xl font-black font-tech text-teal-300">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold block mt-0.5">
                      دقيقة
                    </span>
                  </div>

                  {/* Seconds */}
                  <div className="bg-[#0e1b30] border border-cyan-500/20 rounded-xl py-2 px-1 text-center shadow-sm">
                    <span className="block text-xl sm:text-2xl font-black font-tech text-amber-300">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold block mt-0.5">
                      ثانية
                    </span>
                  </div>

                </div>
              )}

              {/* Sub-label reminder */}
              <p className="mt-2 text-[11px] text-center text-slate-300 font-medium">
                ✨ باب الحجز مفتوح الآن للطلبة — المقاعد محدودة
              </p>

            </div>
          </div>

          {/* Action Buttons: Compact, comfortable and joyful */}
          <div className="flex flex-row items-center justify-center gap-2.5 pt-1 max-w-sm mx-auto">
            
            {/* Booking Button (NO PRICE INSIDE) */}
            <button
              id="hero-book-btn"
              onClick={onOpenBooking}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/25 transition-all border border-cyan-200"
            >
              <Ticket className="w-4 h-4" />
              <span>احجز الآن</span>
            </button>

            {/* Joyful, Vibrant WhatsApp Group Button */}
            <a
              id="hero-whatsapp-btn"
              href={whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 transition-all border border-emerald-200 group"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950 transition-transform group-hover:scale-110" />
              <span>جروب الواتساب 💬</span>
            </a>

          </div>

        </div>

      </div>
    </section>
  );
};
