"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from '@/components/sites/playminicrossword-e18f0d8c/shared/icons';
import TutorialGrid from './TutorialGrid';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: "A bite-size crossword, daily",
    text: "Solve the 5×5 mini grid. Across and Down answers share letters where they cross.",
  },
  {
    title: "Click a clue, then type",
    text: "Type to fill — Tab and arrows move",
  },
  {
    title: "Crossings confirm guesses",
    text: "A letter you already know from one answer narrows down the crossing answer fast.",
  },
  {
    title: "Stuck? Check or Reveal",
    text: "All in the toolbar above the grid",
  }
];

export default function OnboardingModal({
  isOpen,
  onClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < TUTORIAL_STEPS.length) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[4px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[448px] bg-[#FAF8F4] border border-[#E2DBD5] rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <h2 className="font-['Outfit'] text-[20px] font-semibold text-[#121212]">
            {TUTORIAL_STEPS[step - 1].title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#6D5F55] hover:text-black transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="h-[176px] border border-[#E2DBD5] rounded-lg overflow-hidden bg-[#FAF8F4] p-1 flex items-center justify-center">
            <TutorialGrid step={step} />
          </div>

          <p className="text-[14px] text-[#6D5F55] leading-relaxed">
            {TUTORIAL_STEPS[step - 1].text}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-medium text-[#6D5F55]">
              {step}/{TUTORIAL_STEPS.length}
            </span>

            <div className="flex gap-2">
              {TUTORIAL_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i + 1 === step ? "bg-[#2565E4]" : "bg-[#E2DBD5]"
                  )}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="bg-[#2565E4] text-white px-6 h-[36px] rounded-lg font-medium hover:bg-[#1e54c6] transition-colors"
          >
            {step === TUTORIAL_STEPS.length ? "Start Playing" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
