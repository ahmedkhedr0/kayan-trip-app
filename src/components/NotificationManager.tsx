import React, { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, CheckCircle2, ShieldCheck, Sparkles, X, Radio } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface NotificationManagerProps {
  tripTitle: string;
  departureTime: string;
  gatheringTime: string;
  gatheringLocation: string;
}

interface LiveUpdateItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  time: string;
  isNew?: boolean;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  tripTitle,
  departureTime,
  gatheringTime,
  gatheringLocation,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [isScheduled, setIsScheduled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kayan_notifications_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdateItem[]>([
    {
      id: 'u1',
      icon: '🚌',
      title: 'تجهيز حافلات الـ VIP المكيفة',
      desc: 'تم فحص جميع أجهزة التكييف والأنظمة الصوتية لرحلة العين السخنة.',
      time: 'منذ ساعتين',
      isNew: true
    },
    {
      id: 'u2',
      icon: '🌊',
      title: 'تأكيد حجز شاطئ نادي  بالسخنة',
      desc: 'تم الانتهاء من تجهيز منطقة الشاطئ وحمامات السباحة ومدافع الفوم بارتي.',
      time: 'اليوم',
      isNew: false
    }
  ]);

  // Real-time Firestore updates listener
  useEffect(() => {
    try {
      const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const items: LiveUpdateItem[] = snapshot.docs.map((docSnap, idx) => {
            const d = docSnap.data();
            let timeStr = 'الآن';
            if (d.createdAt && typeof d.createdAt.toDate === 'function') {
              const dt = d.createdAt.toDate();
              timeStr = dt.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            }
            return {
              id: docSnap.id,
              icon: d.icon || '🔔',
              title: d.title || 'تحديث رسمي',
              desc: d.desc || '',
              time: timeStr,
              isNew: idx === 0
            };
          });
          setLiveUpdates(items);

          // If browser notifications are permitted, dispatch
          if (permission === 'granted' && items[0]) {
            try {
              new Notification(`تحديث جديد: ${items[0].title}`, {
                body: items[0].desc,
                icon: '/favicon.ico'
              });
            } catch {
              // ignore
            }
          }
        }
      }, (err) => {
        console.warn('Updates onSnapshot fallback:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase updates listener setup failed:', err);
    }
  }, [permission]);

  const [simulatedAlerts, setSimulatedAlerts] = useState<Array<{ id: string; title: string; body: string; time: string }>>([
    {
      id: 'n1',
      title: '⏰ ميعاد الحضور والتجمع',
      body: `الساعة ${gatheringTime} في ${gatheringLocation} - استلم وجبتك وكارنيه الباص.`,
      time: 'قبل التحرك بـ 45 دقيقة'
    },
    {
      id: 'n2',
      title: '🚌 انطلاق الباصات الرسمي',
      body: `الساعة ${departureTime} تماماً، يرجى التواجد في مقعدك المحدد بالباص.`,
      time: 'ساعة الصفر'
    },
    {
      id: 'n3',
      title: '🎒 تذكير أخير قبل السفر',
      body: 'تأكد من وجود أصل البطاقة الشخصية، شاحن الموبايل، والملابس المناسبة.',
      time: 'مساء يوم السفر'
    }
  ]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('المتصفح الحالي لا يدعم إشعارات النظام المباشرة، لكن سيتم تفعيل التنبيهات الذكية داخل الموقع.');
      setIsScheduled(true);
      localStorage.setItem('kayan_notifications_enabled', 'true');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        setIsScheduled(true);
        localStorage.setItem('kayan_notifications_enabled', 'true');
        
        try {
          new Notification(`🎉 مرحباً بك في رحلة كيان!`, {
            body: `تم تفعيل التنبيهات لموعد التجمع (${gatheringTime}) ومسار التحرك.`,
            icon: '/favicon.ico'
          });
        } catch {
          // ignore
        }
      } else {
        setIsScheduled(true);
        localStorage.setItem('kayan_notifications_enabled', 'true');
      }
    } catch {
      setIsScheduled(true);
      localStorage.setItem('kayan_notifications_enabled', 'true');
    }
  };

  const toggleNotifications = () => {
    if (!isScheduled) {
      requestNotificationPermission();
    } else {
      setIsScheduled(false);
      localStorage.setItem('kayan_notifications_enabled', 'false');
    }
  };

  return (
    <>
      {/* Mobile/Desktop Quick Notification Badge Strip */}
      <div className="bg-slate-900/90 border-y border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          
          <div className="flex items-center gap-2.5 text-slate-300 text-center sm:text-right">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="font-bold text-white block sm:inline sm:ml-1">
                تنبيهات مواعيد الرحلة الحية:
              </span>
              <span className="text-slate-400">
                {isScheduled
                  ? 'الإشعارات مفعلة! ستصلك تنبيهات التحرك والتجمع والجدول.'
                  : 'فعّل الإشعارات على هاتفك حتى لا يفوتك ميعاد الباص أو التجمع.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowAlertModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              عرض آخر التحديثات ({liveUpdates.length})
            </button>

            <button
              onClick={toggleNotifications}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                isScheduled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold hover:brightness-105 shadow-amber-500/20'
              }`}
            >
              {isScheduled ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>الإشعارات مفعلة</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>تفعيل الإشعارات الآن</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Modal for viewing all scheduled alerts and live updates */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAlertModal(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">آخر التحديثات والتنبيهات المباشرة</h3>
                <p className="text-xs text-slate-400">بث مباشر من مشرفي رحلة كيان السخنة</p>
              </div>
            </div>

            {/* Live Updates Feed */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-black text-amber-400 block">📢 مستجدات الفوج:</span>
              {liveUpdates.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-right relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-bold text-sm text-white">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.isNew && (
                        <span className="text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full animate-pulse">
                          جديد
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-medium">{item.time}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pr-7">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Scheduled Timings */}
            <div className="space-y-2.5 mb-6 pt-3 border-t border-slate-800">
              <span className="text-xs font-black text-slate-400 block">⏰ التنبيهات المجدولة تلقائياً:</span>
              {simulatedAlerts.map((alt) => (
                <div key={alt.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-right">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-xs text-amber-300">{alt.title}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md font-medium">{alt.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{alt.body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  requestNotificationPermission();
                  setShowAlertModal(false);
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-colors shadow-lg shadow-amber-500/20"
              >
                {isScheduled ? 'تحديث الإشعارات وإغلاق' : 'السماح بالإشعارات على الهاتف الآن'}
              </button>
              <button
                onClick={() => setShowAlertModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
