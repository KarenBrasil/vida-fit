
import React, { useState } from 'react';
import { NutritionPlan, Meal, MealType, UserProfile } from '../types';
import { generateNutritionPlan } from '../services/geminiService';
import { X, Check, Loader2, PlusCircle, Wand2, Coffee, Apple, UtensilsCrossed, Salad } from 'lucide-react';

interface MealPlanProps {
  profile: UserProfile;
  plan: NutritionPlan;
  todayMeals: Meal[];
  onAddCustomMeal: (meal: Meal) => void;
  onToggleMeal: (id: string) => void;
  onRegenerate: (plan: NutritionPlan) => void;
}

export const MealPlanView: React.FC<MealPlanProps> = ({ profile, plan, todayMeals, onAddCustomMeal, onToggleMeal, onRegenerate }) => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '',
    description: '',
    time: '12:00',
    type: 'Almoço',
    macros: { calories: 0, protein: 0, carbs: 0, fats: 0 }
  });

  const handleAddMeal = () => {
    if (!newMeal.name) return;
    const meal: Meal = {
      ...newMeal as Meal,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      isCustom: true,
      suggestedFoods: [],
      foodItems: []
    };
    onAddCustomMeal(meal);
    setShowAddModal(false);
    setNewMeal({ name: '', description: '', time: '12:00', type: 'Almoço', macros: { calories: 0, protein: 0, carbs: 0, fats: 0 } });
  };

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const newPlan = await generateNutritionPlan(profile);
      onRegenerate(newPlan);
    } catch (e) {
      alert("Erro ao recalcular dieta.");
    } finally {
      setLoading(false);
    }
  };

  const getMealIcon = (type: string) => {
    switch(type) {
      case 'Café da Manhã': return <Coffee size={18} />;
      case 'Lanche': return <Apple size={18} />;
      case 'Almoço': return <UtensilsCrossed size={18} />;
      case 'Jantar': return <Salad size={18} />;
      default: return <UtensilsCrossed size={18} />;
    }
  };

  return (
    <div className="p-5 space-y-6 pb-24 dark:bg-slate-950 transition-colors">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest">Agenda Alimentar</h1>
          <p className="text-slate-500 dark:text-slate-500 text-[10px] font-medium uppercase tracking-widest">Siga seu plano de hoje</p>
        </div>
      </header>

      {/* Minimal Target Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white flex justify-between items-center shadow-sm">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Alvo Diário</p>
          <p className="text-xl font-bold">{plan.dailyTarget.calories} <span className="text-[9px] font-normal opacity-40 uppercase tracking-tighter">kcal</span></p>
        </div>
        <div className="flex gap-2">
          <MacroMini label="P" val={plan.dailyTarget.protein} />
          <MacroMini label="C" val={plan.dailyTarget.carbs} />
          <MacroMini label="G" val={plan.dailyTarget.fats} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={handleRegenerate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} 
          IA Recalcular
        </button>
        <button onClick={() => setShowAddModal(true)} className="bg-slate-900 dark:bg-slate-900 text-white p-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase shadow-sm transition-opacity hover:opacity-90">
          <PlusCircle size={14} /> Refeição
        </button>
      </div>

      <div className="space-y-3">
        {todayMeals.map((meal) => (
          <div 
            key={meal.id} 
            onClick={() => setSelectedMeal(meal)}
            className={`group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-900 rounded-xl p-4 flex items-center gap-4 cursor-pointer active:scale-98 transition-all shadow-sm ${meal.completed ? 'opacity-40 grayscale-[0.5]' : ''}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meal.completed ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-950 text-slate-400'}`}>
              {meal.completed ? <Check size={18} strokeWidth={3} /> : getMealIcon(meal.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-widest truncate">{meal.name}</h3>
              <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">{meal.time} • {meal.type}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900 dark:text-white text-sm">{meal.macros.calories}</p>
              <p className="text-[8px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-tighter">kcal</p>
            </div>
          </div>
        ))}
      </div>

      {/* Proportional Modal - Better Centered Design */}
      {selectedMeal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <header className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="min-w-0">
                <p className="text-[8px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">{selectedMeal.type}</p>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase leading-none truncate pr-2">{selectedMeal.name}</h2>
              </div>
              <button onClick={() => setSelectedMeal(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 transition-colors hover:text-slate-800"><X size={16}/></button>
            </header>
            
            <div className="p-5 space-y-6">
              {selectedMeal.description && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic mb-2">"{selectedMeal.description}"</p>
              )}
              <div className="grid grid-cols-3 gap-2">
                <DetailBox label="Prot" val={selectedMeal.macros.protein} />
                <DetailBox label="Carb" val={selectedMeal.macros.carbs} />
                <DetailBox label="Gord" val={selectedMeal.macros.fats} />
              </div>

              <div className="space-y-3">
                <h4 className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[2px] border-b border-slate-50 dark:border-slate-800 pb-1">Composição</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                  {selectedMeal.foodItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide truncate">{item.name}</p>
                        <p className="text-[8px] text-slate-400 dark:text-slate-500 font-medium uppercase">{item.amount}</p>
                      </div>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 whitespace-nowrap ml-3">{item.calories} <span className="text-[8px] font-normal opacity-50 uppercase tracking-tighter">kcal</span></p>
                    </div>
                  )) || (
                    <p className="text-[9px] text-slate-400 dark:text-slate-600 italic py-2 text-center">Nenhum detalhe disponível.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                 <button 
                  onClick={() => setSelectedMeal(null)}
                  className="flex-1 p-3 rounded-xl font-bold uppercase text-[9px] tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Voltar
                </button>
                <button 
                  onClick={() => { onToggleMeal(selectedMeal.id); setSelectedMeal(null); }}
                  className={`flex-[2] p-3 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all shadow-sm active:scale-95 ${selectedMeal.completed ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                >
                  {selectedMeal.completed ? 'Remover' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-2xl p-6 space-y-6 shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase text-center tracking-widest">Registrar Manual</h2>
            <div className="space-y-3">
              <input 
                placeholder="Título da refeição" 
                value={newMeal.name} 
                onChange={e => setNewMeal({...newMeal, name: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-bold text-slate-900 dark:text-white border-none text-xs focus:ring-2 focus:ring-emerald-500/20" 
              />
              <textarea 
                placeholder="Descrição do prato" 
                value={newMeal.description} 
                onChange={e => setNewMeal({...newMeal, description: e.target.value})} 
                className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-bold text-slate-900 dark:text-white border-none text-xs h-20 resize-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={newMeal.time} onChange={e => setNewMeal({...newMeal, time: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-bold text-xs border-none dark:text-white" />
                <input type="number" placeholder="Kcal" onChange={e => setNewMeal({...newMeal, macros: {...newMeal.macros!, calories: parseInt(e.target.value) || 0}})} className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-bold text-xs border-none dark:text-white" />
              </div>
            </div>
            <button onClick={handleAddMeal} className="w-full bg-slate-900 dark:bg-slate-900 text-white p-4 rounded-xl font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all">Salvar</button>
            <button onClick={() => setShowAddModal(false)} className="w-full text-slate-400 font-bold uppercase text-[8px] tracking-widest py-1">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const MacroMini = ({ label, val }: any) => (
  <div className="text-center bg-white/5 px-2 py-1 rounded-lg border border-white/5">
    <p className="text-[7px] font-bold text-emerald-400 uppercase tracking-tighter">{label}</p>
    <p className="text-[9px] font-bold">{val}g</p>
  </div>
);

const DetailBox = ({ label, val }: any) => (
  <div className="text-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-transparent dark:border-slate-800">
    <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 tracking-widest mb-0.5 uppercase">{label}</p>
    <p className="text-xs font-bold text-slate-900 dark:text-white">{val}g</p>
  </div>
);
