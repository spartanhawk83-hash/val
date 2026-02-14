import React, { useState, useEffect, useRef } from 'react';
import { GridCell, Coordinate, PlacedWord, FoundWord } from '../types';
import { generateGrid } from '../services/gridService';
import { GRID_SIZE } from '../constants';

interface WordSearchGridProps {
  onWordFound: (word: FoundWord) => void;
  foundWords: FoundWord[];
}

export const WordSearchGrid: React.FC<WordSearchGridProps> = ({ onWordFound, foundWords }) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selection, setSelection] = useState<{ start: Coordinate | null; end: Coordinate | null }>({ start: null, end: null });
  const [dragPath, setDragPath] = useState<Coordinate[]>([]);
  
  // Initialize grid only once
  useEffect(() => {
    const { cells, placedWords: pWords } = generateGrid();
    setGrid(cells);
    setPlacedWords(pWords);
  }, []);

  // Update grid found state when foundWords changes
  useEffect(() => {
    if (grid.length === 0) return;

    const newGrid = grid.map(row => row.map(cell => ({ ...cell, isFound: false })));

    foundWords.forEach(found => {
      // Find the placement config for this word
      const placement = placedWords.find(pw => pw.targetId === found.targetId);
      if (placement) {
        // Mark cells as found
        const path = getCellsBetween(placement.start, placement.end);
        path.forEach(coord => {
          if (newGrid[coord.row] && newGrid[coord.row][coord.col]) {
            newGrid[coord.row][coord.col].isFound = true;
          }
        });
      }
    });
    
    setGrid(newGrid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundWords, placedWords]);

  // Helper: Get cells between two coordinates (inclusive)
  const getCellsBetween = (start: Coordinate, end: Coordinate): Coordinate[] => {
    const coords: Coordinate[] = [];
    const dRow = Math.sign(end.row - start.row);
    const dCol = Math.sign(end.col - start.col);
    
    // Check if it's a valid straight line (horizontal, vertical, diagonal)
    const rowDiff = Math.abs(end.row - start.row);
    const colDiff = Math.abs(end.col - start.col);

    if (rowDiff !== 0 && colDiff !== 0 && rowDiff !== colDiff) {
      return []; // Not a valid line
    }

    let r = start.row;
    let c = start.col;
    const steps = Math.max(rowDiff, colDiff);

    for (let i = 0; i <= steps; i++) {
      coords.push({ row: r, col: c });
      r += dRow;
      c += dCol;
    }
    return coords;
  };

  const handlePointerDown = (row: number, col: number, e: React.PointerEvent) => {
    e.preventDefault(); // Prevent scroll and default behaviors
    // Start selection
    setSelection({ start: { row, col }, end: { row, col } });
    setDragPath([{ row, col }]);
    
    // Explicitly capture pointer to ensure we get events even if user moves fast
    // but since we are calculating elementFromPoint in container's pointerMove,
    // we want the event to bubble to container.
    // However, on mobile, we need to ensure the scroll doesn't happen.
    // The touch-none class on container handles the CSS side.
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!selection.start) return;
    e.preventDefault();

    // Use elementFromPoint to identify the cell under the finger/cursor
    // This is robust for touch drag where hover events don't fire reliably
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const cellElement = element?.closest('[data-cell-coords]');
    
    if (cellElement) {
      const coords = cellElement.getAttribute('data-cell-coords');
      if (coords) {
        const [row, col] = coords.split(',').map(Number);
        
        // Update only if changed
        if (selection.end?.row !== row || selection.end?.col !== col) {
          setSelection(prev => ({ ...prev, end: { row, col } }));
          const path = getCellsBetween(selection.start, { row, col });
          setDragPath(path);
        }
      }
    }
  };

  const handlePointerUp = () => {
    if (!selection.start || !selection.end) {
      setSelection({ start: null, end: null });
      setDragPath([]);
      return;
    }

    // Check if valid word
    const path = getCellsBetween(selection.start, selection.end);
    if (path.length > 0) {
      // Construct word string
      const selectedWord = path.map(c => grid[c.row][c.col].letter).join('');
      const reversedWord = selectedWord.split('').reverse().join('');

      // Check against hidden words
      const match = placedWords.find(pw => 
        (pw.word === selectedWord || pw.word === reversedWord) &&
        // Verify it matches the specific placement coordinates
        ((pw.start.row === selection.start!.row && pw.start.col === selection.start!.col && pw.end.row === selection.end!.row && pw.end.col === selection.end!.col) ||
         (pw.start.row === selection.end!.row && pw.start.col === selection.end!.col && pw.end.row === selection.start!.row && pw.end.col === selection.start!.col))
      );

      if (match) {
        // Check if already found
        const alreadyFound = foundWords.some(fw => fw.targetId === match.targetId);
        if (!alreadyFound) {
          onWordFound({ word: match.word, targetId: match.targetId });
        }
      }
    }

    setSelection({ start: null, end: null });
    setDragPath([]);
  };

  // Helper to check if a cell is currently in the drag path
  const isInDragPath = (row: number, col: number) => {
    return dragPath.some(c => c.row === row && c.col === col);
  };

  // Add global pointer up listener to catch releases outside the component
  useEffect(() => {
    const handleGlobalUp = () => handlePointerUp();
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  });

  return (
    <div 
      className="select-none touch-none p-4 rounded-xl bg-white/50 shadow-lg border border-rose-100 backdrop-blur-sm max-w-[95vw] md:max-w-md mx-auto"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      // Add touch-action: none inline just to be absolutely sure along with Tailwind class
      style={{ touchAction: 'none' }}
    >
      <div 
        className="grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rIndex) => 
          row.map((cell, cIndex) => {
            const isSelected = isInDragPath(rIndex, cIndex);
            const isFound = cell.isFound;
            
            return (
              <div
                key={`${rIndex}-${cIndex}`}
                data-cell-coords={`${rIndex},${cIndex}`}
                className={`
                  aspect-square flex items-center justify-center text-sm sm:text-lg md:text-xl font-medium rounded-md transition-all duration-150
                  cursor-pointer
                  ${isFound 
                    ? 'bg-rose-500 text-white shadow-inner scale-95' 
                    : isSelected 
                      ? 'bg-rose-300 text-rose-900 scale-105 shadow-md z-10' 
                      : 'bg-white text-rose-900'}
                `}
                onPointerDown={(e) => handlePointerDown(rIndex, cIndex, e)}
              >
                {cell.letter}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};