
import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, ArrowLeft, RefreshCw, Plus } from 'lucide-react';
import { analyzeMealPhoto } from '../services/geminiService';
import { PhotoAnalysis } from '../types';

interface AnalyzeMealProps {
  onComplete: () => void;
}

export const AnalyzeMeal: React.FC<AnalyzeMealProps> = ({ onComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PhotoAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const fullDataUrl = reader.result as string;
        const mimeMatch = fullDataUrl.match(/data:(.*?);base64/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const base64Data = fullDataUrl.split(',')[1];
        setImage(fullDataUrl);
        performAnalysis(base64Data, mimeType);
      };
      reader.onerror = () => {
        setError("Erro técnico ao ler o arquivo de imagem.");
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (base64Data: string, mimeType: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeMealPhoto(base64Data, mimeType);
      setResult(analysis);
    } catch (err: any) {
      console.error("Erro na análise da imagem:", err);
      setError('Não conseguimos analisar esta foto no momento. Verifique se a foto está clara e tente novamente.');
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col transition-colors">
      <header className="flex items-center gap-4 mb-4">
        <button onClick={onComplete} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-slate-600 dark:text-slate-400 active:scale-90 transition-transform">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Scanner de Nutrientes</h1>
      </header>

      {!image && !result && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-300">
          <div className="relative">
            <div className="w-56 h-56 bg-white dark:bg-slate-900 rounded-[56px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner group">
              <div className="w-40 h-40 bg-slate-50 dark:bg-slate-950/50 rounded-[40px] flex items-center justify-center">
                <Camera size={56} className="text-slate-200 dark:text-slate-800" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
              <Plus size={24} strokeWidth={3} />
            </div>
          </div>
          
          <div className="text-center space-y-4 px-6 max-w-xs">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">O QUE VOCÊ VAI COMER?</h2>
            <p className="text-slate-400 dark:text-slate-500 font-medium text-xs uppercase tracking-widest leading-relaxed">Analise ingredientes e calcule macros instantaneamente.</p>
          </div>

          <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-xs bg-slate-900 dark:bg-slate-900 text-white p-5 rounded-3xl font-black shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            <Camera size={18} />
            Capturar Prato
          </button>
        </div>
      )}

      {analyzing && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative">
            <div className="w-64 h-64 rounded-[48px] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl">
              <img src={image!} className="w-full h-full object-cover grayscale opacity-40" alt="Scanning" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center gap-3 border dark:border-slate-800">
                <Loader2 size={32} className="text-emerald-600 animate-spin" />
                <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Analisando...</span>
              </div>
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold italic uppercase text-[10px] tracking-widest">Identificando nutrientes...</p>
        </div>
      )}

      {error && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-[40px] border border-red-100 dark:border-red-900/50 space-y-4">
            <h3 className="text-xl font-black text-red-900 dark:text-red-400 italic">OPS! FALHA</h3>
            <p className="text-red-700 dark:text-red-300 font-medium text-xs px-4">{error}</p>
            <button onClick={reset} className="px-6 py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center gap-2 mx-auto shadow-lg shadow-red-100 dark:shadow-none">
              <RefreshCw size={18} /> Tentar Outra Foto
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="flex-1 space-y-6 animate-in slide-in-from-bottom-10 duration-700 overflow-y-auto no-scrollbar pb-12">
          <div className="relative">
            <div className="bg-white dark:bg-slate-900 p-2 rounded-[40px] shadow-2xl mx-auto max-w-[280px]">
              <img src={image!} className="w-full aspect-square object-cover rounded-[32px]" alt="Meal" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-black italic shadow-xl whitespace-nowrap text-sm">
              {result.estimatedMacros.calories} KCAL ESTIMADAS
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 mt-6 transition-colors">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ingredientes Detectados</h3>
              <div className="flex flex-wrap gap-2">
                {result.identifiedFoods.map((food, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold border border-slate-100 dark:border-slate-800">
                    {food.name} <span className="text-emerald-600 ml-1">~{food.calories} kcal</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-50 dark:border-slate-800">
              <ResultMacro label="Prot" val={result.estimatedMacros.protein} color="bg-orange-400" />
              <ResultMacro label="Carb" val={result.estimatedMacros.carbs} color="bg-blue-400" />
              <ResultMacro label="Gord" val={result.estimatedMacros.fats} color="bg-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-emerald-950/20 text-white dark:text-emerald-300 rounded-[32px] p-6 shadow-xl relative overflow-hidden border dark:border-emerald-900/30">
            <h4 className="font-black text-emerald-500 uppercase text-[9px] tracking-[3px] mb-2">Resumo IA</h4>
            <p className="text-slate-200 dark:text-emerald-100 text-xs leading-relaxed italic font-medium">
              "{result.feedback}"
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={reset} className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 rounded-3xl font-black shadow-sm border border-slate-100 dark:border-slate-800 uppercase text-[10px]">
              Refazer
            </button>
            <button onClick={onComplete} className="flex-[2] bg-slate-900 dark:bg-emerald-600 text-white p-4 rounded-3xl font-black shadow-xl uppercase text-[10px] tracking-widest">
              Registrar
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          50% { top: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const ResultMacro = ({ label, val, color }: { label: string, val: number, color: string }) => (
  <div className="text-center space-y-1.5">
    <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{label}</p>
    <div className="w-full bg-slate-50 dark:bg-slate-950 h-1 rounded-full overflow-hidden">
      <div className={`${color} h-full w-full rounded-full`} />
    </div>
    <p className="text-sm font-black text-slate-900 dark:text-white">{val}g</p>
  </div>
);
