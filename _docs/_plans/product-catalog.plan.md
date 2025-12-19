# Implementation Plan - Product Catalog

**Route:** `/p`
**Spec:** `src/routes/p/#product-catalog.spec.md`
**Layout Ref:** `src/routes/p/#product-catalog.layout.html`

## 1. Data Loading Strategy (`+page.server.ts`)

We need to fetch a paginated list of products.

- **Endpoint:** `GET /api/shop/products`
- **Client Method:** `payloadClient.getShopProducts()`
- **Parameters:**
  - `limit`: 12 (Initial load)
  - `page`: 1

### Loader Logic
```typescript
export const load = async ({ fetch }) => {
  const productsData = await payloadClient.getShopProducts({ 
    fetch, 
    query: { limit: 12 } 
  });
  return { productsData };
};
```

## 2. Client-Side Interactions

### Dynamic Filters (Drops)
- **Requirement:** Fetch list of drops to populate filters *after* main content loads.
- **Implementation:** `onMount` in `+page.svelte`.
- **Endpoint:** `GET /api/shop/drops`.
- **Method:** `payloadClient.getShopDrops()`.

### Infinite Scroll
- **Requirement:** Load more products as user scrolls.
- **Implementation:**
    - Track `currentPage` state.
    - Detect scroll bottom.
    - Call `payloadClient.getShopProducts({ query: { page: currentPage + 1 } })`.
    - Append new docs to `products` array.

### Search
- **Requirement:** Filter by name.
- **Implementation:**
    - Debounced input.
    - Call `payloadClient.getShopProducts({ query: { 'where[name][contains]': searchTerm } })`.

## 3. Component Architecture

### Sticky Header
- Contains Search Input and Drop Filter Chips.
- **State:** `searchTerm`, `activeFilter`.

### Product Grid
- **Component:** `MasonryGrid`.
- **Data:** `products` array (mapped to `MasonryItem`).
- **Card Style:** "Light gray background... mix-blend-multiply" (Check `ProductCard.svelte` supports this variant or style override).

## 4. Implementation Steps

1.  **Update `src/routes/p/+page.server.ts`**:
    - Initial fetch of products.
2.  **Update `src/routes/p/+page.svelte`**:
    - Render `MasonryGrid` with initial data.
    - Implement `onMount` to fetch Drop filters.
    - Implement Infinite Scroll logic (using `IntersectionObserver` or scroll event).
    - Implement Search/Filter logic (updates the product list).

## 5. Requirements Checklist
- [ ] Server-side load of initial products.
- [ ] Client-side fetch of Drop filters.
- [ ] Sticky Search/Filter bar.
- [ ] Infinite Scroll.
- [ ] Search functionality.
