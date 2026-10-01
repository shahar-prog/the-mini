"use client";

import React from 'react';
import PuzzleInterface from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/PuzzleInterface';
import GlobalHeader from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/GlobalHeader';
import Footer from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/Footer';
import { generatePuzzleFromSeed, getDailySeed } from '@/lib/puzzle-gen';

export default function DailyPuzzlePage() {
  const seed = getDailySeed();
  const puzzle = generatePuzzleFromSeed(seed, 'daily');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-5xl px-4">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-medium mb-2">Daily Mini Crossword</h1>
            <p className="text-muted-foreground">{seed}</p>
          </div>
          <PuzzleInterface puzzle={puzzle} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
