# Implementation Plan - Receipt Page

**Route:** `/receipt/[orderId]`
**Spec:** `src/routes/receipt/[orderId]/#receipt.spec.md`
**Layout Ref:** `src/routes/receipt/[orderId]/#receipt.layout.html`

## 1. Data Loading Strategy (`+page.server.ts`)

Fetch the order status. Note that PII is locked initially.

- **Endpoint:** `GET /api/receipt?order_id=[orderId]`
- **Client Method:** `payloadClient.getReceipt(orderId)`

### Loader Logic
```typescript
export const load = async ({ params, fetch }) => {
  const { orderId } = params;
  try {
    const receipt = await payloadClient.getReceipt(orderId, undefined, { fetch });
    return { receipt };
  } catch (e) {
    // Handle 404 or Error
    return { error: e.message };
  }
};
```

## 2. Component Architecture

### View Switcher
- **Pending Payment (bKash):**
    - Condition: `receipt.order.payment_method === 'BKASH'` && `receipt.order.status === 'PENDING'`.
    - Component: `PaymentGuide`.
- **Standard Receipt:**
    - Condition: Confirmed or COD.
    - Components: `StatusBadge`, `TrackingTimeline`, `IdentityModal`.

### Identity Modal
- **Purpose:** Unlock PII (Address, Phone).
- **Action:** `payloadClient.verifyOrder(orderId, { phone, key })`.
- **On Success:** Re-fetch receipt with Auth headers (`x-auth-phone`, `x-auth-pin`) to get full customer info.

## 3. Implementation Steps

1.  **Update `src/routes/receipt/[orderId]/+page.server.ts`**:
    - Fetch initial receipt (public view).
2.  **Update `src/routes/receipt/[orderId]/+page.svelte`**:
    - Implement View Switcher logic.
    - Build `PaymentGuide` (Static content + Copy buttons).
    - Build `IdentityModal` (Input Phone/PIN -> Verify -> Update State).
    - Display Order Items (Always visible).
    - Display Tracking/Customer Info (Only if `authorized` is true).

## 4. Requirements Checklist
- [ ] Fetch public receipt data.
- [ ] Show bKash Guide for pending orders.
- [ ] Show Locked view for confirmed orders.
- [ ] Implement Identity Verification (Unlock PII).
- [ ] Show Tracking Timeline.
