# HeroIntro Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/HeroIntro.tsx`
- **Interaction model:** static

## DOM Structure
- `section` (Container)
  - `div` (Background Gradient Overlay)
  - `div` (Content Wrapper)
    - `div` (Header Group)
      - `h1` (Main Title: "Mini Crossword")
      - `p` (Sub-description: "Today’s 5×5 plus the last 90 days in the archive: free, no subscription, no signup.")
    - `nav` (Quick Links)
      - `a` (Daily puzzle)
      - `span` (Dot separator)
      - `a` (Unlimited)
      - `span` (Dot separator)
      - `a` (Archive)
      - `span` (Dot separator)
      - `a` (Hints)
      - `span` (Dot separator)
      - `a` (Answers)
    - `div` (Scroll Indicator)
      - `span` (Text: "MORE BELOW")
      - `span` (Vertical line)

## Computed Styles

### Section Container
- position: relative
- overflow: clip
- background-color: rgb(250, 248, 244)
- padding-top: 16px
- padding-bottom: 40px

### Background Overlay
- position: absolute
- inset: 0
- z-index: -10
- background: radial-gradient(70% 60% at 50% 0%, rgba(241, 113, 39, 0.1), rgba(0, 0, 0, 0) 70%), 
               radial-gradient(50% 50% at 80% 20%, rgba(37, 101, 228, 0.08), rgba(0, 0, 0, 0) 70%)
- opacity: 0.9

### Main Title
- font-family: Fraunces, serif
- font-size: 36px
- font-weight: 500
- font-style: italic
- color: rgb(44, 34, 27)
- line-height: 40px
- letter-spacing: -0.9px
- text-align: center

### Sub-description
- font-family: Outfit, sans-serif
- font-size: 16px
- color: rgb(110, 95, 83)
- line-height: 26px
- text-align: center
- max-width: 512px
- margin: 16px auto 0

### Quick Links
- display: flex
- justify-content: center
- align-items: center
- gap: 20px
- margin-top: 32px
- font-family: Outfit, sans-serif
- font-size: 14px
- font-weight: 500
- color: rgb(110, 95, 83)
- transition: color 0.15s ease

### Scroll Indicator
- display: flex
- flex-direction: column
- align-items: center
- gap: 8px
- margin-top: 56px

### "MORE BELOW" Text
- font-size: 11.2px
- font-weight: 500
- text-transform: uppercase
- letter-spacing: 2.464px
- color: rgb(147, 132, 118)

### Vertical Line
- width: 1px
- height: 40px
- background-color: rgb(227, 219, 211)

## Responsive Behavior
- **Desktop (1440px):** Centered layout, links in a single row.
- **Mobile (390px):** Title font-size reduces to ~28px, links may wrap.
