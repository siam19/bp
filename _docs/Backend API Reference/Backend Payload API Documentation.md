# Backend Payload API Documentation
Version: 2.1

This documSentation outlines the API endpoints, request structures, and response types for the PayloadCMS backend.

## Base URL
All API endpoints are prefixed with `/api`.
Example: `https://your-domain.com/api/{collection-slug}`

## Image Delivery
All images are stored in Cloudflare R2.
**Base URL**: `https://payload.banglapunk.com`
**Format**: `https://payload.banglapunk.com/{filename}`

Example:
If a product image filename is `my-shirt.jpg`, the full URL is:
`https://payload.banglapunk.com/my-shirt.jpg`

## Configuration
- **Database**: MongoDB with Mongoose adapter
- **Storage**: Cloudflare R2 (S3-compatible) for media uploads
- **Editor**: Lexical Rich Text Editor
- **Image Processing**: Sharp
- **Connection Pooling**: 
  - Production: 2 connections (Vercel-optimized)
  - Development: 10 connections

## Authentication
The `users` collection is auth-enabled.

### Creating an Admin User (First Time)
Since most collections require authentication, you need to create an admin user first. You can do this through:

**Option 1: Admin Panel**
1. Navigate to `http://localhost:3000/admin`
2. Create your first user through the UI

**Option 2: Local API (Seed Script)**
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

await payload.create({
  collection: 'users',
  data: {
    email: 'admin@example.com',
    password: 'your-password',
  },
})
```

### Auth Endpoints
- **Login**: `POST /api/users/login`
  - Body: `{ "email": "admin@example.com", "password": "your-password" }`
  - Returns: `{ "token": "...", "user": {...}, "exp": 1234567890 }`
- **Logout**: `POST /api/users/logout`
- **Me**: `GET /api/users/me` (Get current user)
  - Returns: `{ "user": {...} }` or `{ "user": null }` if not authenticated
- **Refresh Token**: `POST /api/users/refresh-token`

### Using Authentication in Requests

**Generic HTTP Request:**
```http
# 1. Login and get token
POST /api/users/login HTTP/1.1
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}

# Response will contain "token"

