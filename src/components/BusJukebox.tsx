import React, { useState, useEffect } from 'react';
import {
  Music,
  ThumbsUp,
  Plus,
  Sparkles,
  Flame,
  Radio,
  Disc3,
  CheckCircle2,
  Headphones,
  Send
} from 'lucide-react';

interface TrackSuggestion {
  id: string;
  title: string;
  artist: string;
  category: 'hype' | 'chill' | 'party' | 'classic';
  votes: number;
  suggestedBy?: string;
}

const INITIAL_PLAYLIST: TrackSuggestion[] = [
  {
    id: 'track-1',
    title: 'يوم في السخنة ميتعوضش (أغنية كيان الرسمية 2026)',
    artist: 'فريق وكورال كيان الرسمي',
    category: 'hype',
    votes: 89,
    suggestedBy: 'إدارة كيان'
  },
  {
    id: 'track-2',
    title: 'سطلانة — ميكس هتافات وأفراح الباص',
    artist: 'أجواء مسابقات وتحديات الحافلة',
    category: 'party',
    votes: 74,
    suggestedBy: 'أحمد شريف (باص 1)'
  },
  {
    id: 'track-3',
    title: 'حلوة البدايات — روقان الطريق الصحراوي',
    artist: 'عمرو دياب',
    category: 'chill',
    votes: 62,
    suggestedBy: 'سارة خالد'
  },
  {
    id: 'track-4',
    title: 'يا ليالي — أجواء وانتعاش الشاطئ',
    artist: 'أحمد سعد وروبي',
    category: 'party',
    votes: 55,
    suggestedBy: 'فريق الفعاليات'
  },
  {
    id: 'track-5',
    title: 'ميدلي نوستالجيا التسعينات والشتا',
    artist: 'ميكس كلاسيكيات السفر والطريق',
    category: 'classic',
    votes: 48,
    suggestedBy: 'مروان عادل'
  },
  {
    id: 'track-6',
    title: 'الغزالة رايقة — بهجة الانطلاق الصباحي',
    artist: 'أجواء الاستاد والانطلاق',
    category: 'hype',
    votes: 41,
    suggestedBy: 'مشرف الرحلة'
  }
];

const STORAGE_KEY = 'kayan_bus_jukebox_tracks_v1';
const VOTED_KEY = 'kayan_bus_jukebox_voted_ids_v1';

