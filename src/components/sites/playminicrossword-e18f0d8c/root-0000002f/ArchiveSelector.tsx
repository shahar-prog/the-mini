"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const ARCHIVE_DATES = [
  { date: "Today", href: "/daily" },
  { date: "Sep 27", href: "/daily/2026-09-27" },
  { date: "Sep 26", href: "/daily/2026-09-26" },
  { date: "Sep 25", href: "/daily/2026-09-25" },
  { date: "Sep 24", href: "/daily/2026-09-24" },
  { date: "Sep 23", href: "/daily/2026-09-23" },
  { date: "Sep 22", href: "/daily/2026-09-22" },
  { date: "Sep 21", href: "/daily/2026-09-21" },
  { date: "Sep 20", href: "/daily/2026-09-20" },
  { date: "Sep 19", href: "/daily/2026-09-19" },
  { date: "Sep 18", href: "/daily/2026-09-18" },
  { date: "Sep 17", href: "/daily/2026-09-17" },
  { date: "Sep 16", href: "/daily/2026-09-16" },
  { date: "Sep 15", href: "/daily/2026-09-15" },
  { date: "Sep 14", href: "/daily/2026-09-14" },
];

export default function ArchiveSelector() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Recent from the archive
          </h2>
          <Link
            href="/archive"
            className="font-sans text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Full puzzle archive →
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {ARCHIVE_DATES.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="whitespace-nowrap bg-background text-[#54453B] px-3.5 py-1.5 rounded-full text-sm font-medium border border-[#E3DBD5] hover:bg-[#E3DBD5] hover:text-foreground transition-all duration-200"
            >
              {item.date}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
