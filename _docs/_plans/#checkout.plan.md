# Checkout Page (`/checkout`) Implementation Plan

## Route: `src/routes/checkout/+page.svelte`

## 1. Overview

The Checkout Page is the final purchase funnel step. Key responsibilities:
1. Generate an Order ID immediately on load
2. Create a "Visit" record for analytics
3. Collect delivery information
4. Handle payment method selection (COD vs bKash)
5. Submit order and redirect to receipt

---

## 2. Data Requirements

### A. Client-Side Cart Data

Cart data comes from the client-side cart store, not server.

```ts
import { cart } from '$lib/stores/cart.svelte';
```

### B. Server Actions (`+page.server.ts`)

| Action | Endpoint | Purpose |
|--------|----------|---------|
| **createVisit** | `POST /api/visits` | Track checkout initiation |
| **createOrder** | `POST /api/orders` | Submit final order |

### C. Type Imports

```ts
import type { CartItem, CustomerInfo, Order } from '$lib/types';

interface CheckoutFormState {
  name: string;
  phone: string;
  address: string;
  city: 'Inside Dhaka' | 'Outside Dhaka';
  notes: string;
  timeframe: 'Morning' | 'Afternoon' | 'Evening' | null;
}
```

---

## 3. Component Architecture

### A. Reusable Components (Already Exist)

| Component | Usage | Location |
|-----------|-------|----------|
| `Navbar` | Page header | `$lib/components/site/Navbar.svelte` |

### B. Page-Specific Components (To Build)

| Component | Description | Priority |
|-----------|-------------|----------|
| `DeliveryForm` | Customer info form fields | HIGH |
| `PaymentSelector` | COD vs bKash radio group | HIGH |
| `OrderSummary` | Read-only cart items display | MEDIUM |
| `CitySelector` | Inside/Outside Dhaka toggle | MEDIUM |
| `TimeframeSelector` | Delivery time preference | LOW |

---

## 4. State Management (Svelte 5 Runes)

```ts
// Order tracking
let orderId = $state<string>('');
let visitorId = $state<string | null>(null);

// Form state
let formState = $state<CheckoutFormState>({
  name: '',
  phone: '',
  address: '',
  city: 'Inside Dhaka',
  notes: '',
  timeframe: null
});

// Payment state
let paymentMethod = $state<'COD' | 'BKASH'>('COD');

// UI state
let isSubmitting = $state(false);
let submitError = $state<string | null>(null);

// Validation
let isFormValid = $derived(
  formState.name.trim() !== '' &&
  formState.phone.trim() !== '' &&
  formState.address.trim() !== '' &&
  cart.items.length > 0
);
```

---

## 5. Implementation Steps

### Phase 1: Initialization
1. [ ] Generate alphanumeric Order ID on mount
2. [ ] Create Visit record in background (POST /api/visits)
3. [ ] Capture IP/User-Agent for visit

### Phase 2: Form UI
4. [ ] Build `DeliveryForm.svelte` with all fields
5. [ ] Build `CitySelector.svelte` (Inside/Outside Dhaka)
6. [ ] Build `TimeframeSelector.svelte` (optional)
7. [ ] Build `OrderSummary.svelte` displaying cart items

### Phase 3: Payment Selection
8. [ ] Build `PaymentSelector.svelte` with radio buttons
9. [ ] Add bKash brand color highlight when selected
10. [ ] Display payment-specific info text

### Phase 4: Submission
11. [ ] Validate form before submission
12. [ ] Build order payload from form + cart
13. [ ] Submit order via form action
14. [ ] Redirect based on payment method

---

## 6. Order ID Generation

```ts
function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BP-${timestamp}-${random}`;
}

// Example output: "BP-M3K9X2-A4F7"
```

---

## 7. Visit Creation (Background)

```ts
import { onMount } from 'svelte';

onMount(async () => {
  orderId = generateOrderId();
  
  // Background visit creation - don't block UI
  try {
    const response = await payloadClient.createVisit({
      visitor_id: orderId, // Use order ID as visitor correlation
      cart_snapshot: cart.items,
      // IP and user_agent captured server-side
    });
    visitorId = response.doc.id;
  } catch (err) {
    // Silent fail - visit tracking is non-critical
    console.warn('Failed to create visit record:', err);
  }
});
```

---

## 8. Payment Selector Component

```svelte
<script lang="ts">
  let { value = $bindable() } = $props<{ value: 'COD' | 'BKASH' }>();
