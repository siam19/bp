# Banglapunk Frontend - Implementation Checklist

> **Project Status Dashboard**  
> Last Updated: December 4, 2025  
> Current Phase: Foundation Setup

---

## 📊 Project Overview

### Current State Analysis
- ✅ **Types System**: Fully defined in `src/lib/types.ts`
- ✅ **API Client**: Payload client implemented in `src/lib/api/payload.ts`
- ✅ **Route Structure**: All route folders exist with spec files
- ⚠️ **Components**: Component directory doesn't exist yet (`src/lib/components/`)
- ⚠️ **Pages**: All pages show default SvelteKit scaffold
- ❌ **State Management**: No cart store or global state yet
- ❌ **UI Components**: No reusable components built

### Implementation Strategy
- **Phase 0**: Foundation & Infrastructure (Components, State, Utils)
- **Phase 1**: Core Components & Navigation
- **Phase 2**: Product Browsing (Catalog, Product Detail)
- **Phase 3**: Drop System (Home, Drops Archive, Drop Detail)
- **Phase 4**: Commerce Flow (Checkout, Receipt)
- **Phase 5**: Information Pages (Info, Contact)
- **Phase 6**: Polish & Optimization

---

## PHASE 0: FOUNDATION & INFRASTRUCTURE ✅

### 0.1 Project Structure Setup ✅
- [x] Create `src/lib/components/` directory structure
  - [x] Create `src/lib/components/site/` (reusable components)
  - [x] Create `src/lib/components/ui/` (primitives/shadcn)
- [x] Create `src/lib/stores/` directory
- [x] Create `src/lib/utils/` directory for helpers

### 0.2 State Management ✅
- [x] **Cart Store** (`src/lib/stores/cart.svelte.ts`)
  - [x] Implement `CartState` class using `$state` rune
  - [x] Add `items`, `total`, `itemCount` properties
  - [x] Implement `addItem()`, `removeItem()`, `updateQuantity()`, `clear()`
  - [x] Add localStorage persistence with `$effect`
  - [x] Export singleton instance
- [x] **UI State Store** (optional global modals)
  - [x] Cart sheet open/closed state
  - [x] Mobile menu state

### 0.3 Utility Functions ✅
- [x] **String Utilities** (`src/lib/utils/string.ts`)
  - [x] `generateOrderId()` - alphanumeric ID generator
  - [x] `truncate()` - text truncation
- [x] **Date Utilities** (`src/lib/utils/date.ts`)
  - [x] `calculateCountdown()` - days/hours/mins/secs calculator
  - [x] `formatDate()` - locale-aware date formatting
- [x] **Array Utilities** (`src/lib/utils/array.ts`)
  - [x] `shuffle()` - Fisher-Yates shuffle for masonry
  - [x] `interleave()` - merge products + media cards

### 0.4 API Integration Helpers ✅
- [x] **Server-Side Fetch Wrapper** (`src/lib/server/api.ts`)
  - [x] Export server-side `payloadClient` with fetch from `event`
  - [x] Error handling utilities for `load` functions
- [x] **Type Guards** (`src/lib/utils/guards.ts`)
  - [x] `isProduct()`, `isMediaAsset()`, `isVariant()` type checkers

---

## PHASE 1: CORE COMPONENTS & NAVIGATION ✅

### 1.1 UI Primitives (Shadcn-Style) ✅
- [x] **Sheet** (`src/lib/components/ui/sheet/`)
  - [x] `Sheet.svelte` - slide-over panel container
  - [x] `SheetContent.svelte` - content wrapper
  - [x] `SheetHeader.svelte`, `SheetFooter.svelte`
  - [x] `SheetTitle.svelte`, `SheetDescription.svelte`
- [x] **Button** (`src/lib/components/ui/button/Button.svelte`)
  - [x] Variants: default, destructive, outline, ghost
  - [x] Sizes: sm, md, lg
- [x] **Input** (`src/lib/components/ui/input/Input.svelte`)
  - [x] Dark theme styling from stylekit
- [x] **Modal/Dialog** (`src/lib/components/ui/dialog/`)
  - [x] Backdrop with blur
  - [x] Close button
  - [x] Centered content

