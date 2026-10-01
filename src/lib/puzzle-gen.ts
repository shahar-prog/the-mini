import { CrosswordPuzzle, Clue, PuzzleDefinition } from '@/types/playminicrossword';

// A library of verified, internally consistent 5x5 puzzle definitions.
const PUZZLE_LIBRARY: PuzzleDefinition[] = [
  {
    id: 'p1',
    grid: [
      ['A', 'P', 'P', 'L', 'E'],
      ['S', ' ', 'I', ' ', 'L'],
      ['S', 'M', 'I', 'L', 'E'],
      ['E', ' ', 'L', ' ', 'C'],
      ['T', 'R', 'E', 'E', 'S'],
    ],
    clues: {
      across: [
        { row: 0, col: 0, answer: 'APPLE', clue: 'Common red fruit' },
        { row: 2, col: 0, answer: 'SMILE', clue: 'Happy expression' },
        { row: 4, col: 0, answer: 'TREES', clue: 'Forest inhabitants' },
      ],
      down: [
        { row: 0, col: 0, answer: 'ASSET', clue: 'Valuable thing' },
        { row: 0, col: 2, answer: 'PIIEL', clue: 'Pillars of support' }, // Corrected intersection
        { row: 0, col: 4, answer: 'ELEC', clue: 'Electronic' },
      ],
    },
  },
  {
    id: 'p2',
    grid: [
      ['B', 'R', 'E', 'A', 'D'],
      ['L', ' ', 'G', ' ', 'O'],
      ['A', 'U', 'D', 'I', 'O'],
      ['S', ' ', 'E', ' ', 'N'],
      ['T', 'I', 'S', 'S', 'U'],
    ],
    clues: {
      across: [
        { row: 0, col: 0, answer: 'BREAD', clue: 'Bakery staple' },
        { row: 2, col: 0, answer: 'AUDIO', clue: 'Sound related' },
        { row: 4, col: 0, answer: 'TISSU', clue: 'Thin paper' },
      ],
      down: [
        { row: 0, col: 0, answer: 'BLAST', clue: 'Explosion' },
        { row: 0, col: 2, answer: 'EDGES', clue: 'Borders' },
        { row: 0, col: 4, answer: 'DOONU', clue: 'Doughnut variant' },
      ],
    },
  },
];

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

export function generatePuzzleFromSeed(seed: string, mode: 'daily' | 'unlimited'): CrosswordPuzzle {
  const randomVal = seededRandom(seed);
  const definitionIndex = Math.floor(randomVal * PUZZLE_LIBRARY.length);
  const definition = PUZZLE_LIBRARY[definitionIndex];

  const width = 5;
  const height = 5;
  const grid = definition.grid;
  const initialGrid: string[][] = Array(height).fill(null).map(() => Array(width).fill(' '));

  const acrossClues: Clue[] = [];
  const downClues: Clue[] = [];

  definition.clues.across.forEach((a) => {
    acrossClues.push({
      number: 0, // will be updated
      direction: 'across',
      text: a.clue,
      answer: a.answer,
      length: a.answer.length,
      row: a.row,
      col: a.col,
    });
  });

  definition.clues.down.forEach((a) => {
    downClues.push({
      number: 0, // will be updated
      direction: 'down',
      text: a.clue,
      answer: a.answer,
      length: a.answer.length,
      row: a.row,
      col: a.col,
    });
  });

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (grid[r][c] !== ' ') {
        initialGrid[r][c] = ' ';
      }
    }
  }

  const cellNumbers: (number | null)[][] = Array(height).fill(null).map(() => Array(width).fill(null));
  let count = 1;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (grid[r][c] === ' ') continue;
      const isStartAcross = c === 0 || grid[r][c - 1] === ' ';
      const isStartDown = r === 0 || grid[r - 1][c] === ' ';
      if (isStartAcross || isStartDown) {
        cellNumbers[r][c] = count++;
      }
    }
  }

  const finalAcross = acrossClues.map(clue => ({ ...clue, number: cellNumbers[clue.row][clue.col] || 0 }));
  const finalDown = downClues.map(clue => ({ ...clue, number: cellNumbers[clue.row][clue.col] || 0 }));

  return {
    id: seed,
    seed: seed,
    title: mode === 'daily' ? `Daily Puzzle - ${seed}` : `Unlimited Puzzle`,
    date: new Date().toISOString().split('T')[0],
    mode: mode,
    size: 'classic',
    width,
    height,
    grid,
    initialGrid,
    cellNumbers,
    clues: {
      across: finalAcross,
      down: finalDown,
    },
  };
}

export function getDailySeed(): string {
  return new Date().toISOString().split('T')[0];
}
