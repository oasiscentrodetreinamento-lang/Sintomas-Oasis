import React from 'react';
import { PainMap } from '../types';

interface BodyMapProps {
  onSelectPart: (id: string, name: string) => void;
  selectedPartId: string | null;
  painMap: PainMap;
  gender: 'masculino' | 'feminino';
  onHover?: (id: string | null, name: string | null) => void;
}

const BodyMap: React.FC<BodyMapProps> = ({ onSelectPart, selectedPartId, painMap, onHover }) => {
  
  // Color helper based on pain level
  const getFillColor = (partId: string) => {
    const isSelected = selectedPartId === partId;
    const entry = painMap[partId];
    
    // Base colors - Darker theme
    const baseColor = isSelected ? 'url(#selectedGradient)' : 'url(#bodyGradient)'; 
    
    if (entry && entry.level > 0) {
      // Color scale logic (solid colors for pain)
      if (entry.level <= 1) return '#22c55e'; // Green
      if (entry.level <= 3) return '#84cc16'; // Lime
      if (entry.level <= 5) return '#eab308'; // Yellow
      if (entry.level <= 7) return '#f97316'; // Orange
      if (entry.level <= 9) return '#ef4444'; // Red
      return '#9333ea'; // Purple (10)
    }

    return baseColor;
  };

  const Part = ({ id, name, d }: { id: string, name: string, d: string }) => {
    const isSelected = selectedPartId === id;
    const hasData = painMap[id] && painMap[id].level > 0;

    return (
      <path
        id={id}
        d={d}
        fill={getFillColor(id)}
        stroke={isSelected ? '#60a5fa' : (hasData ? 'white' : '#94a3b8')}
        strokeWidth={isSelected ? "1.5" : "0.5"}
        className={`cursor-pointer transition-all duration-200 ${!isSelected && !hasData ? 'hover:brightness-110' : ''}`}
        onClick={() => onSelectPart(id, name)}
        onMouseEnter={() => onHover && onHover(id, name)}
        onMouseLeave={() => onHover && onHover(null, null)}
        style={{ filter: isSelected ? 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.6))' : 'none' }}
      />
    );
  };

  // Common Definitions for Gradients
  const Defs = () => (
    <defs>
      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#cbd5e1" /> 
        <stop offset="50%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
         <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
  );

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full max-w-4xl mx-auto select-none">
      
      {/* FRONT VIEW */}
      <div className="relative w-64 h-[600px]">
        <h3 className="text-center text-slate-500 text-xs font-bold mb-4 uppercase tracking-[0.2em] opacity-70">Vista Frontal</h3>
        <svg viewBox="0 0 200 550" className="w-full h-full">
          <Defs />
          <g filter="url(#dropShadow)">
            
            {/* Center Line */}
            <line x1="100" y1="20" x2="100" y2="540" stroke="#000" strokeOpacity="0.1" strokeWidth="0.5" />

            {/* HEAD & NECK */}
            <Part id="head-front" name="Cabeça (Frente)" d="M100,20 C114,20 120,35 120,55 C120,75 112,85 100,85 C88,85 80,75 80,55 C80,35 86,20 100,20 Z" />
            <Part id="neck-front" name="Pescoço" d="M86,82 L114,82 L116,95 C116,95 100,102 84,95 Z" />

            {/* TORSO */}
            {/* Deltoids */}
            <Part id="shoulder-left" name="Ombro Esq." d="M116,95 L145,100 C155,110 152,125 148,135 L128,125 L116,95 Z" />
            <Part id="shoulder-right" name="Ombro Dir." d="M84,95 L55,100 C45,110 48,125 52,135 L72,125 L84,95 Z" />
            
            {/* Pectorals */}
            <Part id="chest-left" name="Peitoral Esq." d="M100,98 L116,95 L128,125 L126,145 C115,155 100,145 100,145 Z" />
            <Part id="chest-right" name="Peitoral Dir." d="M100,98 L84,95 L72,125 L74,145 C85,155 100,145 100,145 Z" />
            
            {/* Abs */}
            <Part id="abs-upper" name="Abdômen Sup." d="M100,145 C115,155 126,145 126,145 L124,180 L100,185 L76,180 L74,145 C74,145 85,155 100,145 Z" />
            <Part id="abs-lower" name="Abdômen Inf." d="M76,180 L100,185 L124,180 L122,205 L100,210 L78,205 Z" />
            <Part id="pelvis" name="Pélvis" d="M78,205 L100,210 L122,205 L126,225 C126,225 100,240 74,225 L78,205 Z" />

            {/* ARMS */}
            <Part id="arm-upper-left" name="Bíceps Esq." d="M148,135 C152,145 150,165 146,175 L130,170 L128,125 Z" />
            <Part id="elbow-left" name="Cotovelo Esq." d="M146,175 C148,185 144,195 132,190 C128,185 128,175 130,170 Z" />
            <Part id="forearm-left" name="Antebraço Esq." d="M144,195 L146,230 L132,225 L132,190 Z" />
            <Part id="wrist-left" name="Punho Esq." d="M146,230 L147,240 L133,235 L132,225 Z" />
            <Part id="hand-left" name="Mão Esq." d="M147,240 L152,265 L135,270 L133,235 Z" />

            <Part id="arm-upper-right" name="Bíceps Dir." d="M52,135 C48,145 50,165 54,175 L70,170 L72,125 Z" />
            <Part id="elbow-right" name="Cotovelo Dir." d="M54,175 C52,185 56,195 68,190 C72,185 72,175 70,170 Z" />
            <Part id="forearm-right" name="Antebraço Dir." d="M56,195 L54,230 L68,225 L68,190 Z" />
            <Part id="wrist-right" name="Punho Dir." d="M54,230 L53,240 L67,235 L68,225 Z" />
            <Part id="hand-right" name="Mão Dir." d="M53,240 L48,265 L65,270 L67,235 Z" />

            {/* LEGS */}
            <Part id="thigh-left" name="Coxa Esq." d="M100,240 L126,225 L134,290 L105,300 Z" />
            <Part id="knee-left" name="Joelho Esq." d="M134,290 C136,310 128,325 105,320 C102,310 102,300 105,300 Z" />
            <Part id="shin-left" name="Canela Esq." d="M128,325 L124,400 L104,395 L105,320 Z" />
            <Part id="ankle-left" name="Tornozelo Esq." d="M124,400 L123,415 L105,410 L104,395 Z" />
            <Part id="foot-left" name="Pé Esq." d="M123,415 L128,445 L100,440 L105,410 Z" />

            <Part id="thigh-right" name="Coxa Dir." d="M100,240 L74,225 L66,290 L95,300 Z" />
            <Part id="knee-right" name="Joelho Dir." d="M66,290 C64,310 72,325 95,320 C98,310 98,300 95,300 Z" />
            <Part id="shin-right" name="Canela Dir." d="M72,325 L76,400 L96,395 L95,320 Z" />
            <Part id="ankle-right" name="Tornozelo Dir." d="M76,400 L77,415 L95,410 L96,395 Z" />
            <Part id="foot-right" name="Pé Dir." d="M77,415 L72,445 L100,440 L95,410 Z" />
          </g>
        </svg>
      </div>

      {/* BACK VIEW */}
      <div className="relative w-64 h-[600px]">
        <h3 className="text-center text-slate-500 text-xs font-bold mb-4 uppercase tracking-[0.2em] opacity-70">Vista Posterior</h3>
        <svg viewBox="0 0 200 550" className="w-full h-full">
           <Defs />
           <g filter="url(#dropShadow)">
            <line x1="100" y1="20" x2="100" y2="540" stroke="#000" strokeOpacity="0.1" strokeWidth="0.5" />

            {/* Head & Neck */}
            <Part id="head-back" name="Nuca" d="M100,20 C114,20 120,35 120,55 C120,75 112,85 100,85 C88,85 80,75 80,55 C80,35 86,20 100,20 Z" />
            <Part id="neck-back" name="Pescoço (Post.)" d="M86,82 L114,82 L116,95 C116,95 100,102 84,95 Z" />

            {/* Back Torso */}
            <Part id="shoulder-blade-left" name="Escápula Esq." d="M116,95 L145,100 L138,140 L100,145 L100,98 Z" />
            <Part id="shoulder-blade-right" name="Escápula Dir." d="M84,95 L55,100 L62,140 L100,145 L100,98 Z" />
            
            <Part id="back-mid" name="Dorsal" d="M62,140 L138,140 L132,180 L68,180 Z" />
            <Part id="back-lower" name="Lombar" d="M68,180 L132,180 L126,205 L74,205 Z" />
            
            <Part id="glute-left" name="Glúteo Esq." d="M100,205 L126,205 L130,240 C120,250 110,245 100,245 Z" />
            <Part id="glute-right" name="Glúteo Dir." d="M100,205 L74,205 L70,240 C80,250 90,245 100,245 Z" />

            {/* Arms Back */}
            <Part id="arm-back-upper-left" name="Tríceps Esq." d="M145,100 C155,110 152,150 148,165 L130,160 L138,140 Z" />
            <Part id="elbow-back-left" name="Cotovelo Esq." d="M148,165 L150,185 L132,180 L130,160 Z" />
            <Part id="forearm-back-left" name="Antebraço Post. Esq." d="M150,185 L152,220 L134,215 L132,180 Z" />
            <Part id="wrist-back-left" name="Punho Esq." d="M152,220 L153,230 L135,225 L134,215 Z" />
            <Part id="hand-back-left" name="Mão Post. Esq." d="M153,230 L158,255 L140,260 L135,225 Z" />

            <Part id="arm-back-upper-right" name="Tríceps Dir." d="M55,100 C45,110 48,150 52,165 L70,160 L62,140 Z" />
            <Part id="elbow-back-right" name="Cotovelo Dir." d="M52,165 L50,185 L68,180 L70,160 Z" />
            <Part id="forearm-back-right" name="Antebraço Post. Dir." d="M50,185 L48,220 L66,215 L68,180 Z" />
            <Part id="wrist-back-right" name="Punho Dir." d="M48,220 L47,230 L65,225 L66,215 Z" />
            <Part id="hand-back-right" name="Mão Post. Dir." d="M47,230 L42,255 L60,260 L65,225 Z" />

            {/* Legs Back */}
            <Part id="thigh-back-left" name="Posterior Coxa Esq." d="M100,245 L130,240 L134,290 L105,300 Z" />
            <Part id="knee-back-left" name="Fossa Poplítea Esq." d="M134,290 C136,310 128,325 105,320 C102,310 102,300 105,300 Z" />
            <Part id="calf-left" name="Panturrilha Esq." d="M128,325 C132,345 128,370 124,390 L104,385 L105,320 Z" />
            <Part id="ankle-back-left" name="Tendão Aquiles Esq." d="M124,390 L123,415 L105,410 L104,385 Z" />
            <Part id="heel-left" name="Calcanhar Esq." d="M123,415 L128,445 L100,440 L105,410 Z" />

            <Part id="thigh-back-right" name="Posterior Coxa Dir." d="M100,245 L70,240 L66,290 L95,300 Z" />
            <Part id="knee-back-right" name="Fossa Poplítea Dir." d="M66,290 C64,310 72,325 95,320 C98,310 98,300 95,300 Z" />
            <Part id="calf-right" name="Panturrilha Dir." d="M72,325 C68,345 72,370 76,390 L96,385 L95,320 Z" />
            <Part id="ankle-back-right" name="Tendão Aquiles Dir." d="M76,390 L77,415 L95,410 L96,385 Z" />
            <Part id="heel-right" name="Calcanhar Dir." d="M77,415 L72,445 L100,440 L95,410 Z" />
           </g>
        </svg>
      </div>

    </div>
  );
};

export default BodyMap;