import React from 'react';
import { cn } from '@/lib/utils';

interface TutorialGridProps {
  step: number;
}

export default function TutorialGrid({ step }: TutorialGridProps) {
  interface StepState {
    grid: string[][];
    highlights: number[][];
    activeCell: number[] | null;
  }

  const stepStates: Record<number, StepState> = {
    1: {
      grid: [
        [' ', 'P', 'L', 'A', 'Y'],
        ['X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'X', ' '],
      ],
      highlights: [[0, 1]],
      activeCell: [0, 1],
    },
    2: {
      grid: [
        [' ', 'P', 'L', 'A', 'Y'],
        ['X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'X', ' '],
      ],
      highlights: [[0, 1]],
      activeCell: [0, 1],
    },
    3: {
      grid: [
        [' ', 'P', 'L', 'A', 'Y'],
        ['X', 'S', 'X', 'X', 'X'],
        ['X', 'O', 'X', 'X', 'X'],
        ['X', 'L', 'X', 'X', 'X'],
        ['X', 'V', 'X', 'X', ' '],
      ],
      highlights: [[0, 1], [1, 1]],
      activeCell: [0, 1],
    },
    4: {
      grid: [
        [' ', 'P', 'L', 'A', 'Y'],
        ['X', 'S', 'X', 'X', 'X'],
        ['X', 'O', 'X', 'X', 'X'],
        ['X', 'L', 'X', 'X', 'X'],
        ['X', 'V', 'X', 'X', ' '],
      ],
      highlights: [],
      activeCell: null,
    }
  };

  const state = stepStates[step] || stepStates[1];

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="grid grid-cols-5 gap-0 bg-[#121212] border-2 border-[#121212]"
        style={{
          gridTemplateColumns: 'repeat(5, 27px)',
          gridTemplateRows: 'repeat(5, 27px)',
        }}
      >
        {state.grid.map((row: string[], rowIndex: number) =>
          row.map((cell: string, colIndex: number) => {
            const isBlock = cell === ' ';
            const isHighlighted = state.highlights.some(([r, c]: number[]) => r === rowIndex && c === colIndex);
            const isActive = state.activeCell && state.activeCell[0] === rowIndex && state.activeCell[1] === colIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "w-[27px] h-[27px] flex items-center justify-center text-[11px] font-bold uppercase transition-colors duration-300",
                  isBlock ? "bg-[#121212]" : "bg-white text-black",
                  isHighlighted && "bg-[#A8D8FF]",
                  isActive && "bg-[#FFD900]"
                )}
              >
                {cell !== ' ' && cell !== 'X' ? cell : ""}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
