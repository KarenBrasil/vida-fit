
import React, { useState, useMemo } from 'react';
import { NutritionPlan, FoodItem } from '../types';
import { ShoppingBasket, Check, ArrowDownToLine, Plus, Tag, Trash2, Printer } from 'lucide-react';

export const ShoppingListView: React.FC<{ plan: NutritionPlan | null }> = ({ plan }) => {
  const [durationWeeks, setDurationWeeks] = useState<1 | 2 | 4>(1); 
  const [checkedNames, setCheckedNames] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<FoodItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({ name: '', amount: '', category: 'Outros' });

  const allItems = useMemo(() => {
    const list: FoodItem[] = [];
    if (plan) {
      plan.meals.forEach(m => m.foodItems?.forEach(i => {
        if (!list.find(li => li.name.toLowerCase() === i.name.toLowerCase())) {
          list.push(i);
        }
      }));
    }
    return [...list, ...customItems];
  }, [plan, customItems]);

  const grouped = useMemo(() => {
    const groups: Record<string, FoodItem[]> = {};
    allItems.forEach(i => {
      const cat = i.category || 'Outros';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(i);
    });
    return groups;
  }, [allItems]);

  const toggleItem = (name: string) => {
    const next = new Set(checkedNames);
    if (next.has(name)) next.delete(name); else next.add(name);
    setCheckedNames(next);
  };

  const handleDownloadPDF = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    let html = `<html><head><title>Lista de Mercado (x${durationWeeks})</title><style>body{font-family:sans-serif;padding:40px;color:#334155} h1{color:#10b981;border-bottom:2px solid #ecfdf5;padding-bottom:10px} .cat{margin-top:25px;font-weight:800;font-size:12px;color:#10b981;text-transform:uppercase} .item{padding:10px 0;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between} .qty{font-weight:bold}</style></head><body><h1>Lista Mercado - Nutri IA</h1>`;
    (Object.entries(grouped) as [string, FoodItem[]][]).forEach(([cat, items]) => {
      const selected = items.filter(i => checkedNames.has(i.name));
      if (selected.length > 0) {
        html += `<div class="cat">${cat}</div>`;
        selected.forEach(i => html += `<div class="item"><span>${i.name}</span><span class="qty">${i.amount} (x${durationWeeks})</span></div>`);
      }
    });
    html += `</body></html>`;
    printWin.document.write(html); printWin.document.close(); printWin.print();
  };

  return (
    <div className="p-10 pb-40 space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none">MERCADO</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[4px]">ABASTEÇA SEU PROTOCOLO</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddModal(true)} className="w-14 h-14 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center justify-center text-slate-500 shadow-xl transition-all hover:scale-105 active:scale-95">
            <Plus size={24} />
          </button>
          <button onClick={handleDownloadPDF} className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95">
            <Printer size={24} />
          </button>
        </div>
      </header>

      <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-[32px] max-w-md mx-auto">
        {[1, 2, 4].map(w => (
          <button key={w} onClick={() => setDurationWeeks(w as any)} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest rounded-[24px] transition-all ${durationWeeks === w ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xl' : 'text-slate-400'}`}>
            {w === 4 ? '1 MÊS' : `${w} SEMANAS`}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {(Object.entries(grouped) as [string, FoodItem[]][]).map(([cat, items]) => (
          <div key={cat} className="space-y-6">
            <h3 className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[4px] flex items-center gap-3 italic">
              <Tag size={16} /> {cat}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((i, idx) => {
                const isChecked = checkedNames.has(i.name);
                return (
                  <div key={idx} onClick={() => toggleItem(i.name)} className={`group flex items-center gap-6 p-8 bg-white/50 dark:bg-slate-800/20 border border-slate-100 dark:border-white/5 rounded-[40px] transition-all cursor-pointer backdrop-blur-md ${isChecked ? 'ring-2 ring-emerald-500/30 border-emerald-500/50' : 'hover:bg-white dark:hover:bg-slate-800'}`}>
                    <div className={`w-10 h-10 rounded-[14px] border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'border-slate-200 dark:border-slate-700'}`}>
                      {isChecked && <Check size={20} strokeWidth={4} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{i.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{i.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-600 dark:text-white uppercase italic">x{durationWeeks}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[56px] p-12 space-y-8 shadow-3xl border border-white/10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-center">ADICIONAR ITEM</h2>
            <div className="space-y-5">
              <input placeholder="Ex: Creatina 300g" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl font-black border-none text-white outline-none focus:ring-2 focus:ring-emerald-500/30" />
              <input placeholder="Quantidade" value={newItem.amount} onChange={e => setNewItem({...newItem, amount: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl font-black border-none text-white outline-none" />
              <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl font-black border-none text-white outline-none">
                {['Proteínas', 'Cereais', 'Suplementos', 'Higiene', 'Outros'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">CANCELAR</button>
              <button onClick={() => { setCustomItems([...customItems, newItem as FoodItem]); setShowAddModal(false); }} className="flex-1 bg-emerald-600 text-white p-6 rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl">SALVAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
