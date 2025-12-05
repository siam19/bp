# Product Catalog (`/p`) Implementation Plan

## Route: `src/routes/p/+page.svelte`

## 1. Overview

The Product Catalog is a comprehensive inventory view allowing users to browse all products regardless of Drop association. Features a sticky search/filter bar and a 2-column masonry grid.

---

## 2. Data Requirements

### A. Server-Side Data (`+page.server.ts`)

| Data | Source | API Call | Notes |
|------|--------|----------|-------|
| **Products** | `payloadClient.listProducts()` | `?where[status][equals]=AVAILABLE&select[name]=true&select[slug]=true&select[price]=true&select[images.front]=true&populate=variants&limit=24` | Optimized projection for grid cards |
| **Drop Filters** | `payloadClient.listDrops()` | `?select[name]=true&select[slug]=true&where[status][in]=ACTIVE,ARCHIVED` | Fetched AFTER initial render for filter chips |

### B. Type Imports

```ts
import type { Product, Drop, Variant } from '$lib/types';
import type { ProductCardProps, MasonryItem } from '$lib/types';
```

---

## 3. Component Architecture

### A. Reusable Components (Already Exist)

| Component | Usage | Location |
|-----------|-------|----------|
| `Navbar` | Page header with back navigation | `$lib/components/site/Navbar.svelte` |
| `ProductCard` | Grid item display | `$lib/components/site/ProductCard.svelte` |
| `ProductSizeBox` | Size badges in cards | `$lib/components/site/ProductSizeBox.svelte` |
| `MasonryGrid` | Grid wrapper (svelte-bricks) | `$lib/components/site/MasonryGrid.svelte` |

### B. Page-Specific Components (To Build)

| Component | Description | Priority |
|-----------|-------------|----------|
| `SearchFilterBar` | Sticky header with search input + filter chips | HIGH |
| `FilterChip` | Individual filter button (ALL, PANTER, etc.) | HIGH |
| `FilterSkeleton` | Loading placeholder for async filters | LOW |

---

## 4. State Management (Svelte 5 Runes)

```ts
// Search & Filter state
let searchQuery = $state('');
let activeFilter = $state<string | null>(null); // null = "ALL"
let dropFilters = $state<{ name: string; slug: string }[]>([]);
let isFiltersLoading = $state(true);

// Derived filtered products
let filteredProducts = $derived.by(() => {
  let result = products;
  
  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(query));
  }
  
  // Apply drop filter (requires product->drop relationship check)
  if (activeFilter) {
    result = result.filter(p => p.dropSlug === activeFilter);
  }
  
  return result;
});

// Transform to MasonryItem format
let masonryItems = $derived<MasonryItem[]>(
  filteredProducts.map(p => ({
    id: p.id,
    type: 'product' as const,
    product: transformToCardProps(p)
  }))
);
```

---

## 5. Implementation Steps

### Phase 1: Data Loading
1. [ ] Create `+page.server.ts` with product fetch
2. [ ] Transform Product[] to ProductCardProps[]
3. [ ] Extract available sizes from variants

### Phase 2: UI Components
4. [ ] Build `SearchFilterBar.svelte` (sticky positioning)
5. [ ] Build `FilterChip.svelte` with active state styling
6. [ ] Add "ALL" filter button as first chip

### Phase 3: Async Filter Loading
7. [ ] Fetch drops client-side after hydration (`onMount`)
8. [ ] Show skeleton during filter loading
9. [ ] Populate filter chips dynamically

### Phase 4: Search & Filter Logic
10. [ ] Implement debounced search (300ms)
11. [ ] Implement filter toggle logic
12. [ ] Update masonry grid reactively

---

## 6. API Integration Details

### Product Transformation
```ts
function transformToCardProps(product: Product): ProductCardProps {
  const availableSizes = product.variants?.docs
    ?.filter(v => v.stock_count > 0)
    .map(v => v.size) ?? [];

  return {
    productId: product.slug ?? product.id,
    productName: product.name,
    productImages: [product.images.front?.url ?? product.images.front?.sizes?.card?.url],
    price: product.price,
    availableSizes
  };
}
```

