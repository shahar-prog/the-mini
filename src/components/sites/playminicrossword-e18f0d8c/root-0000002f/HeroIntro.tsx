import React from 'react';
import Link from 'next/link';

const HeroIntro: React.FC = () => {
  const quickLinks = [
    { name: 'Daily puzzle', href: '/' },
    { name: 'Unlimited', href: '/unlimited' },
    { name: 'Archive', href: '/archive' },
    { name: 'How to Play', href: '#how-to-play' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <section className="relative overflow-hidden py-20 px-4">
      {/* Background Overlays */}
      <div
        className="absolute inset-0 -z-10 opacity-90 pointer-events-none"
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
          className="text-[36px] font-medium text-[#2c221b] mb-4 leading-[40px] tracking-[-0.9px]"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          Mini Crossword
        </h1>

        {/* Description */}
        <p
          className="text-[16px] text-[#6e5f53] mb-8 max-w-2xl"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Today’s 5×5 plus the last 90 days in the archive: free, no subscription, no signup.
        </p>

        {/* Quick Links */}
        <div
          className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-[14px] font-medium text-[#6e5f53]"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {quickLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <Link
                href={link.href}
                className="hover:text-[#2f251e] transition-colors"
              >
                {link.name}
              </Link>
              {index < quickLinks.length - 1 && (
                <span className="text-[#c3b7ac]">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <span
            className="text-[11.2px] uppercase tracking-widest text-[#938476]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            MORE BELOW
          </span>
          <div className="w-[1px] h-10 bg-[#e3dbd3]" />
        </div>
      </div>
    </section>
  );
};

export default HeroIntro;
