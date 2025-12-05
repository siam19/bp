# Drops Archive (`/d`) Implementation Plan

## Route: `src/routes/d/+page.svelte`

## 1. Overview

The Drops Archive is a visual timeline of all brand collections. It displays immersive 16:9 cards representing **Live**, **Upcoming**, and **Archived** drops with distinct visual treatments.

---

## 2. Data Requirements

### A. Server-Side Data (`+page.server.ts`)

| Data | Source | API Call | Notes |
|------|--------|----------|-------|
| **All Drops** | `payloadClient.listDrops()` | `?populate=assets.banners&sort=-release_date` | Sorted by release date descending |

### B. Type Imports

```ts
import type { Drop, MediaAsset } from '$lib/types';

interface DropCardData {
  id: string;
  slug: string;
  name: string;
  status: Drop['status'];
  release_date: string;
  end_date?: string;
  banner: MediaAsset | null;
}
```

---

## 3. Component Architecture

### A. Reusable Components (Already Exist)

| Component | Usage | Location |
|-----------|-------|----------|
| `Navbar` | Page header with back nav | `$lib/components/site/Navbar.svelte` |

### B. Page-Specific Components (To Build)

| Component | Description | Priority |
|-----------|-------------|----------|
| `DropArchiveCard` | 16:9 aspect ratio drop card with status badge | HIGH |
| `StatusBadge` | Live/Upcoming/Archived indicator | HIGH |
| `CountdownText` | Inline "Ends in X days" or "Launches in X days" | MEDIUM |

---

## 4. State Management (Svelte 5 Runes)

```ts
// Group drops by status for potential section headers
let liveDrops = $derived(drops.filter(d => d.status === 'ACTIVE'));
let upcomingDrops = $derived(drops.filter(d => d.status === 'SCHEDULED'));
let archivedDrops = $derived(drops.filter(d => d.status === 'ARCHIVED'));

// Or render as single sorted list
let sortedDrops = $derived([...liveDrops, ...upcomingDrops, ...archivedDrops]);
```

---

## 5. Implementation Steps

### Phase 1: Data Loading
1. [ ] Create `+page.server.ts` with drops fetch
2. [ ] Transform Drop[] to DropCardData[]
3. [ ] Extract first banner from assets.banners array

### Phase 2: Card Component
4. [ ] Build `DropArchiveCard.svelte` with 16:9 aspect ratio
5. [ ] Build `StatusBadge.svelte` with status-specific styling
6. [ ] Add click handler for navigation to `/d/[slug]`

### Phase 3: Status-Specific Content
7. [ ] Add pulsing animation for "LIVE NOW" badge
8. [ ] Calculate and display countdown text
9. [ ] Display end date for archived drops

### Phase 4: Layout
10. [ ] Implement vertical scroll layout
11. [ ] Add spacing between cards
12. [ ] Ensure mobile responsiveness

---

## 6. Drop Card Visual Specifications

### Card Types Matrix

| Status | Badge | Visual Treatment | Content |
|--------|-------|------------------|---------|
| **ACTIVE** | "LIVE NOW" (pulsing red) | Full color, accent border/shadow | Title + "Ends in X Days" |
| **SCHEDULED** | "UPCOMING" | Greyscale/dimmed, subtle border | Title + Launch Date |
| **ARCHIVED** | "ARCHIVED" | Low opacity, muted colors | Title + End Date |

### Badge Styling

```svelte
<!-- Live Badge -->
<span class="badge-live">
  <span class="pulse-dot"></span>
  LIVE NOW
</span>

<style>
  .badge-live {
    background: #ef4444;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .pulse-dot {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
</style>
```

---

## 7. Countdown Calculation

```ts
function getCountdownText(drop: DropCardData): string {
  const now = new Date();
  
  if (drop.status === 'ACTIVE' && drop.end_date) {
    const endDate = new Date(drop.end_date);
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `Ends in ${daysLeft} Day${daysLeft !== 1 ? 's' : ''}`;
  }
  
  if (drop.status === 'SCHEDULED') {
    const releaseDate = new Date(drop.release_date);
    const daysUntil = Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `Launches in ${daysUntil} Day${daysUntil !== 1 ? 's' : ''}`;
  }
  
  if (drop.status === 'ARCHIVED' && drop.end_date) {
    return `Ended ${formatDate(drop.end_date)}`;
  }
  
  return '';
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
```

---

