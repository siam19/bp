# Component Registry

This document serves as the central registry for all UI components in the application. It tracks existing reusable components and those planned for implementation.

## 1. Core Components (Reusable)

These components are generic and used across multiple pages.

| Component | Status | Description | Props | Location |
| :--- | :--- | :--- | :--- | :--- |
| **Navbar** | ✅ Existing | Responsive navigation with Hamburger, Logo, and Cart trigger. | None | `src/lib/components/site/Navbar.svelte` |
| **CartSheet** | ✅ Existing | Slide-out cart drawer. | `open: boolean` | `src/lib/components/site/CartSheet.svelte` |
| **ProductCard** | ✅ Existing | Standard product display with image, price, and size badges. | `product: ProductCardProps` | `src/lib/components/site/ProductCard.svelte` |
| **MediaCard** | ✅ Existing | Display for lifestyle images/video with "Tagged Products" modal. | `media: MediaCardProps` | `src/lib/components/site/MediaCard.svelte` |
| **ProductSizeBox** | ✅ Existing | Small badge for displaying size (S, M, L). | `size: string` | `src/lib/components/site/ProductSizeBox.svelte` |
| **MasonryGrid** | ✅ Existing | Wrapper around `svelte-bricks` for mixed content grids. | `items: MasonryItem[]` | `src/lib/components/site/MasonryGrid.svelte` |
| **HamburgerMenu** | ✅ Existing | Mobile menu trigger. | None | `src/lib/components/site/HamburgerMenu.svelte` |

## 2. Page-Specific Components (To Be Implemented)

These components are highly specific to certain routes but may be refactored into core components if reuse is needed.

### Home Page (`/`)
| Component | Description |
| :--- | :--- |
| **DropCarousel** | Hero section with auto-rotating atmospheric imagery. |
| **Countdown** | Timer for current/upcoming drops. |
| **DropShowcaseSlots** | 3-grid layout with independent rotation logic. |
| **UpcomingDropBanner** | Teaser card with "Notify Me" functionality. |
| **NotifyModal** | Modal for email/phone capture. |
| **PreviousDrops** | Horizontal scrollable list of past collections. |

### Info Page (`/info`)
| Component | Description |
| :--- | :--- |
| **InfoTabs** | Tab controller (Drops, About, Policy, Team) with "folder" styling. |
| **TeamGrid** | Grid of team member avatars and roles. |

### Contact Page (`/contact`)
| Component | Description |
| :--- | :--- |
| **ContactForm** | Complex form with dynamic fields based on "Department" selection. |
| **ProductSearchInput** | Simulated search for attaching products to inquiries. |

### Checkout Page (`/checkout`)
| Component | Description |
| :--- | :--- |
| **PaymentSelector** | Radio group for COD vs bKash. |
| **OrderSummary** | Read-only view of cart items during checkout. |

### Receipt Page (`/receipt`)
| Component | Description |
| :--- | :--- |
| **PaymentGuide** | Step-by-step bKash payment instructions with copy-paste helpers. |
| **TrackingTimeline** | Visual status tracker (Pending -> Delivered). |
| **IdentityModal** | Security modal to unlock PII on public receipt pages. |

### Product Page (`/p/[slug]`)
| Component | Description |
| :--- | :--- |
| **ProductGallery** | 3-slot rotating image gallery. |
| **ImageViewerModal** | Full-screen zoomable image viewer. |
| **SizeGuideModal** | Modal displaying size charts. |

### Drop Page (`/d/[slug]`)
| Component | Description |
| :--- | :--- |
| **DropVideo** | Video player with custom play/pause overlay. |

## 3. UI Primitives (Shadcn/Custom)

| Component | Description | Location |
| :--- | :--- | :--- |
| **Sheet** | Slide-over panels (Used in Cart). | `$lib/components/ui/sheet` |
| **Button** | Standard buttons. | `$lib/components/ui/button` |
| **Input** | Form inputs. | `$lib/components/ui/input` |
