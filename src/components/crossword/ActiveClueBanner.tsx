import React from 'react';
import { Clue } from '@/types/playminicrossword';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ActiveClueBannerProps {
  activeClue: Clue | null;
  onPrevClue: () => void;
  onNextClue: () => void;
}

export default function ActiveClueBanner({ activeClue, onPrevClue, onNextClue }: ActiveClueBannerProps) {
  return (
    <div className="w-full bg-[#EBF5FF] border border-[#BFDBFE] rounded-lg px-4 py-2.5 mb-6 flex items-center justify-between shadow-xs">
      <button
        onClick={onPrevClue}
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
        onClick={onNextClue}
        className="p-1 rounded hover:bg-blue-100 text-blue-800"
        title="Next Clue (Tab)"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
