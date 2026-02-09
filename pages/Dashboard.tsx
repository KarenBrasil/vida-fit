
import React from 'react';
import { UserProfile, NutritionPlan, Macros, Meal, DailyLog } from '../types';
import { Camera, AlertCircle, Dumbbell, CheckCircle2, Moon, Sun, TrendingUp, Zap, Target } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  plan: NutritionPlan | null;
  todayMeals: Meal[];
  onAnalyze: () => void;
  onGoToProfile: () => void;
  onUpdateWeight: (w: number, t: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  dailyLogs: Record<string, DailyLog>;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, plan, todayMeals, onAnalyze, onGoToProfile, isDarkMode, toggleDarkMode, dailyLogs }) => {
  const consumed: Macros = todayMeals.reduce((acc, meal) => {
    if (meal.completed) {
      acc.calories += meal.macros.calories;
      acc.protein += meal.macros.protein;
      acc.carbs += meal.macros.carbs;
      acc.fats += meal.macros.fats;
    }
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const target = plan?.dailyTarget || { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const progress = target.calories > 0 ? Math.min(Math.round((consumed.calories / target.calories) * 100), 100) : 0;
  const remaining = Math.max(target.calories - consumed.calories, 0);

  const getWeekStats = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    let count = 0;
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const completed = dailyLogs[key]?.workoutCompleted;
      if (completed) count++;
      days.push({ key, completed, label: ['D','S','T','Q','Q','S','S'][i] });
    }
    return { count, days };
  };

  const { count, days } = getWeekStats();

  return (
    <div className="p-8 pb-32 space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[5px]">BEM-VINDO AO COMANDO, {profile.name}</p>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none">PAINEL MASTER</h1>
        </div>
        <button onClick={toggleDarkMode} className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-[24px] flex items-center justify-center text-slate-500 shadow-xl transition-all hover:scale-105 active:scale-95">
          {isDarkMode ? <Sun size={28} className="text-white" /> : <Moon size={28} />}
        </button>
      </header>

      {!profile.isSetupComplete && (
        <div className="bg-emerald-600 p-12 rounded-[56px] text-white flex flex-col md:flex-row items-center gap-12 shadow-3xl shadow-emerald-500/40 border border-emerald-400/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
          <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center shrink-0">
            <AlertCircle size={48} />
          </div>
          <div className="flex-1 text-center md:text-left z-10">
            <h4 className="text-3xl font-black uppercase italic tracking-tight mb-2">CALIBRAGEM PENDENTE</h4>
            <p className="text-sm opacity-90 font-medium leading-relaxed max-w-sm">Seu motor de IA precisa dos seus dados biométricos para calcular o Protocolo EBN com precisão científica.</p>
          </div>
          <button onClick={onGoToProfile} className="bg-white text-emerald-600 px-12 py-6 rounded-[28px] font-black uppercase shadow-2xl transition-all active:scale-95 text-[10px] tracking-widest animate-pulse z-10">
            CONFIGURAR AGORA
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="bg-slate-900 border border-slate-800 rounded-[64px] p-12 text-white shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-[120px]" />
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[5px] flex items-center gap-2">
                <TrendingUp size={14} /> SALDO KCAL
              </span>
              <h2 className="text-7xl font-black italic tracking-tighter leading-none">
                {target.calories > 0 ? remaining : '--'} <span className="text-sm font-normal opacity-40 uppercase tracking-widest not-italic">restantes</span>
              </h2>
            </div>
            <div className="w-32 h-32 relative group-hover:scale-110 transition-transform duration-500">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                <circle cx="64" cy="64" r="58" stroke="#10b981" strokeWidth="12" fill="transparent" 
                  strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * progress / 100)} 
                  className="transition-all duration-1000" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 rounded-[64px] p-12 space-y-12 shadow-sm backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-[20px] flex items-center justify-center text-emerald-500">
                <Dumbbell size={28} />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[3px] italic">FREQUÊNCIA GYM</h3>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-6 py-2.5 rounded-2xl uppercase tracking-widest italic">{count}/{profile.workoutDays || 0} DIAS</span>
          </div>
          <div className="flex justify-between items-center px-4">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-5">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{d.label}</span>
                <div className={`w-12 h-12 rounded-[22px] flex items-center justify-center transition-all ${d.completed ? 'bg-emerald-500 text-white shadow-xl scale-110' : 'bg-slate-50 dark:bg-slate-900 text-slate-200'}`}>
                  {d.completed ? <CheckCircle2 size={24} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full bg-current opacity-20" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <MacroCard label="PROTEÍNA" current={consumed.protein} target={target.protein} color="bg-emerald-500" />
        <MacroCard label="CARBOIDRATOS" current={consumed.carbs} target={target.carbs} color="bg-blue-500" />
        <MacroCard label="GORDURAS" current={consumed.fats} target={target.fats} color="bg-orange-500" />
      </div>

      <button onClick={onAnalyze} className="w-full bg-slate-900 hover:bg-slate-800 text-white p-14 rounded-[64px] shadow-3xl flex items-center gap-12 transition-all active:scale-98 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
        <div className="w-28 h-28 bg-emerald-600 rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-emerald-600/30">
          <Camera size={52} />
        </div>
        <div className="text-left flex-1 space-y-2">
          <h4 className="font-black text-4xl uppercase tracking-tighter italic leading-none">SCANNER NUTRI</h4>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[5px]">ANÁLISE INSTANTÂNEA POR FOTO</p>
        </div>
        <Zap size={40} className="opacity-20 animate-pulse text-emerald-500" />
      </button>
    </div>
  );
};

const MacroCard = ({ label, current, target, color }: any) => {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  return (
    <div className="bg-white/50 dark:bg-slate-800/20 border border-slate-100 dark:border-white/5 p-10 rounded-[48px] space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-[11px] font-black text-slate-900 dark:text-white tracking-widest">{current}G <span className="opacity-30">/ {target}G</span></p>
      </div>
      <div className="h-4 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-1">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};
