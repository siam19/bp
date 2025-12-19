# Implementation Plan - Drops Archive

**Route:** `/d`
**Spec:** `src/routes/d/#drops.spec.md`
**Layout Ref:** `src/routes/d/#drops.layout.html`

## 1. Data Loading Strategy (`+page.server.ts`)

We will use the **Shop API** to fetch all drops.

- **Endpoint:** `GET /api/shop/drops`
- **Client Method:** `payloadClient.getShopDrops()`
- **Parameters:**
  - `limit`: 100 (Fetch all active/archived drops for the timeline)
  - `sort`: `-release_date` (Newest first)

### Loader Logic
```typescript
export const load = async ({ fetch }) => {
  const drops = await payloadClient.getShopDrops({ fetch, query: { limit: 100 } });
  return { drops };
};
```

## 2. Component Architecture

### Layout Structure
- **Navbar:** Standard `Navbar.svelte`.
- **Container:** Full width/height, vertical scroll.

### Drop Cards
We need to map the `ShopDrop` data to the visual states defined in the spec.

| Status | Condition | Visuals |
| :--- | :--- | :--- |
| **LIVE** | `status === 'ACTIVE'` | High visibility, "LIVE NOW" badge, Countdown (calculated from `end_date`). |
| **UPCOMING** | `status === 'SCHEDULED'` | Greyscale/Dimmed, "UPCOMING" badge, Launch Date (`release_date`). |
| **ARCHIVED** | `status === 'ARCHIVED'` | Low opacity, "ARCHIVED" badge, End Date (`end_date`). |

**Component:** `src/lib/components/site/DropArchiveCard.svelte` (Existing or Create)
- **Props:** `drop: ShopDrop`
- **Interactions:** Click -> `goto('/d/' + drop.slug)`

## 3. Implementation Steps

1.  **Update `src/routes/d/+page.server.ts`**:
    - Implement `load` function using `payloadClient`.
2.  **Update `src/routes/d/+page.svelte`**:
    - Receive `data.drops`.
    - Iterate and render `DropArchiveCard` components.
    - Implement the vertical scroll layout.
3.  **Refine `DropArchiveCard.svelte`**:
    - Ensure it handles the 3 states (Live, Upcoming, Archived) correctly based on the `status` field.
    - Implement the "Pulsing" effect for Live drops.

## 4. Requirements Checklist
- [ ] Fetch drops from `/api/shop/drops`.
- [ ] Display drops in a vertical scroll.
- [ ] Correctly style "Live", "Upcoming", and "Archived" states.
- [ ] Navigate to `/d/[slug]` on click.
