import { useState, useCallback } from 'react';
import { CrosswordPuzzle } from '@/types/playminicrossword';

export function useCrosswordGame(puzzle: CrosswordPuzzle, onSolve?: (timeInSeconds: number) => void) {
  const [gridValues, setGridValues] = useState<string[][]>(() =>
    puzzle.initialGrid
      ? puzzle.initialGrid.map((row) => [...row])
      : Array.from({ length: puzzle.height }, () =>
          Array(puzzle.width).fill(''),
        ),
  );

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());
  const [correctCells, setCorrectCells] = useState<Set<string>>(new Set());

  const checkIsComplete = useCallback(
    (currentGrid: string[][]) => {
      for (let r = 0; r < puzzle.height; r++) {
        for (let c = 0; c < puzzle.width; c++) {
          if (puzzle.grid[r][c] !== ' ') {
            if (
              currentGrid[r][c].toUpperCase() !==
              puzzle.grid[r][c].toUpperCase()
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [puzzle],
  );

  const handleSolve = useCallback(() => {
    setIsSolved(true);
    setIsRunning(false);
    onSolve?.(elapsedSeconds);
  }, [elapsedSeconds, onSolve]);

  const handleCheckPuzzle = useCallback(() => {
    const errors = new Set<string>();
    const corrects = new Set<string>();
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.grid[r][c] !== ' ') {
          const val = gridValues[r][c];
          if (val && val !== puzzle.grid[r][c]) {
            errors.add(`${r},${c}`);
          } else if (val && val === puzzle.grid[r][c]) {
            corrects.add(`${r},${c}`);
          }
        }
      }
    }
    setIncorrectCells(errors);
    setCorrectCells(corrects);
  }, [gridValues, puzzle]);

  const handleRevealWord = useCallback((activeClue: any) => {
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
  }, [gridValues, puzzle, checkIsComplete, handleSolve]);

  const handleResetPuzzle = useCallback(() => {
    if (puzzle.initialGrid) {
      setGridValues(puzzle.initialGrid.map((row) => [...row]));
    }
    setIncorrectCells(new Set());
    setCorrectCells(new Set());
    setElapsedSeconds(0);
    setIsRunning(true);
    setIsSolved(false);
  }, [puzzle]);

  return {
    gridValues,
    setGridValues,
    elapsedSeconds,
    setElapsedSeconds,
    isRunning,
    setIsRunning,
    isSolved,
    setIsSolved,
    incorrectCells,
    setIncorrectCells,
    correctCells,
    setCorrectCells,
    checkIsComplete,
    handleSolve,
    handleCheckPuzzle,
    handleRevealWord,
    handleResetPuzzle,
  };
}
