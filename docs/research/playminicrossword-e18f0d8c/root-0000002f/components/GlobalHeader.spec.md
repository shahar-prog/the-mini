# GlobalHeader Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/GlobalHeader.tsx`
- **Interaction model:** static (with hover states on links)

## DOM Structure
- `nav` (Container)
  - `div` (Max-width wrapper)
    - `div` (Flex inner)
      - `a` (Logo link)
        - `span` (Logo text: "Mini Crossword")
        - `span` (Logo dot: orange circle)
      - `div` (Nav links - hidden on mobile)
        - `a` (Daily)
        - `a` (Archive)
        - `a` (Unlimited)
        - `a` (How to Play)
        - `button` (Search/User action)
        - `span` (User profile wrapper)
        - `button` (Mobile menu toggle)
      - `div` (Mobile nav links - hidden on desktop)

## Computed Styles

### Nav Container
- position: sticky
- top: 0px
- z-index: 50
- height: 64px
- background: transparent (initially)
- transition: background-color 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out
- color: rgb(47, 37, 30)
- font-family: Outfit, system-ui, sans-serif

### Logo
- font-family: Fraunces, Georgia, serif
- font-size: 20px
- font-weight: 600
- color: rgb(44, 34, 27)
- line-height: 28px
- letter-spacing: -0.5px

### Logo Dot
- width: 8px
- height: 8px
- background-color: rgb(241, 113, 39)
- border-radius: 2px
- margin-left: 6.4px

### Nav Links
- font-size: 14px
- font-weight: 500
- color: rgb(110, 95, 83)
- gap: 28px
- transition: color 0.2s ease

## States & Behaviors
### Hover States
- **Links:** color changes from `rgb(110, 95, 83)` to `rgb(47, 37, 30)` (estimated based on foreground).
- **Logo Dot:** Likely a slight scale or opacity change.

## Text Content
- Logo: "Mini Crossword"
- Links: "Daily", "Archive", "Unlimited", "How to Play"

## Responsive Behavior
- **Desktop (1440px):** Full nav links visible.
- **Mobile (390px):** Nav links replaced by a mobile menu toggle (hamburger icon).
- **Breakpoint:** Switches at `md` (768px).
