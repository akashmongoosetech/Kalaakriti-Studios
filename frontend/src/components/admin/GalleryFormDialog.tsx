import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  CheckCircle2,
  Film,
  Image as ImageIcon,
  Link2,
  Loader2,
} from 'lucide-react';
import { AdminModal } from './AdminModal';
import { GalleryMediaPreview } from '../gallery/GalleryMediaPreview';
import { parseGalleryMediaUrl } from '../../utils/mediaUrl';
import type { GalleryItem, GalleryMutationInput, GalleryStatus, MediaType } from '../../types';

const SUGGESTED_CATEGORIES = [
  'Wedding',
  'Pre-Wedding',
  'Haldi',
  'Mehendi',
  'Engagement',
  'Maternity',
  'Birthday',
  'Corporate',
  'Portrait',
  'Family',
  'Events',
  'Baby Photography',
  'General',
];

const galleryFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must be at least 2 characters.')
      .max(180, 'Title cannot exceed 180 characters.'),
    description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters.'),
    mediaType: z.enum(['image', 'video']),
    mediaUrl: z
      .string()
      .trim()
      .min(1, 'Media URL is required.')
      .max(1000, 'Media URL cannot exceed 1000 characters.'),
    category: z.string().trim().max(80, 'Category cannot exceed 80 characters.'),
    displayOrder: z
      .number()
      .int('Display order must be a whole number.')
      .min(0, 'Display order cannot be negative.')
      .max(100000, 'Display order cannot exceed 100000.'),
    status: z.enum(['active', 'inactive']),
  })
  .superRefine((data, ctx) => {
    const isSeededAsset = /^\/src\/assets\/images\/[a-zA-Z0-9._/-]+$/.test(data.mediaUrl);
    if (isSeededAsset) return;

    const parsed = parseGalleryMediaUrl(data.mediaType, data.mediaUrl);
    if (!parsed.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mediaUrl'],
        message: parsed.error || 'Please provide a valid media URL.',
      });
    }
  });

type GalleryFormValues = z.infer<typeof galleryFormSchema>;

interface GalleryFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialItem?: GalleryItem | null;
  existingCategories?: string[];
  onClose: () => void;
  onSubmit: (values: GalleryMutationInput) => Promise<void>;
}

