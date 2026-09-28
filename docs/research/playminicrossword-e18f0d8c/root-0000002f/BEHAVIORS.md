# Behaviors: playminicrossword.com (root-0000002f)

## Interaction Model
The page is primarily a static informational page with embedded interactive components (the crossword puzzle) and simple click-driven navigation.

## Observed Behaviors

### 1. Navigation & Header
- **Header:** Static. Does not appear to change on scroll.
- **Links:** Standard hover states (color change, underline).

### 2. Crossword Puzzle (Main Component)
- **Interaction Model:** High-complexity, click-driven.
- **Behaviors:**
  - **Cell Selection:** Clicking a cell focuses it, highlights it, and updates the active clue.
  - **Input:** Typing characters fills the cell and automatically moves focus to the next cell.
  - **Clue Interaction:** Clicking a clue focuses the corresponding cell/row/column.
  - **State Transitions:** 
    - Selected Cell: Background color change.
    - Active Row/Col: Subtler background highlight.
    - Correct/Incorrect feedback (likely handled via state).
- **Onboarding Modal:** Appears on load, introduces the game. Click-driven (Next button).

### 3. Archive Section
- **Tab Switching:** The date pills (Today, Sep 27, etc.) are click-driven. Clicking a date updates the content (likely a route change or state update).
- **Active State:** The active date pill has a distinct background color.

### 4. Accordions (FAQ Section)
- **Interaction Model:** Click-driven.
- **Behaviors:**
  - **Trigger:** Clicking the question expands/collapses the answer.
  - **Transition:** Height transition (slide down/up) with rotation of the chevron icon.

### 5. Responsive Transitions
- **Desktop (1440px):** Multi-column layout for "How to Play" and "About" sections.
- **Mobile (390px):** All sections stack vertically. Grid layouts for "Pick your size" and "Common Questions" collapse to single columns.

## Summary of Interaction Model
- Global: Static/Informational
- Components: High-interactivity (Puzzle), Low-interactivity (Tabs, Accordions)
