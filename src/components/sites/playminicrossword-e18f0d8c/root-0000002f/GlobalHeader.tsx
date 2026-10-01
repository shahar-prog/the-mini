"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "@/components/sites/playminicrossword-e18f0d8c/shared/icons";

const NAV_LINKS = [
  { label: "Daily", href: "/daily" },
  { label: "Archive", href: "/archive" },
  { label: "Unlimited", href: "/unlimited" },
];

export default function GlobalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-transparent">
      <div className="mx-auto max-w-[1152px] h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 group"
        >
          <span
            className="text-[16px] font-normal leading-[24px]"
            style={{
              fontFamily: "Outfit, sans-serif",
              color: "rgb(47, 37, 30)"
            }}
          >
            Mini Crossword
          </span>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "rgb(241, 113, 39)" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium transition-colors duration-200 leading-[20px] tracking-[-0.35px]"
              style={{
                fontFamily: "Outfit, sans-serif",
                color: "rgb(110, 95, 83)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgb(47, 37, 30)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgb(110, 95, 83)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" style={{ color: "rgb(44, 34, 27)" }} />
          ) : (
            <Menu className="w-6 h-6" style={{ color: "rgb(44, 34, 27)" }} />
          )}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 md:hidden">
          <nav className="flex flex-col p-4 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium py-2"
                style={{
                  fontFamily: "Outfit, sans-serif",
                  color: "rgb(110, 95, 83)"
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
