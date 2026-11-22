import { Helmet } from '@dr.pogodin/react-helmet';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export interface SeoHelmetProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: 'website' | 'article' | 'video.other';
  noIndex?: boolean;
  schemaType?: 'LocalBusiness' | 'ProfessionalService' | 'CollectionPage' | 'ImageGallery' | 'CreativeWork';
  breadcrumbs?: BreadcrumbEntry[];
  locationServed?: string;
  mediaType?: 'image' | 'video';
}

const DEFAULT_MP_LOCATIONS = [
  'Indore',
  'Bhopal',
  'Ujjain',
  'Dewas',
  'Ratlam',
  'Gwalior',
  'Jabalpur',
  'Maheshwar',
  'Madhya Pradesh',
];

function resolveAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : STUDIO_CONFIG.websiteUrl;
  const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${normalized}`;
}

export function SeoHelmet({
  title,
  description,
  keywords = [],
  ogImage = STUDIO_IMAGES.heroWedding,
  ogImageAlt,
  ogType = 'website',
  noIndex = false,
  schemaType = 'ProfessionalService',
  breadcrumbs,
  locationServed,
  mediaType,
}: SeoHelmetProps) {
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : STUDIO_CONFIG.websiteUrl;
  const pathname =
    typeof window !== 'undefined' && window.location?.pathname ? window.location.pathname : '/';
  const canonicalUrl = `${origin}${pathname}`;
  const absoluteImage = resolveAbsoluteUrl(ogImage);
  const imageAlt = ogImageAlt || title;

  const combinedKeywords = Array.from(
    new Set([
      ...keywords,
      STUDIO_CONFIG.name,
      'Indian wedding photography',
      'Indore photographer',
      'Bhopal wedding photography',
      'Ujjain wedding photographer',
      'Madhya Pradesh cinematography',
    ])
  ).join(', ');

  const primaryEntity: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: schemaType === 'LocalBusiness' || schemaType === 'ProfessionalService' ? STUDIO_CONFIG.name : title,
    description,
    url: canonicalUrl,
    image: absoluteImage,
    areaServed: locationServed
      ? Array.from(new Set([locationServed, ...DEFAULT_MP_LOCATIONS]))
      : DEFAULT_MP_LOCATIONS,
  };

  if (schemaType === 'LocalBusiness' || schemaType === 'ProfessionalService') {
    primaryEntity.telephone = STUDIO_CONFIG.phoneHref;
    primaryEntity.email = STUDIO_CONFIG.email;
    primaryEntity.address = {
      '@type': 'PostalAddress',
      streetAddress: `${STUDIO_CONFIG.addressLine1}, ${STUDIO_CONFIG.addressLine2}`,
      addressLocality: STUDIO_CONFIG.city,
      addressRegion: STUDIO_CONFIG.state,
      addressCountry: 'IN',
    };
    primaryEntity.sameAs = [
      STUDIO_CONFIG.social.instagram,
      STUDIO_CONFIG.social.facebook,
      STUDIO_CONFIG.social.youtube,
      STUDIO_CONFIG.social.pinterest,
    ];
  } else if (schemaType === 'CreativeWork') {
    primaryEntity['@type'] = mediaType === 'video' ? 'VideoObject' : 'Photograph';
    primaryEntity.thumbnailUrl = absoluteImage;
    primaryEntity.creator = {
      '@type': 'Organization',
      name: STUDIO_CONFIG.name,
    };
    if (locationServed) {
      primaryEntity.contentLocation = {
        '@type': 'Place',
        name: locationServed,
      };
    }
  } else {
    primaryEntity.provider = {
      '@type': 'LocalBusiness',
      name: STUDIO_CONFIG.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: STUDIO_CONFIG.city,
        addressRegion: STUDIO_CONFIG.state,
        addressCountry: 'IN',
      },
    };
  }

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: resolveAbsoluteUrl(crumb.path),
          })),
        }
      : null;

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en-IN" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={combinedKeywords} />
      <meta name="robots" content={noIndex ? 'noindex, follow' : 'index, follow'} />
      <meta name="geo.region" content="IN-MP" />
      <meta name="geo.placename" content={locationServed || STUDIO_CONFIG.locationLabel} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content={STUDIO_CONFIG.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={imageAlt} />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">{JSON.stringify(primaryEntity)}</script>
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Helmet>
  );
}
