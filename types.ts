
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense';
export type Goal = 'lose_weight' | 'gain_weight' | 'maintain' | 'eat_healthy' | 'definition';
export type MealType = 'Café da Manhã' | 'Lanche' | 'Almoço' | 'Jantar' | 'Ceia';
export type WorkoutSplitType = 'superior_inferior' | 'abcd';

export interface WeightEntry {
  date: string;
  weight: number;
  target: number;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  weightHistory: WeightEntry[];
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  intolerances: string[];
  dislikes: string[];
  preferredFoods: string[];
  exerciseLimitations: string[];
  exercisePreferences: string[];
  mealsPerDay: number;
  workoutDays: number;
  workoutTime: number;
  workoutLocation: 'home' | 'gym';
  workoutSplitPreference: WorkoutSplitType;
  isSetupComplete: boolean;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodItem {
  name: string;
  amount: string;
  category: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  type: MealType;
  time: string;
  foodItems: FoodItem[];
  macros: Macros;
  completed: boolean;
  /* Optional properties for handling user-added or AI-suggested modifications */
  isCustom?: boolean;
  suggestedFoods?: any[];
}

export interface PhotoAnalysis {
  identifiedFoods: { name: string; calories: number }[];
  estimatedMacros: Macros;
  feedback: string;
  timestamp: number;
}

export interface ExerciseMedia {
  front_gif: string;
  side_gif?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string | number;
  rest: number;
  target: string;
  difficulty: string;
  media: ExerciseMedia;
  steps: string[];
}

export interface WorkoutSplit {
  id: string;
  letter: string;
  name: string;
  region: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  weeklySchedule: Record<string, string>;
  splits: WorkoutSplit[];
}

export interface DailyLog {
  date: string;
  meals: Meal[];
  workoutCompleted?: boolean;
}

export interface NutritionPlan {
  dailyTarget: Macros;
  meals: Meal[];
}
