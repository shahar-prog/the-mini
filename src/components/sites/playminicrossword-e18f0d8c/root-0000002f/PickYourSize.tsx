"use client";

import React from 'react';
import Link from 'next/link';

const SIZES = [
  { name: "Classic", dims: "5 × 5", time: "1–3 min solves", href: "/daily" },
  { name: "Intermediate", dims: "6 × 6", time: "3–6 min solves", href: "/puzzles/6x6" },
  { name: "Advanced", dims: "7 × 7", time: "5–10 min solves", href: "/puzzles/7x7" },
];

export default function PickYourSize() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="font-serif text-xl font-medium text-foreground mb-6">Pick your size</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SIZES.map((size, i) => (
            <Link
              key={i}
              href={size.href}
              className="group block p-6 bg-white border border-[#E2DBD5] rounded-xl transition-all hover:border-primary hover:shadow-sm"
            >
              <div className="flex flex-col">
                <span className="font-sans text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {size.name}
                </span>
                <span className="font-serif text-xl font-medium text-foreground my-1">
                  {size.dims}
                </span>
                <span className="font-sans text-xs text-muted-foreground">
                  {size.time}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
