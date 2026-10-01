import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";

const outfitSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const frauncesSerif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Crossword | Play Free Daily Crossword Online",
  description: "A free 5x5 crossword you can play right here in your browser. New puzzles every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfitSans.variable} ${frauncesSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <div
          className="fixed inset-0 -z-10 opacity-90 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(70% 60% at 50% 0%, rgba(241, 113, 39, 0.1), rgba(0, 0, 0, 0) 70%),
              radial-gradient(50% 50% at 80% 20%, rgba(37, 101, 228, 0.08), rgba(0, 0, 0, 0) 70%)
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
