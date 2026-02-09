
import React, { useState } from 'react';
import { UserProfile, Goal, ActivityLevel } from '../types';
import { Scale, Heart, Trash2, Plus, Sparkles, User, Info, Save } from 'lucide-react';

export const ProfileView: React.FC<{ profile: UserProfile, onUpdate: (p: UserProfile) => void, toggleDarkMode: () => void, isDarkMode: boolean }> = ({ profile, onUpdate, toggleDarkMode, isDarkMode }) => {
  const [form, setForm] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);
  const [newFood, setNewFood] = useState('');

  const save = () => {
    onUpdate({ ...form, isSetupComplete: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addFood = () => {
    if (!newFood.trim()) return;
    setForm({ ...form, preferredFoods: [...form.preferredFoods, newFood.trim()] });
    setNewFood('');
  };

  return (
    <div className="p-10 pb-48 space-y-12 animate-in fade-in">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none">CONFIGURAÇÕES</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[5px]">MODO DE CALIBRAGEM IA</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 border transition-all ${form.isSetupComplete ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-orange-500/10 text-orange-600 border-orange-500/20 animate-pulse'}`}>
          <Sparkles size={16} /> {form.isSetupComplete ? 'PROTOCOL ATIVO' : 'AJUSTE NECESSÁRIO'}
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
        <section className="bg-white/50 dark:bg-slate-800/20 p-12 rounded-[64px] border border-slate-100 dark:border-white/5 space-y-10 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
               <User size={24} />
            </div>
            <h2 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-[3px] italic">PERFIL BASE</h2>
          </div>
          <div className="space-y-8">
            <PInput label="NOME DE EXIBIÇÃO" value={form.name} onChange={v => setForm({...form, name: v})} />
            <div className="grid grid-cols-2 gap-8">
              <PInput label="IDADE" value={form.age} type="number" onChange={v => setForm({...form, age: parseInt(v) || 0})} />
              <PInput label="GÊNERO" value={form.gender} isSelect options={[{v:'male', l:'MASCULINO'}, {v:'female', l:'FEMININO'}]} onChange={v => setForm({...form, gender: v as any})} />
            </div>
          </div>
        </section>

        <section className="bg-white/50 dark:bg-slate-800/20 p-12 rounded-[64px] border border-slate-100 dark:border-white/5 space-y-10 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
               <Scale size={24} />
            </div>
            <h2 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-[3px] italic">BIOMETRIA (EBN)</h2>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <PInput label="PESO (KG)" value={form.weight} type="number" onChange={v => setForm({...form, weight: parseFloat(v) || 0})} />
            <PInput label="META (KG)" value={form.targetWeight} type="number" onChange={v => setForm({...form, targetWeight: parseFloat(v) || 0})} />
            <PInput label="ALTURA (CM)" value={form.height} type="number" onChange={v => setForm({...form, height: parseInt(v) || 0})} />
            <PInput label="TREINOS/SEM" value={form.workoutDays} type="number" onChange={v => setForm({...form, workoutDays: parseInt(v) || 0})} />
          </div>
        </section>

        <section className="bg-white/50 dark:bg-slate-800/20 p-12 rounded-[64px] border border-slate-100 dark:border-white/5 space-y-10 shadow-sm backdrop-blur-md lg:col-span-2">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
               <Heart size={24} />
            </div>
            <h2 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-[3px] italic">ESTRATÉGIA E GOSTOS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <PInput label="META ATUAL" value={form.goal} isSelect options={[{v:'lose_weight', l:'EMAGRECER'}, {v:'gain_weight', l:'GANHAR MASSA'}, {v:'maintain', l:'MANTER'}, {v:'definition', l:'DEFINIÇÃO'}]} onChange={v => setForm({...form, goal: v as any})} />
               <PInput label="ATIVIDADE" value={form.activityLevel} isSelect options={[{v:'sedentary', l:'SEDENTÁRIO'}, {v:'light', l:'LEVE'}, {v:'moderate', l:'MODERADO'}, {v:'intense', l:'INTENSO'}]} onChange={v => setForm({...form, activityLevel: v as any})} />
            </div>
            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">ALIMENTOS PREFERIDOS</label>
              <div className="flex gap-3">
                <input placeholder="Ex: Whey, Frango..." value={newFood} onChange={e => setNewFood(e.target.value)} className="flex-1 bg-slate-100 dark:bg-slate-900 p-6 rounded-3xl font-black text-sm outline-none border border-transparent focus:border-emerald-500/30 text-white" />
                <button onClick={addFood} className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all"><Plus size={24}/></button>
              </div>
              <div className="flex flex-wrap gap-3">
                {form.preferredFoods.map((f, i) => (
                  <span key={i} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 shadow-sm border border-slate-100 dark:border-white/5">
                    {f} <Trash2 size={14} className="cursor-pointer text-red-500" onClick={() => setForm({...form, preferredFoods: form.preferredFoods.filter((_, idx) => idx !== i)})} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <button onClick={save} className={`w-full max-w-xl mx-auto p-12 rounded-[56px] font-black uppercase tracking-[5px] text-xs shadow-3xl transition-all active:scale-95 flex items-center justify-center gap-5 ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-emerald-600 text-white shadow-emerald-500/30'}`}>
        {saved ? 'PROTOCOLO ATUALIZADO!' : 'SALVAR E CALCULAR PROTOCOLO'} <Save size={20} />
      </button>
    </div>
  );
};

const PInput = ({ label, value, onChange, type = "text", isSelect = false, options = [] }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">{label}</label>
    {isSelect ? (
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 p-7 rounded-[32px] font-black text-slate-900 dark:text-white text-xs outline-none border border-transparent focus:border-emerald-500/30 appearance-none cursor-pointer">
        {options.map((o: any) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    ) : (
      <input type={type} value={value === 0 ? '' : value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 p-7 rounded-[32px] font-black text-slate-900 dark:text-white text-xl text-center outline-none border border-transparent focus:border-emerald-500/30" placeholder="--" />
    )}
  </div>
);
