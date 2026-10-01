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
