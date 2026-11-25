import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, Film, MapPin, Play } from 'lucide-react';
import { STUDIO_CONFIG } from '../../data/studio';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { SafeImage } from '../../components/common/SafeImage';
import { GalleryCard } from '../../components/gallery/GalleryCard';
import { GalleryLightbox } from '../../components/gallery/GalleryLightbox';
import { GalleryMediaPreview } from '../../components/gallery/GalleryMediaPreview';
import NotFoundPage from '../NotFound/NotFoundPage';
import { publicApi } from '../../services/api/public.api';
import { GalleryItem } from '../../types';

export default function GalleryDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<GalleryItem | null>(null);
  const [relatedFromApi, setRelatedFromApi] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(Boolean(slug));

  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setProject(null);
    publicApi
      .getGalleryBySlug(slug, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        if (res?.item) {
          setProject(res.item);
          setRelatedFromApi(res.related || []);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setProject(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-[#F7F2E9] text-[#57252F]">
        <div className="text-center space-y-3">
          <div className="mx-auto h-9 w-9 rounded-full border-2 border-[#C5A46D] border-t-[#57252F] animate-spin" />
          <p className="font-editorial text-lg text-[#5C554E]">Loading Gallery Story...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return <NotFoundPage />;
  }

  const mediaType = project.mediaType || project.type || 'image';
  const mediaUrl =
    project.mediaUrl || (mediaType === 'video' ? project.videoUrl || project.src : project.src) || '';
  const hasInlineVideoPlayer =
    mediaType === 'video' &&
    Boolean(
      project.embedUrl ||
        project.videoUrl ||
        (project.videoProvider && project.videoProvider !== 'reel')
    );

  const relatedProjects = relatedFromApi
    .filter((item) => item.id !== project.id && item.slug !== project.slug)
    .slice(0, 3);

  const storyFrames: GalleryItem[] = [project, ...relatedFromApi].slice(0, 5);

  const openViewer = (list: GalleryItem[], index: number) => {
    setLightboxItems(list);
    setLightboxIndex(index);
  };

  return (
    <div>
      <SeoHelmet
        title={`${project.title} — ${project.category || 'Gallery'} | ${STUDIO_CONFIG.name}`}
        description={project.description || `${project.title} in the ${STUDIO_CONFIG.name} portfolio.`}
        keywords={[
          project.title,
          project.category || 'Wedding',
          mediaType === 'video' ? 'Indian wedding cinematography film' : 'editorial Indian wedding photography',
        ]}
        ogImage={project.thumbnail || project.src}
        ogImageAlt={project.title}
        ogType={mediaType === 'video' ? 'video.other' : 'article'}
        schemaType="CreativeWork"
        mediaType={mediaType}
        locationServed={project.location || STUDIO_CONFIG.locationLabel}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Gallery', path: '/gallery' },
          { name: project.title, path: `/gallery/${project.slug}` },
        ]}
      />

      {/* Editorial Story Hero */}
      <section className="relative min-h-[58vh] flex items-end pb-14 pt-32 bg-[#171615] text-[#F7F2E9] overflow-hidden">
        <GalleryMediaPreview
          mediaType={mediaType}
          mediaUrl={mediaUrl}
          embedUrl={project.embedUrl}
          thumbnail={project.thumbnail}
          videoProvider={project.videoProvider}
          title={project.title}
          mode="thumbnail"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/55 to-[#171615]/40" />

        <div className="studio-container relative z-10">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#C5A46D] hover:text-[#F7F2E9] mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Portfolio Gallery</span>
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#C5A46D] mb-3">
              <span>{project.category || 'General'}</span>
              <span aria-hidden="true" className="opacity-45">
                ·
              </span>
              <span>
                {mediaType === 'video'
                  ? `Cinema Film${project.duration ? ` (${project.duration})` : ''}`
                  : 'Editorial Photograph'}
              </span>
              {project.year && (
                <>
                  <span aria-hidden="true" className="opacity-45">
                    ·
                  </span>
                  <span>{project.year}</span>
                </>
              )}
            </div>
            <h1 className="hero-headline font-editorial font-medium">{project.title}</h1>
            {project.description && (
              <p className="mt-5 text-base sm:text-lg text-[#E8DCCB]/90 leading-relaxed max-w-2xl">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Project Monograph Metadata + Primary Media Player */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Event Info Column */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 p-7 space-y-5">
              <h2 className="font-editorial text-2xl font-medium text-[#171615] pb-3 border-b border-[#171615]/10">
                Gallery Details
              </h2>
              <dl className="space-y-4 text-sm">
                {project.coupleOrClient && (
                  <div>
                    <dt className="text-xs text-[#5C554E]">Featured Subject</dt>
                    <dd className="font-medium text-[#171615] mt-0.5">{project.coupleOrClient}</dd>
                  </div>
                )}
                {project.location && (
                  <div>
                    <dt className="text-xs text-[#5C554E]">Location</dt>
                    <dd className="font-medium text-[#171615] mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
                      <span>{project.location}</span>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-[#5C554E]">Category</dt>
                  <dd className="font-medium text-[#171615] mt-0.5">
                    {project.category || 'General'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#5C554E]">Media Format</dt>
                  <dd className="font-medium text-[#171615] mt-0.5 flex items-center gap-1.5">
                    {mediaType === 'video' ? (
                      <>
                        <Film className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
                        <span>Video Film</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
                        <span>High-Resolution Photograph</span>
                      </>
                    )}
                  </dd>
                </div>
                {project.cameraSpec && (
                  <div>
                    <dt className="text-xs text-[#5C554E]">Capture Specification</dt>
                    <dd className="font-medium text-[#171615] mt-0.5 tabular-nums">
                      {project.cameraSpec}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {project.storyHighlights && project.storyHighlights.length > 0 && (
              <div className="rounded-xl bg-[#E8DCCB]/55 border border-[#171615]/10 p-7 space-y-4">
                <h3 className="font-editorial text-2xl font-medium text-[#171615]">
                  Behind This Story
                </h3>
                <ul className="space-y-3 text-sm text-[#5C554E] leading-relaxed">
                  {project.storyHighlights.map((note, i) => (
                    <li key={note} className="flex items-start gap-2.5">
                      <span className="text-xs font-semibold text-[#57252F] mt-0.5 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              to={`/booking?category=${project.categorySlug || 'wedding'}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#57252F] px-6 py-3.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors"
            >
              <span>Inquire About Similar Coverage</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            </Link>
          </aside>

          {/* Right Media Showcase */}
          <div className="lg:col-span-8 space-y-6">
            {hasInlineVideoPlayer ? (
              <div className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-black border border-[#171615]/12 shadow-lg">
                  <GalleryMediaPreview
                    mediaType="video"
                    mediaUrl={mediaUrl}
                    embedUrl={project.embedUrl}
                    thumbnail={project.thumbnail}
                    videoProvider={project.videoProvider}
                    title={project.title}
                    mode="player"
                    className="h-full w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => openViewer(storyFrames, 0)}
                    className="text-xs font-medium text-[#57252F] hover:underline cursor-pointer"
                  >
                    Open in Fullscreen Lightbox
                  </button>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => openViewer(storyFrames, 0)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openViewer(storyFrames, 0);
                  }
                }}
                aria-label={`Open fullscreen viewer for ${project.title}`}
                className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-[#171615] cursor-pointer border border-[#171615]/10"
              >
                <SafeImage
                  src={mediaUrl}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/70 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2.5 rounded-full bg-[#57252F]/90 border border-[#C5A46D] px-6 py-3 text-sm font-medium text-[#F7F2E9] shadow-xl group-hover:scale-105 transition-transform">
                    {mediaType === 'video' ? (
                      <>
                        <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                        <span>Play Cinema Reel in Fullscreen</span>
                      </>
                    ) : (
                      <span>Inspect in Fullscreen Viewer</span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {storyFrames.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {storyFrames.slice(1).map((frame, idx) => (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => openViewer(storyFrames, idx + 1)}
                    className="group text-left overflow-hidden rounded-xl bg-[#171615] border border-[#171615]/10 cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <GalleryMediaPreview
                        mediaType={frame.mediaType || frame.type || 'image'}
                        mediaUrl={frame.mediaUrl || frame.videoUrl || frame.src}
                        embedUrl={frame.embedUrl}
                        thumbnail={frame.thumbnail}
                        videoProvider={frame.videoProvider}
                        title={frame.title}
                        mode="thumbnail"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {(frame.mediaType || frame.type) === 'video' && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded bg-[#57252F]/90 px-2.5 py-1 text-[11px] text-[#F7F2E9]">
                          <Play className="w-3 h-3 fill-current" aria-hidden="true" />
                          <span>Video</span>
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-[#FFFFFF]">
                      <div className="text-xs text-[#57252F]">{frame.category || 'General'}</div>
                      <div className="font-editorial text-lg font-medium text-[#171615] mt-0.5">
                        {frame.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Stories */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-[#E8DCCB]/40 border-t border-[#171615]/10">
          <div className="studio-container">
            <div className="flex items-center justify-between gap-4 mb-10">
              <h2 className="font-editorial text-3xl font-medium text-[#171615]">
                More Curated Stories
              </h2>
              <Link to="/gallery" className="text-sm font-semibold text-[#57252F] hover:underline">
                Explore All Works
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rel, idx) => (
                <GalleryCard
                  key={rel.id}
                  item={rel}
                  onOpenLightbox={() => openViewer(relatedProjects, idx)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <GalleryLightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIdx) => setLightboxIndex(nextIdx)}
      />
    </div>
  );
}
