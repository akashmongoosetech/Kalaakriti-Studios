import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { STUDIO_CONFIG } from '../../data/studio';
import { SeoHelmet } from '../../components/common/SeoHelmet';

export default function NotFoundPage() {
  return (
    <section className="min-h-[82vh] flex items-center justify-center pt-28 pb-20 bg-[#F7F2E9] text-[#171615]">
      <SeoHelmet
        title={`Page Not Found (404) | ${STUDIO_CONFIG.name}`}
        description="The requested page could not be found. Return to the Kalaakriti Studios portfolio or homepage."
        noIndex={true}
      />
      <div className="studio-container max-w-2xl text-center space-y-6">
        <div className="flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#57252F] text-[#C5A46D]">
            <Compass className="w-7 h-7" aria-hidden="true" />
          </span>
        </div>
        <div className="text-xs tracking-[0.2em] text-[#57252F] font-semibold">Error 404</div>
        <h1 className="section-headline font-editorial font-medium">
          This Frame Could Not Be Found.
        </h1>
        <p className="text-base text-[#5C554E] leading-relaxed">
          The page or gallery story you are looking for may have been moved or renamed. Explore our
          collections or return to the studio homepage below.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-6 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-lg border border-[#171615]/20 px-6 py-3 text-sm font-medium text-[#171615] hover:border-[#57252F] hover:text-[#57252F] transition-colors"
          >
            <span>Browse Portfolio</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
