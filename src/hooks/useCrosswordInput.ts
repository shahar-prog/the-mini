import { useEffect, useCallback } from 'react';
import {
  selectedCell,
  direction,
  setDirection,
  setSelectedCell,
  gridValues,
  setGridValues,
  incorrectCells,
  setIncorrectCells,
  checkIsComplete,
  handleSolve
} from './useCrosswordGame'; // Note: I'll fix the imports in a second

export function useCrosswordInput(
  puzzle: any,
  game: any,
  moveCursor: (r: number, c: number, dir: 'across' | 'down', forward: boolean) => void,
  handleNextClue: (delta: 1 | -1) => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (game.isSolved || ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (!game.selectedCell) return;
      const [r, c] = game.selectedCell;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        game.setDirection((prev: any) => (prev === 'across' ? 'down' : 'across'));
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleNextClue(e.shiftKey ? -1 : 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (game.direction !== 'across') game.setDirection('across');
        else moveCursor(r, c, 'across', true);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (game.direction !== 'across') game.setDirection('across');
        else moveCursor(r, c, 'across', false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (game.direction !== 'down') game.setDirection('down');
        else moveCursor(r, c, 'down', true);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (game.direction !== 'down') game.setDirection('down');
        else moveCursor(r, c, 'down', false);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        const currentVal = game.gridValues[r][c];
        const newGrid = game.gridValues.map((row: any) => [...row]);

        if (currentVal !== '') {
          newGrid[r][c] = '';
          game.setGridValues(newGrid);
        } else {
          moveCursor(r, c, game.direction, false);
        }

        game.setIncorrectCells((prev: any) => {
          const next = new Set(prev);
          next.delete(`${r},${c}`);
          return next;
        });
      } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        const letter = e.key.toUpperCase();
        const newGrid = game.gridValues.map((row: any) => [...row]);
        newGrid[r][c] = letter;
        game.setGridValues(newGrid);

        game.setIncorrectCells((prev: any) => {
          const next = new Set(prev);
          next.delete(`${r},${c}`);
          return next;
        });

        moveCursor(r, c, game.direction, true);
        if (game.checkIsComplete(newGrid)) {
          game.handleSolve();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game, puzzle, moveCursor, handleNextClue]);
}
