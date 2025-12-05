### Universal REST Query Parameters (Quick Reference)

As a reminder, all `GET` endpoints below support the universal parameters detailed in the Global Context:

- `select`: Project specific fields (e.g., `?select[name]=true`).
- `populate`: Expand relationships (e.g., `?populate=media`).
- `where`: Filter data (e.g., `?where[price][greater_than]=50`).

---

### API Reference: Document 1 (E-commerce & Content)

# Document 1: E-commerce and Content Group Reference

## Overview
This group comprises core E-commerce data structures: Products, Variants, Drops, and Media Cards. Access generally requires authentication due to the "Secure by Default" posture[^2].

## 1. Products
**Endpoint:** `/api/products`  
**Slug:** `products`

The products collection serves as the central node for catalog management.

### Type Definition (Response Schema)
```typescript
export interface Product {
    id: string;
    name: string;
    slug?: string | null;
    price: number;
    status?: ('AVAILABLE' | 'UPCOMING' | 'UNAVAILABLE') | null;
    tags?: {
        tag?: string | null;
        id?: string | null;
    }[] | null;
    /**
     * Manage sizes and stock for this product.
     */
    variants?: {
        docs?: (string | Variant)[]; // Expanded if ?populate=variants
        hasNextPage?: boolean;
        totalDocs?: number;
    };
    /**
     * Manually pin related items.
     */
    related_products?: (string | Product)[] | null; // Expanded if ?populate=related_products
    images: {
        front: string | Media; // Expanded if ?populate=images.front
        back?: (string | null) | Media;
        profile?: (string | null) | Media;
    };
    description?: (
        | { blockType: 'text_block'; content?: string | null; [key: string]: unknown }
        | { blockType: 'image_block'; image?: (string | null) | Media; [key: string]: unknown }
    )[] | null;
    updatedAt: string;
    createdAt: string;
    _status?: ('draft' | 'published') | null;
}
```

### Request & Response Behaviors
- **List Optimization (`GET /api/products`):**
    - **Request:** Use `?select[name]=true&select[price]=true&select[slug]=true` to avoid fetching heavy `description` arrays or `tags`[^4].
    - **Response:** Returns a paginated list of `Product` objects containing only the selected fields.

- **Detail View (`GET /api/products/:id`):**
    - **Request:** Use `?populate=related_products&populate=images.front&depth=2`.
    - **Response:** Returns the full `Product` object. The `related_products` array and `images` fields will contain full objects instead of string IDs[^1].

---

## 2. Variants
**Endpoint:** `/api/variants`  
**Slug:** `variants`

Variants store relational data defining specific options (size, SKU, stock) for parent products.

### Type Definition (Response Schema)
```typescript
export interface Variant {
    id: string;
    /**
     * Auto-generated SKU (Product-Size)
     */
    sku?: string | null;
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'OS';
    /**
     * Physical inventory count.
     */
    stock_count: number;
    parent_product: string | Product; // Expanded if ?populate=parent_product
    updatedAt: string;
    createdAt: string;
}
```

### Request & Response Behaviors
- **Relationship:** Variants are typically retrieved as part of the `populate` operation on a parent **Product** document rather than queried directly[^1].
- **Write Operations:** Standard CRUD on variants is usually restricted to admin/inventory systems[^2].

---

## 3. Drops
**Endpoint:** `/api/drops`  
**Slug:** `drops`

Manages limited-time product launches. Interaction relies heavily on time-based logic.

### Type Definition (Response Schema)
```typescript
export interface Drop {
    id: string;
    name: string;
    status?: ('DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ARCHIVED') | null;
    slug?: string | null;
    release_date?: string | null;
    end_date?: string | null;
    /**
     * Select products to feature in this drop.
     */
    products?: (string | Product)[] | null;
    assets?: {
        banners?: (string | Media)[] | null;
        video_embed_url?: string | null;
    };
    updatedAt: string;
    createdAt: string;
}
```

### Request & Response Behaviors
- **Active Drop Filtering:**
    - **Request:** `GET /api/drops?where[release_date][less_than_equal]=NOW&where[end_date][greater_than]=NOW` (using ISO timestamps).
    - **Purpose:** Allows the client to determine visibility server-side without relying on client-side date checks[^1].

---

## 4. Media Cards
**Endpoint:** `/api/media-cards`  
**Slug:** `media-cards`

Presentation components acting as containers for media assets.

### Type Definition (Response Schema)
```typescript
export interface MediaCard {
    id: string;
    name?: string | null;
    media: string | Media; // Critical: Must populate to get URL
    /**
     * Tag products visible in this media.
     */
    tagged_products?: (string | Product)[] | null;
    updatedAt: string;
    createdAt: string;
}
```

### Request & Response Behaviors
- **Media Resolution:**
    - **Request:** `GET /api/media-cards/:id?populate=media`.
    - **Response:** The `media` field will expand from a string ID to a full `Media` object (including `url`, `alt`, `sizes`). Without `populate`, the client cannot display the image[^1].

---

## Works Cited

[^1]: [REST API | Documentation - Payload CMS](https://payloadcms.com/docs/rest-api/overview)
[^2]: [Access Control | Documentation - Payload CMS](https://payloadcms.com/docs/access-control/overview)
[^4]: [Select | Documentation - Payload CMS](https://payloadcms.com/docs/queries/select)

---
