# Masonry Grid Implementation

## Overview

The masonry grid layout displays a mixed collection of `ProductCard` and `MediaCard` components in a responsive, Pinterest-style layout using the `svelte-bricks` library. The implementation ensures optimal visual distribution across different screen sizes while maintaining type safety.

---

## Components

### 1. ProductCard (`/src/lib/components/site/ProductCard.svelte`)

**Purpose**: Displays product information in a consistent card format with square aspect ratio images.

**Key Features**:
- **Fixed aspect ratio**: Uses `aspect-square` for the image container to ensure all product images are 1:1 ratio
- **Responsive width**: `w-full` allows the card to fill its column width (controlled by masonry)
- **Vertical spacing**: `mb-4` provides consistent gap between cards within a column
- **Product details**: Displays product name, available sizes, price in BDT
- **Interactive arrow**: Top-right arrow icon for navigation

**Layout Structure**:
```svelte
<div class="w-full bg-white rounded-md mb-4">
  <div class="aspect-square">  <!-- 1:1 image -->
    <img ... />
  </div>
  <div class="grid grid-cols-4">  <!-- Product info grid -->
    <!-- Name, sizes, price -->
  </div>
</div>
```

**Props**:
- `product: ProductCardProps` - Contains productName, productImages[], price, availableSizes[], productId

---

### 2. MediaCard (`/src/lib/components/site/MediaCard.svelte`)

**Purpose**: Displays video or image media with interactive hover states and a modal preview for tagged products.

**Key Features**:
- **Media type detection**: Automatically detects video vs image based on file extension
- **Natural aspect ratio**: Uses `w-full h-auto` to preserve the media's intrinsic dimensions
- **Auto-playing video**: Videos loop muted by default
- **Hover interaction**:
  - Video pauses on hover/focus
  - Gradient overlay appears showing tagged product count
  - Cursor changes to pointer
- **Click to expand**: Opens modal with larger preview and tagged products list
- **Vertical spacing**: `mb-4` matches ProductCard spacing

**Interactive States**:
1. **Default**: Video auto-plays muted in loop
2. **Hover/Focus**: Video pauses, gradient overlay with shopping bag icon appears
3. **Click**: Opens full-screen modal

**Modal Features**:
- 80% max viewport width/height
- Two-column layout (video | product details)
- Scrollable two-column grid for tagged products
- Keyboard accessible (Escape to close)
- Click outside to close

**Props**:
- `media: MediaCardProps` - Contains mediaURL, title, taggedProducts[]

**Video Extensions Supported**:
```typescript
["mp4", "webm", "ogg", "ogv", "mov", "m4v", "avi"]
```

---

## Masonry Grid Implementation

### Technology: `svelte-bricks`

A lightweight Svelte masonry layout component that uses CSS Grid for column distribution.

### Configuration (`/src/routes/masonry/+page.svelte`)

```svelte
<Masonry 
    {items} 
    idKey="id"
    minColWidth={164}
    maxColWidth={364}
    gap={16}
    {calcCols}
    class="px-4 py-8"
>
```

**Props Explained**:

| Prop | Value | Purpose |
|------|-------|---------|
| `items` | `MasonryItem[]` | Array of mixed product/media items |
| `idKey` | `"id"` | Unique identifier field for each item |
| `minColWidth` | `164` | Minimum column width in px |
| `maxColWidth` | `364` | Maximum column width in px |
| `gap` | `16` | Space between columns and items in px |
| `calcCols` | `function` | Custom column calculation |

### Custom Column Calculation

```typescript
function calcCols(masonryWidth: number, minColWidth: number, gap: number): number {
    // Force 2 columns for viewports < 768px
    if (masonryWidth < 768) {
        return 2;
    }
    
    // Calculate columns based on available width
    const defaultCols = Math.floor((masonryWidth + gap) / (minColWidth + gap)) || 1;
    
    // Cap at 5 columns maximum
    return Math.min(5, defaultCols);
}
```

