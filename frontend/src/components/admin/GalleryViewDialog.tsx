import { format, parseISO } from 'date-fns';
import {
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { AdminModal } from './AdminModal';
import { GalleryMediaPreview } from '../gallery/GalleryMediaPreview';
import { getVideoProviderLabel } from '../../utils/mediaUrl';
import type { GalleryItem, GalleryStatus } from '../../types';

interface GalleryViewDialogProps {
  item: GalleryItem | null;
  open: boolean;
  onClose: () => void;
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
  onToggleStatus: (item: GalleryItem, nextStatus: GalleryStatus) => void;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  try {
    const parsed = parseISO(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return format(parsed, 'dd MMM yyyy, hh:mm a');
  } catch {
    return iso;
  }
}

export function GalleryViewDialog({
  item,
  open,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}: GalleryViewDialogProps) {
  if (!item) return null;

  const mediaType = item.mediaType || item.type || 'image';
  const mediaUrl =
    item.mediaUrl || (mediaType === 'video' ? item.videoUrl || item.src : item.src) || '';
  const status: GalleryStatus = item.status || 'active';
  const nextStatus: GalleryStatus = status === 'active' ? 'inactive' : 'active';
  const isExternalHttpUrl = /^https?:\/\//i.test(mediaUrl);

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={item.title}
      description={`${mediaType === 'video' ? 'Video' : 'Image'} · ${item.category || 'General'} · Order #${item.displayOrder ?? 0}`}
      size="lg"
      footer={
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleStatus(item, nextStatus)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3.5 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors cursor-pointer"
          >
            {status === 'active' ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-[#5C554E]" aria-hidden="true" />
                <span>Set Inactive</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
                <span>Set Active</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(item);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-2 text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-4 py-2 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
              <span>Edit Item</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Live Media Stage */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#121110] border border-[#171615]/12">
          <GalleryMediaPreview
            mediaType={mediaType}
            mediaUrl={mediaUrl}
            embedUrl={item.embedUrl}
            thumbnail={item.thumbnail}
            videoProvider={item.videoProvider}
            title={item.title}
            mode={item.videoProvider === 'reel' ? 'thumbnail' : 'player'}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs border-y border-[#171615]/10 py-4">
          <div>
            <div className="text-[#5C554E] mb-0.5">Media Type</div>
            <div className="font-semibold text-[#171615] inline-flex items-center gap-1.5">
              {mediaType === 'video' ? (
                <>
                  <Film className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
                  <span>{getVideoProviderLabel(item.videoProvider)}</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
                  <span>Image</span>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="text-[#5C554E] mb-0.5">Public Status</div>
            <div
              className={`font-semibold ${
                status === 'active' ? 'text-[#15803D]' : 'text-[#5C554E]'
              }`}
            >
              {status === 'active' ? 'Active · Visible on Website' : 'Inactive · Hidden'}
            </div>
          </div>

          <div>
            <div className="text-[#5C554E] mb-0.5">Category &amp; Order</div>
            <div className="font-semibold text-[#171615] tabular-nums">
              {item.category || 'General'} · Order {item.displayOrder ?? 0}
            </div>
          </div>

          <div>
            <div className="text-[#5C554E] mb-0.5">Created Date</div>
            <div className="font-medium text-[#171615] tabular-nums">
              {formatDate(item.createdAt)}
            </div>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#171615]">Description</div>
            <p className="text-sm text-[#5C554E] leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>
        )}

        {/* Source URL */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-[#171615]">Stored Media URL</div>
          <div className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F2E9] border border-[#171615]/10 px-3.5 py-2 text-xs">
            <span className="truncate font-mono text-[11px] text-[#171615]">{mediaUrl}</span>
            {isExternalHttpUrl && (
              <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#57252F] hover:underline shrink-0"
              >
                <span>Open</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
