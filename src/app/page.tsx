"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import GlobalHeader from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/GlobalHeader';
import HeroIntro from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/HeroIntro';
import Footer from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/Footer';
import { Button } from '@/components/ui/button';
import { Shuffle, Calendar } from 'lucide-react';
import { generateRandomSeed } from '@/lib/crossword/generator';

export default function LandingPage() {
  const router = useRouter();

  const handlePlayDaily = () => {
    router.push('/daily');
  };

  const handlePlayRandom = () => {
    const randomSeed = generateRandomSeed();
    router.push(`/${randomSeed}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
        <main className="flex flex-col items-center justify-center text-center">
          <HeroIntro />
          <div className="max-w-4xl mx-auto px-4 pb-10 pt-0 flex flex-col items-center gap-12 text-center">
            <div className="space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground">
                Ready for a challenge?
              </h2>
              <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
                Test your vocabulary with our 5x5 mini crosswords.
                Choose the daily challenge or generate a random puzzle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <Button
                onClick={handlePlayDaily}
                className="flex-1 h-14 text-lg font-semibold bg-[#F17127] hover:bg-[#D95F1A] text-white rounded-xl transition-all hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Play Daily
              </Button>
              <Button
                onClick={handlePlayRandom}
                className="flex-1 h-14 text-lg font-semibold bg-white border-2 border-[#F17127] text-[#F17127] hover:bg-orange-50 rounded-xl transition-all hover:scale-105"
              >
                <Shuffle className="mr-2 h-5 w-5" />
                Play Random
              </Button>
            </div>
          </div>
        </main>
      </div>
      <GlobalHeader />
    </div>
  );
}
