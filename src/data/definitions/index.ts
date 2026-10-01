export interface WordDefinition {
  word: string;
  clue: string;
}

import words3 from './words3.json';
import words4 from './words4.json';
import words5 from './words5.json';

export const DEFINITIONS_BY_LENGTH: Record<number, WordDefinition[]> = {
  3: words3 as WordDefinition[],
  4: words4 as WordDefinition[],
  5: words5 as WordDefinition[],
};

export const ALL_DEFINITIONS: WordDefinition[] = [
  ...(words3 as WordDefinition[]),
  ...(words4 as WordDefinition[]),
  ...(words5 as WordDefinition[]),
];

const definitionMap = new Map<string, string>();
for (const def of ALL_DEFINITIONS) {
  definitionMap.set(def.word.toUpperCase(), def.clue);
}

export function getClueForWord(word: string): string | undefined {
  return definitionMap.get(word.toUpperCase());
}
