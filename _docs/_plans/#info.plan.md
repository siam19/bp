# Info Page (`/info`) Implementation Plan

## Route: `src/routes/info/+page.svelte`

## 1. Overview

The Info Page is a central repository for brand static content using a **tabbed interface** to organize: Drops explanation, About Us, Policies, and Team information.

---

## 2. Data Requirements

### A. Server-Side Data (`+page.server.ts`)

| Data | Source | Notes |
|------|--------|-------|
| **Static Content** | Hardcoded or from `payloadClient.getPage()` | Content is mostly static; can be fetched from a "Pages" collection if CMS-managed |
| **Team Members** | Hardcoded array | Name, role, avatar URL |

**Note:** This page is primarily static. If content needs CMS management, use:
```ts
const infoPage = await payloadClient.getPage({ slug: 'info', depth: 2 });
```

### B. Type Definitions

```ts
interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  instagram?: string;
}

type TabId = 'drops' | 'about' | 'policy' | 'team';
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
| `InfoTabs` | Tab controller with folder-style tabs | HIGH |
| `InfoTabButton` | Individual tab with scoop effect styling | HIGH |
| `DropsContent` | "How Drops Work" explanatory content | MEDIUM |
| `AboutContent` | Brand manifesto with mood image | MEDIUM |
| `PolicyContent` | Return, Shipping, Privacy, ToS sections | MEDIUM |
| `TeamGrid` | Grid of team member cards | LOW |
| `TeamMemberCard` | Avatar + name + role display | LOW |

---

## 4. State Management (Svelte 5 Runes)

```ts
// Tab state
let activeTab = $state<TabId>('drops');

// Derived corner styling based on active tab
let cardCornerClass = $derived.by(() => {
  switch (activeTab) {
    case 'drops': return 'rounded-tl-none rounded-tr-2xl'; // First tab active
    case 'team': return 'rounded-tl-2xl rounded-tr-none';  // Last tab active
    default: return 'rounded-t-2xl';                       // Middle tabs
  }
});
```

---

## 5. Implementation Steps

### Phase 1: Tab System
1. [ ] Create `InfoTabs.svelte` with 4-tab layout
2. [ ] Implement "folder tab" styling with pseudo-element scoops
3. [ ] Add corner morphing logic based on active tab

### Phase 2: Content Sections
4. [ ] Create `DropsContent.svelte` with educational copy
5. [ ] Create `AboutContent.svelte` with brand story + image
6. [ ] Create `PolicyContent.svelte` with collapsible sections
7. [ ] Create `TeamGrid.svelte` with member cards

### Phase 3: Animations & Polish
8. [ ] Add fade + translateY animation on tab switch
9. [ ] Implement touch-friendly tab interactions
10. [ ] Add footer with "Bastok" credit link

---

## 6. Tab Styling Details

### Folder Tab CSS Pattern
```css
/* Active tab with scoop effect */
.tab-active {
  background: #161616;
  border-radius: 1rem 1rem 0 0;
  position: relative;
  z-index: 20;
}

/* Left scoop (inverted corner) */
.tab-active::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: -1rem;
  width: 1rem;
  height: 1rem;
  background: transparent;
  box-shadow: 0.5rem 0 0 0 #161616;
  border-bottom-right-radius: 1rem;
}

/* Right scoop */
.tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: -1rem;
  width: 1rem;
  height: 1rem;
  background: transparent;
  box-shadow: -0.5rem 0 0 0 #161616;
  border-bottom-left-radius: 1rem;
}
```

### Tab Interaction Styles
```ts
// Prevent mobile tap highlight
const tabStyles = `
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`;
```

---

## 7. Content Structure

### Drops Tab
```markdown
## How Drops Work
Banglapunk releases are LIMITED. Each Drop is a time-sensitive collection...

## Previous Drops
Missed a drop? Check the archive and request restocks...
```

### Policy Tab Sections
| Section | Key Points |
|---------|------------|
| Return & Refund | 7-day window, unworn condition |
| Shipping | Global + Domestic options |
| Privacy | Data protection statement |
| Terms of Service | Botting prohibition |

---

## 8. Footer Component

```svelte
<footer class="text-center text-gray-500 text-sm py-6">
  <p>© 2025 Banglapunk. All rights reserved.</p>
  <p>
    Built by 
    <a 
      href="https://instagram.com/bastok" 
      class="text-teal-400 hover:underline"
      target="_blank"
      rel="noopener"
    >
      Bastok
    </a>
  </p>
</footer>
```

---

## 9. Styling Notes

| Element | Tailwind Classes |
|---------|------------------|
| Page container | `max-w-md mx-auto bg-black min-h-screen` |
| Tab container | `flex w-full` |
| Tab button | `flex-1 py-3 text-center uppercase font-bold` |
| Tab inactive | `bg-transparent text-gray-500` |
| Tab active | `bg-[#161616] text-white` |
| Content card | `bg-[#161616] p-6` |
| Section heading | `text-center uppercase tracking-wide text-white` |
| Body text | `text-gray-400 text-sm` |

---

## 10. Edge Cases

| Scenario | Handling |
|----------|----------|
| Deep link to specific tab | Support `?tab=policy` query param |
| Content overflow | Scrollable content area within tab |
| Team member missing avatar | Use placeholder initials |
