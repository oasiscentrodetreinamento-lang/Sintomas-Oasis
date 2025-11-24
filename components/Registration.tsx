
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Calendar, ArrowRight, Search, AlertCircle } from 'lucide-react';

interface RegistrationProps {
  onRegister: (profile: UserProfile) => void;
  onCancel: () => void;
  onSearch: (email: string) => boolean;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister, onCancel, onSearch }) => {
  const [mode, setMode] = useState<'register' | 'search'>('register');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchError, setSearchError] = useState('');

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    
    if (!searchEmail) return;

    const found = onSearch(searchEmail);
    if (!found) {
      setSearchError('Nenhum registro encontrado para este e-mail.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative animate-fade-in">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="glass-panel p-8 rounded-3xl border border-white/5">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === 'register' ? 'Nova Avaliação' : 'Buscar Histórico'}
            </h2>
            <p className="text-slate-400 text-sm">
              {mode === 'register' 
                ? 'Informe os dados do aluno para iniciar.' 
                : 'Digite o e-mail para visualizar avaliações anteriores.'}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6">
            <button 
              onClick={() => { setMode('register'); setSearchError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'register' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Novo Cadastro
            </button>
            <button 
              onClick={() => { setMode('search'); setSearchError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'search' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Buscar Aluno
            </button>
          </div>

          {mode === 'register' ? (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
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
          ) : (
            <form onSubmit={handleSearchSubmit} className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">E-mail do Aluno</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    required
                    value={searchEmail}
                    onChange={e => setSearchEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-slate-600"
                    placeholder="Digite o e-mail cadastrado"
                  />
                </div>
              </div>

              {searchError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  <AlertCircle size={16} />
                  <span>{searchError}</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                 <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group"
                >
                  Buscar Histórico <Search size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Registration;
