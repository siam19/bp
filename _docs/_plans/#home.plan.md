# Home Page (`/`) Implementation Plan

## Route: `src/routes/+page.svelte`

## 1. Overview

The Home Page is Banglapunk's main storefront, built around a **Drop System** (time-sensitive product collections). It features a hero carousel, countdown timers, showcase grids, and an "Explore" masonry section mixing products and media.

---

## 2. Data Requirements

### A. Server-Side Data (`+page.server.ts`)

| Data | Source | API Call | Notes |
|------|--------|----------|-------|
| **Current Drop** | `payloadClient.listDrops()` | `?where[status][equals]=ACTIVE&populate=products&populate=assets.banners&limit=1` | Single active drop with products and banners |
| **Upcoming Drop** | `payloadClient.listDrops()` | `?where[status][equals]=SCHEDULED&sort=release_date&limit=1` | Next scheduled drop |
| **Previous Drops** | `payloadClient.listDrops()` | `?where[status][equals]=ARCHIVED&sort=-end_date&limit=6` | Recent archived drops |
| **Explore Items** | `payloadClient.listProducts()` + `payloadClient.listMediaCards()` | Products: `?where[status][equals]=AVAILABLE&limit=12`<br>MediaCards: `?populate=media&populate=tagged_products&limit=8` | Mixed masonry content |

### B. Type Imports

```ts
import type { Drop, Product, MediaCard } from '$lib/types';
```

---

## 3. Component Architecture

### A. Reusable Components (Already Exist)

| Component | Usage | Location |
|-----------|-------|----------|
| `Navbar` | Page header | `$lib/components/site/Navbar.svelte` |
| `CartSheet` | Cart drawer (triggered by Navbar) | `$lib/components/site/CartSheet.svelte` |
| `ProductCard` | Explore masonry items | `$lib/components/site/ProductCard.svelte` |
| `MediaCard` | Explore masonry items | `$lib/components/site/MediaCard.svelte` |
| `MasonryGrid` | Explore section wrapper | `$lib/components/site/MasonryGrid.svelte` |

### B. Page-Specific Components (To Build)

| Component | Description | Priority |
|-----------|-------------|----------|
| `DropCarousel` | Auto-rotating hero carousel (4s interval, crossfade) | HIGH |
| `Countdown` | Time remaining display (days/hours/mins) | HIGH |
| `DropShowcaseSlots` | 3-grid with independent rotation (3s/4.5s async) | MEDIUM |
| `UpcomingDropBanner` | Teaser card with "Notify Me" CTA | MEDIUM |
| `MasonryGrid` | Email/phone capture modal | MEDIUM |
| `PreviousDrops` | Horizontal scroll with drag-to-scroll | LOW |

---

## 4. State Management (Svelte 5 Runes)

```ts
// DropCarousel state
let currentSlide = $state(0);
let slides = $derived(currentDrop?.assets?.banners ?? []);

// Countdown state
let targetDate = $derived(currentDrop?.end_date ?? currentDrop?.release_date);
let timeRemaining = $state({ days: 0, hours: 0, mins: 0, secs: 0 });

// NotifyModal state
let isNotifyModalOpen = $state(false);

// DropShowcaseSlots state
let slot1Index = $state(0);
let slot2Index = $state(0);
```

---

## 5. Implementation Steps

### Phase 1: Data Loading
1. [ ] Create `+page.server.ts` with parallel API calls
2. [ ] Define `PageData` type export
3. [ ] Handle error states (no active drop scenario)

### Phase 2: Core Components
4. [ ] Build `DropCarousel.svelte` with `setInterval` rotation
5. [ ] Build `Countdown.svelte` with 1s update interval
6. [ ] Build `DropShowcaseSlots.svelte` with async rotation

### Phase 3: Interaction Components
7. [ ] Build `UpcomingDropBanner.svelte`
8. [ ] Build `NotifyModal.svelte` with form submission
9. [ ] Build `PreviousDrops.svelte` with drag scroll

### Phase 4: Explore Section
10. [ ] Transform API data into `MasonryItem[]` format
11. [ ] Integrate existing `MasonryGrid` component
12. [ ] Shuffle items for visual variety

---

## 6. API Integration Details

### NotifyModal Submission
```ts
// POST to notifiers collection
await payloadClient.createNotifier({
  contact_method: formData.method, // 'email' | 'phone'
  contact_value: formData.value,
  context: {
    drop_id: upcomingDrop.id
  }
});
```

---

## 7. Cleanup & Lifecycle

```ts
// In +page.svelte
import { onMount, onDestroy } from 'svelte';

let carouselInterval: ReturnType<typeof setInterval>;
let countdownInterval: ReturnType<typeof setInterval>;

onMount(() => {
  carouselInterval = setInterval(advanceSlide, 4000);
  countdownInterval = setInterval(updateCountdown, 1000);
});

onDestroy(() => {
  clearInterval(carouselInterval);
  clearInterval(countdownInterval);
});
```

---

## 8. Edge Cases

| Scenario | Handling |
|----------|----------|
| No active drop | Show "Coming Soon" state with upcoming drop info |
| No upcoming drop | Hide `UpcomingDropBanner` entirely |
| Empty explore section | Show skeleton/placeholder cards |
| Countdown reaches zero | Trigger page refresh or show "Drop Live!" message |
