
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { chatWithNutri } from '../services/geminiService';
import { UserProfile } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatView: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Olá ${profile.name}! Sou seu nutricionista IA. Como posso te ajudar hoje com sua dieta ou treinos?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithNutri(userMsg, messages, profile);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Desculpe, tive um problema ao processar sua pergunta.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Ops! Ocorreu um erro na conexão com a IA. Tente novamente mais tarde.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 leading-none">Nutri IA</h2>
          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Online Agora
          </span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-2">
              <Loader2 className="animate-spin text-emerald-600" size={16} />
              <span className="text-xs text-slate-400 font-medium">Pensando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tire suas dúvidas..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-emerald-600 text-white p-3 rounded-2xl disabled:opacity-50 transition-all active:scale-90"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
