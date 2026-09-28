# AboutSection Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/AboutSection.tsx`
- **Interaction model:** static informational

## DOM Structure
- `section` (Container)
  - `div` (Wrapper)
    - `div` (Heading Group)
      - `span` (Label: "ABOUT THE PUZZLE")
      - `h2` (Title: "A Free Mini Crossword to Play Online")
    - `div` (Main Text)
      - `p` (Paragraph 1)
      - `p` (Paragraph 2)
      - `p` (Paragraph 3)
    - `div` (Feature Grid)
      - `div` (Feature Block x 3)
        - `span` (Tag: e.g., "FREE")
        - `h3` (Title: e.g., "No subscription, ever")
        - `p` (Description)

## Computed Styles

### Section Container
- padding-top: 64px
- padding-bottom: 64px
- background-color: rgb(250, 248, 244)

### Label ("ABOUT THE PUZZLE")
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
- margin-bottom: 24px

### Main Text
- font-family: Outfit, sans-serif
- font-size: 16px
- color: rgb(110, 95, 83)
- line-height: 26px
- margin-bottom: 24px

### Feature Block
- display: flex
- flex-direction: column
- gap: 8px
- padding: 0
- margin-bottom: 32px

### Feature Tag
- font-family: Outfit, sans-serif
- font-size: 12px
- font-weight: 600
- color: rgb(110, 95, 83)
- text-transform: uppercase
- letter-spacing: 1px

### Feature Title
- font-family: Fraunces, serif
- font-size: 20px
- font-weight: 500
- color: rgb(44, 34, 27)
- margin-bottom: 8px

### Feature Description
- font-family: Outfit, sans-serif
- font-size: 14px
- color: rgb(110, 95, 83)
- line-height: 22px

## Responsive Behavior
- **Desktop (1440px):** Feature grid in 3 columns.
- **Mobile (390px):** Single column stacked.
