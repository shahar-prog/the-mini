import React from 'react';
import Link from 'next/link';
import GlobalHeader from '@/components/sites/playminicrossword-e18f0d8c/root-0000002f/GlobalHeader';
import { Calendar, Play, ArrowLeft } from 'lucide-react';

export default function ArchivePage() {
  // Generate the last 90 days
  const archiveDays = [];
  const today = new Date();

  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const formattedDate = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });

    archiveDays.push({
      dateStr,
      formattedDate,
      dayOfWeek,
      isToday: i === 0,
      href: i === 0 ? '/daily' : `/daily/${dateStr}`,
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative">
      <GlobalHeader />

      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
        {/* Back Link & Title */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Today&apos;s Puzzle
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-6 h-6 text-[#F17127]" />
            <h1 className="font-serif text-3xl font-medium text-[#2C221B]">
              Mini Crossword Archive
            </h1>
          </div>
          <p className="text-sm text-[#6E5F53]">
            Browse and play any of the last 90 daily puzzles. Every single day has its own unique, deterministic mini crossword.
          </p>
        </div>

        {/* Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {archiveDays.map((item) => (
            <Link
              key={item.dateStr}
              href={item.href}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E3DBD5] hover:border-[#F17127] hover:bg-white transition-all shadow-xs group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  {item.dayOfWeek} {item.isToday && '• TODAY'}
                </span>
                <span className="text-sm font-semibold text-[#2C221B] group-hover:text-[#F17127] transition-colors">
                  {item.formattedDate}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-neutral-200 group-hover:bg-[#F17127] group-hover:text-white flex items-center justify-center transition-colors">
                <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
