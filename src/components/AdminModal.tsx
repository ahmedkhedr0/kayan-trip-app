import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Unlock,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Image,
  AlertCircle,
  Users,
  Bus,
  CheckCircle2,
  Sparkles,
  Edit3,
  Radio,
  Ticket,
  Send,
  Music,
  Volume2,
  Upload,
  FileAudio,
  Play,
  Pause,
  HelpCircle,
  ShieldAlert,
  FolderPlus,
  Compass,
  Terminal,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Cpu,
  Activity,
  Zap,
  Video,
  Film,
  Camera
} from 'lucide-react';
import { TripInfo, ScheduleItem, Supervisor, StudentSeat, RoadStop, GalleryItem, GalleryItemCategory } from '../types';
import { DEFAULT_GALLERY_ITEMS } from '../data/defaultGallery';
import { audioPlayer } from '../utils/audioPlayer';
import { parseVideoUrl } from '../utils/mediaUtils';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: TripInfo;
  onSave: (newData: TripInfo) => void;
  onResetToDefault: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
}

interface FirestoreBooking {
  id: string;
  fullName: string;
  phone: string;
  college?: string;
  emergencyPhone?: string;
  nationalId?: string;
  seatsCount?: number;
  notes?: string;
  createdAt?: any;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  tripData,
  onSave,
  onResetToDefault,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [authSuccessNotice, setAuthSuccessNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'banner' | 'music' | 'gallery' | 'schedule' | 'road' | 'safety_faq' | 'supervisors' | 'students' | 'broadcast' | 'bookings'>('general');
  const [formData, setFormData] = useState<TripInfo>(tripData);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioSuccess, setAudioSuccess] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Broadcast update state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastDesc, setBroadcastDesc] = useState('');
  const [broadcastIcon, setBroadcastIcon] = useState('🔔');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Online bookings state
  const [onlineBookings, setOnlineBookings] = useState<FirestoreBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Sync formData whenever tripData changes or modal opens
  React.useEffect(() => {
    setFormData(tripData);
  }, [tripData, isOpen]);

  // Fetch online bookings when bookings tab is active
  useEffect(() => {
    if (activeTab === 'bookings' && isAdminLoggedIn) {
      loadBookings();
    }
  }, [activeTab, isAdminLoggedIn]);

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const snap = await getDocs(collection(db, 'bookings'));
      const list: FirestoreBooking[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<FirestoreBooking, 'id'>)
      }));
      setOnlineBookings(list);
    } catch (err) {
      console.warn('Error loading bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('هل تريد حذف هذا الحجز نهائياً؟')) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
      setOnlineBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastDesc.trim()) return;

    setIsBroadcasting(true);
    try {
      await addDoc(collection(db, 'updates'), {
        icon: broadcastIcon,
        title: broadcastTitle.trim(),
        desc: broadcastDesc.trim(),
        createdAt: serverTimestamp()
      });
      setBroadcastSuccess(true);
      setBroadcastTitle('');
      setBroadcastDesc('');
      setTimeout(() => setBroadcastSuccess(false), 3000);
    } catch (err) {
      alert('تعذر إرسال التحديث المباشر إلى Firebase.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent, overridePin?: string) => {
    if (e) e.preventDefault();
    const pinToTest = (overridePin ?? pinInput).trim();
    if (pinToTest === '1234' || pinToTest === '2026' || pinToTest.toLowerCase() === 'admin') {
      setIsAuthenticating(true);
      setPinError('');
      setAuthSuccessNotice(true);
      setTimeout(() => {
        setIsAdminLoggedIn(true);
        setIsAuthenticating(false);
        setAuthSuccessNotice(false);
        setPinInput('');
      }, 750);
    } else {
      setFailedAttempts((prev) => prev + 1);
      setPinError('ACCESS DENIED // INVALID CLEARANCE CIPHER');
    }
  };

  const handleKeypadPress = (val: string) => {
    if (isAuthenticating) return;
    setPinError('');
    if (val === 'CLEAR') {
      setPinInput('');
    } else if (val === 'ENTER') {
      handleLogin();
    } else if (pinInput.length < 8) {
      const nextPin = pinInput + val;
      setPinInput(nextPin);
      if (nextPin === '1234' || nextPin === '2026') {
        handleLogin(undefined, nextPin);
      }
    }
  };

  const handleSave = async () => {
    onSave(formData);
    // Sync trip config to Firebase Firestore
    try {
      await setDoc(doc(db, 'config', 'trip'), {
        name: formData.tripTitle,
        location: formData.destination,
        departureISO: formData.tripStartDate,
        departureLabel: formData.departureTime,
        gatheringPoint: formData.gatheringLocation,
        gatheringLabel: formData.gatheringTime,
        price: formData.tripPrice,
        deposit: formData.depositAmount,
        urgentNotice: formData.urgentNotice || '',
        showNotice: formData.showNotice,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Firebase config sync notice:', err);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Schedule helpers
  const handleAddScheduleItem = () => {
    const newItem: ScheduleItem = {
      id: `sch-${Date.now()}`,
      day: 'اليوم الأول',
      time: '12:00 م',
      title: 'فقرة جديدة في الرحلة',
      description: 'اكتب هنا تفاصيل النشاط أو الزيارة المقررة.',
      category: 'activity',
      location: formData.destination
    };
    setFormData({
      ...formData,
      schedule: [...formData.schedule, newItem]
    });
  };

  const handleUpdateScheduleItem = (id: string, field: keyof ScheduleItem, val: string) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      )
    });
  };

  const handleDeleteScheduleItem = (id: string) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((item) => item.id !== id)
    });
  };

  // Supervisor helpers
  const handleAddSupervisor = () => {
    const newSup: Supervisor = {
      id: `sup-${Date.now()}`,
      name: 'كابتن جديد',
      role: 'مشرف باص',
      phone: '01000000000',
      busNumber: 1,
      whatsapp: '201000000000'
    };
    setFormData({
      ...formData,
      supervisors: [...formData.supervisors, newSup]
    });
  };

  const handleUpdateSupervisor = (id: string, field: keyof Supervisor, val: string | number) => {
    setFormData({
      ...formData,
      supervisors: formData.supervisors.map((s) =>
        s.id === id ? { ...s, [field]: val } : s
      )
    });
  };

  const handleDeleteSupervisor = (id: string) => {
    setFormData({
      ...formData,
      supervisors: formData.supervisors.filter((s) => s.id !== id)
    });
  };

  // Road stops helpers
  const handleAddRoadStop = () => {
    const newStop: RoadStop = {
      id: `stop-${Date.now()}`,
      time: '08:00 ص',
      title: 'محطة توقف جديدة',
      location: 'طريق السفر السريع',
      desc: 'تفاصيل وملاحظات الاستراحة أو المرور بهذه المحطة.',
      distanceFromStart: '120 كم'
    };
    setFormData((prev) => ({
      ...prev,
      roadStops: [...(prev.roadStops || []), newStop]
    }));
  };

  const handleUpdateRoadStop = (id: string, field: keyof RoadStop, val: string) => {
    setFormData((prev) => ({
      ...prev,
      roadStops: (prev.roadStops || []).map((s) =>
        s.id === id ? { ...s, [field]: val } : s
      )
    }));
  };

  const handleDeleteRoadStop = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      roadStops: (prev.roadStops || []).filter((s) => s.id !== id)
    }));
  };

  // Student helpers
  const handleAddStudent = () => {
    const newStd: StudentSeat = {
      id: `std-${Date.now()}`,
      name: 'طالب جديد',
      universityId: '20240001',
      phone: '01000000000',
      busNumber: 1,
      seatNumber: '01A',
      supervisorName: formData.supervisors[0]?.name || 'مشرف الباص'
    };
    setFormData({
      ...formData,
      students: [...formData.students, newStd]
    });
  };

  const handleUpdateStudent = (id: string, field: keyof StudentSeat, val: string | number) => {
    setFormData({
      ...formData,
      students: formData.students.map((st) =>
        st.id === id ? { ...st, [field]: val } : st
      )
    });
  };

  const handleDeleteStudent = (id: string) => {
    setFormData({
      ...formData,
      students: formData.students.filter((st) => st.id !== id)
    });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('حجم الصورة كبير، يرجى اختيار صورة أصغر من 8 ميجابايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({ ...prev, customBannerImage: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUploading(true);
    try {
      await audioPlayer.loadCustomFile(file);
      setFormData((prev) => ({
        ...prev,
        songTitle: file.name.replace(/\.[^/.]+$/, ''),
        customAudioUrl: file.name
      }));
      setAudioSuccess(true);
      setTimeout(() => setAudioSuccess(false), 3500);
    } catch (err) {
      console.error('Audio upload failed:', err);
      alert('تعذر تحميل ملف الصوت. يرجى التأكد من اختيار ملف mp3 صالح.');
    } finally {
      setAudioUploading(false);
    }
  };

  const handleTogglePreviewAudio = async () => {
    try {
      await audioPlayer.togglePlay();
      setIsPlayingPreview(audioPlayer.getState().isPlaying);
    } catch {
      // ignore
    }
  };

  const handleResetAudio = async () => {
    try {
      await audioPlayer.resetToOfficial();
      setFormData((prev) => ({
        ...prev,
        songTitle: 'أغنية كيان الرسمية: يوم في السخنة ميتعوضش',
        songArtist: 'فريق وكورال كيان الرسمي 2026',
        customAudioUrl: undefined
      }));
      setIsPlayingPreview(false);
    } catch {
      // ignore
    }
  };

  const handleAddSafetyRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      title: 'إرشاد جديد',
      desc: 'تفاصيل وتعليمات السلامة والالتزام...'
    };
    setFormData((prev) => ({
      ...prev,
      safetyRules: [...(prev.safetyRules || []), newRule]
    }));
  };

  const handleUpdateSafetyRule = (id: string, field: 'title' | 'desc', val: string) => {
    setFormData((prev) => ({
      ...prev,
      safetyRules: (prev.safetyRules || []).map((r) =>
        r.id === id ? { ...r, [field]: val } : r
      )
    }));
  };

  const handleDeleteSafetyRule = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      safetyRules: (prev.safetyRules || []).filter((r) => r.id !== id)
    }));
  };

  const handleAddFaq = () => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: 'سؤال متكرر جديد للطلبة؟',
      answer: 'الإجابة والتوضيح بالتفصيل هنا...'
    };
    setFormData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq]
    }));
  };

  const handleUpdateFaq = (id: string, field: 'question' | 'answer', val: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).map((f) =>
        f.id === id ? { ...f, [field]: val } : f
      )
    }));
  };

  const handleDeleteFaq = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((f) => f.id !== id)
    }));
  };

  // Gallery (Images & Videos) Management Helpers
  const handleAddGalleryItem = (type: 'image' | 'video' = 'image') => {
    const defaultVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const parsed = type === 'video' ? parseVideoUrl(defaultVideoUrl) : null;

    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}`,
      type,
      category: 'funday',
      title: type === 'video' ? 'فيديو ترويجي جديد من الرحلة' : 'صورة جديدة من الرحلة',
      desc: type === 'video' ? 'شاهد أجواء الفعالية والحماس في هذا الفيديو.' : 'وصف الصورة واللحظة الجميلة.',
      url: type === 'video' ? defaultVideoUrl : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      thumbnail: type === 'video' ? (parsed?.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80') : undefined,
      badge: type === 'video' ? 'فيديو حصري 🎬' : 'لقطة حصرية 📸',
      likes: 50
    };

    setFormData((prev) => ({
      ...prev,
      galleryItems: [newItem, ...(prev.galleryItems || DEFAULT_GALLERY_ITEMS)]
    }));
  };

  const handleUpdateGalleryItem = (id: string, field: keyof GalleryItem, val: any) => {
    setFormData((prev) => ({
      ...prev,
      galleryItems: (prev.galleryItems || DEFAULT_GALLERY_ITEMS).map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        // Auto-extract thumbnail if user pastes a YouTube URL into video
        if (field === 'url' && updated.type === 'video') {
          const parsed = parseVideoUrl(val);
          if (parsed.thumbnail && !item.thumbnail) {
            updated.thumbnail = parsed.thumbnail;
          }
        }
        return updated;
      })
    }));
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر من المعرض؟')) return;
    setFormData((prev) => ({
      ...prev,
      galleryItems: (prev.galleryItems || DEFAULT_GALLERY_ITEMS).filter((item) => item.id !== id)
    }));
  };

  const handleResetGalleryToDefault = () => {
    if (!window.confirm('هل تريد استعادة جميع صور وفيديوهات المعرض الافتراضية؟')) return;
    setFormData((prev) => ({
      ...prev,
      galleryItems: DEFAULT_GALLERY_ITEMS
    }));
  };

  const handlePrepareNewTrip = () => {
    if (
      !window.confirm(
        'هل تريد تهيئة الموقع لرحلة جديدة؟ سيتم تفريغ المواعيد والأسماء لإدخال بيانات رحلتك القادمة بكل سهولة.'
      )
    )
      return;

    setFormData({
      ...formData,
      tripTitle: 'رحلة جديدة 2027',
      destination: 'العين السخنة / دهب / الإسكندرية',
      tripStartDate: '2026-12-25T06:00:00',
      gatheringTime: '06:00 صباحاً',
      departureTime: '06:30 صباحاً',
      gatheringLocation: 'شارع الاستاد — أمام مسجد الاستاد',
      gatheringMapsUrl: 'https://maps.google.com',
      bannerHeadline: 'Official Trip | رحلة جديدة',
      bannerSubheadline: 'تفاصيل ومفاجآت الرحلة القادمة مع كيان',
      urgentNotice: '📢 فتح باب الحجز والاستفسارات للرحلة القادمة عبر الواتساب والموقع.',
      showNotice: true,
      showSchedule: false, // Default to TBA
      scheduleUnannouncedText: 'برنامج وتفاصيل الرحلة قيد التجهيز والتنسيق حالياً، وسيتم إعلان الجدول الزمني قريباً ⏳',
      students: []
    });
    setActiveTab('general');
  };

  return (
    <div
      id="admin-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className={`rounded-2xl sm:rounded-3xl w-full max-h-[96vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative transition-all ${
        !isAdminLoggedIn
          ? 'max-w-sm sm:max-w-md border border-slate-700/80 shadow-2xl shadow-black/80 bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b1424]'
          : 'bg-slate-900 border border-slate-700 max-w-4xl'
      }`}>
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between transition-colors shrink-0" dir="rtl">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isAdminLoggedIn
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
            }`}>
              {isAdminLoggedIn ? <Unlock className="w-4 h-4 sm:w-5 sm:h-5" /> : <Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                {!isAdminLoggedIn ? (
                  <>
                    <span>تسجيل دخول المنظمين والمشرفين</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono">
                      KAYAN
                    </span>
                  </>
                ) : (
                  'لوحة تحكم وتعديل الرحلة'
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {!isAdminLoggedIn
                  ? 'يرجى إدخال رمز المرور السري الخاص بفريق تنظيم كيان'
                  : 'يمكنك تعديل المواعيد، الجداول، الأسماء، والبانر فوراً'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isAdminLoggedIn ? (
          /* Elegant, Soothing & Mobile-Optimized Organizer Login Gate */
          <div className="p-4 sm:p-6 text-center max-w-sm mx-auto my-auto w-full relative z-10 font-sans flex flex-col justify-center" dir="rtl">
            
            {/* Official Kayan Logo Badge */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 border-2 border-cyan-400/50 overflow-hidden mx-auto mb-3 shadow-md shadow-cyan-950/50">
              <img
                src="/kayan-logo.jpg"
                alt="شعار كيان الرسمي"
                className="w-full h-full object-cover"
              />
              {isAuthenticating && (
                <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Title & Guidance */}
            <h4 className="text-base sm:text-lg font-bold text-white mb-1">
              أدخل رمز الدخول (PIN)
            </h4>
            <p className="text-xs text-slate-400 mb-3.5">
              مخصص فقط لمشرفي الرحلة للتحكم في الجداول والبيانات
            </p>

            {/* Hidden Input for Keyboard Typing */}
            <form onSubmit={(e) => handleLogin(e)} className="relative mb-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setPinInput(val);
                  setPinError('');
                  if (val === '1234' || val === '2026') {
                    handleLogin(undefined, val);
                  }
                }}
                autoFocus
                className="absolute inset-0 opacity-0 w-full h-full cursor-default z-20"
                aria-label="أدخل رمز المرور"
              />

              {/* 4 Clean Elegant Password Slots */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 select-none" dir="ltr">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const hasChar = pinInput.length > slotIdx;
                  const isActive = pinInput.length === slotIdx && !isAuthenticating;

                  return (
                    <div
                      key={slotIdx}
                      className={`w-11 h-12 sm:w-12 sm:h-13 rounded-xl flex items-center justify-center font-mono text-lg font-bold transition-all relative ${
                        hasChar
                          ? 'bg-cyan-950/50 border border-cyan-400/80 text-cyan-300 shadow-sm'
                          : isActive
                          ? 'bg-slate-900 border border-cyan-500/60 text-cyan-400 shadow-sm'
                          : 'bg-slate-900/60 border border-slate-800 text-slate-600'
                      }`}
                    >
                      {hasChar ? (
                        <span className="relative z-10 text-cyan-300">●</span>
                      ) : isActive ? (
                        <span className="w-1.5 h-4 bg-cyan-400 rounded-sm animate-pulse" />
                      ) : (
                        <span className="text-slate-700 text-sm">-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </form>

            {/* Error / Feedback HUD */}
            {pinError && (
              <div className="p-2 mb-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-shake">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>رمز المرور غير صحيح، يرجى المحاولة مجدداً</span>
              </div>
            )}

            {authSuccessNotice && (
              <div className="p-2 mb-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تم التحقق بنجاح! جاري فتح لوحة التحكم...</span>
              </div>
            )}

            {/* Clean, Pleasant 3x4 On-Screen Keypad */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-[240px] sm:max-w-[260px] mx-auto mb-3" dir="ltr">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 hover:border-cyan-500/40 border border-slate-800 text-slate-100 hover:text-cyan-300 font-sans font-bold text-base transition-all duration-150 active:scale-95 shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeypadPress('CLEAR')}
                className="py-2.5 rounded-xl bg-slate-900/60 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-sans font-semibold text-xs transition-all active:scale-95"
                title="مسح"
              >
                مسح
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 hover:border-cyan-500/40 border border-slate-800 text-slate-100 hover:text-cyan-300 font-sans font-bold text-base transition-all duration-150 active:scale-95 shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleLogin()}
                disabled={isAuthenticating}
                className="py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 border border-cyan-400/50 text-slate-950 font-sans font-bold text-xs transition-all active:scale-95 flex items-center justify-center shadow-sm"
                title="تأكيد الدخول"
              >
                {isAuthenticating ? (
                  <Activity className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <span>دخول</span>
                )}
              </button>
            </div>

            {/* Quick Helper for Organizer */}
            
          </div>
        ) : (
          /* Admin Dashboard Tabs */
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Tabs Bar - Scrollable horizontally on phones with compact styling */}
            <div className="px-3 sm:px-6 pt-2 sm:pt-3 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'general'
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                المعلومات والمواعيد
              </button>
              <button
                onClick={() => setActiveTab('banner')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'banner'
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                البانر والتنبيهات
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'music'
                    ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                الأغنية والموسيقى 🎵
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'gallery'
                    ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                معرض الصور والفيديوهات ({formData.galleryItems?.length ?? DEFAULT_GALLERY_ITEMS.length}) 📸
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'schedule'
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                جدول الرحلة ({formData.schedule.length}) {formData.showSchedule === false ? '⏳' : ''}
              </button>
              <button
                onClick={() => setActiveTab('road')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'road'
                    ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                خريطة المسار ({formData.roadStops?.length ?? 5}) 🗺️
              </button>
              <button
                onClick={() => setActiveTab('safety_faq')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'safety_faq'
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                الإرشادات والأسئلة 🛡️
              </button>
              <button
                onClick={() => setActiveTab('supervisors')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'supervisors'
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                المشرفين ({formData.supervisors.length})
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'students'
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                كشف مقاعد الطلبة ({formData.students.length})
              </button>
              <button
                onClick={() => setActiveTab('broadcast')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'broadcast'
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                بث تحديث مباشر 📢
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3 py-1.5 sm:py-2 rounded-t-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'bookings'
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                طلبات الحجز 🎟️ ({onlineBookings.length})
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
              
              {/* Tab 1: General Info */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        اسم الشركة
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        عنوان الرحلة الرئيسي
                      </label>
                      <input
                        type="text"
                        value={formData.tripTitle}
                        onChange={(e) => setFormData({ ...formData, tripTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        الوجهة السياحية ونادي الإقامة
                      </label>
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="مثال: العين السخنة - نادي الجوهرة"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-cyan-300 mb-1 flex items-center justify-between">
                        <span>اسم الوجهة تحت اللوجو (الشريط العلوي)</span>
                        <span className="text-[10px] text-cyan-400 font-normal">يظهر أسفل شعار كيان</span>
                      </label>
                      <input
                        type="text"
                        value={formData.destinationBadge || ''}
                        placeholder="مثال: العين السخنة"
                        onChange={(e) => setFormData({ ...formData, destinationBadge: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-cyan-500/50 text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        تغيير هذا النص ينعكس فوراً تحت لوجو كيان في الشريط العلوي.
                      </p>
                    </div>
                  </div>

                  {/* إعدادات العداد التنازلي التفاعلي المباشر */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>إعدادات العداد التنازلي لموعد الرحلة</span>
                      </h5>
                      <span className="text-[10px] text-amber-300/80 bg-amber-950/60 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                        يعد تنازلياً لحظياً
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          الجملة التي تظهر أعلى العداد
                        </label>
                        <input
                          type="text"
                          value={formData.countdownHeadline || ''}
                          placeholder="مثال: متبقي على موعد انطلاق الرحلة"
                          onChange={(e) => setFormData({ ...formData, countdownHeadline: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          يمكنك كتابة أي جملة تظهر مباشرة فوق أرقام العداد (الأيام، الساعات، الدقائق، الثواني).
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          ميعاد وتاريخ الرحلة المحدد للعداد
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.tripStartDate ? formData.tripStartDate.slice(0, 16) : ''}
                          onChange={(e) => setFormData({ ...formData, tripStartDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-mono text-sm focus:border-amber-400 focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          العداد سيحسب الأيام والساعات بدقة لأي تاريخ وميعاد تختاره.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        ساعة التجمع والحضور
                      </label>
                      <input
                        type="text"
                        value={formData.gatheringTime}
                        onChange={(e) => setFormData({ ...formData, gatheringTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        ساعة تحرك الباصات الفعلي
                      </label>
                      <input
                        type="text"
                        value={formData.departureTime}
                        onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      نقطة ومكان التجمع المحدد
                    </label>
                    <input
                      type="text"
                      value={formData.gatheringLocation}
                      onChange={(e) => setFormData({ ...formData, gatheringLocation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      رابط الموقع على خرائط Google Maps
                    </label>
                    <input
                      type="text"
                      value={formData.gatheringMapsUrl}
                      onChange={(e) => setFormData({ ...formData, gatheringMapsUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  {/* WhatsApp Group & Support & Booking */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                    <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span>إعدادات جروب الواتساب والحجز السريع</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          رابط جروب واتساب الفوج
                        </label>
                        <input
                          type="text"
                          value={formData.whatsappGroupUrl}
                          onChange={(e) => setFormData({ ...formData, whatsappGroupUrl: e.target.value })}
                          placeholder="https://chat.whatsapp.com/..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          رقم واتساب المشرف المالي / الحجوزات
                        </label>
                        <input
                          type="text"
                          value={formData.whatsappSupportNumber}
                          onChange={(e) => setFormData({ ...formData, whatsappSupportNumber: e.target.value })}
                          placeholder="01012345678"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          سعر اشتراك الرحلة للفرد
                        </label>
                        <input
                          type="text"
                          value={formData.tripPrice}
                          onChange={(e) => setFormData({ ...formData, tripPrice: e.target.value })}
                          placeholder="مثال: 1,850 ج.م"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          مقدم تأكيد الحجز
                        </label>
                        <input
                          type="text"
                          value={formData.depositAmount}
                          onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                          placeholder="مثال: 500 ج.م"
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        عدد الباصات
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.busCount}
                        onChange={(e) => setFormData({ ...formData, busCount: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        إجمالي عدد المقاعد
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.totalSeats}
                        onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 50 })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        درجة الحرارة المتوقعة
                      </label>
                      <input
                        type="number"
                        value={formData.weather.temp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            weather: { ...formData.weather, temp: parseInt(e.target.value) || 28 }
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Banner & Announcements */}
              {activeTab === 'banner' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      عنوان البانر الرئيسي
                    </label>
                    <input
                      type="text"
                      value={formData.bannerHeadline}
                      onChange={(e) => setFormData({ ...formData, bannerHeadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      الوصف الفرعي بالبانر
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bannerSubheadline}
                      onChange={(e) => setFormData({ ...formData, bannerSubheadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      صورة البانر الرسمية (يمكنك رفع صورة من جهازك أو وضع رابط صورة)
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2">
                      <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>رفع صورة بانر من جهازك</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                      </label>

                      {formData.customBannerImage && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, customBannerImage: undefined })}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 text-rose-300 hover:bg-slate-700 text-xs font-medium transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>استعادة بانر كيان الأصلي</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="أو ضع رابط صورة مباشر: https://..."
                      value={formData.customBannerImage || ''}
                      onChange={(e) => setFormData({ ...formData, customBannerImage: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                    />

                    {formData.customBannerImage && (
                      <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-800 h-28 bg-slate-950">
                        <img
                          src={formData.customBannerImage}
                          alt="معاينة البانر"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Urgent Notice Settings */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">شريط التنبيهات العاجلة بأعلى الشاشة</span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={formData.showNotice}
                          onChange={(e) => setFormData({ ...formData, showNotice: e.target.checked })}
                          className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="font-bold">تفعيل وظهور التنبيه بأعلى الموقع</span>
                      </label>
                    </div>

                    <textarea
                      rows={2}
                      value={formData.urgentNotice}
                      onChange={(e) => setFormData({ ...formData, urgentNotice: e.target.value })}
                      placeholder="اكتب التنبيه العاجل للطلبة والزوار هنا..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm"
                    />
                    <p className="text-[11px] text-slate-400">
                      * يظهر هذا التنبيه في شريط علوي بارز أعلى شريط التنقل الرئيسي للفت انتباه جميع الزوار.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Music & Anthem Settings */}
              {activeTab === 'music' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                      <Music className="w-5 h-5 text-cyan-400" />
                      <span>الأغنية الرسمية للرحلة والموسيقى الترحيبية</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      تعمل الأغنية تلقائياً عند فتح الموقع مع إمكانية إيقافها أو تشغيلها من الزر بأعلى الشاشة. يمكنك تغيير اسم الأغنية أو رفع ملف أغنية جديد لأي رحلة قادمة.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        عنوان الأغنية
                      </label>
                      <input
                        type="text"
                        value={formData.songTitle || ''}
                        onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                        placeholder="مثلاً: أغنية كيان الرسمية"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        اسم الكورال / الفريق
                      </label>
                      <input
                        type="text"
                        value={formData.songArtist || ''}
                        onChange={(e) => setFormData({ ...formData, songArtist: e.target.value })}
                        placeholder="مثلاً: فريق وكورال كيان الرسمي 2026"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Audio File Selection & Upload */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
                    <span className="text-xs font-bold text-white block">
                      ملف الصوت المشغل للرحلة
                    </span>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:brightness-110 text-slate-950 font-black text-xs transition-all shadow-md">
                        <Upload className="w-4 h-4" />
                        <span>{audioUploading ? 'جارٍ التحميل...' : 'رفع ملف أغنية جديدة من جهازك (MP3)'}</span>
                        <input
                          type="file"
                          accept="audio/*"
                          disabled={audioUploading}
                          onChange={handleAudioUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleTogglePreviewAudio}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-colors border border-slate-700"
                      >
                        {isPlayingPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlayingPreview ? 'إيقاف التجربة' : 'تجربة تشغيل الصوت الآن'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetAudio}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>استعادة أغنية كيان الأصلية</span>
                      </button>
                    </div>

                    {audioSuccess && (
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pt-1 animate-pulse">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم تحميل وحفظ ملف الأغنية بنجاح وتشغيله!</span>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 pt-1">
                      الملف المستخدم حالياً:{' '}
                      <span className="text-cyan-300 font-mono">
                        {formData.customAudioUrl || 'music.mp3 (الملف الافتراضي)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Gallery & Video Management */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Top Bar with Add and Reset Buttons */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Camera className="w-4 h-4 text-cyan-400" />
                        <span>إدارة معرض الأجواء والفيديوهات</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {formData.galleryItems?.length ?? DEFAULT_GALLERY_ITEMS.length} عنصر
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        يمكنك إضافة صور جديدة، أو مقاطع فيديو (رابط مباشر mp4 أو رابط يوتيوب)، وتعديل العناوين والتصنيفات، أو حذف أي صورة فوراً.
                      </p>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddGalleryItem('image')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة صورة جديدة 📸</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddGalleryItem('video')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>إضافة فيديو جديد 🎬</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-500/20"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>حفظ ونشر التعديلات 💾</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetGalleryToDefault}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
                        title="استعادة الصور والفيديوهات الافتراضية"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>استعادة الافتراضي</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Gallery Items */}
                  <div className="space-y-4">
                    {(formData.galleryItems || DEFAULT_GALLERY_ITEMS).map((item, index) => {
                      const isVideo = item.type === 'video';

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-3"
                        >
                          {/* Header row: Index, Type indicator, Title, and Delete button */}
                          <div className="flex items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-mono flex items-center justify-center font-bold">
                                {index + 1}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isVideo ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30' : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'}`}>
                                {isVideo ? '🎬 فيديو' : '📸 صورة'}
                              </span>
                              <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                                {item.title || 'بدون عنوان'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              title="حذف هذا العنصر من المعرض"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Item form fields in responsive grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                            {/* Preview thumbnail */}
                            <div className="sm:col-span-3 aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative flex items-center justify-center">
                              {isVideo ? (
                                item.thumbnail ? (
                                  <img
                                    src={item.thumbnail}
                                    alt="معاينة الفيديو"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/banner_sokhna.jpg';
                                    }}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center text-xs">
                                    <Video className="w-6 h-6 text-rose-400 mb-1" />
                                    <span>فيديو</span>
                                  </div>
                                )
                              ) : (
                                <img
                                  src={item.url}
                                  alt="معاينة الصورة"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/banner_sokhna.jpg';
                                  }}
                                />
                              )}
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                                {item.badge}
                              </span>
                            </div>

                            {/* Inputs column */}
                            <div className="sm:col-span-9 space-y-2.5">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                                    نوع الوسيط
                                  </label>
                                  <select
                                    value={item.type || 'image'}
                                    onChange={(e) => handleUpdateGalleryItem(item.id, 'type', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-white text-xs"
                                  >
                                    <option value="image">صورة (Image)</option>
                                    <option value="video">فيديو (Video MP4 / YouTube)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                                    التصنيف (Category)
                                  </label>
                                  <select
                                    value={item.category}
                                    onChange={(e) => handleUpdateGalleryItem(item.id, 'category', e.target.value as GalleryItemCategory)}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-white text-xs"
                                  >
                                    <option value="funday">Fun Day وألوان 🎈</option>
                                    <option value="students">طلبة وذكريات 🎓</option>
                                    <option value="buses">باصات السفر 🚌</option>
                                    <option value="beach">بحر ويخوت 🌊</option>
                                    <option value="stage">ستيدج ومسرح 🎤</option>
                                    <option value="movienight">موفي نايت 🍿</option>
                                    <option value="company_banners">بانرات الشركة 🏷️</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                                    شارة التمييز (Badge)
                                  </label>
                                  <input
                                    type="text"
                                    value={item.badge}
                                    onChange={(e) => handleUpdateGalleryItem(item.id, 'badge', e.target.value)}
                                    placeholder="مثال: Fun Day 🎉"
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-white text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                                    عنوان الصورة / الفيديو
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleUpdateGalleryItem(item.id, 'title', e.target.value)}
                                    placeholder="اكتب عنواناً جذاباً..."
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-white text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-400 mb-0.5 flex items-center justify-between">
                                    <span>{isVideo ? 'رابط الفيديو (YouTube / MP4 / Vimeo)' : 'رابط الصورة (URL)'}</span>
                                    {isVideo && <span className="text-[10px] text-cyan-400 font-normal">يدعم يوتيوب ومقاطع MP4 المباشرة</span>}
                                  </label>
                                  <input
                                    type="text"
                                    value={item.url}
                                    onChange={(e) => handleUpdateGalleryItem(item.id, 'url', e.target.value)}
                                    placeholder={isVideo ? 'https://www.youtube.com/watch?v=... أو رابط .mp4' : 'https://.../photo.jpg'}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-white text-xs font-mono"
                                  />
                                </div>
                              </div>

                              {isVideo && (
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                                    صورة الغلاف للفيديو (Thumbnail URL) - اختياري
                                  </label>
                                  <input
                                    type="text"
                                    value={item.thumbnail || ''}
                                    onChange={(e) => handleUpdateGalleryItem(item.id, 'thumbnail', e.target.value)}
                                    placeholder="https://.../cover.jpg"
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-white text-xs font-mono"
                                  />
                                </div>
                              )}

                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 mb-0.5">
                                  الوصف والتفاصيل
                                </label>
                                <textarea
                                  rows={2}
                                  value={item.desc}
                                  onChange={(e) => handleUpdateGalleryItem(item.id, 'desc', e.target.value)}
                                  placeholder="وصف مختصر للفعالية أو اللقطة..."
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-white text-xs resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Schedule Management */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  {/* Schedule Visibility Toggle & Unannounced State */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">إظهار أو إخفاء جدول البرنامج للزوار</span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                        <input
                          type="checkbox"
                          checked={formData.showSchedule !== false}
                          onChange={(e) => setFormData({ ...formData, showSchedule: e.target.checked })}
                          className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
                        />
                        <span className={formData.showSchedule !== false ? 'text-cyan-300 font-bold' : 'text-amber-400 font-bold'}>
                          {formData.showSchedule !== false ? '✓ البرنامج معروض للزوار' : '⏳ مخفي (لم يحدد بعد / قيد التجهيز)'}
                        </span>
                      </label>
                    </div>

                    {formData.showSchedule === false && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <label className="block text-xs font-bold text-amber-300">
                          نص الرسالة التي تظهر للزوار بدلاً من الجدول (مثلاً لم يحدد بعد):
                        </label>
                        <textarea
                          rows={2}
                          value={formData.scheduleUnannouncedText || ''}
                          onChange={(e) => setFormData({ ...formData, scheduleUnannouncedText: e.target.value })}
                          placeholder="مثال: يجري حالياً تنسيق جدول الفقرات والأنشطة وسوف يتم الإعلان عنها قريباً..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-slate-300">
                      قائمة فقرات خط السير التفصيلية ({formData.schedule.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddScheduleItem}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة فقرة جديدة</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.schedule.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            placeholder="اليوم (مثلاً: اليوم الأول)"
                            value={item.day}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'day', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="الساعة (مثلاً: 08:30 ص)"
                            value={item.time}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'time', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                          />
                          <select
                            value={item.category}
                            onChange={(e) =>
                              handleUpdateScheduleItem(item.id, 'category', e.target.value)
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          >
                            <option value="departure">تحرك وسفر</option>
                            <option value="hotel">فندق وتسكين</option>
                            <option value="activity">مغامرة وأنشطة</option>
                            <option value="food">وجبات وطعام</option>
                            <option value="entertainment">سهرة وترفيه</option>
                            <option value="rest">استرخاء</option>
                          </select>
                          <input
                            type="text"
                            placeholder="الموقع / المكان"
                            value={item.location || ''}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'location', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="عنوان الفعالية..."
                            value={item.title}
                            onChange={(e) => handleUpdateScheduleItem(item.id, 'title', e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteScheduleItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                            title="حذف هذه الفقرة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          placeholder="وصف الفعالية للطلبة..."
                          value={item.description}
                          onChange={(e) => handleUpdateScheduleItem(item.id, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Road Journey Map & Stops */}
              {activeTab === 'road' && (
                <div className="space-y-6">
                  {/* Top Notice Card */}
                  <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-300 shrink-0">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">
                        تخصيص خريطة ومسار رحلات الحافلات (Road Journey Map):
                      </span>
                      <p className="leading-relaxed text-slate-300">
                        يمكنك هنا تحديد وتعديل محطات الوقوف، الاستراحات، مواعيد المرور، والمسافة بالكيلومتر لكل رحلة قادمة. التعديلات تظهر مباشرة في خريطة الطريق على الموقع.
                      </p>
                    </div>
                  </div>

                  {/* Google Maps link setting */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-cyan-300">
                      رابط مسار الخريطة على Google Maps (زر الملاحة المباشر للطلبة):
                    </label>
                    <input
                      type="url"
                      value={formData.gatheringMapsUrl || ''}
                      onChange={(e) => setFormData({ ...formData, gatheringMapsUrl: e.target.value })}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <span className="text-[11px] text-slate-500 block">
                      عند ضغط الطالب على زر "فتح المسار في Google Maps" سيتم توجيهه لهذا الرابط مباشرة.
                    </span>
                  </div>

                  {/* Road Stops List */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          محطات ووقفات المسار ({(formData.roadStops || []).length} محطات)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddRoadStop}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة محطة مسار جديدة</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(formData.roadStops || []).map((stop, index) => (
                        <div
                          key={stop.id}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                            <span className="text-xs font-bold text-cyan-400 font-tech">
                              المحطة #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteRoadStop(stop.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                              title="حذف هذه المحطة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">
                                توقيت التوقف / المرور *
                              </label>
                              <input
                                type="text"
                                placeholder="مثال: 08:00 ص"
                                value={stop.time}
                                onChange={(e) => handleUpdateRoadStop(stop.id, 'time', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">
                                المسافة من نقطة الانطلاق
                              </label>
                              <input
                                type="text"
                                placeholder="مثال: 160 كم"
                                value={stop.distanceFromStart}
                                onChange={(e) => handleUpdateRoadStop(stop.id, 'distanceFromStart', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">
                                الموقع الدقيق / اسم المكان
                              </label>
                              <input
                                type="text"
                                placeholder="مثال: طريق العين السخنة السريع"
                                value={stop.location}
                                onChange={(e) => handleUpdateRoadStop(stop.id, 'location', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              عنوان أو مسمى المحطة *
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: محطة الاستراحة الرئيسية (استراحة وطنية)"
                              value={stop.title}
                              onChange={(e) => handleUpdateRoadStop(stop.id, 'title', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">
                              وصف المحطة وإرشادات الاستراحة للطلاب
                            </label>
                            <textarea
                              rows={2}
                              placeholder="مثال: توقف مريح لمدة 25 دقيقة (دورات مياه، فريش كوفي، فطور)..."
                              value={stop.desc}
                              onChange={(e) => handleUpdateRoadStop(stop.id, 'desc', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Safety Rules & FAQs */}
              {activeTab === 'safety_faq' && (
                <div className="space-y-6">
                  {/* Safety Rules Section */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">
                          إرشادات وتعليمات السلامة والالتزام ({(formData.safetyRules || []).length})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddSafetyRule}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة إرشاد جديد</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(formData.safetyRules || []).map((rule) => (
                        <div
                          key={rule.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              placeholder="عنوان الإرشاد (مثلاً: الالتزام بالمواعيد)"
                              value={rule.title}
                              onChange={(e) => handleUpdateSafetyRule(rule.id, 'title', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteSafetyRule(rule.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                              title="حذف الإرشاد"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="تفاصيل وشرح الإرشاد للطلبة..."
                            value={rule.desc}
                            onChange={(e) => handleUpdateSafetyRule(rule.id, 'desc', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQs Section */}
                  <div className="space-y-3.5 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          الأسئلة الشائعة للطلبة والزوار ({(formData.faqs || []).length})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة سؤال جديد</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(formData.faqs || []).map((faq) => (
                        <div
                          key={faq.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              placeholder="السؤال (مثلاً: ما هي مستلزمات الرحلة؟)"
                              value={faq.question}
                              onChange={(e) => handleUpdateFaq(faq.id, 'question', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                              title="حذف السؤال"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="الإجابة والتوضيح للطلبة..."
                            value={faq.answer}
                            onChange={(e) => handleUpdateFaq(faq.id, 'answer', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Supervisors */}
              {activeTab === 'supervisors' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      إدارة المشرفين وأرقام الطوارئ
                    </span>
                    <button
                      type="button"
                      onClick={handleAddSupervisor}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة مشرف</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.supervisors.map((sup) => (
                      <div
                        key={sup.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center"
                      >
                        <input
                          type="text"
                          placeholder="الاسم"
                          value={sup.name}
                          onChange={(e) => handleUpdateSupervisor(sup.id, 'name', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                        />
                        <input
                          type="text"
                          placeholder="الدور / التخصص"
                          value={sup.role}
                          onChange={(e) => handleUpdateSupervisor(sup.id, 'role', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                        <input
                          type="number"
                          placeholder="رقم الباص"
                          value={sup.busNumber}
                          onChange={(e) =>
                            handleUpdateSupervisor(sup.id, 'busNumber', parseInt(e.target.value) || 1)
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                        />
                        <input
                          type="text"
                          placeholder="رقم الهاتف"
                          value={sup.phone}
                          onChange={(e) => handleUpdateSupervisor(sup.id, 'phone', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="واتساب (201...)"
                            value={sup.whatsapp || ''}
                            onChange={(e) => handleUpdateSupervisor(sup.id, 'whatsapp', e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteSupervisor(sup.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Students Seat Roster */}
              {activeTab === 'students' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      كشف توزيع الطلاب على الباصات والمقاعد ({formData.students.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddStudent}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة طالب</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formData.students.map((st) => (
                      <div
                        key={st.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-6 gap-2 items-center text-xs"
                      >
                        <input
                          type="text"
                          placeholder="اسم الطالب"
                          value={st.name}
                          onChange={(e) => handleUpdateStudent(st.id, 'name', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="كود الطالب"
                          value={st.universityId}
                          onChange={(e) => handleUpdateStudent(st.id, 'universityId', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                        <input
                          type="number"
                          placeholder="رقم الباص"
                          value={st.busNumber}
                          onChange={(e) =>
                            handleUpdateStudent(st.id, 'busNumber', parseInt(e.target.value) || 1)
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                        <input
                          type="text"
                          placeholder="رقم المقعد (12A)"
                          value={st.seatNumber}
                          onChange={(e) => handleUpdateStudent(st.id, 'seatNumber', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                        <input
                          type="text"
                          placeholder="الهاتف"
                          value={st.phone}
                          onChange={(e) => handleUpdateStudent(st.id, 'phone', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="المشرف"
                            value={st.supervisorName}
                            onChange={(e) => handleUpdateStudent(st.id, 'supervisorName', e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(st.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: Broadcast Live Updates */}
              {activeTab === 'broadcast' && (
                <div className="space-y-6">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
                      <Radio className="w-4 h-4 animate-pulse" />
                      <span>إرسال إشعار وبث مباشر إلى هواتف الطلبة</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      أي رسالة يتم كتابتها هنا ستصل فوراً إلى جميع زوار ومشتركي الموقع وتظهر في نافذة "آخر التحديثات" مع إصدار تنبيه صوتي ونظامي للهواتف المفعلة.
                    </p>

                    <form onSubmit={handleSendBroadcast} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-bold text-slate-300 mb-1">الأيقونة</label>
                          <select
                            value={broadcastIcon}
                            onChange={(e) => setBroadcastIcon(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                          >
                            <option value="🔔">🔔 تنبيه عام</option>
                            <option value="🚌">🚌 حافلات وباصات</option>
                            <option value="🌊">🌊 الشاطئ والبحر</option>
                            <option value="⏰">⏰ ميعاد وتوقيت</option>
                            <option value="🎉">🎉 فعاليات وحفلات</option>
                            <option value="🍽️">🍽️ وجبات ومطاعم</option>
                            <option value="🚨">🚨 عاجل وهام</option>
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold text-slate-300 mb-1">عنوان التحديث</label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: جاهزية باص رقم 1 للتحرك"
                            value={broadcastTitle}
                            onChange={(e) => setBroadcastTitle(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">تفاصيل الرسالة أو التوجيهات</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="اكتب التوجيه أو التنبيه الذي ترغب في إرساله للطلبة..."
                          value={broadcastDesc}
                          onChange={(e) => setBroadcastDesc(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {broadcastSuccess ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>تم إرسال ونشر التحديث بنجاح!</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">سيتم حفظ التحديث فوراً في Firebase Live Updates</span>
                        )}

                        <button
                          type="submit"
                          disabled={isBroadcasting}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isBroadcasting ? 'جاري البث...' : 'إرسال وبث التحديث الآن'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Tab 7: Online Bookings from Students */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <Ticket className="w-4 h-4 text-amber-400" />
                        <span>طلبات الحجز المسجلة من الموقع مباشرة</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        الطلبة الذين قاموا بملء استمارة "احجز مكانك الآن"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={loadBookings}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      تحديث الكشف
                    </button>
                  </div>

                  {isLoadingBookings ? (
                    <div className="text-center py-12 text-slate-400 text-xs">جاري تحميل كشوفات الحجز...</div>
                  ) : onlineBookings.length > 0 ? (
                    <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                      {onlineBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-right flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-black text-sm text-white">{b.fullName}</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                {b.seatsCount || 1} مقعد
                              </span>
                              {b.college && (
                                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                                  {b.college}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                              <span dir="ltr">📱 {b.phone}</span>
                              {b.emergencyPhone && <span dir="ltr">طوارئ: {b.emergencyPhone}</span>}
                              {b.nationalId && <span>رقم قومي: {b.nationalId}</span>}
                              {b.notes && <span className="text-slate-300 italic">ملاحظة: {b.notes}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-end">
                            <a
                              href={`https://wa.me/20${b.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`أهلاً بك يا ${b.fullName} في رحلة كيان بالسخنة! تم استلام طلب حجزك.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors whitespace-nowrap"
                            >
                              محادثة واتساب
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                              title="حذف الحجز"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
                      لا توجد طلبات حجز جديدة حتى الآن.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handlePrepareNewTrip}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/80 text-cyan-300 text-xs font-bold transition-colors"
                  title="تجهيز وتفريغ البيانات لإعداد رحلة قادمة جديدة بسهولة"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>تهيئة لرحلة جديدة ✈️</span>
                </button>

                <button
                  type="button"
                  onClick={onResetToDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  title="استعادة كل البيانات الأصلية الخاصة برحلة كيان"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة البيانات الافتراضية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAdminLoggedIn(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors"
                >
                  قفل لوحة الأدمن
                </button>
              </div>

              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حفظ التعديلات بنجاح!</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ ونشر التعديلات فوراً</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
