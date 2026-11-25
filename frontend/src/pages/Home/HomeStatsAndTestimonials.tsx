import { useEffect, useRef, useState } from 'react';
import { STUDIO_CONFIG } from '../../data/studio';
export { CollapsibleFAQ as FAQAccordionSection } from '../../components/common/CollapsibleFAQ';

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
