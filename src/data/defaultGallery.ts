import { GalleryItem } from '../types';

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  // 1. Fun Day & Color / Foam Festival
  {
    id: 'funday-1',
    type: 'image',
    category: 'funday',
    title: 'مهرجان الألوان والـ Color Festival',
    desc: 'انفجار الألوان والبهجة مع أغاني الدي جي ولمة الطلاب المليانة طاقة وضحك',
    badge: 'Fun Day 🎉',
    url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80',
    likes: 342
  },
  {
    id: 'funday-2',
    type: 'image',
    category: 'funday',
    title: 'فوم بارتي ورغوة الصابون العملاقة',
    desc: 'أقوى فوم بارتي على الشاطئ مع مدافع الفوم ومسابقات التحدي المائية',
    badge: 'Foam Party 🫧',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
    likes: 289
  },
  {
    id: 'funday-3',
    type: 'image',
    category: 'funday',
    title: 'ألعاب التحدي والأنشطة الجماعية Team Building',
    desc: 'شد الحبل، وكرة الطائرة الشاطئية، ومسابقات الفرق بروح المنافسة الشريفة',
    badge: 'Games & Fun 🏆',
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80',
    likes: 215
  },

  // 2. طلبة وجلسات تصوير وسيلفي (Students & Friends)
  {
    id: 'students-1',
    type: 'image',
    category: 'students',
    title: 'صورة الفوج التذكارية ولمة الصحاب',
    desc: 'اللقطة الرسمية التي تجمع دفعة الطلاب مع تيشيرتات وهوية الرحلة',
    badge: 'دفعة 27 🎓',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
    likes: 412
  },
  {
    id: 'students-2',
    type: 'image',
    category: 'students',
    title: 'ضحكات ولحظات عفوية على شاطئ البحر',
    desc: 'جلسة تصوير فوتوغرافي بروفيشنال مع أصدقاء العمر في الهواء الطلق',
    badge: 'صناع الذكريات 📸',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    likes: 388
  },
  {
    id: 'students-3',
    type: 'image',
    category: 'students',
    title: 'سيشن تصوير الساعة الذهبية للطلبة',
    desc: 'أجمل البورتريتات الفردية والجماعية للطلاب مع انعكاس أشعة شمس الغروب',
    badge: 'Golden Hour ✨',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
    likes: 334
  },

  // 3. باصات السفر وأجواء الطريق (Buses & Road Trip)
  {
    id: 'buses-1',
    type: 'image',
    category: 'buses',
    title: 'أسطول باصات مرسيدس السياحية الحديثة VIP',
    desc: 'باصات مكيفة ومجهزة بأعلى معايير الراحة والسلامة مع مشرف لكل باص',
    badge: 'أسطول الرحلة 🚌',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    likes: 295
  },
  {
    id: 'buses-2',
    type: 'image',
    category: 'buses',
    title: 'أجواء ومسابقات الباص الصباحية وهيصة الأغاني',
    desc: 'مايك الباص لا يتوقف عن الضحك، والألغاز، وتوزيع هدايا كيان الفورية',
    badge: 'Bus Vibes 🎤',
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=80',
    likes: 367
  },
  {
    id: 'buses-3',
    type: 'image',
    category: 'buses',
    title: 'وقفة استراحة الطريق وتجمع الباصات',
    desc: 'كافيهات واستراحة ماستر طريق السخنة للقهوة والتقاط أولى صور الرحلة',
    badge: 'Road Stop ☕',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
    likes: 210
  },

  // 4. بحر ويخوت وشواطئ (Sea & Beach Waters)
  {
    id: 'beach-1',
    type: 'image',
    category: 'beach',
    title: 'شاطئ ونادي الجوهرة بالعين السخنة',
    desc: 'مياه فيروزية هادئة وشاطئ رملي مجهز بكراسي وشماسي مخصصة لفوج كيان',
    badge: 'شاطئ السخنة 🌊',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    likes: 476
  },
  {
    id: 'beach-2',
    type: 'image',
    category: 'beach',
    title: 'جولة اليخوت البحرية والبنانا بوت',
    desc: 'إبحار في قلب خليج السويس مع الأدرينالين والسباحة والتقاط لقطات الدرون',
    badge: 'Banana Boat 🛥️',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    likes: 399
  },
  {
    id: 'beach-3',
    type: 'image',
    category: 'beach',
    title: 'ألعاب الأكوا بارك والمسابح الشاطئية',
    desc: 'حمامات سباحة متعددة المستويات ومجهزة للكبار والشباب لقضاء يوم منعش',
    badge: 'Aqua & Pool 🏊',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80',
    likes: 312
  },

  // 5. ستيدج ومسرح الحفلات والدي جي (Stage & Live Concerts)
  {
    id: 'stage-1',
    type: 'image',
    category: 'stage',
    title: 'المسرح الشاطئي الرئيسي وعروض الدي جي الحية',
    desc: 'أنظمة صوتية وإضاءات ليزر عملاقة على الشاطئ تحول اليوم لاحتفال أسطوري',
    badge: 'Main Stage 🎶',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
    likes: 450
  },
  {
    id: 'stage-2',
    type: 'image',
    category: 'stage',
    title: 'فقرة المواهب وتوزيع دروع وجوائز كيان',
    desc: 'منصة مسرح مفتوحة لعرض مواهب الغناء والستاند أب كوميدي وتكريم الطلاب',
    badge: 'Talent Show 🌟',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80',
    likes: 278
  },
  {
    id: 'stage-3',
    type: 'video',
    category: 'stage',
    title: 'فيديو تشويقي: أجواء حفلة المسرح والدي جي',
    desc: 'لقطات حصرية لحفلة الدي جي السابقة وتفاعل الحضور مع الإيقاعات ومؤثرات الليزر',
    badge: 'فيديو حصري 🎬',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    likes: 360
  },
  {
    id: 'stage-4',
    type: 'video',
    category: 'funday',
    title: 'فيديو أجواء الفان داي والألوان — ملخص الفوج السابق',
    desc: 'شاهد بالفيديو لقطات مهرجان الألوان والفوم بارتي الحماسي',
    badge: 'Fun Day Reel 🎈',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80',
    likes: 412
  },

  // 6. موفي نايت والسينما الشاطئية (Movie Night Under The Stars)
  {
    id: 'movienight-1',
    type: 'image',
    category: 'movienight',
    title: 'شاشة العرض العملاقة وسينما الهواء الطلق',
    desc: 'جلسات شاطئية مريحة مع بين باجز وبطاطين لمشاهدة فيلم السهرة تحت النجوم',
    badge: 'Open Air Cinema 🍿',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
    likes: 425
  },
  {
    id: 'movienight-2',
    type: 'image',
    category: 'movienight',
    title: 'ركن الفشار وغزل البنات والمشروبات الساخنة',
    desc: 'بار سناك وسينما مفتوح يقدم الفشار الطازج ومشروبات الشتاء الدافئة',
    badge: 'Popcorn Bar ☕',
    url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=1000&q=80',
    likes: 284
  },
  {
    id: 'movienight-3',
    type: 'image',
    category: 'movienight',
    title: 'قعدة السمر الشاطئية ومارشملو على النار',
    desc: 'ختام سينمائي دافئ حول شعلة النار مع أحاديث الصحاب وعزف الجيتار',
    badge: 'Campfire & Stars 🪵',
    url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1000&q=80',
    likes: 391
  },

  // 7. بانرات وهوية الشركة (Company Banners & Official Branding)
  {
    id: 'banners-1',
    type: 'image',
    category: 'company_banners',
    title: 'البانر الرسمي لرحلة السخنة — كيان KAYAN',
    desc: 'التصميم المعتمد لرحلة شريف والجوهرة مع شعار كيان وألوان الصيف',
    badge: 'Official Banner 🏖️',
    url: '/banner_sokhna.jpg',
    likes: 520
  },
  {
    id: 'banners-2',
    type: 'image',
    category: 'company_banners',
    title: 'بانر منطقة الاستقبال وبوابة الدخول Photo Booth',
    desc: 'الرول أب والبانر الجداري المخصص لالتقاط صور الوصول والـ VIP Badges',
    badge: 'Photo Wall 🎯',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    likes: 318
  },
  {
    id: 'banners-3',
    type: 'image',
    category: 'company_banners',
    title: 'شعار وهوية كيان الرسمية — KAYAN',
    desc: 'شعار كيان للرحلات الترفيهية والفعاليات الشبابية الرسمية',
    badge: 'Kayan Identity 💎',
    url: '/kayan-logo.jpg',
    likes: 460
  }
];
