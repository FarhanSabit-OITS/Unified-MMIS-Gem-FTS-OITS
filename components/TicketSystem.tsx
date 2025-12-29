import React, { useState } from 'react';
import { MOCK_TICKETS } from '../constants';
import { TicketPriority, TicketContext, UserRole, Ticket } from '../types';
import { AlertCircle, Wrench, MessageSquare, Package, Bot, Paperclip, Send, Lock, Plus, Search } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface TicketSystemProps {
  userRole?: UserRole;
}

export const TicketSystem: React.FC<TicketSystemProps> = ({ userRole = UserRole.USER }) => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    context: TicketContext.SUPPORT,
    priority: TicketPriority.MEDIUM
  });

  // RBAC: Admins see all. Others see tickets created by their Role (Mock logic)
  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;
  
  const filteredTickets = tickets.filter(t => {
     const matchesRole = isAdmin || t.createdByRole === userRole;
     const term = searchTerm.toLowerCase();
     const matchesSearch = !term || 
        t.title.toLowerCase().includes(term) || 
        (t.description && t.description.toLowerCase().includes(term)) ||
        t.id.toLowerCase().includes(term);

     return matchesRole && matchesSearch;
  });

  const selectedTicket = filteredTickets.find(t => t.id === selectedTicketId) || filteredTickets[0];
  
  const getPriorityColor = (p: TicketPriority) => {
    switch (p) {
      case TicketPriority.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
      case TicketPriority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case TicketPriority.MEDIUM: return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getContextIcon = (c: TicketContext) => {
    switch (c) {
      case TicketContext.ASSET: return <Wrench size={16} />;
      case TicketContext.SUPPLY: return <Package size={16} />;
      case TicketContext.COMPLAINT: return <AlertCircle size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const generateSummary = async (description: string) => {
    if (!process.env.API_KEY) {
      setAiSummary("AI configuration missing (API Key).");
      return;
    }

    setIsLoadingSummary(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a concise actionable summary for an admin regarding this market support ticket: "${description}"`,
        config: { systemInstruction: "You are an AI assistant for a busy Market Administrator. Be brief and professional." }
      });
      setAiSummary(response.text || "No summary generated.");
    } catch (error) {
      console.error(error);
      setAiSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
        alert("Please fill in title and description.");
        return;
    }

    const created: Ticket = {
        id: `t${Date.now()}`,
        title: newTicket.title,
        description: newTicket.description,
        context: newTicket.context,
        priority: newTicket.priority,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        createdByRole: userRole
    };

    setTickets([created, ...tickets]);
    setShowCreateModal(false);
    setNewTicket({ title: '', description: '', context: TicketContext.SUPPORT, priority: TicketPriority.MEDIUM });
    setSelectedTicketId(created.id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-slate-800">Support & Tickets</h2>
             <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
             >
                <Plus size={16} /> New Ticket
             </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search tickets by ID, title, or description..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

    <div className="flex flex-1 gap-6 overflow-hidden">
      {/* Ticket List */}
      <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-10">
        {filteredTickets.length === 0 ? (
             <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">No tickets found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
             </div>
        ) : (
            filteredTickets.map(ticket => (
            <div 
                key={ticket.id} 
                onClick={() => { setSelectedTicketId(ticket.id); setAiSummary(''); }}
                className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${
                (selectedTicket && selectedTicket.id === ticket.id)
                    ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' 
                    : 'bg-white border-slate-200 hover:shadow-md'
                }`}
            >
                <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                </span>
                <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-semibold text-slate-800 mb-1 text-sm">{ticket.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                {getContextIcon(ticket.context)}
                <span>{ticket.context}</span>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Detail / AI View */}
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {selectedTicket ? (
          <>
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${getPriorityColor(selectedTicket.priority)}`}>
                    {getContextIcon(selectedTicket.context)}
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-none">{selectedTicket.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Ticket ID: {selectedTicket.id}</p>
                 </div>
              </div>
              
              {isAdmin && (
                <button 
                    onClick={() => generateSummary(selectedTicket.description || selectedTicket.title)}
                    disabled={isLoadingSummary}
                    className="flex items-center gap-2 text-purple-700 text-xs font-bold px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-full border border-purple-200 transition-colors"
                >
                    <Bot size={14} /> 
                    {isLoadingSummary ? 'Analyzing...' : 'Generate AI Summary'}
                </button>
              )}
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
               {/* AI Summary Section - Admin Only */}
               {(aiSummary && isAdmin) && (
                 <div className="mb-6 bg-gradient-to-r from-purple-50 to-white p-4 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-2">
                   <div className="flex items-center gap-2 mb-2 text-purple-700 font-medium text-sm">
                      <Bot size={16} />
                      <span>Gemini Insight</span>
                   </div>
                   <p className="text-sm text-slate-700 leading-relaxed italic">
                     "{aiSummary}"
                   </p>
                 </div>
               )}

               {/* Description */}
               <div className="mb-8">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Description</h4>
                  <p className="text-slate-800 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {selectedTicket.description || "No detailed description provided."}
                  </p>
               </div>

               {/* Chat Thread Mock */}
               <div className="space-y-4">
                 <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
                       {selectedTicket.createdByRole ? selectedTicket.createdByRole[0] : 'U'}
                   </div>
                   <div className="bg-slate-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-700 shadow-sm max-w-[80%]">
                     Reported the issue. Waiting for assignment.
                   </div>
                 </div>
                 {selectedTicket.assignedTo && (
                   <div className="flex gap-3 flex-row-reverse">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">A</div>
                     <div className="bg-blue-600 text-white p-3 rounded-lg rounded-tr-none text-sm shadow-sm max-w-[80%]">
                       I'm on it. {selectedTicket.assignedTo} assigned.
                     </div>
                   </div>
                 )}
               </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50">
               {isAdmin ? (
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                    <Paperclip size={20} />
                    </button>
                    <input 
                    type="text" 
                    placeholder="Type a reply or internal note..." 
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <Send size={18} />
                    </button>
                </div>
               ) : (
                   <div className="flex items-center justify-center text-slate-500 text-xs gap-2">
                       <Lock size={12} /> Thread is read-only. Updates are managed by Admin.
                   </div>
               )}
            </div>
          </>
        ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                 <MessageSquare size={48} className="mb-4 opacity-20"/>
                 <p>Select a ticket to view details</p>
             </div>
        )}
      </div>
    </div>
    
    {/* Create Modal */}
    {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Ticket</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newTicket.title}
                            onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Context</label>
                        <select 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={newTicket.context}
                            onChange={(e) => setNewTicket({...newTicket, context: e.target.value as TicketContext})}
                        >
                            {Object.values(TicketContext).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                        <select 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={newTicket.priority}
                            onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as TicketPriority})}
                        >
                            {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                        <textarea 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                        <button onClick={handleCreateTicket} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Submit Ticket</button>
                    </div>
                </div>
            </div>
        </div>
    )}
    </div>
  );
};
