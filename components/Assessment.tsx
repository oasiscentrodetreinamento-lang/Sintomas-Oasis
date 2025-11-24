import React, { useState } from 'react';
import { QUESTIONS, ANSWER_OPTIONS } from '../constants';
import { StoredAnswer, AnswerValue } from '../types';
import ProgressBar from './ProgressBar';
import { ChevronRight } from 'lucide-react';

interface AssessmentProps {
  onComplete: (answers: StoredAnswer[]) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleAnswer = (option: typeof ANSWER_OPTIONS[0]) => {
    setIsTransitioning(true);

    const newAnswer: StoredAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      answer: option.value,
      score: option.score
    };

    // Delay for animation
    setTimeout(() => {
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsTransitioning(false);
      } else {
        onComplete(updatedAnswers);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-blue-600 opacity-20" />
      
      <div className="w-full max-w-2xl z-10">
        <ProgressBar current={currentQuestionIndex + 1} total={QUESTIONS.length} />

        <div className={`glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden transition-all duration-300 transform ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
          
          <div className="absolute top-4 right-6 text-xs font-mono text-slate-500">
            {currentQuestion.category.toUpperCase()}
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-12 leading-snug">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ANSWER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option)}
                className={`
                  group relative p-4 rounded-xl border border-white/5 transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  flex flex-col items-center justify-center gap-2
                  ${option.value === AnswerValue.FREQUENTEMENTE ? 'hover:border-red-400/30' : ''}
                  ${option.value === AnswerValue.OCASIONALMENTE ? 'hover:border-blue-400/30' : ''}
                  ${option.value === AnswerValue.NAO ? 'hover:border-yellow-400/30' : ''}
                  glass-panel bg-opacity-30 hover:bg-opacity-50
                `}
              >
                <div className={`
                  w-3 h-3 rounded-full mb-1 transition-colors
                  ${option.value === AnswerValue.FREQUENTEMENTE ? 'bg-red-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}
                  ${option.value === AnswerValue.OCASIONALMENTE ? 'bg-blue-500 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''}
                  ${option.value === AnswerValue.NAO ? 'bg-brand group-hover:shadow-[0_0_10px_rgba(234,179,8,0.5)]' : ''}
                `} />
                <span className="text-slate-200 font-medium group-hover:text-white">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center text-xs text-slate-500 border-t border-white/5 pt-4">
            <span>Questão {currentQuestionIndex + 1} de {QUESTIONS.length}</span>
            <span className="flex items-center gap-1">
              Próxima <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;