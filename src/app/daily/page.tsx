import React from 'react';
import CrosswordPageView from '@/components/crossword/CrosswordPageView';
import { generatePuzzleFromSeed, getDailySeed } from '@/lib/puzzle-gen';

export default function DailyPuzzlePage() {
  const seed = getDailySeed();
  const puzzle = generatePuzzleFromSeed(seed, 'daily');

  return (
    <CrosswordPageView seedParam={undefined} />
  );
}
