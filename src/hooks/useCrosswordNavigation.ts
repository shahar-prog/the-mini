import { useState, useCallback, useEffect } from 'react';
import { CrosswordPuzzle } from '@/types/playminicrossword';

export function useCrosswordNavigation(puzzle: CrosswordPuzzle) {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(() => {
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.grid[r][c] !== ' ') return [r, c];
      }
    }
    return null;
  });

  // We use a function for the initial state to ensure it's calculated once
  const [direction, setDirection] = useState<'across' | 'down'>(() => {
    const firstCell = findFirstPlayableCell(puzzle);
    if (!firstCell) return 'across';
    const [r, c] = firstCell;

    // Check for across word first
    const hasAcross = puzzle.clues.across.some(clue =>
      clue.row === r && c >= clue.col && c < clue.col + clue.length
    );
    return hasAcross ? 'across' : 'down';
  });

  const hasWordAt = useCallback((r: number, c: number, dir: 'across' | 'down') => {
    const list = dir === 'across' ? puzzle.clues.across : puzzle.clues.down;
    return list.some(clue =>
      dir === 'across'
        ? (clue.row === r && c >= clue.col && c < clue.col + clue.length)
        : (clue.col === c && r >= clue.row && r < clue.row + clue.length)
    );
  }, [puzzle.clues]);

  const toggleDirectionIfPossible = useCallback(() => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    const nextDir = direction === 'across' ? 'down' : 'across';
    if (hasWordAt(r, c, nextDir)) {
      setDirection(nextDir);
    }
  }, [selectedCell, direction, hasWordAt]);

  const moveCursor = useCallback(
    (r: number, c: number, dir: 'across' | 'down', forward: boolean) => {
      const step = forward ? 1 : -1;
      let nextR = r;
      let nextC = c;

      if (dir === 'across') {
        nextC += step;
        while (nextC >= 0 && nextC < puzzle.width) {
          if (puzzle.grid[nextR][nextC] !== ' ') {
            setSelectedCell([nextR, nextC]);
            return;
          }
          nextC += step;
        }
      } else {
        nextR += step;
        while (nextR >= 0 && nextR < puzzle.height) {
          if (puzzle.grid[nextR][nextC] !== ' ') {
            setSelectedCell([nextR, nextC]);
            return;
          }
          nextR += step;
        }
      }
    },
    [puzzle],
  );

  return {
    selectedCell,
    setSelectedCell,
    direction,
    setDirection,
    hasWordAt,
    toggleDirectionIfPossible,
    moveCursor,
  };
}

function findFirstPlayableCell(puzzle: CrosswordPuzzle): [number, number] | null {
  for (let r = 0; r < puzzle.height; r++) {
    for (let c = 0; c < puzzle.width; c++) {
      if (puzzle.grid[r][c] !== ' ') return [r, c];
    }
  }
  return null;
}