### Async Filter Fetch (Client-Side)
```ts
onMount(async () => {
  try {
    const { docs } = await payloadClient.listDrops({
      query: {
        'select[name]': 'true',
        'select[slug]': 'true',
        'where[status][in]': 'ACTIVE,ARCHIVED'
      }
    });
    dropFilters = docs;
  } finally {
    isFiltersLoading = false;
  }
});
```

---

## 7. Styling Notes

| Element | Tailwind Classes |
|---------|------------------|
| Search/Filter bar | `sticky top-0 z-20 bg-black/90 backdrop-blur-sm` |
| Search input | `bg-neutral-900 border-neutral-700 text-white placeholder-gray-500` |
| Filter chip (inactive) | `bg-neutral-800 text-gray-400 border-neutral-700` |
| Filter chip (active) | `bg-white text-black font-bold` |
| Product image bg | `bg-[#e5e5e5]` with `mix-blend-multiply` |

---

## 8. Performance Considerations

| Optimization | Implementation |
|--------------|----------------|
| **Prioritize grid** | Render products before filters load |
| **Debounced search** | Prevent excessive re-renders |
| **Image optimization** | Use `sizes.card` variant from Media |
| **Lazy loading** | Native `loading="lazy"` on images |

---

## 9. Edge Cases

| Scenario | Handling |
|----------|----------|
| No products match search | Show "No products found" message |
| No products in drop filter | Show empty state with filter name |
| Variants not populated | Default to empty sizes array |
| Product missing front image | Use placeholder or hide card |


# Product Detail Page (`/p/[product]`) Implementation Plan

## Route: `src/routes/p/[product]/+page.svelte`

## 1. Overview

The Product Detail Page displays a single product with:
- 3-slot rotating image gallery
- Size selection and quantity controls
- Add to Cart functionality
- Related products masonry grid (manual pins + media)

---

## 2. Data Requirements

### A. Server-Side Data (`+page.server.ts`)

| Data | Source | API Call | Notes |
|------|--------|----------|-------|
| **Product** | `payloadClient.getProduct()` | `/api/products?where[slug][equals]=${slug}&populate=variants&populate=images.front&populate=images.back&populate=images.profile&populate=related_products&depth=2` | Full product with variants and images |
| **Related Media** | `payloadClient.listMediaCards()` | `?where[tagged_products][contains]=${productId}&populate=media&limit=6` | Media cards tagged with this product |

### B. Type Imports

```ts
import type { Product, Variant, MediaAsset, MediaCard } from '$lib/types';
import type { MasonryItem } from '$lib/types';
```

---

## 3. Component Architecture

### A. Reusable Components (Already Exist)

| Component | Usage | Location |
|-----------|-------|----------|
| `Navbar` | Page header | `$lib/components/site/Navbar.svelte` |
| `ProductCard` | Related products | `$lib/components/site/ProductCard.svelte` |
| `MediaCard` | Related media | `$lib/components/site/MediaCard.svelte` |
| `MasonryGrid` | Suggested pairings | `$lib/components/site/MasonryGrid.svelte` |
| `ProductSizeBox` | Size badges | `$lib/components/site/ProductSizeBox.svelte` |

### B. Page-Specific Components (To Build)

| Component | Description | Priority |
|-----------|-------------|----------|
| `ProductGallery` | 3-slot rotating image display | HIGH |
| `SizeSelector` | Row of size buttons with stock status | HIGH |
| `QuantityWidget` | Increment/decrement quantity control | HIGH |
| `AddToCartButton` | Full-width CTA button | HIGH |
| `ImageViewerModal` | Full-screen gallery navigation | MEDIUM |
| `SizeGuideModal` | Size chart display | LOW |

---

## 4. State Management (Svelte 5 Runes)

```ts
// Gallery state
let galleryImages = $derived([
  product.images.front,
  product.images.back,
  product.images.profile
].filter(Boolean) as MediaAsset[]);

let galleryPositions = $state([0, 1, 2]); // Which image in which slot

// Selection state
let selectedSize = $state<string | null>(null);
let quantity = $state(1);

// Modal state
let isImageModalOpen = $state(false);
let imageModalIndex = $state(0);
let isSizeGuideOpen = $state(false);

// Derived variant lookup
let selectedVariant = $derived(
  product.variants?.docs?.find(v => v.size === selectedSize)
);

let isInStock = $derived(
  selectedVariant ? selectedVariant.stock_count >= quantity : false
);

// Cart integration
let canAddToCart = $derived(
  selectedSize !== null && quantity > 0 && isInStock
);
```

