# Implementation Plan - Contact Page

**Route:** `/contact`
**Spec:** `src/routes/contact/#contact.spec.md`
**Layout Ref:** `src/routes/contact/#contact.layout.html`

## 1. Data Loading Strategy (`+page.server.ts`)

No initial server-side data required for the form itself, but we might need to pre-fetch products/drops for the "Attach" search feature if we want it snappy, or just use client-side fetch on demand.

- **Optional:** Pre-fetch list of Drop names for "Sales" context?

## 2. Component Architecture

### Tab Group
- **State:** `activeTab` ('Sales' | 'Admin' | 'Tech').
- **Visuals:** "Folder tab" styling (rounded corners, scoop effect).

### Contact Form
- **State:** `formData` object (name, contact, subject, message, attachment).
- **Dynamic Fields:**
    - **Sales:** Subject Dropdown.
    - **Admin/Tech:** Subject Input.
    - **Tech:** File Picker (Screenshot).
    - **Sales/Admin:** Product/Drop Search (Simulated or Real).

### Attachment Search
- **Input:** Text field.
- **Behavior:** Debounced search against `payloadClient.getShopProducts` or `getShopDrops`.
- **Selection:** Stores ID/Name in `formData`.

## 3. Submission Logic (`actions` or Client-side?)
Spec says: "Simulates API POST delay... Persistence: localStorage".
We should use `payloadClient.createContactRequest`.

- **Endpoint:** `POST /api/contact-requests` (via `payloadClient`).
- **Rate Limiting:** Check `localStorage` timestamp before sending.

## 4. Implementation Steps

1.  **Update `src/routes/contact/+page.svelte`**:
    - Implement Tab switching logic.
    - Build the Form with dynamic rendering based on `activeTab`.
    - Implement "Attach" search (Client-side fetch).
    - Implement `handleSubmit`:
        - Validate.
        - Check Rate Limit.
        - Call `payloadClient.createContactRequest`.
        - Handle Success/Error states.
    - Implement `localStorage` persistence for drafts.

## 5. Requirements Checklist
- [ ] Tabbed Interface (Sales, Admin, Tech).
- [ ] Dynamic Form Fields.
- [ ] Attachment Search (Products/Drops).
- [ ] Submission to Backend.
- [ ] LocalStorage Draft Saving.
