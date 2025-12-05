# BanglaPunk Design System Stylekit

This document outlines the design systems, patterns, and tokens used in the BanglaPunk UI.

## 1. Core Design Tokens

### Colors
The design system primarily uses `oklch` color space defined in CSS variables, with Tailwind CSS utility classes for application.

**Theme: Dark Mode (Default)**
- **Background:** `oklch(17.086% 0.00334 17.166)` (Dark Gray/Black)
- **Foreground:** `oklch(100% 0.00011 271.152)` (White)
- **Primary:** `oklch(0.21 0.006 285.885)`
- **Destructive:** `oklch(0.577 0.245 27.325)` (Red)
- **Border:** `oklch(0.92 0.004 286.32)`

**Common Utility Classes:**
- Backgrounds: `bg-black`, `bg-neutral-900`, `bg-white` (for cards/accents)
- Text: `text-white`, `text-gray-400`, `text-gray-500`, `text-black` (on white backgrounds)
- Overlays: `bg-black/60`, `bg-black/80`
- Gradients: `bg-gradient-to-b from-zinc-500 to-zinc-800`

### Typography
- **Primary Font:** `Akira Extended` (Superbold) - Used for headings and branding.
- **Secondary Font:** Sans-serif fallback.
- **Weights:** `font-medium`, `font-semibold`, `font-bold`, `font-black`, `font-extrabold`.
- **Styles:** `uppercase` is frequently used for navigation links and small labels.

### Spacing & Layout
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Radius:**
  - Default: `0.625rem` (`--radius`)
  - Small: `rounded-md`
  - Large: `rounded-lg`, `rounded-xl`
  - Pill: `rounded-full`

## 2. Visual Effects & Animations

### Halftone Overlay
A signature visual element creating a retro/punk aesthetic.
```css
.halftone-overlay {
  isolation: isolate;
  /* Radial gradient dot pattern */
  background-image: radial-gradient(circle at 0.8px 0.8px, rgba(53, 53, 53, 0.838) 0px, rgba(125, 125, 125, 0.8) 1px, transparent 2px);
  background-size: 10px 10px;
  mix-blend-mode: screen;
  opacity: 0.85;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 10%, rgba(0, 0, 0, 0.7) 35%, rgba(0, 0, 0, 0.2) 80%);
}
```

### Glassmorphism
Used in the Cart Sheet and other overlays.
```css
.cart-item {
  background: rgba(27, 28, 27, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
```

### Animations
- **Marquee:** Used for long product names (`animate-marquee`).
- **Pulse:** Used for countdown labels (`animate-pulse`, custom `pulsate` keyframes).
- **Hover:** `transform: translateY(-2px)` on interactive cards.
- **Text Generation:** Uses `svelte-motion` for character-by-character reveal with blur and rotation (`TextGenerativeEffect`).
- **Hamburger Icon:** CSS transitions on spans for open/close state (`rotate-45`, `opacity-0`).

## 3. Component Patterns

### Navbar
- **Structure:** Sticky header (`sticky top-0 z-30`).
- **Style:** `bg-black/60 backdrop-blur-sm shadow-sm`.
- **Navigation:**
  - Desktop: Centered links, uppercase, bold.
  - Mobile: Hamburger menu (Left side sheet).
    - Links: Large (`text-3xl`), `hover:text-red-500`.
    - Trigger: Custom animated hamburger icon, `hover:bg-red-500`.
- **Cart:** Icon with notification badge (`bg-red-500 rounded-full`).

### Cards (Product & Media)
- **Container:** `bg-white text-black rounded-md`.
- **Image:** Aspect square or responsive video/image, `rounded-lg`.
- **Interactivity:**
  - `hover:shadow-lg`
  - Click opens detail view or modal.
- **Content:**
  - Product Name: Truncated or Marquee if long.
  - Price: Bold, with currency symbol.
  - Size Box: Small bordered boxes for available sizes.

### Modals & Sheets
- **Cart Sheet:** Slide-up/side panel.
  - Header: Large, bold title (`text-4xl font-extrabold`).
  - Footer: Checkout button with gradient.
- **Media Modal:** Full-screen overlay (`fixed inset-0 z-50`).
  - Background: `bg-black/80`.
  - Content: Centered, max-width/height constraints.
- **Notify Modal:** Centered dialog.
  - Style: `bg-black border border-neutral-800 rounded-xl`.
  - Form: Tabs for Email/Phone, styled inputs (`bg-neutral-900`).

