import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  RotateCcw,
  Share2,
  CheckCircle2,
  Trophy,
  Smile,
  Camera,
  Waves,
  Music,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    type: 'photo' | 'chill' | 'hype' | 'joy';
    emoji: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'أول ما الباص يتحرك الصبح، بتعمل إيه؟ 🚌',
    options: [
      { text: 'ماسك المايك وبغني ومولع مسابقات وهتاف مع الكل', type: 'hype', emoji: '🎤' },
      { text: 'مشغل الأغاني في السماعات وببص من الشباك بروقان', type: 'chill', emoji: '🌊' },
      { text: 'مجهز الشيبسي والمقرمشات وبسأل على أول استراحة للأكل', type: 'joy', emoji: '🥪' },
      { text: 'ماسك الموبايل وبصور ستوريهات وفيديوهات بداية المغامرة', type: 'photo', emoji: '📸' }
    ]
  },
  {
    id: 2,
    question: 'وصلنا شاطئ السخنة ونزلنا على الرملة، أول خطوة ليك؟ 🏖️',
    options: [
      { text: 'بجري أرمي نفسي في البحر وأستمتع بالمية والويفز فوراً', type: 'chill', emoji: '🏊' },
      { text: 'بنقي أفضل زاوية مع إضاءة الشمس وأبدأ الفوتوسيشن', type: 'photo', emoji: '📸' },
      { text: 'بجمع الفوج ونبدأ نلعب راكيت وكورة طائرة ومسابقات', type: 'hype', emoji: '🏐' },
      { text: 'برتب قعدة الشمسة والكراسي وبظبط المشروبات والضحك', type: 'joy', emoji: '🍹' }
    ]
  },
  {
    id: 3,
    question: 'في حفلة الكلر والدي جي بعد الظهر، مكانك المفضل فين؟ 🎉',
    options: [
      { text: 'في نص الدائرة برقص ومولع الأجواء ومش سايب حد واقف', type: 'hype', emoji: '🕺' },
      { text: 'واقف مع كاميرتي بوثق أروع اللحظات والضحكات التلقائية', type: 'photo', emoji: '🎥' },
      { text: 'مستمتع من مكان رايق على البحر وبصور الألوان وأنا هادي', type: 'chill', emoji: '😎' },
      { text: 'بتأكد إن كل صحابي مبسوطين وبوزع عليهم بودرة الألوان', type: 'joy', emoji: '🎨' }
    ]
  }
];

interface Persona {
  title: string;
  tagline: string;
  description: string;
  powerMove: string;
  badge: string;
  color: string;
}

const PERSONAS: Record<'photo' | 'chill' | 'hype' | 'joy', Persona> = {
  photo: {
    title: '📸 ملك السيشن والتصوير (The Photo Legend)',
    tagline: 'موبايلك مليان مساحة ومجهز أفضل زوايا للشاطئ والغروب!',
    description: 'أنت صانع الذكريات الحقيقي في الرحلة. عينك فنانة وبتعرف تطلع لقطات سينمائية تبهر الكل، وكل أصحابك في الرحلة معتمدين عليك في صور الإنستغرام والستوريز!',
    powerMove: 'صورة الساعة الذهبية (Golden Hour) على البحر هتكسر السوشيال ميديا!',
    badge: 'فنان الأفواج',
    color: 'from-amber-400 to-rose-500'
  },
  chill: {
    title: '🌊 برنس البحر والروقان (The Chill Boss)',
    tagline: 'رايح تفصل دماغك وتستمتع بصوت الموج والشمس والراحة التامة!',
    description: 'ملك الهدوء والاسترخاء. بتعرف تستمتع بنسمات البحر وتنسى كل ضغوط المذاكرة والامتحانات، وجودك بينشر طاقة إيجابية وهدوء نفسي لكل اللي حواليك.',
    powerMove: 'النزول في أول موجة وطلب عصير منعش مع غروب الشمس.',
    badge: 'سفير الروقان',
    color: 'from-cyan-400 to-blue-600'
  },
  hype: {
    title: '🎤 دينامو الباص ونجم الفعاليات (The Hype Master)',
    tagline: 'الرحلة من غيرك ملهاش حس! أنت طاقة الفرحة والضحك التي لا تنطفئ!',
    description: 'أنت روح الرحلة وقلبها النابض. بتبدأ الضحك والهتاف والمسابقات من أول ما الباص يتحرك لحد ما نرجع، ومستحيل حد يكون حواليك ويكون ساكت أو مش مبتسم!',
    powerMove: 'إشعال مسابقات الأغاني وحفلة الكلر والدي جي من أول دقيقة!',
    badge: 'دينامو كيان',
    color: 'from-purple-400 to-pink-500'
  },
  joy: {
    title: '🥪 عمدة الرحلة وراعي الضحكة والجدعنة (The Joy Ambassador)',
    tagline: 'صاحب الجدعنة والسناكس، اللي بيهتم بكل أصحابه وبيتأكد إن الكل مبسوط!',
    description: 'قلب الرحلة الطيب وروح الجماعة. دايماً معاك كل حاجة ناقصة أي حد (شاحن، سناكس، مناديل، بندول)، والكل بيحب يقعد جنبك عشان كرمك وضحكتك الحلوة.',
    powerMove: 'تظبيط أروع قعدة لمة وفطار جماعي على شاطئ السخنة!',
    badge: 'عمدة الفوج',
    color: 'from-emerald-400 to-teal-500'
  }
};

