"use client";

import React from 'react';
import Link from 'next/link';

const LOGIC_PUZZLES = [
  { name: "Queens", desc: "Region logic, daily + 1,500 puzzles", url: "https://www.playqueensgame.com/" },
  { name: "Wend", desc: "Trace four hidden words", url: "https://www.playwendgame.com/" },
  { name: "Patches", desc: "Region-stitching puzzle", url: "https://www.patchesgame.org/" },
  { name: "Tango", desc: "No 3-in-a-row pattern", url: "https://www.tango-unlimited.com/" },
  { name: "Zip", desc: "Path-drawing puzzle", url: "https://www.zipgameunlimited.com/" },
  { name: "Strands", desc: "Themed word search", url: "https://www.playstrandsnyt.com/" },
  { name: "Mini Sudoku", desc: "Compact sudoku", url: "https://www.playminisudoku.com/" },
  { name: "Mini Crossword", desc: "A fast crossword every day", url: "/" },
];

const NAV_COLUMNS = [
  {
    title: "PLAY",
    links: [
      { label: "Daily puzzle", href: "/daily" },
      { label: "Unlimited", href: "/unlimited" },
      { label: "Archive", href: "/archive" },
      { label: "Puzzle sizes", href: "/puzzles" },
      { label: "Printable", href: "/printable" },
    ]
  },
  {
    title: "SOLVE",
    links: [
      { label: "Hints", href: "/hints" },
      { label: "Answers", href: "/answers" },
    ]
  },
  {
    title: "LEARN",
    links: [
      { label: "How to Play", href: "/how-to-play" },
      { label: "Solving Tips", href: "/tips" },
      { label: "What Is a Mini Crossword?", href: "/what-is-a-mini-crossword" },
      { label: "FAQ", href: "/faq" },
    ]
  },
  {
    title: "ABOUT",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ]
  }
];

export default function Footer() {
  return (
    <footer className="py-16 bg-background border-t border-[#E2DBD5]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Logic Puzzles Grid */}
        <div className="mb-16">
          <h3 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[1.5px] mb-6">
            MORE LOGIC PUZZLES
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {LOGIC_PUZZLES.map((puzzle, i) => (
              <a
                key={i}
                href={puzzle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 hover:text-primary transition-colors group"
              >
                <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {puzzle.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {puzzle.desc}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {NAV_COLUMNS.map((col, i) => (
            <div key={i} className="flex flex-col gap-3">
              <h3 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-[1.5px] mb-2">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright Row */}
        <div className="pt-8 border-t border-[#E2DBD5] flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© 2026 Mini Crossword.</span>
            <span>Always free.</span>
          </div>
          <div className="flex gap-3 uppercase tracking-wider">
            <Link href="/daily" className="hover:text-foreground transition-colors">Daily</Link>
            <span>·</span>
            <Link href="/archive" className="hover:text-foreground transition-colors">Archive</Link>
            <span>·</span>
            <Link href="/hints" className="hover:text-foreground transition-colors">Hints</Link>
            <span>·</span>
            <Link href="/answers" className="hover:text-foreground transition-colors">Answers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
