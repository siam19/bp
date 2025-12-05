# State Management Documentation

## Overview
This directory contains Svelte 5 Runes-based global state stores. All stores use the `$state` rune pattern and are exported as singleton instances.

## Files

### `cart.svelte.ts`
**Shopping Cart State Management**

Manages the global shopping cart with automatic localStorage persistence.

**Class:** `CartState`
- **Properties:**
  - `items: CartItem[]` - Array of cart items
  - `total` (getter) - Calculated total price
  - `itemCount` (getter) - Total quantity of items

- **Methods:**
  - `addItem(item: CartItem)` - Add item or increment quantity
  - `removeItem(variantId: string)` - Remove item from cart
  - `updateQuantity(variantId: string, quantity: number)` - Update item quantity
  - `clear()` - Empty the cart

**Usage:**
```typescript
import { cart } from '$lib/stores/cart.svelte';

// Add to cart
cart.addItem({
  variantId: 'variant-123',
  productId: 'product-abc',
  productName: 'Cyber Jacket',
  variantName: 'Size M',
  price: 1200,
  image: '/images/jacket.jpg',
  quantity: 1
});

// Access state
console.log(cart.total); // Reactive getter
console.log(cart.itemCount);
```

---

### `ui.svelte.ts`
**UI State Management**

Manages global UI element states (modals, sheets, menus).

**Class:** `UIState`
- **Properties:**
  - `cartSheetOpen: boolean` - Cart sidebar visibility
  - `mobileMenuOpen: boolean` - Mobile menu visibility

- **Methods:**
  - `openCartSheet()`, `closeCartSheet()`, `toggleCartSheet()`
  - `openMobileMenu()`, `closeMobileMenu()`, `toggleMobileMenu()`

**Usage:**
```typescript
import { ui } from '$lib/stores/ui.svelte';

// In component
<button onclick={() => ui.toggleCartSheet()}>
  Open Cart
</button>

{#if ui.cartSheetOpen}
  <CartSheet />
{/if}
```

## Pattern Notes
- All stores use Svelte 5 `$state` rune for reactivity
- Singleton pattern: one instance shared across app
- No need for `subscribe()` - just access properties directly
- `$effect` used for side effects (localStorage, DOM)
