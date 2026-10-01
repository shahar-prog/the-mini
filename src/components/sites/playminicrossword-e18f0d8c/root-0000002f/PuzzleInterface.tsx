"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CrosswordPuzzle, Clue } from "@/types/playminicrossword";
import ShareModal from "@/components/crossword/ShareModal";
import Confetti from "@/components/crossword/Confetti";
import CrosswordToolbar from "@/components/crossword/CrosswordToolbar";
import ActiveClueBanner from "@/components/crossword/ActiveClueBanner";
import ClueList from "@/components/crossword/ClueList";
import VirtualKeyboard from "@/components/crossword/VirtualKeyboard";
import { useCrosswordNavigation } from "@/hooks/useCrosswordNavigation";
import { useCrosswordGame } from "@/hooks/useCrosswordGame";

interface PuzzleInterfaceProps {
  puzzle: CrosswordPuzzle;
  onSolve?: (timeInSeconds: number) => void;
  onNewRandomPuzzle?: () => void;
}

export default function PuzzleInterface({
  puzzle,
  onSolve,
  onNewRandomPuzzle,
}: PuzzleInterfaceProps) {
  const {
    selectedCell,
    setSelectedCell,
    direction,
    setDirection,
    hasWordAt,
    toggleDirectionIfPossible,
    moveCursor,
  } = useCrosswordNavigation(puzzle);

  const {
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
  } = useCrosswordGame(puzzle, onSolve);

  const [showShareModal, setShowShareModal] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (!isRunning || isSolved) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isSolved, setElapsedSeconds]);

  // Find active clue based on selected cell & direction
  const activeClue = useMemo<Clue | null>(() => {
    if (!selectedCell) return null;
    const [r, c] = selectedCell;

    const list = direction === "across" ? puzzle.clues.across : puzzle.clues.down;
    for (const clue of list) {
      if (direction === "across") {
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

  // Set of cells that belong to the active word
  const activeWordCells = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    if (!activeClue) return set;
    const isAcross = activeClue.direction === "across";
    for (let i = 0; i < activeClue.length; i++) {
      const r = isAcross ? activeClue.row : activeClue.row + i;
      const c = isAcross ? activeClue.col + i : activeClue.col;
      set.add(`${r},${c}`);
    }
    return set;
  }, [activeClue]);

  const handleCellClick = (r: number, c: number) => {
    if (puzzle.grid[r][c] === " ") return;

    if (selectedCell && selectedCell[0] === r && selectedCell[1] === c) {
      toggleDirectionIfPossible();
    } else {
      setSelectedCell([r, c]);
      // Rule 4: Only auto-set direction if the cell belongs to EXACTLY one direction.
      // If it belongs to both, we keep the current direction to avoid flickering.
      const hasAcross = hasWordAt(r, c, "across");
      const hasDown = hasWordAt(r, c, "down");

      if (hasAcross && !hasDown) {
        setDirection("across");
      } else if (!hasAcross && hasDown) {
        setDirection("down");
      }
    }
  };

  const handleClueClick = useCallback((clue: Clue) => {
    setDirection(clue.direction);
    setSelectedCell([clue.row, clue.col]);
  }, [setDirection, setSelectedCell]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        setIncorrectCells((prev) => {
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
        setIncorrectCells((prev) => {
          const next = new Set(prev);
          next.delete(`${r},${c}`);
          return next;
        });

        const currentHasAcross = hasWordAt(r, c, "across");
        const currentHasDown = hasWordAt(r, c, "down");

        let moveDir = direction;
        if (currentHasAcross && !currentHasDown) moveDir = "across";
        else if (!currentHasAcross && currentHasDown) moveDir = "down";

        moveCursor(r, c, moveDir, true);
        if (checkIsComplete(newGrid)) handleSolve();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedCell,
    direction,
    gridValues,
    isSolved,
    isRunning,
    moveCursor,
    checkIsComplete,
    handleSolve,
    handleNextClue,
    puzzle,
    hasWordAt,
    toggleDirectionIfPossible,
    setSelectedCell,
    setDirection,
  ]);

  const handleVirtualKey = (key: string) => {
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
      setIncorrectCells((prev) => {
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
      setIncorrectCells((prev) => {
        const next = new Set(prev);
        next.delete(`${r},${c}`);
        return next;
      });

      const hasAcross = hasWordAt(r, c, "across");
      const hasDown = hasWordAt(r, c, "down");

      let moveDir = direction;
      if (hasAcross && !hasDown) moveDir = "across";
      else if (!hasAcross && hasDown) moveDir = "down";

      moveCursor(r, c, moveDir, true);
      if (checkIsComplete(newGrid)) handleSolve();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {isSolved && <Confetti />}

      <CrosswordToolbar
        elapsedSeconds={elapsedSeconds}
        isRunning={isRunning}
        onToggleTimer={() => setIsRunning(!isRunning)}
        onCheckPuzzle={handleCheckPuzzle}
        onRevealWord={() => handleRevealWord(activeClue)}
        onResetPuzzle={handleResetPuzzle}
        isSolved={isSolved}
        onShare={() => setShowShareModal(true)}
        puzzle={puzzle}
        onNewRandomPuzzle={onNewRandomPuzzle}
      />

      <ActiveClueBanner
        activeClue={activeClue}
        onPrevClue={() => handleNextClue(-1)}
        onNextClue={() => handleNextClue(1)}
      />

      <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center">
        <div className="flex flex-col items-center mx-auto md:mx-0">
          <div
            className="grid bg-[#121212] border-3 border-[#121212] shadow-md rounded-xs overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${puzzle.width}, min(68px, 15vw))`,
              gridTemplateRows: `repeat(${puzzle.height}, min(68px, 15vw))`,
            }}
          >
            {puzzle.grid.map((rowArr, rowIndex) =>
              rowArr.map((cellLetter, colIndex) => {
                const isBlock = cellLetter === " ";
                const isSelected =
                  selectedCell?.[0] === rowIndex &&
                  selectedCell?.[1] === colIndex;
                const isInActiveWord = activeWordCells.has(`${rowIndex},${colIndex}`);
                const cellNumber = puzzle.cellNumbers?.[rowIndex]?.[colIndex];
                const hasError = incorrectCells.has(`${rowIndex},${colIndex}`);
                const isCorrect = correctCells.has(`${rowIndex},${colIndex}`);
                const userLetter = gridValues[rowIndex]?.[colIndex] || "";

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={cn(
                      "relative w-full h-full flex items-center justify-center border border-[#121212]/20 font-sans font-bold text-xl md:text-2xl cursor-pointer",
                      isBlock && "bg-[#121212] cursor-default border-none",
                      !isBlock && "bg-white text-[#171717]",
                      !isBlock && hasError && "!bg-red-100 text-red-600 line-through decoration-red-500",
                      !isBlock && isCorrect && "!bg-emerald-100 text-emerald-900",
                      isSolved && !isBlock && "!bg-emerald-100 text-emerald-900",
                      !isBlock && isInActiveWord && (hasError ? "!bg-red-300" : isCorrect ? "!bg-emerald-300" : "!bg-[#A8D8FF]"),
                      !isBlock && isSelected && "!bg-[#FFD900] shadow-inner",
                    )}
                  >
                    {cellNumber && (
                      <span className="absolute top-0.5 left-1 text-[10px] md:text-[11px] font-semibold text-[#4A3E36] pointer-events-none">
                      {cellNumber}
                      </span>
                    )}
                    <span className="uppercase select-none leading-none">
                      {isBlock ? "" : userLetter}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Tap cell to toggle Across / Down • Space or Tab to advance
          </div>
        </div>

        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF8F5] border border-[#EBE4DC] rounded-xl p-5 shadow-xs">
          <ClueList
            clues={puzzle.clues.across}
            title="Across"
            activeClue={activeClue}
            onClueClick={handleClueClick}
          />
          <ClueList
            clues={puzzle.clues.down}
            title="Down"
            activeClue={activeClue}
            onClueClick={handleClueClick}
          />
        </div>
      </div>

      <VirtualKeyboard
        onKeyClick={handleVirtualKey}
        direction={direction}
      />

      <ShareModal
        isOpen={showShareModal}
        puzzle={puzzle}
        elapsedSeconds={elapsedSeconds}
        onClose={() => setShowShareModal(false)}
        onNewRandomPuzzle={onNewRandomPuzzle}
      />
    </div>
  );
}
