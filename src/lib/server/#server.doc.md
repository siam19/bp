# Server-Side Utilities Documentation

## Overview
Server-only modules for SvelteKit `+page.server.ts` and `+server.ts` files. These modules **MUST NOT** be imported in client-side code.

## Files

### `api.ts`
**Payload CMS API wrapper with error handling**

**Functions:**

#### `createServerPayloadClient(event: RequestEvent)`
Creates a Payload client configured with SvelteKit's server-side fetch.

**Usage in `+page.server.ts`:**
```typescript
import { createServerPayloadClient } from '$lib/server/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const api = createServerPayloadClient(event);
  
  const products = await api.listProducts({
    query: {
      where: { status: { equals: 'AVAILABLE' } },
      limit: 12
    }
  });
  
  return { products };
};
```

---

#### `handleApiError(err: unknown, fallbackStatus: number = 500): never`
Converts Payload errors to SvelteKit errors with appropriate HTTP status codes.

**Usage:**
```typescript
import { handleApiError } from '$lib/server/api';

export const load: PageServerLoad = async (event) => {
  try {
    const product = await api.getProduct(params.id);
    return { product };
  } catch (err) {
    handleApiError(err, 404); // Throws SvelteKit error
  }
};
```

---

#### `safeApiCall<T>(promise: Promise<T>): Promise<T | null>`
Safe wrapper that returns `null` on error instead of throwing.

**Usage:**
```typescript
import { safeApiCall } from '$lib/server/api';

export const load: PageServerLoad = async (event) => {
  const [products, drops] = await Promise.all([
    safeApiCall(api.listProducts()),
    safeApiCall(api.listDrops())
  ]);
  
  // Handle null results gracefully
  return {
    products: products?.docs || [],
    drops: drops?.docs || []
  };
};
```

## Best Practices
- Always use `createServerPayloadClient(event)` in load functions
- Use `handleApiError()` for critical data (404s, etc.)
- Use `safeApiCall()` for optional/supplementary data
- Never import these modules in client components