# 2. Use token in subsequent requests
GET /api/products HTTP/1.1
Authorization: JWT <your-token-here>
```



## Access Control Summary
Most collections require authentication for write operations, but many allow public read access:

**Public Access (No Auth Required)**:
- **Public Read & Create**: None
- **Public Read Only**: `media`, `media-cards`
- **Public Create Only**: `contact-requests`, `notifiers`, `visits`

**Protected (Admin Only)**:
- **Requires Authentication**: `products`, `variants`, `drops`, `orders`, `users`
- **Write Operations**: All collections require admin authentication for create/update/delete (except the 3 public create collections)

## Shop API (Public)
These endpoints are optimized for the frontend shop experience. They return simplified JSON structures and handle complex logic like active drops and product availability.

### 1. Shop Products (`/api/shop/products`)
Returns a list of available products with simplified data.
**Method**: `GET`
**Query Params**:
- `limit` (optional): Number of items to return.
- `page` (optional): Page number.

**Response Example**:
```json
{
  "docs": [
    {
      "id": "...",
      "name": "Product Name",
      "slug": "product-slug",
      "price": 100,
      "status": "AVAILABLE",
      "images": {
        "front": { "filename": "img.jpg", "thumbnail": { "filename": "img-thumb.jpg" } }
      },
      "variants": [
        { "sku": "PROD-S", "size": "S", "stock_count": 10 }
      ]
    }
  ],
  "totalDocs": 10,
  "limit": 10,
  "totalPages": 1,
  "page": 1
}
```

### 2. Shop Single Product (`/api/shop/products/[slug]`)
Returns detailed information for a single product.
**Method**: `GET`
**Parameters**:
- `slug`: The product slug OR the product ID.

### 3. Shop Drops (`/api/shop/drops`)
Returns the currently active drop or upcoming drops.
**Method**: `GET`

**Response Example**:
```json
{
  "docs": [
    {
      "id": "...",
      "name": "Drop Name",
      "slug": "drop-slug",
      "status": "ACTIVE",
      "products": [
        {
          "id": "...",
          "name": "Product Name",
          "slug": "product-slug",
          "price": 100,
          "image": { "filename": "img.jpg" }
        }
      ]
    }
  ]
}
```

### 4. Shop Single Drop (`/api/shop/drops/[slug]`)
Returns details for a specific drop.
**Method**: `GET`
**Parameters**:
- `slug`: The drop slug OR the drop ID.

### 5. Shop Info Page (`/api/shop/info-page`)
Returns the content for the info page (policies, team, etc.).
**Method**: `GET`

### 6. Shop Media Cards (`/api/shop/media-cards`)
Returns a list of media cards with optimized data.
**Method**: `GET`
**Query Params**:
- `limit` (optional): Number of items to return (default 100).
- `page` (optional): Page number.

**Response Example**:
```json
{
  "docs": [
    {
      "id": "...",
      "filename": "image.jpg",
      "height": 800,
      "width": 600,
      "tagged_products": [
        { "id": "...", "slug": "product-slug" }
      ]
    }
  ],
  "totalDocs": 10,
  "limit": 100,
  "totalPages": 1,
  "page": 1
}
```

### 7. Shop Product Media Cards (`/api/shop/media-cards/[productId]`)
Returns all media cards tagged with a specific product.
**Method**: `GET`
**Parameters**:
- `productId`: The product slug OR the product ID.

**Response**: Same structure as `/api/shop/media-cards`.

## Standard Collections
Payload provides standard CRUD operations for all collections:
- `GET /api/{slug}` - List documents (supports filtering, sorting, pagination)
- `GET /api/{slug}/{id}` - Get a single document by ID
- `POST /api/{slug}` - Create a new document
- `PATCH /api/{slug}/{id}` - Update a document
- `DELETE /api/{slug}/{id}` - Delete a document

### Query Parameters (GET)
- `where`: Filter query (e.g., `?where[status][equals]=active`)
- `sort`: Sort by field (e.g., `?sort=-createdAt`)
- `limit`: Number of results per page
- `page`: Page number
- `depth`: Population depth for relationships (default: 1)

---

## Collections Reference

### 1. Products (`products`)
**Endpoint**: `/api/products`
**Versions**: Drafts enabled.
**Access**: Admin only (Use `/api/shop/products` for frontend)

```typescript
export interface Product {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  status?: ('AVAILABLE' | 'UPCOMING' | 'UNAVAILABLE') | null;
  featured?: boolean | null;
  tags?:
    | {
        tag?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * Manage sizes and stock for this product.
   */
  variants?: {
    docs?: (string | Variant)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  /**
   * Manually pin related items for the "Suggested Pairings" feed.
   */
  related_products?: (string | Product)[] | null;
  images: {
    front: string | Media;
    back?: (string | null) | Media;
    profile?: (string | null) | Media;
  };
  description?:
    | (
        | {
            content?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'text_block';
          }
        | {
            image?: (string | null) | Media;
            id?: string | null;
            blockName?: string | null;
            blockType: 'image_block';
          }
      )[]
    | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
```

### 2. Variants (`variants`)
**Endpoint**: `/api/variants`
**Access**: Admin only
**Hooks**: Auto-generates SKU on creation (format: {PRODUCT-SLUG}-{SIZE})

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
  parent_product: string | Product;
  updatedAt: string;
  createdAt: string;
}
```

### 3. Orders (`orders`)
**Endpoint**: `/api/orders`
**Access**: Admin only (requires authentication)
**Hooks**: Populates order items with product/variant details before saving

```typescript
export interface Order {
  id: string;
  client_order_id?: string | null;
  pin?: string | null;
  customer_info: {
    name: string;
    phone: string;
    address: string;
    delivery_area: 'Inside Dhaka' | 'Outside Dhaka';
    email?: string | null;
    notes?: string | null;
    delivery_timeframe?: ('Morning' | 'Afternoon' | 'Evening') | null;
  };
  items: {
    item_type: 'existing_product' | 'one_time';
    name?: string | null;
    /**
     * Select a product
     */
    product?: (string | null) | Product;
    /**
     * Select a variant
     */
    variant?: (string | null) | Variant;
    price: number;
    quantity: number;
    id?: string | null;
  }[];
  total_amount: number;
  payment_method: 'COD' | 'BKASH';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  tracking?: {
    consignment_id?: number | null;
    tracking_code?: string | null;
    current_status?: string | null;
  };
  visitor_id?: string | null;
  updatedAt: string;
  createdAt: string;
}
```

### 4. Drops (`drops`)
**Endpoint**: `/api/drops`
**Access**: Admin only (Use `/api/shop/drops` for frontend)
**Hooks**: Ensures only one drop can be ACTIVE at a time (ensureSingleActiveDrop)

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



### 5. Media Cards (`media-cards`)
**Endpoint**: `/api/media-cards`
**Access**: Public read, Admin write

```typescript
export interface MediaCard {
  id: string;
  name?: string | null;
  media: string | Media;
  /**
   * Tag products visible in this media.
   */
  tagged_products?: (string | Product)[] | null;
  updatedAt: string;
  createdAt: string;
}
```



### 6. Contact Requests (`contact-requests`)
**Endpoint**: `/api/contact-requests`
**Access**: Public Create (anyone can submit), Admin Read (only admins can view)

```typescript
export interface ContactRequest {
  id: string;
  name: string;
  contact_info: string;
  department: 'Sales' | 'Admin' | 'Tech';
  subject?: string | null;
  message?: string | null;
  attachments?: (string | Media)[] | null;
  status?: ('New' | 'In Progress' | 'Resolved') | null;
  updatedAt: string;
  createdAt: string;
}
```

### 7. Notifiers (`notifiers`)
**Endpoint**: `/api/notifiers`
**Access**: Public Create (anyone can subscribe)

```typescript
export interface Notifier {
  id: string;
  contact_method: 'email' | 'phone';
  contact_value: string;
  context?: {
    drop_id?: (string | null) | Drop;
    product_id?: (string | null) | Product;
  };
  updatedAt: string;
  createdAt: string;
}
```





### 8. Customer Messages (`customer-messages`)
**Endpoint**: `/api/customer-messages`
**Access**: Public Create (anyone can send), Admin Read

```typescript
export interface CustomerMessage {
  id: string;
  message: string;
  context?: {
    order_id?: string | null;
    visitor_id?: string | null;
  };
  sender_phone?: string | null;
  status?: ('New' | 'Read' | 'Replied') | null;
  updatedAt: string;
  createdAt: string;
}
```

---

## Globals Reference

### 1. Info Page (`info-page`)
**Endpoint**: `/api/globals/info-page`
**Access**: Public Read

```typescript
export interface InfoPage {
  tabs: {
    label: string;
    content: (
      | {
          sections?:
            | {
                title?: string | null;
                body?: string | null;
                image?: (string | null) | Media;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'generic_section';
        }
      | {
          policies?:
            | {
                title: string;
                content: string;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'policy_section';
        }
      | {
          members?:
            | {
                name: string;
                role: string;
                avatar: string | Media;
                id?: string | null;
              }[]
            | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'team_section';
        }
    )[];
    id?: string | null;
  }[];
}
```

### 2. Media (`media`)
**Endpoint**: `/api/media`
**Access**: Public read, Admin write
**Uploads**: Supports images and videos.
**Storage**: Cloudflare R2 (S3-compatible)
**Image Sizes**:
- `thumbnail`: 400x400 (smart crop, center position)
- `card`: 800px width (maintains aspect ratio)

```typescript
export interface Media {
  id: string;
  alt?: string | null;
  caption?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
```

**File Upload Endpoint**:
```
GET /api/media/file/{filename}
```



### 3. Visits (`visits`)
**Endpoint**: `/api/visits`
**Access**: Public Create (analytics tracking)

```typescript
export interface Visit {
  id: string;
  visitor_id: string;
  ip_address?: string | null;
  user_agent?: string | null;
  /**
   * Items in cart at time of visit start
   */
  cart_snapshot?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
```

### 4. Users (`users`)
**Endpoint**: `/api/users`
**Auth**: Enabled (provides login, logout, me, refresh-token endpoints)
**Access**: Admin only

```typescript
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  sessions?:
    | {
        id: string;
        createdAt?: string | null;
        expiresAt: string;
      }[]
    | null;
  password?: string | null;
}
```

---

## Custom Endpoints

### 1. Checkout
**Route**: `POST /api/checkout`
**Handler**: `checkoutHandler`
**Description**: Processes a new order checkout with atomic stock decrement using database transactions.
**Features**:
- Atomic stock decrement for all variants
- Transaction rollback on failure
- Automatic total calculation
- Visitor tracking integration

**Request Body**:
```json
{
  "items": [
    {
      "variantId": "VARIANT_ID",
      "quantity": 2,
      "price": 780
    }
  ],
  "customer": {
    "name": "John Doe",
    "phone": "01712345678",
    "address": "123 Main St, Dhaka",
    "delivery_area": "Inside Dhaka",
    "email": "john@example.com"
  },
  "visitor_id": "visitor_12345",
  "client_order_id": "ORD-12345-XYZ",
  "payment_method": "COD"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "orderId": "69308eef88b666112b825442",
  "pin": "1234"
}
```

**Error Response (400)**:
```json
{
  "error": "Variant 693021595799b51b8d910bb7 is Out of Stock"
}
```

**Notes**:
- Requires MongoDB Replica Set for transactions
- Falls back to non-transactional mode if transactions not supported
- Automatically validates stock availability before order creation
- Payment method defaults to 'COD'

### 2. Order Tracking
**Route**: `GET /api/orders/:orderId/tracking`
**Handler**: `trackingProxyHandler`
**Description**: Proxies request to Steadfast delivery provider to get real-time tracking info.
**Params**:
- `orderId`: The ID of the order to track.

**Success Response (Order has tracking code)**:
```json
{
  "delivery_status": "in_transit",
  "current_location": "Dhaka Hub",
  "estimated_delivery": "2025-12-05"
}
```

**Response (Order preparing)**:
```json
{
  "status": "Preparing"
}
```

**Error Response (400)**:
```json
{
  "error": "Missing orderId"
}
```

**Notes**:
- Requires `STEADFAST_API_KEY` and `STEADFAST_SECRET_KEY` environment variables
- Returns "Preparing" status if tracking code not yet assigned
- Proxies to Steadfast API: `https://portal.steadfast.com.bd/api/v1/status_by_trackingcode/{code}`

### 3. Verify Order
**Route**: `POST /api/orders/:orderId/verify`
**Handler**: `verifyOrderHandler`
**Description**: Verifies an order using phone number and verification key (last 4 digits or SMS code).
**Purpose**: Allows customers to view their order details without authentication.

**Params**:
- `orderId`: The ID of the order to verify.

**Request Body**:
```json
{
  "phone": "01712345678",
  "key": "5678"
}
```

**Success Response (200)**:
```json
{
  "verified": true,
  "customer": {
    "name": "John Doe",
    "phone": "01712345678",
    "address": "123 Main St, Dhaka",
    "delivery_area": "Inside Dhaka",
    "email": "john@example.com"
  },
  "tracking": {
    "consignment_id": 12345,
    "tracking_code": "SF123456",
    "current_status": "in_transit"
  }
}
```

**Error Response (403)**:
```json
{
  "error": "Invalid Credentials"
}
```

**Error Response (400)**:
```json
{
  "error": "Missing orderId"
}
```

**Validation Logic**:
- `key` must be the last 4 digits of the phone number
- `phone` must match the order's customer phone exactly
- Uses `overrideAccess: true` to bypass normal access control

### 4. Receipt
**Route**: `GET /api/receipt`
**Handler**: `receiptHandler`
**Description**: Retrieves order details for the receipt page. Supports both public (masked) and authenticated (full) views.

**Query Params**:
- `order_id`: The `client_order_id` of the order.

**Headers (Optional - for Auth)**:
- `x-auth-phone`: Customer's phone number.
- `x-auth-pin`: The 4-digit PIN associated with the order.

**Success Response (Public/Masked)**:
```json
{
  "authorized": false,
  "order": {
    "id": "...",
    "client_order_id": "...",
    "customer_info": {
      "name": "John Doe",
      "phone": "***********",
      "address": "*****************",
      "email": "*****@*****.***"
    },
    "items": [...],
    "status": "PENDING",
    "total_amount": 1500
  }
}
```

**Success Response (Authenticated)**:
```json
{
  "authorized": true,
  "order": {
    "id": "...",
    "client_order_id": "...",
    "pin": "1234",
    "customer_info": {
      "name": "John Doe",
      "phone": "01700000000",
      "address": "Full Address",
      "email": "john@example.com"
    },
    "items": [...],
    "status": "PENDING",
    "total_amount": 1500
  }
}
```

### 5. Contact (Multipart)
**Route**: `POST /api/contact`
**Handler**: `contactHandler`
**Description**: Handles contact form submissions with file attachments.

**Content-Type**: `multipart/form-data`

**Form Fields**:
- `name`: string
- `contact_info`: string
- `department`: 'Sales' | 'Admin' | 'Tech'
- `subject`: string
- `message`: string
- `files`: File[] (Optional)

**Success Response**:
```json
{
  "success": true,
  "id": "CONTACT_REQUEST_ID"
}
```

### 6. Resend Key
**Route**: `GET /api/resend-key`
**Handler**: `resendKeyHandler`
**Description**: Returns the public Resend key for frontend usage.

**Success Response**:
```json
{
  "key": "re_123456789"
}
```

### 7. Shop Products (Optimized)
**Route**: `GET /api/shop/products`
**Handler**: `shopProductsHandler`
**Description**: Returns a list of products with optimized JSON structure for the frontend shop.
**Query Params**:
- `page`: Page number (default: 1)
- `limit`: Number of results per page (default: 10)
- `where`: Filter query

**Success Response**:
```json
{
  "docs": [
    {
      "id": "693021285799b51b8d910b8d",
      "name": "Flaming Cozer",
      "slug": "flaming-cozer",
      "price": 780,
      "status": "AVAILABLE",
      "tags": ["crop", "linotype"],
      "related_products": [{ "id": "..." }],
      "images": {
        "front": {
          "filename": "image.jpg",
          "thumbnail": { "filename": "image-400x400.jpg" }
        },
        "back": { ... },
        "profile": { ... }
      },
      "description": [...],
      "variants": [
        { "sku": "FLAME-L", "size": "L", "stock_count": 200 }
      ],
      "featured": false
    }
  ],
  "totalDocs": 1,
  "limit": 10,
  "totalPages": 1,
  "page": 1
}
```

### 8. Shop Single Product (Optimized)
**Route**: `GET /api/shop/products/:slug`
**Handler**: `shopSingleProductHandler`
**Description**: Returns a single product with optimized JSON structure.

**Success Response**:
```json
{
  "id": "693021285799b51b8d910b8d",
  "name": "Flaming Cozer",
  "slug": "flaming-cozer",
  "price": 780,
  "status": "AVAILABLE",
  "tags": ["crop", "linotype"],
  "related_products": [{ "id": "..." }],
  "images": {
    "front": {
      "filename": "image.jpg",
      "thumbnail": { "filename": "image-400x400.jpg" }
    },
    "back": { ... },
    "profile": { ... }
  },
  "description": [...],
  "variants": [
    { "sku": "FLAME-L", "size": "L", "stock_count": 200 }
  ],
  "featured": false
}
```

### 9. Shop Drops (Optimized)
**Route**: `GET /api/shop/drops`
**Handler**: `shopDropsHandler`
**Description**: Returns a list of drops with optimized JSON structure.

**Success Response**:
```json
{
  "docs": [
    {
      "id": "...",
      "name": "Winter Collection",
      "slug": "winter-collection",
      "status": "ACTIVE",
      "release_date": "...",
      "end_date": "...",
      "products": [
        {
          "id": "...",
          "name": "Product Name",
          "slug": "product-slug",
          "price": 500,
          "status": "AVAILABLE",
          "image": { "filename": "front.jpg" }
        }
      ],
      "assets": {
        "banners": [
          { "filename": "banner.jpg", "thumbnail": { "filename": "banner-400x400.jpg" } }
        ],
        "video_embed_url": "..."
      }
    }
  ]
}
```

### 10. Shop Single Drop (Optimized)
**Route**: `GET /api/shop/drops/:slug`
**Handler**: `shopSingleDropHandler`
**Description**: Returns a single drop with optimized JSON structure.

**Success Response**:
```json
{
  "id": "...",
  "name": "Winter Collection",
  "slug": "winter-collection",
  "status": "ACTIVE",
  "release_date": "...",
  "end_date": "...",
  "products": [
    {
      "id": "...",
      "name": "Product Name",
      "slug": "product-slug",
      "price": 500,
      "status": "AVAILABLE",
      "image": { "filename": "front.jpg" }
    }
  ],
  "assets": {
    "banners": [
      { "filename": "banner.jpg", "thumbnail": { "filename": "banner-400x400.jpg" } }
    ],
    "video_embed_url": "..."
  }
}
```

### 11. Shop Info Page (Optimized)
**Route**: `GET /api/shop/info`
**Handler**: `shopInfoPageHandler`
**Description**: Returns the info page content with optimized JSON structure.

**Success Response**:
```json
{
  "tabs": [
    {
      "label": "About Us",
      "content": [
        {
          "type": "generic",
          "sections": [
            {
              "title": "Our Story",
              "body": "We are...",
              "image": { "filename": "story.jpg" }
            }
          ]
        }
      ]
    },
    {
      "label": "Policy",
      "content": [
        {
          "type": "policy",
          "policies": [
            { "title": "Return Policy", "content": "..." }
          ]
        }
      ]
    }
  ]
}
```

---

## API Response Examples

### Public Endpoints (No Auth Required)

#### Create Contact Request
**Request:**
```http
POST /api/contact-requests HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "contact_info": "john@example.com",
  "department": "Sales",
  "subject": "Product Inquiry",
  "message": "I'd like to know more about your products"
}
```

**Response:**
```json
{
  "doc": {
    "createdAt": "2025-12-03T19:26:23.788Z",
    "updatedAt": "2025-12-03T19:26:23.788Z",
    "name": "Test User",
    "contact_info": "test@example.com",
    "department": "Sales",
    "subject": "Test",
    "message": "Hello",
    "status": "New",
    "id": "69308edf88b666112b82543e"
  },
  "message": "Contact Request successfully created."
}
```

#### Create Notifier
**Request:**
```http
POST /api/notifiers HTTP/1.1
Content-Type: application/json

{
  "contact_method": "email",
  "contact_value": "notify@example.com",
  "context": {}
}
```

**Response:**
```json
{
  "doc": {
    "createdAt": "2025-12-03T19:26:32.728Z",
    "updatedAt": "2025-12-03T19:26:32.728Z",
    "contact_method": "email",
    "contact_value": "notify@example.com",
    "context": {},
    "id": "69308ee888b666112b825440"
  },
  "message": "Notifier successfully created."
}
```

#### Create Visit
**Request:**
```http
POST /api/visits HTTP/1.1
Content-Type: application/json

{
  "visitor_id": "visitor_12345",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0",
  "cart_snapshot": {
    "items": []
  }
}
```

**Response:**
```json
{
  "doc": {
    "createdAt": "2025-12-03T19:26:39.407Z",
    "updatedAt": "2025-12-03T19:26:39.408Z",
    "visitor_id": "visitor_12345",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0",
    "cart_snapshot": {
      "items": []
    },
    "id": "69308eef88b666112b825442"
  },
  "message": "Visit successfully created."
}
```

### Auth Endpoints

#### Get Current User (Unauthenticated)
**Request:**
```http
GET /api/users/me HTTP/1.1
```

**Response:**
```json
{
  "user": null,
  "message": "Account"
}
```

### Protected Endpoints (Auth Required)

All other collections (`products`, `variants`, `orders`, `drops`, `media`, `media-cards`) return:

**Response (403 Forbidden):**
```json
{
  "errors": [
    {
      "message": "You are not allowed to perform this action."
    }
  ]
}
```

To access these endpoints, you must first authenticate and include the JWT token in the `Authorization` header.

---

## Authenticated API Examples

### Login and Get Token
**Request:**
```http
POST /api/users/login HTTP/1.1
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "692f727ebd8b8c5ded3f410f",
    "email": "admin@example.com",
    "createdAt": "2025-12-03T...",
    "updatedAt": "2025-12-03T..."
  },
  "exp": 1764797398
}
```

### Get All Products (Authenticated)
**Request:**
```http
GET /api/products HTTP/1.1
Authorization: JWT <your-token-here>
```

**Response (truncated for brevity):**
```json
{
  "docs": [
    {
      "id": "693021285799b51b8d910b8d",
      "createdAt": "2025-12-03T11:38:16.704Z",
      "updatedAt": "2025-12-03T11:39:21.845Z",
      "name": "Flaming Cozer",
      "slug": "flaming-cozer",
      "price": 780,
      "status": "AVAILABLE",
      "tags": [],
      "images": {
        "front": {
          "id": "693021185799b51b8d910b76",
          "filename": "cd6e1a674ac591b58bc321b3f013e337.jpg",
          "mimeType": "image/jpeg",
          "filesize": 52164,
          "width": 735,
          "height": 571,
          "url": "/api/media/file/cd6e1a674ac591b58bc321b3f013e337.jpg",
          "thumbnailURL": "/api/media/file/cd6e1a674ac591b58bc321b3f013e337-400x400.jpg",
          "sizes": {
            "thumbnail": {
              "width": 400,
              "height": 400,
              "url": "/api/media/file/cd6e1a674ac591b58bc321b3f013e337-400x400.jpg"
            }
          }
        }
      },
      "description": [],
      "_status": "published",
      "related_products": [
        {
          "id": "693020e05799b51b8d910b28",
          "name": "Crop Top",
          "slug": "crop-top",
          "price": 400,
          "status": "AVAILABLE"
        }
      ],
      "variants": {
        "docs": [
          {
            "id": "693021595799b51b8d910bb7",
            "sku": "FLAME-L",
            "size": "L",
            "stock_count": 200
          }
        ],
        "hasNextPage": false
      }
    }
  ],
  "totalDocs": 3,
  "limit": 10,
  "totalPages": 1,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

### Get Single Product by ID
**Request:**
```http
GET /api/products/693020a25799b51b8d910a97 HTTP/1.1
Authorization: JWT <your-token-here>
```

**Response:**
```json
{
  "id": "693020a25799b51b8d910a97",
  "createdAt": "2025-12-03T11:36:02.346Z",
  "updatedAt": "2025-12-03T11:36:16.257Z",
  "name": "Flower Shirt",
  "slug": "flower-shirt",
  "price": 5000,
  "status": "AVAILABLE",
  "tags": [],
  "images": {
    "front": {
      "id": "693020715799b51b8d910a52",
      "filename": "4b7fd00bdf947f8f3774e467807f0b06.jpg",
      "url": "/api/media/file/4b7fd00bdf947f8f3774e467807f0b06.jpg",
      "thumbnailURL": "/api/media/file/4b7fd00bdf947f8f3774e467807f0b06-400x400.jpg"
    },
    "back": {
      "id": "6930207f5799b51b8d910a68",
      "filename": "afdab4e98e4c4120c3cee7b9cb34eb83.jpg",
      "url": "/api/media/file/afdab4e98e4c4120c3cee7b9cb34eb83.jpg"
    }
  },
  "description": [
    {
      "blockType": "text_block",
      "content": "Yoo this is a product yummy\n",
      "id": "693020229d87d6e0bb7d0eb1"
    },
    {
      "blockType": "image_block",
      "image": {
        "id": "693020915799b51b8d910a7f",
        "url": "/api/media/file/a447f9fbebd579a163a7cbda7092a0a3.jpg"
      },
      "id": "693020879d87d6e0bb7d0eb3"
    }
  ],
  "_status": "published",
  "variants": {
    "docs": [],
    "hasNextPage": false
  }
}
```

### Get All Variants
**Request:**
```http
GET /api/variants HTTP/1.1
Authorization: JWT <your-token-here>
```

**Response:**
```json
{
  "docs": [
    {
      "id": "693021595799b51b8d910bb7",
      "createdAt": "2025-12-03T11:39:05.490Z",
      "updatedAt": "2025-12-03T11:39:05.490Z",
      "sku": "FLAME-L",
      "size": "L",
      "stock_count": 200,
      "parent_product": {
        "id": "693021285799b51b8d910b8d",
        "name": "Flaming Cozer",
        "slug": "flaming-cozer",
        "price": 780,
        "status": "AVAILABLE"
      }
    }
  ],
  "totalDocs": 1,
  "limit": 10,
  "totalPages": 1,
  "page": 1
}
```

### Get All Drops
**Request:**
```http
GET /api/drops HTTP/1.1
Authorization: JWT <your-token-here>
```

**Response:**
```json
{
  "docs": [
    {
      "id": "693021875799b51b8d910bf6",
      "createdAt": "2025-12-03T11:39:51.321Z",
      "updatedAt": "2025-12-03T11:39:51.322Z",
      "name": "AHLELE",
      "status": "DRAFT",
      "release_date": "2025-12-10T18:00:00.000Z",
      "end_date": "2025-12-24T18:00:00.000Z",
      "products": [
        {
          "id": "693020a25799b51b8d910a97",
          "name": "Flower Shirt",
          "slug": "flower-shirt",
          "price": 5000
        },
        {
          "id": "693020e05799b51b8d910b28",
          "name": "Crop Top",
          "price": 400
        },
        {
          "id": "693021285799b51b8d910b8d",
          "name": "Flaming Cozer",
          "price": 780
        }
      ],
      "assets": {
        "banners": [
          {
            "id": "693021805799b51b8d910bed",
            "filename": "Gemini_Generated_Image_8uyh588uyh588uyh.png",
            "url": "/api/media/file/Gemini_Generated_Image_8uyh588uyh588uyh.png",
            "thumbnailURL": "/api/media/file/Gemini_Generated_Image_8uyh588uyh588uyh-400x400.png"
          }
        ]
      }
    }
  ],
  "totalDocs": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Get All Media
**Request:**
```http
GET /api/media HTTP/1.1
Authorization: JWT <your-token-here>
```

**Response:**
```json
{
  "docs": [
    {
      "id": "693021805799b51b8d910bed",
      "createdAt": "2025-12-03T11:39:44.902Z",
      "filename": "Gemini_Generated_Image_8uyh588uyh588uyh.png",
      "mimeType": "image/png",
      "filesize": 1593810,
      "width": 1024,
      "height": 1024,
      "url": "/api/media/file/Gemini_Generated_Image_8uyh588uyh588uyh.png",
      "thumbnailURL": "/api/media/file/Gemini_Generated_Image_8uyh588uyh588uyh-400x400.png",
      "sizes": {
        "thumbnail": {
          "width": 400,
          "height": 400,
          "url": "/api/media/file/Gemini_Generated_Image_8uyh588uyh588uyh-400x400.png"
        },
        "card": {
          "width": 800,
          "height": 800,
          "url": "/api/media/file/Gemini_Generated_Image_8uyh588uyh588uyh-800x800.png"
        }
      }
    }
  ],
  "totalDocs": 7,
  "limit": 10,
  "totalPages": 1
}
```

### Get All Orders
**Request:**
```http
GET /api/orders HTTP/1.1
Authorization: JWT <your-token-here>
```

**Response (empty collection):**
```json
{
  "docs": [],
  "totalDocs": 0,
  "limit": 10,
  "totalPages": 1,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```
