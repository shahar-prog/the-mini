# Project Summary: The Mini (Play Mini Crossword Clone)

## 1. Project Overview & Objective
- **Repository Name / Directory:** `The Mini` (`ai-website-clone-template`)
- **Target Site:** [Play Mini Crossword](https://www.playminicrossword.com/)
- **Core Purpose:** Reverse-engineer and build a 1:1 pixel-perfect, fully functional responsive clone of Play Mini Crossword using a Next.js 16 + Tailwind CSS v4 + shadcn/ui stack.

---

## 2. Tech Stack & Configuration
| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16.3.5 (App Router) | React 19.2.4, TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS v4 | PostCSS `@tailwindcss/postcss`, `tw-animate-css` |
| **Color System** | OKLCH Tokens | Defined in [`src/app/globals.css`](file:///c:/Users/shaha/CodeProjects/The%20Mini/src/app/globals.css) |
| **UI Primitives** | shadcn/ui & `@base-ui/react` | Primitives in `src/components/ui/` |
| **Icons** | Lucide React | `lucide-react` |
| **Package Engine** | Node.js `>=24` | Scripts run via `npm.cmd` on Windows |

---

## 3. Architecture & Directory Breakdown

```
The Mini/
├── docs/
│   ├── research/playminicrossword-e18f0d8c/   # Extraction specs, tokens, output plan
│   └── design-references/                    # Original screenshots & comparisons
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # Global fonts (Outfit, Fraunces) & metadata
│   │   ├── globals.css                       # Design tokens, color schemes, animations
│   │   └── page.tsx                          # Root landing page composing all sections
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx                    # shadcn button primitive
│   │   └── sites/playminicrossword-e18f0d8c/root-0000002f/
│   │       ├── GlobalHeader.tsx              # Navigation bar, date header, action links
│   │       ├── HeroIntro.tsx                 # Headline & intro CTA
│   │       ├── PuzzleInterface.tsx           # 5x5 interactive crossword grid & clue display
│   │       ├── OnboardingModal.tsx           # How-to-play popup modal for first-time users
│   │       ├── TutorialGrid.tsx              # Interactive mini-grid inside onboarding modal
│   │       ├── ArchiveSelector.tsx           # Date / past puzzle switcher
│   │       ├── HowToPlay.tsx                 # Rules, controls, and tips
│   │       ├── PickYourSize.tsx              # Grid size options (Classic 5x5, 7x7, 9x9)
│   │       ├── AboutSection.tsx              # Background info & features
│   │       ├── FAQSection.tsx                # Accordion/FAQ list
│   │       └── Footer.tsx                    # Site footer & copyright
│   ├── types/
│   │   └── playminicrossword.ts              # CrosswordPuzzle, Clue, PageContent interfaces
│   └── lib/
│       └── utils.ts                          # clsx + twMerge utility (`cn`)
```

---

## 4. Current State & Known Issues

### What Works
- Visual layout and structure are faithful to the source site.
- Interactive components: Onboarding modal, tutorial steps, header navigation, puzzle grid presentation.
- Global styling and responsive typography tokens are in place.

### Diagnosed TypeCheck Errors (`npm.cmd run typecheck`)
1. **[`src/app/page.tsx`](file:///c:/Users/shaha/CodeProjects/The%20Mini/src/app/page.tsx#L16-L36)**:
   - `MOCK_PUZZLE` is missing required fields: `id`, `date`, `size`.
2. **[`src/components/sites/playminicrossword-e18f0d8c/root-0000002f/TutorialGrid.tsx`](file:///c:/Users/shaha/CodeProjects/The%20Mini/src/components/sites/playminicrossword-e18f0d8c/root-0000002f/TutorialGrid.tsx#L56-L70)**:
   - `steps` lookup has implicit `any` index type error.
   - Callback parameters in `grid.map((row, rowIndex) => ...)` and `highlights.some(([r, c]) => ...)` lack explicit typing under `noImplicitAny`.

---

## 5. Recommended Next Steps
1. **Fix TypeScript Errors:** Resolve typing issues in `page.tsx` and `TutorialGrid.tsx` so `npm.cmd run typecheck` passes cleanly.
2. **Interactive Puzzle Engine:**
   - Implement real puzzle validation (across/down clue synchronization, letter checking, timer, win condition modal).
   - Add sample puzzle sets or daily puzzle generation.
3. **Archive & Difficulty Selectors:**
   - Wire up dynamic switching between puzzle sizes and archive dates.
