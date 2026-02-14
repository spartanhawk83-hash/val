import React from 'react';
import { WordConfig, HintInfo } from '../types';
import { WORD_HINTS } from '../constants';
import { Lock, Unlock, Lightbulb } from 'lucide-react';

interface HintPanelProps {
  allWords: WordConfig[];
  foundWordIds: string[]; // targetIds of found words
  unlockedHints: Record<string, boolean>; // word -> boolean
  onHintClick: (hint: HintInfo) => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({ 
  allWords, 
  foundWordIds, 
  unlockedHints, 
  onHintClick 
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-rose-100 shadow-sm p-4 h-full overflow-y-auto max-h-[500px] md:max-h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-rose-200">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Lightbulb className="text-rose-500" size={20} />
        <h2 className="font-bold text-rose-800 text-lg">Hints</h2>
      </div>

      <div className="space-y-3">
        {allWords.map((wordConfig, index) => {
          // If word is found, do not show hint
          if (foundWordIds.includes(wordConfig.targetId)) {
            return null;
          }

          const hintData = WORD_HINTS[wordConfig.word];
          if (!hintData) return null;

          const isUnlocked = unlockedHints[wordConfig.word];

          return (
            <div
              key={wordConfig.word}
              onClick={() => !isUnlocked && onHintClick(hintData)}
              className={`
                relative p-4 rounded-xl border transition-all duration-300 group
                ${isUnlocked 
                  ? 'bg-rose-50 border-rose-200' 
                  : 'bg-white border-rose-100 hover:border-rose-300 hover:shadow-md cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  mt-1 p-1.5 rounded-full transition-colors
                  ${isUnlocked ? 'bg-rose-200 text-rose-600' : 'bg-gray-100 text-gray-400 group-hover:bg-rose-100 group-hover:text-rose-500'}
                `}>
                  {isUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                    Hint {index + 1}
                  </h4>
                  {isUnlocked ? (
                    <p className="text-sm text-rose-900 font-medium animate-fade-in">
                      {hintData.hintText}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Locked. Click to unlock.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {allWords.every(w => foundWordIds.includes(w.targetId)) && (
          <div className="text-center py-8 text-rose-400 italic text-sm">
            All words found! 💖
          </div>
        )}
      </div>
    </div>
  );
};