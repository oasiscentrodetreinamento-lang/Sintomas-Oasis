
import React, { useState, useMemo } from 'react';
import { StoredAnswer, AnswerValue, HistoryEntry, UserProfile } from '../types';
import { QUESTIONS } from '../constants';
import { 
  Brain, Eye, Ear, Wind, MessageCircle, Smile, 
  Sparkles, Heart, Zap, Utensils, Dumbbell, 
  Activity, Shield, Flame, User, Send,
  CheckCircle, Info, Calendar, History, ClipboardList, LayoutGrid
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

interface ResultsProps {
  answers: StoredAnswer[];
  history: HistoryEntry[];
  userProfile: UserProfile;
  onStartPainMap: () => void;
  onBackToMenu: () => void;
}

// Safe date formatter to prevent crashes
const formatDateSafe = (dateString: string): string => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('pt-BR');
  } catch (e) {
    return 'N/A';
  }
};

// Geometry helpers for SVG generation
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, outerRadius, endAngle);
  const end = polarToCartesian(x, y, outerRadius, startAngle);
  const start2 = polarToCartesian(x, y, innerRadius, endAngle);
  const end2 = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", start.x, start.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
    "L", end2.x, end2.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, start2.x, start2.y,
    "Z"
  ].join(" ");

  return d;
};

// Map categories to Lucide icons
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Cabeça': User,
  'Olhos': Eye,
  'Ouvidos': Ear,
  'Respiratório Sup.': Wind,
  'Garganta': MessageCircle,
  'Boca': Smile,
  'Pele': Sparkles,
  'Cardíaco': Heart,
  'Resp. / Energia': Zap,
  'Digestivo': Utensils,
  'Muscular': Dumbbell,
  'Neurológico': Brain,
  'Imunológico': Shield,
  'Metabolismo': Flame,
};

