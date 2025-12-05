

# Products Catalog Specifications (/p)


## 1. Page Context

The Products Catalog is a comprehensive inventory view allowing users to browse all individual items, regardless of their association with a currently live drop.


## 2. Layout & Components


### A. Navbar



* **Component:** Uses the standard Navbar component.
* **Navigation:** Provides back navigation to the Home page (/).


### B. Search and Filters (Sticky Header)



* **Structure:** The entire search and filter bar is sticky at the top of the viewport.
* **Search Input:** Text input for full-catalog search.
* **Drop Filters (Dynamic):**
    * **Initial State:** Displays an "ALL" button and a loading skeleton.
    * **Behavior:** The filter list is populated asynchronously *after* the main product grid has rendered. It fetches and displays the names of associated Drops (e.g., PANTER, KABAN) as filter chips.


### C. Product Grid



* **Layout:** 2-column masonry grid (columns-2).
* **Product Card:**
    * **Visuals:** Light gray background (#e5e5e5) with product images using mix-blend-multiply to remove white bounding boxes.
    * **Data:** Title, Price (BDT), and available sizes (e.g., S M L).
    * **Interaction:** Tapping a card navigates to the specific Product Page (/p/[slug]).


## 3. Functionality



* **Prioritization:** The frontend must prioritize loading and hydrating the main product grid first before initiating the request to fetch dynamic filter categories.