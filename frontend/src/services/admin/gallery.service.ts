import type {
  AdminGalleryListResponse,
  GalleryItem,
  GalleryMutationInput,
  GalleryStatus,
} from '../../types';
import { apiRequest } from '../api/httpClient';
import { emitDataChange } from './storage.util';

export interface AdminGalleryQueryParams {
  search?: string;
  mediaType?: 'all' | 'image' | 'video';
  status?: 'all' | GalleryStatus;
  category?: string;
  sort?: 'displayOrder' | 'latest' | 'oldest' | 'title';
  page?: number;
  limit?: number;
}

export const galleryAdminService = {
  async listAdmin(
    params?: AdminGalleryQueryParams,
    signal?: AbortSignal
  ): Promise<AdminGalleryListResponse> {
    const res = await apiRequest<AdminGalleryListResponse>('/api/gallery/admin', {
      query: {
        search: params?.search?.trim() || undefined,
        mediaType: params?.mediaType && params.mediaType !== 'all' ? params.mediaType : undefined,
        status: params?.status && params.status !== 'all' ? params.status : undefined,
        category: params?.category && params.category !== 'all' ? params.category : undefined,
        sort: params?.sort || 'displayOrder',
        page: params?.page || 1,
        limit: params?.limit || 12,
      },
      signal,
    });

    return (
      res.data || {
        items: [],
        stats: { total: 0, active: 0, inactive: 0, images: 0, videos: 0 },
        categories: [],
        pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
      }
    );
  },

  async create(input: GalleryMutationInput): Promise<GalleryItem> {
    const res = await apiRequest<GalleryItem>('/api/gallery', {
      method: 'POST',
      body: input,
    });
    emitDataChange();
    return res.data;
  },

  async update(id: string, input: GalleryMutationInput): Promise<GalleryItem> {
    const res = await apiRequest<GalleryItem>(`/api/gallery/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: input,
    });
    emitDataChange();
    return res.data;
  },

  async updateStatus(id: string, status: GalleryStatus): Promise<GalleryItem> {
    const res = await apiRequest<GalleryItem>(
      `/api/gallery/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        body: { status },
      }
    );
    emitDataChange();
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await apiRequest(`/api/gallery/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    emitDataChange();
  },
};
