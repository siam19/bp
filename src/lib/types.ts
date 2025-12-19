/**
 * Shared domain models derived from src/#app.types.md.
 * Keep this file in sync with the markdown source of truth.
 */

export type ProductStatus = 'AVAILABLE' | 'UPCOMING' | 'UNAVAILABLE';
export type DropStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ARCHIVED';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BKASH';
export type ContactDepartment = 'Sales' | 'Admin' | 'Tech';
export type ContactRequestStatus = 'New' | 'In Progress' | 'Resolved';
export type DeliveryArea = 'Inside Dhaka' | 'Outside Dhaka';
export type DeliveryWindow = 'Morning' | 'Afternoon' | 'Evening';
export type NotifierMethod = 'email' | 'phone';
export type VariantSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'OS';

export interface Variant {
  id: string;
  sku?: string | null;
  size: VariantSize;
  stock_count: number;
  parent_product: string | Product;
  updatedAt: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  url?: string | null;
  filename?: string | null;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  filesize?: number | null;
  thumbnailURL?: string | null;
  sizes?: {
    thumbnail?: { url?: string | null; width?: number; height?: number; filename?: string | null };
    card?: { url?: string | null; width?: number; height?: number; filename?: string | null };
  };
  updatedAt: string;
  createdAt: string;
}

export interface ProductTag {
  tag?: string | null;
  id?: string | null;
}

export interface Product {
  id: string;
  slug?: string | null;
  name: string;
  price: number;
  description?: (
    | { blockType: 'text_block'; content?: string | null; [key: string]: unknown }
    | { blockType: 'image_block'; image?: (string | null) | MediaAsset; [key: string]: unknown }
  )[] | null;
  status?: ProductStatus | null;
  images: {
    front: string | MediaAsset;
    back?: (string | null) | MediaAsset;
    profile?: (string | null) | MediaAsset;
  };
  variants?: {
    docs?: (string | Variant)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  tags?: ProductTag[] | null;
  related_products?: (string | Product)[] | null;
  _status?: ('draft' | 'published') | null;
  updatedAt: string;
  createdAt: string;
}

export interface Drop {
  id: string;
  slug?: string | null;
  name: string;
  status?: DropStatus | null;
  release_date?: string | null;
  end_date?: string | null;
  products?: (string | Product)[] | null;
  assets?: {
    banners?: (string | MediaAsset)[] | null;
    video_embed_url?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}

export interface MediaCard {
  id: string;
  name?: string | null;
  media: string | MediaAsset;
  tagged_products?: (string | Product)[] | null;
  updatedAt: string;
  createdAt: string;
}

// --- Shop API Types (v2.1) ---

export interface ShopImage {
  filename: string;
  thumbnail?: {
    filename: string;
  };
}

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: ProductStatus;
  tags?: string[];
  images: {
    front: ShopImage;
    back?: ShopImage;
    profile?: ShopImage;
  };
  variants: {
    id?: string;
    sku: string;
    size: VariantSize;
    stock_count: number;
  }[];
  related_products?: { id: string }[];
  description?: any[];
  featured?: boolean;
  size_guide?: string;
}

export interface ShopDrop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: DropStatus;
  release_date?: string;
  end_date?: string;
  products: ShopProduct[];
  assets?: {
    banners?: ShopImage[];
    video_embed_url?: string;
  };
}

export interface ShopMediaCard {
  id: string;
  filename: string;
  height: number;
  width: number;
  tagged_products: { id: string; slug: string }[];
}

export interface ShopInfoPage {
  tabs: {
    label: string;
    content: any[];
  }[];
}

export interface CmsPage {
  id: string;
  title: string;
  slug?: string | null;
  layout?: (
    | {
        blockType: 'content';
        rich_text?: { root: { children: any[]; [key: string]: unknown } };
        id?: string | null;
      }
    | {
        blockType: 'media';
        media: string | MediaAsset;
        caption?: string | null;
        size?: ('full' | 'wide' | 'half') | null;
      }
  )[] | null;
  _status?: ('draft' | 'published') | null;
  updatedAt: string;
  createdAt: string;
}

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  delivery_area: DeliveryArea;
  email?: string | null;
  notes?: string | null;
  delivery_timeframe?: DeliveryWindow | null;
}

export interface OrderItem {
  item_type: 'existing_product' | 'one_time';
  name?: string | null;
  product?: (string | null) | Product;
  variant?: (string | null) | Variant;
  price: number;
  quantity: number;
  id?: string | null;
}

export interface Order {
  id: string;
  client_order_id?: string | null;
  pin?: string | null;
  customer_info: CustomerInfo;
  items: OrderItem[];
  total_amount: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  tracking?: {
    consignment_id?: number | null;
    tracking_code?: string | null;
    current_status?: string | null;
  };
  visitor_id?: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface ContactForm {
  name: string;
  contact: string;
  subject: string;
  message: string;
  type: 'General' | 'Order Issue' | 'Restock';
}

export interface ContactRequest {
  id: string;
  name: string;
  contact_info: string;
  department: ContactDepartment;
  subject?: string;
  message?: string;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotifierSubscription {
  id: string;
  contact_method: NotifierMethod;
  contact_value: string;
  context?: {
    drop_id?: (string | null) | Drop;
    product_id?: (string | null) | Product;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VisitRecord {
  id: string;
  visitor_id: string;
  ip_address?: string | null;
  user_agent?: string | null;
  cart_snapshot?:
    | { [k: string]: unknown }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  sessions?: {
      id: string;
      createdAt?: string | null;
      expiresAt: string;
    }[] | null;
  updatedAt: string;
  createdAt: string;
}

export interface MasonryMedia {
  mediaURL: string;
  title: string;
  taggedProducts: string[];
}

export type MasonryItem =
  | { id: string; type: 'product'; product: ShopProduct }
  | { id: string; type: 'media'; media: MasonryMedia };

export interface InfoPage {
  tabs: {
    label: string;
    content: (
      | {
          blockType: 'generic_section';
          sections?: {
            title?: string | null;
            body?: string | null;
            image?: (string | null) | MediaAsset;
            id?: string | null;
          }[] | null;
          id?: string | null;
        }
      | {
          blockType: 'policy_section';
          policies?: {
            title: string;
            content: string;
            id?: string | null;
          }[] | null;
          id?: string | null;
        }
      | {
          blockType: 'team_section';
          members?: {
            name: string;
            role: string;
            avatar: string | MediaAsset;
            id?: string | null;
          }[] | null;
          id?: string | null;
        }
    )[];
    id?: string | null;
  }[];
}

// API Payloads & Responses

export interface CheckoutPayload {
  items: {
    variantId: string;
    quantity: number;
    price: number;
    item_type?: 'existing_product';
  }[];
  customer: CustomerInfo;
  visitor_id?: string;
  client_order_id: string;
  payment_method: PaymentMethod;
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  pin?: string;
  error?: string;
}

export interface VerifyOrderPayload {
  phone: string;
  key: string;
}

export interface VerifyOrderResponse {
  verified: boolean;
  customer?: CustomerInfo;
  tracking?: {
    consignment_id?: number | null;
    tracking_code?: string | null;
    current_status?: string | null;
  };
  error?: string;
}

export interface ReceiptResponse {
  authorized: boolean;
  order: Order;
}

export interface TrackingResponse {
  delivery_status?: string;
  current_location?: string;
  estimated_delivery?: string;
  status?: string;
  error?: string;
}

export interface ResendKeyResponse {
  key: string;
}
