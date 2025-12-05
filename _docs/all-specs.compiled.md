# Banglapunk Frontend - Complete Page Specifications

> **Compiled Document**: All `*.spec.md` files consolidated for reference.  
> **Last Updated**: December 4, 2025

---

## Table of Contents

1. [Home Page (`/`)](#1-home-page-)
2. [Product Catalog (`/p`)](#2-product-catalog-p)
3. [Product Detail (`/p/[product]`)](#3-product-detail-pproduct)
4. [Drops Archive (`/d`)](#4-drops-archive-d)
5. [Drop Detail (`/d/[drop]`)](#5-drop-detail-ddrop)
6. [Info Page (`/info`)](#6-info-page-info)
7. [Contact Page (`/contact`)](#7-contact-page-contact)
8. [Checkout Page (`/checkout`)](#8-checkout-page-checkout)
9. [Receipt Page (`/receipt/[orderId]`)](#9-receipt-page-receiptorderid)

---

## 1. Home Page (`/`)

**Purpose**: Mobile-first e-commerce storefront built around time-sensitive "Drops".

### Core Systems

| System | Description |
|--------|-------------|
| **Current Drop** | Active collection with countdown timer |
| **Upcoming Drop** | Teaser with "Notify Me" signup |
| **Previous Drops** | Archive of past collections (locked/sold out) |

### Key Components

| Component | Behavior |
|-----------|----------|
| **Navbar** | Sticky header with gradient fade, hamburger menu, cart badge |
| **DropCarousel** | Auto-rotating hero (4s interval), crossfade transitions |
| **Countdown** | Live timer updating every 1000ms |
| **DropShowcaseSlots** | 3-grid with async rotation (3s/4.5s per slot) |
| **UpcomingDropBanner** | Triggers NotifyModal on click |
| **NotifyModal** | Email/phone capture with backdrop blur |
| **PreviousDrops** | Horizontal scroll with drag-to-scroll |
| **MasonryGrid** | Mixed Product + Media cards (columns-2) |

---

## 2. Product Catalog (`/p`)

**Purpose**: Browse all products regardless of drop association.

### Layout

- **Sticky Search/Filter Bar**: Search input + dynamic drop filter chips
- **Product Grid**: 2-column masonry with ProductCards
- **Prioritization**: Grid renders first, filters load async

### Product Card

- Light gray bg (#e5e5e5) with `mix-blend-multiply` images
- Displays: Title, Price (BDT), Size badges
- Links to `/p/[slug]`

---

## 3. Product Detail (`/p/[product]`)

**Purpose**: Single product view with purchase controls.

### Components

| Section | Features |
|---------|----------|
| **Gallery** | 3-slot grid, auto-rotation (5s), click opens modal |
| **Product Info** | Title, Price, Size selector, Quantity widget |
| **Add to Cart** | Full-width CTA button |
| **Suggested Pairings** | Masonry grid with related products + media |

### Modals

- **Image Viewer**: Full-screen with prev/next navigation
- **Size Guide**: Light-themed overlay with size chart

---

## 4. Drops Archive (`/d`)

**Purpose**: Visual timeline of all brand collections.

### Card Types

| Status | Badge | Visual Treatment |
|--------|-------|------------------|
| **Live** | "LIVE NOW" (pulsing) | Red border/shadow, countdown text |
| **Upcoming** | "UPCOMING" | Greyscale, dimmed |
| **Archived** | "ARCHIVED" | Low opacity, muted |

### Layout

- Vertical scroll of 16:9 aspect-ratio cards
- Each card links to `/d/[drop-slug]`

---

## 5. Drop Detail (`/d/[drop]`)

**Purpose**: Immersive landing page for a specific collection.

### Sections

| Section | Description |
|---------|-------------|
| **Hero Carousel** | Auto-rotating banners (4s crossfade) |
| **Countdown** | Shows time until release OR end date |
| **Drop Info** | Name + description narrative |
| **Drop Video** | Tap to play/pause, custom overlay |
| **Product Grid** | 2-column masonry with Products + Media |

---

## 6. Info Page (`/info`)

**Purpose**: Central hub for brand static content.

### Tab System (4 Tabs)

| Tab | Content |
|-----|---------|
| **Drops** | "How Drops Work" explainer |
| **About Us** | Brand manifesto (Cyberpunk x Dhaka) |
| **Policy** | Returns, Shipping, Privacy, ToS |
| **Team** | Team member cards with avatars |

### Styling

- Folder-tab visual metaphor with scoop effects
- Corner morphing based on active tab
- Footer with creator credit (Bastok → Instagram)

---

## 7. Contact Page (`/contact`)

**Purpose**: Department-routed inquiry form.

### Tab System (3 Departments)

| Department | Subject Field | Attachment |
|------------|---------------|------------|
| **Sales** | Dropdown (Return, Cancel, Shipping, Other) | Product/Drop search |
| **Admin** | Text input | Product/Drop search |
| **Tech** | Text input | Screenshot upload |

### Form Features

- Phone/Email: At least one required (dynamic "Optional" badge)
- Message: 2000 char limit with live counter
- Rate limiting: 60s between submissions
- Draft persistence via localStorage

### Submission States

- Loading: "SENDING..." with reduced opacity
- Success: "Thank you" → redirect to home (3s)
- Error: Rate limit message

---

## 8. Checkout Page (`/checkout`)

**Purpose**: Final purchase step with order creation.

### Lifecycle

1. **Load**: Generate Order ID, create Visit record (background)
2. **Tracking**: User interactions logged regardless of conversion
3. **Submit**: Visitor → Customer promotion, Order created

### Form Fields

| Required | Optional |
|----------|----------|
| Receiver Name | Delivery Notes |
| Receiver Phone | Timeframe (Morning/Afternoon/Evening) |
| Receiver Address | |

### Payment Options

| Method | Redirect |
|--------|----------|
| **COD** | `/receipt/[id]?status=confirmed` |
| **bKash** | `/receipt/[id]?status=pending` |

---

## 9. Receipt Page (`/receipt/[orderId]`)

**Purpose**: Post-purchase dashboard with two views.

### View A: Pending Payment (bKash)

**Condition**: `payment_method=BKASH && status=PENDING`

| Element | Content |
|---------|---------|
| Step 1 | "Go to Send Money" |
| Target Number | `01533817247` with Copy button |
| Step 2 | "Use Order ID as Reference" |
| Order ID | Display with Copy button |
| Notice | "Important!!" warning |
| Footer | "You will receive SMS with link" |

### View B: Standard Receipt

**Condition**: COD orders or verified bKash

| Section | Access |
|---------|--------|
| Status | Open (Pending → Delivered timeline) |
| Deliver To | Locked (requires identity verification) |
| Parcel Tracking | Locked (Steadfast API) |
| Items | Open (product list + total) |
| Inquiry | Locked (direct messaging) |

### Security

- PII protected behind Identity Modal (Phone + SMS Key)
- Public URL access with token-based verification

---

## Shared Components Reference

| Component | Used In |
|-----------|---------|
| `Navbar` | All pages |
| `CartSheet` | Global (triggered from Navbar) |
| `ProductCard` | Home, Catalog, Product Detail, Drop Detail |
| `MediaCard` | Home, Product Detail, Drop Detail |
| `MasonryGrid` | Home, Catalog, Product Detail, Drop Detail |
| `Countdown` | Home, Drop Detail |
| `DropCarousel` | Home, Drop Detail |

---

## Design Constants

| Token | Value |
|-------|-------|
| Primary Background | `#000000` (black) |
| Card Background | `#161616` |
| Input Background | `#1a1a1a` |
| Product Image BG | `#e5e5e5` |
| bKash Brand Color | `#E2136E` |
| Max Content Width | `max-w-md` (mobile-first) |
