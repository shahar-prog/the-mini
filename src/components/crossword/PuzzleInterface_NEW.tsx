"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CrosswordPuzzle, Clue } from "@/types/playminicrossword";
import ShareModal from "@/components/crossword/ShareModal";
import Confetti from "@/components/crossword/Confetti";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
} from "lucide-react";
import Link from "next/link";

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
  // 1. Grid Values State (user input)
  const [gridValues, setGridValues] = useState<string[][]>(() =>
    puzzle.initialGrid
      ? puzzle.initialGrid.map((row) => [...row])
      : Array.from({ length: puzzle.height }, () =>
          Array(puzzle.width).fill(""),
        ),
  );

  // 2. Active Cell & Direction
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    () => findFirstPlayableCell(puzzle),
  );
  const [direction, setDirection] = useState<"across" | "down">("across");

  // 3. Timer State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // 4. Completion & Share State
  const [isSolved, setIsSolved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [incorrectCells, setIncorrectCells] = useState<Set<string>>(new Set());

  // Timer Effect
  useEffect(() => {
    if (!isRunning || isSolved) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isSolved]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Find active clue based on selected cell & direction
  const activeClue = useMemo<Clue | null>(() => {
    if (!selectedCell) return null;
    const [r, c] = selectedCell;

    const list =
      direction === "across" ? puzzle.clues.across : puzzle.clues.down;
    // Find clue that covers [r, c]
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
    // If not found in current direction, check other direction
    const otherList =
      direction === "across" ? puzzle.clues.down : puzzle.clues.across;
    for (const clue of otherList) {
      if (direction === "across") {
        if (clue.col === c && r >= clue.row && r < clue.row + clue.length) {
          return clue;
        }
      } else {
        if (clue.row === r && c >= clue.col && c < clue.col + clue.length) {
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

  // Check if puzzle is solved
  const checkIsComplete = useCallback(
    (currentGrid: string[][]) => {
      for (let r = 0; r < puzzle.height; r++) {
        for (let c = 0; c < puzzle.width; c++) {
          if (puzzle.grid[r][c] !== " ") {
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

  // Trigger solve celebration
  const handleSolve = useCallback(() => {
    setIsSolved(true);
    setIsRunning(false);
    setShowShareModal(true);
    onSolve?.(elapsedSeconds);
  }, [elapsedSeconds, onSolve]);

  // Cell Click Handler
  const handleCellClick = (r: number, c: number) => {
    if (puzzle.grid[r][c] === " ") return; // blocked

    if (selectedCell && selectedCell[0] === r && selectedCell[1] === c) {
      // Toggle direction
      setDirection((prev) => (prev === "across" ? "down" : "across"));
    } else {
      setSelectedCell([r, c]);
    }
  };

  // Clue Click Handler
  const handleClueClick = useCallback((clue: Clue) => {
    setDirection(clue.direction);
    setSelectedCell([clue.row, clue.col]);
  }, []);

  // Switch to next or previous clue in order
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

  // Cursor navigation
  const moveCursor = useCallback(
    (r: number, c: number, dir: "across" | "down", forward: boolean) => {
      const step = forward ? 1 : -1;
      let nextR = r;
      let nextC = c;

      if (dir === "across") {
        nextC += step;
        while (nextC >= 0 && nextC < puzzle.width) {
          if (puzzle.grid[nextR][nextC] !== " ") {
            setSelectedCell([nextR, nextC]);
            return;
          }
          nextC += step;
        }
      } else {
        nextR += step;
        while (nextR >= 0 && nextR < puzzle.height) {
          if (puzzle.grid[nextR][nextC] !== " ") {
            setSelectedCell([nextR, nextC]);
            return;
          }
          nextR += step;
        }
      }
    },
    [puzzle],
  );

  // Key Down Handler
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
        setDirection((prev) => (prev === "across" ? "down" : "across"));
      } else if (e.key === "Tab") {
        e.preventDefault();
        handleNextClue(e.shiftKey ? -1 : 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (direction !== "across") setDirection("across");
        else moveCursor(r, c, "across", true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (direction !== "across") setDirection("across");
        else moveCursor(r, c, "across", false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (direction !== "down") setDirection("down");
        else moveCursor(r, c, "down", true);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (direction !== "down") setDirection("down");
        else moveCursor(r, c, "down", false);
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

        moveCursor(r, c, direction, true);
        if (checkIsComplete(newGrid)) {
          handleSolve();
        }
      }
    };

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
  ]);

  // Mobile virtual keyboard input
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
      setDirection((prev) => (prev === "across" ? "down" : "across"));
    } else {
      const newGrid = gridValues.map((row) => [...row]);
      newGrid[r][c] = key;
      setGridValues(newGrid);
      setIncorrectCells((prev) => {
        const next = new Set(prev);
        next.delete(`${r},${c}`);
        return next;
      });
      moveCursor(r, c, direction, true);
      if (checkIsComplete(newGrid)) {
        handleSolve();
      }
    }
  };

  // Verification & Reveal Actions
  const handleCheckWord = () => {
    if (!activeClue) return;
    const errors = new Set(incorrectCells);
    const isAcross = activeClue.direction === "across";
    for (let i = 0; i < activeClue.length; i++) {
      const r = isAcross ? activeClue.row : activeClue.row + i;
      const c = isAcross ? activeClue.col + i : activeClue.col;
      const val = gridValues[r][c];
      if (val && val !== puzzle.grid[r][c]) {
        errors.add(`${r},${c}`);
      }
    }
    setIncorrectCells(errors);
  };

  const handleCheckPuzzle = () => {
    const errors = new Set<string>();
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        if (puzzle.grid[r][c] !== " ") {
          const val = gridValues[r][c];
          if (val && val !== puzzle.grid[r][c]) {
            errors.add(`${r},${c}`);
          }
        }
      }
    }
    setIncorrectCells(errors);
  };

  const handleRevealWord = () => {
    if (!activeClue) return;
    const newGrid = gridValues.map((row) => [...row]);
    const isAcross = activeClue.direction === "across";
    for (let i = 0; i < activeClue.length; i++) {
      const r = isAcross ? activeClue.row : activeClue.row + i;
      const c = isAcross ? activeClue.col + i : activeClue.col;
      newGrid[r][c] = puzzle.grid[r][c];
    }
    setGridValues(newGrid);
    if (checkIsComplete(newGrid)) handleSolve();
  };

  const handleRevealPuzzle = () => {
    const newGrid = puzzle.grid.map((row) => [...row]);
    setGridValues(newGrid);
    handleSolve();
  };

  const handleResetPuzzle = () => {
    if (puzzle.initialGrid) {
      setGridValues(puzzle.initialGrid.map((row) => [...row]));
    }
    setIncorrectCells(new Set());
    setIsRunning(true);
    setIsSolved(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none">
      {isSolved && <Confetti />}

      {/* Toolbar: Timer & Actions */}
      <div className="w-full flex items-center justify-between bg-[#FAF8F5] border border-[#E3DBD5] rounded-xl px-4 py-2.5 mb-4 shadow-xs">
        {/* Timer */}
        <div className="flex items-center gap-2 text-[#2C221B] font-mono text-sm font-semibold">
          <Clock className="w-4 h-4 text-[#F17127]" />
          <span>{timeFormatted}</span>
        </div>

        {/* Puzzle Mode & Title Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
            {puzzle.mode === "daily" ? "Daily Puzzle" : "Random Mode"}
          </span>
          <span className="text-xs text-muted-foreground">{puzzle.date}</span>
        </div>

        {/* Tools Menu */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleCheckPuzzle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 text-neutral-700 transition-colors font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Check
          </button>

          <button
            onClick={handleRevealWord}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 text-neutral-700 transition-colors font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            Reveal
          </button>

          <button
            onClick={handleResetPuzzle}
            className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-700 transition-colors"
            title="Reset Puzzle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onNewRandomPuzzle ? (
            <button
              onClick={onNewRandomPuzzle}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#F17127] text-white hover:bg-[#D95F1A] transition-colors font-medium"
              title="Generate New Random Puzzle"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Random</span>
            </button>
          ) : (
            <Link
              href="/unlimited"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#F17127] text-white hover:bg-[#D95F1A] transition-colors font-medium"
              title="Generate New Random Puzzle"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Random</span>
            </Link>
          )}

          {isSolved && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Active Clue Banner */}
      <div className="w-full bg-[#EBF5FF] border border-[#BFDBFE] rounded-lg px-4 py-2.5 mb-6 flex items-center justify-between shadow-xs">
        <button
          onClick={() => handleNextClue(-1)}
          className="p-1 rounded hover:bg-blue-100 text-blue-800"
          title="Previous Clue (Shift+Tab)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center px-2">
          {activeClue ? (
            <span className="text-sm font-medium text-blue-950">
              <strong className="uppercase mr-1.5 text-blue-700">
                {activeClue.number} {activeClue.direction}:
              </strong>
              {activeClue.text}
            </span>
          ) : (
            <span className="text-sm text-blue-800">
              Click a cell to begin solving
            </span>
          )}
        </div>

        <button
          onClick={() => handleNextClue(1)}
          className="p-1 rounded hover:bg-blue-100 text-blue-800"
          title="Next Clue (Tab)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Playing Area: Grid + Clue Lists */}
      <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* The 5x5 Crossword Grid */}
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
                const isInActiveWord = activeWordCells.has(
                  `${rowIndex},${colIndex}`,
                );
                const cellNumber = puzzle.cellNumbers?.[rowIndex]?.[colIndex];
                const hasError = incorrectCells.has(`${rowIndex},${colIndex}`);
                const userLetter = gridValues[rowIndex]?.[colIndex] || "";

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={cn(
                      "relative w-full h-full flex items-center justify-center border border-[#121212]/20 font-sans font-bold text-xl md:text-2xl transition-colors duration-100 cursor-pointer",
                      isBlock && "bg-[#121212] cursor-default border-none",
                      !isBlock && "bg-white text-[#171717]",
                      !isBlock && isInActiveWord && "bg-[#A8D8FF]",
                      !isBlock && isSelected && "!bg-[#FFD900] shadow-inner",
                      !isBlock &&
                        hasError &&
                        "!bg-red-100 text-red-600 line-through decoration-red-500",
                      isSolved &&
                        !isBlock &&
                        "!bg-emerald-100 text-emerald-900",
                    )}
                  >
                    {/* Clue Number */}
                    {cellNumber && (
                      <span className="absolute top-0.5 left-1 text-[10px] md:text-[11px] font-semibold text-[#4A3E36] pointer-events-none">
                        {cellNumber}
                      </span>
                    )}

                    {/* Letter Value */}
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

        {/* Clue Columns */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF8F5] border border-[#EBE4DC] rounded-xl p-5 shadow-xs">
          {/* Across Clues */}
          <div className="flex flex-col gap-2">
            <h3 className="font-serif font-bold text-base text-[#2C221B] pb-1 border-b border-[#E3DBD5]">
              Across
            </h3>
            <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
              {puzzle.clues.across.map((clue) => {
                const isActive =
                  activeClue?.direction === "across" &&
                  activeClue?.number === clue.number;
                return (
                  <button
                    key={`A-${clue.number}`}
                    onClick={() => handleClueClick(clue)}
                    className={cn(
                      "text-left text-xs md:text-sm p-2 rounded-lg transition-colors leading-snug flex items-start gap-1.5",
                      isActive
                        ? "bg-[#FFD900]/30 text-[#171717] font-medium border border-amber-300"
                        : "hover:bg-neutral-200/60 text-neutral-700",
                    )}
                  >
                    <span className="font-bold text-[#F17127] min-w-4 text-right">
                      {clue.number}.
                    </span>
                    <span>{clue.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Down Clues */}
          <div className="flex flex-col gap-2">
            <h3 className="font-serif font-bold text-base text-[#2C221B] pb-1 border-b border-[#E3DBD5]">
              Down
            </h3>
            <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
              {puzzle.clues.down.map((clue) => {
                const isActive =
                  activeClue?.direction === "down" &&
                  activeClue?.number === clue.number;
                return (
                  <button
                    key={`D-${clue.number}`}
                    onClick={() => handleClueClick(clue)}
                    className={cn(
                      "text-left text-xs md:text-sm p-2 rounded-lg transition-colors leading-snug flex items-start gap-1.5",
                      isActive
                        ? "bg-[#FFD900]/30 text-[#171717] font-medium border border-amber-300"
                        : "hover:bg-neutral-200/60 text-neutral-700",
                    )}
                  >
                    <span className="font-bold text-[#F17127] min-w-4 text-right">
                      {clue.number}.
                    </span>
                    <span>{clue.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Touch Virtual Keyboard */}
      <div className="w-full mt-6 md:hidden bg-[#FAF8F5] border border-[#E3DBD5] rounded-xl p-2 shadow-xs">
        <div className="flex flex-col gap-1.5">
          {[
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["SWITCH", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
          ].map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1">
              {row.map((k) => (
                <button
                  key={k}
                  onClick={() => handleVirtualKey(k)}
                  className={cn(
                    "h-10 rounded font-semibold text-xs transition-colors flex items-center justify-center active:scale-95",
                    k === "BACKSPACE"
                      ? "px-2.5 bg-neutral-300 text-neutral-800"
                      : k === "SWITCH"
                        ? "px-2.5 bg-neutral-300 text-neutral-800 uppercase text-[10px]"
                        : "w-8 bg-white border border-neutral-300 text-neutral-900 shadow-xs",
                  )}
                >
                  {k === "BACKSPACE"
                    ? "⌫"
                    : k === "SWITCH"
                      ? direction === "across"
                        ? "Across"
                        : "Down"
                      : k}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Share & Win Modal */}
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

function findFirstPlayableCell(
  puzzle: CrosswordPuzzle,
): [number, number] | null {
  for (let r = 0; r < puzzle.height; r++) {
    for (let c = 0; c < puzzle.width; c++) {
      if (puzzle.grid[r][c] !== " ") {
        return [r, c];
      }
    }
  }
  return null;
}
