import { GRID_SIZE, WORD_LIST } from '../constants';
import { GridCell, PlacedWord, WordConfig } from '../types';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Directions: [rowDelta, colDelta]
const DIRECTIONS = [
  [0, 1],   // Horizontal Right
  [1, 0],   // Vertical Down
  [1, 1],   // Diagonal Down-Right
  [1, -1],  // Diagonal Down-Left
];

function isValidPosition(
  board: string[][], 
  word: string, 
  row: number, 
  col: number, 
  [dRow, dCol]: number[]
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = row + i * dRow;
    const c = col + i * dCol;

    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    if (board[r][c] !== '' && board[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(board: string[][], word: string, row: number, col: number, [dRow, dCol]: number[]) {
  for (let i = 0; i < word.length; i++) {
    board[row + i * dRow][col + i * dCol] = word[i];
  }
}

export function generateGrid(): { cells: GridCell[][], placedWords: PlacedWord[] } {
  // Initialize empty board
  const board: string[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''));
  const placedWords: PlacedWord[] = [];
  
  // Sort words by length descending to place hardest first
  const sortedWords = [...WORD_LIST].sort((a, b) => b.word.length - a.word.length);

  for (const wordConfig of sortedWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 200;

    while (!placed && attempts < maxAttempts) {
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      // Randomly reverse word for backward placement logic
      const isReverse = Math.random() > 0.5;
      const wordToPlace = isReverse ? wordConfig.word.split('').reverse().join('') : wordConfig.word;

      if (isValidPosition(board, wordToPlace, row, col, direction)) {
        placeWord(board, wordToPlace, row, col, direction);
        
        // Calculate original start/end for validation logic
        // If we placed "EVOL" (LOVE reversed), the start on the grid corresponds to 'E' and end to 'L'.
        // But logically for the user selecting, they can select E->L or L->E.
        // We store the coordinate endpoints of the placement.
        const endRow = row + (wordToPlace.length - 1) * direction[0];
        const endCol = col + (wordToPlace.length - 1) * direction[1];

        placedWords.push({
          ...wordConfig,
          start: { row, col },
          end: { row: endRow, col: endCol }
        });
        placed = true;
      }
      attempts++;
    }
    
    if (!placed) {
      console.error(`Could not place word: ${wordConfig.word}`);
      // Fallback: This usually won't happen with 12x12 and this word list, 
      // but in a robust app we might restart generation or expand grid.
    }
  }

  // Fill remaining spaces
  const cells: GridCell[][] = board.map((rowArr, r) => 
    rowArr.map((char, c) => ({
      letter: char || ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
      row: r,
      col: c,
      isFound: false,
      isSelected: false
    }))
  );

  return { cells, placedWords };
}