
import React from 'react';
import { DailyLog } from '../types';
import { Calendar as CalendarIcon, CheckCircle, Circle } from 'lucide-react';

interface CalendarProps {
  dailyLogs: Record<string, DailyLog>;
}

export const CalendarView: React.FC<CalendarProps> = ({ dailyLogs }) => {
  const today = new Date();
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Explicitly type logValues and reduce parameters to fix unknown type errors
  const logValues = Object.values(dailyLogs) as DailyLog[];
  const totalMealsPlanned = logValues.reduce((acc: number, log: DailyLog) => acc + (log.meals?.length || 0), 0);
  const totalMealsCompleted = logValues.reduce((acc: number, log: DailyLog) => acc + (log.meals?.filter(m => m.completed).length || 0), 0);
  const adherence = totalMealsPlanned > 0 ? Math.round((totalMealsCompleted / totalMealsPlanned) * 100) : 0;

  const getWeekDays = () => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const key = d.toISOString().split('T')[0];
      return {
        date: d.getDate(),
        dayLabel: daysOfWeek[i],
        key: key,
        isToday: key === today.toISOString().split('T')[0],
        completed: dailyLogs[key]?.meals.every(m => m.completed) && (dailyLogs[key]?.meals.length || 0) > 0,
        partial: dailyLogs[key]?.meals.some(m => m.completed) && !dailyLogs[key]?.meals.every(m => m.completed)
      };
    });
  };

  const currentWeek = getWeekDays();
  const todayKey = today.toISOString().split('T')[0];
  const todayMeals = dailyLogs[todayKey]?.meals || [];

  return (
    <div className="p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Histórico</h1>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase">
          <CalendarIcon size={14} /> 
          {today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </div>
      </header>

      {/* Week View */}
      <div className="flex justify-between gap-1">
        {currentWeek.map((day) => (
          <div key={day.key} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-[10px] font-black text-slate-400 uppercase">{day.dayLabel}</span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all border ${
              day.isToday ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-emerald-600' : 
              day.completed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              day.partial ? 'bg-orange-50 text-orange-600 border-orange-100' :
              'bg-white border-slate-100 text-slate-400'
            }`}>
              {day.date}
            </div>
            {day.completed ? (
              <CheckCircle size={14} className="text-emerald-500" />
            ) : day.partial ? (
              <Circle size={14} className="text-orange-400 fill-orange-400 opacity-30" />
            ) : (
              <Circle size={14} className="text-slate-100" />
            )}
          </div>
        ))}
      </div>

      {/* Today's Log Details */}
      <section className="space-y-4">
        <h3 className="font-bold text-slate-800 flex justify-between items-center">
          Atividade de Hoje
          <span className="text-[10px] font-black text-slate-400 uppercase">Resumo Diário</span>
        </h3>
        <div className="space-y-3">
          {todayMeals.length > 0 ? todayMeals.map(meal => (
            <LogItem 
              key={meal.id}
              label={meal.name} 
              completed={meal.completed} 
              time={meal.time}
            />
          )) : (
            <div className="text-center py-8 bg-white rounded-3xl border border-slate-100 border-dashed">
              <p className="text-slate-400 text-sm italic">Nenhum registro para hoje ainda.</p>
            </div>
          )}
        </div>
      </section>

      {/* Global Stats */}
      <div className="bg-slate-900 text-white rounded-[40px] p-8 text-center space-y-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
        <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[2px]">Consistência Acumulada</h4>
        <p className="text-6xl font-black">{adherence}%</p>
        <p className="text-slate-400 text-xs leading-relaxed">
          {adherence >= 80 
            ? "Fantástico! Você está mantendo um ritmo de atleta. Continue assim! 🏆"
            : adherence >= 50 
            ? "Bom progresso. Manter a regularidade é o segredo para os resultados."
            : "Vamos começar? Amanhã é uma nova oportunidade de bater suas metas!"}
        </p>
      </div>
    </div>
  );
};

interface LogItemProps {
  label: string;
  completed: boolean;
  time: string;
  key?: React.Key;
}

// LogItem component with explicit props to resolve key prop type assignment errors
const LogItem = ({ label, completed, time }: LogItemProps) => (
  <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
    completed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`w-1.5 h-1.5 rounded-full ${completed ? 'bg-emerald-500' : 'bg-slate-200'}`} />
      <div>
        <h5 className={`text-sm font-bold ${completed ? 'text-emerald-900' : 'text-slate-800'}`}>{label}</h5>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{time}</p>
      </div>
    </div>
    {completed ? (
      <CheckCircle className="text-emerald-500" size={18} />
    ) : (
      <div className="w-5 h-5 rounded-full border-2 border-slate-100" />
    )}
  </div>
);
