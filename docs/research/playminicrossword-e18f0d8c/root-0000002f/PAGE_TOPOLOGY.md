# Page Topology: playminicrossword.com (root-0000002f)

## Overall Layout
- **Structure:** Vertical flow of full-width sections.
- **Container:** Centered max-width container for most content.
- **Z-Index Layers:** 
  - Onboarding Modal (Highest - overlays everything)
  - Header (Sticky/Fixed - though behaviors suggest it's simple)
  - Main Content (Base layer)

## Section Map (Top to Bottom)

| Section Name | Visual Order | Type | Interaction Model | Description |
| :--- | :---: | :--- | :--- | :--- |
| **Global Header** | 1 | Overlay/Fixed | Click-driven | Logo, Nav links, User profile, Search |
| **Onboarding Modal** | Overlay | Modal | Click-driven | Introduction to the mini crossword |
| **Puzzle Interface** | 2 | Flow | High-Complexity Click/Input | The core 5x5 crossword grid and clue list |
| **Hero / Intro** | 3 | Flow | Static | "Mini Crossword" title, description, and quick links (Daily, Unlimited, etc.) |
| **Archive Selector** | 4 | Flow | Click-driven | Date-based pills for browsing past puzzles |
| **How to Play** | 5 | Flow | Static | Detailed guide with "Five rules", "Pro tips", and "How cross words work" |
| **Pick Your Size** | 6 | Flow | Static | Grid of size options (Classic, Intermediate, Advanced) |
| **About Section** | 7 | Flow | Static | "A Free Mini Crossword to Play Online" text and feature highlights |
| **FAQ Section** | 8 | Flow | Click-driven | "Frequently Asked Questions" with expanding accordions |
| **Footer** | 9 | Flow | Click-driven | Site links, Copyright, and secondary nav |

## Dependencies & Overlays
- **Onboarding Modal** blocks interaction with all other sections until dismissed.
- **Global Header** remains accessible throughout the page.
- **Puzzle Interface** is the primary focus and functional core of the page.
