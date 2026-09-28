"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CrosswordPuzzle, Clue } from '@/types/playminicrossword';

interface PuzzleInterfaceProps {
  puzzle: CrosswordPuzzle;
  onCellChange?: (row: number, col: number, value: string) => void;
  onActiveClueChange?: (clue: Clue | null, direction: 'across' | 'down' | null) => void;
}

export default function PuzzleInterface({
  puzzle,
  onCellChange,
  onActiveClueChange,
}: PuzzleInterfaceProps) {
  // Grid state
  const [gridValues, setGridValues] = useState<string[][]>(() =>
    puzzle.grid.map((row) => row.map((cell) => (cell === ' ' ? '' : cell)))
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');

  const handleCellClick = (row: number, col: number) => {
    if (puzzle.grid[row][col] === ' ') return;
    setSelectedCell([row, col]);
  };

  const moveFocus = useCallback((row: number, col: number, dir: 'across' | 'down') => {
    if (dir === 'across') {
      for (let c = col + 1; c < 5; c++) {
        if (puzzle.grid[row][c] !== ' ') {
          setSelectedCell([row, c]);
          return;
        }
      }
    } else {
      for (let r = row + 1; r < 5; r++) {
        if (puzzle.grid[r][col] !== ' ') {
          setSelectedCell([r, col]);
          return;
        }
      }
    }
    setSelectedCell(null);
  }, [puzzle.grid]);

  const moveFocusBack = useCallback((row: number, col: number, dir: 'across' | 'down') => {
    if (dir === 'across') {
      for (let c = col - 1; c >= 0; c--) {
        if (puzzle.grid[row][c] !== ' ') {
          setSelectedCell([row, c]);
          return;
        }
      }
    } else {
      for (let r = row - 1; r >= 0; r--) {
        if (puzzle.grid[r][col] !== ' ') {
          setSelectedCell([r, col]);
          return;
        }
      }
    }
    setSelectedCell(null);
  }, [puzzle.grid]);

  const calculateCellNumber = (row: number, col: number) => {
    const isBlock = puzzle.grid[row][col] === ' ';
    if (isBlock) return null;

    const hasAcross = col === 0 || puzzle.grid[row][col - 1] === ' ';
    const hasDown = row === 0 || puzzle.grid[row - 1][col] === ' ';

    if (!hasAcross && !hasDown) return null;

    let count = 0;
    for (let r = 0; r <= row; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === row && c === col) return count + 1;
        const cellIsBlock = puzzle.grid[r][c] === ' ';
        if (!cellIsBlock) {
          const isStartAcross = c === 0 || puzzle.grid[r][c - 1] === ' ';
          const isStartDown = r === 0 || puzzle.grid[r - 1][c] === ' ';
          if (isStartAcross || isStartDown) count++;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      const [row, col] = selectedCell;

      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        e.preventDefault();
        const newVal = e.key.toUpperCase();
        const newGrid = [...gridValues.map(r => [...r])];
        newGrid[row][col] = newVal;
        setGridValues(newGrid);
        onCellChange?.(row, col, newVal);
        moveFocus(row, col, direction);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        const newGrid = [...gridValues.map(r => [...r])];
        newGrid[row][col] = '';
        setGridValues(newGrid);
        onCellChange?.(row, col, '');
        moveFocusBack(row, col, direction);
      } else if (e.key === 'ArrowRight') {
        setDirection('across');
        moveFocus(row, col, 'across');
      } else if (e.key === 'ArrowDown') {
        setDirection('down');
        moveFocus(row, col, 'down');
      } else if (e.key === 'ArrowLeft') {
        moveFocusBack(row, col, 'across');
      } else if (e.key === 'ArrowUp') {
        moveFocusBack(row, col, 'down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, gridValues, direction, moveFocus, moveFocusBack, onCellChange]);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start justify-center p-4">
      <div className="flex-shrink-0">
        <div
          className="grid grid-cols-5 gap-0 bg-[#121212] border-3 border-[#121212] w-[510px] h-[510px]"
          style={{
            gridTemplateColumns: 'repeat(5, 102px)',
            gridTemplateRows: 'repeat(5, 102px)'
          }}
        >
          {puzzle.grid.map((rowArr, rowIndex) =>
            rowArr.map((cell, colIndex) => {
              const isBlock = cell === ' ';
              const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
              const isActiveRowCol = selectedCell && (selectedCell[0] === rowIndex || selectedCell[1] === colIndex);
              const cellNumber = calculateCellNumber(rowIndex, colIndex);

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={cn(
                    "relative w-full h-full flex items-center justify-center transition-colors duration-100 cursor-pointer border-0",
                    isBlock ? "bg-[#121212] cursor-default" : "bg-[#FFD900] text-[#171717] font-sans text-base",
                    !isBlock && isSelected && "bg-[#FFD900]",
                    !isBlock && !isSelected && isActiveRowCol && "bg-[#A8D8FF]"
                  )}
                >
                  {cellNumber && (
                    <span className="absolute top-0 left-0 text-[10px] font-medium text-[#2F251E] pointer-events-none px-0.5">
                      {cellNumber}
                    </span>
                  )}
                  <span className="uppercase">{gridValues[rowIndex][colIndex]}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Across</h3>
            <div className="flex flex-col gap-1">
              {puzzle.clues.across.map((clue, i) => (
                <div key={i} className="text-sm p-1 hover:bg-gray-100 cursor-pointer rounded">
                  <span className="font-bold mr-1">{clue.number}.</span> {clue.text}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Down</h3>
            <div className="flex flex-col gap-1">
              {puzzle.clues.down.map((clue, i) => (
                <div key={i} className="text-sm p-1 hover:bg-gray-100 cursor-pointer rounded">
                  <span className="font-bold mr-1">{clue.number}.</span> {clue.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
