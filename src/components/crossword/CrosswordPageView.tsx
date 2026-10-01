"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlobalHeader from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/GlobalHeader';
import HeroIntro from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/HeroIntro';
import CrosswordGame from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/CrosswordGame';
import OnboardingModal from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/OnboardingModal';
import ArchiveSelector from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/ArchiveSelector';
import HowToPlay from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/HowToPlay';
import PickYourSize from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/PickYourSize';
import AboutSection from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/AboutSection';
import FAQSection from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/FAQSection';
import Footer from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/Footer';
import {
  generatePuzzle,
  generateRandomSeed,
  getDailySeed,
  getTodayDateString,
} from '@/lib/crossword/generator';
import { Calendar, Shuffle } from 'lucide-react';

interface CrosswordPageViewProps {
  seedParam?: string;
}

export default function CrosswordPageView({
  seedParam,
}: CrosswordPageViewProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Check if first-time visitor for onboarding modal
  useEffect(() => {
    const hasSeen = localStorage.getItem('has_seen_onboarding');
    if (!hasSeen) {
      const timer = setTimeout(() => setShowModal(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem('has_seen_onboarding', 'true');
  };

  // Determine mode and actual seed
  const { mode, actualSeed, dateStr } = useMemo(() => {
    if (!seedParam) {
      // Default: Today's Daily
      const today = getTodayDateString();
      return {
        mode: 'daily' as const,
        actualSeed: getDailySeed(today),
        dateStr: today,
      };
    }

    // Check if seedParam is a date (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(seedParam)) {
      return {
        mode: 'daily' as const,
        actualSeed: getDailySeed(seedParam),
        dateStr: seedParam,
      };
    }

    // Otherwise it's a random or custom seed
    return {
      mode: 'unlimited' as const,
      actualSeed: seedParam,
      dateStr: undefined,
    };
  }, [seedParam]);

  // Generate deterministic puzzle
  const puzzle = useMemo(() => {
    return generatePuzzle(actualSeed, {
      mode,
      date: dateStr,
    });
  }, [actualSeed, mode, dateStr]);

  const handleNewRandomPuzzle = () => {
    const newSeed = generateRandomSeed();
    router.push(`/${newSeed}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />

      <main>
        <HeroIntro />

        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
          {/* Puzzle Title Banner */}
          <div className="w-full text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E3DBD5] text-xs font-semibold text-[#6E5F53] mb-3">
              {mode === 'daily' ? (
                <>
                  <Calendar className="w-3.5 h-3.5 text-[#F17127]" />
                  <span>Daily Challenge • {puzzle.date}</span>
                </>
              ) : (
                <>
                  <Shuffle className="w-3.5 h-3.5 text-[#2565E4]" />
                  <span>Unlimited Random Puzzle • #{puzzle.seed}</span>
                </>
              )}
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#2C221B]">
              {mode === 'daily' ? "Today's Mini Crossword" : "Unlimited Mini Crossword"}
            </h2>
            <p className="font-sans text-sm text-[#6E5F53] mt-1">
              Solve the 5×5 grid in under a minute and share your score!
            </p>
          </div>

          {/* Interactive Playable Crossword */}
          <CrosswordGame
            key={puzzle.id}
            puzzle={puzzle}
            onNewRandomPuzzle={handleNewRandomPuzzle}
          />
        </div>
      </main>

      <ArchiveSelector />
      <div id="how-to-play">
        <HowToPlay />
      </div>

      {showModal && (
        <OnboardingModal
          isOpen={showModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
