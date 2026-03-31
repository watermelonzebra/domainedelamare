# Astro + Sanity — Production Starter

A production-grade blog starter built on **Astro** and **Sanity**, implementing best practices from four comprehensive skill sets:

- **`astro-patterns`** — Routing, component architecture, SSG, SEO
- **`astro-developer`** — TypeScript, islands architecture, Tailwind-compatible design tokens, performance
- **`astro-a11y`** — WCAG 2.1 AA compliance, keyboard navigation, screen readers, reduced motion
- **`sanity-best-practices`** — Schema design, GROQ queries, TypeGen, Studio structure

---

## Project Structure

```
/
├── astro-app/               # Astro frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Header, Footer (shared across all pages)
│   │   │   ├── ui/          # PostCard, PortableTextRenderer (atomic)
│   │   │   └── features/    # (placeholder for feature-specific components)
│   │   ├── layouts/
│   │   │   ├── BaseLayout.astro   # HTML shell, SEO, skip link
│   │   │   └── PageLayout.astro   # BaseLayout + Header + Footer
│   │   ├── pages/
│   │   │   ├── index.astro        # Homepage — latest posts grid
│   │   │   ├── about.astro        # About page
│   │   │   ├── 404.astro          # Custom 404
│   │   │   ├── blog/
│   │   │   │   └── index.astro    # Blog listing
│   │   │   └── post/
│   │   │       └── [postSlug].astro  # Post detail (dynamic)
│   │   ├── sanity/
│   │   │   ├── fragments/
│   │   │   │   └── image.ts       # Reusable GROQ image fragment
│   │   │   └── queries/
│   │   │       └── posts.ts       # All post queries + fetchers
│   │   ├── styles/
│   │   │   └── global.css         # Design tokens, resets, a11y utilities
│   │   └── utils/
│   │       ├── image.ts           # Sanity image URL builder
│   │       └── format.ts          # Date formatting helpers
│   ├── astro.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── studio/                  # Sanity Studio
│   ├── src/
│   │   ├── schemaTypes/
│   │   │   ├── documents/
│   │   │   │   ├── post.ts        # Post schema (full, with SEO + validation)
│   │   │   │   ├── author.ts      # Author schema
│   │   │   │   ├── category.ts    # Category schema
│   │   │   │   └── siteSettings.ts  # Global settings (singleton)
│   │   │   ├── objects/
│   │   │   │   └── blockContent.ts  # Portable Text definition
│   │   │   ├── shared/
│   │   │   │   └── seoFields.ts   # Reusable SEO fields
│   │   │   └── index.ts           # Schema registry
│   │   └── structure/
│   │       └── index.ts           # Custom desk structure
│   ├── sanity.config.ts
│   ├── sanity.cli.ts              # TypeGen config
│   └── package.json
│
└── package.json             # Root workspace
```

---

## Quick Start

### 1. Create a Sanity project

```bash
# If you haven't already
npm create sanity@latest
```

