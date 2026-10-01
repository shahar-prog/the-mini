"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CrosswordPuzzle } from '@/types/playminicrossword';
import { Check, Copy, Share2, Sparkles, RotateCw, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  puzzle: CrosswordPuzzle;
  elapsedSeconds: number;
  revealsUsed: number;
  onClose: () => void;
  onNewRandomPuzzle?: () => void;
}

export default function ShareModal({
  isOpen,
  puzzle,
  elapsedSeconds,
  revealsUsed,
  onClose,
  onNewRandomPuzzle,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Generate Emoji Grid
  const emojiRows = puzzle.grid.map((row) =>
    row.map((cell) => (cell === ' ' ? '⬛' : '🟩')).join('')
  );
  const emojiGridText = emojiRows.join('\n');

  // Build Share URL
  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://hd-crossword.com';

  const shareUrl =
    puzzle.mode === 'daily'
      ? `${currentOrigin}`
      : `${currentOrigin}/${puzzle.seed}`;

  const puzzleTitle =
    puzzle.mode === 'daily'
      ? `Mini Crossword (Daily - ${puzzle.date})`
      : `Mini Crossword (#${puzzle.seed})`;

  const shareText = `${puzzleTitle}\n⏱️ ${timeFormatted}${revealsUsed === 0 ? '\n✨ No hints used!' : ''}\n\n${emojiGridText}\n\nPlay here: ${shareUrl}`;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy share text', err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: puzzleTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to copy
      }
    }
    handleCopy();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border p-6 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-neutral-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
          <Sparkles className="w-7 h-7" />
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#2C221B] mb-1">
          Puzzle Solved!
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {puzzle.title}
        </p>

        {/* Time Card */}
        <div className="bg-[#FAF8F5] border border-[#EBE4DC] rounded-xl p-4 mb-4">
          <div className="text-xs uppercase font-semibold text-[#8C7A6B] tracking-wider mb-1">
            Completion Time
          </div>
          <div className="text-3xl font-bold font-mono text-[#2C221B]">
            {timeFormatted}
          </div>
        </div>

        {/* Visual Share Grid Preview */}
        <div className="bg-[#FAF8F5] border border-[#EBE4DC] rounded-xl p-4 mb-5 text-left font-mono text-sm leading-relaxed whitespace-pre-wrap select-all">
          <div className="text-xs text-muted-foreground mb-2 font-sans font-medium">
            Share Preview:
          </div>
          <div className="text-xs font-semibold text-neutral-800 mb-1">
            {puzzleTitle}
          </div>
          <div className="text-xs text-neutral-600 mb-2 font-mono">
            ⏱️ {timeFormatted}
          </div>
          <div className="text-base tracking-widest leading-tight">
            {emojiRows.map((row, idx) => (
              <div key={idx}>{row}</div>
            ))}
          </div>
          <div className="text-[11px] text-blue-600 mt-2 truncate">
            {shareUrl}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F17127] hover:bg-[#D95F1A] text-white font-medium shadow-sm transition-colors text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share Result
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-medium transition-colors text-sm"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Text Score'}
          </button>

          <div className="pt-2 flex items-center justify-between gap-3">
            {onNewRandomPuzzle ? (
              <button
                onClick={onNewRandomPuzzle}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                New Random Puzzle
              </button>
            ) : (
              <Link
                href="/unlimited"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                New Random Puzzle
              </Link>
            )}

            <button
              onClick={onClose}
              className="py-2 px-4 rounded-lg text-neutral-600 hover:text-neutral-900 text-xs font-medium transition-colors"
            >
              Review Grid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
