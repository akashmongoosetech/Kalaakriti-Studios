import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, window.scrollY / docHeight)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-[#C5A46D] origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
