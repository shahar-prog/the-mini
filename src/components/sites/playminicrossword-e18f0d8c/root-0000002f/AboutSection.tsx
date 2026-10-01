"use client";

import React from 'react';

export default function AboutSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-10">
          <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[1.5px] block mb-2">
            ABOUT THE PUZZLE
          </span>
          <h2 className="font-serif text-3xl font-medium text-foreground mb-6">
            A Free Mini Crossword to Play Online
          </h2>
          <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
            <p>
              Mini Crossword is a free 5×5 crossword you play right here in your browser. A new puzzle goes live every day at midnight Eastern Time: ten clues, five Across and five Down, sized for a one-to-three-minute break. There&apos;s nothing to install and no account to make, and your letters save in your browser as you type.
            </p>
            <p>
              Want a longer solve? Every day also also brings a 6×6 with 12 clues and a 7×7 with 14 or 16, and Unlimited mode serves one mini after another from our library in all three sizes. If a clue has you stuck, each daily 5×5 has a hints page with three hints per clue, plus an answer key that reveals one answer at a time.
            </p>
            <p>
              Every puzzle here is our own, made by our own puzzle generator, and the site isn&apos;t affiliated with any newspaper. Missed a day? The archive keeps the last 90 days of daily puzzles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { tag: "FREE", title: "No subscription, ever", desc: "Today’s puzzle, the 90-day archive, Unlimited, hints, and answers — all free. No signup, no paywall, no account." },
            { tag: "DAILY", title: "A fresh 5×5 every morning", desc: "New puzzle at midnight Eastern Time. Yesterday slides into the archive; tomorrow’s grid is already queued." },
            { tag: "ARCHIVE", title: "90 days, replayable", desc: "The last 90 days of daily 5×5s, each with its own page, hint page, and answers page." },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">
                {feature.tag}
              </span>
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
