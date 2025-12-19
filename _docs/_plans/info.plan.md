# Implementation Plan - Info Page

**Route:** `/info`
**Spec:** `src/routes/info/info.spec.md`
**Layout Ref:** `src/routes/info/#info.layout.html`

## 1. Data Loading Strategy (`+page.server.ts`)

Fetch the CMS-managed Info Page content.

- **Endpoint:** `GET /api/shop/info-page`
- **Client Method:** `payloadClient.getShopInfoPage()`

### Loader Logic
```typescript
export const load = async ({ fetch }) => {
  const infoPage = await payloadClient.getShopInfoPage({ fetch });
  return { infoPage };
};
```

## 2. Component Architecture

### Tab Group
- **Tabs:** Drops, About Us, Policy, Team.
- **Data Source:** `infoPage.tabs` (Array).
- **Visuals:** Same "Folder" style as Contact page.

### Tab Content
- **Generic Section:** Title, Body (HTML), Image.
- **Policy Section:** List of policies (Title, Content).
- **Team Section:** Grid of members (Name, Role, Avatar).

## 3. Implementation Steps

1.  **Update `src/routes/info/+page.server.ts`**:
    - Fetch `infoPage` data.
2.  **Update `src/routes/info/+page.svelte`**:
    - Render Tab Group dynamically from `infoPage.tabs`.
    - Render Content Area based on `activeTab`.
    - Create sub-components for each section type (`GenericSection`, `PolicySection`, `TeamSection`) to handle the specific JSON structures returned by the API.

## 4. Requirements Checklist
- [ ] Fetch Info Page content.
- [ ] Render Dynamic Tabs.
- [ ] Render Generic, Policy, and Team sections correctly.
