export interface ScheduleItem {
  id: string;
  day: string; // e.g. "اليوم الأول"
  time: string; // e.g. "06:00 ص"
  title: string;
  description: string;
  category: 'departure' | 'hotel' | 'activity' | 'food' | 'entertainment' | 'rest';
  location?: string;
  notes?: string;
}

export interface Supervisor {
  id: string;
  name: string;
  role: string; // e.g. "قائد الفوج", "مشرف باص 1"
  phone: string;
  busNumber: number;
  whatsapp?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'essential' | 'clothes' | 'tech' | 'health';
  isMandatory: boolean;
  tip?: string;
}

export interface StudentSeat {
  id: string;
  name: string;
  universityId: string;
  phone: string;
  busNumber: number;
  seatNumber: string;
  supervisorName: string;
  checkedIn?: boolean;
}

export interface WeatherInfo {
  temp: number | string;
  condition: string;
  tip: string;
  high?: number;
  low?: number;
}

export interface RoadStop {
  id: string;
  time: string;
  title: string;
  location: string;
  desc: string;
  distanceFromStart: string;
}

export type GalleryItemCategory =
  | 'funday'
  | 'students'
  | 'buses'
  | 'beach'
  | 'stage'
  | 'movienight'
  | 'company_banners';

export interface GalleryItem {
  id: string;
  type?: 'image' | 'video';
  category: GalleryItemCategory;
  title: string;
  desc: string;
  url: string; // Image URL or Video URL (direct mp4 or embed or YouTube)
  videoEmbedUrl?: string; // Optional embedded video url
  thumbnail?: string; // Optional thumbnail for video
  badge: string;
  likes: number;
}

export interface TripInfo {
  companyName: string;
  companySlogan: string;
  tripTitle: string;
  destination: string;
  destinationBadge?: string; // اسم الوجهة المختصر تحت اللوجو في الشريط العلوي (مثل "العين السخنة")
  countdownHeadline?: string; // الجملة التي تظهر أعلى العداد التنازلي
  customLogoUrl?: string; // مسار أو رابط الشعار
  tripStartDate: string; // e.g. "2026-09-25T06:00"
  tripEndDate: string;
  departureTime: string; // "06:30 صباحاً"
  gatheringTime: string; // "05:45 صباحاً"
  gatheringLocation: string;
  gatheringMapsUrl: string;
  whatsappGroupUrl: string;
  whatsappSupportNumber: string;
  tripPrice: string; // e.g. "1,850 ج.م"
  depositAmount: string; // e.g. "500 ج.م"
  bannerHeadline: string;
  bannerSubheadline: string;
  customBannerImage?: string;
  urgentNotice: string;
  showNotice: boolean;
  busCount: number;
  totalSeats: number;
  showSchedule?: boolean;
  scheduleUnannouncedText?: string;
  songTitle?: string;
  songArtist?: string;
  customAudioUrl?: string;
  weather: {
    temp: number;
    condition: string;
    tip: string;
    high: number;
    low: number;
  };
  schedule: ScheduleItem[];
  roadStops?: RoadStop[];
  supervisors: Supervisor[];
  packingList: PackingItem[];
  students: StudentSeat[];
  safetyRules: Array<{ id: string; title: string; desc: string }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
  galleryItems?: GalleryItem[];
}