### 1.2 Navigation Components ✅
- [x] **Navbar** (`src/lib/components/site/Navbar.svelte`)
  - [x] Logo/Brand text
  - [x] Desktop nav links (centered, uppercase, bold)
  - [x] Mobile hamburger trigger
  - [x] Cart icon with badge (item count)
  - [x] Sticky positioning with backdrop blur
  - [x] Active state highlighting
- [x] **HamburgerMenu** (`src/lib/components/site/HamburgerMenu.svelte`)
  - [x] Animated hamburger icon (3 spans with transitions)
  - [x] Click handler to toggle mobile menu
- [x] **MobileMenuSheet** (`src/lib/components/site/MobileMenuSheet.svelte`)
  - [x] Sheet component wrapper
  - [x] Large text links (text-3xl)
  - [x] Hover red effect
  - [x] Close on navigation
- [x] **CartSheet** (`src/lib/components/site/CartSheet.svelte`)
  - [x] Sheet component wrapper
  - [x] Cart items list with images
  - [x] Quantity controls per item
  - [x] Remove item button
  - [x] Total calculation display
  - [x] Checkout button (gradient style)
  - [x] Empty state

### 1.3 Root Layout Implementation ✅
- [x] **Update `+layout.svelte`**
  - [x] Add Navbar component
  - [x] Add CartSheet component
  - [x] Add MobileMenuSheet component
  - [x] Wire up cart store for badge count
  - [x] Add halftone overlay div
- [x] **Update `layout.css`**
  - [x] Import Tailwind directives
  - [x] Add custom CSS variables from stylekit
  - [x] Add halftone overlay styles
  - [x] Add glassmorphism utilities
  - [x] Add animation keyframes (marquee, pulse)

---

## PHASE 2: PRODUCT BROWSING ✅

### 2.1 Shared Product Components ✅
- [x] **ProductCard** (`src/lib/components/site/ProductCard.svelte`)
  - [x] Accept `ProductCardProps` interface
  - [x] Product image with `bg-[#e5e5e5]` and `mix-blend-multiply`
  - [x] Product name (truncate or marquee if long)
  - [x] Price display (BDT formatting)
  - [x] Size badges (use ProductSizeBox)
  - [x] Link to `/p/[slug]`
  - [x] Hover lift effect
- [x] **ProductSizeBox** (`src/lib/components/site/ProductSizeBox.svelte`)
  - [x] Small bordered box
  - [x] Size text (S, M, L, etc.)
  - [x] Optional: strikethrough if out of stock
- [x] **MediaCard** (`src/lib/components/site/MediaCard.svelte`)
  - [x] Accept `MediaCardProps` interface
  - [x] Image/video display
  - [x] Optional title overlay
  - [x] Click opens modal with tagged products
  - [x] Aspect ratio handling
- [x] **MasonryGrid** (`src/lib/components/site/MasonryGrid.svelte`)
  - [x] Wrapper around `svelte-bricks` library
  - [x] Accept `MasonryItem[]` (union of product/media)
  - [x] Render ProductCard or MediaCard based on type
  - [x] Responsive column config (2-col mobile, 3-4 col desktop)

### 2.2 Product Catalog Page (`/p`) ✅
- [x] **Server-Side Data** (`src/routes/p/+page.server.ts`)
  - [x] Fetch products with optimized query
  - [x] Select: name, slug, price, images.front
  - [x] Populate variants for size availability
  - [x] Filter: status=AVAILABLE
  - [x] Return typed PageData
- [x] **Client Components**
  - [x] **SearchFilterBar** (page-specific component)
    - [x] Search input (debounced 300ms)
    - [x] Filter chips container
    - [x] Sticky positioning
  - [x] **FilterChip** (page-specific component)
    - [x] Active/inactive states
    - [x] Click to toggle filter
- [x] **Page Implementation** (`src/routes/p/+page.svelte`)
  - [x] Load drop filters client-side (async)
  - [x] Implement search filtering (derived state)
  - [x] Implement drop filtering (derived state)
  - [x] Transform products to MasonryItem[]
  - [x] Render MasonryGrid
  - [x] Handle empty states

### 2.3 Product Detail Page (`/p/[product]`) ✅
- [x] **Server-Side Data** (`src/routes/p/[product]/+page.server.ts`)
  - [x] Fetch product by slug
  - [x] Populate: variants, images, related_products
  - [x] Fetch related media cards (tagged with product)
  - [x] Handle 404 if not found
  - [x] Return PageData with product + relatedMedia