### Buttons
- **Primary:** `bg-white text-black rounded-lg font-medium hover:bg-gray-200`.
- **Checkout:** Gradient background, full width.
- **Icon Buttons:** `p-2 rounded-full hover:bg-black/20`.

## 4. Icons
- **Library:** `lucide-svelte`
- **Common Icons:** `ShoppingBag`, `X` (Close), `ArrowUpRight`.
- **Custom:** SVG assets for Logo and specific UI elements.


# HTML Example:

```html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BanglaPunk Design System</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Phosphor Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <!-- Google Fonts -->
    <!-- Archivo Black for "Akira" substitute (Superbold), Space Grotesk for Tech/Punk body -->
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        /* =========================================
           BANGLAPUNK TOKENS
           ========================================= */
        :root {
            /* 1. CORE COLORS (OKLCH) */
            --bp-bg: oklch(17.086% 0.00334 17.166);       /* Dark Gray/Black */
            --bp-fg: oklch(100% 0.00011 271.152);         /* White */
            
            --bp-primary: oklch(0.21 0.006 285.885);      /* Deep Dark Primary */
            --bp-destructive: oklch(0.577 0.245 27.325);  /* Punk Red */
            --bp-border: oklch(0.92 0.004 286.32);        /* Light Gray */
            
            --bp-gradient-start: #71717a; /* zinc-500 */
            --bp-gradient-end: #27272a;   /* zinc-800 */

            /* 2. TYPOGRAPHY */
            --font-heading: 'Archivo Black', sans-serif;
            --font-body: 'Space Grotesk', sans-serif;

            /* 3. SPACING & RADIUS */
            --radius-default: 0.625rem; /* 10px */
            --radius-lg: 0.75rem;       /* 12px */
            --radius-xl: 1rem;          /* 16px */
        }

        /* RESET & BASE */
        body {
            background-color: var(--bp-bg);
            color: var(--bp-fg);
            font-family: var(--font-body);
            overflow-x: hidden;
        }

        h1, h2, h3, h4, .brand-font {
            font-family: var(--font-heading);
            text-transform: uppercase;
        }

        /* =========================================
           VISUAL EFFECTS
           ========================================= */
        
        /* Halftone Overlay */
        .halftone-overlay {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            isolation: isolate;
            /* Radial gradient dot pattern */
            background-image: radial-gradient(circle at 0.8px 0.8px, rgba(53, 53, 53, 0.838) 0px, rgba(125, 125, 125, 0.8) 1px, transparent 2px);
            background-size: 10px 10px;
            mix-blend-mode: overlay;
            opacity: 0.4; /* Adjusted for readability in docs */
            mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 10%, rgba(0, 0, 0, 0.7) 35%, rgba(0, 0, 0, 0.2) 80%);
        }

        /* Glassmorphism Panel */
        .glass-panel {
            background: rgba(27, 28, 27, 0.6);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-xl);
        }

        /* =========================================
           COMPONENTS
           ========================================= */
        
        /* Buttons */
        .bp-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            font-family: var(--font-body);
            font-weight: 600;
            border-radius: var(--radius-lg);
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
        }

        .bp-btn-primary {
            background-color: var(--bp-fg); /* White */
            color: black;
            border: 1px solid transparent;
        }
        .bp-btn-primary:hover {
            background-color: #e5e7eb; /* Gray-200 */
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }

        .bp-btn-checkout {
            background: linear-gradient(to bottom, var(--bp-gradient-start), var(--bp-gradient-end));
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .bp-btn-checkout:hover {
            filter: brightness(1.1);
        }

        .bp-btn-icon {
            padding: 0.5rem;
            border-radius: 9999px;
            color: white;
        }
        .bp-btn-icon:hover {
            background-color: rgba(255,255,255,0.1);
        }

        /* Product Card */
        .bp-card {
            background-color: var(--bp-fg); /* White */
            color: black;
            border-radius: var(--radius-default);
            padding: 1rem;
            transition: transform 0.2s;
        }
        .bp-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Input */
        .bp-input {
            width: 100%;
            background-color: #171717; /* Neutral 900 */
            border: 1px solid #262626; /* Neutral 800 */
            color: white;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-default);
            outline: none;
            font-family: var(--font-body);
        }
        .bp-input:focus {
            border-color: var(--bp-destructive);
        }

        /* Animations */
        @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 10s linear infinite;
        }

        /* Documentation Layout Helpers */
        .doc-section { margin-bottom: 5rem; position: relative; z-index: 10; }
        .spec-label { font-size: 0.75rem; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.05em; margin-bottom: 0.5rem; display: block; }
        .swatch { width: 100%; height: 6rem; border-radius: var(--radius-default); margin-bottom: 0.5rem; border: 1px solid rgba(255,255,255,0.1); }
        
        .code-block {
            background: rgba(0,0,0,0.5);
            padding: 1rem;
            border-radius: var(--radius-default);
            font-family: monospace;
            font-size: 0.8rem;
            color: #d1d5db;
            border: 1px solid #333;
        }

        /* Sidebar override */
        .sidebar-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.5rem; color: #9ca3af; transition: 0.2s; }
        .sidebar-link:hover, .sidebar-link.active { background: rgba(255,255,255,0.05); color: white; }
        .sidebar-link.active { border-left: 2px solid var(--bp-destructive); border-radius: 0 0.5rem 0.5rem 0; }
    </style>
</head>
<body class="h-screen flex overflow-hidden">

    <!-- BACKGROUND EFFECT -->
    <div class="halftone-overlay"></div>

    <!-- SIDEBAR -->
    <aside class="w-72 border-r border-white/10 flex-shrink-0 bg-black/40 backdrop-blur-md overflow-y-auto relative z-20 hidden md:block">
        <div class="p-8">
            <div class="mb-10">
                <h1 class="text-3xl leading-none tracking-tighter text-white">
                    BANGLA<br><span style="color: var(--bp-destructive)">PUNK</span>
                </h1>
                <p class="text-xs text-gray-500 mt-2 font-mono">DESIGN SYSTEM v1.0</p>
            </div>

            <nav class="space-y-1 font-mono text-sm">
                <p class="px-3 text-xs font-bold text-gray-600 uppercase tracking-widest mb-4">Core Tokens</p>
                <a href="#colors" class="sidebar-link active">
                    <i class="ph ph-paint-brush"></i> Colors & OKLCH
                </a>
                <a href="#typography" class="sidebar-link">
                    <i class="ph ph-text-aa"></i> Typography
                </a>
                <a href="#effects" class="sidebar-link">
                    <i class="ph ph-sparkle"></i> Visual Effects
                </a>

                <p class="px-3 text-xs font-bold text-gray-600 uppercase tracking-widest mb-4 mt-8">Components</p>
                <a href="#navbar" class="sidebar-link">
                    <i class="ph ph-navigation-arrow"></i> Navigation
                </a>
                <a href="#buttons" class="sidebar-link">
                    <i class="ph ph-hand-tap"></i> Buttons & Actions
                </a>
                <a href="#cards" class="sidebar-link">
                    <i class="ph ph-cards"></i> Cards & Sheets
                </a>
            </nav>
        </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        <div class="max-w-5xl mx-auto px-6 md:px-12 py-16">

            <!-- INTRO -->
            <section id="intro" class="doc-section text-center py-20 border-b border-white/10">
                <h2 class="text-6xl md:text-8xl mb-6 tracking-tight">STYLEKIT</h2>
                <p class="text-xl text-gray-400 max-w-2xl mx-auto">
                    A brutalist, high-contrast design system featuring halftone textures, 
                    extended typography, and glassmorphism overlays.
                </p>
            </section>

            <!-- COLORS -->
            <section id="colors" class="doc-section">
                <div class="flex items-end justify-between mb-8">
                    <h3 class="text-4xl">Color Palette</h3>
                    <span class="font-mono text-xs text-gray-500">Space: OKLCH</span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <!-- Destructive -->
                    <div>
                        <span class="spec-label">Destructive (Red)</span>
                        <div class="swatch" style="background-color: var(--bp-destructive)"></div>
                        <div class="font-mono text-xs text-gray-400">
                            oklch(0.577 0.245 27.325)
                        </div>
                    </div>
                    <!-- Background -->
                    <div>
                        <span class="spec-label">Background (Dark)</span>
                        <div class="swatch" style="background-color: var(--bp-bg); border-color: #333;"></div>
                        <div class="font-mono text-xs text-gray-400">
                            oklch(17% 0.003 17.16)
                        </div>
                    </div>
                    <!-- Foreground -->
                    <div>
                        <span class="spec-label">Foreground (White)</span>
                        <div class="swatch" style="background-color: var(--bp-fg)"></div>
                        <div class="font-mono text-xs text-gray-400">
                            oklch(100% 0.000 271.1)
                        </div>
                    </div>
                    <!-- Gradient -->
                    <div>
                        <span class="spec-label">Metallic Gradient</span>
                        <div class="swatch" style="background: linear-gradient(to bottom, var(--bp-gradient-start), var(--bp-gradient-end))"></div>
                        <div class="font-mono text-xs text-gray-400">
                            Zinc 500 -> Zinc 800
                        </div>
                    </div>
                </div>
            </section>

            <!-- TYPOGRAPHY -->
            <section id="typography" class="doc-section">
                <h3 class="text-4xl mb-8">Typography</h3>
                
                <div class="glass-panel p-8 space-y-12">
                    <!-- Headings -->
                    <div class="grid md:grid-cols-12 gap-8 items-center border-b border-white/10 pb-8">
                        <div class="col-span-4 text-gray-400 text-sm font-mono">
                            Primary Font<br>
                            <span class="text-white">Akira Extended (Alt: Archivo Black)</span><br>
                            Uppercase, Heavy
                        </div>
                        <div class="col-span-8 space-y-4">
                            <div class="text-6xl">HEADLINE XL</div>
                            <div class="text-4xl">SUBHEADING LG</div>
                            <div class="text-2xl">SECTION TITLE</div>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="grid md:grid-cols-12 gap-8 items-center">
                        <div class="col-span-4 text-gray-400 text-sm font-mono">
                            Secondary Font<br>
                            <span class="text-white">Space Grotesk</span><br>
                            Tech, Readable
                        </div>
                        <div class="col-span-8 space-y-4 font-sans">
                            <p class="text-xl">The quick brown fox jumps over the lazy dog.</p>
                            <p class="text-base text-gray-400">
                                This is the standard body text style. Used for descriptions, inputs, 
                                and general UI elements. High legibility is key for the punk aesthetic contrast.
                            </p>
                            <div class="flex gap-4 text-sm font-mono text-gray-500">
                                <span>Medium</span>
                                <span>Semibold</span>
                                <span>Bold</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- VISUAL EFFECTS -->
            <section id="effects" class="doc-section">
                <h3 class="text-4xl mb-8">Visual FX</h3>

                <div class="grid md:grid-cols-2 gap-8">
                    <!-- Halftone Explanation -->
                    <div class="glass-panel p-6">
                        <h4 class="text-xl mb-4 text-white">Halftone Overlay</h4>
                        <div class="h-32 w-full bg-gray-800 rounded-lg relative overflow-hidden mb-4 border border-white/20">
                            <!-- Mini halftone for demo -->
                            <div style="position:absolute; inset:0; background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 0px, transparent 1px); background-size: 8px 8px;"></div>
                        </div>
                        <p class="text-sm text-gray-400 mb-4">
                            Signature dot pattern applied globally via <code>pointer-events: none</code> overlay div.
                        </p>
                        <div class="code-block">
                            .halftone-overlay {<br>
                            &nbsp;&nbsp;mix-blend-mode: screen;<br>
                            &nbsp;&nbsp;mask-image: linear-gradient(...)<br>
                            }
                        </div>
                    </div>

                    <!-- Animation Demo -->
                    <div class="glass-panel p-6">
                        <h4 class="text-xl mb-4 text-white">Animations</h4>
                        
                        <div class="space-y-6">
                            <!-- Marquee -->
                            <div>
                                <span class="spec-label">Marquee (Product Names)</span>
                                <div class="w-full bg-black/50 overflow-hidden py-2 border border-white/10 rounded">
                                    <div class="animate-marquee whitespace-nowrap font-bold text-white uppercase">
                                        Limited Edition • Drop 001 • Cyberware • Limited Edition • Drop 001 • Cyberware
                                    </div>
                                </div>
                            </div>

                            <!-- Pulse -->
                            <div>
                                <span class="spec-label">Pulse (Countdowns)</span>
                                <div class="inline-flex items-center gap-2 px-3 py-1 bg-red-900/30 text-red-500 rounded text-xs font-bold uppercase border border-red-500/30">
                                    <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    Live Now
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- BUTTONS -->
            <section id="buttons" class="doc-section">
                <h3 class="text-4xl mb-8">Buttons & Actions</h3>

                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Primary -->
                    <div class="glass-panel p-8 flex flex-col items-center justify-center gap-4 text-center">
                        <button class="bp-btn bp-btn-primary">
                            ADD TO CART
                        </button>
                        <span class="spec-label mt-2">Primary Button</span>
                        <p class="text-xs text-gray-400">bg-white, text-black, hover:translate-y</p>
                    </div>

                    <!-- Checkout -->
                    <div class="glass-panel p-8 flex flex-col items-center justify-center gap-4 text-center">
                        <button class="bp-btn bp-btn-checkout">
                            CHECKOUT SECURELY
                        </button>
                        <span class="spec-label mt-2">Checkout Gradient</span>
                        <p class="text-xs text-gray-400">Zinc Gradient, Uppercase, Full Width</p>
                    </div>

                    <!-- Icon -->
                    <div class="glass-panel p-8 flex flex-col items-center justify-center gap-4 text-center">
                        <div class="flex gap-4">
                            <button class="bp-btn-icon">
                                <i class="ph ph-shopping-bag text-2xl"></i>
                            </button>
                            <button class="bp-btn-icon bg-white/10">
                                <i class="ph ph-x text-2xl"></i>
                            </button>
                        </div>
                        <span class="spec-label mt-2">Icon Actions</span>
                        <p class="text-xs text-gray-400">Circular, Hover bg-white/10</p>
                    </div>
                </div>
            </section>

            <!-- CARDS -->
            <section id="cards" class="doc-section">
                <h3 class="text-4xl mb-8">Pattern: Product Card</h3>

                <div class="grid md:grid-cols-2 gap-12 items-start">
                    
                    <!-- Live Component -->
                    <div class="bp-card w-full max-w-sm mx-auto">
                        <div class="aspect-square bg-gray-200 rounded-lg mb-4 relative overflow-hidden group">
                            <!-- Placeholder Image -->
                            <div class="absolute inset-0 bg-neutral-300 flex items-center justify-center text-neutral-400">
                                <i class="ph ph-image text-4xl"></i>
                            </div>
                            <div class="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                                NEW
                            </div>
                        </div>
                        
                        <div class="flex justify-between items-start mb-2">
                            <div class="overflow-hidden w-2/3">
                                <h4 class="font-bold text-lg truncate uppercase">Cyber Jacket V2</h4>
                            </div>
                            <span class="font-bold text-lg">$120.00</span>
                        </div>
                        
                        <div class="flex gap-2 mb-4">
                            <div class="w-8 h-8 flex items-center justify-center border border-black rounded text-xs font-bold hover:bg-black hover:text-white cursor-pointer transition">S</div>
                            <div class="w-8 h-8 flex items-center justify-center border border-black bg-black text-white rounded text-xs font-bold cursor-pointer transition">M</div>
                            <div class="w-8 h-8 flex items-center justify-center border border-black rounded text-xs font-bold hover:bg-black hover:text-white cursor-pointer transition">L</div>
                        </div>

                        <button class="w-full py-3 bg-black text-white font-bold uppercase text-xs rounded hover:opacity-80 transition">
                            View Details
                        </button>
                    </div>

                    <!-- Specs -->
                    <div>
                        <div class="glass-panel p-6 mb-6">
                            <h4 class="text-white text-xl mb-4">Card Tokens</h4>
                            <ul class="space-y-3 text-sm text-gray-400 font-mono">
                                <li class="flex justify-between border-b border-white/10 pb-2">
                                    <span>Background</span>
                                    <span class="text-white">White (Inverted theme)</span>
                                </li>
                                <li class="flex justify-between border-b border-white/10 pb-2">
                                    <span>Text</span>
                                    <span class="text-white">Black</span>
                                </li>
                                <li class="flex justify-between border-b border-white/10 pb-2">
                                    <span>Radius</span>
                                    <span class="text-white">Rounded-md (10px)</span>
                                </li>
                                <li class="flex justify-between border-b border-white/10 pb-2">
                                    <span>Interaction</span>
                                    <span class="text-white">Hover: TranslateY -4px</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="glass-panel p-6">
                             <h4 class="text-white text-xl mb-4">Notify Modal (Form)</h4>
                             <div class="space-y-4">
                                <div>
                                    <label class="spec-label">Email Input</label>
                                    <input type="text" class="bp-input" placeholder="enter@email.com">
                                </div>
                                <div class="flex gap-2">
                                    <button class="flex-1 py-2 bg-white/10 text-white text-sm font-bold rounded border border-white/20">EMAIL</button>
                                    <button class="flex-1 py-2 bg-transparent text-gray-500 text-sm font-bold rounded border border-transparent hover:text-white">SMS</button>
                                </div>
                             </div>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    </main>

    <script>
        // Smooth scrolling for sidebar links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Intersection Observer for Active State
        const sections = document.querySelectorAll('.doc-section');
        const navLinks = document.querySelectorAll('.sidebar-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.2 });

        sections.forEach(section => observer.observe(section));
    </script>
</body>
</html>
```