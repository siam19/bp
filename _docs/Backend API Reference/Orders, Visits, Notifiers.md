```markdown
# Operational Data Reference

## Overview
This group includes collections focused on transactional records, user interaction logging, and internal system notifications. These collections often present complex challenges related to access control segmentation and data volume.

## 1. Orders
**Endpoint:** `/api/orders`
**Slug:** `orders`

The orders collection contains highly sensitive transactional data. Access control is strictly segmented between customers and administrators.

### Type Definition (Response Schema)
```typescript
export interface Order {
  id: string;
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
    product?: (string | null) | Product; // Expanded if ?populate=items.product
    /**
     * Select a variant
     */
    variant?: (string | null) | Variant; // Expanded if ?populate=items.variant
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
````

### Request & Response Behaviors

  * **Access Control Logic:**
      * **Customer:** Customers cannot update their orders but can read using special access token. 
      * **Administrator:** Unrestricted access to all records.
  * **Admin Reporting (`GET /api/orders`):**
      * **Request:** Admins rely on `sort` and `where` for dashboards.
          * *Example:* `?sort=-createdAt&where[status][equals]=PENDING` (Newest pending orders).
          * *Example:* `?where[customer_info][delivery_area][equals]=Inside Dhaka`.
  * **Relationship Expansion:**
      * **Request:** `GET /api/orders/:id?populate=items.product` to retrieve product details within the order items array.

-----

## 2\. Visits

**Endpoint:** `/api/visits`
**Slug:** `visits`

Designed for high-volume, potentially anonymous, analytical logging data (e.g., page views).

### Type Definition (Response Schema)

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

### Request & Response Behaviors

  * **Architectural Divergence:**
      * **Create (`POST /api/visits`):** Publicly accessible to enable anonymous tracking from client apps. High-throughput optimizations are applied server-side.
      * **Read (`GET /api/visits`):** Highly restricted. Reserved for administrative analysis.
  * **Data Volume:** Due to high volume, `limit` and `page` parameters are mandatory for any list retrieval.

-----

## 3\. Notifiers

**Endpoint:** `/api/notifiers`
**Slug:** `notifiers`

Manages event-driven data acting as triggers for external processes (email dispatch, webhooks).

### Type Definition (Response Schema)

```typescript
export interface Notifier {
  id: string;
  contact_method: 'email' | 'phone';
  contact_value: string;
  context?: {
    drop_id?: (string | null) | Drop;       // Expanded if ?populate=context.drop_id
    product_id?: (string | null) | Product; // Expanded if ?populate=context.product_id
  };
  updatedAt: string;
  createdAt: string;
}
```

### Request & Response Behaviors

  * **Lifecycle:**
      * **Create (`POST`):** Triggered by internal system events or custom endpoints.
      * **Read/Delete:** Reserved for internal monitoring and cleanup. Data is treated as ephemeral pending action fulfillment.
  * **Context:** The `context` field links the notification to a specific resource (Drop or Product), allowing the processor to fetch related data using `populate`.

<!-- end list -->
