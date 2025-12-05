

# Receipt Page Specifications


## 1. Page Context

The **Live Receipt Page** acts as a dynamic post-purchase dashboard. It handles two distinct phases of the customer journey: Payment Instruction (if pending) and Order Status/Tracking (if confirmed).


## 2. Views & States


### A. Pending Payment View (bKash Guide)



* **Condition:** Triggered when Payment Method was **bKash** and status is Pending.
* **Layout & Content:**
    * **Header:** "How to Pay".
    * **Step 1:** Instruction to go to "Send Money".
    * **Target:** Display the number 01533817247 inside a box with a **Copy-to-Clipboard** button.
    * **Visual:** A placeholder GIF demonstrating the bKash app flow.
    * **Step 2:** Instruction to use Order ID as Reference.
    * **Reference:** Display the {order id} inside a box with a **Copy-to-Clipboard** button.
    * **Notice:** "Important!!" warning with a secondary GIF.
    * **Footer Text:** "You can close this tab. You will receive SMS with link to this page."


### B. Standard Receipt View (Confirmed/Delivered)



* **Condition:** Triggered for COD orders or after bKash payment is verified.
* **Security:** Sensitive data is obscured behind a **Confirm Identity** modal (requires Phone + SMS Key).
* **Sections:**
    * **Status:** Live backend status (Pending, Confirmed, Handed off, Delivered).
    * **Deliver To (Locked):** Receiver PII.
    * **Parcel Tracking (Locked):** Real-time Steadfast API status.
    * **Items (Open):** Product list and Total Price.
    * **Inquiry (Locked):** Direct messaging channel to sales.


## 3. Data Handling



* **Public Access:** The page is accessible via a public URL containing the Order ID.
* **Privacy:** PII is never rendered in the "Open" state; it requires a valid session key to fetch/display.