- [x] **Client Components**
  - [x] **ProductGallery** (page-specific)
    - [x] 3-slot grid (main + 2 small)
    - [x] Clockwise rotation every 5s
    - [x] Click opens ImageViewerModal
  - [x] **SizeSelector** (page-specific)
    - [x] Row of size buttons
    - [x] Show stock status (disabled if out of stock)
    - [x] Active state highlighting
    - [x] "Size Guide" link
  - [x] **QuantityWidget** (page-specific)
    - [x] Minus/Plus buttons
    - [x] Number display
    - [x] Min/max bounds
  - [x] **AddToCartButton** (page-specific)
    - [x] Full-width CTA
    - [x] Disabled state if no size selected
    - [x] Click adds to cart store
  - [x] **ImageViewerModal** (page-specific)
    - [x] Full-screen overlay
    - [x] Image display
    - [x] Prev/Next navigation
    - [x] Close button
  - [x] **SizeGuideModal** (page-specific)
    - [x] Size chart display
    - [x] Light-themed overlay
- [x] **Page Implementation** (`src/routes/p/[product]/+page.svelte`)
  - [x] Render ProductGallery
  - [x] Product info section (title, price)
  - [x] Size selector + quantity widget
  - [x] Add to cart button
  - [x] Description rendering (rich text blocks)
  - [x] Suggested pairings (MasonryGrid)
  - [x] Wire up modals

---

## PHASE 3: DROP SYSTEM

### 3.1 Drop-Specific Components
- [ ] **DropCarousel** (`src/lib/components/site/DropCarousel.svelte`)
  - [ ] Accept `banners: MediaAsset[]`
  - [ ] Auto-rotate every 4s
  - [ ] Crossfade transition
  - [ ] Slide indicators (optional)
- [ ] **Countdown** (`src/lib/components/site/Countdown.svelte`)
  - [ ] Accept `targetDate: string` and `label: string`
  - [ ] Calculate time remaining (days/hours/mins/secs)
  - [ ] Update every 1000ms
  - [ ] Display format: "X days Y hours Z mins"
  - [ ] Cleanup interval on destroy
- [ ] **DropShowcaseSlots** (Home page specific)
  - [ ] 3-grid layout
  - [ ] Independent rotation timers (3s, 4.5s)
  - [ ] Product images in slots
- [ ] **UpcomingDropBanner** (Home page specific)
  - [ ] Teaser card layout
  - [ ] "Notify Me" CTA button
  - [ ] Opens NotifyModal
- [ ] **NotifyModal** (`src/lib/components/site/NotifyModal.svelte`)
  - [ ] Email/Phone tab switcher
  - [ ] Input field
  - [ ] Submit to `/api/notifiers`
  - [ ] Success/error states
  - [ ] Close on success
- [ ] **PreviousDrops** (Home page specific)
  - [ ] Horizontal scroll container
  - [ ] Drag-to-scroll functionality
  - [ ] Drop cards linking to `/d/[slug]`

### 3.2 Home Page (`/`)
- [ ] **Server-Side Data** (`src/routes/+page.server.ts`)
  - [ ] Fetch current drop (status=ACTIVE)
  - [ ] Fetch upcoming drop (status=SCHEDULED)
  - [ ] Fetch previous drops (status=ARCHIVED, limit 6)
  - [ ] Fetch explore products (status=AVAILABLE, limit 12)
  - [ ] Fetch explore media cards (populate media, limit 8)
  - [ ] Return PageData
- [ ] **Page Implementation** (`src/routes/+page.svelte`)
  - [ ] Render DropCarousel (if current drop has banners)
  - [ ] Render Countdown (target = current drop end_date)
  - [ ] Render DropShowcaseSlots (current drop products)
  - [ ] Render UpcomingDropBanner (if upcoming drop exists)
  - [ ] Render PreviousDrops horizontal scroll
  - [ ] Render Explore section (MasonryGrid)
  - [ ] Handle "no active drop" edge case

### 3.3 Drops Archive Page (`/d`)
- [ ] **Server-Side Data** (`src/routes/d/+page.server.ts`)
  - [ ] Fetch all drops (sort by -release_date)
  - [ ] Populate assets.banners
  - [ ] Return PageData
