"use client";

import React from 'react';
import Link from 'next/link';

export default function ArchiveSelector() {
  const archiveDates = React.useMemo(() => {
    const dates = [{ date: "Today", href: "/" }];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({
        date: label,
        href: `/daily/${dateStr}`,
      });
    }
    return dates;
  }, []);
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
          {archiveDates.map((item, index) => (
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
