
import React, { useState, useRef, useEffect } from 'react';
import { askStudyAssistant } from '../services/geminiService.ts';

const GeminiQA: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const response = await askStudyAssistant(userMessage);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-500">
      <div className="bg-white rounded-t-3xl p-6 border border-slate-200 border-b-0 shadow-sm flex items-center space-x-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
          <i className="fa-solid fa-robot text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Lumina AI Tutor</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Powered by Advanced Intelligence</p>
        </div>
      </div>

      <div className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-400">
              <i className="fa-solid fa-comments text-4xl opacity-50"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-700">How can I help you today?</h3>
            <p className="text-sm text-slate-400 mt-2">I can help with complex math, physics formulas, coding challenges, or historical analysis.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => setInput("Explain Quantum Entanglement simply.")} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-200 transition-all">Explain Quantum Physics</button>
              <button type="button" onClick={() => setInput("How do I calculate the area of a circle?")} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-200 transition-all">Math Formula Help</button>
            </div>
          </div>
        )}
        
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-4 ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{m.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 rounded-2xl rounded-tl-none px-5 py-4 border border-slate-100 flex space-x-1.5 items-center">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-b-3xl p-6 flex space-x-3 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default GeminiQA;
