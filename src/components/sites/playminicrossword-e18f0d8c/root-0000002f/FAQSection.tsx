"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from '@/components/sites/playminicrossword-e18f0d8c/shared/icons';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: "Is Mini Crossword affiliated with any newspaper?",
    a: "No. Mini Crossword is an independent daily puzzle site. It is not affiliated with The New York Times or any other newspaper or publisher. We make and publish our own free 5×5 crossword every day and keep the last 90 days in a free archive."
  },
  {
    q: "Does it cost anything?",
    a: "No. The daily puzzle, the archive, Unlimited mode, the hints, the answers and the printable grids are all free. There's no subscription, no account to create, and no signup wall anywhere on the site."
  },
  {
    q: "How do I play a mini crossword?",
    a: "Fill the grid so every Across answer (left to right) and every Down answer (top to bottom) matches its clue. Click or tap a square, type a letter, and the cursor moves on through the word. Letters where an Across and a Down answer cross are shared, so each one you place helps with two clues. The full guide at /how-to-play walks through a real puzzle step by step."
  },
  {
    q: "When does a new puzzle come out?",
    a: "Every day at midnight Eastern Time. At that moment today's puzzle becomes yesterday's archive entry and a fresh 5×5 takes its place, along with new 6×6 and 7×7 grids and a new hints page."
  },
  {
    q: "Can I play past puzzles?",
    a: "Yes. The archive at /archive covers the last 90 days. Every date in it has its own puzzle page, hints page, and answers page, so you can catch up on a missed week or replay an old favorite. Unlimited mode reaches further back, into our whole library."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[1.5px] block mb-2">
            COMMON QUESTIONS
          </span>
          <h2 className="font-serif text-3xl font-medium text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col border-t border-[#E2DBD5]">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-[#E2DBD5]">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-5 flex items-center justify-between text-left font-sans text-base font-medium text-foreground hover:text-primary transition-colors group"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200 ease-in-out",
                  openIndex === i ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0"
                )}
              >
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/faq"
          className="block text-center mt-8 font-sans text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          See all 16 questions in the FAQ
        </Link>
      </div>
    </section>
  );
}