## 8. Card Component Structure

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import StatusBadge from './StatusBadge.svelte';
  
  let { drop } = $props<{ drop: DropCardData }>();
  
  let cardClass = $derived.by(() => {
    switch (drop.status) {
      case 'ACTIVE': return 'ring-2 ring-red-500 shadow-lg shadow-red-500/20';
      case 'SCHEDULED': return 'grayscale opacity-80 border border-gray-800';
      case 'ARCHIVED': return 'opacity-60';
      default: return '';
    }
  });
  
  function handleClick() {
    goto(`/d/${drop.slug}`);
  }
</script>

<button 
  onclick={handleClick}
  class="w-full aspect-video relative rounded-2xl overflow-hidden {cardClass}"
>
  <!-- Background Image -->
  <img 
    src={drop.banner?.url ?? '/placeholder-drop.jpg'} 
    alt={drop.name}
    class="absolute inset-0 w-full h-full object-cover"
  />
  
  <!-- Gradient Overlay -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
  
  <!-- Content -->
  <div class="absolute inset-0 p-6 flex flex-col justify-between">
    <!-- Badge -->
    <div class="self-start">
      <StatusBadge status={drop.status} />
    </div>
    
    <!-- Title & Countdown -->
    <div>
      <h3 class="text-2xl font-bold text-white mb-1">{drop.name}</h3>
      <p class="text-gray-300 text-sm">{getCountdownText(drop)}</p>
    </div>
  </div>
</button>
```

---

## 9. Styling Notes

| Element | Tailwind Classes |
|---------|------------------|
| Page container | `max-w-md mx-auto px-4 py-6 space-y-4` |
| Card | `aspect-video relative rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]` |
| Live card | `ring-2 ring-red-500 shadow-lg shadow-red-500/20` |
| Upcoming card | `grayscale opacity-80 border border-gray-800` |
| Archived card | `opacity-60` |
| Badge base | `px-3 py-1 rounded-full text-xs font-bold uppercase` |

---

## 10. Edge Cases

| Scenario | Handling |
|----------|----------|
| No drops exist | Show "No drops yet" placeholder |
| Drop missing banner | Use placeholder image |
| Drop missing end_date | Hide countdown for archived |
| All drops archived | Still display archive normally |
| Drop transitions live→archived | Will update on next page load |


# Drop Detail Page (`/d/[drop]`) Implementation Plan

## Route: `src/routes/d/[drop]/+page.svelte`

## 1. Overview

The Drop Detail Page is an immersive landing for a specific collection, combining:
- Hero banner carousel
- Countdown timer (to release or end)
- Drop video with custom play/pause
- Mixed product + media masonry grid

---

## 2. Data Requirements

### A. Server-Side Data (`+page.server.ts`)

| Data | Source | API Call | Notes |
|------|--------|----------|-------|
| **Drop** | `payloadClient.getDrop()` | `/api/drops?where[slug][equals]=${slug}&populate=products&populate=assets.banners&depth=2` | Full drop with products and banners |
| **Drop Products** | Included in drop | `drop.products` | Already populated |
| **Related Media** | `payloadClient.listMediaCards()` | `?where[tagged_products][in]=${productIds}&populate=media` | Media tagged with any drop product |

### B. Type Imports

```ts
import type { Drop, Product, MediaCard, MediaAsset } from '$lib/types';
import type { MasonryItem, ProductCardProps, MediaCardProps } from '$lib/types';
```

---

## 3. Component Architecture

### A. Reusable Components (Already Exist)

| Component | Usage | Location |
|-----------|-------|----------|
| `Navbar` | Page header | `$lib/components/site/Navbar.svelte` |
| `ProductCard` | Product grid items | `$lib/components/site/ProductCard.svelte` |
| `MediaCard` | Media grid items | `$lib/components/site/MediaCard.svelte` |
| `MasonryGrid` | Mixed content grid | `$lib/components/site/MasonryGrid.svelte` |

### B. Components from Home Page (Can Reuse)

| Component | Usage | Notes |
|-----------|-------|-------|
| `DropCarousel` | Hero banner carousel | Same as home page |
| `Countdown` | Time remaining | Same logic, different context |

### C. Page-Specific Components (To Build)

| Component | Description | Priority |
|-----------|-------------|----------|
| `DropVideo` | Video player with custom play/pause overlay | HIGH |
| `DropHeader` | Drop name and description section | MEDIUM |

---

## 4. State Management (Svelte 5 Runes)

```ts
// Carousel state (if not abstracted to component)
let currentSlide = $state(0);
let banners = $derived(drop.assets?.banners ?? []);

