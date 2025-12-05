# Architectural Patterns & Standards

**Platform:** SvelteKit + Cloudflare Pages + Payload CMS (Backend).

## 1. Context Loading Strategy (CRITICAL)
Before coding in any route, you must respect the **Context Hierarchy**:
1.  **Global Context**: This file, `#app.types.md`, `#app.stylekit.md`.
2.  **Local Context**: The `#[pageName].spec.md` file in the route directory. This is the functional authority.
3.  **Visual Reference**: The `#[pageName].layout.html` file. Use for structure, ignore raw styles.

## 2. State Management (Svelte 5 Runes)
We use Svelte 5's reactivity system exclusively.
-   **Global State**: Use `$state` classes exported as singletons (e.g., `cart.svelte.ts`).
-   **Local State**: Use `$state` for component-level logic.
-   **Derived State**: Use `$derived` for values calculated from state (e.g., `cart.total`).
-   **Side Effects**: Use `$effect` for persistence (localStorage) or DOM interactions.

```typescript
// Example: Cart State Pattern
class CartState {
    items = $state<CartItem[]>([]);
    
    get total() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    addItem(item: CartItem) {
        // Logic
    }
}
export const cart = new CartState();
```

## 3. Data Loading Pattern
-   **Server-First**: Fetch critical data in `+page.server.ts` using `load` functions.
-   **Type Safety**: Import types from `$lib/types` (mapped to `#app.types.md`).
-   **Client-Side Fetching**: Use only for non-critical, lazy-loaded data (e.g., Infinite Scroll, Dynamic Filters) or interactions (e.g., "Notify Me").

## 4. Mutation Pattern (Form Actions)
-   **Critical Writes**: Use SvelteKit **Form Actions** (`+page.server.ts` -> `actions`) for robust data submission (Checkout, Contact).
-   **Enhancement**: Use `use:enhance` to provide a SPA-like experience over standard form submissions.

## 5. Component Architecture
-   **Naming**: PascalCase for components (e.g., `DropCarousel.svelte`).
-   **Props**: Use the `$props()` rune.
    ```svelte
    <script>
        let { title, active = false } = $props();
    </script>
    ```
-   **Placeholder Rule**: If a `layout.html` shows a generic element that matches a known component (e.g., Navbar, ProductCard), replace it with the actual Svelte component.

## 6. Styling & Visuals
-   **Source of Truth**: `#app.stylekit.md`.
-   **Tailwind**: Use utility classes. Avoid arbitrary values (e.g., `w-[123px]`) unless strictly necessary for pixel-perfect layouts defined in specs.
-   **Touch Emulation**: Implement "grab-and-drag" scrolling for horizontal lists on desktop to match mobile behavior.
