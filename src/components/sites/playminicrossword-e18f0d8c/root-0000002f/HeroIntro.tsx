import React from 'react';
import Link from 'next/link';

const HeroIntro: React.FC = () => {
  const quickLinks = [
    { name: 'Daily puzzle', href: '/' },
    { name: 'Unlimited', href: '/unlimited' },
    { name: 'Archive', href: '/archive' },
  ];

  return (
    <section className="relative overflow-hidden pt-[15px] pb-[15px] px-4">
      {/* Background Overlays - Moved to a fixed container in the layout or handled via a separate component usually,
          but for now we keep it here and ensure the parent has the right positioning.
          To make it start at the absolute top, we should probably move this to the Page level. */}
      <div
        className="fixed inset-0 -z-10 opacity-90 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(70% 60% at 50% 0%, rgba(241, 113, 39, 0.1), rgba(0, 0, 0, 0) 70%),
            radial-gradient(50% 50% at 80% 20%, rgba(37, 101, 228, 0.08), rgba(0, 0, 0, 0) 70%)
          `,
        }}
      />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Title */}
        <h1
          className="text-[36px] font-medium text-[#2c221b] py-[5px] mb-0 leading-[40px] tracking-[-0.9px]"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          Mini Crossword
        </h1>
      </div>
    </section>
  );
};

export default HeroIntro;