// Countdown state
let countdownTarget = $derived.by(() => {
  if (drop.status === 'SCHEDULED') return drop.release_date;
  if (drop.status === 'ACTIVE') return drop.end_date;
  return null;
});
let timeRemaining = $state({ days: 0, hours: 0, mins: 0, secs: 0 });

// Video state
let isVideoPlaying = $state(false);
let videoElement = $state<HTMLVideoElement | null>(null);

// Masonry items
let masonryItems = $derived(buildMasonryItems(drop.products, relatedMedia));
```

---

## 5. Implementation Steps

### Phase 1: Data Loading
1. [ ] Create `+page.server.ts` with drop fetch by slug
2. [ ] Handle 404 for missing/draft drops
3. [ ] Fetch related media cards for drop products
4. [ ] Transform products to ProductCardProps[]

### Phase 2: Hero Section
5. [ ] Integrate or reuse `DropCarousel` component
6. [ ] Integrate or reuse `Countdown` component
7. [ ] Add countdown context awareness (release vs end)

### Phase 3: Content Section
8. [ ] Build `DropHeader.svelte` with name and description
9. [ ] Build `DropVideo.svelte` with custom controls

### Phase 4: Product Grid
10. [ ] Transform drop products + media to MasonryItem[]
11. [ ] Integrate existing MasonryGrid component
12. [ ] Ensure proper interleaving of products and media

---

## 6. Countdown Context Logic

```ts
function getCountdownConfig(drop: Drop) {
  const now = new Date();
  
  if (drop.status === 'SCHEDULED' && drop.release_date) {
    return {
      target: new Date(drop.release_date),
      label: 'Drops in',
      isLive: false
    };
  }
  
  if (drop.status === 'ACTIVE' && drop.end_date) {
    return {
      target: new Date(drop.end_date),
      label: 'Ends in',
      isLive: true
    };
  }
  
  return null; // Archived drops don't show countdown
}
```

---

## 7. DropVideo Component

```svelte
<script lang="ts">
  import { Play, Pause } from '@lucide/svelte';
  
  let { videoUrl } = $props<{ videoUrl: string }>();
  
  let videoElement = $state<HTMLVideoElement | null>(null);
  let isPlaying = $state(false);
  let showControls = $state(true);
  
  function togglePlayback() {
    if (!videoElement) return;
    
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    isPlaying = !isPlaying;
  }
  
  function handleVideoClick() {
    togglePlayback();
  }
  
  // Hide controls after play starts
  $effect(() => {
    if (isPlaying) {
      const timeout = setTimeout(() => showControls = false, 2000);
      return () => clearTimeout(timeout);
    } else {
      showControls = true;
    }
  });
</script>

<div 
  class="relative aspect-video rounded-xl overflow-hidden bg-black cursor-pointer"
  onclick={handleVideoClick}
  onmouseenter={() => showControls = true}
  onmouseleave={() => isPlaying && (showControls = false)}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === ' ' && togglePlayback()}
