import { TripInfo } from '../types';
import { DEFAULT_GALLERY_ITEMS } from './defaultGallery';

export const INITIAL_TRIP_DATA: TripInfo = {
  companyName: 'KAYAN | كيان',
  companySlogan: 'El-Sherif IS \'27 | Official Fun Day',
  tripTitle: 'El-Sherif IS \'27 | Official Fun Day',
  destination: 'Ain Sokhna · El Gohara Club (العين السخنة - نادي الجوهرة)',
  destinationBadge: 'العين السخنة',
  countdownHeadline: 'متبقي على موعد انطلاق الرحلة',
  customLogoUrl: '/kayan-logo.jpg',
  tripStartDate: '2026-11-28T06:00:00',
  tripEndDate: '2026-11-28T22:00:00',
  departureTime: '06:30 صباحاً',
  gatheringTime: '06:00 صباحاً',
  gatheringLocation: 'شارع الاستاد — أمام مسجد الاستاد',
  gatheringMapsUrl: 'https://maps.google.com/?q=مسجد+الاستاد',
  whatsappGroupUrl: 'https://chat.whatsapp.com/ETo0OaCjBAs1FJdDXe5NjI?s=cl&p=a&mlu=4&ilr=4',
  whatsappSupportNumber: '201038574977',
  tripPrice: '650 ج.م',
  depositAmount: '200 ج.م',
  bannerHeadline: 'El-Sherif IS \'27 | Official Fun Day',
  bannerSubheadline: 'Ain Sokhna · El Gohara Club — رحلة كيان الرسمية 🌊 شمس وبحر وفوم وكالر فستيفال وتصوير درون سينمائي ولمة باص الضحكة فيها طالعة من القلب.',
  urgentNotice: '📢 موعد الرحلة الرسمي: الجمعة 28/11/2026 — التجمع بشارع الاستاد أمام مسجد الاستاد الساعة 6:00 صباحاً والتحرك 6:30 صباحاً.',
  showNotice: true,
  busCount: 4,
  totalSeats: 180,
  showSchedule: true,
  scheduleUnannouncedText: 'برنامج الرحلة وتفاصيل الفعاليات قيد التجهيز والتنسيق حالياً، وسيتم الإعلان عن الجدول الزمني كاملاً قريباً عبر جروب الواتساب الرسمي ⏳',
  songTitle: 'أغنية كيان الرسمية: يوم في السخنة ميتعوضش',
  songArtist: 'فريق وكورال كيان الرسمي 2026',
  weather: {
    temp: 26,
    condition: 'أجواء خريفية ساحلية معتدلة ومنعشة مثالية للبحر والأنشطة',
    tip: 'احرص على إحضار تيشرت أبيض لمهرجان الألوان وبطاقة الرقم القومي أو كارنيه الكلية',
    high: 27,
    low: 19
  },
  roadStops: [
    {
      id: 'stop-1',
      time: '06:00 ص',
      title: 'نقطة التجمع والانطلاق',
      location: 'طنطا — شارع الاستاد أمام مسجد الاستاد',
      desc: 'حضور جميع الطلبة، مطابقة الأسماء والكشوفات مع مشرف كل باص، والصعود للمقاعد.',
      distanceFromStart: '0 كم'
    },
    {
      id: 'stop-2',
      time: '07:15 ص',
      title: 'الدائري الإقليمي وطريق السويس',
      location: 'الطريق السريع المفتوح',
      desc: 'بداية الأجواء الحماسية وتوزيع السناكس ومسابقات وتحديات الباص الصباحية.',
      distanceFromStart: '85 كم'
    },
    {
      id: 'stop-3',
      time: '08:00 ص',
      title: 'محطة الاستراحة الرئيسية (استراحة وطنية)',
      location: 'طريق العين السخنة السريع',
      desc: 'توقف مريح لمدة 25 دقيقة (دورات مياه، فريش كوفي، فطور، وشراء أي مستلزمات متبقية).',
      distanceFromStart: '160 كم'
    },
    {
      id: 'stop-4',
      time: '08:50 ص',
      title: 'بوابة السخنة وطريق جبل الجلالة الساحلي',
      location: 'مدخل العين السخنة',
      desc: 'إطلالات طبيعية ساحرة بين الجبال والبحر الأحمر، مع أول لمحة لمياه السخنة الفيروزية.',
      distanceFromStart: '215 كم'
    },
    {
      id: 'stop-5',
      time: '09:30 ص',
      title: 'شاطئ ونادي الجوهرة — العين السخنة',
      location: 'الوجهة الرسمية للرحلة',
      desc: 'الوصول واستلام مقاعد الشاطئ والشماسي وبدء برنامج اليوم والسباحة الحرة.',
      distanceFromStart: '245 كم'
    }
  ],
  schedule: [
    {
      id: 'sch-1',
      day: 'الجمعة 28/11',
      time: '06:00 ص',
      title: 'التجمع واستلام كروت الصعود للباص',
      description: 'حضور الطلاب بنقطة التجمع (شارع الاستاد أمام مسجد الاستاد)، تسجيل الأسماء، تسليم بادج الرحلة، وتوزيع وجبة إفطار خفيفة ومشروبات منعشة.',
      category: 'departure',
      location: 'شارع الاستاد — أمام مسجد الاستاد'
    },
    {
      id: 'sch-2',
      day: 'الجمعة 28/11',
      time: '06:30 ص',
      title: 'انطلاق أسطول باصات كيان المكيفة',
      description: 'وفي لمة باص.. الضحكة طالعة م القلوب بجد! مسابقات تعارف، دي جي الباص المبهج، وموسيقى كيان الرسمية على الطريق السريع.',
      category: 'departure',
      location: 'طريق القاهرة — العين السخنة المباشر'
    },
    {
      id: 'sch-3',
      day: 'الجمعة 28/11',
      time: '08:30 ص',
      title: 'الوصول لنادي الجوهرة واستلام الكبائن والشاطئ',
      description: 'استقبال خاص لطلاب كيان، استلام كبائن وغرف تبديل الملابس المجهزة، النزول للشاطئ الرملي الخاص، وحمامات السباحة.',
      category: 'hotel',
      location: 'Ain Sokhna · El Gohara Club'
    },
    {
      id: 'sch-4',
      day: 'الجمعة 28/11',
      time: '10:30 ص',
      title: 'مهرجان الفوم بارتي الشاطئي (Beach Foam Party)',
      description: 'مدفع فوم عملاق على رمال الشاطئ مع موسيقى حماسية وألعاب ومسابقات مائية مبهجة.',
      category: 'activity',
      location: 'ساحة الشاطئ الرئيسية'
    },
    {
      id: 'sch-5',
      day: 'الجمعة 28/11',
      time: '01:30 م',
      title: 'بوفيه الغداء المفتوح والمشروبات المنعشة',
      description: 'وجبة غداء فاخرة ومتكاملة بمطعم القرية البانورامي المطل على البحر مع مياه ومشروبات باردة.',
      category: 'food',
      location: 'مطعم المنتجع البانورامي'
    },
    {
      id: 'sch-6',
      day: 'الجمعة 28/11',
      time: '03:00 م',
      title: 'مهرجان حرب الألوان الشامل (Holi Color Festival)',
      description: 'توزيع عبوات الألوان المعتمدة الآمنة لجميع الطلاب، تفجير مدافع الألوان والتقاط صور ملونة أسطورية بالتيشرت الأبيض.',
      category: 'activity',
      location: 'ساحة الفعاليات المفتوحة'
    },
    {
      id: 'sch-7',
      day: 'الجمعة 28/11',
      time: '04:30 م',
      title: 'جلسة التصوير السينمائي الجوي بطائرات الدرون',
      description: 'تصوير فيديو سينمائي احترافي من الجو لجميع الطلاب ولقطات جماعية تذكارية ترند للرحلة.',
      category: 'activity',
      location: 'شاطئ البحر ومنطقة السقالة'
    },
    {
      id: 'sch-8',
      day: 'الجمعة 28/11',
      time: '05:30 م',
      title: 'ساعة الغروب الذهبي وحفلة الدي جي والسمر',
      description: 'جلسات استرخاء شاطئية مع مشروبات دافئة وقت غروب شمس السخنة وموسيقى ساحلية هادئة وتكريمات.',
      category: 'entertainment',
      location: 'اللاونج الشاطئي'
    },
    {
      id: 'sch-9',
      day: 'الجمعة 28/11',
      time: '07:30 م',
      title: 'ركوب الباصات ورحلة العودة بسلامة الله',
      description: 'تجهيز الحقائب وركوب الباصات والعودة إلى شارع الاستاد بذكريات وصداقات تدوم طول السنين.',
      category: 'departure',
      location: 'بوابة الخروج الرئيسية — السخنة'
    }
  ],
  supervisors: [
    {
      id: 'sup-1',
      name: 'كابتن / محمد إبراهيم',
      role: 'قائد عام الفوج ومسؤول رحلات كيان',
      phone: '01012345678',
      busNumber: 1,
      whatsapp: '201012345678'
    },
    {
      id: 'sup-2',
      name: 'أ / سارة المنشاوي',
      role: 'مشرفة شؤون الطالبات وباص 2',
      phone: '01123456789',
      busNumber: 2,
      whatsapp: '201123456789'
    },
    {
      id: 'sup-3',
      name: 'أ / حازم الشناوي',
      role: 'مشرف الأنشطة الرياضية وباص 3',
      phone: '01234567890',
      busNumber: 3,
      whatsapp: '201234567890'
    },
    {
      id: 'sup-4',
      name: 'د / أحمد سمير',
      role: 'طبيب الفوج ومشرف السلامة وباص 4',
      phone: '01543219876',
      busNumber: 4,
      whatsapp: '201543219876'
    }
  ],
  packingList: [
    { id: 'p-1', name: 'أصل بطاقة الرقم القومي أو كارنيه الكلية (إجباري)', category: 'essential', isMandatory: true, tip: 'لن يسمح بالصعود للباص بدونها في كمائن الطريق' },
    { id: 'p-2', name: 'تيشرت أبيض قطني إضافي لمهرجان الألوان', category: 'clothes', isMandatory: true, tip: 'لتحصل على أروع لقطات وصور ألوان ملونة ومبهجة' },
    { id: 'p-3', name: 'مايوه أو ملابس سباحة ومناشف سريعة الجفاف', category: 'clothes', isMandatory: true, tip: 'لحفلة الفوم ونزول البحر وحمامات السباحة' },
    { id: 'p-4', name: 'شاحن الهاتف وباور بانك قوي مشحون', category: 'tech', isMandatory: true, tip: 'مهم جداً لتصوير مقاطع الفيديو والميموري طوال اليوم' },
    { id: 'p-5', name: 'نظارة شمسية وكاب وواقي شمس قوي (Sunscreen)', category: 'health', isMandatory: true, tip: 'شمس السخنة الصيفية دافئة وساطعة' },
    { id: 'p-6', name: 'جراب حماية الموبايل المقاوم للماء (Waterproof)', category: 'tech', isMandatory: false, tip: 'لحماية موبايلك أثناء حفلة الفوم والنزول في البحر' },
    { id: 'p-7', name: 'طقم ملابس بديل وخفيف للرجوع', category: 'clothes', isMandatory: true, tip: 'لتبديل الملابس بعد انتهاء أنشطة البحر والألوان' },
    { id: 'p-8', name: 'حذاء بحر خفيف / شبشب شاطئ مريح', category: 'essential', isMandatory: false, tip: 'لسهولة الحركة على رمال الشاطئ واللاونج' },
    { id: 'p-9', name: 'أدوية شخصية ومسكنات بسيطة', category: 'health', isMandatory: false, tip: 'لراحتك في الطريق أو بعد مجهود السباحة' }
  ],
  students: [
    { id: 'std-1', name: 'أحمد محمود حسن', universityId: '20220411', phone: '01099887766', busNumber: 1, seatNumber: '12A', supervisorName: 'كابتن / محمد إبراهيم' },
    { id: 'std-2', name: 'مريم طارق سالم', universityId: '20230115', phone: '01155443322', busNumber: 2, seatNumber: '05B', supervisorName: 'أ / سارة المنشاوي' },
    { id: 'std-3', name: 'عمر خالد الدسوقي', universityId: '20210892', phone: '01211223344', busNumber: 1, seatNumber: '14A', supervisorName: 'كابتن / محمد إبراهيم' },
    { id: 'std-4', name: 'نور الدين مصطفى', universityId: '20220734', phone: '01599881122', busNumber: 3, seatNumber: '08C', supervisorName: 'أ / حازم الشناوي' },
    { id: 'std-5', name: 'ياسمين عصام كمال', universityId: '20230554', phone: '01066778899', busNumber: 2, seatNumber: '06A', supervisorName: 'أ / سارة المنشاوي' },
    { id: 'std-6', name: 'كريم وائل عبدالرحمن', universityId: '20210344', phone: '01288990011', busNumber: 4, seatNumber: '11B', supervisorName: 'د / أحمد سمير' },
    { id: 'std-7', name: 'شهد هاني الجمل', universityId: '20230981', phone: '01144556677', busNumber: 2, seatNumber: '09A', supervisorName: 'أ / سارة المنشاوي' },
    { id: 'std-8', name: 'زياد حاتم فؤاد', universityId: '20220612', phone: '01011224455', busNumber: 3, seatNumber: '04A', supervisorName: 'أ / حازم الشناوي' }
  ],
  safetyRules: [
    { id: 'r-1', title: 'الالتزام بمواعيد التجمع والتحرك', desc: 'أي تأخير يربك جدول الفوج بالكامل، الباص سيتحرك في الموعد المحدد بدقة.' },
    { id: 'r-2', title: 'سلامة الألوان والفوم', desc: 'جميع بودرة الألوان ومواد الفوم معتمدة طبياً وآمنة تماماً على البشرة والعيون.' },
    { id: 'r-3', title: 'مواعيد السباحة وتعليمات المنقذين', desc: 'السباحة مسموحة فقط في الأماكن المحددة وتحت إشراف فريق الإنقاذ وإدارة الشاطئ.' },
    { id: 'r-4', title: 'التواصل الفوري مع مشرف الباص', desc: 'في حالة حدوث أي طارئ أو شعور بالإجهاد، توجه لمشرف باصك أو طبيب الفوج فوراً.' }
  ],
  faqs: [
    { id: 'f-1', question: 'هل الرحلة تشمل مهرجان الفوم والألوان وجلسة الدرون؟', answer: 'نعم، اشتراك الرحلة شامل بالكامل مدفع الفوم، عبوات بودرة الألوان، وتصوير الدرون السينمائي لجميع الطلاب مجاناً.' },
    { id: 'f-2', question: 'هل تشمل وجبة الغداء والمشروبات؟', answer: 'نعم، يشمل الاشتراك وجبة إفطار خفيفة في الباص صباحاً، وبوفيه غداء مفتوح في مطعم المنتجع مع مياه ومشروبات منعشة.' },
    { id: 'f-3', question: 'هل توجد غرف أو كبائن لتغيير الملابس والاستحمام؟', answer: 'نعم، تم حجز كبائن وشاليهات لتغيير الملابس وحمامات مجهزة وشاور خاص بفوج كيان طوال اليوم.' },
    { id: 'f-4', question: 'متى نستلم الصور وفيديوهات الدرون بعد الرحلة؟', answer: 'يتم رفع جميع الصور والفيديوهات الاحترافية بجودة فائقة على جوجل درايف وإرسال الرابط في جروب الواتساب خلال 48 ساعة من العودة.' }
  ],
  galleryItems: DEFAULT_GALLERY_ITEMS
};
