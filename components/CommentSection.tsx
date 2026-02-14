import React, { useState, useEffect } from 'react';
import { Send, Heart } from 'lucide-react';

export const CommentSection: React.FC = () => {
  const [comment, setComment] = useState('');
  const [savedComment, setSavedComment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('priya_valentine_comment');
    if (saved) {
      setSavedComment(saved);
    }
  }, []);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate network delay for effect
    setTimeout(() => {
      localStorage.setItem('priya_valentine_comment', comment);
      setSavedComment(comment);
      setIsSubmitting(false);
      setComment('');
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-16 mb-20 px-4 text-center">
      <div className="mb-6">
        <p className="text-rose-800 font-medium text-lg mb-1">
          Share some thoughts if you want, my valentine.
        </p>
        <p className="text-rose-400 text-sm italic">
          (Yes, I didn't ask you to be my valentine's, already mine.)
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 relative overflow-hidden">
        {savedComment ? (
          <div className="py-8 animate-fade-in">
             <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 fill-current animate-bounce" />
             <h3 className="text-xl font-bold text-rose-600 mb-2">Saved 💖</h3>
             <p className="text-rose-800 italic">"{savedComment}"</p>
             <button 
               onClick={() => setSavedComment(null)}
               className="mt-6 text-xs text-rose-400 hover:text-rose-600 underline"
             >
               Edit note
             </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <textarea
              className="w-full h-32 p-4 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none resize-none bg-rose-50/30 text-rose-900 placeholder-rose-300 transition-all"
              placeholder="Write something here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
              className={`
                mt-4 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300
                ${!comment.trim() || isSubmitting 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:-translate-y-0.5'}
              `}
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <span>Send Love</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};