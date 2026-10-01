import { BOARD_TEMPLATES, BoardTemplate } from '@/data/boards';
import { DEFINITIONS_BY_LENGTH, WordDefinition } from '@/data/definitions';
import { CrosswordPuzzle, Clue } from '@/types/playminicrossword';

// Build global letter index for fast candidate lookups
const letterIndex = new Map<string, WordDefinition[]>();
for (const [lenStr, list] of Object.entries(DEFINITIONS_BY_LENGTH)) {
  const len = parseInt(lenStr);
  for (const def of list) {
    const w = def.word.toUpperCase();
    for (let i = 0; i < len; i++) {
      const key = `${len}:${i}:${w[i]}`;
      if (!letterIndex.has(key)) {
        letterIndex.set(key, []);
      }
      letterIndex.get(key)!.push(def);
    }
  }
}

export class SeededRNG {
  private s: number;

  constructor(seedStr: string) {
    this.s = SeededRNG.hashString(seedStr);
  }

  static hashString(str: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    }
    return h >>> 0;
  }

  next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
}

export function generateRandomSeed(length: number = 8): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface SlotCell {
  row: number;
  col: number;
  pos: number;
}

interface InternalSlot {
  id: string;
  direction: 'across' | 'down';
  number: number;
  row: number;
  col: number;
  length: number;
  cells: SlotCell[];
}

interface PreparedBoard {
  template: BoardTemplate;
  slots: InternalSlot[];
  cellNumbers: (number | null)[][];
}

function prepareBoard(template: BoardTemplate): PreparedBoard {
  const { width, height, grid } = template;
  const cellNumbers: (number | null)[][] = Array.from({ length: height }, () =>
    Array(width).fill(null)
  );

  let clueCount = 0;
  const slots: InternalSlot[] = [];

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (grid[r][c] === '#') continue;

      const isStartAcross =
        (c === 0 || grid[r][c - 1] === '#') &&
        c + 1 < width &&
        grid[r][c + 1] !== '#';

      const isStartDown =
        (r === 0 || grid[r - 1][c] === '#') &&
        r + 1 < height &&
        grid[r + 1][c] !== '#';

      if (isStartAcross || isStartDown) {
        clueCount++;
        cellNumbers[r][c] = clueCount;

        if (isStartAcross) {
          const cells: SlotCell[] = [];
          let curC = c;
          let pos = 0;
          while (curC < width && grid[r][curC] !== '#') {
            cells.push({ row: r, col: curC, pos });
            curC++;
            pos++;
          }
          if (cells.length >= 3) {
            slots.push({
              id: `A${clueCount}`,
              direction: 'across',
              number: clueCount,
              row: r,
              col: c,
              length: cells.length,
              cells,
            });
          }
        }

        if (isStartDown) {
          const cells: SlotCell[] = [];
          let curR = r;
          let pos = 0;
          while (curR < height && grid[curR][c] !== '#') {
            cells.push({ row: curR, col: c, pos });
            curR++;
            pos++;
          }
          if (cells.length >= 3) {
            slots.push({
              id: `D${clueCount}`,
              direction: 'down',
              number: clueCount,
              row: r,
              col: c,
              length: cells.length,
              cells,
            });
          }
        }
      }
    }
  }

  return { template, slots, cellNumbers };
}

