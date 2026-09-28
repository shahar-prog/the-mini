"use client";

import React from 'react';

export default function HowToPlay() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-10">
          <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[1.5px] block mb-2">
            THE BASICS
          </span>
          <h2 className="font-serif text-3xl font-medium text-foreground mb-4">
            How to Play Mini Crossword
          </h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-[600px]">
            Master the grid in two minutes. Read the five rules, glance at the tips, and jump back to the puzzle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Five Rules */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xl font-medium text-foreground mb-2">Five rules</h3>
            <ol className="space-y-3 text-sm text-foreground">
              {[
                "Click a clue number or any cell to start",
                "Type letters — Tab or arrow keys move between cells",
                "Crossing letters help confirm your guesses",
                "Check, Reveal and Clear are always there if you get stuck",
                "Come back tomorrow for a fresh daily puzzle"
              ].map((rule, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-bold opacity-50">{i + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Pro Tips */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xl font-medium text-foreground mb-2">Pro tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Start with the shortest answers — fewest possible fills.",
                "Use crossing letters aggressively — a known letter narrows the answer fast.",
                "Clues in quotes usually want a quote or idiom.",
                "If a clue starts with \"Like…\" the answer is usually an adjective.",
                "Learn the staples: ASAP, OREO, AREA, ALOE and EEL all turn up in our 5×5s."
              ].map((tip, i) => (
                <li key={i} className="relative pl-2 before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* How Clues Work */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xl font-medium text-foreground mb-2">How clues work</h3>
            <div className="space-y-3 text-sm text-foreground">
              <div className="flex gap-2">
                <span className="font-bold">Across</span>
                <span className="text-muted-foreground">· left to right</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold">Down</span>
                <span className="text-muted-foreground">· top to bottom</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Cells where across and down answers cross share the same letter — use that constraint to confirm guesses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
