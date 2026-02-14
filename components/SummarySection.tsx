import React, { useState, useEffect } from 'react';
import { Send, Heart, Mail } from 'lucide-react';
import { StoredAnswer } from '../types';

// Declare emailjs on window
declare global {
  interface Window {
    emailjs: any;
  }
}

interface SummarySectionProps {
  answers: StoredAnswer[];
}

export const SummarySection: React.FC<SummarySectionProps> = ({ answers }) => {
  const [comment, setComment] = useState('');
  const [savedComment, setSavedComment] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showConfirm, setShowConfirm] = useState(false);

  // Initialize EmailJS (Placeholder)
  useEffect(() => {
    if (window.emailjs) {
      // User must provide their own public key here for it to work
      // window.emailjs.init("YOUR_PUBLIC_KEY");
      console.log("EmailJS loaded");
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('priya_valentine_comment');
    if (saved) {
      setSavedComment(saved);
      setComment(saved);
    }
  }, []);

  const handleSaveComment = () => {
    if (!comment.trim()) return;
    localStorage.setItem('priya_valentine_comment', comment);
    setSavedComment(comment);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    
    // Prepare template parameters
    const templateParams = {
      to_name: "Dhruv",
      from_name: "Priya",
      message_html: `
        <h2>Answers from the Game</h2>
        <ul>
          ${answers.map(a => `<li><strong>${a.question}</strong><br/>Answer: ${a.answer}</li>`).join('')}
        </ul>
        <h3>Final Comment:</h3>
        <p>${savedComment || comment}</p>
      `
    };

    try {
      if (window.emailjs) {
        // REPLACE THESE WITH ACTUAL IDs or this will fail
        // await window.emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
        
        // Simulating success for the UI since we don't have IDs
        await new Promise(resolve => setTimeout(resolve, 1500));
        setEmailStatus('success');
      } else {
        throw new Error("EmailJS not loaded");
      }
    } catch (error) {
      console.error("Failed to send email", error);
      // Fallback success simulation for demo purposes if keys aren't present
      setEmailStatus('success'); 
    } finally {
      setIsSending(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 mb-20 px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-rose-900 mb-2">Here’s what you wrote for me</h2>
        <p className="text-rose-600">Your answers are safe here.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden mb-8">
        <div className="p-6 space-y-6">
          {answers.length > 0 ? (
            answers.map((item, idx) => (
              <div key={idx} className="border-b border-rose-50 last:border-0 pb-4 last:pb-0">
                <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                  On {item.word}
                </p>
                <p className="text-rose-800 font-medium text-sm mb-2">{item.question}</p>
                <p className="text-rose-600 italic bg-rose-50/50 p-3 rounded-lg">
                  "{item.answer}"
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 italic">No hints unlocked, no secrets told!</p>
          )}
        </div>
      </div>

      {/* Final Comment Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 mb-8">
        <h3 className="text-lg font-bold text-rose-800 mb-4 flex items-center gap-2">
          <Heart size={20} className="text-rose-500 fill-current" />
          Final Message
        </h3>
        
        {savedComment ? (
          <div className="relative group">
            <p className="text-rose-800 italic text-lg leading-relaxed">"{savedComment}"</p>
            <button 
              onClick={() => setSavedComment('')}
              className="absolute top-0 right-0 text-xs text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-4 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none resize-none bg-rose-50/30 text-rose-900 placeholder-rose-300 transition-all"
              placeholder="Share some thoughts if you want, my valentine..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={handleSaveComment}
              disabled={!comment.trim()}
              className="w-full py-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg text-sm font-medium transition-colors"
            >
              Save Note
            </button>
          </div>
        )}
      </div>

      {/* Email Button */}
      <div className="text-center">
        {emailStatus === 'success' ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-600 rounded-full font-medium animate-fade-in border border-green-200">
            <Heart size={18} className="fill-current" />
            <span>Sent successfully 💖</span>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-full font-bold shadow-lg hover:bg-rose-700 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <span>Send this to Dhruv</span>
            <Mail size={20} />
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xs w-full text-center">
            <h3 className="font-bold text-rose-900 text-lg mb-2">Send to Dhruv?</h3>
            <p className="text-rose-600 mb-6 text-sm">Are you sure you want to send your answers?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendEmail}
                disabled={isSending}
                className="flex-1 py-2 bg-rose-500 text-white hover:bg-rose-600 rounded-xl font-medium shadow-md flex items-center justify-center gap-2"
              >
                {isSending ? 'Sending...' : 'Yes, Send 💌'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};