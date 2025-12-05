


# Product Page Specifications


## 1. Page Context

The **Product Page** serves as the detailed view for a single item (e.g., "PIUMA JACKET"). It emphasizes visual hierarchy, clear interaction points for purchasing, and continued discovery via suggested pairings.


## 2. Structure & Components


### A. Navigation



* **Navbar:** Standard component with Hamburger, Logo, and Cart.
    * **Reference HTML:** .component-navbar


### B. Product Gallery



* **Layout:** A composite grid displaying three key angles.
    * **Slot 0 (Main):** Large portrait/square container on the left.
    * **Slot 1 (Top Right):** Small landscape/square container.
    * **Slot 2 (Bottom Right):** Small landscape/square container.
* **Behavior:**
    * **Auto-Rotation:** Images cycle positions clockwise every 5000ms to ensure all angles get "Main Stage" time.
    * **Modal View:** Clicking any image opens the Image Viewer Modal for high-resolution inspection.


### C. Product Info Section



* **Identity:**
    * **Title:** Large, uppercase, sans-serif font (Impact style).
    * **Price:** Distinct styling (Mono font, lighter color).
* **Selection Controls:**
    * **Size Selector:** Row of buttons. Clicking updates the "SIZE: [Label]" text. Active state inverts colors (White bg, Black text).
    * **Size Guide:** Text link triggering the Size Guide Modal.
    * **Quantity Widget:** Simple - 1 + control with mono font display.
* **Action:**
    * **Add to Cart:** Full-width, high-contrast button.
* **Details:**
    * **Description:** Bulleted list rendering the descriptionJson content.


### D. Suggested Pairings (Masonry)



* **Purpose:** Upsell and cross-sell mechanism.
* **Content:**
    * **Pinned Items:** Specific products manually associated with the current item.
    * **Related Media:** Lifestyle images tagged with this product.
* **Behavior:** Infinite scroll. As the user reaches the bottom, the mock backend fetches more items.


## 3. Modals


### A. Image Viewer Modal



* **Purpose:** Full-screen gallery navigation.
* **Controls:** Close button (X), Previous/Next Chevrons (&lt; >).
* **Visuals:** Dark backdrop, centered image with object-contain.


### B. Size Guide Modal



* **Purpose:** Reference for sizing.
* **Content:** Displays the sizeChartID image.
* **Visuals:** Light-themed card overlay to contrast with the dark app theme.


## 4. Interaction Logic Summary



* **Gallery Rotation:** setInterval shifts the array of image sources assigned to the 3 DOM slots.
* **Size Selection:** Toggles .active class on buttons and updates the label text.
* **Quantity:** Basic increment/decrement logic bounded at 0.
* **Infinite Scroll:** Detects window.scrollY proximity to document bottom to append mock HTML strings.