const Results: React.FC<ResultsProps> = ({ answers, history, userProfile, onStartPainMap, onBackToMenu }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Current Session Data Processing ---
  const { categoryData, totalStats } = useMemo(() => {
    const cats: Record<string, { 
      label: string, 
      score: number, 
      maxScore: number, 
      questions: StoredAnswer[],
      percentage: number 
    }> = {};

    let grandTotal = 0;
    let maxGrandTotal = 0;

    // Initialize categories
    const uniqueCats = Array.from(new Set(QUESTIONS.map((q) => q.category))) as string[];
    uniqueCats.forEach(c => {
      cats[c] = { label: c, score: 0, maxScore: 0, questions: [], percentage: 0 };
    });

    answers.forEach(ans => {
      const originalQ = QUESTIONS.find((q) => q.id === ans.questionId);
      if (originalQ) {
        const cat = cats[originalQ.category];
        if (cat) {
          cat.score += ans.score;
          cat.maxScore += 3; // Max score per question is 3
          cat.questions.push(ans);
          grandTotal += ans.score;
          maxGrandTotal += 3;
        }
      }
    });

    // Calculate percentages
    Object.keys(cats).forEach(key => {
      if (cats[key].maxScore > 0) {
        cats[key].percentage = (cats[key].score / cats[key].maxScore) * 100;
      } else {
        cats[key].percentage = 0;
      }
    });

    const percentage = maxGrandTotal > 0 ? Math.round((grandTotal / maxGrandTotal) * 100) : 0;

    return { 
      categoryData: cats, 
      totalStats: { 
        score: grandTotal, 
        max: maxGrandTotal, 
        percentage: isNaN(percentage) ? 0 : percentage
      } 
    };
  }, [answers]);

  const chartData = useMemo(() => {
    const categories = Object.keys(categoryData);
    return categories.map((cat, i) => ({
      category: cat,
      ...categoryData[cat],
      angle: (360 / categories.length) * i
    }));
  }, [categoryData]);

  // --- Evolution Data Processing ---
  const evolutionData = useMemo(() => {
    if (!history || !Array.isArray(history)) return [];
    
    return history.map(entry => {
      try {
        const date = new Date(entry.date);
        const month = isNaN(date.getTime()) 
          ? 'N/A' 
          : date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
        
        const year = isNaN(date.getTime())
          ? ''
          : date.getFullYear().toString().slice(2);

        return {
          dateLabel: `${month}/${year}`,
          fullDate: isNaN(date.getTime()) ? 'Data Inválida' : date.toLocaleDateString('pt-BR'),
          score: entry.percentage
        };
      } catch (e) {
        return { dateLabel: '-', fullDate: '-', score: entry.percentage };
      }
    });
  }, [history]);

  // Chart Rendering Helpers
  const renderWheel = () => {
    const cx = 250;
    const cy = 250;
    const radius = 180;
    const innerHole = 40;
    const numSectors = chartData.length || 1; // Prevent division by zero
    const anglePerSector = 360 / numSectors;
    const gap = 2; // degrees gap

    return (
      <svg viewBox="0 0 500 500" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background Track */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.5" />
        <circle cx={cx} cy={cy} r={innerHole} fill="#0f172a" stroke="#334155" strokeWidth="2" />

        {chartData.map((item, index) => {
          const startAngle = index * anglePerSector + gap / 2;
          const endAngle = (index + 1) * anglePerSector - gap / 2;
          const isHovered = hoveredCategory === item.category;
          
          // Calculate bars (5 levels)
          const levels = 5;
          const barHeight = (radius - innerHole - 40) / levels; // Leave room for icon
          
          // Determine color based on severity (Low=Green, Med=Yellow, High=Red)
          let baseColor = "#22c55e"; // Green
          if (item.percentage > 30) baseColor = "#eab308"; // Yellow
          if (item.percentage > 60) baseColor = "#ef4444"; // Red
          
          const sectorElements = [];
          
          // Draw Levels
          const filledLevels = Math.ceil((item.percentage / 100) * levels);

          for (let l = 0; l < levels; l++) {
            const r1 = innerHole + (l * barHeight) + 2; // +2 for spacing
            const r2 = innerHole + ((l + 1) * barHeight) - 2;
            const isFilled = l < filledLevels;
            
            sectorElements.push(
              <path
                key={`level-${l}`}
                d={describeArc(cx, cy, r1, r2, startAngle, endAngle)}
                fill={isFilled ? baseColor : "#1e293b"}
                fillOpacity={isFilled ? (isHovered ? 1 : 0.8) : 0.3}
                className="transition-all duration-300"
              />
            );
          }

          // Icon
          const midAngle = startAngle + (endAngle - startAngle) / 2;
          const iconPos = polarToCartesian(cx, cy, radius - 15, midAngle);
          const IconComp = CATEGORY_ICONS[item.category] || Activity;

          return (
            <g 
              key={item.category} 
              onMouseEnter={() => setHoveredCategory(item.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="cursor-pointer group"
            >
              {/* Hit area for easier hovering */}
              <path 
                d={describeArc(cx, cy, innerHole, radius, startAngle, endAngle)} 
                fill="transparent" 
              />
              {sectorElements}
              
              {/* Icon Group */}
              <g transform={`translate(${iconPos.x}, ${iconPos.y}) rotate(${midAngle + 90})`}>
                 <foreignObject x="-12" y="-12" width="24" height="24">
                   <div className={`flex items-center justify-center w-full h-full text-slate-400 transition-colors duration-300 ${isHovered ? 'text-white scale-125' : ''}`}>
                     <IconComp size={16} strokeWidth={isHovered ? 2.5 : 1.5} />
                   </div>
                 </foreignObject>
              </g>
            </g>
          );
        })}
        
        {/* Center Score */}
        <foreignObject x={cx - 30} y={cy - 30} width="60" height="60" className="pointer-events-none transform rotate-90">
           <div className="w-full h-full rounded-full flex items-center justify-center bg-slate-900 border-2 border-slate-700 shadow-xl">
             <span className={`text-xl font-bold ${totalStats.percentage > 50 ? 'text-red-500' : 'text-yellow-500'}`}>
               {totalStats.percentage}%
             </span>
           </div>
        </foreignObject>
      </svg>
    );
  };

  const activeCategoryData = hoveredCategory ? categoryData[hoveredCategory] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="glass-panel max-w-md w-full p-8 rounded-3xl text-center border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-fade-in">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Relatório Enviado!</h2>
          <p className="text-slate-400 mb-8">
            Nossa equipe recebeu seus dados. Entraremos em contato pelo WhatsApp <strong>{phone}</strong> com sua análise detalhada.
          </p>
          <button onClick={() => window.location.reload()} className="text-slate-500 hover:text-white underline">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // Safety check: If no user profile, don't crash, just show loading or empty
  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-yellow-500/30 p-4 md:p-8 animate-fade-in">
      
      {/* Header Info */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{userProfile.name || 'Usuário'}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-slate-400 text-sm">
             <span className="flex items-center gap-1.5"><Calendar size={14} className="text-yellow-500"/> Nascimento: {formatDateSafe(userProfile.birthDate)}</span>
             <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"/>
             <span className="capitalize text-slate-300">{userProfile.gender || '-'}</span>
             <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"/>
             <span className="flex items-center gap-1.5"><History size={14} className="text-blue-500"/> Avaliações: {history ? history.length : 0}</span>
             <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"/>
             <span className="text-slate-500">{userProfile.email}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
           {/* Back to Menu */}
           <button 
             onClick={onBackToMenu}
             className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-5 py-2 rounded-full font-medium transition-all flex items-center gap-2 text-sm"
           >
             <LayoutGrid size={16} /> Voltar ao Menu
           </button>

           {/* Pain Mapping Button */}
           <button 
             onClick={onStartPainMap}
             className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 text-sm"
           >
             <ClipboardList size={16} /> Mapear Dores
           </button>

           {!formVisible && (
             <button 
               onClick={() => setFormVisible(true)}
               className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-yellow-900/20 flex items-center gap-2 text-sm"
             >
               <Send size={16} /> Contatar Especialista
             </button>
           )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Radar Wheel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="glass-panel rounded-3xl p-4 md:p-8 relative flex-1 min-h-[500px] flex items-center justify-center border border-white/5 bg-slate-900/50">
             
             {/* Wheel */}
             <div className="w-full max-w-[600px] aspect-square relative z-10">
               {renderWheel()}
             </div>

             {/* Decoration */}
             <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Stats & Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Gauge Section */}
          <div className="glass-panel rounded-3xl p-8 border border-white/5 bg-slate-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">Índice Atual de Sintomas</h3>
            
            <div className="relative flex items-center justify-center py-4">
              {/* Semi Circle Gauge SVG */}
              <svg viewBox="0 0 200 110" className="w-full max-w-[300px]">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradient)" strokeWidth="20" strokeLinecap="round" 
                      strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (totalStats.percentage || 0) / 100)} className="transition-all duration-1000 ease-out"/>
                
                {/* Needle */}
                <g transform={`rotate(${((totalStats.percentage || 0) / 100) * 180}, 100, 100)`} className="transition-all duration-1000 ease-out">
                  <path d="M 100 100 L 20 100" stroke="white" strokeWidth="2" transform="rotate(0, 100, 100)" />
                  <circle cx="100" cy="100" r="4" fill="white" />
                </g>
                
                {/* Text */}
                <text x="100" y="85" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">{totalStats.score}</text>
                <text x="100" y="55" textAnchor="middle" fill="#94a3b8" fontSize="10">PONTUAÇÃO</text>
              </svg>
            </div>
          </div>

          {/* Interactive Detail Panel or Evolution Chart */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-slate-900/50 flex-1 min-h-[300px] flex flex-col">
            
            {hoveredCategory && activeCategoryData ? (
              <div className="animate-fade-in h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                  <div className={`p-3 rounded-xl ${activeCategoryData.percentage > 50 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {React.createElement(CATEGORY_ICONS[hoveredCategory] || Activity, { size: 24 })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{hoveredCategory}</h3>
                    <p className="text-sm text-slate-400">
                      Intensidade: <span className={activeCategoryData.percentage > 50 ? "text-red-400" : "text-yellow-400"}>{Math.round(activeCategoryData.percentage)}%</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Sintomas Reportados</h4>
                  {activeCategoryData.questions.filter(q => q.score > 0).length > 0 ? (
                    <ul className="space-y-3">
                      {activeCategoryData.questions.filter(q => q.score > 0).map((q, idx) => (
                        <li key={idx} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                          <span className="text-sm text-slate-200">{q.questionText}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${q.answer === AnswerValue.FREQUENTEMENTE ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                            {q.answer}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                      <CheckCircle size={32} className="mb-2 opacity-50" />
                      <p className="text-sm">Nenhum sintoma significativo relatado nesta área.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : formVisible ? (
              <div className="animate-slide-up h-full flex flex-col justify-center">
                 <h3 className="text-xl font-bold text-white mb-2">Enviar Relatório</h3>
                 <p className="text-sm text-slate-400 mb-6">Confirme seus dados para envio.</p>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Nome completo" 
                      readOnly
                      value={userProfile.name}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                    />
                    <input 
                      type="tel" 
                      placeholder="WhatsApp (DD) 99999-9999" 
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setFormVisible(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                        Cancelar
                      </button>
                      <button type="submit" className="flex-1 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold shadow-lg shadow-yellow-900/30 transition-colors">
                        Enviar
                      </button>
                    </div>
                 </form>
              </div>
            ) : (
              // Evolution Chart - Real History
              <div className="h-full flex flex-col relative">
                 <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4 flex justify-between items-center">
                   Evolução dos Sintomas
                 </h3>
                 
                 <div className="flex-1 min-h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={evolutionData}>
                       <defs>
                         <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                       <XAxis 
                         dataKey="dateLabel" 
                         stroke="#64748b" 
                         fontSize={12} 
                         tickLine={false} 
                         axisLine={false}
                         padding={{ left: 10, right: 10 }}
                       />
                       <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                       <RechartsTooltip 
                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                         itemStyle={{ color: '#fff' }}
                         labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                         cursor={{ stroke: '#334155', strokeWidth: 1 }}
                         formatter={(value: any) => [`${value}%`, 'Pontuação']}
                         labelFormatter={(label, payload) => {
                           if (payload && payload.length > 0) {
                              return payload[0].payload.fullDate;
                           }
                           return label;
                         }}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="score" 
                         stroke="#eab308" 
                         fillOpacity={1} 
                         fill="url(#colorScore)" 
                         strokeWidth={3}
                         isAnimationActive={true}
                         dot={{ r: 4, fill: "#eab308", strokeWidth: 2, stroke: "#fff" }}
                         activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                       />
                       <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'Alerta', fill: '#ef4444', fontSize: 10, position: 'insideBottomRight' }} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
                 
                 <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                   <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
                   <p>Este gráfico mostra o histórico das suas avaliações baseado no seu e-mail.</p>
                 </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
