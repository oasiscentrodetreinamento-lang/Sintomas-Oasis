import React, { useState } from 'react';
import { UserProfile, PainMap } from '../types';
import BodyMap from './BodyMap';
import { Save, X, User as UserIcon, Calendar, Trash2 } from 'lucide-react';

interface PainAssessmentProps {
  userProfile: UserProfile;
  onCancel: () => void;
  onSave: (data: PainMap) => void;
}

const PainAssessment: React.FC<PainAssessmentProps> = ({ userProfile, onCancel, onSave }) => {
  const [painMap, setPainMap] = useState<PainMap>({});
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [selectedPartName, setSelectedPartName] = useState<string>('');

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSelectPart = (id: string, name: string) => {
    setSelectedPartId(id);
    setSelectedPartName(name);
  };

  const handlePainLevel = (level: number) => {
    if (!selectedPartId) return;

    setPainMap(prev => ({
      ...prev,
      [selectedPartId]: {
        bodyPartId: selectedPartId,
        bodyPartName: selectedPartName,
        level: level,
        notes: prev[selectedPartId]?.notes || ''
      }
    }));
  };

  const handleNotes = (notes: string) => {
    if (!selectedPartId) return;
    
    setPainMap(prev => ({
      ...prev,
      [selectedPartId]: {
        ...prev[selectedPartId],
        level: prev[selectedPartId]?.level || 0, // Default to 0 if only notes are added
        bodyPartName: selectedPartName,
        notes: notes
      }
    }));
  };

  const handleClear = () => {
    if (confirm("Deseja limpar todos os dados do mapa?")) {
      setPainMap({});
      setSelectedPartId(null);
    }
  };

  const currentEntry = selectedPartId ? painMap[selectedPartId] : null;

  // Pain Scale Colors for buttons
  const scaleColors = [
    { val: 0, color: 'bg-slate-600', label: '0' },
    { val: 1, color: 'bg-green-500', label: '1' },
    { val: 2, color: 'bg-green-600', label: '2' },
    { val: 3, color: 'bg-yellow-400', label: '3' },
    { val: 4, color: 'bg-yellow-500', label: '4' },
    { val: 5, color: 'bg-orange-500', label: '5' },
    { val: 6, color: 'bg-orange-600', label: '6' },
    { val: 7, color: 'bg-red-500', label: '7' },
    { val: 8, color: 'bg-red-600', label: '8' },
    { val: 9, color: 'bg-purple-600', label: '9' },
    { val: 10, color: 'bg-purple-800', label: '10' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 animate-fade-in flex flex-col">
      
      {/* HEADER INFO */}
      <div className="glass-panel p-6 rounded-2xl mb-6 border border-white/5">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          Cadastrar novo mapa da dor
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
           <div className="space-y-1">
             <label className="text-slate-500 uppercase text-xs font-semibold flex items-center gap-1">
               <Trash2 size={12} className="text-red-400 cursor-pointer" onClick={handleClear}/> Email
             </label>
             <div className="bg-slate-800/50 p-3 rounded-lg text-slate-300 border border-slate-700">
               {userProfile.email}
             </div>
           </div>

           <div className="space-y-1 md:col-span-2">
             <label className="text-slate-500 uppercase text-xs font-semibold flex items-center gap-1">
               <UserIcon size={12} className="text-brand"/> Nome
             </label>
             <div className="bg-slate-800/50 p-3 rounded-lg text-slate-300 border border-slate-700 flex justify-between items-center">
               <span>{userProfile.name}</span>
               <span className="text-xs text-red-400 cursor-pointer hover:underline">Alterar dados do avaliado</span>
             </div>
           </div>

           <div className="space-y-1">
             <label className="text-slate-500 uppercase text-xs font-semibold flex items-center gap-1">
                <Calendar size={12}/> Idade
             </label>
             <div className="bg-slate-800/50 p-3 rounded-lg text-white font-bold text-center border border-slate-700">
                {calculateAge(userProfile.birthDate)} Anos
             </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* BODY MAP AREA */}
        <div className="flex-1 glass-panel rounded-3xl p-4 md:p-8 flex items-center justify-center border border-white/5 bg-slate-900/50 relative">
          <BodyMap 
            gender={userProfile.gender} 
            onSelectPart={handleSelectPart} 
            selectedPartId={selectedPartId}
            painMap={painMap}
          />
          <p className="absolute bottom-4 text-slate-600 text-xs">
            Toque em uma parte do corpo para registrar
          </p>
        </div>

        {/* CONTROLS AREA */}
        <div className="lg:w-[450px] glass-panel rounded-3xl p-6 border border-white/5 flex flex-col">
          
          <div className="mb-6 text-center">
             <h3 className="text-lg font-medium text-slate-300">
               {selectedPartName ? (
                 <>Região: <span className="text-brand font-bold">{selectedPartName}</span></>
               ) : (
                 "Selecione uma região"
               )}
             </h3>
             <p className="text-sm text-slate-500">Defina a intensidade da dor</p>
          </div>

          {/* Pain Scale */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {scaleColors.map((item) => (
              <button
                key={item.val}
                disabled={!selectedPartId}
                onClick={() => handlePainLevel(item.val)}
                className={`
                  w-10 h-10 rounded-lg font-bold text-white shadow-lg transition-all
                  ${item.color}
                  ${selectedPartId ? 'hover:scale-110 active:scale-95' : 'opacity-30 cursor-not-allowed grayscale'}
                  ${currentEntry?.level === item.val ? 'ring-2 ring-white scale-110' : ''}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Observations */}
          <div className="flex-1 flex flex-col">
             <label className="text-sm text-slate-400 mb-2">Observações sobre a dor</label>
             <textarea 
               className="flex-1 w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-200 resize-none focus:outline-none focus:border-brand transition-colors placeholder:text-slate-600"
               placeholder={selectedPartId ? "Descreva o tipo de dor (pontada, queimação, etc)..." : "Selecione uma parte do corpo primeiro."}
               disabled={!selectedPartId}
               value={currentEntry?.notes || ''}
               onChange={(e) => handleNotes(e.target.value)}
             />
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button 
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onSave(painMap)}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-900/30 transition-colors"
            >
              Salvar Mapa
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PainAssessment;