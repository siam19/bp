import type {
  CmsPage,
  ContactRequest,
  Drop,
  MediaAsset,
  MediaCard,
  NotifierSubscription,
  Product,
  User,
  Variant,
  VisitRecord
} from '$lib/types';
import { mockDrops, mockProducts, mockMediaCards } from './mock-data';

const DEFAULT_API_BASE = 'https://admin.banglapunk.com/api';
const USE_MOCK_DATA = true;
const envBase = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_PAYLOAD_API_BASE) ? import.meta.env.VITE_PAYLOAD_API_BASE : undefined;

type FetchFn = typeof fetch;

export type QueryPrimitive = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryPrimitive>;

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PayloadCreateResponse<T> {
  doc: T;
  message?: string;
}

export interface LoginResponse {
  token?: string;
  user: User;
  exp?: number;
}

export interface ContactRequestPayload {
  name: string;
  contact_info: string;
  department: 'Sales' | 'Admin' | 'Tech';
  subject?: string;
  message?: string;
}

export interface NotifierPayload {
  contact_method: 'email' | 'phone';
  contact_value: string;
  context?: {
    drop_id?: string;
    product_id?: string;
  };
}

export interface VisitPayload {
  visitor_id: string;
  ip_address?: string;
  user_agent?: string;
  cart_snapshot?: Record<string, unknown>;
}

export interface RequestOptions {
  query?: QueryParams;
  signal?: AbortSignal;
  fetch?: FetchFn;
  headers?: HeadersInit;
}

export interface MutationOptions {
  signal?: AbortSignal;
  fetch?: FetchFn;
  headers?: HeadersInit;
}

export interface PayloadClientConfig {
  baseUrl?: string;
  fetch?: FetchFn;
}

export class PayloadRequestError<T = unknown> extends Error {
  readonly status: number;
  readonly data: T | null;

  constructor(status: number, statusText: string, data: T | null) {
    super(`Payload request failed with ${status}: ${statusText}`);
    this.name = 'PayloadRequestError';
    this.status = status;
    this.data = data;
  }
}

interface InternalRequestConfig extends RequestOptions {
  method?: string;
  body?: unknown;
}

const isJsonResponse = (response: Response) =>
  response.headers.get('content-type')?.includes('application/json');

const serializeBody = (body: unknown) => {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof body === 'string' || body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
};

const applyQuery = (url: URL, params?: QueryParams) => {
  if (!params) return;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }
};

function resolveBaseUrl(override?: string) {
  const base = override ?? envBase ?? DEFAULT_API_BASE;
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

async function parseResponse<T>(response: Response): Promise<T | null> {
  if (isJsonResponse(response)) {
    return response.json() as Promise<T>;
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.warn('Received non-JSON response from Payload', error);
    return text as unknown as T;
  }
}

export const createPayloadClient = (config: PayloadClientConfig = {}) => {
  const baseUrl = resolveBaseUrl(config.baseUrl);
  const defaultFetch = config.fetch ?? globalThis.fetch;

  if (!defaultFetch) {
    throw new Error('Global fetch is not available; provide a fetch implementation via config.');
  }

  const request = async <T>(path: string, cfg: InternalRequestConfig = {}) => {
    const url = new URL(path.startsWith('/') ? path : `/${path}`, `${baseUrl}/`);
    applyQuery(url, cfg.query);

    const headers = new Headers(cfg.headers ?? {});
    headers.set('Accept', 'application/json');

    const body = serializeBody(cfg.body);
    if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await (cfg.fetch ?? defaultFetch)(url, {
      method: cfg.method ?? 'GET',
      headers,
      body,
      signal: cfg.signal
    });

    const payload = await parseResponse<T>(response);
    if (!response.ok) {
      throw new PayloadRequestError(response.status, response.statusText, payload);
    }

    return payload as T;
  };

  const list = <T>(collection: string, options?: RequestOptions) => {
    if (USE_MOCK_DATA) {
      let data: any[] = [];
      if (collection === 'drops') data = mockDrops;
      if (collection === 'products') data = mockProducts;
      if (collection === 'media-cards') data = mockMediaCards;

      if (options?.query) {
        const statusQuery = options.query['where[status][equals]'];
        if (statusQuery) {
          data = data.filter(item => item.status === statusQuery);
        }
      }

      return Promise.resolve({
        docs: data,
        totalDocs: data.length,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      } as PaginatedResponse<T>);
    }

    return request<PaginatedResponse<T>>(`/${collection}`, {
      query: options?.query,
      signal: options?.signal,
      fetch: options?.fetch,
      headers: options?.headers
    });
  };

  const read = <T>(collection: string, id: string, options?: RequestOptions) => {
    if (USE_MOCK_DATA) {
      let item: any = null;
      if (collection === 'drops') item = mockDrops.find(d => d.id === id || d.slug === id);
      if (collection === 'products') item = mockProducts.find(p => p.id === id || p.slug === id);
      
      if (item) {
        return Promise.resolve(item as T);
      }
      return Promise.reject(new PayloadRequestError(404, 'Not Found', null));
    }

    return request<T>(`/${collection}/${id}`, {
      query: options?.query,
      signal: options?.signal,
      fetch: options?.fetch,
      headers: options?.headers
    });
  };

  const create = <TPayload, TResponse>(collection: string, payload: TPayload, options?: MutationOptions) =>
    request<PayloadCreateResponse<TResponse>>(`/${collection}`, {
      method: 'POST',
      body: payload,
      signal: options?.signal,
      fetch: options?.fetch,
      headers: options?.headers
    });

  return {
    listProducts: (options?: RequestOptions) => list<Product>('products', options),
    getProduct: (id: string, options?: RequestOptions) => read<Product>('products', id, options),
    listVariants: (options?: RequestOptions) => list<Variant>('variants', options),
    getVariant: (id: string, options?: RequestOptions) => read<Variant>('variants', id, options),
    listDrops: (options?: RequestOptions) => list<Drop>('drops', options),
    getDrop: (id: string, options?: RequestOptions) => read<Drop>('drops', id, options),
    listMedia: (options?: RequestOptions) => list<MediaAsset>('media', options),
    getMedia: (id: string, options?: RequestOptions) => read<MediaAsset>('media', id, options),
    listMediaCards: <T = MediaCard>(options?: RequestOptions) => list<T>('media-cards', options),
    listPages: <T = CmsPage>(options?: RequestOptions) => list<T>('pages', options),
    getPage: <T = CmsPage>(id: string, options?: RequestOptions) => read<T>('pages', id, options),
    createContactRequest: (payload: ContactRequestPayload, options?: MutationOptions) =>
      create<ContactRequestPayload, ContactRequest>('contact-requests', payload, options),
    createNotifier: (payload: NotifierPayload, options?: MutationOptions) =>
      create<NotifierPayload, NotifierSubscription>('notifiers', payload, options),
    createVisit: (payload: VisitPayload, options?: MutationOptions) =>
      create<VisitPayload, VisitRecord>('visits', payload, options),
    
    // Auth
    login: (credentials: { email: string; password: string }, options?: MutationOptions) =>
      request<LoginResponse>('/users/login', {
        method: 'POST',
        body: credentials,
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),
    logout: (options?: MutationOptions) =>
      request<{ message: string }>('/users/logout', {
        method: 'POST',
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),
    me: (options?: RequestOptions) =>
      request<{ user: User | null }>('/users/me', {
        query: options?.query,
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      })
  };
};

// Shared singleton for most use-cases.
export const payloadClient = createPayloadClient();
