# Utility Functions Documentation

## Overview
Pure utility functions for common operations. All functions are stateless and side-effect free (except where explicitly noted).

## Files

### `string.ts`
**String manipulation utilities**

**Functions:**
- `generateOrderId(): string`
  - Generates random alphanumeric Order ID
  - Format: `BP-XXXXXXXX` (8 uppercase chars)
  - Used in checkout flow

- `truncate(text: string, maxLength: number = 50): string`
  - Truncates text with ellipsis
  - Returns original if under maxLength
  - Used for product names in cards

---

### `date.ts`
**Date/time utilities**

**Functions:**
- `calculateCountdown(targetDate: string): CountdownResult`
  - Returns object with `{ days, hours, minutes, seconds, isExpired }`
  - Used for drop countdowns
  - Updates every second in UI

- `formatDate(dateString: string, locale: string = 'en-US'): string`
  - Locale-aware date formatting
  - Example output: "December 4, 2025"

---

### `array.ts`
**Array manipulation utilities**

**Functions:**
- `shuffle<T>(array: T[]): T[]`
  - Fisher-Yates shuffle algorithm
  - Non-mutating (returns new array)
  - Used for randomizing masonry grid order

- `interleave<T, U>(array1: T[], array2: U[]): (T | U)[]`
  - Merges two arrays alternately
  - Used for mixing products + media cards

**Example:**
```typescript
import { shuffle, interleave } from '$lib/utils/array';

const products = [p1, p2, p3];
const media = [m1, m2];

const mixed = interleave(products, media);
// Result: [p1, m1, p2, m2, p3]

const randomized = shuffle(mixed);
```

---

### `guards.ts`
**Type guards and media helpers**

**Type Guards:**
- `isProduct(value: unknown): value is Product`
- `isMediaAsset(value: unknown): value is MediaAsset`
- `isVariant(value: unknown): value is Variant`

Used to check if Payload relationships are populated objects vs ID strings.

**Media URL Extractors:**
- `getMediaUrl(media: string | MediaAsset | null | undefined): string | null`
  - Safe URL extraction from MediaAsset
  - Returns null if not populated

- `getThumbnailUrl(media: MediaAsset): string | null`
  - Extracts `sizes.thumbnail.url` with fallbacks

- `getCardUrl(media: MediaAsset): string | null`
  - Extracts `sizes.card.url` with fallbacks

**Example:**
```typescript
import { isProduct, getCardUrl } from '$lib/utils/guards';

if (isProduct(data.related_products?.[0])) {
  const product = data.related_products[0];
  const imageUrl = getCardUrl(product.images.front);
}
```

## Naming Conventions
- All functions: `camelCase`
- All exported as named exports
- No default exports
