# Implementation Plan - Product Detail Page

**Route:** `/p/[product]`
**Spec:** `src/routes/p/[product]/#product.spec.md`
**Layout Ref:** `src/routes/p/[product]/#product.layout.html`

## 1. Data Loading Strategy (`+page.server.ts`)

Fetch single product details and related content.

- **Endpoint 1 (Product):** `GET /api/shop/products/[slug]`
- **Endpoint 2 (Media):** `GET /api/shop/media-cards/[productId]` (For "Suggested Pairings")

### Loader Logic
```typescript
export const load = async ({ params, fetch }) => {
  const { product: slug } = params;
  
  // 1. Fetch Product
  const product = await payloadClient.getShopProduct(slug, { fetch });
  
  // 2. Fetch Related Media (Client-side or Server-side? Spec implies infinite scroll for pairings, but initial load can be server-side)
  // We'll fetch the first batch of media cards server-side to populate the grid.
  const mediaCards = await payloadClient.getShopProductMediaCards(product.id, { fetch, query: { limit: 6 } });

  return { product, mediaCards };
};
```

## 2. Component Architecture

### Product Gallery
- **Component:** Custom Grid Layout (Slot 0, 1, 2).
- **Data:** `product.images` (Front, Back, Profile).
- **Behavior:** Auto-rotation (JS `setInterval`).
- **Interaction:** Click -> Open `ImageViewerModal`.

### Product Info
- **Details:** Name, Price, Description.
- **Selectors:**
    - **Size:** Buttons for `product.variants`.
    - **Quantity:** Counter.
- **Actions:** "Add to Cart" (Updates global `cart` store).
- **Size Guide:** Trigger `SizeGuideModal`.

### Suggested Pairings (Masonry)
- **Content:**
    - **Pinned Items:** `product.related_products` (Fetch these? They are IDs in `ShopProduct`. Need to fetch full objects or `ShopProduct` includes them? `ShopProduct` definition says `related_products: { id: string }[]`. We might need to fetch the actual product details for these IDs to display cards. *Note: Check if `depth` param helps or if we need separate calls.*)
    - **Media Cards:** `mediaCards` from loader.
- **Implementation:** Combine `related_products` (fetched) and `mediaCards` into a single `MasonryItem[]` list.

## 3. Implementation Steps

1.  **Update `src/routes/p/[product]/+page.server.ts`**:
    - Fetch product.
    - Fetch media cards.
    - (Optional) Fetch details for `related_products` if not fully populated.
2.  **Update `src/routes/p/[product]/+page.svelte`**:
    - Implement Gallery with rotation logic.
    - Implement Size Selector (validate stock in `variants`).
    - Implement "Add to Cart" using `cart.svelte.ts`.
    - Render `MasonryGrid` for pairings.
3.  **Modals**:
    - Implement `ImageViewerModal` and `SizeGuideModal` (or use `Dialog` primitive).

## 4. Requirements Checklist
- [ ] Fetch product by slug.
- [ ] Fetch related media cards.
- [ ] Rotating Image Gallery.
- [ ] Size Selection & Stock Validation.
- [ ] Add to Cart functionality.
- [ ] Suggested Pairings Grid.
