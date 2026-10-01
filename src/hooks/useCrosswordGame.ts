import { useState, useCallback, useMemo } from 'react';
import { CrosswordPuzzle } from '@/types/playminicrossword';

export function useCrosswordGame(puzzle: CrosswordPuzzle) {
  // 1. Grid Values State (user input)
  const [gridValues, setGridValues] = useState<string[][]>(() =>
    puzzle.initialGrid
      ? puzzle.initialGrid.map((row) => [...row])
      : Array.from({ length: puzzle.height }, () => Array(puzzle.width).fill(''))
  );

  // 2. Active Cell & Direction
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(() => {
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.grid[r][c] !== ' ') return [r, c];
      }
    }
    return null;
  });
  const [direction, setDirection] = useState<'across' | 'down'>('across');

  // 3. Completion State
  const [isSolved, setIsSolved] = useState(false);
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());

  const checkIsComplete = useCallback((currentGrid: string[][]) => {
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.grid[r][c] !== ' ') {
          if (currentGrid[r][c].toUpperCase() !== puzzle.grid[r][c].toUpperCase()) {
            return false;
          }
        }
      }
    }
    return true;
  }, [puzzle]);

  const handleSolve = useCallback(() => {
    setIsSolved(true);
  }, []);

  const handleCellClick = (r: number, c: number) => {
    if (puzzle.grid[r][c] === ' ') return;
    if (selectedCell && selectedCell[0] === r && selectedCell[1] === c) {
      setDirection((prev) => (prev === 'across' ? 'down' : 'across'));
    } else {
      setSelectedCell([r, c]);
    }
  };

  const handleCheckPuzzle = () => {
    const errors = new Set<string>();
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.grid[r][c] !== ' ') {
          const val = gridValues[r][c];
          if (val && val !== puzzle.grid[r][c]) {
            errors.add(`${r},${c}`);
          }
        }
      }
    }
    setIncorrectCells(errors);
  };

  const handleRevealWord = (activeClue: any) => {
    if (!activeClue) return;
    const newGrid = gridValues.map((row) => [...row]);
    const isAcross = activeClue.direction === 'across';
    for (let i = 0; i < activeClue.length; i++) {
      const r = isAcross ? activeClue.row : activeClue.row + i;
      const c = isAcross ? activeClue.col + i : activeClue.col;
      newGrid[r][c] = puzzle.grid[r][c];
    }
    setGridValues(newGrid);
    if (checkIsComplete(newGrid)) handleSolve();
  };

  const handleResetPuzzle = () => {
    if (puzzle.initialGrid) {
      setGridValues(puzzle.initialGrid.map((row) => [...row]));
    }
    setIncorrectCells(new Set());
    setIsSolved(false);
  };

  return {
    gridValues,
    setGridValues,
    selectedCell,
    setSelectedCell,
    direction,
    setDirection,
    isSolved,
    incorrectCells,
    setIncorrectCells,
    handleCellClick,
    handleCheckPuzzle,
    handleRevealWord,
    handleResetPuzzle,
    checkIsComplete,
    handleSolve,
  };
}
