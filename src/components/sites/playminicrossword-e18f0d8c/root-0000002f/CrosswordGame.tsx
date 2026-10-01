"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CrosswordPuzzle } from "@/types/playminicrossword";
import ShareModal from "@/components/crossword/ShareModal";
import Confetti from "@/components/crossword/Confetti";
import CrosswordToolbar from "@/components/crossword/CrosswordToolbar";
import ActiveClueBanner from "@/components/crossword/ActiveClueBanner";
import ClueList from "@/components/crossword/ClueList";
import VirtualKeyboard from "@/components/crossword/VirtualKeyboard";
import { useCrosswordNavigation } from "@/hooks/useCrosswordNavigation";
import { useCrosswordGame } from "@/hooks/useCrosswordGame";
import { usePuzzleInput } from "@/hooks/usePuzzleInput";

interface CrosswordGameProps {
  puzzle: CrosswordPuzzle;
  onSolve?: (timeInSeconds: number) => void;
  onNewRandomPuzzle?: () => void;
}

export default function CrosswordGame({
  puzzle,
  onSolve,
  onNewRandomPuzzle,
}: CrosswordGameProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const nav = useCrosswordNavigation(puzzle);
  const game = useCrosswordGame(puzzle, onSolve);

  const { handleKeyDown, handleVirtualKey } = usePuzzleInput(
    puzzle,
    {
      selectedCell: nav.selectedCell,
      setSelectedCell: nav.setSelectedCell,
      direction: nav.direction,
      setDirection: nav.setDirection,
      hasWordAt: nav.hasWordAt,
      toggleDirectionIfPossible: nav.toggleDirectionIfPossible,
      moveCursor: nav.moveCursor,
    },
    {
      gridValues: game.gridValues,
      setGridValues: game.setGridValues,
      updateGridValues: game.updateGridValues,
      handleUndo: game.handleUndo,
      handleRedo: game.handleRedo,
      isSolved: game.isSolved,
      isRunning: game.isRunning,
      setIncorrectCells: game.setIncorrectCells,
      checkIsComplete: game.checkIsComplete,
      handleSolve: game.handleSolve,
      handleCheckPuzzle: game.handleCheckPuzzle,
      handleClearIncorrect: game.handleClearIncorrect,
      showIncorrectPopup: game.showIncorrectPopup,
    },
    nav.handleNextClue
  );

  useEffect(() => {
    if (game.isSolved) {
      setShowShareModal(true);
    }
  }, [game.isSolved]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (game.showIncorrectPopup && (e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        game.setShowIncorrectPopup(false);
        return;
      }
      if (e.key === 'Home') {
        e.preventDefault();
        nav.jumpToWordEdge(false);
        return;
      }
      if (e.key === 'End') {
        e.preventDefault();
        nav.jumpToWordEdge(true);
        return;
      }
      handleKeyDown(e);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyDown, game.showIncorrectPopup, nav.jumpToWordEdge]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none relative">
      {game.isSolved && <Confetti />}

      {game.showIncorrectPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-200 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">So close!</h2>
            <p className="text-gray-600 mb-6">Some of the puzzle isn't correct. Give it another shot!</p>
            <button
              onClick={() => game.setShowIncorrectPopup(false)}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              Keep trying
            </button>
          </div>
        </div>
      )}

      <div className={cn(
        "w-full flex flex-col items-center",
        game.showIncorrectPopup && "pointer-events-none opacity-50 grayscale-[0.5] transition-all duration-300"
      )}>
        <CrosswordToolbar
          elapsedSeconds={game.elapsedSeconds}
          isRunning={game.isRunning}
          onToggleTimer={() => game.setIsRunning(!game.isRunning)}
          onCheckPuzzle={game.handleCheckPuzzle}
          onClearIncorrect={game.handleClearIncorrect}
          onRevealWord={() => game.handleRevealWord(nav.activeClue)}
          onResetPuzzle={game.handleResetPuzzle}
          isSolved={game.isSolved}
          onShare={() => setShowShareModal(true)}
          puzzle={puzzle}
          onNewRandomPuzzle={onNewRandomPuzzle}
        />

        <ActiveClueBanner
          activeClue={nav.activeClue}
          onPrevClue={() => nav.handleNextClue(-1)}
          onNextClue={() => nav.handleNextClue(1)}
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
                    nav.selectedCell?.[0] === rowIndex &&
                    nav.selectedCell?.[1] === colIndex;
                  const isInActiveWord = nav.activeWordCells.has(`${rowIndex},${colIndex}`);
                  const cellNumber = puzzle.cellNumbers?.[rowIndex]?.[colIndex];
                  const hasError = game.incorrectCells.has(`${rowIndex},${colIndex}`);
                  const isCorrect = game.correctCells.has(`${rowIndex},${colIndex}`);
                  const userLetter = game.gridValues[rowIndex]?.[colIndex] || "";

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => nav.handleCellClick(rowIndex, colIndex)}
                      className={cn(
                        "relative w-full h-full flex items-center justify-center border border-[#121212]/20 font-sans font-bold text-xl md:text-2xl cursor-pointer",
                        isBlock && "bg-[#121212] cursor-default border-none",
                        !isBlock && "bg-white text-[#171717]",
                        !isBlock && hasError && "!bg-red-100 text-red-600 line-through decoration-red-500",
                        !isBlock && isCorrect && "!bg-emerald-100 text-emerald-900",
                        game.isSolved && !isBlock && "!bg-emerald-100 text-emerald-900",
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
              Tap cell or Space to toggle Across • Tab to advance
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF8F5] border border-[#EBE4DC] rounded-xl p-5 shadow-xs">
            <ClueList
              clues={puzzle.clues.across}
              title="Across"
              activeClue={nav.activeClue}
              onClueClick={nav.handleClueClick}
            />
            <ClueList
              clues={puzzle.clues.down}
              title="Down"
              activeClue={nav.activeClue}
              onClueClick={nav.handleClueClick}
            />
          </div>
        </div>
      </div>

      <div className={cn(
        "w-full",
        game.showIncorrectPopup && "pointer-events-none opacity-50 grayscale-[0.5] transition-all duration-300"
      )}>
        <VirtualKeyboard
          onKeyClick={handleVirtualKey}
          direction={nav.direction}
        />
      </div>

      <ShareModal
        isOpen={showShareModal}
        puzzle={puzzle}
        elapsedSeconds={game.elapsedSeconds}
        revealsUsed={game.revealsUsed}
        onClose={() => setShowShareModal(false)}
        onNewRandomPuzzle={onNewRandomPuzzle}
      />
    </div>
  );
}
