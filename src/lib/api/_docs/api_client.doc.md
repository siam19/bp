## Module Overview

`src/lib/api/payload.ts` centralizes all public Payload CMS access for the SvelteKit frontend. It exposes:

- `createPayloadClient(config?)`: factory for custom clients (e.g., alternate base URL, custom `fetch`).
- `payloadClient`: default singleton using `https://admin.banglapunk.com/api` or `VITE_PAYLOAD_API_BASE` when set.
- Typed helpers for public collections (`products`, `variants`, `drops`, `media`, `media-cards`, `pages`).
- Typed mutations for the public create endpoints (`contact-requests`, `notifiers`, `visits`).
- **Authentication helpers** (`login`, `logout`, `me`) for user session management.
- Shared response utilities (`PaginatedResponse`, `PayloadCreateResponse`) and `PayloadRequestError` for consistent error handling.

## Usage Patterns

### Data Fetching

```ts
import { payloadClient } from '$lib';

const products = await payloadClient.listProducts({
	query: {
		'where[status][equals]': 'AVAILABLE',
		limit: 12
	}
});

const contact = await payloadClient.createContactRequest({
	name: 'Site Visitor',
	contact_info: 'visitor@example.com',
	department: 'Sales',
	message: 'Hello!'
});
```

### Authentication

```ts
// Login (sets HTTP-Only cookie)
const { user, token } = await payloadClient.login({
  email: 'user@example.com',
  password: 'password123'
});

// Check Session
const { user } = await payloadClient.me();

// Logout
await payloadClient.logout();
```

- Prefer `list*` helpers for pagination; they return the raw Payload pagination envelope to allow infinite-scroll implementations.
- `create*` helpers wrap POSTs and resolve to `{ doc, message }` bodies; destructure as needed.
- For server-side load functions, pass the provided `fetch` via the options object to reuse SvelteKit’s internal fetch implementation (`payloadClient.listProducts({ fetch })`).

## Configuration

- `VITE_PAYLOAD_API_BASE` overrides the default base URL (useful for staging environments).
- `createPayloadClient({ fetch, baseUrl })` is the escape hatch when you need full control (e.g., dependency injection during tests).

## Errors & Retry Strategy

- Every helper throws `PayloadRequestError` on non-2xx responses, exposing `status` and parsed `data`. Handle recoverable cases (e.g., network hiccups) with try/catch in the caller.
- The module automatically detects JSON responses; non-JSON payloads are logged and returned as raw text for debugging.

## Extending the Client

1. Add any **new shared helpers** in `src/lib/api/payload.ts` following the existing patterns (`listX`, `getX`, `createX`).
2. Export those helpers via `src/lib/index.ts` so `$lib` consumers can import them.
3. **Document new helpers** by creating/expanding a file in `src/lib/api/_docs/` (e.g., `#new-client.doc.md`). This rule applies to all similar modules going forward.
