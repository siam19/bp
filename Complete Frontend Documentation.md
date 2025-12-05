# Complete Frontend Documentation & Backend Handoff

This document outlines the frontend architecture, page logic, state management, and API integration points for the Banglapunk e-commerce application. It is intended to guide the backend engineer in connecting the SvelteKit frontend with the Payload CMS backend.

## Table of Contents
1. [Global Architecture](#global-architecture)
2. [State Management](#state-management)
3. [Page-by-Page Documentation](#page-by-page-documentation)
    - [Home (`/`)](#home-)
    - [Checkout (`/checkout`)](#checkout-checkout)
    - [Contact (`/contact`)](#contact-contact)
    - [Info (`/info`)](#info-info)
    - [Receipt (`/receipt/[orderId]`)](#receipt-receiptorderid)
4. [API Integration Points](#api-integration-points)

---

## Global Architecture

- **Framework**: SvelteKit (Svelte 5)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Svelte
- **Deployment**: Cloudflare Pages (Adapter Cloudflare)

---

## State Management

### Cart Store (`src/lib/stores/cart.svelte.ts`)
- **Type**: Svelte 5 Rune-based Singleton Class.
- **Persistence**: `localStorage` ('bp-cart').
- **Features**:
    - `items`: Array of `CartItem`.
    - `addItem(item)`: Adds or increments quantity.
    - `removeItem(variantId)`: Removes item.
    - `updateQuantity(variantId, qty)`: Updates quantity.
    - `total`: Derived getter for total price.
    - `itemCount`: Derived getter for total items.

---

## Page-by-Page Documentation

### Home (`/`)

**Purpose**: The main landing page featuring the "Active Drop" and "Upcoming Drop".

**Key Components**:
- `DropCarousel`: Hero slider for the active drop.
- `Countdown`: Timer counting down to `activeDrop.end_date`.
- `DropShowcaseSlots`: Grid showcasing products from the active drop.
- `MasonryGrid`: Infinite scroll-style grid for "Explore" content (Products + Media).

**Data Requirements (`+page.server.ts` needed)**:
- `activeDrop`: The single drop currently live.
- `upcomingDrop`: The next scheduled drop (for "Notify Me").
- `archivedDrops`: List of past drops.
- `exploreProducts`: Random/Featured products for the masonry grid.
- `exploreMedia`: Media assets for the masonry grid.

---

### Checkout (`/checkout`)

**Purpose**: Final step to collect delivery info and create an order.

**Logic**:
1. **Initialization**:
   - Generates a client-side `orderId` (e.g., `BP-1234-XM`) immediately on mount.
   - *Mock Action*: Logs "Unique Visitor created" to console.
2. **Form**:
   - Collects Name, Phone, Address (Required).
   - Collects Notes, Timeframe (Optional).
3. **Payment Selection**:
   - **COD**: Default.
   - **bKash**: Highlights pink.
4. **Submission**:
   - *Mock Action*: Simulates API POST to `/api/orders` with payload: `{ orderId, customer, payment, items, timestamp }`.
   - **Redirect**:
     - If COD -> `/receipt/[orderId]?status=confirmed`
     - If bKash -> `/receipt/[orderId]?status=pending`

**Backend Integration Needed**:
- **POST /api/visits**: Create a visitor record on page load.
- **POST /api/orders**: Create the actual order on form submit.

---

### Contact (`/contact`)

**Purpose**: Centralized hub for customer inquiries (Sales, Admin, Tech).

**Components**:
- `TabNavigation`: Reusable tab component with "scoop" visual effects.
- **Form**: Dynamic form that changes based on the active tab.

**Logic**:
1. **Tabs**: Sales, Admin, Tech.
2. **Dynamic Fields**:
   - **Sales**: Subject dropdown (Return, Cancel, Shipping, Other).
   - **Tech**: File upload for screenshots (instead of product search).
   - **Common**: Name, Phone/Email (conditional validation), Message.
3. **Features**:
   - **Draft Saving**: Persists form data to `localStorage` ('banglapunk_contact_draft').
   - **Rate Limiting**: Prevents submission if < 60s since last submit.
   - **Mock Submission**: Simulates 2s delay.

**Backend Integration Needed**:
- **POST /api/contact**: Endpoint to handle form submissions. Needs to accept file attachments (multipart/form-data).

---

### Info (`/info`)

**Purpose**: Static content page for brand information.

**Components**:
- `TabNavigation`: Same component as Contact page.

**Tabs**:
1. **Drops**: Explains the drop model.
2. **About**: Brand manifesto.
3. **Policy**: Returns, Shipping, Privacy.
4. **Team**: Team member list.

**Logic**:
- Purely presentational with tab switching.
- Uses `{#key activeTab}` for fade transitions.

---

### Receipt (`/receipt/[orderId]`)

**Purpose**: Post-purchase dashboard for payment instructions and order tracking.

**Views**:
1. **Pending Payment** (`?status=pending`):
   - Shows bKash payment instructions.
   - "Copy to Clipboard" for Phone Number and Order ID (Reference).
2. **Confirmed Receipt** (`?status=confirmed`):
   - Shows Order Status, Items, Total.
   - **Locked Sections**: "Deliver To", "Parcel Tracking", "Inquiry".
   - **Security**: Locked sections require "Identity Verification" (Phone + SMS Key) to unlock.

**Logic**:
- **Identity Verification**:
  - Modal prompts for Phone + Key.
  - *Mock Action*: Validates against hardcoded key '1234'.
  - On success, removes blur filters from locked sections.

**Backend Integration Needed**:
- **GET /api/orders/[id]**: Fetch order details (public/masked view).
- **POST /api/auth/verify-order**: Verify phone/key and return unmasked PII.
- **POST /api/auth/resend-key**: Resend OTP.

---

## API Integration Points

### 1. Visits & Tracking
- **Trigger**: `onMount` in `src/routes/checkout/+page.svelte`.
- **Endpoint**: `POST /api/visits`
- **Payload**: `{ cartItems, userAgent, timestamp }`

### 2. Order Creation
- **Trigger**: Form submit in `src/routes/checkout/+page.svelte`.
- **Endpoint**: `POST /api/orders`
- **Payload**: `{ orderId, customer, payment, items }`

### 3. Contact Form
- **Trigger**: Form submit in `src/routes/contact/+page.svelte`.
- **Endpoint**: `POST /api/contact`
- **Payload**: `FormData` (fields + optional file attachment).

### 4. Order Lookup & Security
- **Trigger**: Page load & Unlock action in `src/routes/receipt/[orderId]/+page.svelte`.
- **Endpoints**:
    - `GET /api/orders/:id` (Public/Masked)
    - `POST /api/auth/verify-order` (Unlock PII)

---

### Catalog & Archives

#### Drop Archive (`/d`)
- **Purpose**: Lists all drops (Live, Upcoming, Archived).
- **Component**: `DropArchiveCard`.
- **Data**: Requires `data.drops` array from server.

#### Product Catalog (`/p`)
- **Purpose**: Full product listing (fallback for non-drop browsing).
- **Component**: `MasonryGrid`.
- **Data**: Requires `data.products` array from server.

---
