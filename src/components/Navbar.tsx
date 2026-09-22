import React, { useState, useEffect } from 'react';
import { Play, ShieldCheck, AlertCircle, Download, Music } from 'lucide-react';
import { audioPlayer } from '../utils/audioPlayer';

interface NavbarProps {
  companyName: string;
  tripTitle?: string;
  companySlogan?: string;
  destination?: string;
  destinationBadge?: string;
  customLogoUrl?: string;
  whatsappGroupUrl?: string;
  urgentNotice?: string;
  showNotice?: boolean;
  onOpenBooking?: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onOpenInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  companyName,
  tripTitle,
  destination,
  destinationBadge,
  customLogoUrl,
  urgentNotice,
  showNotice,
  onOpenAdmin,
  isAdminLoggedIn,
  onOpenInstall
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((state) => {
      setIsPlaying(state.isPlaying);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const toggleSound = async () => {
    try {
      await audioPlayer.togglePlay();
    } catch (e) {
      console.error('Failed to toggle sound:', e);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#081120]/95 backdrop-blur-xl border-b border-slate-700/60 shadow-lg shadow-black/40'
          : 'bg-[#081120]/90 backdrop-blur-md border-b border-slate-700/40'
      }`}
    >
      {/* 📢 Top Urgent Alert Bar - Always Visible & Never Hidden */}
      {showNotice && urgentNotice && urgentNotice.trim() !== '' && (
        <div
          id="top-urgent-announcement-bar"
          className="w-full bg-gradient-to-r from-sky-950 via-[#0b243d] to-cyan-950 border-b border-cyan-400/40 px-3 py-1.5 sm:py-2 text-center shadow-md relative z-50"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-cyan-200">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300"></span>
            </span>
            <span className="leading-normal">{urgentNotice}</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between">
        
        {/* Brand & Logo - Elegant, balanced, soothing */}
        <div className="flex items-center gap-2.5 sm:gap-3 select-none min-w-0">
          
          {/* Official KAYAN Logo Emblem */}
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 overflow-hidden border border-cyan-400/40 shadow-sm shadow-cyan-950/60 bg-slate-900">
            <img
              src={customLogoUrl || '/kayan-logo.jpg'}
              alt="شعار كيان KAYAN"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/kayan-logo.jpg';
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>

          {/* Brand Titles */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-tech font-extrabold text-sm sm:text-base tracking-wide text-white group-hover:text-cyan-300 transition-colors">
                KAYAN
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-cyan-300/90 bg-cyan-950/60 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                كيان
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 truncate">
              <span className="text-cyan-400 font-medium" dir="ltr">
                AIN SOKHNA
              </span>
              <span className="text-slate-600 hidden xs:inline">•</span>
              <span className="text-slate-400 font-normal hidden xs:inline">الرحلة الرسمية</span>
            </div>
          </div>

        </div>

        {/* Action Controls: Music, Install & Admin */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Music Player Button - Softer, elegant & non-intrusive */}
          <button
            id="nav-audio-toggle"
            onClick={toggleSound}
            aria-label={isPlaying ? 'إيقاف الأغنية' : 'تشغيل أغنية الرحلة'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 ${
              isPlaying
                ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-950/50'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-750 text-slate-300 hover:text-white border-slate-700/80'
            }`}
          >
            {isPlaying ? (
              <>
                <span className="flex items-end gap-0.5 h-3 px-0.5">
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite] h-2.5" />
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-[bounce_0.9s_infinite] h-3.5" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_0.7s_infinite] h-2" />
                </span>
                <span className="hidden sm:inline">إيقاف</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-cyan-400 fill-cyan-400 shrink-0" />
                <span className="hidden sm:inline">الأغنية</span>
              </>
            )}
            <Music className="w-3.5 h-3.5 text-cyan-400/80 sm:hidden" />
          </button>

          {/* App Install Button - Clean & Chic */}
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              title="تثبيت التطبيق على الهاتف"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-all duration-200 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden sm:inline">تثبيت التطبيق</span>
              <span className="sm:hidden">تثبيت</span>
            </button>
          )}

          {/* Admin Login Button - Discreet & Refined */}
          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? 'لوحة التحكم (نشطة)' : 'تسجيل دخول المشرفين'}
            aria-label="تسجيل دخول المنظمين"
            className={`p-1.5 sm:p-2 rounded-xl text-xs border transition-all duration-200 active:scale-95 ${
              isAdminLoggedIn
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
