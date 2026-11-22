import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_FAQS } from '../../data/faqs';
import { SectionHeading } from '../../components/common/SectionHeading';

export function AnimatedStatsStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState<number[]>(STUDIO_CONFIG.demoStats.map(() => 0));
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const duration = 1100;
          const start = performance.now();

          const step = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts(STUDIO_CONFIG.demoStats.map((s) => Math.round(s.value * eased)));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#57252F] text-[#F7F2E9] py-16 md:py-20 border-y border-[#C5A46D]/25">
      <div className="studio-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {STUDIO_CONFIG.demoStats.map((stat, idx) => (
            <div
              key={stat.label}
              className="border-t border-[#C5A46D]/35 pt-6 flex flex-col justify-between"
            >
              <div className="font-editorial text-4xl sm:text-5xl 2xl:text-6xl font-medium text-[#F7F2E9] tabular-nums">
                {counts[idx]}
                <span className="text-[#C5A46D]">{stat.suffix}</span>
              </div>
              <div className="mt-2.5 text-sm sm:text-base font-medium text-[#E8DCCB]">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-[#E8DCCB]/60">{stat.note}</div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-[#E8DCCB]/65">
          Demonstration figures shown for studio layout preview — edit directly in centralized studio configuration with verified studio milestones.
        </p>
      </div>
    </section>
  );
}

export function FAQAccordionSection() {
  const [openId, setOpenId] = useState<string | null>(STUDIO_FAQS[0].id);

  return (
    <section className="py-20 md:py-28 bg-[#F7F2E9]">
      <div className="studio-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <SectionHeading
              devanagari="प्रश्नोत्तरी"
              kicker="Frequently Asked Questions"
              title="Planning Details, Answered Transparently"
              description="Everything families ask us regarding booking advances, candid plus traditional coverage, travel across Madhya Pradesh, album craftsmanship, and rescheduling."
            />
          </div>

          <div className="lg:col-span-8 divide-y divide-[#171615]/12 border-y border-[#171615]/12">
            {STUDIO_FAQS.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-6 text-left cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs tracking-wider text-[#57252F] mb-1">
                        {String(idx + 1).padStart(2, '0')} · {faq.topic}
                      </div>
                      <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#171615] group-hover:text-[#57252F] transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#57252F] shrink-0 mt-2 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-4 text-sm sm:text-base text-[#5C554E] leading-relaxed prose-measure">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
