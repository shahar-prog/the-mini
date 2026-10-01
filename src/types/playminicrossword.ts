export interface PuzzleDefinition {
  id: string;
  grid: string[][];
  clues: {
    across: { row: number; col: number; answer: string; clue: string }[];
    down: { row: number; col: number; answer: string; clue: string }[];
  };
}

export interface CrosswordPuzzle {
  id: string;
  seed: string;
  title: string;
  date: string;
  mode: 'daily' | 'unlimited';
  size: 'classic' | 'intermediate' | 'advanced';
  width: number;
  height: number;
  grid: string[][];
  initialGrid: string[][];
  cellNumbers: (number | null)[][];
  clues: {
    across: Clue[];
    down: Clue[];
  };
}

export interface Clue {
  number: number;
  direction: 'across' | 'down';
  text: string;
  answer: string;
  length: number;
  row: number;
  col: number;
}

export interface PageContent {
  hero: {
    title: string;
    description: string;
    links: { label: string; href: string }[];
  };
  howToPlay: {
    rules: { title: string; description: string }[];
    proTips: string[];
    mechanics: { label: string; description: string }[];
  };
  sizes: {
    label: string;
    dimensions: string;
    time: string;
  }[];
  about: {
    mainTitle: string;
    mainDescription: string;
    features: { label: string; description: string }[];
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}
