# Adding New Word Definitions

This guide explains how to add individual word-clue pairs to the puzzle generator's dictionary.

## 📚 Where are the definitions stored?
The application uses a dictionary of words and clues to generate puzzles. These are stored in JSON files organized by the length of the word:

- **3-letter words**: `src/data/definitions/words3.json`
- **4-letter words**: `src/data/definitions/words4.json`
- **5-letter words**: `src/data/definitions/words5.json`

## 🛠️ How to add a new definition

1. **Choose the correct file** based on the length of your word.
2. **Open the file** and find the end of the list (before the closing `]`).
3. **Add your new definition** as a JSON object.

### Format
Each definition must follow this exact structure:
\`\`\`json
{ "word": "WORD", "clue": "The clue for the word" }
\`\`\`

### Example
To add the word "GLOW" to `words4.json`:
\`\`\`json
[
  ...
  { "word": "GOLF", "clue": "Sport played with a club and hole" },
  { "word": "GLOW", "clue": "Emit soft, radiant light" }
]
\`\`\`

## ⚠️ Important Rules
- **All Caps**: The `word` must be in all uppercase (e.g., `"GLOW"`, not `"Glow"`).
- **Valid JSON**: Ensure there is a comma after the previous entry.
- **Length**: Double-check that you are adding the word to the file that matches its character count.

## 🚀 What happens next?
Once you save the file, the `DEFINITIONS_BY_LENGTH` map in `src/data/definitions/index.ts` automatically updates. The next time a puzzle is generated, your new word and clue will be part of the pool of possibilities!
