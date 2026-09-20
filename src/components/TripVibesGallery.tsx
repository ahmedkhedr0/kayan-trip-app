import React, { useState } from 'react';
import {
  Camera,
  Heart,
  Sparkles,
  Maximize2,
  X,
  Send,
  Bus,
  Film,
  Users,
  Waves,
  Music,
  Image as ImageIcon,
  Play,
  Video,
  ExternalLink
} from 'lucide-react';
import { GalleryItem, GalleryItemCategory } from '../types';
import { DEFAULT_GALLERY_ITEMS } from '../data/defaultGallery';
import { parseVideoUrl } from '../utils/mediaUtils';

export type GalleryFilterCategory = 'all' | GalleryItemCategory | 'video';

interface TripVibesGalleryProps {
  items?: GalleryItem[];
  whatsappGroupUrl?: string;
  onOpenAdmin?: () => void;
}

export const TripVibesGallery: React.FC<TripVibesGalleryProps> = ({
  items = DEFAULT_GALLERY_ITEMS,
  whatsappGroupUrl,
  onOpenAdmin
}) => {
  const [activeCategory, setActiveCategory] = useState<GalleryFilterCategory>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const galleryList = items && items.length > 0 ? items : DEFAULT_GALLERY_ITEMS;

  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredItems = galleryList.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'video') return item.type === 'video';
    return item.category === activeCategory;
  });

  const categories: { key: GalleryFilterCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'all', label: `الكل (${galleryList.length}) 🌟`, icon: Camera },
    { key: 'video', label: 'فيديوهات حصرية 🎬', icon: Video },
    { key: 'funday', label: 'Fun Day وألوان 🎈', icon: Sparkles },
    { key: 'students', label: 'طلبة وذكريات 🎓', icon: Users },
    { key: 'buses', label: 'باصات السفر 🚌', icon: Bus },
    { key: 'beach', label: 'بحر ويخوت 🌊', icon: Waves },
    { key: 'stage', label: 'ستيدج ومسرح 🎤', icon: Music },
    { key: 'movienight', label: 'موفي نايت 🍿', icon: Film },
    { key: 'company_banners', label: 'بانرات الشركة 🏷️', icon: ImageIcon }
  ];

  return (
    <section id="trip-vibes-gallery-section" className="py-12 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-bold mb-2.5 shadow-sm">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>OFFICIAL TRIP ALBUM & VIDEOS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
          معرض الأجواء والفيديوهات ولحظات الرحلة 📸🎬
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          شاهد لقطات وفيديوهات الـ Fun Day، وتجمع الطلبة، والباصات السياحية، وشواطئ البحر، والستيدج والدي جي، وسينما الموفي نايت، وبانرات كيان الرسمية!
        </p>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-105 ring-2 ring-cyan-300'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm">
          لا توجد عناصر في هذا التصنيف حالياً. يمكنك إضافة صور وفيديوهات من لوحة الإدارة!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isLiked = likedMap[item.id];
            const totalLikes = item.likes + (isLiked ? 1 : 0);
            const isVideo = item.type === 'video';
            const parsed = isVideo ? parseVideoUrl(item.url) : null;
            const displayImage = item.thumbnail || (parsed?.thumbnail) || item.url;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col"
              >
                {/* Media Container - Fast CSS & Web-Optimized */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950 relative">
                  {/* Static Thumbnail image (NEVER load raw heavy video in grid for high performance) */}
                  <img
                    src={displayImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/banner_sokhna.jpg';
                    }}
                  />

                  {/* Video Play Badge Center */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-13 h-13 rounded-full bg-rose-600/95 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                    {isVideo && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-600 text-white flex items-center gap-1 shadow-sm">
                        <Video className="w-3 h-3" />
                        <span>فيديو</span>
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  {/* Like Button on Image */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleLike(item.id, e)}
                    aria-label="إعجاب بالصورة"
                    className={`absolute top-3 left-3 z-10 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                      isLiked
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40'
                        : 'bg-slate-950/60 text-white/80 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>

                  {/* Bottom Overlay Info on Hover */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1.5 text-slate-300 text-[11px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                      <span>{totalLikes} إعجاب</span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>{isVideo ? 'تشغيل الفيديو' : 'تكبير الصورة'}</span>
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Text Meta */}
                <div className="p-4 bg-slate-900 flex-1 flex flex-col justify-between border-t border-slate-850">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photography & Drive Coverage Banner */}
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-right">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-white block">
              تغطية تصوير وفيديو سينمائي متكاملة مجاناً لجميع الطلاب 📸🎬
            </span>
            <span className="text-[11px] text-slate-400">
              يتم رفع ألبومات صور وفيديوهات الـ Fun Day، والباصات، والشاطئ، والموفي نايت بجودة فائقة على جوجل درايف بعد الرحلة.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              <span>إدارة المعرض ⚙️</span>
            </button>
          )}

          {whatsappGroupUrl && (
            <a
              href={whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shrink-0 shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>جروب صور وفيديوهات الرحلة</span>
            </a>
          )}
        </div>
      </div>

      {/* Lightbox Modal (Supports Image & Video with Full Fallbacks) */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              aria-label="إغلاق العرض"
              className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors shadow-lg border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Content */}
            <div className="max-h-[70vh] min-h-[320px] w-full overflow-hidden bg-black flex items-center justify-center relative">
              {selectedItem.type === 'video' ? (
                (() => {
                  const media = parseVideoUrl(selectedItem.url);

                  if (media.isEmbed && media.embedUrl) {
                    return (
                      <div className="w-full h-[55vh] max-h-[70vh] relative bg-black">
                        <iframe
                          src={media.embedUrl}
                          title={selectedItem.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    );
                  }

                  return (
                    <video
                      key={selectedItem.url}
                      src={selectedItem.url}
                      controls
                      autoPlay
                      playsInline
                      className="max-h-[70vh] w-full object-contain bg-black"
                    >
                      <source src={selectedItem.url} type="video/mp4" />
                      متصفحك لا يدعم تشغيل هذا الفيديو مباشرة.
                    </video>
                  );
                })()
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="max-h-[70vh] w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/banner_sokhna.jpg';
                  }}
                />
              )}

              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                {selectedItem.type === 'video' && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-600 text-white flex items-center gap-1 shadow-md">
                    <Video className="w-3.5 h-3.5" />
                    <span>فيديو</span>
                  </span>
                )}
                <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-950/90 text-cyan-300 border border-cyan-500/40 shadow-lg">
                  {selectedItem.badge}
                </span>
              </div>
            </div>

            {/* Modal Info Bar */}
            <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border-t border-slate-800">
              <div className="text-center sm:text-right">
                <h4 className="text-base sm:text-lg font-black text-white">
                  {selectedItem.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  {selectedItem.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {selectedItem.type === 'video' && (
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    <span>فتح المصدر</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleLike(selectedItem.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    likedMap[selectedItem.id]
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedMap[selectedItem.id] ? 'fill-current' : ''}`} />
                  <span>{selectedItem.likes + (likedMap[selectedItem.id] ? 1 : 0)} إعجاب</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
