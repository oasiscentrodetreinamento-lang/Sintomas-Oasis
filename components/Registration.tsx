
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Calendar, ArrowRight } from 'lucide-react';

interface RegistrationProps {
  onRegister: (profile: UserProfile) => void;
  onCancel: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister, onCancel }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    birthDate: '',
    gender: 'masculino'
  });

  const isFormValid = profile.name && profile.email && profile.birthDate && profile.gender;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onRegister(profile);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Identificação</h2>
            <p className="text-slate-400 text-sm">
              Informe os dados do aluno para iniciar a avaliação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-slate-600"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-slate-600"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">Data de Nascimento</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="date"
                  required
                  value={profile.birthDate}
                  onChange={e => setProfile({ ...profile, birthDate: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">Gênero</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'masculino' })}
                  className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${
                    profile.gender === 'masculino' 
                      ? 'bg-brand/20 border-brand text-brand-light' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Masculino
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'feminino' })}
                  className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${
                    profile.gender === 'feminino' 
                      ? 'bg-brand/20 border-brand text-brand-light' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Feminino
                </button>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 group"
              >
                Começar Agora <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
