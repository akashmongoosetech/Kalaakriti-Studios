import { useEffect, useRef } from 'react';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const applyProgress = (value: number) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
      }
    };

    if (lenis) {
      const onLenisScroll = ({ progress }: { progress: number }) => {
        applyProgress(progress);
      };
      lenis.on('scroll', onLenisScroll);
      applyProgress(lenis.progress || 0);
      return () => {
        lenis.off('scroll', onLenisScroll);
      };
    }

    const onNativeScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      applyProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    onNativeScroll();
    return () => window.removeEventListener('scroll', onNativeScroll);
  }, [lenis]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full bg-[#C5A46D] origin-left will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
