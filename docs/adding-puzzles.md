# Adding New Puzzle Definitions

This guide explains how to add new crossword puzzles to the application.

## 🧩 How Puzzles Work
The application currently uses a **deterministic generation system**. Puzzles are created on-the-fly based on a "seed" (like a date string `2026-10-01` or a random ID). This means the same seed always produces the same puzzle.

---

## 🛠️ Adding a Manual Puzzle

If you want to add a hand-crafted puzzle instead of a generated one, you have two primary options:

### Option 1: Hardcoding a Special Seed (Fastest)
You can modify the generator logic to return a specific puzzle when a certain seed is requested.

**Where to look:** `src/lib/crossword/generator.ts` (or `src/lib/puzzle-gen.ts`)

**What to do:**
Inside the generation function, add a check for your specific seed:
\`\`\`typescript
if (seed === 'my-special-puzzle') {
  return {
    id: 'special-1',
    grid: [
      ['C', 'A', 'T', 'S', ' '], // 5x5 grid, use ' ' for black squares
      ['A', ' ', ' ', ' ', ' '],
      ['R', ' ', ' ', ' ', ' '],
      ['T', ' ', ' ', ' ', ' '],
      ['S', ' ', ' ', ' ', ' '],
    ],
    clues: {
      across: [ { number: 1, row: 0, col: 0, length: 4, text: "Feline pets", direction: 'across' } ],
      down: [ { number: 1, row: 0, col: 0, length: 5, text: "Map out", direction: 'down' } ],
    },
    // ... other required properties
  };
}
\`\`\`

### Option 2: Data-Driven Approach (Scalable)
For adding many manual puzzles, create a structured data file.

1. **Create a data file** (e.g., `src/data/manual-puzzles.json`).
2. **Define your puzzles in JSON format**:
\`\`\`json
[
  {
    "seed": "holiday-2026",
    "grid": [
      ["S", "N", "O", "W", " "],
      ["T", " ", " ", " ", " "],
      ["A", " ", " ", " ", " "],
      ["R", " ", " ", " ", " "],
      ["S", " ", " ", " ", " "]
    ],
    "clues": {
      "across": [ { "number": 1, "row": 0, "col": 0, "length": 4, "text": "Frozen rain", "direction": "across" } ],
      "down": [ { "number": 1, "row": 0, "col": 0, "length": 5, "text": "Celestial bodies", "direction": "down" } ]
    }
  }
]
\`\`\`
3. **Update the generator** to search this JSON list before generating a random puzzle.

---

## 📐 Puzzle Specification
When defining a puzzle, ensure you follow these rules:
- **Grid**: Must be a 5x5 array.
- **Black Squares**: Use a single space `' '` to denote a black block.
- **Letters**: Use uppercase A-Z.
- **Clues**: Each clue must have:
  - `number`: The number shown in the grid.
  - `row`/`col`: The starting coordinates (0-indexed).
  - `length`: How many cells the word spans.
  - `text`: The clue description.
  - `direction`: Either `'across'` or `'down'`.

## 🔗 Accessing Your Puzzle
Once added, you can access any puzzle via the URL:
`http://localhost:3000/puzzle/[your-seed]`
