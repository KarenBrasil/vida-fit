
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Zap } from 'lucide-react';

export const Onboarding: React.FC<{ onComplete: (p: UserProfile) => void }> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (!name.trim()) return;
    onComplete({
      name: name.trim(),
      age: 0,
      height: 0,
      weight: 0,
      targetWeight: 0,
      weightHistory: [],
      gender: 'female',
      activityLevel: 'moderate',
      goal: 'lose_weight',
      intolerances: [],
      dislikes: [],
      preferredFoods: [],
      exerciseLimitations: [],
      exercisePreferences: [],
      mealsPerDay: 4,
      workoutDays: 4,
      workoutTime: 45,
      workoutLocation: 'gym',
      workoutSplitPreference: 'superior_inferior',
      isSetupComplete: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-16 text-center animate-in fade-in zoom-in duration-1000">
        <div className="space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-800 rounded-[56px] flex items-center justify-center mx-auto shadow-3xl shadow-emerald-500/40 rotate-6 group hover:rotate-0 transition-transform duration-500">
            <Zap size={64} className="text-white fill-white group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-2">
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">NUTRI IA</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[8px]">PROTOCOL MASTER EDITION</p>
          </div>
        </div>

        <div className="space-y-10 bg-white/5 backdrop-blur-2xl p-12 rounded-[64px] border border-white/10 shadow-3xl ring-1 ring-white/10">
          <div className="space-y-4 text-left">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block ml-6">QUEM ESTÁ NO COMANDO?</label>
            <input 
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleStart()}
              placeholder="Digite seu nome"
              className="w-full bg-slate-900/50 border border-white/5 p-8 rounded-[32px] text-center font-bold text-3xl outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all placeholder:text-white/10 uppercase"
            />
          </div>
          <button 
            onClick={handleStart}
            disabled={!name.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 p-10 rounded-[32px] font-black uppercase tracking-[4px] flex items-center justify-center gap-6 shadow-3xl shadow-emerald-500/40 active:scale-95 transition-all disabled:opacity-20 text-sm group"
          >
            ENTRAR NO PROTOCOLO <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