export function GalleryFormDialog({
  open,
  mode,
  initialItem,
  existingCategories = [],
  onClose,
  onSubmit,
}: GalleryFormDialogProps) {
  const [previewLoadError, setPreviewLoadError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: '',
      description: '',
      mediaType: 'image',
      mediaUrl: '',
      category: 'Wedding',
      displayOrder: 0,
      status: 'active',
    },
  });

  useEffect(() => {
    if (!open) return;
    setPreviewLoadError(false);

    if (mode === 'edit' && initialItem) {
      const effectiveMediaType: MediaType = initialItem.mediaType || initialItem.type || 'image';
      const effectiveStatus: GalleryStatus = initialItem.status || 'active';
      reset({
        title: initialItem.title || '',
        description: initialItem.description || '',
        mediaType: effectiveMediaType,
        mediaUrl:
          initialItem.mediaUrl ||
          (effectiveMediaType === 'video'
            ? initialItem.videoUrl || initialItem.src
            : initialItem.src) ||
          '',
        category: initialItem.category || 'General',
        displayOrder:
          typeof initialItem.displayOrder === 'number' ? initialItem.displayOrder : 0,
        status: effectiveStatus,
      });
    } else {
      reset({
        title: '',
        description: '',
        mediaType: 'image',
        mediaUrl: '',
        category: 'Wedding',
        displayOrder: 0,
        status: 'active',
      });
    }
  }, [open, mode, initialItem, reset]);

  const watchedMediaType = watch('mediaType');
  const watchedMediaUrl = watch('mediaUrl');
  const watchedTitle = watch('title');
  const watchedStatus = watch('status');

  useEffect(() => {
    setPreviewLoadError(false);
  }, [watchedMediaType, watchedMediaUrl]);

  const parsedPreview = useMemo(
    () =>
      parseGalleryMediaUrl(watchedMediaType, watchedMediaUrl, {
        allowRelativeStudioAsset: mode === 'edit',
      }),
    [watchedMediaType, watchedMediaUrl, mode]
  );

  const categoryOptions = useMemo(() => {
    const merged = new Set([...SUGGESTED_CATEGORIES, ...existingCategories]);
    return Array.from(merged).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [existingCategories]);

  const handleFormSubmit = async (values: GalleryFormValues) => {
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      mediaType: values.mediaType,
      mediaUrl: values.mediaUrl.trim(),
      category: values.category.trim() || 'General',
      displayOrder: Number.isFinite(values.displayOrder) ? values.displayOrder : 0,
      status: values.status,
    });
  };

  const inputClass =
    'w-full rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#171615] placeholder:text-[#5C554E]/65 focus:border-[#57252F] focus:outline-none transition-colors';

  return (
    <AdminModal
      open={open}
      onClose={isSubmitting ? () => {} : onClose}
      title={mode === 'edit' ? 'Edit Gallery Item' : 'Add Gallery Item'}
      description={
        mode === 'edit'
          ? 'Update media details, URL, display order, or visibility on the public website.'
          : 'Add a photograph or cinema film using a direct image URL, YouTube, Vimeo, or MP4/WebM link.'
      }
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-4 py-2.5 text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] disabled:opacity-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="admin-gallery-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            <span>{mode === 'edit' ? 'Save Changes' : 'Add to Gallery'}</span>
          </button>
        </>
      }
    >
      <form
        id="admin-gallery-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
        noValidate
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-7 space-y-4">
            {/* Media Type Segmented Selector */}
            <div>
              <span className="block text-xs font-semibold text-[#171615] mb-1.5">
                Media Type <span className="text-[#B91C1C]">*</span>
              </span>
              <div
                role="group"
                aria-label="Select media type"
                className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#F7F2E9] border border-[#171615]/10"
              >
                <button
                  type="button"
                  onClick={() => setValue('mediaType', 'image', { shouldValidate: true })}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    watchedMediaType === 'image'
                      ? 'bg-[#57252F] text-[#F7F2E9] shadow-sm'
                      : 'text-[#5C554E] hover:text-[#171615]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" aria-hidden="true" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('mediaType', 'video', { shouldValidate: true })}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    watchedMediaType === 'video'
                      ? 'bg-[#57252F] text-[#F7F2E9] shadow-sm'
                      : 'text-[#5C554E] hover:text-[#171615]'
                  }`}
                >
                  <Film className="w-4 h-4" aria-hidden="true" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="gallery-title" className="block text-xs font-semibold text-[#171615] mb-1.5">
                Title <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="gallery-title"
                type="text"
                placeholder={
                  watchedMediaType === 'video'
                    ? 'e.g., Royal Udaipur Wedding Highlight Film'
                    : 'e.g., Twilight Vows Under Marigold Mandap'
                }
                {...register('title')}
                className={inputClass}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.title.message}</p>
              )}
            </div>

            {/* Media URL (URL-only — no file inputs) */}
            <div>
              <label htmlFor="gallery-media-url" className="block text-xs font-semibold text-[#171615] mb-1.5">
                {watchedMediaType === 'video' ? 'Video URL' : 'Image URL'}{' '}
                <span className="text-[#B91C1C]">*</span>
              </label>
              <div className="relative">
                <Link2
                  className="w-4 h-4 text-[#5C554E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="gallery-media-url"
                  type="url"
                  placeholder={
                    watchedMediaType === 'video'
                      ? 'https://www.youtube.com/watch?v=... or Vimeo / MP4 URL'
                      : 'https://example.com/wedding-portrait.jpg'
                  }
                  {...register('mediaUrl')}
                  className={`${inputClass} pl-10`}
                />
              </div>
              <p className="mt-1 text-[11px] text-[#5C554E]">
                {watchedMediaType === 'video'
                  ? 'Supports YouTube, YouTube Shorts, Vimeo, and direct MP4/WebM/OGG/MOV video URLs.'
                  : 'Enter a public HTTPS image URL (JPG, JPEG, PNG, WebP, GIF, AVIF, or image CDN).'}
              </p>
              {errors.mediaUrl && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.mediaUrl.message}</p>
              )}
            </div>

            {/* Category + Display Order Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="gallery-category" className="block text-xs font-semibold text-[#171615] mb-1.5">
                  Category <span className="text-[#5C554E] font-normal">(Optional)</span>
                </label>
                <input
                  id="gallery-category"
                  type="text"
                  list="gallery-category-suggestions"
                  placeholder="e.g., Wedding, Pre-Wedding, Haldi"
                  {...register('category')}
                  className={inputClass}
                />
                <datalist id="gallery-category-suggestions">
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="gallery-display-order" className="block text-xs font-semibold text-[#171615] mb-1.5">
                  Display Order <span className="text-[#5C554E] font-normal">(Optional)</span>
                </label>
                <input
                  id="gallery-display-order"
                  type="number"
                  min={0}
                  max={100000}
                  step={1}
                  placeholder="0"
                  {...register('displayOrder', { valueAsNumber: true })}
                  className={`${inputClass} tabular-nums`}
                />
                <p className="mt-1 text-[11px] text-[#5C554E]">Lower numbers appear first.</p>
                {errors.displayOrder && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.displayOrder.message}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <span className="block text-xs font-semibold text-[#171615] mb-1.5">
                Visibility Status
              </span>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#F7F2E9] border border-[#171615]/10">
                <button
                  type="button"
                  onClick={() => setValue('status', 'active', { shouldValidate: true })}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    watchedStatus === 'active'
                      ? 'bg-[#15803D] text-[#FFFFFF] shadow-sm'
                      : 'text-[#5C554E] hover:text-[#171615]'
                  }`}
                >
                  Active (Publicly Visible)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('status', 'inactive', { shouldValidate: true })}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    watchedStatus === 'inactive'
                      ? 'bg-[#4B5563] text-[#FFFFFF] shadow-sm'
                      : 'text-[#5C554E] hover:text-[#171615]'
                  }`}
                >
                  Inactive (Hidden)
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="gallery-description" className="block text-xs font-semibold text-[#171615] mb-1.5">
                Description <span className="text-[#5C554E] font-normal">(Optional)</span>
              </label>
              <textarea
                id="gallery-description"
                rows={3}
                placeholder="Brief story context, ritual highlight, venue, or cinematography note..."
                {...register('description')}
                className={`${inputClass} resize-y`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Right Column: Live Media Preview Panel */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold text-[#171615]">Live Media Preview</span>
              {watchedMediaUrl.trim() && parsedPreview.valid && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#15803D]">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{parsedPreview.providerLabel}</span>
                </span>
              )}
            </div>

            <div className="rounded-xl border border-[#171615]/12 bg-[#171615] overflow-hidden flex-1 min-h-[240px] flex flex-col">
              <div className="relative aspect-video w-full bg-[#121110] flex-1 flex items-center justify-center overflow-hidden">
                {!watchedMediaUrl.trim() ? (
                  <div className="px-6 py-10 text-center text-[#E8DCCB]/70 space-y-2">
                    {watchedMediaType === 'video' ? (
                      <Film className="w-8 h-8 mx-auto text-[#C5A46D]/80" aria-hidden="true" />
                    ) : (
                      <ImageIcon className="w-8 h-8 mx-auto text-[#C5A46D]/80" aria-hidden="true" />
                    )}
                    <p className="text-xs font-medium text-[#F7F2E9]/90">
                      Paste a {watchedMediaType === 'video' ? 'video' : 'photo'} URL to preview
                    </p>
                    <p className="text-[11px] text-[#E8DCCB]/60">
                      {watchedMediaType === 'video'
                        ? 'YouTube, Shorts, Vimeo, and direct MP4/WebM links render live here.'
                        : 'High-resolution image preview loads automatically.'}
                    </p>
                  </div>
                ) : !parsedPreview.valid ? (
                  <div className="px-6 py-10 text-center text-[#FCA5A5] space-y-2">
                    <AlertCircle className="w-7 h-7 mx-auto" aria-hidden="true" />
                    <p className="text-xs font-medium text-[#FEE2E2]">Unsupported or Invalid URL</p>
                    <p className="text-[11px] text-[#FECACA]/85 leading-relaxed">
                      {parsedPreview.error}
                    </p>
                  </div>
                ) : (
                  <GalleryMediaPreview
                    mediaType={watchedMediaType}
                    mediaUrl={parsedPreview.normalizedUrl}
                    embedUrl={parsedPreview.embedUrl}
                    thumbnail={parsedPreview.thumbnailUrl}
                    videoProvider={parsedPreview.videoProvider}
                    title={watchedTitle || 'Gallery preview'}
                    mode="player"
                    onLoadError={setPreviewLoadError}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              <div className="px-3.5 py-2.5 bg-[#1D1B1A] border-t border-[#C5A46D]/20 text-[11px] text-[#E8DCCB]/80 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-[#F7F2E9]">
                    {watchedTitle.trim() || 'Untitled Gallery Work'}
                  </span>
                  <span className="shrink-0 text-[#C5A46D]">
                    {watchedStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {parsedPreview.embedUrl && (
                  <div className="text-[10px] text-[#E8DCCB]/60 truncate">
                    Embed: {parsedPreview.embedUrl}
                  </div>
                )}
                {previewLoadError && (
                  <div className="text-[11px] text-[#FCA5A5]">
                    Preview could not load from the remote server. Check that the URL is public.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminModal>
  );
}
