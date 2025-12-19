# Implementation Plan - Drop Detail Page

**Route:** `/d/[drop]`
**Spec:** `src/routes/d/[drop]/#drop.spec.md`
**Layout Ref:** `src/routes/d/[drop]/#drop.layout.html`

## 1. Data Loading Strategy (`+page.server.ts`)

We need to fetch the specific drop details.

- **Endpoint:** `GET /api/shop/drops/[slug]`
- **Client Method:** `payloadClient.getShopDrop(slug)`

### Loader Logic
```typescript
export const load = async ({ params, fetch }) => {
  const { drop } = params;
  const dropData = await payloadClient.getShopDrop(drop, { fetch });
  
  // Note: The spec mentions displaying "Media Cards" in the masonry grid.
  // The ShopDrop response includes `products`.
  // We may need to fetch media cards separately if they are not included in the drop object.
  // Strategy: Fetch media cards tagged with the products in this drop?
  // For V1, we will display the products returned in `dropData.products`.
  
  return { drop: dropData };
};
```

## 2. Component Architecture

### Header Section
- **Navbar:** Standard.
- **Countdown:** `src/lib/components/site/Countdown.svelte`.
    - Target: `drop.release_date` (if upcoming) or `drop.end_date` (if active).
- **DropCarousel:** `src/lib/components/site/DropCarousel.svelte`.
    - Data: `drop.assets.banners` (Array of `ShopImage`).
- **DropVideo:** `src/lib/components/site/DropVideo.svelte`.
    - Data: `drop.assets.video_embed_url`.

### Content Section
- **Info:** Title (`drop.name`) and Description (`drop.description`).
- **Masonry Grid:** `src/lib/components/site/MasonryGrid.svelte`.
    - **Items:**
        - Map `drop.products` to `MasonryItem` (type: 'product').
        - (Future) Map related media to `MasonryItem` (type: 'media').

## 3. Implementation Steps

1.  **Update `src/routes/d/[drop]/+page.server.ts`**:
    - Implement `load` to fetch drop by slug.
    - Handle 404 if drop not found.
2.  **Update `src/routes/d/[drop]/+page.svelte`**:
    - Wire up `Countdown` with correct date logic.
    - Wire up `DropCarousel` with banner images.
    - Wire up `DropVideo` (conditionally render if URL exists).
    - Transform `drop.products` into `items` array for `MasonryGrid`.
3.  **Component Refinement**:
    - Ensure `DropVideo` has the custom play/pause overlay described in spec.

## 4. Requirements Checklist
- [ ] Fetch drop details from `/api/shop/drops/[slug]`.
- [ ] Render Countdown with correct target date.
- [ ] Render Carousel with banners.
- [ ] Render Video if available.
- [ ] Render Products in Masonry Grid.
