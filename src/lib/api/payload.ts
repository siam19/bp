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
import {
  mockShopProducts,
  mockShopDrops,
  mockShopMediaCards,
  mockShopInfoPage,
  createMockOrder,
  mockProducts,
  mockDrops,
  mockMediaCards,
  mockVariants
} from './mock-data';

const DEFAULT_API_BASE = PUBLIC_API_URL || '/api';

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
  useMock?: boolean;
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
  const base = override || DEFAULT_API_BASE || '/api';
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
  const useMock = config.useMock ?? true;

  const request = async <T>(path: string, cfg: InternalRequestConfig = {}): Promise<T> => {
    if (!defaultFetch) {
      throw new Error('Global fetch is not available; provide a fetch implementation via config.');
    }

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

  // Mock-enabled methods for standalone frontend mode
  return {
    listProducts: async (options?: RequestOptions): Promise<PaginatedResponse<Product>> => {
      if (!useMock) return list<Product>('products', options);
      return {
        docs: mockProducts,
        totalDocs: mockProducts.length,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      };
    },

    getProduct: async (id: string, options?: RequestOptions): Promise<Product> => {
      if (!useMock) return read<Product>('products', id, options);
      return mockProducts.find(p => p.id === id || p.slug === id) ?? mockProducts[0];
    },

    listVariants: (options?: RequestOptions) => list<Variant>('variants', options),
    getVariant: (id: string, options?: RequestOptions) => read<Variant>('variants', id, options),

    listDrops: async (options?: RequestOptions): Promise<PaginatedResponse<Drop>> => {
      if (!useMock) return list<Drop>('drops', options);
      return {
        docs: mockDrops,
        totalDocs: mockDrops.length,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      };
    },

    getDrop: async (id: string, options?: RequestOptions): Promise<Drop> => {
      if (!useMock) return read<Drop>('drops', id, options);
      return mockDrops.find(d => d.id === id || d.slug === id) ?? mockDrops[0];
    },

    listMedia: (options?: RequestOptions) => list<MediaAsset>('media', options),
    getMedia: (id: string, options?: RequestOptions) => read<MediaAsset>('media', id, options),

    listMediaCards: async <T = MediaCard>(options?: RequestOptions): Promise<PaginatedResponse<T>> => {
      if (!useMock) return list<T>('media-cards', options);
      return {
        docs: mockMediaCards as unknown as T[],
        totalDocs: mockMediaCards.length,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      };
    },

    listPages: <T = CmsPage>(options?: RequestOptions) => list<T>('pages', options),
    getPage: <T = CmsPage>(id: string, options?: RequestOptions) => read<T>('pages', id, options),

    createContactRequest: async (payload: ContactRequestPayload, options?: MutationOptions): Promise<PayloadCreateResponse<ContactRequest>> => {
      if (!useMock) return create<ContactRequestPayload, ContactRequest>('contact-requests', payload, options);
      const doc: ContactRequest = {
        id: `cr-${Date.now()}`,
        name: payload.name,
        contact_info: payload.contact_info,
        department: payload.department,
        subject: payload.subject,
        message: payload.message,
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return { doc, message: 'Message sent successfully.' };
    },

    createNotifier: async (payload: NotifierPayload, options?: MutationOptions): Promise<PayloadCreateResponse<NotifierSubscription>> => {
      if (!useMock) return create<NotifierPayload, NotifierSubscription>('notifiers', payload, options);
      const doc: NotifierSubscription = {
        id: `notif-${Date.now()}`,
        contact_method: payload.contact_method,
        contact_value: payload.contact_value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return { doc, message: 'Subscribed successfully.' };
    },

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
    checkout: async (payload: CheckoutPayload, options?: MutationOptions): Promise<CheckoutResponse> => {
      if (!useMock) {
        return request<CheckoutResponse>('/checkout', {
          method: 'POST',
          body: payload,
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      return {
        success: true,
        orderId: payload.client_order_id,
        pin: '1234'
      };
    },

    getReceipt: async (orderId: string, auth?: { phone: string; pin: string }, options?: RequestOptions): Promise<ReceiptResponse> => {
      if (!useMock) {
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
      }
      const isAuthorized = !!(auth && auth.pin);
      return {
        authorized: isAuthorized,
        order: createMockOrder(orderId, isAuthorized)
      };
    },

    verifyOrder: async (orderId: string, payload: VerifyOrderPayload, options?: MutationOptions): Promise<VerifyOrderResponse> => {
      if (!useMock) {
        return request<VerifyOrderResponse>(`/orders/${orderId}/verify`, {
          method: 'POST',
          body: payload,
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      const order = createMockOrder(orderId, true);
      const verified = !payload.key || payload.key === '1234' || payload.key.length >= 4;
      return {
        verified,
        customer: order.customer_info,
        tracking: order.tracking
      };
    },

    getTracking: async (orderId: string, options?: RequestOptions): Promise<TrackingResponse> => {
      if (!useMock) {
        return request<TrackingResponse>(`/orders/${orderId}/tracking`, {
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      return {
        delivery_status: 'In Transit',
        current_location: 'Tejgaon Hub, Dhaka',
        estimated_delivery: 'Tomorrow by 6:00 PM',
        status: 'success'
      };
    },

    getInfoPage: async (options?: RequestOptions): Promise<InfoPage> => {
      if (!useMock) {
        return request<InfoPage>('/globals/info-page', {
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      return mockShopInfoPage as unknown as InfoPage;
    },

    recordVisit: async (payload: { visitor_id: string; cart_snapshot?: any }, options?: MutationOptions): Promise<void> => {
      if (!useMock) {
        return request<void>('/visits', {
          method: 'POST',
          body: payload,
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      return Promise.resolve();
    },

    resendKey: async (options?: RequestOptions): Promise<ResendKeyResponse> => {
      if (!useMock) {
        return request<ResendKeyResponse>('/resend-key', {
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      return { key: '1234' };
    },

    // Shop API (v2.1)
    getShopProducts: async (options?: RequestOptions): Promise<PaginatedResponse<ShopProduct>> => {
      if (!useMock) return list<ShopProduct>('shop/products', options);

      let products = [...mockShopProducts];
      const query = options?.query ?? {};

      const statusEquals = query['where[status][equals]'];
      if (statusEquals) {
        products = products.filter(p => p.status === statusEquals);
      }

      const idIn = query['where[id][in]'];
      if (idIn) {
        const ids = String(idIn).split(',');
        products = products.filter(p => ids.includes(p.id));
      }

      const page = typeof query['page'] === 'number' ? query['page'] : parseInt(String(query['page'] ?? '1'), 10) || 1;
      const limit = typeof query['limit'] === 'number' ? query['limit'] : parseInt(String(query['limit'] ?? '12'), 10) || 12;

      const start = (page - 1) * limit;
      const paginated = products.slice(start, start + limit);
      const totalPages = Math.max(1, Math.ceil(products.length / limit));

      return {
        docs: paginated,
        totalDocs: products.length,
        limit,
        totalPages,
        page,
        pagingCounter: start + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null
      };
    },

    getShopProduct: async (slug: string, options?: RequestOptions): Promise<ShopProduct> => {
      if (!useMock) {
        return request<ShopProduct>(`/shop/products/${slug}`, {
          query: options?.query,
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      const product = mockShopProducts.find(p => p.slug === slug || p.id === slug) ?? mockShopProducts[0];
      return product;
    },

    getShopDrops: async (options?: RequestOptions): Promise<PaginatedResponse<ShopDrop>> => {
      if (!useMock) return list<ShopDrop>('shop/drops', options);

      let drops = [...mockShopDrops];
      const query = options?.query ?? {};

      const statusEquals = query['where[status][equals]'];
      if (statusEquals) {
        drops = drops.filter(d => d.status === statusEquals);
      }

      const sort = query['sort'];
      if (sort === '-end_date') {
        drops.sort((a, b) => new Date(b.end_date || 0).getTime() - new Date(a.end_date || 0).getTime());
      } else if (sort === 'release_date') {
        drops.sort((a, b) => new Date(a.release_date || 0).getTime() - new Date(b.release_date || 0).getTime());
      } else if (sort === '-release_date') {
        drops.sort((a, b) => new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime());
      }

      const limit = typeof query['limit'] === 'number' ? query['limit'] : parseInt(String(query['limit'] ?? '100'), 10) || 100;
      const paginated = drops.slice(0, limit);

      return {
        docs: paginated,
        totalDocs: drops.length,
        limit,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      };
    },

    getShopDrop: async (slug: string, options?: RequestOptions): Promise<ShopDrop> => {
      if (!useMock) {
        return request<ShopDrop>(`/shop/drops/${slug}`, {
          query: options?.query,
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      const drop = mockShopDrops.find(d => d.slug === slug || d.id === slug) ?? mockShopDrops[0];
      return drop;
    },

    getShopInfoPage: async (options?: RequestOptions): Promise<ShopInfoPage> => {
      if (!useMock) {
        return request<ShopInfoPage>('/shop/info', {
          query: options?.query,
          signal: options?.signal,
          fetch: options?.fetch,
          headers: options?.headers
        });
      }
      return mockShopInfoPage;
    },

    getShopMediaCards: async (options?: RequestOptions): Promise<PaginatedResponse<ShopMediaCard>> => {
      if (!useMock) return list<ShopMediaCard>('shop/media-cards', options);

      const query = options?.query ?? {};
      const limit = typeof query['limit'] === 'number' ? query['limit'] : parseInt(String(query['limit'] ?? '10'), 10) || 10;
      const paginated = mockShopMediaCards.slice(0, limit);

      return {
        docs: paginated,
        totalDocs: mockShopMediaCards.length,
        limit,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      };
    },

    getShopProductMediaCards: async (productId: string, options?: RequestOptions): Promise<PaginatedResponse<ShopMediaCard>> => {
      if (!useMock) return list<ShopMediaCard>(`shop/media-cards/${productId}`, options);

      const filtered = mockShopMediaCards.filter(mc => mc.tagged_products.some(tp => tp.id === productId));
      const docs = filtered.length > 0 ? filtered : mockShopMediaCards.slice(0, 2);

      return {
        docs,
        totalDocs: docs.length,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      };
    }
  };
};

// Shared singleton for most use-cases.
export const payloadClient = createPayloadClient();
