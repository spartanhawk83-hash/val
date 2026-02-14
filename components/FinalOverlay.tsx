import React from 'react';

interface FinalOverlayProps {
  isVisible: boolean;
}

export const FinalOverlay: React.FC<FinalOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/40 backdrop-blur-sm animate-fade-in transition-opacity duration-1000">
      <div className="bg-white/90 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg text-center border-4 border-rose-100 transform transition-all animate-pulse-slow">
        <h2 className="text-3xl md:text-4xl font-bold text-rose-600 mb-6">
          You found every word.
        </h2>
        <p className="text-xl md:text-2xl text-rose-800 mb-8 leading-relaxed">
          Just like you found your way into my life.
        </p>
        <div className="text-4xl md:text-5xl font-black text-rose-500 tracking-wider">
          I LOVE YOU, PRIYA.
        </div>
      </div>
    </div>
  );
};