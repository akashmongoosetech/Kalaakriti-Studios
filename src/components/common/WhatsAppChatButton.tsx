import { useLocation } from 'react-router-dom';
import { STUDIO_CONFIG, buildWhatsAppUrl } from '../../data/studio';
import { getCategoryBySlug } from '../../data/categories';
import { getGalleryItemBySlug } from '../../data/gallery';

function getContextualInquiryMessage(pathname: string): { label: string; message: string } {
  if (pathname.startsWith('/categories/')) {
    const slug = pathname.replace('/categories/', '').split('/')[0];
    const category = getCategoryBySlug(slug);
    if (category) {
      return {
        label: `Inquire about ${category.name}`,
        message: `Namaste ${STUDIO_CONFIG.name}, I am interested in ${category.name} and would love to know your packages and date availability.`,
      };
    }
  }

  if (pathname.startsWith('/gallery/')) {
    const slug = pathname.replace('/gallery/', '').split('/')[0];
    const item = getGalleryItemBySlug(slug);
    if (item) {
      return {
        label: `Inquire about similar ${item.category} coverage`,
        message: `Namaste ${STUDIO_CONFIG.name}, I loved "${item.title}" (${item.category}) in your portfolio and would like to inquire about similar photography & cinematography coverage.`,
      };
    }
  }

  if (pathname === '/services') {
    return {
      label: 'Ask about photography & cinema packages',
      message: `Namaste ${STUDIO_CONFIG.name}, I was browsing your photography and cinematography services and would like to request a customized quote for my upcoming celebration.`,
    };
  }

  if (pathname === '/booking') {
    return {
      label: 'Quick WhatsApp booking assistance',
      message: `Namaste ${STUDIO_CONFIG.name}, I would like to check date availability and discuss booking details for my upcoming event.`,
    };
  }

  return {
    label: 'Chat with our studio on WhatsApp',
    message: `Namaste ${STUDIO_CONFIG.name}, I would like to inquire about photography & cinematography availability and packages for my upcoming celebration.`,
  };
}

/**
 * Floating WhatsApp Chat Button mounted globally across every route.
 * Opens a pre-filled inquiry message directly to the configured studio business phone number.
 */
export function WhatsAppChatButton() {
  const { pathname } = useLocation();
  const { label, message } = getContextualInquiryMessage(pathname);
  const href = buildWhatsAppUrl(message);

  return (
    <div className="group relative flex items-center justify-end">
      {/* Subtle hover/focus context tooltip on desktop */}
      <div
        role="tooltip"
        className="pointer-events-none hidden lg:block absolute right-full mr-3 w-64 rounded-lg bg-[#171615] px-3.5 py-2.5 text-left text-xs text-[#F7F2E9] border border-[#C5A46D]/35 shadow-xl opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200"
      >
        <div className="font-medium text-[#C5A46D]">{label}</div>
        <div className="mt-0.5 text-[11px] text-[#E8DCCB]/80 truncate">
          {STUDIO_CONFIG.phoneDisplay}
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (${STUDIO_CONFIG.phoneDisplay}) — opens WhatsApp in a new tab`}
        className="inline-flex items-center justify-center gap-2.5 min-h-[48px] min-w-[48px] sm:min-h-[46px] rounded-full bg-[#1C6B43] px-3 sm:px-5 py-2.5 text-sm font-medium text-[#FFFFFF] border border-[#C5A46D]/55 shadow-[0_10px_28px_rgba(23,22,21,0.32)] hover:bg-[#165836] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap shrink-0"
      >
        {/* Official-style crisp WhatsApp phone-in-bubble mark */}
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.95L0 24l6.33-1.66a11.86 11.86 0 0 0 5.73 1.46h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.42ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.76.99 1-3.66-.24-.38a9.84 9.84 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.89 7c0 5.46-4.44 9.89-9.87 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
        <span className="hidden sm:inline">WhatsApp Chat</span>
      </a>
    </div>
  );
}
