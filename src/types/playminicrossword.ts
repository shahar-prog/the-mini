export interface CrosswordPuzzle {
  id: string;
  date: string;
  size: 'classic' | 'intermediate' | 'advanced';
  grid: string[][];
  clues: {
    across: Clue[];
    down: Clue[];
  };
}

export interface Clue {
  number: number;
  text: string;
  answer: string;
  length: number;
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
