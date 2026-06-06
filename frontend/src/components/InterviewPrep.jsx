import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircleCode, UserCheck, FolderGit2 } from 'lucide-react';

export default function InterviewPrep({ interviewPrep }) {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleOpen = (idx) => {
    setOpenIndexes({
      ...openIndexes,
      [idx]: !openIndexes[idx]
    });
  };

  if (!interviewPrep || interviewPrep.length === 0) {
    return (
      <div className="text-center py-12 glass-panel rounded-2xl">
        <HelpCircle className="w-12 h-12 text-brand-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Mock Questions Available</h3>
        <p className="text-xs text-dark-400 mt-1 max-w-sm mx-auto">
          Please upload your resume and specify a target job description to generate simulated interview prep.
        </p>
      </div>
    );
  }

  const getCategoryBadge = (cat) => {
    if (cat === 'technical') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
          <MessageCircleCode className="w-3 h-3" /> Technical Question
        </span>
      );
    }
    if (cat === 'behavioral') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          <UserCheck className="w-3 h-3" /> HR / Behavioral
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
        <FolderGit2 className="w-3 h-3" /> Project Inquest
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-brand-400" />
          AI Mock Interview Coach
        </h2>
        <p className="text-xs text-dark-400 mt-1">
          Review questions generated from the gaps and strengths identified between your profile and the role requirements.
        </p>
      </div>

      <div className="space-y-4">
        {interviewPrep.map((item, idx) => {
          const isOpen = !!openIndexes[idx];
          
          return (
            <div 
              key={idx} 
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen 
                  ? 'bg-dark-900 border-brand-500/30 glow-indigo' 
                  : 'bg-dark-900/40 border-dark-800 hover:border-dark-700'
              }`}
            >
              <div 
                onClick={() => toggleOpen(idx)}
                className="p-5 flex justify-between items-center cursor-pointer select-none"
              >
                <div className="space-y-2 pr-4">
                  {getCategoryBadge(item.category)}
                  <h3 className="text-sm font-bold text-white leading-relaxed">{item.question}</h3>
                </div>
                
                <button className="text-dark-400 hover:text-white transition-colors">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-dark-800 animate-slide-down">
                  <div className="bg-dark-950/40 border border-dark-800 rounded-xl p-4 mt-2">
                    <h4 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">
                      Recruiter Expectations & Answer Hints
                    </h4>
                    <p className="text-xs text-dark-300 leading-relaxed font-normal">
                      {item.answerHint}
                    </p>
                    
                    <div className="mt-4 border-t border-dark-900 pt-3">
                      <label className="block text-[10px] font-semibold text-dark-400 uppercase tracking-widest mb-1.5">
                        Practice Your Response
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Type your response here to review structure..."
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-800 focus:border-brand-500 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-brand-500 resize-y transition-all"
                      />
                    </div>

                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