---

## 5. Implementation Steps

### Phase 1: Data Loading
1. [ ] Create `+page.server.ts` with product fetch by slug
2. [ ] Handle 404 for missing product
3. [ ] Fetch related media cards tagged with product

### Phase 2: Gallery Component
4. [ ] Build `ProductGallery.svelte` with 3-slot layout
5. [ ] Implement clockwise rotation every 5000ms
6. [ ] Add click handler to open image modal

### Phase 3: Selection Controls
7. [ ] Build `SizeSelector.svelte` with stock awareness
8. [ ] Build `QuantityWidget.svelte` with min/max bounds
9. [ ] Wire up variant stock checking

### Phase 4: Cart Integration
10. [ ] Build `AddToCartButton.svelte`
11. [ ] Implement add to cart action with cart store
12. [ ] Show feedback on successful add

### Phase 5: Modals
13. [ ] Build `ImageViewerModal.svelte` with navigation
14. [ ] Build `SizeGuideModal.svelte`
15. [ ] Wire up modal triggers

### Phase 6: Suggested Pairings
16. [ ] Transform related products to MasonryItem[]
17. [ ] Merge with related media cards
18. [ ] Render with existing MasonryGrid

---

## 6. Gallery Layout Structure

```svelte
<!-- 3-Slot Grid: Main (left), Two small (right stacked) -->
<div class="grid grid-cols-3 gap-2">
  <!-- Main Slot (spans 2 rows) -->
  <button 
    class="col-span-2 row-span-2 aspect-square rounded-lg overflow-hidden"
    onclick={() => openImageModal(0)}
  >
    <img src={galleryImages[galleryPositions[0]]?.url} alt="" class="w-full h-full object-cover" />
  </button>
  
  <!-- Top Right Slot -->
  <button 
    class="aspect-square rounded-lg overflow-hidden"
    onclick={() => openImageModal(1)}
  >
    <img src={galleryImages[galleryPositions[1]]?.url} alt="" class="w-full h-full object-cover" />
  </button>
  
  <!-- Bottom Right Slot -->
  <button 
    class="aspect-square rounded-lg overflow-hidden"
    onclick={() => openImageModal(2)}
  >
    <img src={galleryImages[galleryPositions[2]]?.url} alt="" class="w-full h-full object-cover" />
  </button>
</div>
```

---

## 7. Gallery Rotation Logic

```ts
import { onMount, onDestroy } from 'svelte';

let rotationInterval: ReturnType<typeof setInterval>;

onMount(() => {
  rotationInterval = setInterval(() => {
    // Clockwise rotation: [0,1,2] -> [2,0,1] -> [1,2,0]
    galleryPositions = [
      galleryPositions[2],
      galleryPositions[0],
      galleryPositions[1]
    ];
  }, 5000);
});

onDestroy(() => {
  clearInterval(rotationInterval);
});
```

---

## 8. Size Selector with Stock Status

```svelte
<script lang="ts">
  import type { Variant } from '$lib/types';
  
  let { variants, selectedSize = $bindable() } = $props<{
    variants: Variant[];
    selectedSize: string | null;
  }>();
</script>

<div class="space-y-2">
  <div class="flex items-center justify-between">
    <span class="text-white font-medium">
      SIZE: {selectedSize ?? 'Select'}
    </span>
    <button 
      class="text-gray-400 text-sm underline"
      onclick={() => isSizeGuideOpen = true}
    >
      Size Guide
    </button>
  </div>
  
  <div class="flex gap-2">
    {#each variants as variant (variant.id)}
      {@const isOutOfStock = variant.stock_count === 0}
      {@const isSelected = selectedSize === variant.size}
      
      <button
        type="button"
        disabled={isOutOfStock}
        onclick={() => selectedSize = variant.size}
        class="w-12 h-12 rounded-md font-bold transition-all
               {isSelected 
                 ? 'bg-white text-black' 
                 : 'bg-neutral-800 text-white border border-neutral-700'}
               {isOutOfStock ? 'opacity-30 cursor-not-allowed line-through' : ''}"
      >
        {variant.size}
      </button>
    {/each}
  </div>
</div>
```

---

## 9. Quantity Widget