</script>

<div class="flex gap-4">
  <button
    type="button"
    onclick={() => value = 'COD'}
    class="flex-1 py-4 rounded-lg border-2 transition-all
           {value === 'COD' 
             ? 'border-white bg-white text-black' 
             : 'border-neutral-700 bg-transparent text-white'}"
  >
    <span class="font-bold">COD</span>
    <span class="text-sm block opacity-70">Cash on Delivery</span>
  </button>
  
  <button
    type="button"
    onclick={() => value = 'BKASH'}
    class="flex-1 py-4 rounded-lg border-2 transition-all
           {value === 'BKASH' 
             ? 'border-[#E2136E] bg-[#E2136E] text-white' 
             : 'border-neutral-700 bg-transparent text-white'}"
  >
    <span class="font-bold">bKash</span>
    <span class="text-sm block opacity-70">Send Money</span>
  </button>
</div>
```

---

## 9. Order Submission Flow

```ts
async function handleSubmit() {
  if (!isFormValid) return;
  
  isSubmitting = true;
  submitError = null;
  
  try {
    // Build order payload
    const orderPayload = {
      id: orderId, // Pre-generated
      customer_info: {
        name: formState.name,
        phone: formState.phone,
        address: formState.address,
        delivery_area: formState.city,
        notes: formState.notes || undefined,
        delivery_timeframe: formState.timeframe || undefined
      },
      items: cart.items.map(item => ({
        item_type: 'existing_product' as const,
        product: item.productId,
        variant: item.variantId,
        price: item.price,
        quantity: item.quantity
      })),
      total_amount: cart.total,
      payment_method: paymentMethod,
      status: 'PENDING',
      visitor_id: visitorId
    };
    
    // Submit order
    await payloadClient.createOrder(orderPayload);
    
    // Clear cart
    cart.clear();
    
    // Redirect based on payment method
    if (paymentMethod === 'BKASH') {
      goto(`/receipt/${orderId}?status=pending`);
    } else {
      goto(`/receipt/${orderId}?status=confirmed`);
    }
  } catch (err) {
    submitError = 'Failed to place order. Please try again.';
  } finally {
    isSubmitting = false;
  }
}
```

---

## 10. Order Summary Component

```svelte
<script lang="ts">
  import { cart } from '$lib/stores/cart.svelte';
</script>

<div class="bg-neutral-900 rounded-lg p-4">
  <h3 class="text-white font-bold mb-4">Order Summary</h3>
  
  <div class="space-y-3">
    {#each cart.items as item (item.variantId)}
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img 
            src={item.image} 
            alt={item.productName}
            class="w-12 h-12 rounded object-cover"
          />
          <div>
            <p class="text-white text-sm">{item.productName}</p>
            <p class="text-gray-500 text-xs">
              {item.variantName} × {item.quantity}
            </p>
          </div>
        </div>
        <p class="text-white font-mono">
          {(item.price * item.quantity).toLocaleString()} ৳
        </p>
      </div>
    {/each}
  </div>
  
  <div class="border-t border-neutral-700 mt-4 pt-4 flex justify-between">
    <span class="text-white font-bold">Total</span>
    <span class="text-white font-bold font-mono">
      {cart.total.toLocaleString()} ৳
    </span>
  </div>
</div>
```

---

## 11. Styling Notes

| Element | Tailwind Classes |
|---------|------------------|
| Form container | `max-w-md mx-auto px-4 py-6` |
| Input field | `w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white` |
| Input label | `text-white font-medium mb-1 block` |
| City selector | `flex gap-2` with toggle buttons |
| Submit button | `w-full py-4 bg-white text-black font-bold rounded-lg` |
| Submit disabled | `opacity-50 cursor-not-allowed` |
| bKash color | `#E2136E` |

---

## 12. Form Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| Name | Required, min 2 chars | "Name is required" |
| Phone | Required, BD format | "Valid phone number required" |
| Address | Required, min 10 chars | "Full address required" |
| City | Required (has default) | — |
| Cart | At least 1 item | "Cart is empty" |

---

## 13. Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty cart | Redirect to home or show empty state |
| Visit creation fails | Continue without blocking checkout |
| Order submission fails | Show error, allow retry |
| Network timeout | Show timeout message with retry |
| Back button after submit | Cart already cleared, show order status |
| Page refresh mid-checkout | Re-generate order ID, create new visit |
