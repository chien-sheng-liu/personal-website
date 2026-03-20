# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Production build (runs `clean` automatically via `prebuild`)
- `npm run lint` / `npm run lint:fix` - ESLint
- `npm run clean` - Delete `.next` cache (runs automatically before dev/build)

## Architecture

### Stack
Next.js 15 (App Router, React 19) + Tailwind CSS v4 (`@theme` directive, not tailwind.config.js) + Framer Motion + d3-geo/topojson-client + tsparticles

### Internationalization (2 locales)

| Locale | Route prefix | Default? |
|--------|-------------|----------|
| Traditional Chinese (zh) | `/` (no prefix) | Yes |
| English | `/en/` | No |

- `middleware.js` (root) handles language detection via cookie `preferred-lang` → Accept-Language header → fallback to `zh`
- Each locale has its own page files: `src/app/page.js` (zh), `src/app/en/page.js`
- Locale sub-layout: `src/app/en/layout.js`
- **When modifying a page, the same change must be applied to both locale versions**

### Page Structure

Each locale has: homepage (`page.js`), `/about`, `/articles`, `/articles/[slug]`, `/contact`, `/projects`

- Homepage data: inline in each `page.js`
- Project data: `src/data/projectData.js` (shared, locale-aware)
- About data: `src/app/about/aboutData.js`, `src/app/en/about/aboutData.js`

### Content System

- Markdown articles in `content/articles/{zh,en}/`
- `src/lib/content.js` - File-based content reading with frontmatter parsing
- `src/lib/markdown.js` - Markdown → HTML with TOC generation (uses `marked` library)
- API routes: `src/app/api/content/articles/` serve content as JSON

### Key Components

- `Navbar.js` - Navigation with language switcher dropdown, sets `preferred-lang` cookie
- `FlightTimeline.js` - Career journey timeline with world map, flight arcs, and detail modals
- `FlightArc.js` - SVG animated arcs with traveling light dots between timeline nodes
- `WorldMapBackground.js` - 2D world map using d3-geo + Natural Earth TopoJSON (`public/data/world-110m.json`)
- `ParticlesBackground.js` - tsparticles background effect
- `MarkdownRenderer.js` - Renders HTML from markdown with Shiki syntax highlighting
- `Footer.js` - Site footer

### Styling

- Tailwind CSS v4 with `@theme` directive in `globals.css` (not `tailwind.config.js`)
- Light theme: body bg `#f8fafc`, text `#334155`
- Accent colors: `--color-electric-blue: #0ea5e9`, `--color-violet-glow: #6366f1`
- Theme forced to light mode via `next-themes` in `src/app/providers.js`
- Font: Noto Sans TC (loaded via `next/font/google` in root `layout.js`)

### Common Patterns

- Client components use `"use client"` directive and Framer Motion for animations
- Server components for article/content pages (data fetched at build time)
- All page-level styling uses direct Tailwind classes (not CSS custom properties for colors)

### Dependency Rules

- **React 19**: Many popular React libraries (e.g. `react-simple-maps`) only support React 16-18. Always check `peerDependencies` before `npm install`. If peer conflict occurs, prefer lower-level alternatives (e.g. `d3-geo` + `topojson-client` instead of `react-simple-maps`).
- **Turbopack cache corruption**: If `npm run dev` shows `TurbopackInternalError` or `Cannot find module .next/postcss.js`, run `npm run clean` to clear the `.next` cache, then retry.
- **No Three.js**: Three.js / React Three Fiber was removed. Use SVG + d3-geo for map/geo visualizations.
