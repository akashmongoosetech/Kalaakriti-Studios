import { useState, useRef, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface BeforeAfterSliderProps {
  imageSrc: string;
  alt: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
}

/**
 * Interactive Before / After colour-grading comparison showcasing
 * straight-out-of-camera RAW flat tones versus Kalaakriti signature editorial grade.
 */
export function BeforeAfterSlider({
  imageSrc,
  alt,
  beforeLabel = 'Camera RAW (Ungraded)',
  afterLabel = 'Signature Editorial Grade',
  caption,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(52);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(4, Math.min(96, pct)));
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        onPointerDown={(e) => {
          draggingRef.current = true;
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          updateFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-xl select-none cursor-ew-resize bg-[#171615] border border-[#C5A46D]/25"
        role="group"
        aria-label="Before and after editorial colour grading comparison"
      >
        {/* After: Final Signature Editorial Grade (base layer) */}
        <SafeImage
          src={imageSrc}
          alt={`${alt} — ${afterLabel}`}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />

        {/* Before: Flat RAW camera profile (clipped layer) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <SafeImage
            src={imageSrc}
            alt={`${alt} — ${beforeLabel}`}
            className="h-full w-full object-cover"
            style={{
              filter: 'saturate(0.42) contrast(0.84) brightness(0.95) sepia(0.06)',
            }}
          />
        </div>

        {/* Hairline Gold Divider */}
        <div
          className="absolute inset-y-0 w-px bg-[#C5A46D] shadow-[0_0_12px_rgba(0,0,0,0.65)] pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-[#171615]/90 border border-[#C5A46D] text-[#F7F2E9] shadow-lg">
            <MoveHorizontal className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* Quiet Corner Labels */}
        <div className="absolute bottom-4 left-4 bg-[#171615]/80 px-3 py-1.5 text-xs tracking-wide text-[#E8DCCB] pointer-events-none">
          {beforeLabel}
        </div>
        <div className="absolute bottom-4 right-4 bg-[#57252F]/90 px-3 py-1.5 text-xs tracking-wide text-[#F7F2E9] pointer-events-none">
          {afterLabel}
        </div>
      </div>

      {/* Accessible Keyboard Slider Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5C554E]">
        <span>{caption || 'Drag across the frame or use the range control to inspect colour grading.'}</span>
        <label className="inline-flex items-center gap-3 shrink-0">
          <span className="whitespace-nowrap">Comparison</span>
          <input
            type="range"
            min={4}
            max={96}
            value={Math.round(position)}
            onChange={(e) => setPosition(Number(e.target.value))}
            aria-label="Adjust before and after comparison slider"
            className="w-32 accent-[#57252F] cursor-pointer"
          />
          <span className="tabular-nums w-8 text-right">{Math.round(position)}%</span>
        </label>
      </div>
    </div>
  );
}
