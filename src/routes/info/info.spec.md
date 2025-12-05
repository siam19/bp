
# Info Page Specifications


## 1. Page Context

The **Info Page** serves as the central repository for brand static content, utilizing a tabbed interface to organize disparate information (Drops explanation, About Us, Policies, Team) into a single, cohesive view without navigating away.


## 2. Structure & Components


### A. Navigation & Layout



* **Navbar:** Standard component.
* **Layout:** Mobile-first (max-w-md), centered, deep black background.
* **Global Footer:** Located outside the main content card at the bottom of the page.
    * **Content:** Copyright text + Creator Credit.
    * **Styling:** "Bastok" is colored teal (text-teal-400) and links to Instagram.


### B. Tab Group (4-Tab Layout)



* **Function:** Toggles between Drops, About Us, Policy, Team.
* **Behavior:**
    * **Distribution:** Evenly spaced (flex-1) across the container width.
    * **Visuals:** Uses the same "Folder Tab" styling as the Contact page (rounded top corners, active state merges with card, scoop effects).
    * **Edge Logic:**
        * **First Tab (Drops):** Flat top-left corner on card.
        * **Last Tab (Team):** Flat top-right corner on card.
        * **Middle Tabs:** Both card top corners rounded.


### C. Tab Contents


#### 1. Drops Tab (Default)



* **Purpose:** Educational content for new users.
* **Content:**
    * **"How Drops Work":** Explanation of scarcity and lifecycle.
    * **"Previous Drops":** Explanation of the archive and restock request system.
* **Styling:** Centered, uppercase headings, gray body text.


#### 2. About Us Tab



* **Purpose:** Brand manifesto and storytelling.
* **Content:** Text describing the "Banglapunk" ethos (Cyberpunk x Dhaka). Includes a brand mood image.


#### 3. Policy Tab



* **Purpose:** Legal and logistical information.
* **Sections:**
    * Return & Refund Policy (7-day window).
    * Shipping Information (Global + Domestic).
    * Privacy Policy (Data protection).
    * Terms of Service (Botting prohibition).
* **Styling:** Standard prose format with bold headers.


#### 4. Team Tab



* **Purpose:** Social proof and human connection.
* **Content:** List of core team members with avatars, names, and roles.


## 3. Interaction Logic



* **Tab Switching:** Instantly swaps visibility of content containers (display: none / block).
* **Animation:** Content fades in slightly (translateY) upon activation.
* **Corner Morphing:** The main card's border-radius updates dynamically based on which tab is active to maintain the "attached folder" illusion.