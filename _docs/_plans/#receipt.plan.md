# Receipt Page (`/receipt/[orderId]`) Implementation Plan

## Route: `src/routes/receipt/[orderId]/+page.svelte`

## 1. Overview

The Receipt Page is a dynamic post-purchase dashboard handling two distinct states:
1. **Pending Payment View** - bKash payment instructions (when payment_method=BKASH and status=PENDING)
2. **Standard Receipt View** - Order confirmation with tracking (COD or verified bKash)

Critical: PII is protected behind an identity verification modal.

---

## 2. Data Requirements

### A. Server-Side Data (`+page.server.ts`)

| Data | Source | API Call | Notes |
|------|--------|----------|-------|
| **Order** | `payloadClient.getOrder()` | `/api/orders/${params.orderId}?populate=items.product` | Requires access token or session |

### B. Access Control Strategy

```ts
// Orders have customer-level read access with special token
// Token can be passed via:
// 1. URL query param: ?token=xyz
// 2. SMS-delivered link
// 3. Session cookie (if user is logged in)
```

### C. Type Imports

```ts
import type { Order } from '$lib/types';

interface ReceiptPageData {
  order: Order;
  requiresIdentityVerification: boolean;
  showPaymentGuide: boolean; // payment_method === 'BKASH' && status === 'PENDING'
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
| `PaymentGuide` | Step-by-step bKash instructions | HIGH |
| `CopyButton` | Copy-to-clipboard with feedback | HIGH |
| `TrackingTimeline` | Visual order status tracker | HIGH |
| `IdentityModal` | Phone + SMS key verification | HIGH |
| `OrderItemsList` | Product list with quantities | MEDIUM |
| `LockedSection` | Blurred/locked content placeholder | MEDIUM |

---

## 4. State Management (Svelte 5 Runes)

```ts
// View state
let showPaymentGuide = $derived(
  order.payment_method === 'BKASH' && order.status === 'PENDING'
);

// Identity verification state
let isIdentityVerified = $state(false);
let verificationPhone = $state('');
let verificationKey = $state('');
let isVerifying = $state(false);
let verificationError = $state<string | null>(null);

// Copy feedback state
let copiedField = $state<'phone' | 'orderId' | null>(null);

// Derived unlocked state
let canViewPII = $derived(isIdentityVerified || !order.requiresVerification);
```

---

## 5. Implementation Steps

### Phase 1: Data Loading
1. [ ] Create `+page.server.ts` with order fetch
2. [ ] Handle token-based access from URL
3. [ ] Determine `showPaymentGuide` flag

### Phase 2: Payment Guide View
4. [ ] Build `PaymentGuide.svelte` with step-by-step layout
5. [ ] Build `CopyButton.svelte` with clipboard API
6. [ ] Add bKash number display (01533817247)
7. [ ] Add Order ID display with copy functionality
8. [ ] Include instructional GIF placeholders

### Phase 3: Standard Receipt View
9. [ ] Build `TrackingTimeline.svelte` with status steps
10. [ ] Build `OrderItemsList.svelte` for product display
11. [ ] Build `LockedSection.svelte` with blur effect

### Phase 4: Identity Verification
12. [ ] Build `IdentityModal.svelte` with form
13. [ ] Implement verification API call
14. [ ] Handle success/error states
15. [ ] Unlock PII sections on verification

---

## 6. Payment Guide Content

### bKash Instructions Structure

```svelte
<div class="payment-guide">
  <h2>How to Pay</h2>
  
  <!-- Step 1 -->
  <div class="step">
    <span class="step-number">1</span>
    <p>Open bKash app and go to <strong>Send Money</strong></p>
  </div>
  
  <!-- Target Number -->
  <div class="copy-box">
    <span class="number">01533817247</span>
    <CopyButton value="01533817247" label="Number" />
  </div>
  
  <!-- GIF placeholder -->
  <div class="gif-container">
    <img src="/guides/bkash-send-money.gif" alt="Send Money step" />
  </div>
  
  <!-- Step 2 -->
  <div class="step">
    <span class="step-number">2</span>
    <p>Use Order ID as <strong>Reference</strong></p>
  </div>
  
  <!-- Order ID -->
  <div class="copy-box">
    <span class="order-id">{order.id}</span>
    <CopyButton value={order.id} label="Order ID" />
  </div>
  
  <!-- Important Notice -->
  <div class="notice warning">
    <strong>Important!!</strong>
    <p>You must enter the Order ID in the Reference field</p>
  </div>
  
  <!-- Footer -->
  <p class="footer-text">
    You can close this tab. You will receive SMS with link to this page.
  </p>
</div>
```

---

## 7. Tracking Timeline States

| Status | Display | Icon |
|--------|---------|------|
| `PENDING` | "Order Placed" | 📦 |
| `PROCESSING` | "Processing" | ⚙️ |
| `SHIPPED` | "Shipped" | 🚚 |
| `DELIVERED` | "Delivered" | ✅ |
| `CANCELLED` | "Cancelled" | ❌ |

```ts
const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
let currentStepIndex = $derived(statusSteps.indexOf(order.status));
```

---

## 8. CopyButton Implementation

```svelte
<script lang="ts">
  let { value, label } = $props<{ value: string; label: string }>();
  let copied = $state(false);
  
  async function copyToClipboard() {
    await navigator.clipboard.writeText(value);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<button onclick={copyToClipboard} class="copy-btn">
  {#if copied}
    <CheckIcon /> Copied!
  {:else}
    <CopyIcon /> Copy {label}
  {/if}
</button>
```

---

## 9. Identity Modal Flow

```ts
async function verifyIdentity() {
  isVerifying = true;
  verificationError = null;
  
  try {
    // Call verification endpoint
    const response = await fetch('/api/verify-identity', {
      method: 'POST',
      body: JSON.stringify({
        orderId: order.id,
        phone: verificationPhone,
        key: verificationKey
      })
    });
    
    if (!response.ok) {
      throw new Error('Verification failed');
    }
    
    isIdentityVerified = true;
    // Close modal automatically
  } catch (err) {
    verificationError = 'Phone number or key does not match';
  } finally {
    isVerifying = false;
  }
}
```

---

## 10. Locked Section Pattern

```svelte
{#if canViewPII}
  <div class="section">
    <h3>Deliver To</h3>
    <p>{order.customer_info.name}</p>
    <p>{order.customer_info.phone}</p>
    <p>{order.customer_info.address}</p>
  </div>
{:else}
  <LockedSection title="Deliver To" onUnlock={() => showIdentityModal = true} />
{/if}
```

---

## 11. Styling Notes

| Element | Tailwind Classes |
|---------|------------------|
| Copy box | `bg-neutral-900 border border-neutral-700 rounded-lg p-4 flex justify-between` |
| Copy button | `bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded` |
| Step number | `w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold` |
| Warning notice | `bg-yellow-900/30 border border-yellow-600 rounded-lg p-4` |
| Locked section | `bg-neutral-900/50 backdrop-blur-sm border border-neutral-700` |
| Timeline active | `bg-green-500` |
| Timeline pending | `bg-neutral-700` |

---

## 12. Edge Cases

| Scenario | Handling |
|----------|----------|
| Invalid order ID | Show 404 error page |
| Order not found | Show "Order not found" message |
| bKash verified (status changed) | Auto-redirect to standard view |
| Tracking info not available | Hide tracking section |
| User refreshes after verification | Re-verify or use session storage |
