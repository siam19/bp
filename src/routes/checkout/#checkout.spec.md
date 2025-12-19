
# Checkout Page Specifications


## 1. Page Context

The **Checkout Page** is the final step in the purchase funnel. It is rendered instantly when the user clicks "Proceed to Checkout" on the **Cart Sheet**.



* **Note:** The preceding Cart Sheet displays product and quantity only (no price info). The Checkout page is the first time the user engages with the order creation process.


## 2. Lifecycle & Tracking


### A. Initialization (Load Event)



* **Instant Render:** The frontend generates an alphanumeric Order ID immediately upon load to reduce perceived latency.
* **Background "Visit" Creation:** Simultaneously, a background POST request is sent to the backend containing:
    * Cart Items
    * Request IP & Browser Info
    * In-memory session objects
* **Outcome:** The backend creates a "Unique Visitor" entry in the visits collection.


### B. User Behavior Tracking



* **Continuous Tracking:** User interactions on this page are tracked and updated on the server **regardless of whether they proceed to submit the form**. This ensures drop-off data is captured for the "Unique Visitor".


### C. Submission (Submit Event)



* **Conversion:** When the form is submitted, the "Unique Visitor" entry is promoted/added to the Customers collection.
* **Order Creation:** The final order object is created in the backend.


## 3. Structure & Components


### A. Delivery Info Form



* **Required Fields:** * Receiver Name
    * Receiver Phone
    * Receiver Address
* **Optional Fields:** * Delivery Notes
    * Delivery Timeframe (Morning/Afternoon/Evening)
* **Styling:** "Inset" input style (darker background than container).


### B. Payment Selector



* **Visuals:** Horizontal radio button group.
* **Options:**
    1. **COD (Cash on Delivery):** Default selection.
    2. **bKash (Send Money):** Highlights in brand pink color when selected.


### C. Submission Action



* **UI State:** Button displays a loading spinner and disables interaction.
* **Logic:**
    * **If COD:** Redirects to receipt.html with status=confirmed.
    * **If bKash:** Redirects to receipt.html with status=pending (Triggering the Payment Guide).


## 4. API Integration (Mocked)



* **Endpoint:** POST /api/orders
* **Payload:** { orderId, customer, paymentMethod, timestamp, visitorId }