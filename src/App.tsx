import React, { useState, useEffect } from 'react';
import { TripInfo } from './types';
import { INITIAL_TRIP_DATA } from './data/initialData';
import { audioPlayer } from './utils/audioPlayer';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DepartureSection } from './components/DepartureSection';
import { RoadJourneyMap } from './components/RoadJourneyMap';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { BusJukebox } from './components/BusJukebox';
import { TripPersonaQuiz } from './components/TripPersonaQuiz';
import { TripVibesGallery } from './components/TripVibesGallery';
import { SafetyFaqSection } from './components/SafetyFaqSection';
import { AdminModal } from './components/AdminModal';
import { BookingModal } from './components/BookingModal';
import { InstallAppModal } from './components/InstallAppModal';
import { MobileStickyCta } from './components/MobileStickyCta';
import { Footer } from './components/Footer';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'kayan_trip_sokhna_nov28_v6';

export default function App() {
  const [tripData, setTripData] = useState<TripInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_TRIP_DATA,
          ...parsed,
          galleryItems: parsed.galleryItems && parsed.galleryItems.length > 0 ? parsed.galleryItems : INITIAL_TRIP_DATA.galleryItems
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_TRIP_DATA;
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 🎵 Auto-play official song immediately upon page open
  useEffect(() => {
    // 1. Attempt immediate autoplay
    audioPlayer.attemptAutoplay();

    // 2. Unblock audio on very first user interaction (click, touch, scroll) if browser restricts silent autoplay
    const handleFirstInteraction = () => {
      audioPlayer.play().catch(() => {});
      removeInteractionListeners();
    };

    const removeInteractionListeners = () => {
      ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'].forEach((evt) => {
        window.removeEventListener(evt, handleFirstInteraction);
        document.removeEventListener(evt, handleFirstInteraction);
      });
    };

    ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'].forEach((evt) => {
      window.addEventListener(evt, handleFirstInteraction, { once: true, passive: true });
      document.addEventListener(evt, handleFirstInteraction, { once: true, passive: true });
    });

    return () => {
      removeInteractionListeners();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveTripData = (newData: TripInfo) => {
    setTripData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      showToast('تم حفظ ونشر جميع تعديلات الرحلة بنجاح!');
    } catch {
      showToast('حدث خطأ أثناء الحفظ المحلي');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('هل أنت متأكد من استعادة كافة بيانات الرحلة الأصلية لشركة كيان؟')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      setTripData(INITIAL_TRIP_DATA);
      showToast('تمت استعادة البيانات الافتراضية لرحلة السخنة بنجاح.');
    }
  };

  const handleBookingComplete = (studentInfo: { name: string; phone: string; university: string; seats: number }) => {
    const newStudent = {
      id: `booking-${Date.now()}`,
      name: studentInfo.name,
      universityId: studentInfo.university || 'حجز مؤكد',
      phone: studentInfo.phone,
      busNumber: 1,
      seatNumber: `مؤكد`,
      supervisorName: tripData.supervisors[0]?.name || 'إدارة كيان'
    };

    const updatedStudents = [newStudent, ...tripData.students];
    const updatedTrip = { ...tripData, students: updatedStudents };
    setTripData(updatedTrip);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrip));
    } catch {
      // ignore
    }
    showToast(`أهلاً بك يا ${studentInfo.name}! تم تسجيل حجزك بنجاح.`);
  };

  const handleShare = async () => {
    const shareData = {
      title: tripData.tripTitle,
      text: `${tripData.companyName}: تفاصيل رحلة ${tripData.tripTitle} يوم 28/11/2026 والتجمع بشارع الاستاد أمام مسجد الاستاد.`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('تمت مشاركة رابط الرحلة!');
        return;
      } catch {
        // user cancelled
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط الرحلة إلى الحافظة!');
    } catch {
      showToast('الرابط: ' + window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1526] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 pb-16 md:pb-0 font-sans antialiased relative overflow-hidden">
      
      {/* Cheerful, eye-friendly ambient coastal lights (Soft Sun & Tropical Water) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] ambient-coastal-glow" />
        <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-[130px] ambient-coastal-glow" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[140px]" />
      </div>

      {/* Toast Notification - Calm Cyan */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm border border-cyan-200">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header with Music Player & Top Urgent Alert */}
      <Navbar
        companyName={tripData.companyName}
        tripTitle={tripData.tripTitle}
        destination={tripData.destination}
        destinationBadge={tripData.destinationBadge}
        customLogoUrl={tripData.customLogoUrl}
        whatsappGroupUrl={tripData.whatsappGroupUrl}
        urgentNotice={tripData.urgentNotice}
        showNotice={tripData.showNotice}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* 1. Official Hero Banner with Countdown */}
        <HeroBanner
          companyName={tripData.companyName}
          companySlogan={tripData.companySlogan}
          tripTitle={tripData.tripTitle}
          destination={tripData.destination}
          destinationBadge={tripData.destinationBadge}
          tripStartDate={tripData.tripStartDate}
          countdownHeadline={tripData.countdownHeadline}
          departureTime={tripData.departureTime}
          gatheringLocation={tripData.gatheringLocation}
          bannerHeadline={tripData.bannerHeadline}
          bannerSubheadline={tripData.bannerSubheadline}
          customBannerImage={tripData.customBannerImage}
          urgentNotice={tripData.urgentNotice}
          showNotice={tripData.showNotice}
          busCount={tripData.busCount}
          totalSeats={tripData.totalSeats}
          supervisorsCount={tripData.supervisors.length}
          whatsappGroupUrl={tripData.whatsappGroupUrl}
          tripPrice={tripData.tripPrice}
          onShare={handleShare}
          onOpenBooking={() => setIsBookingModalOpen(true)}
        />

        {/* 2. Departure Location & Gathering Point */}
        <DepartureSection
          departureTime={tripData.departureTime}
          gatheringTime={tripData.gatheringTime}
          gatheringLocation={tripData.gatheringLocation}
          gatheringMapsUrl={tripData.gatheringMapsUrl}
          busCount={tripData.busCount}
          supervisors={tripData.supervisors}
          whatsappGroupUrl={tripData.whatsappGroupUrl}
          onOpenBooking={() => setIsBookingModalOpen(true)}
        />

        {/* 3. Interactive Road Map & Highway Stops */}
        <RoadJourneyMap
          gatheringLocation={tripData.gatheringLocation}
          destination={tripData.destination}
          gatheringMapsUrl={tripData.gatheringMapsUrl}
          roadStops={tripData.roadStops}
        />

        {/* 4. Creative & Highly Understandable Schedule Timeline */}
        <ScheduleTimeline
          schedule={tripData.schedule}
          showSchedule={tripData.showSchedule}
          scheduleUnannouncedText={tripData.scheduleUnannouncedText}
          whatsappGroupUrl={tripData.whatsappGroupUrl}
          onOpenBooking={() => setIsBookingModalOpen(true)}
        />

        {/* 5. Bus Party Jukebox & Song Voting */}
        <BusJukebox />

        {/* 6. Trip Persona Quiz */}
        <TripPersonaQuiz />

        {/* 7. Trip Vibes & Moments Photo Gallery */}
        <TripVibesGallery
          items={tripData.galleryItems}
          whatsappGroupUrl={tripData.whatsappGroupUrl}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        {/* 8. Safety Guidelines & FAQs */}
        <SafetyFaqSection
          safetyRules={tripData.safetyRules}
          faqs={tripData.faqs}
          whatsappGroupUrl={tripData.whatsappGroupUrl}
        />

      </main>

      {/* Mobile Sticky Bottom CTA */}
      <MobileStickyCta
        onOpenBooking={() => setIsBookingModalOpen(true)}
        whatsappGroupUrl={tripData.whatsappGroupUrl}
        tripPrice={tripData.tripPrice}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tripData={tripData}
        onBookingComplete={handleBookingComplete}
      />

      {/* PWA App Installer Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        tripData={tripData}
        onSave={handleSaveTripData}
        onResetToDefault={handleResetToDefault}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

      {/* Footer */}
      <Footer
        companyName={tripData.companyName}
        companySlogan={tripData.companySlogan}
        whatsappGroupUrl={tripData.whatsappGroupUrl}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
      />

    </div>
  );
}
