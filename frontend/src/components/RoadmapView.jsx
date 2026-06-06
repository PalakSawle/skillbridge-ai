import React, { useState, useEffect } from 'react';
import { BookOpen, Video, ExternalLink, Compass, Sparkles, CheckSquare, Square } from 'lucide-react';

export default function RoadmapView({ roadmap }) {
  const [completedSteps, setCompletedSteps] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('skillbridge_roadmap_progress');
    if (saved) {
      try {
        setCompletedSteps(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleStep = (skill, stepIdx) => {
    const key = `${skill}-${stepIdx}`;
    const updated = {
      ...completedSteps,
      [key]: !completedSteps[key]
    };
    setCompletedSteps(updated);
    localStorage.setItem('skillbridge_roadmap_progress', JSON.stringify(updated));
  };

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="text-center py-12 glass-panel rounded-2xl">
        <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Full Skill Alignment!</h3>
        <p className="text-xs text-dark-400 mt-1 max-w-sm mx-auto">
          Your resume matches all key requirements extracted from the job description. No learning roadmap required!
        </p>
      </div>
    );
  }

  const getDifficultyBadgeColor = (diff) => {
    if (diff === 'Beginner') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (diff === 'Intermediate') return 'bg-brand-500/10 text-brand-400 border border-brand-500/20';
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  };

  const getResourceIcon = (type) => {
    if (type === 'video') return <Video className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-brand-400" />
          Personalized Skill-Gap Learning Roadmap
        </h2>
        <p className="text-xs text-dark-400 mt-1">
          Custom training modules generated to close the gap on {roadmap.length} required skillsets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {roadmap.map((module, mIdx) => {
          const { skill, difficulty, steps = [], resources = [] } = module;
          const stepKeys = steps.map((_, idx) => `${skill}-${idx}`);
          const doneCount = stepKeys.filter(k => completedSteps[k]).length;
          const progressPercent = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;

          return (
            <div key={mIdx} className="p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-dark-400 uppercase tracking-widest block mb-1">Gap Module</span>
                    <h3 className="text-lg font-bold text-white">{skill}</h3>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getDifficultyBadgeColor(difficulty)}`}>
                    {difficulty}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center text-[10px] text-dark-400 font-semibold mb-1">
                    <span>PROGRESS TRACKER</span>
                    <span className="text-white">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-dark-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Recommended Steps</h4>
                  {steps.map((step, sIdx) => {
                    const isDone = completedSteps[`${skill}-${sIdx}`];
                    return (
                      <div 
                        key={sIdx} 
                        onClick={() => toggleStep(skill, sIdx)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                          isDone 
                            ? 'bg-brand-500/5 border-brand-500/20 text-dark-300' 
                            : 'bg-dark-900 border-dark-800 text-white hover:border-dark-700'
                        }`}
                      >
                        <button className="mt-0.5 text-brand-400 hover:text-brand-300 flex-shrink-0 transition-colors">
                          {isDone ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>
                        <span className={`text-xs ${isDone ? 'line-through opacity-60' : ''}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-dark-800 pt-4">
                <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">Reference Learning Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {resources.map((res, rIdx) => (
                    <a
                      key={rIdx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-900 hover:bg-dark-800 border border-dark-800 hover:border-dark-700 text-xs font-medium text-brand-300 hover:text-brand-200 rounded-xl transition-all"
                    >
                      {getResourceIcon(res.type)}
                      <span>{res.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-65" />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
