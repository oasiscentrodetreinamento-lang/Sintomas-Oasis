
import React from 'react';
import { Activity, ClipboardList, ArrowRight, History, Eye, List } from 'lucide-react';
import { UserProfile } from '../types';

interface SelectionProps {
  userProfile: UserProfile;
  onSelectCurrent: () => void;
  onSelectNew: () => void;
  onBack: () => void;
  hasSymptomHistory?: boolean;
  hasPainHistory?: boolean;
  onViewLastSymptomResult?: () => void;
  onViewLastPainResult?: () => void;
  onViewFullHistory: () => void;
}

const Selection: React.FC<SelectionProps> = ({ 
  userProfile, 
  onSelectCurrent, 
  onSelectNew, 
  onBack,
  hasSymptomHistory,
  hasPainHistory,
  onViewLastSymptomResult,
  onViewLastPainResult,
  onViewFullHistory
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative animate-fade-in">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-4xl z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            Olá, <span className="text-brand">{userProfile.name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-400">Selecione qual avaliação deseja realizar hoje ou consulte o histórico.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Option 1: Current Assessment (New) */}
          <button
            onClick={onSelectCurrent}
            className="group relative glass-panel p-8 rounded-3xl border border-white/5 hover:border-brand/50 hover:bg-brand/5 transition-all duration-300 text-left flex flex-col items-start gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
              <Activity size={28} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors">
                Nova Avaliação de Sintomas
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Iniciar um novo questionário completo de 63 indicadores metabólicos.
              </p>
            </div>

            <div className="mt-auto pt-4 flex items-center text-brand font-medium text-sm">
              Iniciar Agora <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Option 2: Pain Mapping (New) */}
          <button
            onClick={onSelectNew}
            className="group relative glass-panel p-8 rounded-3xl border border-white/5 hover:border-blue-400/50 hover:bg-blue-500/5 transition-all duration-300 text-left flex flex-col items-start gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <ClipboardList size={28} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Novo Mapeamento de Dores
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Registrar novos pontos de dor e desconforto físico no mapa corporal.
              </p>
            </div>

            <div className="mt-auto pt-4 flex items-center text-blue-400 font-medium text-sm">
              Iniciar Mapeamento <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

        {/* History Section */}
        {(hasSymptomHistory || hasPainHistory) && (
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/50">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <History size={14} /> Histórico Recente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Last Symptom */}
              {hasSymptomHistory ? (
                <button 
                  onClick={onViewLastSymptomResult}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-brand" />
                    <span className="text-slate-300 font-medium group-hover:text-white text-sm">Último Resultado Sintomas</span>
                  </div>
                  <Eye size={16} className="text-slate-500 group-hover:text-brand" />
                </button>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-slate-600 text-sm flex items-center gap-2 justify-center">
                  Sem sintomas
                </div>
              )}

              {/* Last Pain */}
              {hasPainHistory ? (
                <button 
                  onClick={onViewLastPainResult}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList size={18} className="text-blue-400" />
                    <span className="text-slate-300 font-medium group-hover:text-white text-sm">Último Mapa de Dor</span>
                  </div>
                  <Eye size={16} className="text-slate-500 group-hover:text-blue-400" />
                </button>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-slate-600 text-sm flex items-center gap-2 justify-center">
                  Sem dores
                </div>
              )}

              {/* Full History Button */}
              <button 
                onClick={onViewFullHistory}
                className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center justify-center gap-3 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all group"
              >
                <List size={18} className="text-slate-400 group-hover:text-white" />
                <span className="text-slate-300 font-medium group-hover:text-white text-sm">Ver Histórico Completo</span>
              </button>

            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button 
            onClick={onBack}
            className="text-slate-500 hover:text-white text-sm transition-colors underline decoration-slate-700 hover:decoration-white underline-offset-4"
          >
            Voltar para a busca
          </button>
        </div>
      </div>
    </div>
  );
};

export default Selection;