function solveCrosswordMRV(
  board: PreparedBoard,
  rng: SeededRNG,
  maxSteps: number = 2000
): Map<string, WordDefinition> | null {
  const { slots } = board;
  const usedWords = new Set<string>();
  const boardLetters = new Map<string, string>(); // "row,col" -> char
  const solution = new Map<string, WordDefinition>();
  let steps = 0;

  function getCandidates(slot: InternalSlot): WordDefinition[] {
    const placed: { pos: number; letter: string }[] = [];
    for (const cell of slot.cells) {
      const key = `${cell.row},${cell.col}`;
      if (boardLetters.has(key)) {
        placed.push({ pos: cell.pos, letter: boardLetters.get(key)! });
      }
    }

    if (placed.length === 0) {
      const allForLen = DEFINITIONS_BY_LENGTH[slot.length] || [];
      return allForLen.filter((d) => !usedWords.has(d.word.toUpperCase()));
    }

    // Sort constraints by most restrictive index
    placed.sort((a, b) => {
      const countA = letterIndex.get(`${slot.length}:${a.pos}:${a.letter}`)?.length || 0;
      const countB = letterIndex.get(`${slot.length}:${b.pos}:${b.letter}`)?.length || 0;
      return countA - countB;
    });

    const firstKey = `${slot.length}:${placed[0].pos}:${placed[0].letter}`;
    const initialList = letterIndex.get(firstKey) || [];

    return initialList.filter((d) => {
      const w = d.word.toUpperCase();
      if (usedWords.has(w)) return false;
      for (let i = 1; i < placed.length; i++) {
        if (w[placed[i].pos] !== placed[i].letter) return false;
      }
      return true;
    });
  }

  function backtrack(): boolean {
    steps++;
    if (steps > maxSteps) return false;

    // Minimum Remaining Values (MRV): find slot with fewest matching candidates
    let bestSlot: InternalSlot | null = null;
    let bestCandidates: WordDefinition[] | null = null;
    let minCandidateCount = Infinity;

    for (const slot of slots) {
      if (solution.has(slot.id)) continue;
      const candidates = getCandidates(slot);
      if (candidates.length === 0) return false; // Dead end

      if (candidates.length < minCandidateCount) {
        minCandidateCount = candidates.length;
        bestSlot = slot;
        bestCandidates = candidates;
        if (minCandidateCount === 1) break; // Forced move
      }
    }

    // All slots successfully filled!
    if (!bestSlot || !bestCandidates) return true;

    const shuffled = rng.shuffle(bestCandidates);
    for (const def of shuffled) {
      const w = def.word.toUpperCase();
      const placedKeys: string[] = [];

      for (const cell of bestSlot.cells) {
        const key = `${cell.row},${cell.col}`;
        if (!boardLetters.has(key)) {
          boardLetters.set(key, w[cell.pos]);
          placedKeys.push(key);
        }
      }
      usedWords.add(w);
      solution.set(bestSlot.id, def);

      if (backtrack()) return true;

      // Undo
      solution.delete(bestSlot.id);
      usedWords.delete(w);
      for (const key of placedKeys) {
        boardLetters.delete(key);
      }
    }

    return false;
  }

  const success = backtrack();
  return success ? solution : null;
}

export function generatePuzzle(
  seed: string,
  options?: {
    mode?: 'daily' | 'unlimited';
    date?: string;
  }
): CrosswordPuzzle {
  const mode = options?.mode || (seed.startsWith('daily-') ? 'daily' : 'unlimited');

  let selectedBoard: PreparedBoard | null = null;
  let wordSolution: Map<string, WordDefinition> | null = null;

  // Attempt up to 5 deterministic sub-seeds to ensure 100% guarantee of solving
  for (let attempt = 0; attempt < 5; attempt++) {
    const subSeed = attempt === 0 ? seed : `${seed}#${attempt}`;
    const rng = new SeededRNG(subSeed);
    const shuffledTemplates = rng.shuffle(BOARD_TEMPLATES);

    for (const template of shuffledTemplates) {
      const prepared = prepareBoard(template);
      wordSolution = solveCrosswordMRV(prepared, rng, 1500);
      if (wordSolution) {
        selectedBoard = prepared;
        break;
      }
    }
    if (selectedBoard && wordSolution) break;
  }

  if (!selectedBoard || !wordSolution) {
    throw new Error(`Failed to generate valid crossword for seed ${seed}`);
  }

  const { template, slots, cellNumbers } = selectedBoard;
  const { width, height } = template;

  // Build solution grid of letters and initial blank grid
  const grid: string[][] = Array.from({ length: height }, () => Array(width).fill(' '));
  const initialGrid: string[][] = Array.from({ length: height }, () => Array(width).fill(' '));

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (template.grid[r][c] !== '#') {
        initialGrid[r][c] = '';
      }
    }
  }

  const acrossClues: Clue[] = [];
  const downClues: Clue[] = [];

  for (const slot of slots) {
    const def = wordSolution.get(slot.id)!;
    const word = def.word.toUpperCase();

    // Stamp word into grid
    for (let i = 0; i < slot.cells.length; i++) {
      const { row, col } = slot.cells[i];
      grid[row][col] = word[i];
    }

    const clueObj: Clue = {
      number: slot.number,
      direction: slot.direction,
      text: def.clue,
      answer: word,
      length: slot.length,
      row: slot.row,
      col: slot.col,
    };

    if (slot.direction === 'across') {
      acrossClues.push(clueObj);
    } else {
      downClues.push(clueObj);
    }
  }

  // Sort clues by number
  acrossClues.sort((a, b) => a.number - b.number);
  downClues.sort((a, b) => a.number - b.number);

  const formattedDate = options?.date || getFormattedDateFromSeed(seed, mode);

  return {
    id: seed,
    seed,
    title: mode === 'daily' ? `Daily Mini — ${formattedDate}` : `Mini Crossword #${seed}`,
    date: formattedDate,
    mode,
    size: 'classic',
    width,
    height,
    grid,
    initialGrid,
    cellNumbers,
    clues: {
      across: acrossClues,
      down: downClues,
    },
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailySeed(dateStr?: string): string {
  const d = dateStr || getTodayDateString();
  return `daily-${d}`;
}

function getFormattedDateFromSeed(seed: string, mode: 'daily' | 'unlimited'): string {
  if (mode === 'daily') {
    const match = seed.match(/daily-(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
