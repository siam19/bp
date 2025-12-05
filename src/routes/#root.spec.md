
# Home Page Specifications

## Page Overview

**Route:** `/`  
**Purpose:** Banglapunk is a high-concept, mobile-first e-commerce storefront designed for limited-time "Drops." This is their home page.

---

## Core Functionality

### A. The "Drop" System

The store revolves around time-sensitive product collections rather than traditional categories.

- **Current Drop:** The active collection available for purchase immediately. Features a countdown timer.
- **Upcoming Drop:** A teaser for the next collection. Allows users to sign up for notifications.
- **Previous Drops:** An archive of past collections, viewable for brand heritage but usually locked/sold out.

### B. Navigation

- **Sticky Header:** Navbar remains fixed at the top with a gradient fade (from-black/90 to transparent) to ensure visibility without hard lines.
- **Infinite Scroll (Simulated):** The "Explore" section uses a masonry layout intended to grow as users scroll.

### C. Interactions

- **Micro-interactions:** Hover states on buttons, scaling effects on images.
- **Touch Emulation:** Horizontal scrolling sections support "grab-and-drag" mouse interactions to mimic mobile touch gestures.

---

## Component Details

This section details the components, their HTML structure, CSS utility dependencies (Tailwind), and associated JavaScript behaviors.

### 1. Navbar

**Selector:** `.component-navbar`

* **Purpose:** Persistent navigation holding the hamburger menu, brand logo, and cart status.
* **Visuals:** Fixed position (`fixed top-0`), Z-indexed above content. Uses a vertical gradient mask to blend into the content below.
* **Props/State:**
    * cartCount (Static HTML): Displays a red badge if items > 0.

### 2. DropCarousel

**Selector:** `.component-drop-carousel`

* **Purpose:** Hero section displaying atmospheric imagery for the current drop.
* **Structure:**
    * Container: relative overflow-hidden rounded-2xl.
    * Slides: Stacked absolutely (absolute inset-0).
    * Overlay: Text and pseudo-badges layered on top of images (z-10).
* **Behavior (JS):**
    * **Auto-Rotation:** controlled by setInterval (4000ms).
    * **Transition:** Toggles opacity-0 and opacity-100 classes to create a crossfade effect.
    * **Indicators:** Updates dot indicators at the bottom to match the active slide.

### 3. Countdown

**Selector:** `.component-countdown`

* **Purpose:** Create urgency by displaying time remaining for the current drop.
* **Visuals:** Monospace font (font-mono) for numerical values to prevent layout shifting.
* **Behavior (JS):**
    * Calculates Date.now() vs targetDate every 1000ms.
    * Updates specific spans (#cd-days, #cd-hours, #cd-mins) via innerText.

### 4. DropShowcaseSlots

**Selector:** `.component-drop-showcase-slots`

* **Purpose:** A dynamic 3-grid layout showcasing specific products from the current drop alongside a "View Drop" link.
* **Structure:** Grid with 3 columns (grid-cols-3).
* **Behavior (JS):**
    * **Independent Rotation:** Slots 1 and 2 rotate through their own arrays of images independently.
    * **Async Timing:** Slot 1 rotates every 3000ms; Slot 2 rotates every 4500ms. This desynchronization creates a more organic, "alive" feel.

### 5. UpcomingDropBanner

**Selector:** `.component-upcoming-drop`

* **Purpose:** Teases the next collection.
* **Visuals:** Large aspect ratio card (aspect-[2/1]) with a "Notify Me" action.
* **Interactions:**
    * **Modal Trigger:** Clicking "Notify Me" removes the .hidden class from #notify-modal.

### 6. NotifyModal

**Selector:** `.component-notify-modal`

* **Purpose:** Captures user data for drop alerts.
* **Structure:** Fixed overlay with backdrop blur. Hidden by default.
* **Behavior (JS):**
    * toggleModal(boolean): Toggles visibility.
    * **Submission:** Prevents default form submission and shows a browser alert.

### 7. PreviousDrops

**Selector:** `.component-previous-drops`

* **Purpose:** Horizontal scrollable list of past collections.
* **Visuals:** Flex container with overflow-x-auto. Scrollbars are hidden via .no-scrollbar.
* **Behavior (JS):**
    * **Drag-to-Scroll:** Listens for mousedown, mouseleave, mouseup, and mousemove events on #previous-drops-container.
    * Calculates cursor movement (walk) and updates scrollLeft to allow desktop users to drag the list like a touch screen.

### 8. MasonryGrid (Explore)

**Selector:** `.component-explore -> .columns-2`

* **Purpose:** A mixed feed of "Product Cards" and "Media Cards".
* **Structure:** Uses CSS Multi-column Layout (columns-2) instead of Flexbox or Grid. This allows items of varying heights to stack vertically without gaps (Pinterest style).
* **Sub-Components:**
    * **Product Card:** Contains image, title, size badges (static), and price.
    * **Media Card:** Contains lifestyle imagery and a "Products Tagged" overlay.
    * break-inside-avoid: Critical utility class preventing cards from being sliced in half across columns.
