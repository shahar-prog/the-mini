import { useState, useCallback, useEffect, useRef } from 'react';
import { CrosswordPuzzle, Clue } from '@/types/playminicrossword';

export function useCrosswordGame(
  puzzle: CrosswordPuzzle,
  onSolve?: (timeInSeconds: number) => void,
  navigationSetters?: {
    setSelectedCell: (cell: [number, number]) => void;
    setDirection: (dir: 'across' | 'down') => void;
  },
) {
  const puzzleId = puzzle.mode === 'daily' ? `daily-${puzzle.date}` : `random-${puzzle.seed}`;

  const [gridValues, setGridValues] = useState<string[][]>(() => {
    if (typeof window === 'undefined') {
      return puzzle.initialGrid
        ? puzzle.initialGrid.map((row) => [...row])
        : Array.from({ length: puzzle.height }, () =>
            Array(puzzle.width).fill(''),
          );
    }
    // Load solved state from localStorage
    const saved = localStorage.getItem(`crossword-solved-${puzzleId}`);
    if (saved) {
      return puzzle.grid.map(row => [...row]);
    }
    return puzzle.initialGrid
      ? puzzle.initialGrid.map((row) => [...row])
      : Array.from({ length: puzzle.height }, () =>
          Array(puzzle.width).fill(''),
        );
  });

  const gridValuesRef = useRef(gridValues);
  useEffect(() => {
    gridValuesRef.current = gridValues;
  }, [gridValues]);

  const [history, setHistory] = useState<{ gridValues: string[][]; selectedCell: [number, number] | null; direction: 'across' | 'down' }[]>([]);
  const [redoStack, setRedoStack] = useState<{ gridValues: string[][]; selectedCell: [number, number] | null; direction: 'across' | 'down' }[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem(`crossword-time-${puzzleId}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isRunning, setIsRunning] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(`crossword-solved-${puzzleId}`);
    return !saved;
  });
  const [isSolved, setIsSolved] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem(`crossword-solved-${puzzleId}`);
    return !!saved;
  });
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());
  const [correctCells, setCorrectCells] = useState<Set<string>>(new Set());
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [hasShownIncorrectPopup, setHasShownIncorrectPopup] = useState(false);
  const [revealsUsed, setRevealsUsed] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem(`crossword-reveals-${puzzleId}`);
    return saved ? parseInt(saved, 10) : 0;
  });


  // Timer Effect
  useEffect(() => {
    if (!isRunning || isSolved) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isSolved]);

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

    // Save to localStorage
    localStorage.setItem(`crossword-solved-${puzzleId}`, 'true');
    localStorage.setItem(`crossword-time-${puzzleId}`, elapsedSeconds.toString());
    localStorage.setItem(`crossword-reveals-${puzzleId}`, revealsUsed.toString());

    onSolve?.(elapsedSeconds);
  }, [elapsedSeconds, onSolve, puzzleId, revealsUsed]);

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

  const updateGridValues = useCallback((newGrid: string[][], currentNav?: { selectedCell: [number, number] | null; direction: 'across' | 'down' }) => {
    const currentGrid = gridValuesRef.current;
    const hasChanged = JSON.stringify(newGrid) !== JSON.stringify(currentGrid);

    if (hasChanged) {
      setHistory(prev => {
        if (prev.length > 0 && JSON.stringify(prev[prev.length - 1].gridValues) === JSON.stringify(currentGrid)) {
          return prev;
        }

        const historyEntry = {
          gridValues: currentGrid.map(row => [...row]),
          selectedCell: currentNav?.selectedCell ?? null,
          direction: currentNav?.direction ?? 'across',
        };

        const newHistory = [...prev, historyEntry];
        if (newHistory.length > 50) newHistory.shift();
        return newHistory;
      });
      setRedoStack([]);
      setGridValues(newGrid);

      // Clear painting for cells that were removed or changed
      setIncorrectCells(prev => {
        const next = new Set(prev);
        for (let r = 0; r < puzzle.height; r++) {
          for (let c = 0; c < puzzle.width; c++) {
            if (newGrid[r][c] === '' || newGrid[r][c] !== currentGrid[r][c]) {
              next.delete(`${r},${c}`);
            }
          }
        }
        return next;
      });
      setCorrectCells(prev => {
        const next = new Set(prev);
        for (let r = 0; r < puzzle.height; r++) {
          for (let c = 0; c < puzzle.width; c++) {
            if (newGrid[r][c] === '' || newGrid[r][c] !== currentGrid[r][c]) {
              next.delete(`${r},${c}`);
            }
          }
        }
        return next;
      });

      // Check if the board is fully filled
      let isFullyFilled = true;
      for (let r = 0; r < puzzle.height; r++) {
        for (let c = 0; c < puzzle.width; c++) {
          if (puzzle.grid[r][c] !== ' ' && newGrid[r][c] === '') {
            isFullyFilled = false;
            break;
          }
        }
        if (!isFullyFilled) break;
      }

      if (isFullyFilled) {
        const errors = new Set<string>();
        const corrects = new Set<string>();
        for (let r = 0; r < puzzle.height; r++) {
          for (let c = 0; c < puzzle.width; c++) {
            if (puzzle.grid[r][c] !== ' ') {
              const val = newGrid[r][c].toUpperCase();
              const target = puzzle.grid[r][c].toUpperCase();
              if (val && val !== target) {
                errors.add(`${r},${c}`);
              } else if (val && val === target) {
                corrects.add(`${r},${c}`);
              }
            }
          }
        }

        // We use the functional update form to ensure we have the latest state
        // and to avoid potential race conditions with the .delete calls above.
        setIncorrectCells(() => errors);
        setCorrectCells(() => corrects);

        if (checkIsComplete(newGrid)) {
          handleSolve();
        } else if (!hasShownIncorrectPopup) {
          setShowIncorrectPopup(true);
          setHasShownIncorrectPopup(true);
        }
      }
    }
  }, [puzzle, checkIsComplete, handleSolve, hasShownIncorrectPopup]);

  const handleUndo = useCallback((currentNav?: { selectedCell: [number, number] | null; direction: 'across' | 'down' }) => {
    setHistory(prev => {
      if (prev.length === 0) {
        return prev;
      }
      const newHistory = [...prev];
      const previousState = newHistory.pop();
      if (previousState) {
        const currentGrid = gridValuesRef.current;

        setRedoStack(redo => {
          const currentGridCopy = currentGrid.map(row => [...row]);
          if (redo.length > 0 && JSON.stringify(redo[redo.length - 1].gridValues) === JSON.stringify(currentGridCopy)) {
            return redo;
          }
          const newRedo = [...redo, {
            gridValues: currentGridCopy,
            selectedCell: currentNav?.selectedCell ?? null,
            direction: currentNav?.direction ?? 'across'
          }];
          if (newRedo.length > 50) newRedo.shift();
          return newRedo;
        });

        setGridValues(previousState.gridValues);

        // Clear painting for cells that changed during undo
        setIncorrectCells(prev => {
          const next = new Set(prev);
          for (let r = 0; r < puzzle.height; r++) {
            for (let c = 0; c < puzzle.width; c++) {
              if (previousState.gridValues[r][c] !== currentGrid[r][c]) {
                next.delete(`${r},${c}`);
              }
            }
          }
          return next;
        });
        setCorrectCells(prev => {
          const next = new Set(prev);
          for (let r = 0; r < puzzle.height; r++) {
            for (let c = 0; c < puzzle.width; c++) {
              if (previousState.gridValues[r][c] !== currentGrid[r][c]) {
                next.delete(`${r},${c}`);
              }
            }
          }
          return next;
        });

        if (navigationSetters) {
          if (previousState.selectedCell) {
            navigationSetters.setSelectedCell(previousState.selectedCell);
          }
          navigationSetters.setDirection(previousState.direction);
        }
      }
      return newHistory;
    });
  }, [navigationSetters, puzzle]);

  const handleRedo = useCallback((currentNav?: { selectedCell: [number, number] | null; direction: 'across' | 'down' }) => {
    setRedoStack(prev => {
      if (prev.length === 0) {
        return prev;
      }
      const newRedo = [...prev];
      const nextState = newRedo.pop();
      if (nextState) {
        const currentGrid = gridValuesRef.current;
        setHistory(hist => {
          const currentGridCopy = currentGrid.map(row => [...row]);
          if (hist.length > 0 && JSON.stringify(hist[hist.length - 1].gridValues) === JSON.stringify(currentGridCopy)) {
            return hist;
          }
          const newHist = [...hist, {
            gridValues: currentGridCopy,
            selectedCell: currentNav?.selectedCell ?? null,
            direction: currentNav?.direction ?? 'across'
          }];
          if (newHist.length > 50) newHist.shift();
          return newHist;
        });
        setGridValues(nextState.gridValues);

        // Clear painting for cells that changed during redo
        setIncorrectCells(prev => {
          const next = new Set(prev);
          for (let r = 0; r < puzzle.height; r++) {
            for (let c = 0; c < puzzle.width; c++) {
              if (nextState.gridValues[r][c] !== currentGrid[r][c]) {
                next.delete(`${r},${c}`);
              }
            }
          }
          return next;
        });
        setCorrectCells(prev => {
          const next = new Set(prev);
          for (let r = 0; r < puzzle.height; r++) {
            for (let c = 0; c < puzzle.width; c++) {
              if (nextState.gridValues[r][c] !== currentGrid[r][c]) {
                next.delete(`${r},${c}`);
              }
            }
          }
          return next;
        });

        if (navigationSetters) {
          if (nextState.selectedCell) {
            navigationSetters.setSelectedCell(nextState.selectedCell);
          }
          navigationSetters.setDirection(nextState.direction);
        }
      }
      return newRedo;
    });
  }, [navigationSetters, puzzle]);

  const handleRevealWord = useCallback((activeClue: Clue) => {
    if (!activeClue) return;
    setRevealsUsed((prev) => prev + 1);
    const newGrid = gridValues.map((row) => [...row]);
    const isAcross = activeClue.direction === 'across';
    for (let i = 0; i < activeClue.length; i++) {
      const r = isAcross ? activeClue.row : activeClue.row + i;
      const c = isAcross ? activeClue.col + i : activeClue.col;
      newGrid[r][c] = puzzle.grid[r][c];
    }
    updateGridValues(newGrid);
    if (checkIsComplete(newGrid)) handleSolve();
  }, [gridValues, puzzle, checkIsComplete, handleSolve, updateGridValues]);

  const handleResetPuzzle = useCallback(() => {
    if (puzzle.initialGrid) {
      setGridValues(puzzle.initialGrid.map((row) => [...row]));
    }
    setIncorrectCells(new Set());
    setCorrectCells(new Set());
    setElapsedSeconds(0);
    setIsRunning(true);
    setIsSolved(false);
    setHistory([]);
    setRedoStack([]);
    setHasShownIncorrectPopup(false);
    setRevealsUsed(0);

    // Clear saved status
    localStorage.removeItem(`crossword-solved-${puzzleId}`);
    localStorage.removeItem(`crossword-time-${puzzleId}`);
    localStorage.removeItem(`crossword-reveals-${puzzleId}`);
  }, [puzzle, puzzleId]);

  const handleClearIncorrect = useCallback(() => {
    // 1. Re-evaluate the board to get the most current set of incorrect cells
    const currentGrid = gridValuesRef.current;
    const currentErrors = new Set<string>();

    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.grid[r][c] !== ' ') {
          const val = currentGrid[r][c];
          if (val && val !== puzzle.grid[r][c]) {
            currentErrors.add(`${r},${c}`);
          }
        }
      }
    }

    // 2. Clear only the cells that are currently incorrect
    const newGrid = currentGrid.map((row, r) =>
      row.map((cell, c) => {
        if (currentErrors.has(`${r},${c}`)) {
          return '';
        }
        return cell;
      })
    );

    setGridValues(newGrid);
    setIncorrectCells(new Set());
  }, [puzzle]);

  return {
    gridValues,
    setGridValues,
    updateGridValues,
    handleUndo,
    handleRedo,
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
    handleClearIncorrect,
    handleRevealWord,
    handleResetPuzzle,
    showIncorrectPopup,
    setShowIncorrectPopup,
    revealsUsed,
  };
}
