## Plan: Implement Backend API v2.1 (Shop API & Image Delivery)

This plan outlines the migration to the new **Shop API** endpoints and the **Cloudflare R2** image delivery strategy. The Shop API provides optimized, simplified JSON responses for the frontend, replacing the heavy Admin API calls.

### Steps

1.  **Define Shop API Types**
    - Update `src/lib/types.ts` to include `ShopProduct`, `ShopDrop`, `ShopInfoPage`, and `ShopImage` interfaces matching the v2.1 documentation.
    - These types will reflect the simplified structure (e.g., `filename` instead of full media objects).

2.  **Implement Image Utility**
    - Create `src/lib/utils/media.ts`.
    - Define `MEDIA_BASE_URL = 'https://payload.banglapunk.com'`.
    - Implement `getMediaUrl(filename: string)` to construct full URLs.
    - Implement `resolveShopImage(image: ShopImage)` helper to safely get URLs from the new shape.

3.  **Update Payload Client**
    - Modify `src/lib/api/payload.ts` to add Shop API methods:
        - `getShopProducts(options)`
        - `getShopProduct(slug)`
        - `getShopDrops(options)`
        - `getShopDrop(slug)`
        - `getShopInfoPage()`
    - Ensure these methods use the correct `/api/shop/...` endpoints.

4.  **Refactor Home Page Data Loading (`src/routes/+page.server.ts`)**
    - Replace `client.listDrops` and `client.listProducts` with `client.getShopDrops` and `client.getShopProducts`.
    - **Strategic Loading**: Prioritize the "Active Drop" and "Featured Products".
    - Map the simplified Shop API data to a structure usable by existing components, OR prepare components to accept `ShopProduct`.

5.  **Refactor Product & Drop Pages**
    - Update `src/routes/p/[product]/+page.server.ts` to use `getShopProduct(slug)`.
    - Update `src/routes/d/[drop]/+page.server.ts` to use `getShopDrop(slug)`.

6.  **Update Components for New Data Shape**
    - Update `MediaCard`, `ProductCard`, and `DropArchiveCard` to handle the new image structure (using `getMediaUrl`).
    - If necessary, create adapters to transform `ShopProduct` -> `Product` to avoid rewriting all component logic immediately.

### Further Considerations
1.  **Component Compatibility**: The `ShopProduct` type is lighter than the Admin `Product` type. Existing components accessing deep fields (like `meta`) might need checks.
2.  **Image Optimization**: The new image URL format is direct. Ensure we are using the correct variants (thumbnail vs full) if the API provides them (docs mention `thumbnail` in the image object).
3.  **Caching**: The Shop API is public and likely cached by Cloudflare. This improves performance significantly.