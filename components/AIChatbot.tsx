import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Loader2 } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hello! I am the MMIS Assistant. How can I help you manage your market operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const initChat = () => {
    if (!process.env.API_KEY) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are a helpful assistant for the Market Management Information System (MMIS). You help Vendors, Admins, and Staff with inquiries about rent, stock, tickets, and gate fees. Keep answers concise.',
        },
      });
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  };

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      initChat();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    try {
      if (!chatSessionRef.current) initChat();
      
      if (chatSessionRef.current) {
        const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg });
        setMessages(prev => [...prev, { role: 'model', text: result.text || "I'm not sure how to respond to that." }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Chat service unavailable (Missing API Key)." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col animate-in slide-in-from-bottom-10 fade-in">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-bold">MMIS Assistant</span>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setIsOpen(false)} className="hover:bg-blue-500 p-1 rounded transition">
             <Minimize2 size={16} />
           </button>
           <button onClick={() => setIsOpen(false)} className="hover:bg-blue-500 p-1 rounded transition">
             <X size={16} />
           </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-slate-200' : 'bg-blue-100 text-blue-600'}`}>
                {m.role === 'user' ? <User size={14}/> : <Bot size={14}/>}
             </div>
             <div className={`p-3 rounded-lg text-sm max-w-[80%] shadow-sm ${
               m.role === 'user' ? 'bg-white border border-slate-200 text-slate-800 rounded-tr-none' : 'bg-blue-600 text-white rounded-tl-none'
             }`}>
               {m.text}
             </div>
          </div>
        ))}
        {isThinking && (
           <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot size={14}/>
              </div>
              <div className="p-3 rounded-lg bg-blue-600 text-white rounded-tl-none text-sm max-w-[80%] flex items-center gap-2">
                 <Loader2 size={14} className="animate-spin" /> Thinking...
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 rounded-b-2xl">
        <div className="flex gap-2">
           <input 
              type="text" 
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ask about vendors, gates..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
           />
           <button 
             onClick={handleSend}
             disabled={isThinking || !input.trim()}
             className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Send size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};
