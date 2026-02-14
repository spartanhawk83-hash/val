export interface Coordinate {
  row: number;
  col: number;
}

export interface WordConfig {
  word: string;
  targetId: string; // ID to map to the sentence blank
}

export interface PlacedWord extends WordConfig {
  start: Coordinate;
  end: Coordinate;
}

export interface GridCell {
  letter: string;
  row: number;
  col: number;
  isFound: boolean;
  isSelected: boolean;
}

export interface FoundWord {
  word: string;
  targetId: string;
}

export interface SentencePart {
  id: string;
  text?: string;
  targetId?: string; // If this part is a blank, this links to the WordConfig
  isBlank?: boolean;
}

export interface HintInfo {
  word: string;
  hintText: string;
  question: string;
}

export interface StoredAnswer {
  question: string;
  answer: string;
  word: string;
}