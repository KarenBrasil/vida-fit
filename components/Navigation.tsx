
import React from 'react';
import { Home, ClipboardList, ShoppingCart, Dumbbell, MessageSquare, Calendar, User, Camera } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'plan', icon: ClipboardList, label: 'Dieta' },
    { id: 'market', icon: ShoppingCart, label: 'Loja' },
    { id: 'workouts', icon: Dumbbell, label: 'Treino' },
    { id: 'analyze', icon: Camera, label: 'IA Scan' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'calendar', icon: Calendar, label: 'Histórico' },
    { id: 'profile', icon: User, label: 'Ajustes' },
  ];

  return (
    <nav className="pointer-events-auto bg-white/70 dark:bg-slate-800/80 backdrop-blur-3xl border border-white dark:border-white/10 rounded-[40px] flex justify-between items-center p-2.5 shadow-2xl w-full max-w-4xl transition-all ring-1 ring-black/5 dark:ring-white/5 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-4 transition-all rounded-[28px] flex-1 min-w-[64px] group/btn ${
              isActive 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30' 
                : 'text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 3 : 2} className="transition-transform group-active/btn:scale-90" />
            <span className={`text-[8px] font-black uppercase mt-1.5 tracking-widest ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
