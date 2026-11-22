import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  headerActions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const SIZE_CLASSES: Record<NonNullable<AdminModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl',
};

export function AdminModal({
  open,
  onClose,
  title,
  description,
  size = 'lg',
  headerActions,
  footer,
  children,
}: AdminModalProps) {
  const { lockScroll, unlockScroll } = useSmoothScroll();

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlockScroll();
    };
  }, [open, onClose, lockScroll, unlockScroll]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-5 print:static print:p-0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171615]/60 backdrop-blur-[2px] print:hidden"
            aria-hidden="true"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className={`relative z-10 w-full ${SIZE_CLASSES[size]} max-h-[92vh] flex flex-col rounded-2xl bg-[#FFFFFF] border border-[#171615]/12 shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-0`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 border-b border-[#171615]/10 bg-[#F7F2E9]/60 shrink-0">
              <div className="min-w-0">
                <h2
                  id="admin-modal-title"
                  className="font-editorial text-2xl sm:text-[26px] font-medium text-[#171615] leading-snug"
                >
                  {title}
                </h2>
                {description && (
                  <p className="text-xs sm:text-sm text-[#5C554E] mt-0.5">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 print:hidden">
                {headerActions}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#171615]/12 bg-[#FFFFFF] text-[#5C554E] hover:text-[#171615] hover:border-[#57252F]/40 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 sm:py-6"
            >
              {children}
            </div>

            {/* Optional Footer */}
            {footer && (
              <div className="px-5 sm:px-7 py-4 border-t border-[#171615]/10 bg-[#F7F2E9]/45 flex flex-wrap items-center justify-end gap-3 shrink-0 print:hidden">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