export const TripPersonaQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<('photo' | 'chill' | 'hype' | 'joy')[]>([]);
  const [result, setResult] = useState<Persona | null>(null);

  const handleSelectOption = (type: 'photo' | 'chill' | 'hype' | 'joy') => {
    const updatedAnswers = [...answers, type];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < QUESTIONS.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate winner
      const counts: Record<string, number> = { photo: 0, chill: 0, hype: 0, joy: 0 };
      updatedAnswers.forEach((ans) => {
        counts[ans] = (counts[ans] || 0) + 1;
      });

      let winner: 'photo' | 'chill' | 'hype' | 'joy' = 'hype';
      let maxCount = -1;
      (Object.keys(counts) as ('photo' | 'chill' | 'hype' | 'joy')[]).forEach((key) => {
        if (counts[key] > maxCount) {
          maxCount = counts[key];
          winner = key;
        }
      });

      setResult(PERSONAS[winner]);

      // Confetti
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
  };

  const handleShareResult = () => {
    if (!result) return;
    const text = encodeURIComponent(
      `🎉 عملت كويز شخصية رحلة السخنة مع كيان وطلعت:\n` +
      `✨ ${result.title}\n` +
      `💬 "${result.tagline}"\n` +
      `🚀 حركة التميز: ${result.powerMove}\n` +
      `جرب الكويز وشوف شخصيتك أنت كمان!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const currentQ = QUESTIONS[currentQuestionIndex];

  return (
    <section id="trip-quiz-section" className="py-8 sm:py-10 max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="bg-gradient-to-br from-[#0c1626]/95 via-[#08111e]/98 to-[#040810]/98 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Decorative Top Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>QUIZ: من أنت في رحلة كيان؟</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            اكتشف دورك وشخصيتك في الرحلة 🎡
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            3 أسئلة خفيفة وممتعة تكشف لك دورك الحقيقي مع أصحابك في اليوم!
          </p>
        </div>

        {/* Quiz Flow */}
        {!result ? (
          <div className="space-y-5">
            {/* Step Progress */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-tech px-1">
              <span>السؤال {currentQuestionIndex + 1} من {QUESTIONS.length}</span>
              <div className="flex gap-1.5">
                {QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`w-6 h-1.5 rounded-full transition-all ${
                      i === currentQuestionIndex
                        ? 'bg-cyan-400 w-8'
                        : i < currentQuestionIndex
                        ? 'bg-emerald-400'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white text-right leading-relaxed mb-4">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(opt.type)}
                    className="w-full text-right p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-400/60 text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-between group active:scale-[0.99]"
                  >
                    <span className="text-xs sm:text-sm font-semibold group-hover:text-cyan-300 transition-colors">
                      {opt.text}
                    </span>
                    <span className="text-xl shrink-0 mr-3">{opt.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Result Card */
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-400/40 text-center space-y-4 relative overflow-hidden">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-black">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>شخصيتك الرسمية في الرحلة</span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {result.title}
              </h3>

              <p className="text-sm font-bold text-cyan-300">
                "{result.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                {result.description}
              </p>

              {/* Power move */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-right space-y-1">
                <span className="font-black text-amber-400 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  حركتك الأسطورية في اليوم (Power Move):
                </span>
                <span className="text-slate-200 font-semibold">
                  {result.powerMove}
                </span>
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleShareResult}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة نتيجتي في واتساب والستوري</span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الكويز</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
