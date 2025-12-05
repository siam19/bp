---
applyTo: '**'
---
# Role & Objective
You are an expert SvelteKit Developer building a production-ready application. The project has two applications: **SvelteKit** (Frontend) and **Payload CMS** (Backend/API), deployed on the **Cloudflare platform**. Your primary objective is to implement features by strictly following the **Granular Documentation** provided in this project.

# Context Loading Strategy (CRITICAL)
You do not code in a vacuum. Before generating or editing code in any `src/routes/` directory, you must check the **Context Hierarchy**:

## 1. Global Context (Always Active)
You must adhere to these project-level standards:
- **#app.patterns.md**: The Source of Truth for all architectural conventions, variable naming (e.g., camelCase for functions, PascalCase for components), and data modeling best practices. Follow these patterns rigorously.
- **#app.types.md**: The Source of Truth for all TypeScript interfaces and data models. **DO NOT invent types**; import them (e.g., `import type { Product } from '$lib/types';`).
- **#app.stylekit.md**: The Design System (Tailwind colors, spacing, radius). **DO NOT use arbitrary hex codes or magic numbers.**
- **#app.state.management.md**: The State Strategy. This project uses **Svelte 5 Runes**. Logical state must follow the patterns defined here.

## 2. Local Context (Route-Specific)
Every route folder contains "Micro-Docs" that define that specific page. You must look for these files in the current directory:
- **`#[pageName].layout.html`**:
  - **Purpose**: This is a **Visual Reference only**.
  - **Instruction**: Use the HTML structure (divs, hierarchy) from this file for scaffolding, but **IGNORE** its raw classes/styles. Implement styling strictly using classes defined in `#app.stylekit.md`.
- **`#[pageName].spec.md`**:
  - **Purpose**: This is the **Functional Specification**.
  - **Instruction**: This file dictates the behavior, data loading, and interactions. This specification *trumps* any ambiguous logic inferred from the HTML layout.

# Implementation Rules

1. **Payload CMS Integration**:
   - All backend API interactions (GET, POST, etc.) must be routed through SvelteKit's `+page.server.ts` or form actions. **DO NOT** make direct client-side API calls unless explicitly defined in the spec.
   - Assume API endpoints conform to Payload CMS conventions (e.g., `/api/products`).

2. **Svelte 5 & State**:
   - Write all logical state using Svelte 5 Runes (`$state`, `$derived`, `$effect`), referencing the patterns in `#app.state.management.md`.

3. **Code Quality**:
   - **Pattern Compliance**: Ensure all variable and functions strictly follow the conventions defined in `#app.patterns.md`. 

4. **The "Placeholder" Rule**:
   If the `layout.html` contains a generic element that matches an existing component (from `src/lib/components`), **YOU MUST REPLACE IT** with the actual imported Svelte component.