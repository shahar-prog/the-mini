# OnboardingModal Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/OnboardingModal.tsx`
- **Interaction model:** click-driven

## DOM Structure
- `div` (Overlay container)
  - `button` (Backdrop - blur + semi-transparent black)
  - `div` (Modal card)
    - `div` (Header)
      - `h2` (Title: "A bite-size crossword, daily")
      - `button` (Close button: X icon)
    - `div` (Puzzle Preview)
      - `div` (Mini 5x5 grid mock)
    - `p` (Instruction text)
    - `div` (Footer)
      - `p` (Step counter: "1/4")
      - `div` (Pagination dots)
      - `button` (Next button)

## Computed Styles

### Overlay Container
- position: fixed
- inset: 0px
- z-index: 60
- display: flex
- justify-content: center
- align-items: center
- padding: 16px

### Backdrop
- position: absolute
- inset: 0px
- background-color: rgba(0, 0, 0, 0.55)
- backdrop-filter: blur(4px)
- cursor: default

### Modal Card
- position: relative
- width: 448px (max-w-md)
- background-color: rgb(250, 248, 244)
- border: 1px solid rgb(226, 219, 213)
- border-radius: 16px
- padding: 24px
- box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)

### Header
- display: flex
- justify-content: space-between
- align-items: center
- margin-bottom: 16px

### Title
- font-size: 20px
- font-weight: 600
- color: rgb(47, 37, 30)
- line-height: 28px

### Puzzle Preview
- height: 176px
- border: 1px solid rgb(226, 219, 213)
- border-radius: 12px
- display: flex
- justify-content: center
- align-items: center
- overflow: hidden

### Grid Mock
- display: grid
- grid-template-columns: repeat(5, 1fr)
- background-color: rgb(18, 18, 18)
- width: 143.9px
- height: 143.9px
- border: 2px solid rgb(18, 18, 18)

### Instruction Text
- font-size: 14px
- color: rgb(109, 95, 85)
- line-height: 22.75px
- margin-bottom: 24px

### Footer
- display: flex
- justify-content: space-between
- align-items: center
- gap: 12px

### Next Button
- background-color: rgb(37, 101, 228)
- color: rgb(255, 255, 255)
- padding: 0 12px
- height: 36px
- border-radius: 10px
- font-weight: 500

## States & Behaviors
### Interactivity
- **Next Button:** Advances to next step of onboarding (updates content and pagination dots).
- **Close Button:** Dismisses the modal.
- **Backdrop:** Likely dismisses the modal if clicked.

### Pagination Dots
- **Active Dot:** `rgb(37, 101, 228)` (Blue)
- **Inactive Dot:** `rgb(226, 219, 213)` (Light gray)
- Transition: 0.15s ease

## Text Content
- Title: "A bite-size crossword, daily"
- Instructions: "Solve the 5×5 mini grid. Across and Down answers share letters where they cross."
- Step: "1/4"
- Button: "Next"

## Responsive Behavior
- **Desktop (1440px):** Card width is 448px.
- **Mobile (390px):** Card width is `calc(100% - 32px)`.
