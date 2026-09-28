# ArchiveSelector Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/ArchiveSelector.tsx`
- **Interaction model:** horizontal-scroll navigation

## DOM Structure
- `section` (Container)
  - `div` (Header Group)
    - `h2` (Title: "Recent from the archive")
    - `a` (Link: "Full puzzle archive →")
  - `div` (Pill Container - overflow-x-auto)
    - `a` (Date Pill x N)
      - `span` (Date Text: e.g., "Sep 27")

## Computed Styles

### Section Container
- padding-top: 48px
- padding-bottom: 48px
- background-color: rgb(250, 248, 244)

### Header Group
- display: flex
- justify-content: space-between
- align-items: baseline
- margin-bottom: 24px

### Archive Title
- font-family: Fraunces, serif
- font-size: 24px
- font-weight: 500
- color: rgb(44, 34, 27)

### Archive Link
- font-family: Outfit, sans-serif
- font-size: 14px
- font-weight: 500
- color: rgb(110, 95, 83)
- transition: color 0.2s ease

### Pill Container
- display: flex
- gap: 8px
- overflow-x: auto
- padding-bottom: 8px
- scrollbar-width: none (hide scrollbar)

### Date Pill
- display: block
- background-color: rgb(250, 248, 244)
- color: rgb(84, 69, 59)
- padding: 6px 14px
- border-radius: 9999px
- font-size: 14px
- font-weight: 500
- border: 1px solid rgb(227, 219, 211)
- transition: all 0.2s ease
- cursor: pointer

### Date Pill Hover/Active
- background-color: rgb(227, 219, 211)
- color: rgb(44, 34, 27)
- border-color: rgb(44, 34, 27)

## Responsive Behavior
- **Desktop (1440px):** Layout is centered, pills scroll horizontally.
- **Mobile (390px):** Pill container occupies full width, horizontal scroll active.
