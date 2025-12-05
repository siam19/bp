# Document 0: Global Context & API Standards

## System Architecture
This API is built upon **Payload CMS**, utilizing **MongoDB** as the persistence layer. The system exposes a standardized REST interface for interacting with configured collections and globals[^1].

* **Base URL Structure:** All interactions follow a consistent pattern centered around `/api/:collection-slug`[^1].
* **Predictability:** This architecture ensures predictable endpoints for all standard CRUD operations across the entire application ecosystem[^1].

---

## Security & Authentication
The platform enforces a **"Secure by Default"** posture[^2]. Unless explicitly overridden, all API endpoints require a valid user session[^2].

### Authentication Strategies
The system supports two primary methods for identifying users:

1.  **HTTP-Only Cookies (Recommended):**
    * **Mechanism:** Stores identifiable data on the user's device via a secure cookie[^3].
    * **Security:** Protected from Client-Side XSS attacks as the cookie cannot be read by JavaScript[^3].
    * **Usage:** The browser automatically includes this cookie in requests.

2.  **JSON Web Tokens (JWT):**
    * **Mechanism:** Stateless tokens generated upon login[^3].
    * **Usage:** The client must attach the token to the `Authorization` header as a Bearer token[^3].
    * **Context:** Useful for mobile apps or server-to-server integrations[^3].

---

## Universal REST Query Parameters

To handle large datasets (e.g., thousands of Products or Orders) effectively, the API provides a suite of universal parameters[^1]. These apply to all Collection `GET` operations.

### 1. Data Projection & Relationships
* **`select` (Field Projection):**
    * **Purpose:** Specifies exactly which fields to return, minimizing payload size[^4].
    * **Syntax:** Uses bracket notation.
    * **Example:** `?select[title]=true&select[slug]=true` (Returns only title and slug)[^4].
* **`populate` (Expand Relationships):**
    * **Purpose:** Expands relationship fields from simple IDs into full document objects[^1].
    * **Optimization:** The server may use `defaultPopulate` to limit which fields are returned within the populated document to save bandwidth[^1].
    * **Example:** `?populate=customer` (Returns the full Customer object inside an Order).
* **`depth` (Recursion Control):**
    * **Purpose:** Limits how deep the server recursively populates relationships[^1].
    * **Warning:** High depth values can degrade server performance[^1].
    * **Example:** `?depth=2` (Resolves Product -> Category -> Media).

### 2. Filtering & Logic
* **`where` (Advanced Filtering):**
    * **Purpose:** Implements complex business logic using URL-encoded JSON objects and operators (e.g., `$equal`, `$in`, `$greater_than`)[^1].
    * **Example:** `?where[price][greater_than]=100`[^1].
    * **Context:** Essential for filtering Drops by active dates or Products by price[^1].

### 3. Pagination & Sorting
* **`limit`:** Restricts the maximum number of documents returned[^1].
* **`page`:** Specifies the result offset (page number)[^1].
* **`sort`:** Orders documents. Use a hyphen `-` for descending order (e.g., `?sort=-createdAt`)[^1].

### 4. Localization
* **`locale`:** Specifies the target language for content retrieval[^1].
* **`fallback-locale`:** Designates an alternative language if the primary locale is missing data[^1].

### Quick Reference Table
| Parameter | Purpose | Example |
| :--- | :--- | :--- |
| **select** | Minimize payload size | `?select[title]=true` |
| **populate** | Expand relationships | `?populate=customer` |
| **depth** | Limit recursion | `?depth=1` |
| **where** | Complex filtering | `?where[status][equals]=active` |
| **limit** | Max results | `?limit=10` |
| **page** | Page number | `?page=2` |
| **sort** | Sort order | `?sort=-updatedAt` |
| **locale** | Language | `?locale=en` |

---

## Works Cited

[^1]: [REST API | Documentation - Payload CMS](https://payloadcms.com/docs/rest-api/overview)
[^2]: [Access Control | Documentation - Payload CMS](https://payloadcms.com/docs/access-control/overview)
[^3]: [Authentication Overview | Documentation - Payload CMS](https://payloadcms.com/docs/authentication/overview)
[^4]: [Select | Documentation - Payload CMS](https://payloadcms.com/docs/queries/select)