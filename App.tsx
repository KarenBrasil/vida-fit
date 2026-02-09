
import React, { useState, useEffect } from 'react';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { MealPlanView } from './pages/MealPlan';
import { WorkoutView } from './pages/Workouts';
import { AnalyzeMeal } from './pages/AnalyzeMeal';
import { CalendarView } from './pages/Calendar';
import { ChatView } from './pages/Chat';
import { ProfileView } from './pages/Profile';
import { ShoppingListView } from './pages/ShoppingList';
import { Navigation } from './components/Navigation';
import { UserProfile, NutritionPlan, DailyLog, WorkoutPlan } from './types';

const STORAGE_KEY = 'nutri_ia_master_v3';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
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
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setProfile(data.profile || DEFAULT_PROFILE);
      setNutritionPlan(data.nutritionPlan);
      setWorkoutPlan(data.workoutPlan);
      setDailyLogs(data.dailyLogs || {});
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        profile,
        nutritionPlan,
        workoutPlan,
        dailyLogs
      }));
    }
  }, [profile, nutritionPlan, workoutPlan, dailyLogs, initialized]);

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  if (!initialized) return null;

  if (!profile.name) {
    return <Onboarding onComplete={(p) => setProfile(p)} />;
  }

  const todayData = dailyLogs[getTodayKey()] || { 
    date: getTodayKey(), 
    meals: nutritionPlan?.meals || [], 
    workoutCompleted: false 
  };

  const handleToggleMeal = (id: string) => {
    const key = getTodayKey();
    const updatedMeals = todayData.meals.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    setDailyLogs({ ...dailyLogs, [key]: { ...todayData, meals: updatedMeals } });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-100'} transition-all duration-500 flex items-center justify-center p-0 md:p-4 lg:p-8`}>
      <div className="w-full h-full md:h-[94vh] max-w-6xl bg-white dark:bg-slate-900 md:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative border border-white/5">
        
        <main className="flex-1 overflow-y-auto no-scrollbar pb-36">
          <div className="max-w-4xl mx-auto w-full">
            {activeTab === 'dashboard' && (
              <Dashboard 
                profile={profile} 
                plan={nutritionPlan} 
                todayMeals={todayData.meals}
                onAnalyze={() => setActiveTab('analyze')}
                onGoToProfile={() => setActiveTab('profile')}
                onUpdateWeight={(w, t) => setProfile({ ...profile, weight: w, targetWeight: t })}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                dailyLogs={dailyLogs}
              />
            )}
            {activeTab === 'plan' && (
              <MealPlanView 
                profile={profile} 
                plan={nutritionPlan || { dailyTarget: { calories: 0, protein: 0, carbs: 0, fats: 0 }, meals: [] }} 
                todayMeals={todayData.meals}
                onAddCustomMeal={(m) => {
                  const key = getTodayKey();
                  setDailyLogs({ ...dailyLogs, [key]: { ...todayData, meals: [...todayData.meals, m] } });
                }}
                onToggleMeal={handleToggleMeal}
                onRegenerate={(plan) => setNutritionPlan(plan)}
              />
            )}
            {activeTab === 'market' && <ShoppingListView plan={nutritionPlan} />}
            {activeTab === 'workouts' && (
              <WorkoutView 
                profile={profile} 
                workoutPlan={workoutPlan} 
                onUpdateWorkoutPlan={(p) => setWorkoutPlan(p)} 
              />
            )}
            {activeTab === 'analyze' && <AnalyzeMeal onComplete={() => setActiveTab('dashboard')} />}
            {activeTab === 'calendar' && <CalendarView dailyLogs={dailyLogs} />}
            {activeTab === 'chat' && <ChatView profile={profile} />}
            {activeTab === 'profile' && (
              <ProfileView 
                profile={profile} 
                onUpdate={(p) => setProfile(p)} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
              />
            )}
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent pointer-events-none h-48 flex items-end justify-center z-50">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
