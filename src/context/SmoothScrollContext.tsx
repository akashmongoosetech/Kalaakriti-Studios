import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export interface SmoothScrollOptions {
  immediate?: boolean;
  offset?: number;
  duration?: number;
}

export interface SmoothScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: number | string | HTMLElement, options?: SmoothScrollOptions) => void;
  lockScroll: () => void;
  unlockScroll: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: (target, options) => {
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
    }
  },
  lockScroll: () => {
    document.body.style.overflow = 'hidden';
  },
  unlockScroll: () => {
    document.body.style.overflow = '';
  },
});

const LUXURY_SCROLL_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const lockCountRef = useRef(0);

  useEffect(() => {
    if (prefersReduced) {
      lenisRef.current = null;
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      duration: 1.25,
      easing: LUXURY_SCROLL_EASING,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.35,
      anchors: true,
    });

    lenisRef.current = instance;
    setLenis(instance);

    if (lockCountRef.current > 0) {
      instance.stop();
    }

    // Keep GSAP ScrollTrigger frame-locked to Lenis virtual scroll
    instance.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      instance.off('scroll', ScrollTrigger.update);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [prefersReduced]);

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options: SmoothScrollOptions = {}) => {
      const instance = lenisRef.current;
      const { immediate = false, offset = 0, duration = 1.25 } = options;

      if (instance) {
        instance.scrollTo(target, {
          immediate: immediate || prefersReduced,
          offset,
          duration: immediate || prefersReduced ? 0 : duration,
          easing: LUXURY_SCROLL_EASING,
        });
        return;
      }

      // Native fallback when prefers-reduced-motion is active or before hydration
      const behavior: ScrollBehavior = immediate || prefersReduced ? 'auto' : 'smooth';
      if (typeof target === 'number') {
        window.scrollTo({ top: Math.max(0, target + offset), behavior });
      } else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        if (el instanceof HTMLElement) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top: Math.max(0, top), behavior });
        }
      }
    },
    [prefersReduced]
  );

  const lockScroll = useCallback(() => {
    lockCountRef.current += 1;
    if (lockCountRef.current === 1) {
      document.body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    }
  }, []);

  const unlockScroll = useCallback(() => {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);
    if (lockCountRef.current === 0) {
      document.body.style.overflow = '';
      lenisRef.current?.start();
    }
  }, []);

  const value = useMemo(
    () => ({ lenis, scrollTo, lockScroll, unlockScroll }),
    [lenis, scrollTo, lockScroll, unlockScroll]
  );

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}