>
  <video
    bind:this={videoElement}
    src={videoUrl}
    class="w-full h-full object-cover"
    loop
    playsinline
    muted
  />
  
  <!-- Overlay (visible when paused or hovering) -->
  {#if showControls}
    <div class="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
      <button 
        class="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center"
        onclick|stopPropagation={togglePlayback}
      >
        {#if isPlaying}
          <Pause class="w-8 h-8 text-black" />
        {:else}
          <Play class="w-8 h-8 text-black ml-1" />
        {/if}
      </button>
    </div>
  {/if}
</div>
```

---

## 8. Drop Header Section

```svelte
<script lang="ts">
  let { name, description } = $props<{ name: string; description?: string }>();
</script>

<div class="space-y-4 text-center px-4">
  <h1 class="text-4xl font-black uppercase tracking-tight text-white">
    {name}
  </h1>
  
  {#if description}
    <p class="text-gray-400 max-w-prose mx-auto">
      {description}
    </p>
  {/if}
</div>
```

---

## 9. Page Structure

```svelte
<script lang="ts">
  import Navbar from '$lib/components/site/Navbar.svelte';
  import DropCarousel from '$lib/components/site/DropCarousel.svelte';
  import Countdown from '$lib/components/site/Countdown.svelte';
  import DropVideo from './DropVideo.svelte';
  import DropHeader from './DropHeader.svelte';
  import { Masonry } from 'svelte-bricks';
  import ProductCard from '$lib/components/site/ProductCard.svelte';
  import MediaCard from '$lib/components/site/MediaCard.svelte';
  
  let { data } = $props();
  let { drop, relatedMedia } = data;
</script>

<div class="min-h-screen bg-black">
  <Navbar />
  
  <!-- Hero: Carousel -->
  {#if drop.assets?.banners?.length}
    <DropCarousel banners={drop.assets.banners} />
  {/if}
  
  <!-- Countdown -->
  {#if countdownConfig}
    <div class="py-6">
      <Countdown 
        targetDate={countdownConfig.target} 
        label={countdownConfig.label}
      />
    </div>
  {/if}
  
  <!-- Drop Info -->
  <DropHeader name={drop.name} description={drop.description} />
  
  <!-- Video -->
  {#if drop.assets?.video_embed_url}
    <div class="px-4 py-6">
      <DropVideo videoUrl={drop.assets.video_embed_url} />
    </div>
  {/if}
  
  <!-- Product Grid -->
  <div class="px-4 py-8">
    <h2 class="text-xl font-bold text-white mb-6">Products</h2>
    
    <Masonry 
      items={masonryItems}
      idKey="id"
      minColWidth={164}
      maxColWidth={364}
      gap={16}
    >
      {#snippet children({ item })}
        {#if item.type === 'product'}
          <ProductCard product={item.product} />
        {:else if item.type === 'media'}
          <MediaCard media={item.media} />
        {/if}
      {/snippet}
    </Masonry>
  </div>
</div>
```

---

## 10. Masonry Items Transform

```ts
function buildMasonryItems(
  products: Product[] | undefined,
  mediaCards: MediaCard[]
): MasonryItem[] {
  const productItems: MasonryItem[] = (products ?? []).map(p => ({
    id: `p-${p.id}`,
    type: 'product' as const,
    product: {
      productId: p.slug ?? p.id,
      productName: p.name,
      productImages: [p.images.front?.url ?? p.images.front?.sizes?.card?.url].filter(Boolean),
      price: p.price,
      availableSizes: p.variants?.docs
        ?.filter(v => v.stock_count > 0)
        .map(v => v.size) ?? []
    }
  }));
  
  const mediaItems: MasonryItem[] = mediaCards.map(m => ({
    id: `m-${m.id}`,
    type: 'media' as const,
    media: {
      mediaURL: typeof m.media === 'string' ? m.media : m.media?.url ?? '',
      title: m.name ?? '',
      taggedProducts: (m.tagged_products ?? []).map(p => 
        typeof p === 'string' ? p : p.slug ?? p.id
      )
    }
  }));
  
  // Interleave: product, media, product, product, media pattern
  const result: MasonryItem[] = [];
  let pIdx = 0, mIdx = 0;
  
  while (pIdx < productItems.length || mIdx < mediaItems.length) {
    // Add 2 products
    if (pIdx < productItems.length) result.push(productItems[pIdx++]);
    if (pIdx < productItems.length) result.push(productItems[pIdx++]);
    // Add 1 media
    if (mIdx < mediaItems.length) result.push(mediaItems[mIdx++]);
  }
  
  return result;
}
```

---

## 11. Styling Notes

| Element | Tailwind Classes |
|---------|------------------|
| Page container | `min-h-screen bg-black` |
| Drop title | `text-4xl font-black uppercase tracking-tight text-white` |
| Description | `text-gray-400 max-w-prose mx-auto text-center` |
| Video container | `aspect-video rounded-xl overflow-hidden bg-black` |
| Play button | `w-16 h-16 rounded-full bg-white/90` |
| Section heading | `text-xl font-bold text-white mb-6` |

---

## 12. Status-Based Rendering

| Status | Countdown | Products | Video |
|--------|-----------|----------|-------|
| **SCHEDULED** | Shows "Drops in X" | Hidden or "Coming Soon" | May show teaser |
| **ACTIVE** | Shows "Ends in X" | Full grid | Playable |
| **ARCHIVED** | Hidden | Full grid (may be sold out) | Playable |
| **DRAFT** | 404 | 404 | 404 |

```ts
// In +page.server.ts
if (drop.status === 'DRAFT') {
  throw error(404, 'Drop not found');
}
```

---

## 13. Edge Cases

| Scenario | Handling |
|----------|----------|
| Drop not found | Show 404 page |
| Drop is DRAFT | Show 404 (not public) |
| No banners | Hide carousel section |
| No video URL | Hide video section |
| No products | Show "No products in this drop" |
| SCHEDULED drop | Show countdown, hide/blur products |
| Video fails to load | Show error state with retry |
| Countdown reaches zero | Refresh page or show "Live Now!" |
