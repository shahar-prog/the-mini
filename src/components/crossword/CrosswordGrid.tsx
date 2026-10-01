import React from 'react';
import { CrosswordPuzzle } from '@/types/playminicrossword';
import { cn } from '@/lib/utils';

interface CrosswordGridProps {
  puzzle: CrosswordPuzzle;
  gridValues: string[][];
  selectedCell: [number, number] | null;
  direction: 'across' | 'down';
  incorrectCells: Set<string>;
  isSolved: boolean;
  onCellClick: (r: number, c: number) => void;
  activeWordCells: Set<string>;
}

export default function CrosswordGrid({
  puzzle,
  gridValues,
  selectedCell,
  direction,
  incorrectCells,
  isSolved,
  onCellClick,
  activeWordCells,
}: CrosswordGridProps) {
  return (
    <div
      className="grid bg-[#121212] border-3 border-[#121212] shadow-md rounded-xs overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${puzzle.width}, min(68px, 15vw))`,
        gridTemplateRows: `repeat(${puzzle.height}, min(68px, 15vw))`,
      }}
    >
      {puzzle.grid.map((rowArr, rowIndex) =>
        rowArr.map((cellLetter, colIndex) => {
          const isBlock = cellLetter === ' ';
          const isSelected =
            selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
          const isInActiveWord = activeWordCells.has(`${rowIndex},${colIndex}`);
          const cellNumber = puzzle.cellNumbers?.[rowIndex]?.[colIndex];
          const hasError = incorrectCells.has(`${rowIndex},${colIndex}`);
          const userLetter = gridValues[rowIndex]?.[colIndex] || '';

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              className={cn(
                "relative w-full h-full flex items-center justify-center border border-[#121212]/20 font-sans font-bold text-xl md:text-2xl transition-colors duration-100 cursor-pointer",
                isBlock && "bg-[#121212] cursor-default border-none",
                !isBlock && "bg-white text-[#171717]",
                !isBlock && isInActiveWord && "bg-[#A8D8FF]",
                !isBlock && isSelected && "!bg-[#FFD900] shadow-inner",
                !isBlock && hasError && "!bg-red-100 text-red-600 line-through decoration-red-500",
                isSolved && !isBlock && "!bg-emerald-100 text-emerald-900",
              )}
            >
              {cellNumber && (
                <span className="absolute top-0.5 left-1 text-[10px] md:text-[11px] font-semibold text-[#4A3E36] pointer-events-none">
                  {cellNumber}
                </span>
              )}
              <span className="uppercase select-none leading-none">
                {isBlock ? '' : userLetter}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
