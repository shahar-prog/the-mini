"use client";

import React from 'react';
import { CrosswordPuzzle } from '@/types/playminicrossword';

interface ShareImageCardProps {
  puzzle: CrosswordPuzzle;
  timeFormatted: string;
  revealsUsed: number;
  shareUrl: string;
}

export default function ShareImageCard({
  puzzle,
  timeFormatted,
  revealsUsed,
  shareUrl,
}: ShareImageCardProps) {
  const puzzleTitle =
    puzzle.mode === 'daily'
      ? `Daily - ${puzzle.date}`
      : `#${puzzle.seed}`;

  return (
    <div
      className="w-[400px] p-8 bg-white text-[#2C221B] flex flex-col items-center justify-center gap-8 font-sans"
      style={{ colorScheme: 'light', backgroundColor: 'white' }}
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="text-xs uppercase tracking-widest font-bold text-[#8C7A6B] mb-1">
          The Mini
        </div>
        <div className="text-2xl font-serif font-bold leading-tight">
          <div>Mini Crossword</div>
          <div>{puzzleTitle}</div>
        </div>
      </div>

      {/* Visual Grid */}
      <div className="p-4 bg-[#FAF8F5] border border-[#EBE4DC] rounded-2xl shadow-sm">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${puzzle.grid[0]?.length || 5}, 1fr)`
          }}
        >
          {puzzle.grid.flatMap((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-sm transition-colors ${
                  cell === ' '
                    ? 'bg-[#2C221B]'
                    : 'bg-[#4ADE80] border border-[#22C55E]'
                }`}
              >
                {cell === ' ' ? '' : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col items-center gap-3 pt-2">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-[#8C7A6B]">Time</div>
            <div className="text-xl font-mono font-bold">{timeFormatted}</div>
          </div>

          {revealsUsed > 0 && (
            <div className="text-center border-l border-[#EBE4DC] pl-4">
              <div className="text-[10px] uppercase font-bold text-[#8C7A6B]">Hints</div>
              <div className="text-xl font-mono font-bold">{revealsUsed}</div>
            </div>
          )}
        </div>

        <div className="text-xs text-[#8C7A6B] font-medium truncate max-w-full opacity-70">
          {shareUrl}
        </div>
      </div>
    </div>
  );
}
