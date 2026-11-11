# BanglaPunk Project Architecture & Technical Overview

> **Project Name:** BanglaPunk (`bp`)  
> **Brand Concept:** High-Concept Underground Streetwear & Limited Drops (Cyberpunk × Dhaka)  
> **Framework:** SvelteKit (Svelte 5 Runes) + Tailwind CSS v4 + Cloudflare Pages  
> **Backend Integration:** Payload CMS Headless API (with Standalone Offline Mock Engine)  
> **Documentation Methodology:** Granular Micro-Docs & Context Loading Hierarchy (`#` prefix standard)

---

## Table of Contents

1. [Executive Summary & Concept](#1-executive-summary--concept)
2. [The Documentation & Prototyping System](#2-the-documentation--prototyping-system)
3. [Architecture & Technical Stack](#3-architecture--technical-stack)
4. [Design System & Aesthetics (Stylekit)](#4-design-system--aesthetics-stylekit)
5. [Domain Data Models](#5-domain-data-models)
6. [Route Map & Page Specifications](#6-route-map--page-specifications)
7. [Component Registry](#7-component-registry)
8. [State Management (Svelte 5 Runes)](#8-state-management-svelte-5-runes)
9. [API Architecture & Backend Realignment](#9-api-architecture--backend-realignment)
10. [Offline Resurrection & Mock Engine](#10-offline-resurrection--mock-engine)
11. [Build & Verification Reference](#11-build--verification-reference)

---

## 1. Executive Summary & Concept

**BanglaPunk** is a mobile-first, high-concept streetwear e-commerce platform based in Dhaka, Bangladesh. Rather than adhering to conventional retail catalog conventions, the brand operates entirely around time-sensitive **"Drops"** (capsule collections):

* **Active Drop:** Current live collection available for immediate purchase with real-time countdown timers.
* **Scheduled Drop:** Upcoming teaser collection with notification capture ("Notify Me").
* **Archived Drops:** Vaulted historic collections preserved for brand heritage and visual culture.
* **Explore Feed:** Masonry layout combining apparel pieces with raw lifestyle photography and lookbook videos.
* **Bangladeshi Commerce Flows:** Tailored local logistics with **bKash Send Money** flows and Cash on Delivery (COD) via Steadfast Courier integration.

---

## 2. The Documentation & Prototyping System

The repository features a specialized, AI-assisted development workflow governed by `.github/instructions/#documents.instructions.md`.

### The Context Loading Hierarchy

```
Context Hierarchy
├── 1. Global Context (Always Active)
│   ├── src/#app.patterns.md          -> Architectural standards, Svelte 5 rune rules
│   ├── src/#app.stylekit.md          -> Design tokens, OKLCH palette, custom CSS effects
│   ├── src/#app.routes.md            -> Application sitemap & REST API mapping
│   ├── src/#app.components.md        -> Central UI component registry
│   └── src/lib/types.ts              -> Authoritative domain interfaces
│
├── 2. Subsystem Micro-Docs
│   ├── src/lib/server/#server.doc.md -> Server-side loader helpers and fetch wrappers
│   ├── src/lib/stores/#stores.doc.md -> Reactive store conventions
│   └── src/lib/utils/#utils.doc.md   -> Utility helpers and media formatters
│
└── 3. Local Route Context (Micro-Docs per src/routes/*)
    ├── #[pageName].layout.html       -> Standalone visual HTML/Tailwind prototype
    └── #[pageName].spec.md           -> Authoritative functional specification
```

### Purpose of `#[pageName].layout.html`
The `*.layout.html` files located alongside route folders are **fully self-contained, working single-file prototypes**. Each file bundles Tailwind via CDN, Lucide icons, web fonts, custom CSS animations, and pure client-side JavaScript. They allow designers and developers to interactively preview and fine-tune page structure and ergonomics prior to SvelteKit componentization.

### The Rule of Authority
* **`#[pageName].spec.md`** holds **functional authority**: data loading, validation, state mutations, and API contracts.
* **`#[pageName].layout.html`** holds **visual structure authority**: DOM hierarchy, nesting, and responsive breakpoints.
* **The "Placeholder" Rule**: Whenever a layout prototype contains a generic element corresponding to an existing component in `src/lib/components/site/`, it must be substituted with the modular Svelte component.

---

## 3. Architecture & Technical Stack

```
Frontend Architecture
┌─────────────────────────────────────────────────────────────┐
│                    SvelteKit Front-End                      │
│                                                             │
│   Svelte 5 Runes ($state, $derived, $effect, $props)        │
│   Tailwind CSS v4 + @tailwindcss/forms                      │
│   Bits UI (Radix-like primitives for Sheet / Dialog)        │
│   Lucide Svelte (Icons) + svelte-bricks (Masonry)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                Server Loaders (+page.server.ts)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Data Client Adapter                      │
│                    (src/lib/api/payload.ts)                 │
├──────────────────────────────┬──────────────────────────────┤
│  Offline Mock Engine         │  Payload CMS REST API        │
│  (src/lib/api/mock-data.ts)  │  (https://admin.../api)      │
│  [DEFAULT / STANDALONE]      │  [DISABLED / OPTIONAL]       │
└──────────────────────────────┴──────────────────────────────┘
                               │
               Cloudflare Pages Adapter Output
```

* **Runtime:** Bun / Node.js
* **Framework:** SvelteKit `^2.16` with Svelte `^5.0`
* **Build Tool:** Vite `^7.2`
* **Adapter:** `@sveltejs/adapter-cloudflare` (`wrangler.jsonc`)
* **Styling:** Tailwind CSS `^4.0` with `@plugin '@tailwindcss/forms'`

---

## 4. Design System & Aesthetics (Stylekit)

Derived from `src/#app.stylekit.md` and `src/routes/layout.css`:

### Color Palette (OKLCH Space)
* **Background:** `--bp-bg: oklch(17.086% 0.00334 17.166)` (`#050505` deep black)
* **Foreground:** `--bp-fg: oklch(100% 0.00011 271.152)` (pure white)
* **Destructive / Accent:** `--bp-destructive: oklch(0.577 0.245 27.325)` (crimson red)
* **Cards / Inset Panels:** `#161616` (card surface), `#1a1a1a` (input inset)
* **bKash Payment Brand Accent:** `#E2136E` (vibrant magenta-pink)

### Typography
* **Headings & Branding:** `"Jockey One"`, `"Akira Extended"` (superbold display)
* **Body Text:** `"Roboto Flex"` (optical variable sans-serif)
* **Numerics & Technical Data:** `"JetBrains Mono"`, monospace

### Signature Visual FX

1. **CRT Halftone Screen Overlay (`.halftone-overlay`):**
   ```css
   .halftone-overlay {
     position: fixed;
     inset: 0;
     pointer-events: none;
     z-index: 0;
     isolation: isolate;
     background-image: radial-gradient(
       circle at 0.8px 0.8px,
       rgba(53, 53, 53, 0.838) 0px,
       rgba(125, 125, 125, 0.8) 1px,
       transparent 2px
     );
     background-size: 10px 10px;
     mix-blend-mode: screen;
     opacity: 0.85;
     mask-image: linear-gradient(180deg, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.2) 80%);
   }
   ```

2. **Inverted Scoop Folder Tabs (`TabNavigation.svelte`):**
   Physical folder tabs that transition seamlessly into the parent card using inverted corner box-shadow pseudo-elements (`::before` and `::after`).

3. **Glassmorphism Panels (`.glass-panel`):**
   `background: rgba(27, 28, 27, 0.6); backdrop-filter: blur(8px);`

4. **Desynchronized Showcase Animation:**
   Rotates showcase slot 1 every 3000ms and slot 2 every 4500ms to avoid robotic synchronous flips.

---

## 5. Domain Data Models

Defined in `src/lib/types.ts`:

### Core Entities

```typescript
// Product Entity
export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: 'AVAILABLE' | 'UPCOMING' | 'UNAVAILABLE';
  featured?: boolean;
  tags?: string[];
  images: {
    front: ShopImage;
    back?: ShopImage;
    profile?: ShopImage;
  };
  variants: {
    id?: string;
    sku: string;
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'OS';
    stock_count: number;
  }[];
  related_products?: { id: string }[];
  description?: any[];
  size_guide?: string;
}

// Drop Entity
export interface ShopDrop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'ARCHIVED';
  release_date?: string;
  end_date?: string;
  products: ShopProduct[];
  assets?: {
    banners?: ShopImage[];
    video_embed_url?: string;
  };
}

// Media Card (Masonry Feed)
export interface ShopMediaCard {
  id: string;
  filename: string;
  height: number;
  width: number;
  tagged_products: { id: string; slug: string }[];
}

// Order & Receipt
export interface Order {
  id: string;
  client_order_id?: string | null;
  pin?: string | null;
  customer_info: {
    name: string;
    phone: string;
    address: string;
    delivery_area: 'Inside Dhaka' | 'Outside Dhaka';
    notes?: string | null;
    delivery_timeframe?: 'Morning' | 'Afternoon' | 'Evening' | null;
  };
  items: {
    item_type: 'existing_product' | 'one_time';
    name?: string | null;
    product?: Product | null;
    variant?: Variant | null;
    price: number;
    quantity: number;
  }[];
  total_amount: number;
  payment_method: 'COD' | 'BKASH';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  tracking?: {
    consignment_id?: number | null;
    tracking_code?: string | null;
    current_status?: string | null;
  };
}
```

---

## 6. Route Map & Page Specifications

| Route | Spec File | Prototype Layout | Primary Purpose & Mechanics |
| :--- | :--- | :--- | :--- |
| **`/`** | `#root.spec.md` | `#root.layout.html` | **The Drop Portal.** Hero carousel with crossfade, live countdown timer, 3-slot showcase rotation, next drop teaser with notify modal, horizontal drag archive, interleaved masonry feed. |
| **`/p`** | `#product-catalog.spec.md` | `#product-catalog.layout.html` | **Full Catalog.** Sticky search bar, drop collection filter chips, infinite scroll masonry grid. |
| **`/p/[product]`** | `#product.spec.md` | `#product.layout.html` | **Product Details.** 3-slot image gallery rotation with full-screen zoom modal, size selector, stock badge, Add-to-Cart drawer trigger, size guide modal, suggested pairings. |
| **`/d`** | `#drops.spec.md` | `#drops.layout.html` | **Drops Archive.** Vertical timeline of Live (pulsing red glow), Scheduled (dimmed), and Archived drops. |
| **`/d/[drop]`** | `#drop.spec.md` | `#drop.layout.html` | **Drop Landing Experience.** Video embed player with custom play/pause overlay, drop narrative, countdown, drop-specific products. |
| **`/checkout`** | `#checkout.spec.md` | N/A | **Order Execution.** Delivery information form (Dhaka inside/outside pricing), payment radio selector (COD vs bKash), client order ID generation, visitor tracking. |
| **`/receipt/[orderId]`** | `#receipt.spec.md` | `#receipt.layout.html` | **Order Dashboard.** View A: bKash Send Money instructions with one-click clipboard copying. View B: Order status timeline, items list, and locked PII/tracking sections requiring OTP/identity modal unlock. |
| **`/contact`** | `#contact.spec.md` | `#contact.layout.html` | **Department Inquiries.** Sales, Admin, Tech tabs with dynamic form fields (Sales: subject dropdown; Tech: screenshot upload), draft persistence via `localStorage`, 60-second rate limiter. |
| **`/info`** | `info.spec.md` | `#info.layout.html` | **Brand Knowledge Base.** Tabs for Drops Guide, Brand Manifesto, Shipping/Return Policies, and Crew/Team cards. |

---

## 7. Component Registry

### Site Components (`src/lib/components/site/`)
* **`Navbar.svelte`**: Sticky header with hamburger trigger, centered logo, and cart badge.
* **`CartSheet.svelte`**: Slide-over drawer with item cards, quantity mutators, order total, and checkout CTA.
* **`MobileMenuSheet.svelte`**: Left-side drawer for mobile route navigation.
* **`ProductCard.svelte`**: Product display with square aspect-ratio, multi-size badges, price tag, and hover elevation.
* **`MediaCard.svelte`**: Lifestyle card supporting images or looping muted video, hover overlay, and modal preview with tagged products.
* **`MasonryGrid.svelte`**: Dynamic Pinterest-style grid powered by `svelte-bricks` interleaving products and media.
* **`Countdown.svelte`**: Monospace live countdown timer (`Days : Hours : Mins : Secs`).
* **`DropCarousel.svelte`**: Hero banners with 5-second auto-rotation and crossfade transitions.
* **`DropShowcaseSlots.svelte`**: 3-grid product preview with desynchronized interval rotations.
* **`UpcomingDropBanner.svelte`**: Teaser banner for scheduled drops with notify modal trigger.
* **`PreviousDrops.svelte`**: Horizontal grab-and-drag snap scroll of vaulted collections.
* **`DropArchiveCard.svelte`**: Card with dynamic badges (`ACTIVE`, `SCHEDULED`, `ARCHIVED`).
* **`TabNavigation.svelte`**: Reusable folder tab component featuring inverted scoop corner curves.
* **`DropVideo.svelte`**: Responsive video player supporting YouTube embeds or direct MP4 playback.
* **`ProductSizeBox.svelte`**: Size indicator with available/out-of-stock styles.
* **`StatusBadge.svelte`**: Colored indicator pill for order and drop statuses.

### UI Primitives (`src/lib/components/ui/`)
* **`button/`**, **`input/`**, **`dialog/`**, **`sheet/`**: Accessible UI building blocks based on Bits UI / Radix design patterns.
* **`RichText.svelte`**: Lexical / block content renderer for descriptions.

---

## 8. State Management (Svelte 5 Runes)

State is organized using Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`):

### 1. Global Cart Store (`src/lib/stores/cart.svelte.ts`)
```typescript
class CartState {
  items = $state<CartItem[]>([]);

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  addItem(newItem: CartItem): void { ... }
  removeItem(variantId: string): void { ... }
  updateQuantity(variantId: string, quantity: number): void { ... }
}

export const cart = new CartState();
```
* **Persistence:** Auto-syncs to `localStorage['bp-cart']`.
* **Visitor Tracking:** Generates `visitor_id` and records cart snapshots on initial interaction.

### 2. UI Store (`src/lib/stores/ui.svelte.ts`)
Singleton managing slide-out states:
* `cartSheetOpen`: Controls `CartSheet.svelte` visibility.
* `mobileMenuOpen`: Controls `MobileMenuSheet.svelte` visibility.

---

## 9. API Architecture & Backend Realignment

### The Initial Payload CMS Strategy
The frontend was originally paired with a Payload CMS MongoDB instance hosted at `https://admin.banglapunk.com/api`. 

A specialized "Shop API v2.1" was designed (documented in `_docs/.notes/Shop API Documentation.md`) to serve optimized, flattened payloads (`ShopProduct`, `ShopDrop`, `ShopMediaCard`) to avoid payload bloat on mobile networks.

### Why the Backend Failed
As documented in `_docs/.notes/Architechtural Audit Results.md`, attempting to use flat schemas in Payload CMS created severe impedance mismatches:
1. Product options vs SKU variants: Lack of parent-child relational modeling caused stock overselling and variant pricing problems.
2. The remote deployment (`admin.banglapunk.com`) became unreachable, returning `404 Not Found`.
3. Client-side evaluation in `src/lib/api/payload.ts` failed on startup because `PUBLIC_API_URL` was unset, triggering `undefined.endsWith('/')`.

---

## 10. Offline Resurrection & Mock Engine

To restore the project without requiring any active Payload CMS server, the data layer has been updated to run standalone:

```
src/lib/api/payload.ts
  ├── Reads .env (PUBLIC_API_URL=/api)
  ├── Safe resolveBaseUrl() with fallbacks
  └── Embedded Mock Adapter (useMock: true)
         └── Feeds data directly from src/lib/api/mock-data.ts
```

### Mock Dataset Highlights (`src/lib/api/mock-data.ts`)
* **6 High-Concept Products:** Cyber Tee, Neon Acid Hoodie, Piuma Stealth Jacket, Tactical Cargo Pants, Glitch Matrix Sweatshirt, Monsoon Tactical Vest.
* **4 Full Drops:**
  * `genesis-drop` (ACTIVE – ending in 5 days, countdown live)
  * `neon-monsoons` (SCHEDULED – launching in 10 days)
  * `dhaka-underworld-vol-1` (ARCHIVED)
  * `cyber-rickshaw-legacy` (ARCHIVED)
* **5 Media Cards:** High-res lookbook photographs tagged with corresponding product IDs.
* **Full Brand Info Tabs:** "How Drops Work" guides, brand manifesto, return & shipping policies, and crew bios.
* **Interactive Receipt Portal:** Simulates PIN unlock verification (`key: '1234'`) and displays masked vs unmasked customer PII.

---

## 11. Build & Verification Reference

### Environment Setup
Create a `.env` in the root:
```env
PUBLIC_API_URL=/api
```

### Available Commands
```bash
# Typecheck with svelte-check
npm run check

# Start development server
npm run dev

# Production build for Cloudflare Pages
npm run build

# Preview production build locally
npm run preview
```

### Verification Status
* **`npm run check`:** 0 errors, 0 warnings.
* **`npm run build`:** All SSR pages compiled successfully with `@sveltejs/adapter-cloudflare`.
* **Dev Server Endpoints:** All 9 routes (`/`, `/p`, `/p/[product]`, `/d`, `/d/[drop]`, `/info`, `/contact`, `/checkout`, `/receipt/[orderId]`) return HTTP `200 OK`.
