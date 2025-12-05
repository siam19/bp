# Banglapunk Backend API Reference

> **Payload CMS REST API Documentation**  
> Base URL: `https://admin.banglapunk.com/api`

---

## Table of Contents

1. [Global API Standards](#1-global-api-standards)
2. [E-commerce Collections](#2-e-commerce-collections)
   - [Products](#21-products)
   - [Variants](#22-variants)
   - [Drops](#23-drops)
   - [Media Cards](#24-media-cards)
3. [Operational Collections](#3-operational-collections)
   - [Orders](#31-orders)
   - [Visits](#32-visits)
   - [Notifiers](#33-notifiers)
4. [Core Platform Collections](#4-core-platform-collections)
   - [Pages](#41-pages)
   - [Users (Authentication)](#42-users-authentication)
   - [Media (File Uploads)](#43-media-file-uploads)

---

## 1. Global API Standards

### Architecture

- **Platform:** Payload CMS with MongoDB
- **Pattern:** REST API at `/api/:collection-slug`
- **Security:** "Secure by Default" – all endpoints require authentication unless explicitly public

### Authentication Methods

| Method | Mechanism | Use Case |
|--------|-----------|----------|
| **HTTP-Only Cookies** | Server-set secure cookie | Web browsers (recommended) |
| **JWT Bearer Token** | `Authorization: Bearer <token>` | Mobile apps, server-to-server |

### Universal Query Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `select` | Field projection | `?select[name]=true&select[price]=true` |
| `populate` | Expand relationships | `?populate=variants&populate=images.front` |
| `depth` | Recursion limit | `?depth=2` |
| `where` | Filtering | `?where[status][equals]=ACTIVE` |
| `limit` | Max results | `?limit=10` |
| `page` | Pagination | `?page=2` |
| `sort` | Ordering | `?sort=-createdAt` (descending) |

### Common Filter Operators

```
equals, not_equals, greater_than, less_than, 
greater_than_equal, less_than_equal, in, not_in, 
contains, like, exists
```

---

## 2. E-commerce Collections

### 2.1 Products

**Endpoint:** `/api/products`

```typescript
interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  status?: 'AVAILABLE' | 'UPCOMING' | 'UNAVAILABLE';
  tags?: { tag: string; id: string }[];
  variants?: {
    docs: (string | Variant)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  related_products?: (string | Product)[];
  images: {
    front: string | Media;
    back?: string | Media;
    profile?: string | Media;
  };
  description?: (TextBlock | ImageBlock)[];
  _status?: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}
```

**Common Queries:**

| Use Case | Query |
|----------|-------|
| List (optimized) | `?select[name]=true&select[price]=true&select[slug]=true&select[images.front]=true` |
| Detail view | `?populate=variants&populate=images.front&populate=related_products&depth=2` |
| Available only | `?where[status][equals]=AVAILABLE` |

---

### 2.2 Variants

**Endpoint:** `/api/variants`

```typescript
interface Variant {
  id: string;
  sku?: string;              // Auto-generated: "PRODUCT-SIZE"
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'OS';
  stock_count: number;
  parent_product: string | Product;
  createdAt: string;
  updatedAt: string;
}
```

**Note:** Typically accessed via `?populate=variants` on Products, not queried directly.

---

### 2.3 Drops

**Endpoint:** `/api/drops`

```typescript
interface Drop {
  id: string;
  name: string;
  slug?: string;
  status?: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ARCHIVED';
  release_date?: string;     // ISO timestamp
  end_date?: string;
  products?: (string | Product)[];
  assets?: {
    banners?: (string | Media)[];
    video_embed_url?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

**Common Queries:**

| Use Case | Query |
|----------|-------|
| Active drops | `?where[status][equals]=ACTIVE` |
| With products | `?populate=products&populate=assets.banners` |
| Time-based filter | `?where[release_date][less_than_equal]=2025-12-04&where[end_date][greater_than]=2025-12-04` |

---

### 2.4 Media Cards

**Endpoint:** `/api/media-cards`

```typescript
interface MediaCard {
  id: string;
  name?: string;
  media: string | Media;     // MUST populate to get URL
  tagged_products?: (string | Product)[];
  createdAt: string;
  updatedAt: string;
}
```

**Required:** Always use `?populate=media` to resolve the media URL.

---

## 3. Operational Collections

### 3.1 Orders

**Endpoint:** `/api/orders`

```typescript
interface Order {
  id: string;
  customer_info: {
    name: string;
    phone: string;
    address: string;
    delivery_area: 'Inside Dhaka' | 'Outside Dhaka';
    email?: string;
    notes?: string;
    delivery_timeframe?: 'Morning' | 'Afternoon' | 'Evening';
  };
  items: {
    item_type: 'existing_product' | 'one_time';
    name?: string;
    product?: string | Product;
    variant?: string | Variant;
    price: number;
    quantity: number;
  }[];
  total_amount: number;
  payment_method: 'COD' | 'BKASH';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  tracking?: {
    consignment_id?: number;
    tracking_code?: string;
    current_status?: string;
  };
  visitor_id?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Access Control:**
- **Customers:** Read-only with access token
- **Admins:** Full CRUD access

**Common Queries:**

| Use Case | Query |
|----------|-------|
| Pending orders | `?where[status][equals]=PENDING&sort=-createdAt` |
| By delivery area | `?where[customer_info.delivery_area][equals]=Inside Dhaka` |
| With product details | `?populate=items.product&populate=items.variant` |

---

### 3.2 Visits

**Endpoint:** `/api/visits`

```typescript
interface Visit {
  id: string;
  visitor_id: string;
  ip_address?: string;
  user_agent?: string;
  cart_snapshot?: unknown;   // Cart state at visit time
  createdAt: string;
  updatedAt: string;
}
```

**Access Control:**
- **Create (POST):** Public – enables anonymous tracking
- **Read (GET):** Admin only

**Note:** High-volume collection – always use `limit` and `page`.

---

### 3.3 Notifiers

**Endpoint:** `/api/notifiers`

```typescript
interface Notifier {
  id: string;
  contact_method: 'email' | 'phone';
  contact_value: string;
  context?: {
    drop_id?: string | Drop;
    product_id?: string | Product;
  };
  createdAt: string;
  updatedAt: string;
}
```

**Purpose:** Event triggers for notifications (drop alerts, restock requests).

---

## 4. Core Platform Collections

### 4.1 Pages

**Endpoint:** `/api/pages`

```typescript
interface Page {
  id: string;
  title: string;
  slug?: string;
  layout?: (ContentBlock | MediaBlock)[];
  _status?: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

interface ContentBlock {
  blockType: 'content';
  rich_text?: { root: { children: any[] } };
}

interface MediaBlock {
  blockType: 'media';
  media: string | Media;
  caption?: string;
  size?: 'full' | 'wide' | 'half';
}
```

**Deep Retrieval:** Use `?depth=2&populate=layout.media` to resolve nested media.

---

### 4.2 Users (Authentication)

**Endpoint:** `/api/users`

```typescript
interface User {
  id: string;
  email: string;
  loginAttempts?: number;
  lockUntil?: string;
  sessions?: {
    id: string;
    createdAt?: string;
    expiresAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

**Authentication Endpoints:**

| Operation | Method | Path | Body/Response |
|-----------|--------|------|---------------|
| **Login** | POST | `/api/users/login` | `{ email, password }` → User + Cookie |
| **Me** | GET | `/api/users/me` | Current user or `null` |
| **Logout** | POST | `/api/users/logout` | Clears session cookie |
| **Access** | GET | `/api/access` | Permissions object |

---

### 4.3 Media (File Uploads)

**Endpoint:** `/api/media`

```typescript
interface Media {
  id: string;
  url?: string;              // Direct file URL
  alt?: string;
  caption?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: { url: string; width: number; height: number };
    card?: { url: string; width: number; height: number };
  };
  createdAt: string;
  updatedAt: string;
}
```

**Upload (POST):** `multipart/form-data`

| Field | Content |
|-------|---------|
| `file` | Raw file data |
| `_payload` | JSON string: `{"alt": "...", "caption": "..."}` |

**Important:** Metadata MUST be JSON-stringified in `_payload` field.

---

## Quick Reference: Collection Endpoints

| Collection | Endpoint | Public Access |
|------------|----------|---------------|
| Products | `/api/products` | Read (with auth) |
| Variants | `/api/variants` | Read (with auth) |
| Drops | `/api/drops` | Read (with auth) |
| Media Cards | `/api/media-cards` | Read (with auth) |
| Orders | `/api/orders` | Token-based read |
| Visits | `/api/visits` | Create only |
| Notifiers | `/api/notifiers` | Create only |
| Pages | `/api/pages` | Read (published) |
| Users | `/api/users` | Auth endpoints |
| Media | `/api/media` | Read URLs |
