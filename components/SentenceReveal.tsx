import React from 'react';
import { SENTENCES } from '../constants';
import { FoundWord } from '../types';

interface SentenceRevealProps {
  foundWords: FoundWord[];
}

export const SentenceReveal: React.FC<SentenceRevealProps> = ({ foundWords }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 space-y-4 text-rose-900">
      {SENTENCES.map((sentence, sIdx) => (
        <div key={sIdx} className="flex flex-wrap items-center justify-center gap-1 text-base md:text-lg text-center leading-relaxed">
          {sentence.map((part) => {
            if (part.isBlank) {
              const found = foundWords.find(fw => fw.targetId === part.targetId);
              return (
                <span 
                  key={part.id} 
                  className={`
                    inline-flex items-center justify-center min-w-[60px] h-8 px-2 mx-1 border-b-2 
                    transition-all duration-700
                    ${found 
                      ? 'border-rose-500 text-rose-600 font-bold -translate-y-0.5' 
                      : 'border-rose-200 text-transparent bg-rose-50/50'}
                  `}
                >
                  {found ? (
                    <span className="animate-fade-in">{found.word}</span>
                  ) : (
                    <span className="opacity-0">____</span>
                  )}
                </span>
              );
            }
            return <span key={part.id}>{part.text}</span>;
          })}
        </div>
      ))}
    </div>
  );
};