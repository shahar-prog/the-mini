import { useCallback } from 'react';
import { CrosswordPuzzle } from '@/types/playminicrossword';

export function usePuzzleInput(
  puzzle: CrosswordPuzzle,
  nav: {
    selectedCell: [number, number] | null;
    setSelectedCell: (cell: [number, number]) => void;
    direction: 'across' | 'down';
    setDirection: (dir: 'across' | 'down') => void;
    hasWordAt: (r: number, c: number, dir: 'across' | 'down') => boolean;
    toggleDirectionIfPossible: () => void;
    moveCursor: (r: number, c: number, dir: 'across' | 'down', forward: boolean) => void;
  },
  game: {
    gridValues: string[][];
    setGridValues: (grid: string[][]) => void;
    isSolved: boolean;
    isRunning: boolean;
    setIncorrectCells: (cells: Set<string>) => void;
    checkIsComplete: (grid: string[][]) => boolean;
    handleSolve: () => void;
  },
  handleNextClue: (delta: 1 | -1) => void
) {
  const {
    selectedCell, setSelectedCell, direction, setDirection,
    hasWordAt, toggleDirectionIfPossible, moveCursor
  } = nav;

  const {
    gridValues, setGridValues, isSolved, isRunning,
    setIncorrectCells, checkIsComplete, handleSolve
  } = game;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      isSolved ||
      !isRunning ||
      ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
    ) {
      return;
    }
    if (!selectedCell) return;
    const [r, c] = selectedCell;

    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      toggleDirectionIfPossible();
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleNextClue(e.shiftKey ? -1 : 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (direction === "across") {
        moveCursor(r, c, "across", true);
      } else {
        if (hasWordAt(r, c, "across")) {
          setDirection("across");
        } else {
          let nextC = c + 1;
          while (nextC >= 0 && nextC < puzzle.width) {
            if (puzzle.grid[r][nextC] !== " ") {
              setSelectedCell([r, nextC]);
              return;
            }
            nextC++;
          }
        }
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (direction === "across") {
        moveCursor(r, c, "across", false);
      } else {
        if (hasWordAt(r, c, "across")) {
          setDirection("across");
        } else {
          let nextC = c - 1;
          while (nextC >= 0 && nextC < puzzle.width) {
            if (puzzle.grid[r][nextC] !== " ") {
              setSelectedCell([r, nextC]);
              return;
            }
            nextC--;
          }
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (direction === "down") {
        moveCursor(r, c, "down", true);
      } else {
        if (hasWordAt(r, c, "down")) {
          setDirection("down");
        } else {
          let nextR = r + 1;
          while (nextR >= 0 && nextR < puzzle.height) {
            if (puzzle.grid[nextR][c] !== " ") {
              setSelectedCell([nextR, c]);
              return;
            }
            nextR++;
          }
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (direction === "down") {
        moveCursor(r, c, "down", false);
      } else {
        if (hasWordAt(r, c, "down")) {
          setDirection("down");
        } else {
          let nextR = r - 1;
          while (nextR >= 0 && nextR < puzzle.height) {
            if (puzzle.grid[nextR][c] !== " ") {
              setSelectedCell([nextR, c]);
              return;
            }
            nextR--;
          }
        }
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      const currentVal = gridValues[r][c];
      const newGrid = gridValues.map((row) => [...row]);
      if (currentVal !== "") {
        newGrid[r][c] = "";
        setGridValues(newGrid);
      } else {
        moveCursor(r, c, direction, false);
      }
      setIncorrectCells((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(`${r},${c}`);
        return next;
      });
    } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();
      const newGrid = gridValues.map((row) => [...row]);
      newGrid[r][c] = letter;
      setGridValues(newGrid);
      setIncorrectCells((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(`${r},${c}`);
        return next;
      });

      const currentHasAcross = hasWordAt(r, c, "across");
      const currentHasDown = hasWordAt(r, c, "down");

      let moveDir = direction;
      if (currentHasAcross && !currentHasDown) moveDir = "across";
      else if (!currentHasAcross && currentHasDown) moveDir = "down";

      // Skip filled cells when typing letters
      let nextR = r;
      let nextC = c;
      let foundNext = false;

      while (!foundNext) {
        if (moveDir === "across") {
          nextC++;
          if (nextC >= puzzle.width || puzzle.grid[nextR][nextC] === " ") break;
          if (newGrid[nextR][nextC] === "") {
            foundNext = true;
          }
        } else {
          nextR++;
          if (nextR >= puzzle.height || puzzle.grid[nextR][nextC] === " ") break;
          if (newGrid[nextR][nextC] === "") {
            foundNext = true;
          }
        }
      }

      if (foundNext) {
        setSelectedCell([nextR, nextC]);
      } else {
        handleNextClue(1);
      }

      if (checkIsComplete(newGrid)) {
        handleSolve();
      }
    }
  }, [
    selectedCell, direction, gridValues, isSolved, isRunning,
    puzzle, hasWordAt, toggleDirectionIfPossible, setSelectedCell,
    setDirection, moveCursor, setGridValues, setIncorrectCells,
    checkIsComplete, handleNextClue, handleSolve
  ]);

  const handleVirtualKey = useCallback((key: string) => {
    if (!selectedCell || isSolved || !isRunning) return;
    const [r, c] = selectedCell;
    if (key === "BACKSPACE") {
      const currentVal = gridValues[r][c];
      const newGrid = gridValues.map((row) => [...row]);
      if (currentVal !== "") {
        newGrid[r][c] = "";
        setGridValues(newGrid);
      } else {
        moveCursor(r, c, direction, false);
      }
      setIncorrectCells((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(`${r},${c}`);
        return next;
      });
    } else if (key === "SWITCH") {
      toggleDirectionIfPossible();
    } else {
      const newGrid = gridValues.map((row) => [...row]);
      newGrid[r][c] = key;
      setGridValues(newGrid);
      setIncorrectCells((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(`${r},${c}`);
        return next;
      });

      const hasAcross = hasWordAt(r, c, "across");
      const hasDown = hasWordAt(r, c, "down");

      let moveDir = direction;
      if (hasAcross && !hasDown) moveDir = "across";
      else if (!hasAcross && hasDown) moveDir = "down";

      // Skip filled cells when typing letters
      let nextR = r;
      let nextC = c;
      let foundNext = false;

      while (!foundNext) {
        if (moveDir === "across") {
          nextC++;
          if (nextC >= puzzle.width || puzzle.grid[nextR][nextC] === " ") break;
          if (newGrid[nextR][nextC] === "") {
            foundNext = true;
          }
        } else {
          nextR++;
          if (nextR >= puzzle.height || puzzle.grid[nextR][nextC] === " ") break;
          if (newGrid[nextR][nextC] === "") {
            foundNext = true;
          }
        }
      }

      if (foundNext) {
        setSelectedCell([nextR, nextC]);
      } else {
        handleNextClue(1);
      }
      if (checkIsComplete(newGrid)) {
        handleSolve();
      }
    }
  }, [
    selectedCell, isSolved, isRunning, gridValues, puzzle,
    hasWordAt, toggleDirectionIfPossible, setGridValues,
    setIncorrectCells, direction, moveCursor, setSelectedCell,
    handleNextClue, checkIsComplete, handleSolve
  ]);

  return { handleKeyDown, handleVirtualKey };
}