```svelte
<script lang="ts">
  let { value = $bindable(), max = 10 } = $props<{ value: number; max: number }>();
</script>

<div class="flex items-center gap-4">
  <button
    type="button"
    disabled={value <= 1}
    onclick={() => value = Math.max(1, value - 1)}
    class="w-10 h-10 rounded bg-neutral-800 text-white font-bold
           disabled:opacity-30 disabled:cursor-not-allowed"
  >
    −
  </button>
  
  <span class="w-8 text-center font-mono text-white text-xl">
    {value}
  </span>
  
  <button
    type="button"
    disabled={value >= max}
    onclick={() => value = Math.min(max, value + 1)}
    class="w-10 h-10 rounded bg-neutral-800 text-white font-bold
           disabled:opacity-30 disabled:cursor-not-allowed"
  >
    +
  </button>
</div>
```

---

## 10. Add to Cart Action

```ts
import { cart } from '$lib/stores/cart.svelte';

function handleAddToCart() {
  if (!selectedVariant || !canAddToCart) return;
  
  cart.addItem({
    variantId: selectedVariant.id,
    productId: product.id,
    productName: product.name,
    variantName: `Size ${selectedVariant.size}`,
    price: product.price,
    image: product.images.front?.sizes?.thumbnail?.url ?? product.images.front?.url,
    quantity
  });
  
  // Reset selection
  quantity = 1;
  
  // Show feedback (could open cart drawer)
  // isCartOpen = true;
}
```

---

## 11. Image Viewer Modal

```svelte
{#if isImageModalOpen}
  <div 
    class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
    role="dialog"
    aria-modal="true"
  >
    <!-- Close Button -->
    <button 
      class="absolute top-4 right-4 text-white p-2"
      onclick={() => isImageModalOpen = false}
    >
      <XIcon size={24} />
    </button>
    
    <!-- Navigation -->
    <button 
      class="absolute left-4 text-white p-2"
      onclick={() => imageModalIndex = (imageModalIndex - 1 + galleryImages.length) % galleryImages.length}
    >
      <ChevronLeftIcon size={32} />
    </button>
    
    <!-- Image -->
    <img 
      src={galleryImages[imageModalIndex]?.url} 
      alt={product.name}
      class="max-w-[90vw] max-h-[80vh] object-contain"
    />
    
    <button 
      class="absolute right-4 text-white p-2"
      onclick={() => imageModalIndex = (imageModalIndex + 1) % galleryImages.length}
    >
      <ChevronRightIcon size={32} />
    </button>
  </div>
{/if}
```

---

## 12. Suggested Pairings Data Transform

```ts
// In +page.server.ts or client-side
function buildMasonryItems(
  relatedProducts: Product[],
  relatedMedia: MediaCard[]
): MasonryItem[] {
  const productItems: MasonryItem[] = relatedProducts.map(p => ({
    id: `p-${p.id}`,
    type: 'product',
    product: transformToCardProps(p)
  }));
  
  const mediaItems: MasonryItem[] = relatedMedia.map(m => ({
    id: `m-${m.id}`,
    type: 'media',
    media: {
      mediaURL: typeof m.media === 'string' ? m.media : m.media.url,
      title: m.name ?? '',
      taggedProducts: m.tagged_products?.map(p => 
        typeof p === 'string' ? p : p.slug ?? p.id
      ) ?? []
    }
  }));
  
  // Interleave and shuffle
  return shuffle([...productItems, ...mediaItems]);
}
```

---

## 13. Styling Notes

| Element | Tailwind Classes |
|---------|------------------|
| Product title | `text-3xl font-black uppercase tracking-tight text-white` |
| Price | `text-xl font-mono text-gray-300` |
| Add to Cart button | `w-full py-4 bg-white text-black font-bold uppercase rounded-lg` |
| Add to Cart disabled | `opacity-50 cursor-not-allowed` |
| Description list | `text-gray-400 space-y-2 list-disc list-inside` |

---

## 14. Edge Cases

| Scenario | Handling |
|----------|----------|
| Product not found | Show 404 page |
| No variants available | Hide size selector, disable add to cart |
| All sizes out of stock | Show "Sold Out" state |
| Missing images | Use placeholder or show fewer slots |
| No related products | Hide suggested section or show media only |
| Quantity > stock | Cap at available stock |
