import { useState, type ReactNode, type MouseEvent } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * Interactive 3D floating photography card that responds smoothly to pointer position
 * using compositor-only transform transitions.
 */
export function TiltCard3D({ children, className = '', maxTilt = 6 }: TiltCard3DProps) {
  const prefersReduced = useReducedMotion();
  const [transform, setTransform] = useState('perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;
    setTransform(
      `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015,1.015,1.015)`
    );
  };

  const handleLeave = () => {
    setTransform('perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: prefersReduced ? undefined : transform,
        transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
