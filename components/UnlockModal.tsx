import React, { useState } from 'react';
import { HintInfo } from '../types';
import { Lock, Heart } from 'lucide-react';

interface UnlockModalProps {
  hint: HintInfo | null;
  onClose: () => void;
  onUnlock: (word: string, answer: string) => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({ hint, onClose, onUnlock }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  if (!hint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().length < 3) {
      setError('Please write a bit more... (at least 3 characters)');
      return;
    }
    onUnlock(hint.word, answer);
    setAnswer('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative overflow-hidden border border-rose-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-rose-300 hover:text-rose-500 transition-colors text-xl font-bold"
        >
          &times;
        </button>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-4">
            <Lock className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-rose-800">Unlock Hint</h3>
          <p className="text-rose-500 text-sm mt-1">Answer this to see the hint</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
            <p className="text-rose-800 font-medium text-center leading-relaxed">
              "{hint.question}"
            </p>
          </div>

          <div>
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError('');
              }}
              placeholder="Your answer..."
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder-rose-300 text-rose-900"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span>Unlock</span>
            <Heart size={16} className="fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};