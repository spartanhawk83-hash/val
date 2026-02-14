import React, { useState, useEffect } from 'react';
import { WordSearchGrid } from './components/WordSearchGrid';
import { SentenceReveal } from './components/SentenceReveal';
import { FinalOverlay } from './components/FinalOverlay';
import { HintPanel } from './components/HintPanel';
import { UnlockModal } from './components/UnlockModal';
import { SummarySection } from './components/SummarySection';
import { FoundWord, HintInfo, StoredAnswer } from './types';
import { WORD_LIST } from './constants';
import { Heart } from 'lucide-react';

const App: React.FC = () => {
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  // Hint State
  const [unlockedHints, setUnlockedHints] = useState<Record<string, boolean>>({});
  const [selectedHint, setSelectedHint] = useState<HintInfo | null>(null);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);

  // Load answers from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('priya_valentine_answers');
    if (saved) {
      setAnswers(JSON.parse(saved));
      
      // Also restore unlocked state based on answers
      const parsedAnswers: StoredAnswer[] = JSON.parse(saved);
      const restoredUnlocked: Record<string, boolean> = {};
      parsedAnswers.forEach(a => {
        restoredUnlocked[a.word] = true;
      });
      setUnlockedHints(restoredUnlocked);
    }
  }, []);

  const handleWordFound = (word: FoundWord) => {
    setFoundWords(prev => {
      if (prev.some(w => w.targetId === word.targetId)) return prev;
      return [...prev, word];
    });
  };

  const handleHintClick = (hint: HintInfo) => {
    setSelectedHint(hint);
  };

  const handleUnlockHint = (word: string, answer: string) => {
    if (!selectedHint) return;

    // Save unlock state
    setUnlockedHints(prev => ({ ...prev, [word]: true }));
    
    // Save answer
    const newAnswer: StoredAnswer = {
      word,
      question: selectedHint.question,
      answer
    };
    
    const updatedAnswers = [...answers.filter(a => a.word !== word), newAnswer];
    setAnswers(updatedAnswers);
    localStorage.setItem('priya_valentine_answers', JSON.stringify(updatedAnswers));
    
    setSelectedHint(null);
  };

  useEffect(() => {
    if (foundWords.length === WORD_LIST.length) {
      setTimeout(() => {
        setIsGameComplete(true);
      }, 1000);
    }
  }, [foundWords]);

  const handleOverlayClick = () => {
    setIsGameComplete(false);
    setShowSummary(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  // Get IDs of found words to pass to HintPanel
  const foundWordIds = foundWords.map(fw => fw.targetId);

  return (
    <div className="min-h-screen pb-12 overflow-x-hidden selection:bg-rose-200 selection:text-rose-900">
      <header className="pt-8 pb-4 text-center px-4">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={24} />
          <span className="text-rose-400 font-medium tracking-widest text-sm uppercase">Valentine's Special</span>
          <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={24} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-rose-900 mb-2 font-sans">
          To My Priya
        </h1>
        <p className="text-rose-700 max-w-md mx-auto">
          Find the hidden words to complete our story.
        </p>
      </header>

      {/* Progress */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rose-500 transition-all duration-700 ease-out"
            style={{ width: `${(foundWords.length / WORD_LIST.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="container mx-auto px-2 md:px-4">
        <div className={`transition-opacity duration-1000 ${isGameComplete ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center max-w-6xl mx-auto">
            {/* Game Column */}
            <div className="flex-1 w-full lg:max-w-3xl">
              <WordSearchGrid 
                onWordFound={handleWordFound} 
                foundWords={foundWords}
              />
              <SentenceReveal foundWords={foundWords} />
            </div>

            {/* Hints Column - Desktop: Right, Mobile: Bottom */}
            <div className={`
              w-full lg:w-80 transition-all duration-500
              ${showSummary ? 'hidden' : 'block'}
            `}>
              <HintPanel 
                allWords={WORD_LIST}
                foundWordIds={foundWordIds}
                unlockedHints={unlockedHints}
                onHintClick={handleHintClick}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Final Overlay */}
      {isGameComplete && (
        <div onClick={handleOverlayClick} className="cursor-pointer">
          <FinalOverlay isVisible={isGameComplete} />
        </div>
      )}

      {/* Unlock Modal */}
      <UnlockModal 
        hint={selectedHint} 
        onClose={() => setSelectedHint(null)}
        onUnlock={handleUnlockHint}
      />

      {/* Post Game Summary */}
      {(showSummary || (foundWords.length === WORD_LIST.length && !isGameComplete)) && (
        <div className="animate-fade-in">
           <SummarySection answers={answers} />
        </div>
      )}
      
      <footer className="text-center text-rose-300 text-sm py-8 mt-8">
        <p>Made with love ❤️</p>
      </footer>
    </div>
  );
};

export default App;