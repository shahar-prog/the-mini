# HowToPlay Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/HowToPlay.tsx`
- **Interaction model:** static informational

## DOM Structure
- `section` (Container)
  - `div` (Wrapper)
    - `div` (Header Group)
      - `span` (Label: "THE BASICS")
      - `h2` (Title: "How to Play Mini Crossword")
      - `p` (Intro text)
    - `div` (Grid Layout)
      - `div` (Five Rules Column)
        - `h3` (Title: "Five rules")
        - `ol` (Ordered List)
          - `li` (Rule x 5)
      - `div` (Pro Tips Column)
        - `h3` (Title: "Pro tips")
        - `ul` (Unordered List)
          - `li` (Tip x 5)
      - `div` (How Clues Work Column)
        - `h3` (Title: "How clues work")
        - `div` (Across/Down descriptions)
        - `p` (Crossing letters explanation)

## Computed Styles

### Section Container
- padding-top: 64px
- padding-bottom: 64px
- background-color: rgb(250, 248, 244)

### Label ("THE BASICS")
- font-family: Outfit, sans-serif
- font-size: 12px
- font-weight: 600
- color: rgb(110, 95, 83)
- text-transform: uppercase
- letter-spacing: 1.5px
- margin-bottom: 8px

### Title
- font-family: Fraunces, serif
- font-size: 28px
- font-weight: 500
- color: rgb(44, 34, 27)
- margin-bottom: 16px

### Intro Text
- font-family: Outfit, sans-serif
- font-size: 16px
- color: rgb(110, 95, 83)
- line-height: 26px
- max-width: 600px
- margin-bottom: 40px

### Sub-headings (h3)
- font-family: Fraunces, serif
- font-size: 20px
- font-weight: 500
- color: rgb(44, 34, 27)
- margin-bottom: 16px

### Rules List
- font-family: Outfit, sans-serif
- font-size: 14px
- color: rgb(44, 34, 27)
- line-height: 24px
- gap: 12px

### Pro Tips List
- font-family: Outfit, sans-serif
- font-size: 14px
- color: rgb(110, 95, 83)
- line-height: 24px
- gap: 12px

## Responsive Behavior
- **Desktop (1440px):** Three-column layout.
- **Mobile (390px):** Single-column stacked layout.
