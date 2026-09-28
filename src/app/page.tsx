"use client";

import React, { useState } from 'react';
import GlobalHeader from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/GlobalHeader';
import HeroIntro from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/HeroIntro';
import PuzzleInterface from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/PuzzleInterface';
import OnboardingModal from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/OnboardingModal';
import ArchiveSelector from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/ArchiveSelector';
import HowToPlay from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/HowToPlay';
import PickYourSize from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/PickYourSize';
import AboutSection from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/AboutSection';
import FAQSection from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/FAQSection';
import Footer from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/Footer';

// Mock puzzle data to make the preview work
const MOCK_PUZZLE = {
  grid: [
    [' ', 'P', 'L', 'A', 'Y'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'X', ' '],
  ],
  clues: {
    across: [
      { number: 1, text: "Do-it-yourself, for short" },
    ],
    down: [
      { number: 1, text: "Tennis great Miss ___, or a common surname" },
      { number: 2, text: "Apple's all-in-one desktop computer" },
      { number: 3, text: "Yellow center of an egg" },
      { number: 4, text: "Opposed to" },
      { number: 5, text: "Fat used in cooking" },
    ],
  },
};

export default function PreviewPage() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />

      <main>
        <HeroIntro />

        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center gap-12">
          <section className="text-center mb-8">
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">Try the Puzzle</h2>
            <p className="font-sans text-muted-foreground">Experience the interaction model I've implemented.</p>
          </section>

          <PuzzleInterface puzzle={MOCK_PUZZLE} />
        </div>
      </main>

      <ArchiveSelector />
      <HowToPlay />
      <PickYourSize />
      <AboutSection />
      <FAQSection />
      <Footer />

      {showModal && (
        <OnboardingModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
