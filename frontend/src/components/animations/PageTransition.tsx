import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface PageTransitionProps {
  children: ReactNode;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

/**
 * Cinematic Framer Motion route wrapper.
 * Coordinates a compositor-only vertical fade/lift with a Deep Burgundy &
 * Antique Gold editorial reveal curtain during route navigation.
 * Clears transform via transitionEnd after entrance so fixed-position overlays
 * (such as GalleryLightbox) always anchor to the viewport.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.16 } }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="animate" exit="exit" className="relative">
      {/* Page Content — clears transform on settle so fixed modals stay viewport-anchored */}
      <motion.div
        variants={{
          initial: { opacity: 0, y: 16 },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.48,
              delay: 0.08,
              ease: EDITORIAL_EASE,
            },
            transitionEnd: {
              transform: 'none',
            },
          },
          exit: {
            opacity: 0,
            y: -10,
            transition: {
              duration: 0.24,
              ease: [0.4, 0, 1, 1],
            },
          },
        }}
      >
        {children}
      </motion.div>

      {/* Entering Route: Burgundy & Antique Gold Curtain lifts gracefully away */}
      <motion.div
        aria-hidden="true"
        variants={{
          initial: { scaleY: 1 },
          animate: {
            scaleY: 0,
            transition: {
              duration: 0.54,
              ease: CURTAIN_EASE,
            },
          },
          exit: { scaleY: 0 },
        }}
        style={{ originY: 0 }}
        className="fixed inset-0 z-[45] pointer-events-none bg-[#3E1820] will-change-transform"
      >
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C5A46D]" />
      </motion.div>

      {/* Exiting Route: Burgundy & Antique Gold Curtain sweeps smoothly in */}
      <motion.div
        aria-hidden="true"
        variants={{
          initial: { scaleY: 0 },
          animate: { scaleY: 0 },
          exit: {
            scaleY: 1,
            transition: {
              duration: 0.28,
              ease: CURTAIN_EASE,
            },
          },
        }}
        style={{ originY: 1 }}
        className="fixed inset-0 z-[45] pointer-events-none bg-[#3E1820] will-change-transform"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-[#C5A46D]" />
      </motion.div>
    </motion.div>
  );
}
