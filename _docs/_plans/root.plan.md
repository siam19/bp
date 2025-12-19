# Implementation Plan - Home Page

**Route:** `/`
**Spec:** `src/routes/#root.spec.md`
**Layout Ref:** `src/routes/#root.layout.html`

## 1. Data Loading Strategy (`+page.server.ts`)

We need to fetch data for multiple sections: Active Drop, Upcoming Drop, Previous Drops, and the Explore Feed.

- **Endpoints:**
    - `GET /api/shop/drops` (Fetch all to filter by status)
    - `GET /api/shop/products` (For Explore Feed)
    - `GET /api/shop/media-cards` (For Explore Feed)

### Loader Logic
```typescript
export const load = async ({ fetch }) => {
  // Parallel fetching
  const [dropsData, productsData, mediaData] = await Promise.all([
    payloadClient.getShopDrops({ fetch, query: { limit: 20 } }),
    payloadClient.getShopProducts({ fetch, query: { limit: 10 } }),
    payloadClient.getShopMediaCards({ fetch, query: { limit: 10 } })
  ]);

  // Process Drops
  const activeDrop = dropsData.docs.find(d => d.status === 'ACTIVE');
  const upcomingDrop = dropsData.docs.find(d => d.status === 'SCHEDULED');
  const previousDrops = dropsData.docs.filter(d => d.status === 'ARCHIVED');

  return { 
    activeDrop, 
    upcomingDrop, 
    previousDrops,
    exploreFeed: { products: productsData.docs, media: mediaData.docs }
  };
};
```

## 2. Component Architecture

### Hero Section (Active Drop)
- **DropCarousel:** Uses `activeDrop.assets.banners`.
- **Countdown:** Uses `activeDrop.end_date`.
- **DropShowcaseSlots:** Uses `activeDrop.products` (Pick 3 random or specific ones).

### Upcoming Section
- **UpcomingDropBanner:** Uses `upcomingDrop` data.
- **NotifyModal:** Triggered by "Notify Me" button.

### Archive Section
- **PreviousDrops:** Horizontal scroll list of `previousDrops`.

### Explore Section
- **MasonryGrid:** Mixed feed of `products` and `media`.
    - **Interleaving Strategy:** Merge arrays or just concat? Spec says "Mixed feed". We can interleave them 1:1 or random.

## 3. Implementation Steps

1.  **Update `src/routes/+page.server.ts`**:
    - Implement the parallel fetch loader.
2.  **Update `src/routes/+page.svelte`**:
    - Render `DropCarousel` (handle if no active drop? Show generic?).
    - Render `Countdown`.
    - Render `DropShowcaseSlots`.
    - Render `UpcomingDropBanner` (conditionally).
    - Render `PreviousDrops`.
    - Render `MasonryGrid` with interleaved data.
3.  **Interactions**:
    - Implement "Notify Me" modal logic (Client-side `createNotifier` call).
    - Implement "Drag-to-Scroll" for `PreviousDrops`.

## 4. Requirements Checklist
- [ ] Fetch all required data.
- [ ] Display Active Drop Hero.
- [ ] Display Upcoming Drop Teaser.
- [ ] Display Previous Drops Scroll.
- [ ] Display Mixed Explore Feed.
