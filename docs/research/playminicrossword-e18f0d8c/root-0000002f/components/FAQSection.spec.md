# FAQSection Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/FAQSection.tsx`
- **Interaction model:** accordion (collapsible items)

## DOM Structure
- `section` (Container)
  - `div` (Wrapper)
    - `div` (Heading Group)
      - `span` (Label: "COMMON QUESTIONS")
      - `h2` (Title: "Frequently Asked Questions")
    - `div` (Accordion List)
      - `div` (Accordion Item x N)
        - `button` (Accordion Trigger)
          - `span` (Question Text)
          - `span` (Chevron Icon)
        - `div` (Accordion Content)
          - `p` (Answer Text)
    - `a` (Link: "See all 16 questions in the FAQ")

## Computed Styles

### Section Container
- padding-top: 64px
- padding-bottom: 64px
- background-color: rgb(250, 248, 244)

### Label ("COMMON QUESTIONS")
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
- margin-bottom: 32px

### Accordion Item
- border-bottom: 1px solid rgb(226, 219, 213)
- transition: background-color 0.2s ease

### Accordion Trigger
- display: flex
- justify-content: space-between
- align-items: center
- padding: 20px 0
- background: none
- border: none
- cursor: pointer
- font-family: Outfit, sans-serif
- font-size: 16px
- font-weight: 500
- color: rgb(44, 34, 27)
- text-align: left

### Accordion Content
- padding-bottom: 20px
- font-family: Outfit, sans-serif
- font-size: 14px
- color: rgb(110, 95, 83)
- line-height: 24px

### FAQ Link
- display: block
- text-align: center
- margin-top: 32px
- font-family: Outfit, sans-serif
- font-size: 14px
- font-weight: 500
- color: rgb(110, 95, 83)

## Responsive Behavior
- **Desktop (1440px):** Max-width 600px for the accordion list.
- **Mobile (390px):** Full width.
