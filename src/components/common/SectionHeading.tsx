interface SectionHeadingProps {
  kicker?: string;
  devanagari?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
}

export function SectionHeading({
  kicker,
  devanagari,
  title,
  description,
  align = 'left',
  tone = 'dark',
}: SectionHeadingProps) {
  const isLight = tone === 'light';
  const alignClasses = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignClasses} max-w-3xl`}>
      {(kicker || devanagari) && (
        <div
          className={`flex items-center gap-2.5 text-xs md:text-sm tracking-[0.14em] font-medium mb-3 ${
            isLight ? 'text-[#C5A46D]' : 'text-[#57252F]'
          }`}
        >
          {devanagari && (
            <>
              <span style={{ fontFamily: 'var(--font-devanagari)' }} className="tracking-normal text-sm">
                {devanagari}
              </span>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
            </>
          )}
          {kicker && <span>{kicker}</span>}
        </div>
      )}
      <h2
        className={`section-headline font-editorial font-medium ${
          isLight ? 'text-[#F7F2E9]' : 'text-[#171615]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-sm md:text-base leading-relaxed prose-measure ${
            isLight ? 'text-[#E8DCCB]/85' : 'text-[#5C554E]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
