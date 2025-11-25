
import React from 'react';
import { HistoryEntry, PainHistoryEntry, UserProfile } from '../types';
import { Calendar, ChevronRight, Activity, ClipboardList, ArrowLeft } from 'lucide-react';

interface HistoryListProps {
  userProfile: UserProfile;
  symptomHistory: HistoryEntry[];
  painHistory: PainHistoryEntry[];
  onBack: () => void;
  onSelectSymptomResult: (index: number) => void;
  onSelectPainResult: (index: number) => void;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data Inválida';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Data Inválida';
  }
};

const HistoryList: React.FC<HistoryListProps> = ({ 
  userProfile, 
  symptomHistory, 
  painHistory, 
  onBack,
  onSelectSymptomResult,
  onSelectPainResult
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 animate-fade-in">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Histórico Completo</h1>
          <p className="text-slate-400 text-sm">Avaliações de {userProfile.name}</p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Symptom History Column */}
        <div>
          <h2 className="text-lg font-bold text-brand mb-4 flex items-center gap-2">
            <Activity size={20} /> Mapeamento de Sintomas
          </h2>
          
          <div className="space-y-3">
            {symptomHistory.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-slate-600 text-sm text-center">
                Nenhuma avaliação de sintomas registrada.
              </div>
            ) : (
              [...symptomHistory].reverse().map((entry, reverseIndex) => {
                const originalIndex = symptomHistory.length - 1 - reverseIndex;
                return (
                  <button
                    key={originalIndex}
                    onClick={() => onSelectSymptomResult(originalIndex)}
                    className="w-full glass-panel p-4 rounded-xl border border-white/5 hover:border-brand/30 hover:bg-white/5 transition-all text-left group flex justify-between items-center"
                  >
                    <div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <Calendar size={14} className="text-slate-500" />
                        {formatDate(entry.date)}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        Pontuação: <span className={entry.percentage > 50 ? 'text-red-400' : 'text-yellow-400'}>{entry.percentage}%</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-brand transition-colors" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Pain History Column */}
        <div>
          <h2 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            <ClipboardList size={20} /> Mapeamento de Dores
          </h2>
          
          <div className="space-y-3">
            {painHistory.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-slate-600 text-sm text-center">
                Nenhum mapa de dor registrado.
              </div>
            ) : (
              [...painHistory].reverse().map((entry, reverseIndex) => {
                const originalIndex = painHistory.length - 1 - reverseIndex;
                return (
                  <button
                    key={originalIndex}
                    onClick={() => onSelectPainResult(originalIndex)}
                    className="w-full glass-panel p-4 rounded-xl border border-white/5 hover:border-blue-400/30 hover:bg-white/5 transition-all text-left group flex justify-between items-center"
                  >
                    <div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <Calendar size={14} className="text-slate-500" />
                        {formatDate(entry.date)}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        Nível Total de Dor: <span className="text-blue-400 font-mono">{entry.totalScore}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HistoryList;
