# Shop API Documentation

This documentation outlines the public-facing "Shop" API endpoints designed for the frontend. These endpoints return optimized, simplified JSON structures compared to the standard Payload CMS API.

## Base URL 
All endpoints are prefixed with `/api/shop`.

---

## Endpoints

### 1. Get All Products
**Endpoint**: `/api/shop/products`
**Method**: `GET`
**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `where` (optional): Filter query (standard Payload syntax)

**Response**:
```typescript
interface ProductsResponse {
  docs: ShopProduct[];
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

interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: 'AVAILABLE' | 'UPCOMING' | 'UNAVAILABLE';
  featured?: boolean;
  tags: string[];
  related_products: { id: string }[];
  images: {
    front?: OptimizedImage;
    back?: OptimizedImage;
    profile?: OptimizedImage;
  };
  size_guide?: OptimizedImage;
  description: any[]; // Lexical/Block content
  variants: {
    sku: string;
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'OS';
    stock_count: number;
  }[];
}
```

### 2. Get Single Product
**Endpoint**: `/api/shop/products/[slug]`
**Method**: `GET`
**Parameters**:
- `slug`: The product slug OR the product ID.

**Response**:
Returns a single `ShopProduct` object (see above).

### 3. Get Drops
**Endpoint**: `/api/shop/drops`
**Method**: `GET`
**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `where` (optional): Filter query

**Response**:
```typescript
interface DropsResponse {
  docs: ShopDrop[];
  // ... pagination fields
}

interface ShopDrop {
  id: string;
  name: string;
  slug: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ARCHIVED';
  release_date?: string;
  end_date?: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    status: string;
    image?: { filename: string };
  }[];
  assets: {
    banners: OptimizedImage[];
    video_embed_url?: string;
  };
}
```

### 4. Get Single Drop
**Endpoint**: `/api/shop/drops/[slug]`
**Method**: `GET`
**Parameters**:
- `slug`: The drop slug OR the drop ID.

**Response**:
Returns a single `ShopDrop` object (see above).

### 5. Get Info Page
**Endpoint**: `/api/shop/info-page`
**Method**: `GET`

**Response**:
```typescript
interface InfoPageResponse {
  tabs: {
    label: string;
    content: (GenericSection | PolicySection | TeamSection)[];
  }[];
}

interface GenericSection {
  type: 'generic';
  sections: {
    title?: string;
    body?: string; // HTML or text
    image?: OptimizedImage;
  }[];
}

interface PolicySection {
  type: 'policy';
  policies: {
    title: string;
    content: string; // HTML or text
  }[];
}

interface TeamSection {
  type: 'team';
  members: {
    name: string;
    role: string;
    avatar?: OptimizedImage;
  }[];
}
```

### 6. Get Media Cards
**Endpoint**: `/api/shop/media-cards`
**Method**: `GET`
**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of items per page (default: 100)

**Response**:
```typescript
interface MediaCardsResponse {
  docs: ShopMediaCard[];
  // ... pagination fields
}

interface ShopMediaCard {
  id: string;
  filename: string;
  height: number;
  width: number;
  tagged_products: {
    id: string;
    slug: string;
  }[];
}
```

### 7. Get Product Media Cards
**Endpoint**: `/api/shop/media-cards/[productId]`
**Method**: `GET`
**Parameters**:
- `productId`: The product slug OR the product ID.

**Response**:
Returns a `MediaCardsResponse` (see above) containing only media cards tagged with the specified product.
