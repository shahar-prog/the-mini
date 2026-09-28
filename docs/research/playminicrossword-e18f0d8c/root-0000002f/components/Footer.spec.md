# Footer Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/Footer.tsx`
- **Interaction model:** static links

## DOM Structure
- `footer` (Container)
  - `div` (Wrapper)
    - `div` (Logic Puzzles Grid)
      - `h3` (Title: "MORE LOGIC PUZZLES")
      - `div` (Puzzle Links Grid)
        - `a` (External Link x 8)
          - `div` (Puzzle Info)
            - `span` (Name)
            - `span` (Description)
    - `div` (Bottom Nav Group)
      - `div` (Link Column x 4)
        - `h3` (Column Title: e.g., "PLAY")
        - `ul` (Link List)
          - `li` (Link x N)
    - `div` (Copyright Row)
      - `span` (Copyright Text)
      - `span` (Slogan: "Always free.")
      - `span` (Quick Links: "DAILY · ARCHIVE · HINTS · ANSWERS")

## Computed Styles

### Footer Container
- padding-top: 64px
- padding-bottom: 64px
- background-color: rgb(250, 248, 244)
- border-top: 1px solid rgb(226, 219, 213)

### Logic Puzzles Section
- margin-bottom: 64px

### Logic Puzzle Title
- font-family: Outfit, sans-serif
- font-size: 12px
- font-weight: 600
- color: rgb(110, 95, 83)
- text-transform: uppercase
- letter-spacing: 1.5px
- margin-bottom: 24px

### Puzzle Card
- display: flex
- flex-direction: column
- gap: 2px
- transition: color 0.2s ease
- font-family: Outfit, sans-serif

### Puzzle Card Name
- font-size: 16px
- font-weight: 600
- color: rgb(44, 34, 27)

### Puzzle Card Description
- font-size: 14px
- color: rgb(110, 95, 83)

### Bottom Nav Column
- display: flex
- flex-direction: column
- gap: 12px

### Nav Column Title
- font-family: Outfit, sans-serif
- font-size: 12px
- font-weight: 600
- color: rgb(110, 95, 83)
- text-transform: uppercase
- letter-spacing: 1.5px
- margin-bottom: 16px

### Nav Link
- font-family: Outfit, sans-serif
- font-size: 14px
- color: rgb(110, 95, 83)
- transition: color 0.2s ease

### Copyright Row
- border-top: 1px solid rgb(226, 219, 213)
- padding-top: 32px
- margin-top: 64px
- font-family: Outfit, sans-serif
- font-size: 12px
- color: rgb(110, 95, 83)

## Responsive Behavior
- **Desktop (1440px):** Logic puzzle grid in 4 columns, Nav columns in 4 columns.
- **Mobile (390px):** Logic puzzle grid in 1 column, Nav columns stack.
