import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

const ZOOM_STEPS = [1, 1.75, 2.5];

/**
 * Full-Screen Image & Cinema Lightbox Viewer.
 * Features high-resolution photo inspection with zoom & pan, keyboard navigation
 * (Escape, ArrowLeft, ArrowRight, +, -, 0), touch swipe navigation, interactive
 * thumbnail filmstrip, backdrop click-to-close, native fullscreen toggle, and a
 * prominent 'X' close button.
 */
export function GalleryLightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const prefersReduced = useReducedMotion();
  const { lockScroll, unlockScroll } = useSmoothScroll();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [reelProgress, setReelProgress] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const item = currentIndex !== null ? items[currentIndex] : null;
  const total = items.length;
  const zoomScale = ZOOM_STEPS[zoomIndex];

  const resetZoom = useCallback(() => {
    setZoomIndex(0);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentIndex === null || total <= 1) return;
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null || total <= 1) return;
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);

  const handleZoomIn = useCallback(() => {
    setZoomIndex((idx) => Math.min(ZOOM_STEPS.length - 1, idx + 1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomIndex((idx) => {
      const next = Math.max(0, idx - 1);
      if (next === 0) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const toggleImageZoom = useCallback(() => {
    setZoomIndex((idx) => {
      const next = idx === 0 ? 1 : 0;
      if (next === 0) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Reset per-item playback & zoom state on slide change
  useEffect(() => {
    if (currentIndex === null) return;
    setIsPlaying(true);
    setReelProgress(0);
    resetZoom();
  }, [currentIndex, resetZoom]);

  // Focus close button on initial open for keyboard accessibility
  useEffect(() => {
    if (currentIndex !== null) {
      closeButtonRef.current?.focus();
    }
  }, [currentIndex !== null]);

  // Lock Lenis + body scroll cleanly while lightbox is open
  const isOpen = currentIndex !== null;
  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isOpen, lockScroll, unlockScroll]);

  // Keyboard navigation
  useEffect(() => {
    if (currentIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' && item?.type === 'video' && !item.videoUrl) {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if ((e.key === '+' || e.key === '=') && item?.type === 'image') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' && item?.type === 'image') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0' && item?.type === 'image') {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [currentIndex, item, onClose, handleNext, handlePrev, handleZoomIn, handleZoomOut, resetZoom]);

  // Interactive Cinema Reel timeline advancement for bundled showcase films
  useEffect(() => {
    if (!item || item.type !== 'video' || item.videoUrl || !isPlaying) return;
    const id = window.setInterval(() => {
      setReelProgress((prev) => (prev >= 100 ? 0 : prev + 0.65));
    }, 100);
    return () => window.clearInterval(id);
  }, [item, isPlaying]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be restricted inside nested iframes; ignore cleanly
    }
  };

  // Touch swipe navigation on mobile/tablet when not zoomed
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale > 1 || e.touches.length !== 1) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || zoomScale > 1 || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
  };

  // Pointer drag-to-pan when zoomed in on a photograph
  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomScale <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const maxPan = 260 * (zoomScale - 1);
    setPan({
      x: Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panX + dx)),
      y: Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panY + dy)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const frames =
    item && item.reelFrames && item.reelFrames.length > 0
      ? item.reelFrames
      : item
        ? [item.src]
        : [];
  const activeFrameIndex =
    frames.length > 0
      ? Math.min(frames.length - 1, Math.floor((reelProgress / 100) * frames.length))
      : 0;

  return (
    <AnimatePresence>
      {currentIndex !== null && item && (
        <motion.div
          key="gallery-lightbox-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${item.title}`}
          data-lenis-prevent
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-[#121110]/97 backdrop-blur-sm text-[#F7F2E9]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 border-b border-[#C5A46D]/20 bg-[#171615]/90">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#E8DCCB] min-w-0">
              <span className="tabular-nums font-medium text-[#C5A46D] shrink-0">
                {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span className="truncate font-editorial text-base sm:text-lg font-medium text-[#F7F2E9]">
                {item.title}
              </span>
              <span aria-hidden="true" className="hidden md:inline opacity-40">
                ·
              </span>
              <span className="hidden md:inline text-[#E8DCCB]/75 whitespace-nowrap">
                {item.category}
                {item.type === 'video' ? ' Film' : ' Photograph'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* High-Resolution Zoom Controls (Photographs) */}
              {item.type === 'image' && (
                <div className="hidden sm:flex items-center gap-1.5 mr-1">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoomIndex === 0}
                    aria-label="Zoom out photograph"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/30 text-[#F7F2E9] hover:bg-[#57252F] disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
                  >
                    <ZoomOut className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span className="min-w-[3rem] text-center text-xs tabular-nums text-[#C5A46D]">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoomIndex === ZOOM_STEPS.length - 1}
                    aria-label="Zoom in photograph"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/30 text-[#F7F2E9] hover:bg-[#57252F] disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
                  >
                    <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  </button>
                  {zoomScale > 1 && (
                    <button
                      type="button"
                      onClick={resetZoom}
                      aria-label="Reset image zoom"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/30 text-[#E8DCCB] hover:bg-[#57252F] hover:text-[#F7F2E9] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}

              <Link
                to={`/gallery/${item.slug}`}
                onClick={onClose}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E8DCCB] hover:text-[#C5A46D] transition-colors whitespace-nowrap"
              >
                <span>Full Story</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit browser fullscreen' : 'Enter browser fullscreen'}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/30 text-[#F7F2E9] hover:bg-[#57252F] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                )}
              </button>

              {/* High-Contrast 'X' Close Button */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close lightbox viewer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#57252F] border border-[#C5A46D]/65 text-[#F7F2E9] hover:bg-[#6F323E] hover:border-[#C5A46D] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Main Media Stage (click dark backdrop to close; swipe left/right on touch) */}
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0 overflow-hidden"
          >
            {total > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous gallery item"
                className="absolute left-3 sm:left-6 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#171615]/85 border border-[#C5A46D]/45 text-[#F7F2E9] hover:bg-[#57252F] hover:border-[#C5A46D] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            <motion.div
              key={item.id}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl max-h-full flex items-center justify-center"
            >
              {item.type === 'video' ? (
                item.videoUrl ? (
                  <video
                    key={item.id}
                    src={item.videoUrl}
                    poster={item.thumbnail}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[65vh] w-full rounded-xl bg-black border border-[#C5A46D]/25 object-contain"
                  />
                ) : (
                  /* Interactive Cinema Reel Player for bundled showcase films */
                  <div className="relative w-full aspect-video max-h-[65vh] overflow-hidden rounded-xl bg-black border border-[#C5A46D]/35 shadow-2xl">
                    {frames.map((frameSrc, idx) => (
                      <SafeImage
                        key={`${item.id}-${idx}`}
                        src={frameSrc}
                        alt={`${item.title} cinema frame ${idx + 1}`}
                        loading="eager"
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out ${
                          idx === activeFrameIndex
                            ? 'opacity-100 scale-105'
                            : 'opacity-0 scale-100 pointer-events-none'
                        }`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

                    <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-xs text-[#E8DCCB]">
                      <span>
                        Cinema Highlight Preview · Chapter {activeFrameIndex + 1} of {frames.length}
                      </span>
                      <span className="tabular-nums text-[#C5A46D]">
                        {item.duration || '02:30'}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying((p) => !p)}
                          aria-label={isPlaying ? 'Pause cinema reel' : 'Play cinema reel'}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#57252F] text-[#F7F2E9] hover:bg-[#6F323E] transition-colors cursor-pointer shrink-0"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                          )}
                        </button>

                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={Math.round(reelProgress)}
                          onChange={(e) => setReelProgress(Number(e.target.value))}
                          aria-label="Seek cinema highlight timeline"
                          className="flex-1 accent-[#C5A46D] cursor-pointer"
                        />

                        <button
                          type="button"
                          onClick={() => setIsMuted((m) => !m)}
                          aria-label={
                            isMuted
                              ? 'Unmute preview audio indicator'
                              : 'Mute preview audio indicator'
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A46D]/35 text-[#E8DCCB] hover:text-[#F7F2E9] cursor-pointer shrink-0"
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Volume2 className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div
                  onDoubleClick={toggleImageZoom}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`relative flex items-center justify-center max-h-[65vh] max-w-full overflow-hidden rounded-xl border border-[#C5A46D]/25 bg-[#0C0B0A] shadow-2xl select-none ${
                    zoomScale > 1
                      ? isDragging
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                      : 'cursor-zoom-in'
                  }`}
                >
                  <div
                    onClick={() => {
                      if (zoomScale === 1) toggleImageZoom();
                    }}
                    style={{
                      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`,
                    }}
                    className="transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                  >
                    <SafeImage
                      src={item.src}
                      alt={item.title}
                      loading="eager"
                      className="max-h-[65vh] max-w-full w-auto object-contain pointer-events-none"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {total > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next gallery item"
                className="absolute right-3 sm:right-6 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#171615]/85 border border-[#C5A46D]/45 text-[#F7F2E9] hover:bg-[#57252F] hover:border-[#C5A46D] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Interactive Thumbnail Filmstrip + Editorial Caption Footer */}
          <div className="px-4 sm:px-8 py-3.5 border-t border-[#C5A46D]/20 bg-[#171615] space-y-3">
            {total > 1 && (
              <div
                aria-label="Gallery filmstrip navigation"
                className="studio-container flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1"
              >
                {items.map((entry, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={`${entry.id}-${idx}`}
                      type="button"
                      onClick={() => onNavigate(idx)}
                      aria-label={`View ${entry.title} (${idx + 1} of ${total})`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative h-12 w-16 sm:h-13 sm:w-20 rounded-md overflow-hidden shrink-0 border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D] ${
                        isActive
                          ? 'border-[#C5A46D] ring-1 ring-[#C5A46D] opacity-100 scale-105'
                          : 'border-[#F7F2E9]/15 opacity-55 hover:opacity-90'
                      }`}
                    >
                      <SafeImage
                        src={entry.thumbnail}
                        alt={entry.title}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="studio-container flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <p className="text-xs sm:text-sm text-[#E8DCCB]/85 max-w-2xl leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#C5A46D] shrink-0">
                <span>{item.coupleOrClient}</span>
                <span aria-hidden="true" className="opacity-40">
                  ·
                </span>
                <span>{item.location}</span>
                {item.cameraSpec && (
                  <>
                    <span aria-hidden="true" className="opacity-40">
                      ·
                    </span>
                    <span className="tabular-nums text-[#E8DCCB]/70">{item.cameraSpec}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
