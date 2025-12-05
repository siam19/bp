# Contact Page (`/contact`) Implementation Plan

## Route: `src/routes/contact/+page.svelte`

## 1. Overview

The Contact Page provides a centralized hub for user inquiries with a **tabbed interface** routing messages to specific departments: Sales, Admin, and Tech. Features dynamic form fields, draft persistence, and rate limiting.

---

## 2. Data Requirements

### A. Server-Side Data (`+page.server.ts`)

This page is primarily client-driven. Server actions handle form submission.

```ts
// Form Action
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    // Validate and submit to Payload
  }
};
```

### B. Type Definitions

```ts
import type { ContactForm } from '$lib/types';

type Department = 'Sales' | 'Admin' | 'Tech';

interface ContactFormState {
  name: string;
  phone: string;
  email: string;
  subject: string;
  customSubject: string; // For "Other" selection
  message: string;
  attachment: string | null; // Product/Drop ID or filename
}
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
| `ContactTabs` | Department tab switcher (folder style) | HIGH |
| `ContactForm` | Dynamic form with department-specific fields | HIGH |
| `SubjectDropdown` | Sales-specific subject selector | MEDIUM |
| `ProductSearchInput` | Autocomplete for attaching products | MEDIUM |
| `FileUploadZone` | Screenshot upload for Tech department | MEDIUM |
| `AttachedChip` | Display chip for attached item | LOW |
| `CharacterCounter` | Live message length indicator | LOW |

---

## 4. State Management (Svelte 5 Runes)

```ts
// Department state
let activeDepartment = $state<Department>('Sales');

// Form state
let formState = $state<ContactFormState>({
  name: '',
  phone: '',
  email: '',
  subject: '',
  customSubject: '',
  message: '',
  attachment: null
});

// UI state
let isSubmitting = $state(false);
let submitSuccess = $state(false);
let submitError = $state<string | null>(null);
let characterCount = $derived(formState.message.length);

// Validation state
let phoneOrEmailProvided = $derived(
  formState.phone.trim() !== '' || formState.email.trim() !== ''
);

// Draft persistence
$effect(() => {
  // Save to localStorage on change
  localStorage.setItem('contact-draft', JSON.stringify({
    name: formState.name,
    phone: formState.phone,
    email: formState.email,
    message: formState.message
  }));
});
```

---

## 5. Implementation Steps

### Phase 1: Tab System
1. [ ] Create `ContactTabs.svelte` with folder-style tabs
2. [ ] Implement same scoop effect styling as Info page
3. [ ] Handle department switching

### Phase 2: Form Structure
4. [ ] Build base form with Name field
5. [ ] Implement Phone/Email dual-optional logic
6. [ ] Add "Optional" badge display logic
7. [ ] Create message textarea with character counter

### Phase 3: Department-Specific Fields
8. [ ] Build `SubjectDropdown.svelte` for Sales
9. [ ] Add "Other" → custom text input reveal logic
10. [ ] Build `ProductSearchInput.svelte` for Sales/Admin
11. [ ] Build `FileUploadZone.svelte` for Tech

### Phase 4: Submission & UX
12. [ ] Implement form validation
13. [ ] Add rate limiting check (localStorage timestamp)
14. [ ] Handle submission states (loading, success, error)
15. [ ] Implement auto-redirect after success

### Phase 5: Draft Persistence
16. [ ] Load draft from localStorage on mount
17. [ ] Clear draft on successful submission

---

## 6. Department-Specific Form Fields

| Department | Subject | Attachment |
|------------|---------|------------|
| **Sales** | Dropdown: Return, Cancel, Shipping, Other | Product/Drop search |
| **Admin** | Text input | Product/Drop search |
| **Tech** | Text input | Screenshot upload |

---

## 7. Subject Dropdown (Sales)

```svelte
<script lang="ts">
  let { value = $bindable(), onOtherSelected } = $props();
  
  const options = ['Return', 'Cancel', 'Shipping', 'Other'];
  let showCustomInput = $derived(value === 'Other');
</script>

