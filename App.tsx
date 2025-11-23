import React, { useState } from 'react';
import Hero from './components/Hero';
import Assessment from './components/Assessment';
import Results from './components/Results';
import { ViewState, StoredAnswer } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('hero');
  const [finalAnswers, setFinalAnswers] = useState<StoredAnswer[]>([]);

  const startAssessment = () => {
    setView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentComplete = (answers: StoredAnswer[]) => {
    setFinalAnswers(answers);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-slate-200 antialiased selection:bg-brand selection:text-white">
      {view === 'hero' && <Hero onStart={startAssessment} />}
      
      {view === 'assessment' && (
        <Assessment onComplete={handleAssessmentComplete} />
      )}
      
      {view === 'results' && (
        <Results answers={finalAnswers} />
      )}
    </div>
  );
};

export default App;