

# Drop Page Specifications


## 1. Page Context

The **Drop Page** is the dedicated landing area for a specific collection (e.g., "PANTER"). It is an immersive, commerce-focused experience that mixes rich media (video, carousel) directly with the product catalog.


## 2. Structure & Components


### A. Navigation & Header



* **Navbar:** Features Hamburger Menu, Brand Logo, and Cart Icon.
    * **Reference HTML:** .component-navbar
* **Countdown:** Displays the time remaining for the drop.
    * **Reference HTML:** .component-countdown
    * **Logic:** Shows time until releaseDate if not yet launched, OR time until endDate if the drop is currently active.
* **Drop Banner Carousel:** The main visual header for the drop.
    * **Reference HTML:** .component-drop-carousel


### B. Storytelling & Media



* **Drop Name:** The name of the collection (e.g., PANTER).
* **Drop Description Text:** Narrative copy providing context for the collection.
* **Drop Video:** Features lifestyle or product demonstration footage.
    * **Reference HTML:** .component-drop-video
    * **Behavior:** Video should have minimal playback controls. Tapping the video container toggles Play/Pause states.


### C. Product Catalog (Masonry Grid)



* **Purpose:** Displays all relevant products and supplementary media for this specific drop.
* **Layout:** Two-column masonry grid allowing items of variable height.
    * **Reference HTML:** .component-masonry-grid
* **Content:** Contains two primary card types:
    * **Product Cards:** Display image, name, price (BDT), and available size badges.
    * **Media Cards:** Display non-commerce lifestyle or editorial imagery related to the drop.


## 3. Component Behaviors


### A. Countdown



* **Behavior:** Performs a live update every 1000ms.


### B. Drop Banner Carousel



* **Behavior:** Auto-rotates between slides with a smooth crossfade transition (4-second interval).


### C. Drop Video Player



* **Interaction:** Tapping the video container toggles playback (Play/Pause). When paused, an overlay and custom play button are visible.


### D. Product Grid (Masonry)



* **Behavior:** Cards in the grid are statically placed and scroll vertically.