- [ ] **Client Components**
  - [ ] **DropArchiveCard** (page-specific)
    - [ ] 16:9 aspect ratio
    - [ ] Banner image background
    - [ ] Status badge (Live/Upcoming/Archived)
    - [ ] Drop name
    - [ ] Countdown text
    - [ ] Visual treatment based on status
  - [ ] **StatusBadge** (page-specific)
    - [ ] Red pulsing for LIVE
    - [ ] Gray for UPCOMING
    - [ ] Muted for ARCHIVED
- [ ] **Page Implementation** (`src/routes/d/+page.svelte`)
  - [ ] Group drops by status
  - [ ] Render vertical list of DropArchiveCards
  - [ ] Link each card to `/d/[slug]`
  - [ ] Handle empty state

### 3.4 Drop Detail Page (`/d/[drop]`)
- [ ] **Server-Side Data** (`src/routes/d/[drop]/+page.server.ts`)
  - [ ] Fetch drop by slug
  - [ ] Populate products and assets
  - [ ] Fetch media cards tagged with drop products
  - [ ] Handle 404 if not found
  - [ ] Block DRAFT drops (404)
  - [ ] Return PageData
- [ ] **Client Components**
  - [ ] **DropVideo** (page-specific)
    - [ ] Video player with custom controls
    - [ ] Play/pause overlay
    - [ ] Tap to toggle playback
    - [ ] Hide controls after 2s of playing
  - [ ] **DropHeader** (page-specific)
    - [ ] Drop name
    - [ ] Description text
- [ ] **Page Implementation** (`src/routes/d/[drop]/+page.svelte`)
  - [ ] Render DropCarousel (banners)
  - [ ] Render Countdown (context-aware: release vs end)
  - [ ] Render DropHeader
  - [ ] Render DropVideo (if video_embed_url)
  - [ ] Render product grid (MasonryGrid)
  - [ ] Handle status-based rendering (SCHEDULED vs ACTIVE)

---

## PHASE 4: COMMERCE FLOW

### 4.1 Checkout Page (`/checkout`)
- [ ] **Server-Side Actions** (`src/routes/checkout/+page.server.ts`)
  - [ ] Form action for order submission
  - [ ] Validate form data
  - [ ] Create order via API
  - [ ] Handle COD vs bKash redirect logic
- [ ] **Client Components**
  - [ ] **DeliveryForm** (page-specific)
    - [ ] Name, Phone, Address fields
    - [ ] City selector (Inside/Outside Dhaka)
    - [ ] Notes (optional)
    - [ ] Timeframe selector (optional)
  - [ ] **CitySelector** (page-specific)
    - [ ] Toggle buttons for Inside/Outside
  - [ ] **TimeframeSelector** (page-specific)
    - [ ] Morning/Afternoon/Evening options
  - [ ] **PaymentSelector** (page-specific)
    - [ ] COD/bKash radio group
    - [ ] bKash brand color when selected
  - [ ] **OrderSummary** (page-specific)
    - [ ] Cart items display (read-only)
    - [ ] Total amount
- [ ] **Page Implementation** (`src/routes/checkout/+page.svelte`)
  - [ ] Generate Order ID on mount
  - [ ] Create Visit record (background)
  - [ ] Render DeliveryForm
  - [ ] Render PaymentSelector
  - [ ] Render OrderSummary (from cart store)
  - [ ] Form validation
  - [ ] Submit with `use:enhance`
  - [ ] Redirect to `/receipt/[orderId]` with status param

### 4.2 Receipt Page (`/receipt/[orderId]`)
- [ ] **Server-Side Data** (`src/routes/receipt/[orderId]/+page.server.ts`)
  - [ ] Fetch order by ID
  - [ ] Handle token-based access
  - [ ] Check if PII should be locked
  - [ ] Return PageData
- [ ] **Client Components**
  - [ ] **PaymentGuide** (page-specific)
    - [ ] Step-by-step bKash instructions
    - [ ] bKash number display (01533817247)
    - [ ] Order ID display
    - [ ] Copy buttons for both
    - [ ] Important notice
  - [ ] **CopyButton** (reusable)
    - [ ] Copy to clipboard
    - [ ] Success feedback
  - [ ] **TrackingTimeline** (page-specific)
    - [ ] Visual status progression
    - [ ] Pending → Processing → Shipped → Delivered
    - [ ] Highlight current status
  - [ ] **IdentityModal** (page-specific)
    - [ ] Phone + SMS key input
    - [ ] Verification form
    - [ ] Success/error states
  - [ ] **LockedSection** (page-specific)
    - [ ] Blur/lock visual
    - [ ] Unlock button
    - [ ] Opens IdentityModal
  - [ ] **OrderItemsList** (page-specific)
    - [ ] Product name, variant, quantity
    - [ ] Price per item
    - [ ] Total
