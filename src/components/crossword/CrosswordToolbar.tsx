import React from 'react';
import { Clock, Pause, Play, RotateCcw, CheckCircle2, Eye, Share2, Shuffle, Eraser } from 'lucide-react';
import { CrosswordPuzzle } from '@/types/playminicrossword';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CrosswordToolbarProps {
  elapsedSeconds: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onCheckPuzzle: () => void;
  onClearIncorrect: () => void;
  onRevealWord: () => void;
  onResetPuzzle: () => void;
  isSolved: boolean;
  onShare: () => void;
  puzzle: CrosswordPuzzle;
  onNewRandomPuzzle?: () => void;
}

export default function CrosswordToolbar({
  elapsedSeconds,
  isRunning,
  onToggleTimer,
  onCheckPuzzle,
  onClearIncorrect,
  onRevealWord,
  onResetPuzzle,
  isSolved,
  onShare,
  puzzle,
  onNewRandomPuzzle,
}: CrosswordToolbarProps) {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="w-full flex items-center justify-between bg-[#FAF8F5] border border-[#E3DBD5] rounded-xl px-4 py-2.5 mb-4 shadow-xs">
      {/* Timer */}
      <div className="flex items-center gap-2 text-[#2C221B] font-mono text-sm font-semibold">
        <Clock className="w-4 h-4 text-[#F17127]" />
        <span>{timeFormatted}</span>
      </div>

      {/* Puzzle Mode & Title Badge */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
          {puzzle.mode === 'daily' ? 'Daily Puzzle' : 'Random Mode'}
        </span>
        <span className="text-xs text-muted-foreground">{puzzle.date}</span>
      </div>

      {/* Tools Menu */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={onCheckPuzzle}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 text-neutral-700 transition-colors font-medium"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Check
        </button>

        <button
          onClick={onClearIncorrect}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 text-neutral-700 transition-colors font-medium"
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </button>

        <button
          onClick={onRevealWord}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 text-neutral-700 transition-colors font-medium"
        >
          <Eye className="w-3.5 h-3.5" />
          Reveal
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
            onClick={onShare}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        )}
      </div>
    </div>
  );
}
