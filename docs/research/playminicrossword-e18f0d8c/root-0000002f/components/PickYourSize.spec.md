# PickYourSize Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/PickYourSize.tsx`
- **Interaction model:** selection cards

## DOM Structure
- `section` (Container)
  - `div` (Wrapper)
    - `h3` (Title: "Pick your size")
    - `div` (Cards Grid)
      - `a` (Size Card x 3)
        - `div` (Card Content)
          - `span` (Name: e.g., "Classic")
          - `span` (Dimensions: e.g., "5 × 5")
          - `span` (Solve Time: e.g., "1–3 min solves")

## Computed Styles

### Section Container
- padding-top: 48px
- padding-bottom: 48px
- background-color: rgb(250, 248, 244)

### Title
- font-family: Fraunces, serif
- font-size: 20px
- font-weight: 500
- color: rgb(44, 34, 27)
- margin-bottom: 24px

### Cards Grid
- display: grid
- grid-template-columns: repeat(3, 1fr)
- gap: 16px

### Size Card
- display: flex
- flex-direction: column
- padding: 24px
- background-color: rgb(255, 255, 255)
- border: 1px solid rgb(226, 219, 213)
- border-radius: 12px
- transition: all 0.2s ease
- text-decoration: none

### Card Name
- font-family: Outfit, sans-serif
- font-size: 16px
- font-weight: 600
- color: rgb(44, 34, 27)

### Card Dimensions
- font-family: Fraunces, serif
- font-size: 20px
- font-weight: 500
- color: rgb(44, 34, 27)
- margin: 4px 0

### Card Solve Time
- font-family: Outfit, sans-serif
- font-size: 14px
- color: rgb(110, 95, 83)

## Responsive Behavior
- **Desktop (1440px):** Three cards in a row.
- **Mobile (390px):** Cards stack vertically.
