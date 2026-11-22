export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: ApiPagination;
  errors?: Record<string, string>;
}

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(status: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
  }
}

const RAW_API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') || '';

// Access token lives strictly in JS memory (never persisted in localStorage/sessionStorage).
// Persistent browser reload sessions are backed by the backend's HttpOnly cookie.
let inMemoryAccessToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function registerUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export function buildApiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${RAW_API_BASE}${normalized}`;
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/uploads/') && RAW_API_BASE) {
    return `${RAW_API_BASE}${url}`;
  }
  return url;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
  suppressUnauthorizedEvent?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, query, signal, suppressUnauthorizedEvent = false } = options;

  let fullUrl = buildApiUrl(path);
  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    if (qs) {
      fullUrl += `?${qs}`;
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (inMemoryAccessToken) {
    headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }

  let fetchBody: BodyInit | undefined;
  if (body instanceof FormData) {
    fetchBody = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method,
      headers,
      body: fetchBody,
      credentials: 'include',
      signal,
    });
  } catch (networkErr) {
    if ((networkErr as Error)?.name === 'AbortError') {
      throw networkErr;
    }
    throw new ApiClientError(
      0,
      'Unable to reach the studio server. Please check your connection and try again.'
    );
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || (payload && payload.success === false)) {
    if (response.status === 401 && !suppressUnauthorizedEvent && unauthorizedHandler) {
      unauthorizedHandler();
    }
    throw new ApiClientError(
      response.status,
      payload?.message || `Request failed with status ${response.status}.`,
      payload?.errors
    );
  }

  return (
    payload || {
      success: true,
      message: 'Success',
      data: null as T,
    }
  );
}
