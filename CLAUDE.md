# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run lint` — Run ESLint check
- `npm run typecheck` — Run TypeScript type check
- `npm run check` — Comprehensive check (lint + typecheck + build)
- `/clone-website <url>` — Trigger the website reverse-engineering workflow (via `.claude/commands/clone-website.md`)

## Architecture & Structure
This is a **Website Reverse-Engineer Template** designed to emulate target websites pixel-perfectly using a modern Next.js stack.

### Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **Styling:** Tailwind CSS v4 with oklch design tokens
- **UI Components:** shadcn/ui (Radix primitives)
- **Icons:** Lucide React (default), supplemented by extracted SVGs in `src/components/icons.tsx`

### Project Layout
- `src/app/`: Next.js routes and page layouts.
- `src/components/`: React components. `ui/` contains shadcn primitives.
- `public/`: Static assets (`images/`, `videos/`, `seo/`) downloaded from the target site.
- `docs/`:
  - `research/`: Contains the output of the reconnaissance phase, including detailed component specifications and computed CSS values.
  - `design-references/`: Visual references and screenshots of the target site.
- `.agents/skills/clone-website/`: The canonical cross-agent cloning workflow logic.
- `AGENTS.md`: The single source of truth for agent instructions and design principles.

### Design Principles
- **Pixel-Perfect Emulation:** Match spacing, colors, and typography 1:1. No aesthetic changes during the emulation phase.
- **Real Content:** Use actual text and assets from the target site.
- **Beauty-First:** High attention to detail on every pixel.