Note your **Project ID** and **Dataset** from [sanity.io/manage](https://sanity.io/manage).

### 2. Configure environment variables

```bash
# astro-app
cp astro-app/.env.example astro-app/.env

# studio
cp studio/.env.example studio/.env
```

Fill in your `PROJECT_ID` and `DATASET` in both files.

### 3. Install dependencies

```bash
npm install
```

### 4. Run development servers

```bash
# Frontend (Astro) — http://localhost:4321
npm run dev:astro

# Studio — http://localhost:3333
npm run dev:studio
```

### 5. Generate TypeScript types (after schema changes)

```bash
npm run typegen
```

This runs in the `studio` workspace, extracts your schema, scans the `astro-app/src` for `defineQuery()` calls, and writes `astro-app/sanity.types.ts`.

---

## Architecture Decisions

### Routing

| Route | File | Notes |
|-------|------|-------|
| `/` | `pages/index.astro` | Latest 6 posts grid |
| `/blog` | `pages/blog/index.astro` | All posts listing |
| `/post/[postSlug]` | `pages/post/[postSlug].astro` | Dynamic, descriptive param name |
| `/about` | `pages/about.astro` | Static content page |
| `/404` | `pages/404.astro` | Custom error page |

### Layout Hierarchy

```
BaseLayout (HTML shell, SEO, skip link)
  └── PageLayout (adds Header + Footer slots)
        └── Pages (pass title + description up)
```

All SEO meta tags live **only** in `BaseLayout` — never duplicated in child layouts or pages.

### GROQ Query Rules

All queries follow these rules:
1. **`defineQuery()`** wrapper — required for TypeGen type inference
2. **Projections always** — never fetch bare `*[_type == "post"]`
3. **`_key` in array projections** — required for Visual Editing and React reconciliation
4. **Order before slice** — `| order(publishedAt desc)[0...N]`
5. **`$params` not interpolation** — prevents query manipulation, enables caching
6. **`defined()` checks** — `slug.current` indexed, filters efficiently

### Sanity Schema Rules

- `defineType` + `defineField` + `defineArrayMember` — always, for type safety
- References for reusable content (authors, categories)
- Objects for page-specific content (SEO fields)
- Status as a list, not a boolean — extensible
- Alt text required on all images — WCAG compliance
- Slug uniqueness validation — async, per-document

### Studio Structure

- **Singletons first** — Site Settings at the top with fixed `documentId`
- **Grouped navigation** — Blog section contains posts, authors, categories
- **Filtered generic list** — Singletons excluded from the catch-all list to prevent duplicates

---

## Accessibility Checklist (WCAG 2.1 AA)

Every page in this project is built to meet WCAG 2.1 AA:

| Requirement | Implementation |
|-------------|----------------|
| Skip link | `BaseLayout.astro` — `.skip-link` reveals on focus |
| Focus visible | `global.css` — `:focus-visible` with 3px outline |
| Keyboard navigation | All interactive elements use native `<a>` or `<button>` |
| Colour contrast | Design tokens verified at 4.5:1 (text) and 3:1 (UI) |
| Reduced motion | `global.css` — `prefers-reduced-motion` media query |
| Semantic landmarks | `<header>`, `<nav>`, `<main>`, `<footer>` with `aria-label` |
| Active page | `aria-current="page"` on active nav links |
| Stretched links | Single `<a>` per card (PostCard), no duplicate tab stops |
| `<time>` elements | All dates use `<time datetime="...">` |
| Alt text | Required by schema validation; `aria-hidden="true"` on decorative images |
| External links | Screen-reader notice `(opens in new tab)` via `.sr-only` span |
| New tab links | `target="_blank" rel="noopener noreferrer"` |

---

## TypeGen Workflow

After any schema change:

```bash
# In project root
npm run typegen

# Or in studio/ directly
cd studio
npm run typegen
```

Types are written to `astro-app/sanity.types.ts`. With `overloadClientMethods: true` in `sanity.cli.ts`, `sanityClient.fetch(DEFINED_QUERY)` automatically returns the correct TypeScript type — no manual type imports needed.

---

## Adding a New Document Type

1. **Create schema** in `studio/src/schemaTypes/documents/myType.ts`
2. **Register** it in `studio/src/schemaTypes/index.ts`
3. **Add to structure** in `studio/src/structure/index.ts`
4. **Write GROQ query** in `astro-app/src/sanity/queries/myType.ts` using `defineQuery()`
5. **Run `npm run typegen`** to generate types
6. **Create page/component** using the typed query

---

## Deployment

This project uses `output: 'static'` (full SSG). Every page is pre-rendered at build time.

### Vercel / Netlify

```bash
# Build command
npm run build --workspace=astro-app

# Output directory
astro-app/dist
```

Set environment variables (`PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`) in your hosting dashboard.

### Sanity Studio

```bash
# Deploy Studio to Sanity's hosted platform
npm run deploy --workspace=studio
```
