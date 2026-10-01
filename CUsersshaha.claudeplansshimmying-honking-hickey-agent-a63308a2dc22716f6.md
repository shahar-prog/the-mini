# Implementation Plan: Undo Feature for Crossword Puzzle

Implement a Ctrl+Z (Cmd+Z on Mac) undo feature to revert grid entries in the crossword puzzle.

## 1. State Management (`src/hooks/useCrosswordGame.ts`)
- **History Stack**: Introduce a state to keep track of previous `gridValues`.
    - `const [history, setHistory] = useState<string[][][]>([]);`
- **Capture State**: Create a wrapper or effect to push the current `gridValues` to the history stack before any modification.
    - Since `setGridValues` is currently exposed directly, it's better to implement a `updateGridValues` function that handles both pushing to history and updating the state.
- **Undo Function**: Implement `handleUndo`.
    - If `history` is not empty:
        - Pop the last state from `history`.
        - Set `gridValues` to that state.
        - Update the history stack.
- **Limit**: Limit the history stack to 50 entries to prevent memory leaks.

## 2. Input Handling (`src/hooks/usePuzzleInput.ts`)
- **Detect Ctrl+Z**: In `handleKeyDown`, add a check for `(e.ctrlKey || e.metaKey) && e.key === 'z'`.
- **Trigger Undo**: Call the `handleUndo` function from the `game` object.
- **Prevent Default**: Use `e.preventDefault()` to prevent browser default undo behavior.

## 3. Side Effects & Consistency
- **Incorrect Cells**: Ensure `incorrectCells` and `correctCells` are updated after an undo. 
    - The easiest way is to call `handleCheckPuzzle()` immediately after reverting the grid in `handleUndo`.
- **Solver State**: Undo should not be available if the puzzle is already solved (`isSolved`).

## Step-by-Step Implementation

### Phase 1: `useCrosswordGame.ts`
1. Add `history` state.
2. Implement `updateGridValues(newGrid: string[][])` which:
    - Pushes current `gridValues` to `history` (if changed).
    - Caps `history` at 50.
    - Calls `setGridValues(newGrid)`.
3. Implement `handleUndo()` which:
    - Reverts `gridValues` from `history`.
    - Calls `handleCheckPuzzle()` to refresh cell validation.
4. Export `updateGridValues` and `handleUndo`.

### Phase 2: `usePuzzleInput.ts`
1. Update the `game` parameter type to include `updateGridValues` and `handleUndo`.
2. Replace all calls to `setGridValues(newGrid)` with `updateGridValues(newGrid)`.
3. Add the keyboard event listener for `Ctrl+Z` / `Cmd+Z` to call `handleUndo()`.

### Phase 3: Integration & Testing
1. Verify that typing a letter creates an undo point.
2. Verify that backspacing creates an undo point.
3. Verify that `Ctrl+Z` reverts the last action.
4. Verify that `incorrectCells` are correctly updated after undo.
