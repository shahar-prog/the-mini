import React from 'react';
import { cn } from '@/lib/utils';

interface VirtualKeyboardProps {
  onKeyClick: (key: string) => void;
  direction: 'across' | 'down';
}

export default function VirtualKeyboard({ onKeyClick, direction }: VirtualKeyboardProps) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['SWITCH', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  return (
    <div className="w-full mt-6 md:hidden bg-[#FAF8F5] border border-[#E3DBD5] rounded-xl p-2 shadow-xs">
      <div className="flex flex-col gap-1.5">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1">
            {row.map((k) => (
              <button
                key={k}
                onClick={() => onKeyClick(k)}
                className={cn(
                  "h-10 rounded font-semibold text-xs transition-colors flex items-center justify-center active:scale-95",
                  k === 'BACKSPACE'
                    ? "px-2.5 bg-neutral-300 text-neutral-800"
                    : k === 'SWITCH'
                      ? "px-2.5 bg-neutral-300 text-neutral-800 uppercase text-[10px]"
                      : "w-8 bg-white border border-neutral-300 text-neutral-900 shadow-xs",
                )}
              >
                {k === 'BACKSPACE' ? '⌫' : k === 'SWITCH' ? (direction === 'across' ? 'Across' : 'Down') : k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