- [ ] **Page Implementation** (`src/routes/receipt/[orderId]/+page.svelte`)
  - [ ] Check payment method + status
  - [ ] Render PaymentGuide (if bKash pending)
  - [ ] Render TrackingTimeline (standard receipt)
  - [ ] Render OrderItemsList
  - [ ] Render locked sections (Deliver To, Tracking)
  - [ ] Wire up IdentityModal
  - [ ] Unlock PII on verification

---

## PHASE 5: INFORMATION PAGES

### 5.1 Info Page (`/info`)
- [ ] **Client Components**
  - [ ] **InfoTabs** (page-specific)
    - [ ] 4 tabs: Drops, About, Policy, Team
    - [ ] Folder-style styling with scoops
    - [ ] Corner morphing based on active tab
  - [ ] **DropsContent** (page-specific)
    - [ ] "How Drops Work" text
  - [ ] **AboutContent** (page-specific)
    - [ ] Brand manifesto
    - [ ] Mood image
  - [ ] **PolicyContent** (page-specific)
    - [ ] Collapsible sections
    - [ ] Return, Shipping, Privacy, ToS
  - [ ] **TeamGrid** (page-specific)
    - [ ] Grid of team member cards
  - [ ] **TeamMemberCard** (page-specific)
    - [ ] Avatar
    - [ ] Name, role
    - [ ] Instagram link (optional)
- [ ] **Page Implementation** (`src/routes/info/+page.svelte`)
  - [ ] Tab state management
  - [ ] Render InfoTabs
  - [ ] Render content based on active tab
  - [ ] Tab transition animations
  - [ ] Footer with Bastok credit

### 5.2 Contact Page (`/contact`)
- [ ] **Server-Side Actions** (`src/routes/contact/+page.server.ts`)
  - [ ] Form action for contact request
  - [ ] Validate data
  - [ ] Submit to `/api/contact-requests`
  - [ ] Return success/error
- [ ] **Client Components**
  - [ ] **ContactTabs** (page-specific)
    - [ ] 3 tabs: Sales, Admin, Tech
    - [ ] Folder-style styling
  - [ ] **ContactForm** (page-specific)
    - [ ] Name field
    - [ ] Phone/Email (dual-optional)
    - [ ] Subject field (dropdown for Sales)
    - [ ] Custom subject input (if "Other")
    - [ ] Message textarea (2000 char limit)
    - [ ] Character counter
    - [ ] Department-specific attachments
  - [ ] **SubjectDropdown** (page-specific)
    - [ ] Return, Cancel, Shipping, Other
    - [ ] Reveal custom input on "Other"
  - [ ] **ProductSearchInput** (page-specific)
    - [ ] Autocomplete for products/drops
    - [ ] Display attached chip
  - [ ] **FileUploadZone** (page-specific)
    - [ ] Screenshot upload for Tech
  - [ ] **CharacterCounter** (page-specific)
    - [ ] Live message length
- [ ] **Page Implementation** (`src/routes/contact/+page.svelte`)
  - [ ] Department state management
  - [ ] Form state with validation
  - [ ] Load draft from localStorage
  - [ ] Phone/Email optional logic
  - [ ] Rate limiting check (60s)
  - [ ] Submit with `use:enhance`
  - [ ] Success state with redirect
  - [ ] Clear draft on success

---

## PHASE 6: POLISH & OPTIMIZATION

### 6.1 Performance
- [ ] Image optimization
  - [ ] Use Cloudflare Images or R2 with transforms
  - [ ] Implement lazy loading
  - [ ] Use `sizes.card` variants from Media
- [ ] Code splitting
  - [ ] Dynamic imports for modals
  - [ ] Lazy load heavy components
- [ ] Caching
  - [ ] Set appropriate cache headers in `+page.server.ts`
  - [ ] Implement SWR pattern for client-side fetching

### 6.2 Accessibility
- [ ] Keyboard navigation
  - [ ] Tab order
  - [ ] Focus management in modals
  - [ ] Escape to close modals
