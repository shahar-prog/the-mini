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

  const handleClueClick = useCallback((clue: Clue, gridValues?: string[][], incorrectCells?: Set<string>) => {
    setDirection(clue.direction);

    if (gridValues) {
      const isAcross = clue.direction === 'across';

      // 1. First priority: if the board is full and we have incorrect cells,
      // jump specifically to the first incorrect letter in this word.
      if (incorrectCells) {
        for (let i = 0; i < clue.length; i++) {
          const r = isAcross ? clue.row : clue.row + i;
          const c = isAcross ? clue.col + i : clue.col;
          if (incorrectCells.has(`${r},${c}`)) {
            setSelectedCell([r, c]);
            return;
          }
        }
      }

      // 2. Second priority: jump to the first unwritten letter.
      for (let i = 0; i < clue.length; i++) {
        const r = isAcross ? clue.row : clue.row + i;
        const c = isAcross ? clue.col + i : clue.col;
        if (!gridValues[r][c]) {
          setSelectedCell([r, c]);
          return;
        }
      }
    }

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
    (delta: 1 | -1, gridValues?: string[][], incorrectCells?: Set<string>) => {
      const allClues = [...puzzle.clues.across, ...puzzle.clues.down];
      if (allClues.length === 0) return;

      let curIdx = allClues.findIndex(
        (c) =>
          c.direction === activeClue?.direction &&
          c.number === activeClue?.number,
      );

      // Determine if the entire board is filled
      const isBoardFull = gridValues
        ? puzzle.grid.every((row, r) =>
            row.every((cell, c) => cell === ' ' || gridValues[r][c] !== '')
          )
        : false;

      // Loop until we find a clue that needs attention
      let attempts = 0;
      while (attempts < allClues.length) {
        curIdx = (curIdx + delta + allClues.length) % allClues.length;
        const target = allClues[curIdx];

        const isWordFullyFilled = gridValues
          ? (target.direction === 'across'
              ? Array.from({ length: target.length }, (_, i) => gridValues[target.row][target.col + i]).every(v => v !== '')
              : Array.from({ length: target.length }, (_, i) => gridValues[target.row + i][target.col]).every(v => v !== '')
            )
          : false;

        const hasIncorrect = incorrectCells
          ? (target.direction === 'across'
              ? Array.from({ length: target.length }, (_, i) => `${target.row},${target.col + i}`).some(cell => incorrectCells.has(cell))
              : Array.from({ length: target.length }, (_, i) => `${target.row + i},${target.col}`).some(cell => incorrectCells.has(cell))
            )
          : false;

        let shouldSkip = false;
        if (isBoardFull) {
          // If entire board is full, skip words that are correct
          shouldSkip = !hasIncorrect;
        } else {
          // If board is not full, skip words that are already filled
          shouldSkip = isWordFullyFilled;
        }

        if (!shouldSkip) {
          handleClueClick(target, gridValues, incorrectCells);
          return;
        }
        attempts++;
      }

      // If we've looped through everything and everything is "skipped"
      // (e.g. board is full and all remaining are correct, or board is not full and all are filled)
      // just go to the next one to avoid getting stuck.
      const finalIdx = (curIdx + delta + allClues.length) % allClues.length;
      handleClueClick(allClues[finalIdx], gridValues, incorrectCells);
    },
    [puzzle.clues, activeClue, handleClueClick, puzzle],
  );

  const jumpToWordEdge = useCallback(
    (toEnd: boolean) => {
      if (!selectedCell || !activeClue) return;
      const [r, c] = selectedCell;
      const isAcross = activeClue.direction === 'across';

      if (isAcross) {
        const targetCol = toEnd ? activeClue.col + activeClue.length - 1 : activeClue.col;
        setSelectedCell([r, targetCol]);
      } else {
        const targetRow = toEnd ? activeClue.row + activeClue.length - 1 : activeClue.row;
        setSelectedCell([targetRow, c]);
      }
    },
    [selectedCell, activeClue, setSelectedCell],
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
    jumpToWordEdge,
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
