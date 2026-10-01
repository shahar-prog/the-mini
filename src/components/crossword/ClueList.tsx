import React from 'react';
import { Clue } from '@/types/playminicrossword';
import { cn } from '@/lib/utils';

interface ClueListProps {
  clues: Clue[];
  title: string;
  activeClue: Clue | null;
  onClueClick: (clue: Clue) => void;
}

export default function ClueList({ clues, title, activeClue, onClueClick }: ClueListProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-serif font-bold text-base text-[#2C221B] pb-1 border-b border-[#E3DBD5]">
        {title}
      </h3>
      <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
        {clues.map((clue) => {
          const isActive = activeClue?.number === clue.number && activeClue?.direction === clue.direction;
          return (
            <button
              key={`${clue.direction}-${clue.number}`}
              onClick={() => onClueClick(clue)}
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
  );
}
