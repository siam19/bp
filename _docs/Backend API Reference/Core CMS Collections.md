# Document 3: Core Platform Reference

## Overview
The core platform group encompasses the foundational components of the content management system: Pages, authentication management (Users), and asset storage (Media). This section details the highly specialized endpoints and non-standard request methodologies required for Users and Media[^5][^6].

## 1. Pages
**Endpoint:** `/api/pages`
**Slug:** `pages`

The pages collection is critical for content rendering on the public application interface. It utilizes flexible content layouts that often reference other collections[^1].

### Type Definition (Response Schema)
```typescript
export interface Page {
  id: string;
  title: string;
  slug?: string | null;
  /**
   * Flexible layout builder referencing internal blocks or relationships.
   */
  layout?: (
      | {
          blockType: 'content';
          rich_text?: { root: { children: any[]; ... } }; // Complex nested structure
          id?: string | null;
        }
      | {
          blockType: 'media';
          media: string | Media; // Expanded if ?populate=layout.media
          caption?: string | null;
          size?: ('full' | 'wide' | 'half') | null;
        }
    )[] | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
````

### Request & Response Behaviors

  * **Deep Retrieval Strategy (`GET /api/pages/:id`):**
      * **Challenge:** Pages nest relationships (e.g., a "Featured Product" block) deep within the `layout` array[^1].
      * **Solution:** Successful retrieval requires aggressive use of `depth` and `populate` to ensure all nested content blocks and linked media assets are fully resolved in a single API request[^1].
      * **Example:** `?depth=2&populate=layout.media` ensures the client doesn't need to make secondary requests for images found inside layout blocks.

-----

## 2\. Users (Authentication)

**Endpoint:** `/api/users`
**Slug:** `users`

The users collection enables authentication and exposes specialized identity management endpoints in addition to standard CRUD[^3].

### Type Definition (Response Schema)

```typescript
export interface User {
  id: string;
  email: string;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  /**
   * Active session tracking
   */
  sessions?: {
      id: string;
      createdAt?: string | null;
      expiresAt: string;
    }[] | null;
  updatedAt: string;
  createdAt: string;
  // Note: 'password', 'salt', and 'hash' are typically hidden from API responses
}
```

### Specialized Authentication Endpoints

These operations manage user sessions via HTTP-Only Cookies (recommended) or JWTs[^3].

| Operation | Method | Path | Description |
| :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/api/users/login` | **Body:** `{ "email": "...", "password": "..." }`<br>**Response:** Returns the user object and sets the HTTP-Only cookie (if configured)[^3]. |
| **Me** | `GET` | `/api/users/me` | **Purpose:** Validates the current session/token.<br>**Response:** Returns the user profile if authenticated; otherwise returns `null`[^3]. |
| **Logout** | `POST` | `/api/users/logout` | **Purpose:** Instructs the server to clear the `payload_token` HTTP-Only cookie, terminating the session[^7]. |
| **Access** | `GET` | `/api/access` | **Purpose:** Returns a granular JSON object detailing the user's permissions across all collections. Essential for UI logic (e.g., hiding "Edit" buttons)[^2]. |

-----

## 3\. Media (File Uploads)

**Endpoint:** `/api/media`
**Slug:** `media`

The media collection modifies standard CRUD operations to accommodate file storage[^5][^8].

### Type Definition (Response Schema)

```typescript
export interface Media {
  id: string;
  alt?: string | null;
  caption?: string | null;
  url?: string | null;          // The direct URL to the file
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  /**
   * Auto-generated image derivatives
   */
  sizes?: {
    thumbnail?: { url?: string | null; width?: number; ... };
    card?: { url?: string | null; width?: number; ... };
  };
  updatedAt: string;
  createdAt: string;
}
```

### specialized Request Behaviors

  * **Create/Upload (`POST`):**
      * **Format:** STRICTLY `multipart/form-data`[^5].
      * **Field `file`:** The raw file data[^5].
      * **Field `_payload`:** A **JSON-stringified** object containing all other fields (e.g., `{"alt": "Logo", "caption": "Main Logo"}`)[^5].
      * *Warning:* Failure to stringify metadata into `_payload` will result in errors[^5].
  * **Update (`PATCH`):**
      * Sending a new file via `multipart/form-data` automatically replaces the old asset and regenerates sizes[^5].
  * **Delete (`DELETE`):**
      * Removing the document automatically deletes the physical file and all size derivatives from storage[^8].

---

## Works Cited

[^1]: [REST API | Documentation - Payload CMS](https://payloadcms.com/docs/rest-api/overview)
[^2]: [Access Control | Documentation - Payload CMS](https://payloadcms.com/docs/access-control/overview)
[^3]: [Authentication Overview | Documentation - Payload CMS](https://payloadcms.com/docs/authentication/overview)
[^5]: [Upload Field | Documentation - Payload CMS](https://payloadcms.com/docs/fields/upload)
[^6]: [Authentication Operations | Documentation - Payload CMS](https://payloadcms.com/docs/authentication/operations)
[^7]: [Logout method not availiable on local api · Issue #8631 · payloadcms/payload - GitHub](https://github.com/payloadcms/payload/issues/8631)
[^8]: [Uploads | Documentation | Payload](https://payloadcms.com/docs/upload/overview)

<!-- end list -->

```
