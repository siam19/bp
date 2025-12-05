# Contact Page Specifications


## 1. Page Context

The **Contact Page** provides a centralized hub for users to reach specific departments (Sales, Admin, Tech). It utilizes a tabbed interface to streamline the inquiry process and ensure messages are routed correctly.


## 2. Structure & Components


### A. Navigation & Layout



* **Navbar:** Standard component (Hamburger, Logo, Cart).
* **Layout:** Mobile-first constraint (max-w-md), centered, with deep black background.
* **Colors:** "Brighter Grey" palette (e.g., #1a1a1a backgrounds, white text) used for input fields to improve visibility against the low-brightness backdrop.


### B. Tab Group Component (Styling Details)



* **Visual Metaphor:** Tabs mimic physical folder tabs that merge seamlessly into the main content card.
* **Layout:** Flexbox container distributing tabs evenly (flex-1) across the full width, preventing gaps at the edges.
* **Interaction:** * user-select: none prevents text selection highlighting.
    * -webkit-tap-highlight-color: transparent removes the flashing box on mobile tap.
* **Active State:**
    * **Background:** Matches the content card (#161616).
    * **Shape:** Top-left and top-right corners are rounded (1rem).
    * **"Scoop" Effect:** Uses CSS pseudo-elements (::before, ::after) with box-shadow hacks to create inverted rounded corners at the base of the active tab, smoothing the transition to the inactive area or card edge.
    * **Z-Index:** Elevated (z-20) to sit above the card border/margin.
* **Inactive State:** Transparent background with gray text.


### C. Contact Form Fields


#### 1. Identification (Common)



* **Name:** Required text field.
* **Contact Info Logic:**
    * **Phone & Email:** Users must provide at least one.
    * **Behavior:** If one field is populated, the other displays a small "Optional" badge dynamically.


#### 2. Subject (Dynamic)



* **Context: Sales**
    * Display: Dropdown Select.
    * Options: Return, Cancel, Shipping, Other.
    * Logic: Selecting "Other" reveals a hidden text input for custom specification.
* **Context: Admin / Tech**
    * Display: Standard Text Input.


#### 3. Message Body



* **Display:** Textarea.
* **Constraints:** Max 2000 characters.
* **Feedback:** Live character count indicator (e.g., 45/2000).


#### 4. Attachments (Dynamic)



* **Context: Sales / Admin**
    * **Feature:** "Attach Product or Drop".
    * **Interaction:** Search bar simulated to return a mock product ("Piuma Jacket"). Selecting hides search and shows a "Attached Chip".
* **Context: Tech**
    * **Feature:** "Attach Screenshot".
    * **Interaction:** File picker zone. Displays filename upon selection.


### D. Submission & Security



* **Submit Action:**
    * Validates form data.
    * Packages data into JSON structure including department context.
    * Simulates API POST delay (2 seconds).
* **Feedback States:**
    * **Loading:** Button text changes to "SENDING...", opacity reduced.
    * **Success:** Hides button, shows "Thank you" message, redirects to Home after 3 seconds.
    * **Error (Rate Limit):** Displays error if user submits again within 60 seconds (simulated via localStorage timestamp).
* **Persistence:** localStorage automatically saves typed drafts (Name, Message, Contact info) to prevent data loss on refresh.