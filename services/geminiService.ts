
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Macros, PhotoAnalysis, NutritionPlan, WorkoutPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMealPhoto = async (base64Data: string, mimeType: string = 'image/jpeg'): Promise<PhotoAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Data } },
        { text: 'Analise este prato seguindo o Protocolo EBN. Identifique ingredientes e macros. Forneça feedback focado em densidade nutricional. Retorne JSON.' }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identifiedFoods: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER } },
              required: ['name', 'calories']
            } 
          },
          estimatedMacros: {
            type: Type.OBJECT,
            properties: { calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } },
            required: ['calories', 'protein', 'carbs', 'fats']
          },
          feedback: { type: Type.STRING }
        },
        required: ['identifiedFoods', 'estimatedMacros', 'feedback']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateNutritionPlan = async (profile: UserProfile): Promise<NutritionPlan> => {
  const prompt = `
    Aja como um Nutricionista Master (Protocolo EBN).
    1. Calcule a TMB usando Mifflin-St Jeor para: ${profile.gender}, ${profile.weight}kg, ${profile.height}cm, ${profile.age} anos.
    2. Aplique fator de atividade ${profile.activityLevel} e meta ${profile.goal}.
    3. Distribua Macros: Proteína fixa (2.0g/kg), Gordura (0.8g/kg), Carbo (Saldo).
    4. Crie ${profile.mealsPerDay} refeições. Inclua foodItems com quantidades claras para lista de mercado.
    Retorne JSON com dailyTarget e lista de refeições detalhada.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text);
};

export const generateWorkoutPlan = async (profile: UserProfile): Promise<WorkoutPlan> => {
  const prompt = `
    Aja como um Mestre MuscleWiki. Crie um treino proporcional para ${profile.workoutDays} dias/semana.
    Preferência: ${profile.workoutSplitPreference}. Sexo: ${profile.gender}. Objetivo: ${profile.goal}.
    
    Distribua os grupos musculares de forma equilibrada. 5 exercícios + Alongamento por split.
    Cada exercício DEVE conter:
    - id (ex: chest_01)
    - name (ex: Supino com Barra)
    - difficulty (Iniciante, Intermediário, Avançado)
    - target (ex: Peitoral Médio)
    - media: { front_gif: URL, side_gif: URL } (Use URLs do MuscleWiki baseadas na lógica https://media.musclewiki.com/media/uploads/videos/branded/male/chest/chest-barbell-bench-press-front.mp4)
    - steps (Instruções técnicas passo a passo)
    - sets e reps e rest (tempo de descanso em segundos)

    Retorne JSON com weeklySchedule (Seg-Dom) e os splits detalhados.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text);
};

export const chatWithNutri = async (message: string, history: any[], profile: UserProfile): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })), { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: `Você é o Nutri IA Expert. Siga o Protocolo EBN. Perfil do usuário: ${JSON.stringify(profile)}. Seja técnico mas acessível.`
    }
  });

  return response.text;
};
