// Source of Truth for Data Models
// Refers to Payload CMS Collections and Frontend Interactions
```ts
// --- Commerce Models ---

export interface Variant {
  id: string;
  sku: string; // e.g., "TEE-CAMO-S"
  size: string; // "S", "M", "L"
  stock_count: number;
  parent_product: string; // ID of the parent
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number; // Base Price in BDT
  description: ContentBlock[]; // Payload Rich Text/Blocks
  status: 'AVAILABLE' | 'UPCOMING' | 'UNAVAILABLE';
  
  // Assets
  images: {
    front: MediaAsset;
    back: MediaAsset;
    profile: MediaAsset;
  };

  // The "Ghost Field" (Join) result from Payload
  variants?: {
    docs: Variant[];
  };

  tags?: string[]; // ["Camo", "Winter"]
  related_products?: Product[]; // Manual overrides
}

export interface MediaAsset {
  id: string;
  url: string; // High-res URL (R2)
  alt: string;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: { url: string };
    card?: { url: string };
  };
}

export interface Drop {
  id: string;
  slug: string;
  name: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ARCHIVED';
  release_date: string; // ISO String
  end_date?: string;
  
  assets: {
    banners: MediaAsset[];
    video_url?: string; // Embed URL
  };
  
  products?: Product[]; // Relationship hasMany
}

export interface ContentBlock {
  blockType: 'text' | 'image';
  text?: string; // HTML or Markdown
  image?: MediaAsset;
}

// --- Cart & Order Models ---

export interface CartItem {
  variantId: string; // CRITICAL: We buy Variants, not Products
  productId: string; // For grouping/display
  productName: string;
  variantName: string; // e.g. "Size M"
  price: number;
  image: string; // Thumbnail URL
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: 'Inside Dhaka' | 'Outside Dhaka'; // Simplified for logic
  email?: string;
}

export interface Order {
  id: string; // Payload generated ID
  customer: CustomerInfo;
  items: {
    product_name: string;
    variant_name: string;
    price: number;
    quantity: number;
  }[];
  total_amount: number;
  payment_method: 'COD' | 'BKASH';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  tracking?: {
    consignment_id?: number;
    tracking_code?: string;
  };
  created_at: string;
}

// --- Interaction Models ---

export interface ContactForm {
  name: string;
  contact: string;
  subject: string;
  message: string;
  type: 'General' | 'Order Issue' | 'Restock';
}
```