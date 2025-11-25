import React, { useState, useMemo } from 'react';
import { PainMap, PainHistoryEntry, UserProfile, PainEntry } from '../types';
import BodyMap from './BodyMap';
import { Calendar, History, Mail, ArrowLeft, Info } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

interface PainResultsProps {
  currentMap: PainMap;
  history: PainHistoryEntry[];
  userProfile: UserProfile;
  onBack: () => void;
}

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

const PainResults: React.FC<PainResultsProps> = ({ currentMap, history, userProfile, onBack }) => {
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [hoveredPartName, setHoveredPartName] = useState<string | null>(null);

  // Calculate current total score
  const currentTotalScore = useMemo(() => {
    return Object.values(currentMap).reduce((acc: number, curr: PainEntry) => acc + curr.level, 0);
  }, [currentMap]);

  // Prepare Evolution Data
  const evolutionData = useMemo(() => {
    // Combine history with current session
    const allEntries = [...(history || [])];
    
    // Add current session if not already in history (it should be added by App.tsx, but just in case)
    // Actually, App.tsx adds it to history before switching view, so we just use history.
    // However, if the chart looks empty, we can verify.
    
    if (allEntries.length === 0) {
       return [{
         dateLabel: new Date().toLocaleDateString('pt-BR', { month: 'short' }),
         fullDate: new Date().toLocaleDateString('pt-BR'),
         score: currentTotalScore
       }];
    }

    return allEntries.map(entry => {
      const date = new Date(entry.date);
      return {
        dateLabel: date.toLocaleDateString('pt-BR', { month: 'short' }),
        fullDate: date.toLocaleDateString('pt-BR'),
        score: entry.totalScore
      };
    });
  }, [history, currentTotalScore]);

  // Find previous entry for comparison
  const previousMap = useMemo(() => {
    if (!history || history.length < 2) return null;
    // Assuming history is sorted oldest to newest, the previous one is index length - 2
    return history[history.length - 2].painMap;
  }, [history]);

  // Get data for hovered part
  const hoveredData = useMemo(() => {
    if (!hoveredPartId) return null;
    
    const current = currentMap[hoveredPartId];
    const previous = previousMap ? previousMap[hoveredPartId] : null;

    return {
      name: hoveredPartName || current?.bodyPartName || 'Desconhecido',
      currentLevel: current?.level || 0,
      previousLevel: previous?.level || 0,
      notes: current?.notes || ''
    };
  }, [hoveredPartId, hoveredPartName, currentMap, previousMap]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 animate-fade-in selection:bg-red-500/30">
      
      {/* Header Info */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mapeamento da Dor</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-slate-400 text-sm">
             <span className="font-semibold text-white">{userProfile.name}</span>
             <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"/>
             <span className="flex items-center gap-1.5"><Calendar size={14} className="text-red-500"/> {formatDateSafe(userProfile.birthDate)}</span>
             <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"/>
             <span className="capitalize text-slate-300">{userProfile.gender || '-'}</span>
             <span className="hidden sm:inline w-1 h-1 bg-slate-700 rounded-full"/>
             <span className="flex items-center gap-1.5"><History size={14} className="text-blue-500"/> Registros: {history ? history.length : 0}</span>
          </div>
        </div>
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Left Column: Body Map (Interactive) */}
        <div className="lg:col-span-7 flex flex-col relative">
          <div className="glass-panel rounded-3xl p-4 md:p-8 relative flex-1 min-h-[600px] flex items-center justify-center border border-white/5 bg-slate-900/50">
             <BodyMap 
                gender={userProfile.gender}
                onSelectPart={() => {}} // Read only
                selectedPartId={hoveredPartId} // Highlight hovered
                painMap={currentMap}
                onHover={(id, name) => {
                  setHoveredPartId(id);
                  setHoveredPartName(name);
                }}
             />

             {/* Floating Tooltip */}
             {hoveredPartId && hoveredData && (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
                 <div className="glass-panel bg-slate-900/95 p-4 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl min-w-[200px] animate-fade-in">
                    <h3 className="font-bold text-white mb-3 pb-2 border-b border-white/10">{hoveredData.name}</h3>
                    <div className="flex justify-between items-end mb-2">
                       <div className="text-center">
                          <div className="text-xs text-slate-500 uppercase">Anterior</div>
                          <div className="text-xl font-mono text-slate-400">{hoveredData.previousLevel > 0 ? hoveredData.previousLevel : '-'}</div>
                       </div>
                       <div className="text-center">
                          <div className="text-xs text-slate-500 uppercase">Atual</div>
                          <div className={`text-2xl font-bold font-mono ${
                            hoveredData.currentLevel > 7 ? 'text-red-500' : 
                            hoveredData.currentLevel > 4 ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                            {hoveredData.currentLevel > 0 ? hoveredData.currentLevel : '-'}
                          </div>
                       </div>
                    </div>
                    {hoveredData.notes && (
                      <div className="mt-3 text-xs text-slate-400 bg-white/5 p-2 rounded border border-white/5">
                        <span className="block text-[10px] uppercase text-slate-600 mb-1">Obs:</span>
                        {hoveredData.notes}
                      </div>
                    )}
                    <div className="mt-2 text-[10px] text-slate-600 text-center pt-2">
                       Clique na parte para ver o histórico
                    </div>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Stats & Charts */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Total Score Gauge */}
          <div className="glass-panel rounded-3xl p-8 border border-white/5 bg-slate-900/50 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative flex items-center justify-center py-4 w-full">
              {/* Semi Circle Gauge SVG */}
              <svg viewBox="0 0 200 110" className="w-full max-w-[350px]">
                <defs>
                  <linearGradient id="painGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
                  </filter>
                </defs>
                
                {/* Track */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />
                
                {/* Progress */}
                {/* Assuming max score roughly 100 for visualization purposes, though it can go higher */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#painGradient)" strokeWidth="20" strokeLinecap="round" 
                      strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - Math.min(currentTotalScore, 100) / 100)} className="transition-all duration-1000 ease-out"/>
                
                {/* Needle */}
                <g transform={`rotate(${Math.min((currentTotalScore / 100) * 180, 180)}, 100, 100)`} className="transition-all duration-1000 ease-out">
                  <path d="M 100 100 L 100 30 L 95 40 L 105 40 Z" fill="#facc15" filter="url(#shadow)" transform="rotate(-90, 100, 100)" />
                  <circle cx="100" cy="100" r="5" fill="#facc15" />
                </g>
                
                {/* Score Text */}
                <text x="100" y="85" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold" filter="url(#shadow)">{currentTotalScore}</text>
              </svg>
            </div>
          </div>

          {/* Evolution Chart */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-slate-900/50 flex-1 min-h-[300px] flex flex-col">
             <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6 text-center">
               Evolução do Escore de Dor
             </h3>
             
             <div className="flex-1 min-h-[200px]">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={evolutionData}>
                   <defs>
                     <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
                   <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <RechartsTooltip 
                     contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                     itemStyle={{ color: '#fff' }}
                     labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                     cursor={{ stroke: '#334155', strokeWidth: 1 }}
                   />
                   <Area 
                     type="monotone" 
                     dataKey="score" 
                     stroke="#ef4444" 
                     fillOpacity={1} 
                     fill="url(#colorPain)" 
                     strokeWidth={3}
                     isAnimationActive={true}
                     dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
                     activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PainResults;