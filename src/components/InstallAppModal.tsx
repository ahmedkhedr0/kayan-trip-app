import React, { useState } from 'react';
import { Download, Share2, Smartphone, CheckCircle, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const result = await install();
      if (result) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (e) {
      console.error('Install error:', e);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div
      id="pwa-install-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md p-5 sm:p-7 shadow-2xl shadow-black/80 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="text-center relative z-10 mb-5">
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-cyan-400/40 overflow-hidden mx-auto mb-3 shadow-md shadow-cyan-950/50">
            <img src="/kayan-logo.jpg" alt="شعار كيان" className="w-full h-full object-cover" />
          </div>

          <span className="inline-block px-3 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/20 text-[11px] font-semibold text-cyan-300 mb-2 font-sans">
            تطبيق الهاتف السريع (PWA)
          </span>

          <h3 className="text-lg sm:text-xl font-bold text-white">
            تثبيت تطبيق رحلة كيان
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            ثبّت التطبيق على شاشة هاتفك لتصفح الجداول، التنبيهات، والبرنامج مباشرة وبسرعة
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="space-y-2 mb-5 text-xs text-slate-200">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750/70 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
              ⚡
            </div>
            <div>
              <span className="font-semibold text-white block">خفيف وسريع جداً</span>
              <span className="text-[11px] text-slate-400">يعمل فوراً دون أخذ مساحة من ذاكرة هاتفك.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750/70 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
              📶
            </div>
            <div>
              <span className="font-semibold text-white block">يعمل بدون اتصال بالإنترنت</span>
              <span className="text-[11px] text-slate-400">تصفح مسار الطريق والجداول حتى مع ضعف الشبكة.</span>
            </div>
          </div>
        </div>

        {/* Action Flow */}
        {installSuccess ? (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-center font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>تم تثبيت التطبيق بنجاح على جهازك!</span>
          </div>
        ) : isInstalled ? (
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
            <span className="text-xs font-bold text-cyan-300 block">
              ✅ التطبيق مثبت بالفعل على هذا الجهاز
            </span>
            <p className="text-[11px] text-slate-400">
              يمكنك فتحه الآن مباشرة من قائمة التطبيقات على شاشتك.
            </p>
          </div>
        ) : isInstallable ? (
          /* Native Chrome/Android/Edge Instant Install */
          <div className="space-y-2.5">
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isInstalling ? 'جاري التثبيت...' : 'تثبيت التطبيق على الهاتف الآن'}</span>
            </button>
            <p className="text-[10px] sm:text-[11px] text-slate-400 text-center">
              سيظهر لك إشعار المتصفح، اختر "تثبيت / Install" لإضافته للشاشة.
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Safari Step-by-step Guide */
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5 text-right">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>طريقة التثبيت على أجهزة الآيفون (iOS Safari):</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-1.5 pr-4 list-decimal leading-relaxed">
              <li>
                اضغط على زر <strong className="text-white">المشاركة (Share)</strong> ⎋ في متصفح سفاري Safari.
              </li>
              <li>
                مرّر لأسفل واختر <strong className="text-cyan-300">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong> ➕.
              </li>
              <li>
                اضغط على <strong className="text-white">"إضافة" (Add)</strong> بالأعلى.
              </li>
            </ol>
          </div>
        ) : (
          /* Desktop / General Browser Fallback Guide */
          <div className="space-y-2.5">
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تثبيت التطبيق الآن</span>
            </button>
            <p className="text-[10px] sm:text-[11px] text-slate-400 text-center leading-relaxed">
              أو من قائمة المتصفح (⋮) اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة للشاشة الرئيسية"</strong>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
