# Application Route Map

This file acts as the Sitemap and Route Definition for the Banglapunk Frontend.

## Core Routes

### Storefront
- **`/` (Home)**: The "Drop Portal".
  - **Features**: Current Drop Countdown, Hero Carousel, Upcoming Drop Teaser, "Explore" Masonry Feed.
  - **Spec**: `src/routes/#root.spec.md`

- **`/p` (Product Catalog)**: Full inventory browser.
  - **Features**: Sticky Search/Filter bar, Infinite Masonry Grid.
  - **Spec**: `src/routes/p/#product-catalog.spec.md`

- **`/p/[product]` (Product Details)**: Single item view.
  - **Features**: 3-Slot Gallery Rotation, Size Selector, "Suggested Pairings" Feed, Image Viewer Modal.
  - **Spec**: `src/routes/p/[product]/#product.spec.md`

- **`/d` (Drops Archive)**: Timeline of collections.
  - **Features**: Vertical scroll of Live, Upcoming, and Archived drop cards.
  - **Spec**: `src/routes/d/#drops.spec.md`

- **`/d/[drop]` (Drop Details)**: Immersive collection landing page.
  - **Features**: Drop Video, Narrative Text, Drop-specific Product Grid.
  - **Spec**: `src/routes/d/[drop]/#drop.spec.md`

### Commerce & Operations
- **`/checkout`**: Order creation.
  - **Features**: Delivery Form, Payment Selector (COD/bKash), Background Visitor Tracking.
  - **Spec**: `src/routes/checkout/#checkout.spec.md`

- **`/receipt/[orderId]`**: Post-purchase dashboard.
  - **Features**: Payment Guide (if Pending), Order Status, Identity Verification (for PII), Parcel Tracking.
  - **Spec**: `src/routes/receipt/[orderId]/#receipt.spec.md`

### Information & Support
- **`/contact`**: Centralized inquiry hub.
  - **Features**: Tabbed Interface (Sales, Admin, Tech), Dynamic Form Fields, Attachment Support.
  - **Spec**: `src/routes/contact/#contact.spec.md`

- **`/info`**: Static content hub.
  - **Features**: Tabbed Interface (Drops Explained, About Us, Policy, Team).
  - **Spec**: `src/routes/info/info.spec.md`

## API Endpoints (Backend)

### Drops & Products
- `GET /api/drops`: List all drops (filtered by status).
- `GET /api/drops/[slug]`: Get drop details.
- `GET /api/drops/[slug]/products`: Get products for a drop.
- `GET /api/products`: Main catalog fetch (supports search/pagination).
- `GET /api/products/[slug]`: Single product details.
- `GET /api/products/[slug]/related`: Suggested pairings.

### Orders & Analytics
- `POST /api/orders`: Create new order.
- `GET /api/orders/[orderId]`: Get order status (public/masked).
- `POST /api/orders/[orderId]/verify`: Unlock PII with SMS key.
- `GET /api/orders/[orderId]/tracking`: Proxy to Steadfast API.
- `POST /api/visits`: Track unique visitor on checkout load.

### Engagement
- `POST /api/notifications/subscribe`: "Notify Me" for upcoming drops.
- `POST /api/contact`: Submit contact form.