**Responsive Behavior**:
- **Mobile (< 768px)**: Fixed 2 columns
- **Tablet (768px - 1200px)**: 3-4 columns (calculated)
- **Desktop (> 1200px)**: 4-5 columns (max 5)

### Type-Safe Rendering

Uses Svelte 5 snippets with discriminated union types:

```svelte
{#snippet children({ item }: { item: MasonryItem })}
    {#if item.type === 'product'}
        <ProductCard product={item.product} />
    {:else if item.type === 'media'}
        <MediaCard media={item.media} />
    {/if}
{/snippet}
```

**Type Definition**:
```typescript
type MasonryItem =
    | { id: string; type: 'product'; product: ProductCardProps }
    | { id: string; type: 'media'; media: MediaCardProps };
```

---

## Data Flow

### Server-Side Data Generation (`/src/routes/masonry/+page.server.ts`)

1. **Define product data**: 8 ProductCardProps objects with images, prices, sizes
2. **Define media data**: 8 MediaCardProps objects with video URLs and tagged products
3. **Interleave items**: Alternate between products and media
4. **Shuffle array**: Randomize order to prevent same-type stacking in columns
5. **Return to page**: `{ items: shuffledItems }`

**Shuffle Algorithm**:
```typescript
function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
```

**Why Shuffle?**  
Prevents videos/images of the same aspect ratio from stacking vertically in columns, creating better visual variety.

---

## Key Design Decisions

### 1. **Width Management**
- Both cards use `w-full` to fill column width
- No external margins (masonry handles spacing via `gap`)
- Cards adapt to column width set by masonry's `minColWidth`/`maxColWidth`

### 2. **Aspect Ratio Strategy**
- **ProductCard**: Fixed `aspect-square` for consistency
- **MediaCard**: Natural aspect ratio (`h-auto`) to preserve video/image proportions

### 3. **Vertical Spacing**
- Both cards have `mb-4` (1rem bottom margin)
- Provides consistent spacing within columns
- Complements masonry's horizontal `gap`

### 4. **Performance Optimizations**
- Videos: `autoplay`, `playsinline`, `muted` for mobile compatibility
- Images: `loading="lazy"` for deferred loading
- Masonry: FLIP animations for smooth rearrangement

### 5. **Accessibility**
- ProductCard: Semantic HTML with proper alt text
- MediaCard: Button with focus states, keyboard navigation in modal
- Modal: `role="dialog"`, `aria-modal="true"`, Escape key support

---

## Column Distribution Algorithm

Svelte-bricks distributes items using a **round-robin** approach:

1. Calculate number of columns based on viewport width
2. Create empty column arrays: `[[], [], [], ...]`
3. Distribute items: `item[0] → col[0]`, `item[1] → col[1]`, ... `item[n] → col[n % nCols]`

**Example with 3 columns**:
```
Items: [P1, M1, P2, M2, P3, M3, P4, M4]
       ↓
Col 0: [P1, M2, M3]
Col 1: [M1, P3, P4]
Col 2: [P2, M2]
```

This is why shuffling is important—without it, similar items (same aspect ratio) can stack in the same column.

---

## Future Enhancements

### Potential Improvements:
1. **Smart distribution**: Weight-based algorithm to balance column heights
2. **Lazy loading**: Load videos only when near viewport
3. **Infinite scroll**: Load more items as user scrolls
4. **Filter/Sort**: Allow users to filter by product type or sort by price
5. **Skeleton loading**: Show placeholders while media loads
6. **Animation controls**: Allow users to disable video autoplay

---

## Technical Stack

- **Framework**: SvelteKit (Svelte 5)
- **Masonry**: `svelte-bricks` v0.3.2
- **Styling**: Tailwind CSS v4
- **Icons**: `@lucide/svelte`
- **Type Safety**: TypeScript with discriminated unions
