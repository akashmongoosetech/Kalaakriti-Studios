import { useState, type ImgHTMLAttributes } from 'react';
import { Camera } from 'lucide-react';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  loading = 'lazy',
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#242220] via-[#3E1820] to-[#171615] text-[#F7F2E9] p-6 text-center ${className}`}
      >
        <Camera className="w-7 h-7 text-[#C5A46D] mb-2.5 opacity-80" aria-hidden="true" />
        <span className="font-editorial text-lg tracking-wide text-[#F7F2E9]/90">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
