import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
        <span>Progresso</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-brand shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;