- [ ] ARIA labels
  - [ ] Add `aria-label` to icon buttons
  - [ ] `role="dialog"` on modals
  - [ ] `aria-live` for cart updates
- [ ] Color contrast
  - [ ] Verify WCAG AA compliance
  - [ ] Test with high contrast mode

### 6.3 Testing
- [ ] Manual testing checklist
  - [ ] Test all routes on mobile
  - [ ] Test cart flow end-to-end
  - [ ] Test checkout with COD and bKash
  - [ ] Test form validations
  - [ ] Test edge cases (empty states, 404s)
- [ ] Browser compatibility
  - [ ] Chrome, Firefox, Safari
  - [ ] iOS Safari
  - [ ] Android Chrome

### 6.4 Deployment Prep
- [ ] Environment variables
  - [ ] Set `VITE_PAYLOAD_API_BASE` for production
  - [ ] Configure Cloudflare Pages env vars
- [ ] Build verification
  - [ ] Run `npm run build`
  - [ ] Test preview build locally
  - [ ] Check bundle size
- [ ] SEO & Meta
  - [ ] Add OpenGraph tags
  - [ ] Add Twitter cards
  - [ ] Generate sitemap
  - [ ] Add robots.txt

---

## 🎯 Quick Reference: Priority Matrix

| Component/Page | Priority | Blockers | Estimated Effort |
|----------------|----------|----------|------------------|
| Cart Store | 🔴 Critical | None | 2-3h |
| Navbar + CartSheet | 🔴 Critical | Cart Store | 3-4h |
| ProductCard + MasonryGrid | 🔴 Critical | None | 2-3h |
| Product Catalog | 🟠 High | ProductCard | 3-4h |
| Product Detail | 🟠 High | ProductCard, Cart | 4-6h |
| Home Page | 🟠 High | DropCarousel, Countdown | 6-8h |
| Checkout | 🟠 High | Cart Store | 4-5h |
| Receipt | 🟡 Medium | Checkout | 4-5h |
| Drops Archive | 🟡 Medium | None | 2-3h |
| Drop Detail | 🟡 Medium | DropCarousel | 3-4h |
| Info Page | 🟢 Low | None | 2-3h |
| Contact Page | 🟢 Low | None | 3-4h |

---

## 📝 Notes & Conventions

### Commit Message Format
```
feat(component): Add ProductCard component
fix(checkout): Handle empty cart validation
docs(readme): Update setup instructions
```

### File Naming
- Components: PascalCase (e.g., `ProductCard.svelte`)
- Utilities: camelCase (e.g., `generateOrderId.ts`)
- Types: PascalCase (e.g., `CartItem`)
- Stores: camelCase with `.svelte.ts` extension (e.g., `cart.svelte.ts`)

### Type Safety
- Always import types from `$lib/types`
- Use type guards for API response handling
- Prefer `interface` over `type` for object shapes
- Use `$derived` for computed values, not functions

### Styling
- Follow `#app.stylekit.md` tokens
- Use Tailwind utility classes
- Avoid arbitrary values unless spec requires exact pixels
- Keep custom CSS in component `<style>` blocks minimal

---

## 🚀 Getting Started (Recommended Order)

1. **Day 1: Foundation**
   - Complete Phase 0.1-0.3 (Structure, State, Utils)
   - Set up cart store
   - Create basic utilities

2. **Day 2: Navigation**
   - Complete Phase 1.1-1.3 (UI Primitives, Navigation)
   - Build Navbar, CartSheet, MobileMenu
   - Update root layout

3. **Day 3-4: Product Browsing**
   - Complete Phase 2.1-2.3 (Products)
   - Build ProductCard, MasonryGrid
   - Implement Catalog and Detail pages

4. **Day 5-6: Drop System**
   - Complete Phase 3.1-3.4 (Drops)
   - Build Home page
   - Implement Drops pages

5. **Day 7: Commerce**
   - Complete Phase 4.1-4.2 (Commerce)
   - Build Checkout
   - Build Receipt

6. **Day 8: Information**
   - Complete Phase 5.1-5.2 (Info pages)
   - Build Info and Contact pages

7. **Day 9-10: Polish**
   - Complete Phase 6 (Optimization)
   - Testing and bug fixes
   - Deployment

---

**Total Estimated Time**: 8-10 days for full implementation  
**MVP (Phases 0-4)**: 5-6 days
