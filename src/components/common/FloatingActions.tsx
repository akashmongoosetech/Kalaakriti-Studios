import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { WhatsAppChatButton } from './WhatsAppChatButton';

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 480);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#171615]/92 text-[#F7F2E9] border border-[#C5A46D]/40 shadow-lg hover:bg-[#57252F] transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        </button>
      )}

      <WhatsAppChatButton />
    </div>
  );
}
