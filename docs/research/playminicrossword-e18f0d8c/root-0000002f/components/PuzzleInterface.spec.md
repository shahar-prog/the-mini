# PuzzleInterface Specification

## Overview
- **Target file:** `src/components/sites/playminicrossword-e18f0d8c/root-0000002f/PuzzleInterface.tsx`
- **Interaction model:** High-complexity, click-driven with keyboard input

## DOM Structure
- `div` (Main Container)
  - `div` (Grid Wrapper)
    - `div` (The 5x5 Grid)
      - `div` (Cell x 25)
        - `span` (Optional Number Indicator)
        - `span` (Optional Character Content)
  - `div` (Clues Container)
    - `div` (Across Clues List)
    - `div` (Down Clues List)

## Computed Styles

### Grid Container
- display: grid
- grid-template-columns: repeat(5, 27.1875px)
- grid-template-rows: repeat(5, 27.1875px)
- gap: 1px
- background-color: rgb(18, 18, 18)
- border: 2px solid rgb(18, 18, 18)
- width: 143.9px
- height: 143.9px

### Cell Types
- **Standard Cell:**
  - background-color: rgb(255, 255, 255)
  - color: rgb(23, 23, 23)
  - font-family: Helvetica Neue, Arial, sans-serif
  - font-size: 16px
  - cursor: pointer
- **Block Cell:**
  - background-color: rgb(18, 18, 18)
- **Selected Cell:**
  - background-color: rgb(255, 217, 0) (Yellow)
- **Active Row/Col:**
  - background-color: rgb(168, 216, 255) (Light Blue)

### Cell Number Indicator
- position: absolute
- top: 2px
- left: 2px
- font-size: 10px
- font-weight: 500
- color: rgb(47, 37, 30)

## States & Behaviors

### Interaction Model: Click-to-Focus
- **Cell Selection:** Clicking a cell focuses it. 
  - The focused cell turns Yellow.
  - The entire row and column of the focused cell turn Light Blue.
- **Keyboard Input:**
  - Typing a character fills the current cell and automatically moves focus to the next available cell in the current direction (Across/Down).
  - Backspace deletes the character and moves focus to the previous cell.
- **Clue Sync:**
  - Focusing a cell automatically highlights the corresponding clue in the "Across" or "Down" list.
  - Clicking a clue focuses the first cell of that clue's answer.

### Transitions
- Focus transitions: 0.1s ease.
- Color changes for active rows/cols: 0.1s ease.

## Responsive Behavior
- **Desktop (1440px):** Grid and Clues displayed side-by-side.
- **Mobile (390px):** Grid displayed on top, Clues stacked below it.
- **Breakpoint:** layout switches at ~768px.
