import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface RevealMaskProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'scale';
}

/**
 * Cinematic scroll-triggered reveal using GSAP ScrollTrigger.
 * Immediately renders content cleanly when prefers-reduced-motion is active.
 */
export function RevealMask({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: RevealMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const fromVars: gsap.TweenVars =
      direction === 'scale'
        ? { opacity: 0.01, scale: 0.96, y: 18 }
        : direction === 'left'
          ? { opacity: 0.01, x: 24 }
          : { opacity: 0.01, y: 26 };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.85,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, direction, prefersReduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
