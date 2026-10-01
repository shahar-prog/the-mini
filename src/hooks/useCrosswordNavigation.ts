import { useState, useCallback, useEffect, useMemo } from 'react';
import { CrosswordPuzzle, Clue } from '@/types/playminicrossword';

export function useCrosswordNavigation(puzzle: CrosswordPuzzle) {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(() => {
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.grid[r][c] !== ' ') return [r, c];
      }
    }
    return null;
  });

  const [direction, setDirection] = useState<'across' | 'down'>(() => {
    const firstCell = findFirstPlayableCell(puzzle);
    if (!firstCell) return 'across';
    const [r, c] = firstCell;

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

  const handleClueClick = useCallback((clue: Clue) => {
    setDirection(clue.direction);
    setSelectedCell([clue.row, clue.col]);
  }, [setDirection, setSelectedCell]);

  const activeClue = useMemo<Clue | null>(() => {
    if (!selectedCell) return null;
    const [r, c] = selectedCell;

    const list = direction === 'across' ? puzzle.clues.across : puzzle.clues.down;
    for (const clue of list) {
      if (direction === 'across') {
        if (clue.row === r && c >= clue.col && c < clue.col + clue.length) {
          return clue;
        }
      } else {
        if (clue.col === c && r >= clue.row && r < clue.row + clue.length) {
          return clue;
        }
      }
    }
    return null;
  }, [selectedCell, direction, puzzle.clues]);

  const activeWordCells = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    if (!activeClue) return set;
    const isAcross = activeClue.direction === 'across';
    for (let i = 0; i < activeClue.length; i++) {
      const r = isAcross ? activeClue.row : activeClue.row + i;
      const c = isAcross ? activeClue.col + i : activeClue.col;
      set.add(`${r},${c}`);
    }
    return set;
  }, [activeClue]);

  const handleNextClue = useCallback(
    (delta: 1 | -1) => {
      const allClues = [...puzzle.clues.across, ...puzzle.clues.down];
      if (allClues.length === 0) return;
      const curIdx = allClues.findIndex(
        (c) =>
          c.direction === activeClue?.direction &&
          c.number === activeClue?.number,
      );
      const nextIdx = (curIdx + delta + allClues.length) % allClues.length;
      const target = allClues[nextIdx];
      handleClueClick(target);
    },
    [puzzle.clues, activeClue, handleClueClick],
  );

  const handleCellClick = useCallback((r: number, c: number) => {
    if (puzzle.grid[r][c] === ' ') return;

    if (selectedCell && selectedCell[0] === r && selectedCell[1] === c) {
      toggleDirectionIfPossible();
    } else {
      setSelectedCell([r, c]);
      const hasAcross = hasWordAt(r, c, 'across');
      const hasDown = hasWordAt(r, c, 'down');

      if (hasAcross && !hasDown) {
        setDirection('across');
      } else if (!hasAcross && hasDown) {
        setDirection('down');
      }
    }
  }, [puzzle.grid, selectedCell, toggleDirectionIfPossible, setSelectedCell, hasWordAt, setDirection]);

  return {
    selectedCell,
    setSelectedCell,
    direction,
    setDirection,
    hasWordAt,
    toggleDirectionIfPossible,
    moveCursor,
    activeClue,
    activeWordCells,
    handleClueClick,
    handleNextClue,
    handleCellClick,
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
