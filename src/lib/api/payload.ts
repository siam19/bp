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
  VisitRecord,
  CheckoutPayload,
  CheckoutResponse,
  VerifyOrderPayload,
  VerifyOrderResponse,
  ReceiptResponse,
  TrackingResponse,
  InfoPage,
  ResendKeyResponse,
  ShopProduct,
  ShopDrop,
  ShopInfoPage,
  ShopMediaCard
} from '$lib/types';
import { PUBLIC_API_URL } from '$env/static/public';

const DEFAULT_API_BASE = PUBLIC_API_URL;

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
  const base = override ?? DEFAULT_API_BASE;
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
    // Ensure path is relative to preserve baseUrl's path component (e.g. /api)
    const relativePath = path.startsWith('/') ? path.slice(1) : path;
    const url = new URL(relativePath, `${baseUrl}/`);
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
    return request<PaginatedResponse<T>>(`/${collection}`, {
      query: options?.query,
      signal: options?.signal,
      fetch: options?.fetch,
      headers: options?.headers
    });
  };

  const read = <T>(collection: string, id: string, options?: RequestOptions) => {
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
    updateVisit: (id: string, payload: Partial<VisitPayload>, options?: MutationOptions) =>
      request<VisitRecord>(`/visits/${id}`, {
        method: 'PATCH',
        body: payload,
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),

    // Custom Endpoints
    checkout: (payload: CheckoutPayload, options?: MutationOptions) =>
      request<CheckoutResponse>('/checkout', {
        method: 'POST',
        body: payload,
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),
    getReceipt: (orderId: string, auth?: { phone: string; pin: string }, options?: RequestOptions) => {
      const headers: HeadersInit = options?.headers ?? {};
      if (auth) {
        (headers as Record<string, string>)['x-auth-phone'] = auth.phone;
        (headers as Record<string, string>)['x-auth-pin'] = auth.pin;
      }
      return request<ReceiptResponse>('/receipt', {
        query: { ...options?.query, order_id: orderId },
        signal: options?.signal,
        fetch: options?.fetch,
        headers
      });
    },
    verifyOrder: (orderId: string, payload: VerifyOrderPayload, options?: MutationOptions) =>
      request<VerifyOrderResponse>(`/orders/${orderId}/verify`, {
        method: 'POST',
        body: payload,
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),
    getTracking: (orderId: string, options?: RequestOptions) =>
      request<TrackingResponse>(`/orders/${orderId}/tracking`, {
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),
    getInfoPage: (options?: RequestOptions) =>
      request<InfoPage>('/globals/info-page', {
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),
    recordVisit: (payload: { visitor_id: string; cart_snapshot?: any }, options?: MutationOptions) =>
      request<void>('/visits', {
        method: 'POST',
        body: payload,
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),
    resendKey: (options?: RequestOptions) =>
      request<ResendKeyResponse>('/resend-key', {
        signal: options?.signal,
        fetch: options?.fetch,
        headers: options?.headers
      }),

    // Shop API (v2.1)
    getShopProducts: (options?: RequestOptions) => list<ShopProduct>('shop/products', options),
    getShopProduct: (slug: string, options?: RequestOptions) => request<ShopProduct>(`/shop/products/${slug}`, {
      query: options?.query,
      signal: options?.signal,
      fetch: options?.fetch,
      headers: options?.headers
    }),
    getShopDrops: (options?: RequestOptions) => list<ShopDrop>('shop/drops', options),
    getShopDrop: (slug: string, options?: RequestOptions) => request<ShopDrop>(`/shop/drops/${slug}`, {
      query: options?.query,
      signal: options?.signal,
      fetch: options?.fetch,
      headers: options?.headers
    }),
    getShopInfoPage: (options?: RequestOptions) => request<ShopInfoPage>('/shop/info', {
      query: options?.query,
      signal: options?.signal,
      fetch: options?.fetch,
      headers: options?.headers
    }),
    getShopMediaCards: (options?: RequestOptions) => list<ShopMediaCard>('shop/media-cards', options),
    getShopProductMediaCards: (productId: string, options?: RequestOptions) => list<ShopMediaCard>(`shop/media-cards/${productId}`, options),
   
  };
};

// Shared singleton for most use-cases.
export const payloadClient = createPayloadClient();
