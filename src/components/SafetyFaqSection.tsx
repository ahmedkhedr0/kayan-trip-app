import React, { useState } from 'react';
import { ShieldAlert, HelpCircle, ChevronDown, ChevronUp, CheckCircle, HeartHandshake, MessageSquare } from 'lucide-react';

interface SafetyFaqSectionProps {
  safetyRules: Array<{ id: string; title: string; desc: string }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
  whatsappGroupUrl?: string;
}

export const SafetyFaqSection: React.FC<SafetyFaqSectionProps> = ({ safetyRules, faqs, whatsappGroupUrl }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="safety-faq-section" className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Safety & Conduct Guidelines */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm backdrop-blur-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/25 px-2.5 py-0.5 rounded-full mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>سلامتك أولويتنا القصوى</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white mb-1.5">
              إرشادات وقواعد سلامة رحلة كيان
            </h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              نلتزم بأعلى معايير الأمان للطلبة لضمان يوم استثنائي وممتع للجميع:
            </p>

            <div className="space-y-2">
              {safetyRules.map((rule, idx) => (
                <div key={rule.id || idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                  <div className="w-5 h-5 rounded-md bg-cyan-500/15 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold border border-cyan-500/30">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">{rule.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
            <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>فريق كيان الطبي والإشرافي مرافق لكم طوال فعاليات اليوم</span>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm backdrop-blur-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/25 px-2.5 py-0.5 rounded-full mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>إجابات سريعة تهمك</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white mb-1.5">
              الأسئلة الشائعة من الطلبة
            </h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              أهم استفسارات الطلاب قبل انطلاق الرحلة
            </p>

            <div className="space-y-2">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-slate-700/60 overflow-hidden bg-slate-800/40 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-2.5 sm:p-3 text-right flex items-center justify-between gap-2 hover:bg-slate-800/60 transition-colors"
                    >
                      <span className="text-xs font-bold text-white leading-snug">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-3 pb-3 pt-1 text-[11px] sm:text-xs text-slate-300 leading-relaxed border-t border-slate-700/40 bg-slate-900/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {whatsappGroupUrl && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 text-[11px]">لديك سؤال آخر؟</span>
              <a
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>اسأل في جروب الواتساب</span>
              </a>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