export const BusJukebox: React.FC = () => {
  const [tracks, setTracks] = useState<TrackSuggestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PLAYLIST;
  });

  const [votedIds, setVotedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(VOTED_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [filter, setFilter] = useState<'all' | 'hype' | 'party' | 'chill' | 'classic'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newSuggester, setNewSuggester] = useState('');
  const [newCategory, setNewCategory] = useState<'hype' | 'party' | 'chill' | 'classic'>('hype');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
    } catch {
      // ignore
    }
  }, [tracks]);

  useEffect(() => {
    try {
      localStorage.setItem(VOTED_KEY, JSON.stringify(votedIds));
    } catch {
      // ignore
    }
  }, [votedIds]);

  const handleVote = (id: string) => {
    const hasVoted = votedIds[id];
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            votes: hasVoted ? Math.max(0, t.votes - 1) : t.votes + 1
          };
        }
        return t;
      })
    );

    setVotedIds((prev) => ({
      ...prev,
      [id]: !hasVoted
    }));
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTrackItem: TrackSuggestion = {
      id: `user-track-${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim() || 'فنان الباص',
      category: newCategory,
      votes: 1,
      suggestedBy: newSuggester.trim() || 'طالب من الفوج'
    };

    setTracks((prev) => [newTrackItem, ...prev]);
    setVotedIds((prev) => ({ ...prev, [newTrackItem.id]: true }));

    setNewTitle('');
    setNewArtist('');
    setNewSuggester('');
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowAddForm(false);
    }, 2000);
  };

  // Sort by votes descending
  const sortedTracks = [...tracks].sort((a, b) => b.votes - a.votes);
  const filteredTracks = filter === 'all'
    ? sortedTracks
    : sortedTracks.filter((t) => t.category === filter);

  const topTrack = sortedTracks[0];

  return (
    <section id="bus-jukebox-section" className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="bg-gradient-to-br from-[#09182d]/95 via-[#061224]/98 to-[#030913]/98 border border-cyan-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-800/90 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-sky-400/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-inner shrink-0">
              <Headphones className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase font-tech">
                  BUS JUKEBOX & DJ VOTING
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                  تصويت حي
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white">
                صندوق أغاني الباص وحفلة الشاطئ 🎵🚌
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:brightness-110 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>اقترح أغنية للباص</span>
          </button>
        </div>

        {/* Top Track Banner */}
        {topTrack && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-indigo-950/60 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="flex items-center gap-3 text-right w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                  <span>الأغنية المتصدرة حالياً في الباص (#1 TRENDING)</span>
                </div>
                <div className="text-sm sm:text-base font-black text-white truncate">
                  {topTrack.title}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {topTrack.artist} • اقتراح: {topTrack.suggestedBy || 'إدارة الفوج'}
                </div>
              </div>
            </div>

            {/* Audio Waveform Animation & Votes */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="flex items-end gap-1 h-5 px-2 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.5s_infinite] h-4" />
                <span className="w-1 bg-cyan-300 rounded-full animate-[bounce_0.8s_infinite] h-5" />
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite] h-3" />
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.9s_infinite] h-4.5" />
              </div>
              <button
                type="button"
                onClick={() => handleVote(topTrack.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  votedIds[topTrack.id]
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${votedIds[topTrack.id] ? 'fill-current' : ''}`} />
                <span>{topTrack.votes} صوت</span>
              </button>
            </div>
          </div>
        )}

        {/* Suggestion Form */}
        {showAddForm && (
          <form onSubmit={handleAddTrack} className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3.5 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Radio className="w-4 h-4" />
                <span>اقتراح أغنية جديدة لتشغيلها في الرحلة</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسم الأغنية المطلوبة *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: يا ليالي — روبي وأحمد سعد"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  المغني أو الفرقة
                </label>
                <input
                  type="text"
                  placeholder="مثال: عمرو دياب / أحمد سعد"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسمك (صاحب الاقتراح)
                </label>
                <input
                  type="text"
                  placeholder="مثال: أحمد مصطفى (باص 2)"
                  value={newSuggester}
                  onChange={(e) => setNewSuggester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  نوع الأجواء المناسبة للأغنية
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="hype">هتافات ومسابقات الباص 🚌</option>
                  <option value="party">حفلة الشاطئ والكلر 🎧</option>
                  <option value="chill">روقان الطريق الصحراوي 🌊</option>
                  <option value="classic">نوستالجيا وتسعينات 📼</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {submitSuccess ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم إضافة اقتراحك لقائمة التصويت بنجاح!</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  * الأغاني الحاصلة على أعلى أصوات ستشغل في مقدمة فقرات الباص.
                </span>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الاقتراح</span>
              </button>
            </div>
          </form>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {[
            { key: 'all', label: 'جميع الأغاني 🎵' },
            { key: 'hype', label: 'مسابقات وهتاف الباص 🚌' },
            { key: 'party', label: 'حفلة الشاطئ 🎧' },
            { key: 'chill', label: 'روقان الطريق 🌊' },
            { key: 'classic', label: 'نوستالجيا وتسعينات 📼' }
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFilter(cat.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === cat.key
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Playlist Songs List */}
        <div className="space-y-2.5">
          {filteredTracks.map((track, index) => {
            const hasVoted = votedIds[track.id];
            return (
              <div
                key={track.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center font-tech font-bold text-xs text-slate-500">
                    #{index + 1}
                  </span>
                  
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                      {track.title}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 truncate">
                      <span>{track.artist}</span>
                      {track.suggestedBy && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500">بواسطة: {track.suggestedBy}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vote Action */}
                <button
                  type="button"
                  onClick={() => handleVote(track.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                    hasVoted
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current text-cyan-400' : ''}`} />
                  <span className="font-mono">{track.votes}</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
