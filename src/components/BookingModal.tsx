import React, { useState } from 'react';
import { X, Ticket, MessageCircle, AlertCircle, CheckCircle2, ShieldAlert, Shirt, Utensils, Phone, User, School, CreditCard } from 'lucide-react';
import { TripInfo } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: TripInfo;
  onBookingComplete?: (student: { name: string; phone: string; university: string; seats: number }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  tripData,
  onBookingComplete
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [university, setUniversity] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [hoodieOption, setHoodieOption] = useState<'with_hoodie' | 'without_hoodie'>('without_hoodie');
  const [hoodieSize, setHoodieSize] = useState('L');
  const [mealOption, setMealOption] = useState<'with_meal' | 'without_meal'>('with_meal');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const companyWhatsAppNumber = '201038574977';

  if (!isOpen) return null;

  const buildWhatsAppMessage = () => {
    const hoodieText = hoodieOption === 'with_hoodie' ? `مع هودي كيان الرسمي (مقاس: ${hoodieSize})` : 'بدون هودي';
    const mealText = mealOption === 'with_meal' ? 'شامل وجبة الغداء (بوفيه مفتوح)' : 'بدون وجبة غداء';
    const natIdText = nationalId.trim() ? nationalId.trim() : 'لم يُحدد (اختياري)';
    const emPhoneText = emergencyPhone.trim() ? emergencyPhone.trim() : 'لم يُحدد';
    const uniText = university.trim() ? university.trim() : 'عام';

    return (
      `🌟 حجز جديد في رحلة السخنة 28/11 | شركة كيان 🌊\n` +
      `--------------------------------\n` +
      `👤 اسم الطالب: ${name.trim()}\n` +
      `📱 رقم الهاتف / الواتساب: ${phone.trim()}\n` +
      `🪪 الرقم القومي: ${natIdText}\n` +
      `🎓 الكلية / الجامعة: ${uniText}\n` +
      `🚨 رقم هاتف الطوارئ: ${emPhoneText}\n` +
      `🧥 خيار الهودي: ${hoodieText}\n` +
      `🍽️ خيار الوجبة: ${mealText}\n` +
      (notes.trim() ? `📝 ملاحظات إضافية: ${notes.trim()}\n` : '') +
      `--------------------------------\n` +
      `📍 موعد الرحلة: 28/11/2026 | شارع الاستاد أمام مسجد الاستاد\n` +
      `أرجو تأكيد الحجز وإرسال تفاصيل الدفع ورقم الباص شكراً لكم!`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('يرجى إدخال اسم الطالب ثلاثي أو رباعي');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('يرجى إدخال رقم هاتف صحيح (11 رقم)');
      return;
    }

    setErrorMessage('');
    setIsSuccess(true);

    const fullMessage = buildWhatsAppMessage();

    // 1. Send directly to company whatsapp 201038574977
    const waUrl = `https://wa.me/${companyWhatsAppNumber}?text=${encodeURIComponent(fullMessage)}`;
    
    try {
      window.open(waUrl, '_blank');
    } catch {
      // ignore
    }

    // 2. Sync to Firebase
    try {
      await addDoc(collection(db, 'bookings'), {
        name: name.trim(),
        phone: phone.trim(),
        nationalId: nationalId.trim(),
        university: university.trim() || 'عام',
        emergencyPhone: emergencyPhone.trim(),
        hoodieOption,
        hoodieSize: hoodieOption === 'with_hoodie' ? hoodieSize : null,
        mealOption,
        notes: notes.trim(),
        tripTitle: tripData.tripTitle,
        destination: tripData.destination,
        targetCompanyNumber: companyWhatsAppNumber,
        createdAt: serverTimestamp(),
        source: 'sokhna_fun_day_modal'
      });
    } catch (err) {
      console.warn('Firebase booking write bypassed:', err);
    }

    if (onBookingComplete) {
      onBookingComplete({
        name: name.trim(),
        phone: phone.trim(),
        university: university.trim(),
        seats: 1
      });
    }
  };

  const handleManualWhatsAppClick = () => {
    const fullMessage = buildWhatsAppMessage();
    const waUrl = `https://wa.me/${companyWhatsAppNumber}?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      id="booking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-[#0d182b] border border-cyan-500/25 rounded-2xl p-4 sm:p-6 shadow-2xl my-6 text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors z-10"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-cyan-500/20 shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">تسجيل حجز رحلة السخنة</h3>
                <p className="text-[11px] text-cyan-300 font-tech">28 NOV 2026 • KAYAN FUN DAY</p>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-[#081220] border border-cyan-500/20 rounded-xl p-2.5 mb-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-cyan-200">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px]">يصل حجزك مباشرة لواتساب شركة كيان:</span>
              </div>
              <span className="font-tech font-bold text-emerald-400 text-[11px]" dir="ltr">01038574977</span>
            </div>

            {errorMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-right">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>اسم الطالب ثلاثي أو رباعي <span className="text-cyan-400">*</span></span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: أحمد محمد علي"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081220] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                />
              </div>

              {/* Phone & National ID (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>رقم الهاتف أو الواتساب <span className="text-cyan-400">*</span></span>
                  </label>
                  <input
                    type="tel"
                    placeholder="010XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#081220] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors font-tech"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>الرقم القومي (اختياري)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="14 رقم بالبطاقة (اختياري)"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#081220] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors font-tech"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* University & Emergency Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-cyan-400" />
                    <span>الكلية / الجامعة / الدفعة</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: هندسة، حقوق..."
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#081220] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>هاتف الطوارئ (ولي الأمر)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#081220] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors font-tech"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 🧥 Hoodie Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                    <span>هودي الرحلة الرسمي الخاص بكيان</span>
                  </span>
                  <span className="text-[10px] text-cyan-300">إصدار حصري للرحلة</span>
                </label>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setHoodieOption('with_hoodie')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      hoodieOption === 'with_hoodie'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black shadow-sm'
                        : 'bg-[#081220] border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>مع هودي كيان الرسمي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHoodieOption('without_hoodie')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      hoodieOption === 'without_hoodie'
                        ? 'bg-slate-800 border-slate-500 text-white font-black'
                        : 'bg-[#081220] border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>بدون هودي</span>
                  </button>
                </div>

                {/* Size Selector if with hoodie */}
                {hoodieOption === 'with_hoodie' && (
                  <div className="bg-[#081220] border border-cyan-500/30 rounded-xl p-2 flex items-center justify-between gap-2 animate-fade-in">
                    <span className="text-[11px] font-bold text-cyan-300">اختر المقاس:</span>
                    <div className="flex items-center gap-1">
                      {['M', 'L', 'XL', '2XL', '3XL'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setHoodieSize(sz)}
                          className={`w-7 h-7 rounded-lg text-xs font-tech font-bold border transition-colors ${
                            hoodieSize === sz
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 🍽️ Meal Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    <span>وجبة الغداء في نادي الجوهرة</span>
                  </span>
                  <span className="text-[10px] text-amber-300">بوفيه مفتوح ومشروبات</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMealOption('with_meal')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      mealOption === 'with_meal'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-black shadow-sm'
                        : 'bg-[#081220] border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>شامل وجبة الغداء</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMealOption('without_meal')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      mealOption === 'without_meal'
                        ? 'bg-slate-800 border-slate-500 text-white font-black'
                        : 'bg-[#081220] border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>بدون وجبة</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ملاحظات أو أسماء أصدقائك في نفس الباص (اختياري)
                </label>
                <textarea
                  rows={2}
                  placeholder="ترغب بالجلوس بجوار صديق معين أو أي ملاحظة..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#081220] border border-slate-700/80 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col gap-1.5">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>تأكيد الحجز وإرسال للواتساب (01038574977)</span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  بمجرد النقر سيتم فتح رسالة الواتساب الجاهزة مباشرة لتأكيد مقعدك مع مسؤولي كيان.
                </p>
              </div>

            </form>
          </div>
        ) : (
          <div className="text-center py-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white mb-1">تم تجهيز بيانات حجزك بنجاح! 🎉</h3>
            <p className="text-xs text-slate-300 mb-4 max-w-sm mx-auto leading-relaxed">
              أهلاً بك يا <strong className="text-cyan-300">{name}</strong> في عيلة كيان! تم توجيه رسالة الحجز إلى رقم شركة كيان المعتمد.
            </p>

            <div className="bg-[#081220] border border-slate-800 rounded-xl p-3 mb-4 text-right space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>اسم الطالب:</span>
                <span className="font-bold text-white">{name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>رقم الهاتف:</span>
                <span className="font-bold text-cyan-300 font-tech" dir="ltr">{phone}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>خيار الهودي:</span>
                <span className="font-bold text-cyan-300">
                  {hoodieOption === 'with_hoodie' ? `مع هودي (مقاس: ${hoodieSize})` : 'بدون هودي'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>خيار الوجبة:</span>
                <span className="font-bold text-amber-300">
                  {mealOption === 'with_meal' ? 'شامل وجبة الغداء' : 'بدون وجبة'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>الرقم المستلم على واتساب:</span>
                <span className="font-bold text-emerald-400 font-tech" dir="ltr">01038574977</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleManualWhatsAppClick}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>إرسال الرسالة إلى 01038574977</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                إغلاق والعودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