<div class="space-y-2">
  <select 
    bind:value
    class="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white"
  >
    <option value="" disabled>Select subject...</option>
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
  
  {#if showCustomInput}
    <input 
      type="text"
      placeholder="Please specify..."
      class="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white"
      oninput={(e) => onOtherSelected(e.currentTarget.value)}
    />
  {/if}
</div>
```

---

## 8. Phone/Email Optional Logic

```svelte
<div class="space-y-4">
  <!-- Phone Field -->
  <div>
    <label class="flex items-center gap-2 text-white mb-1">
      Phone
      {#if formState.email.trim()}
        <span class="text-xs text-gray-500 bg-neutral-800 px-2 py-0.5 rounded">Optional</span>
      {/if}
    </label>
    <input 
      type="tel"
      bind:value={formState.phone}
      class="input-field"
      required={!formState.email.trim()}
    />
  </div>
  
  <!-- Email Field -->
  <div>
    <label class="flex items-center gap-2 text-white mb-1">
      Email
      {#if formState.phone.trim()}
        <span class="text-xs text-gray-500 bg-neutral-800 px-2 py-0.5 rounded">Optional</span>
      {/if}
    </label>
    <input 
      type="email"
      bind:value={formState.email}
      class="input-field"
      required={!formState.phone.trim()}
    />
  </div>
</div>
```

---

## 9. Rate Limiting Implementation

```ts
const RATE_LIMIT_MS = 60000; // 60 seconds

function checkRateLimit(): boolean {
  const lastSubmit = localStorage.getItem('contact-last-submit');
  if (!lastSubmit) return true;
  
  const elapsed = Date.now() - parseInt(lastSubmit, 10);
  return elapsed >= RATE_LIMIT_MS;
}

async function handleSubmit() {
  if (!checkRateLimit()) {
    submitError = 'Please wait before submitting another message';
    return;
  }
  
  isSubmitting = true;
  submitError = null;
  
  try {
    await payloadClient.createContactRequest({
      name: formState.name,
      contact_info: formState.phone || formState.email,
      department: activeDepartment,
      subject: formState.subject === 'Other' ? formState.customSubject : formState.subject,
      message: formState.message
    });
    
    localStorage.setItem('contact-last-submit', Date.now().toString());
    localStorage.removeItem('contact-draft');
    
    submitSuccess = true;
    
    // Redirect after 3 seconds
    setTimeout(() => goto('/'), 3000);
  } catch (err) {
    submitError = 'Failed to send message. Please try again.';
  } finally {
    isSubmitting = false;
  }
}
```

---

## 10. Submission States UI

```svelte
{#if submitSuccess}
  <div class="text-center py-8">
    <div class="text-green-500 text-4xl mb-4">✓</div>
    <h3 class="text-xl font-bold text-white mb-2">Thank you!</h3>
    <p class="text-gray-400">Your message has been sent. Redirecting...</p>
  </div>
{:else}
  <button
    type="submit"
    disabled={isSubmitting || !phoneOrEmailProvided}
    class="w-full py-3 rounded-lg font-bold uppercase transition-all
           {isSubmitting ? 'bg-gray-600 opacity-50' : 'bg-white text-black hover:bg-gray-200'}"
  >
    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
  </button>
  
  {#if submitError}
    <p class="text-red-500 text-sm text-center mt-2">{submitError}</p>
  {/if}
{/if}
```

---

## 11. Styling Notes

| Element | Tailwind Classes |
|---------|------------------|
| Page container | `max-w-md mx-auto bg-black min-h-screen` |
| Input field | `w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg p-3 text-white placeholder-gray-500` |
| Textarea | Same as input + `min-h-[150px] resize-none` |
| Character counter | `text-right text-xs text-gray-500` |
| Submit button | `w-full py-3 bg-white text-black font-bold uppercase rounded-lg` |
| Optional badge | `text-xs text-gray-500 bg-neutral-800 px-2 py-0.5 rounded` |

---

## 12. API Integration

```ts
// Using payloadClient
await payloadClient.createContactRequest({
  name: formState.name,
  contact_info: formState.phone || formState.email,
  department: activeDepartment,
  subject: formState.subject === 'Other' ? formState.customSubject : formState.subject,
  message: formState.message,
  // attachment handling depends on type
});
```

---

## 13. Edge Cases

| Scenario | Handling |
|----------|----------|
| Both phone & email empty | Disable submit, show validation message |
| Message exceeds 2000 chars | Block typing, show warning |
| Rate limit hit | Show countdown to next allowed submission |
| Draft exists on mount | Pre-fill form fields |
| Department switch mid-form | Keep common fields, reset department-specific |
| File upload fails | Show error, allow retry |
| Network error on submit | Show retry option |
