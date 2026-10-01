export interface BoardTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  grid: string[];
}

import classicOpen from './classic-open.json';
import boardCornersDiag from './board-corners-diag.json';
import boardCornersAlt from './board-corners-alt.json';
import boardFourCorners from './board-four-corners.json';
import boardCenterDiag from './board-center-diag.json';
import boardTopBottom from './board-top-bottom.json';

export const BOARD_TEMPLATES: BoardTemplate[] = [
  classicOpen as BoardTemplate,
  boardCornersDiag as BoardTemplate,
  boardCornersAlt as BoardTemplate,
  boardFourCorners as BoardTemplate,
  boardCenterDiag as BoardTemplate,
  boardTopBottom as BoardTemplate,
];

export function getBoardTemplateById(id: string): BoardTemplate | undefined {
  return BOARD_TEMPLATES.find((b) => b.id === id);
}
