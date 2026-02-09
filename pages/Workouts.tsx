
import React, { useState } from 'react';
import { UserProfile, WorkoutPlan, WorkoutSplit, Exercise } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { Loader2, Dumbbell, Zap, Play, ChevronRight, Filter, ArrowLeft, Eye } from 'lucide-react';

export const WorkoutView: React.FC<{ profile: UserProfile, workoutPlan: WorkoutPlan | null, onUpdateWorkoutPlan: (p: WorkoutPlan) => void }> = ({ profile, workoutPlan, onUpdateWorkoutPlan }) => {
  const [loading, setLoading] = useState(false);
  const [activeSplit, setActiveSplit] = useState<WorkoutSplit | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const generate = async () => {
    setLoading(true); setShowConfig(false);
    try {
      const plan = await generateWorkoutPlan(profile);
      onUpdateWorkoutPlan(plan);
    } catch (err) { alert("Erro IA"); } finally { setLoading(false); }
  };

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  if (loading) return (
    <div className="min-h-full flex flex-col items-center justify-center p-20 text-center space-y-8 animate-in fade-in">
      <div className="relative">
        <Loader2 className="animate-spin text-emerald-600" size={80} />
        <Zap size={32} className="absolute inset-0 m-auto text-emerald-400" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Sincronizando Fibras...</h2>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px]">Calculando volume proporcional</p>
    </div>
  );

  return (
    <div className="p-8 pb-32 space-y-10 max-w-4xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Treinos</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Divisão Proporcional IA</p>
        </div>
        <button onClick={() => setShowConfig(true)} className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 shadow-sm transition-all hover:scale-105 active:scale-95">
          <Filter size={24} />
        </button>
      </header>

      {!workoutPlan ? (
        <div className="py-24 text-center space-y-12 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-950/20 rounded-[48px] flex items-center justify-center text-emerald-600 mx-auto shadow-2xl shadow-emerald-500/10">
            <Dumbbell size={56} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Corpo de Elite</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-20 leading-loose">Nossa IA criará uma divisão baseada nos seus {profile.workoutDays} dias disponíveis.</p>
          </div>
          <button onClick={generate} className="w-full max-w-sm bg-slate-900 dark:bg-emerald-600 text-white p-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all mx-auto block">
            Montar Meu Treino
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {days.map(day => {
            const letter = workoutPlan.weeklySchedule[day];
            const split = workoutPlan.splits.find(s => s.letter === letter);
            return (
              <div key={day} onClick={() => split && setActiveSplit(split)} className={`p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 flex flex-col gap-6 transition-all active:scale-[0.98] ${!split ? 'opacity-40 grayscale cursor-default' : 'shadow-sm hover:shadow-xl cursor-pointer group'}`}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black italic text-2xl transition-all ${split ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 group-hover:scale-110' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'}`}>
                    {letter || '-'}
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase text-lg italic leading-tight">{split ? split.region || split.name : 'Descanso'}</h3>
                  <p className="text-[9px] font-black text-emerald-600 uppercase mt-1 tracking-widest">{split ? `${split.exercises.length} Exercícios` : 'Recuperação Ativa'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Split Modal */}
      {activeSplit && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-bottom duration-500 p-8 pt-10">
          <header className="flex justify-between items-center max-w-4xl mx-auto w-full mb-10">
            <button onClick={() => setActiveSplit(null)} className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-slate-500 hover:scale-105 active:scale-95 transition-all"><ArrowLeft size={24}/></button>
            <div className="text-right">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Treino {activeSplit.letter}</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{activeSplit.region || activeSplit.name}</h2>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar max-w-4xl mx-auto w-full space-y-4 pb-20">
            {activeSplit.exercises.map((ex, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedExercise(ex)}
                className="bg-white dark:bg-slate-900 p-8 rounded-[48px] shadow-sm border dark:border-slate-800 flex items-center gap-8 group cursor-pointer active:scale-98 transition-all"
              >
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-3xl flex items-center justify-center text-slate-200 relative overflow-hidden group-hover:bg-emerald-50 transition-colors shrink-0">
                  <Play size={32} className="opacity-20 group-hover:opacity-100 group-hover:text-emerald-500 transition-all" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-white uppercase text-lg italic tracking-tight leading-none mb-2">{ex.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {ex.sets} séries x {ex.reps} • {ex.rest}s Descanso
                  </p>
                </div>
                <Eye size={20} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto w-full">
            <button onClick={() => setActiveSplit(null)} className="w-full bg-slate-900 dark:bg-emerald-600 text-white p-8 rounded-[40px] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all">Concluir Sessão</button>
          </div>
        </div>
      )}

      {/* Exercise Detail Viewer (MuscleWiki style) */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[130] flex flex-col bg-slate-950/90 backdrop-blur-xl animate-in fade-in p-6">
          <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl flex flex-col h-full md:h-auto">
             <ExerciseViewer 
               exercise={selectedExercise} 
               onClose={() => setSelectedExercise(null)} 
             />
          </div>
        </div>
      )}

      {showConfig && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[48px] p-10 space-y-10 shadow-2xl animate-in slide-in-from-bottom">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-center">Configurar Rotina</h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Dias disponíveis</p>
                <div className="flex justify-between gap-1">
                  {[2, 3, 4, 5, 6, 7].map(d => (
                    <button key={d} onClick={() => alert("Mude no Perfil")} className={`w-11 h-11 rounded-xl font-black text-xs transition-all ${profile.workoutDays === d ? 'bg-emerald-600 text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowConfig(false)} className="flex-1 p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sair</button>
              <button onClick={generate} className="flex-1 bg-slate-900 dark:bg-emerald-600 text-white p-5 rounded-3xl font-black uppercase tracking-widest shadow-xl">Regerar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// MuscleWiki Style Viewer Component
const ExerciseViewer: React.FC<{ exercise: Exercise, onClose: () => void }> = ({ exercise, onClose }) => {
  const [angle, setAngle] = useState<'front' | 'side'>('front');

  return (
    <div className="flex flex-col h-full">
      {/* Media Player */}
      <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
        <video 
          key={`${exercise.id}-${angle}`}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src={angle === 'front' ? exercise.media.front_gif : (exercise.media.side_gif || exercise.media.front_gif)} type="video/mp4" />
        </video>
        
        {/* Angle Toggles */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          <button 
            onClick={() => setAngle('front')}
            className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full transition-all border ${angle === 'front' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-black/50 border-white/20 text-white'}`}
          >
            Frente
          </button>
          {exercise.media.side_gif && (
            <button 
              onClick={() => setAngle('side')}
              className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full transition-all border ${angle === 'side' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-black/50 border-white/20 text-white'}`}
            >
              Lado
            </button>
          )}
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white backdrop-blur-md">
           <ArrowLeft className="rotate-90" size={20} />
        </button>
      </div>

      {/* Info */}
      <div className="p-8 space-y-8 flex-1 overflow-y-auto no-scrollbar">
        <header>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">{exercise.name}</h3>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-lg uppercase italic">{exercise.difficulty || 'Normal'}</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{exercise.target} • {exercise.sets} Séries</p>
        </header>

        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest italic border-b dark:border-slate-800 pb-2">Instruções Técnicas</h4>
          <ul className="space-y-4">
            {exercise.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">{i + 1}</span>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{step}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex gap-4 pt-4">
           <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl text-center">
             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Repetições</p>
             <p className="text-xl font-black text-slate-900 dark:text-white italic">{exercise.reps}</p>
           </div>
           <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl text-center">
             <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Descanso</p>
             <p className="text-xl font-black text-slate-900 dark:text-white italic">{exercise.rest}s</p>
           </div>
        </div>

        <button onClick={onClose} className="w-full bg-slate-900 dark:bg-emerald-600 text-white p-6 rounded-[32px] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">Fechar Guia</button>
      </div>
    </div>
  );
};
