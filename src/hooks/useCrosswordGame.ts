import { useState, useCallback, useEffect, useRef } from 'react';
import { CrosswordPuzzle, Clue } from '@/types/playminicrossword';

export function useCrosswordGame(puzzle: CrosswordPuzzle, onSolve?: (timeInSeconds: number) => void) {
  const [gridValues, setGridValues] = useState<string[][]>(() =>
    puzzle.initialGrid
      ? puzzle.initialGrid.map((row) => [...row])
      : Array.from({ length: puzzle.height }, () =>
          Array(puzzle.width).fill(''),
        ),
  );

  const gridValuesRef = useRef(gridValues);
  useEffect(() => {
    gridValuesRef.current = gridValues;
  }, [gridValues]);

  const [history, setHistory] = useState<string[][][]>([]);
  const [redoStack, setRedoStack] = useState<string[][][]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());
  const [correctCells, setCorrectCells] = useState<Set<string>>(new Set());
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [hasShownIncorrectPopup, setHasShownIncorrectPopup] = useState(false);


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

  const updateGridValues = useCallback((newGrid: string[][]) => {
    const currentGrid = gridValuesRef.current;
    const hasChanged = JSON.stringify(newGrid) !== JSON.stringify(currentGrid);

    if (hasChanged) {
      setHistory(prev => {
        if (prev.length > 0 && JSON.stringify(prev[prev.length - 1]) === JSON.stringify(currentGrid)) {
          return prev;
        }
        const newHistory = [...prev, currentGrid.map(row => [...row])];
        if (newHistory.length > 50) newHistory.shift();
        return newHistory;
      });
      setRedoStack([]);
      setGridValues(newGrid);

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
        if (checkIsComplete(newGrid)) {
          handleSolve();
        } else {
          // Trigger the "check" logic to show incorrect cells
          const errors = new Set<string>();
          const corrects = new Set<string>();
          for (let r = 0; r < puzzle.height; r++) {
            for (let c = 0; c < puzzle.width; c++) {
              if (puzzle.grid[r][c] !== ' ') {
                const val = newGrid[r][c];
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

          // Show popup only the first time it's fully filled but incorrect
          if (!hasShownIncorrectPopup) {
            setShowIncorrectPopup(true);
            setHasShownIncorrectPopup(true);
          }
        }
      }
    }
  }, [puzzle, checkIsComplete, handleSolve, hasShownIncorrectPopup]);

  const handleUndo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) {
        return prev;
      }
      const newHistory = [...prev];
      const previousState = newHistory.pop();
      if (previousState) {
        const currentGrid = gridValuesRef.current;
        setRedoStack(redo => {
          // Check if the state we are about to insert is the same as the current top of the stack
          if (redo.length > 0 && JSON.stringify(redo[redo.length - 1]) === JSON.stringify(currentGrid)) {
            return redo;
          }
          const newRedo = [...redo, currentGrid.map(row => [...row])];
          if (newRedo.length > 50) newRedo.shift();
          return newRedo;
        });
        setGridValues(previousState);
      }
      return newHistory;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setRedoStack(prev => {
      if (prev.length === 0) {
        return prev;
      }
      const newRedo = [...prev];
      const nextState = newRedo.pop();
      if (nextState) {
        // Use current state for History stack
        const currentGrid = gridValuesRef.current;
        setHistory(hist => {
          // Check if the state we are about to insert is the same as the current top of the stack
          if (hist.length > 0 && JSON.stringify(hist[hist.length - 1]) === JSON.stringify(currentGrid)) {
            return hist;
          }
          const newHist = [...hist, currentGrid.map(row => [...row])];
          if (newHist.length > 50) newHist.shift();
          return newHist;
        });
        setGridValues(nextState);
      }
      return newRedo;
    });
  }, []);

  const handleRevealWord = useCallback((activeClue: Clue) => {
    if (!activeClue) return;
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
  }, [puzzle]);

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
  };
}
