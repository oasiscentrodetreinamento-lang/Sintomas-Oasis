import React from 'react';
import { Activity, Brain, Heart, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-4xl w-full text-center z-10 animate-fade-in space-y-12">
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-brand-light text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            Oásis Centro de Treinamento
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm">
            Mapeamento de Sintomas <br />
            <span className="text-white">Seu Corpo Fala, Nós Interpretamos.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Esta avaliação identifica padrões metabólicos, inflamatórios e comportamentais para direcionar treinos mais inteligentes e resultados reais.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: Activity, title: "Sinais do Corpo", text: "Identifique o que suas dores e cansaço dizem." },
            { icon: Brain, title: "Padrões Mentais", text: "Como o estresse afeta seu rendimento físico." },
            { icon: Heart, title: "Saúde Integral", text: "Conexão entre digestão, sono e performance." }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl text-left transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-white/5 group">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 text-brand group-hover:text-white transition-colors">
                <item.icon size={20} />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-brand hover:bg-brand-dark text-white font-semibold rounded-full text-lg transition-all duration-300 shadow-lg shadow-brand/25 hover:shadow-brand/40 overflow-hidden"
          >
            <span className="relative z-10">Iniciar Avaliação</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
          </button>
          <p className="mt-4 text-xs text-slate-500">Tempo estimado: 3 minutos</p>
        </div>
      </main>
    </div>
  );
};

export default Hero;