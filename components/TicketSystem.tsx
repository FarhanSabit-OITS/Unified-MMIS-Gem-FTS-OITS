
import React, { useState } from 'react';
import { MOCK_TICKETS, MOCK_STAFF } from '../constants';
import { TicketPriority, TicketContext, UserRole, Ticket } from '../types';
import { AlertCircle, Wrench, MessageSquare, Package, Bot, Paperclip, Send, Lock, Plus, Search, UserPlus, Check, X } from 'lucide-react';
import { ApiService } from '../services/api';
// Fix: Import GoogleGenAI from @google/genai
import { GoogleGenAI } from "@google/genai";

interface TicketSystemProps {
  userRole?: UserRole;
  marketId?: string;
}

export const TicketSystem: React.FC<TicketSystemProps> = ({ userRole = UserRole.USER, marketId }) => {
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
    priority: TicketPriority.MEDIUM,
    file: null as File | null
  });

  // RBAC Permissions
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;
  const isMarketAdmin = userRole === UserRole.MARKET_ADMIN;
  // Admin privilege generally allows action, but scope is defined by marketId
  const canManageTickets = isSuperAdmin || isMarketAdmin;
  
  const filteredTickets = tickets.filter(t => {
     // 1. Scope Filter: 
     if (isSuperAdmin) {
         // See all
     } else if (isMarketAdmin) {
         if (t.marketId !== marketId) return false;
     } else {
         if (t.createdByRole !== userRole) return false; // Simplified mock logic
     }

     // 2. Search Filter
     const term = searchTerm.toLowerCase();
     const matchesSearch = !term || 
        t.title.toLowerCase().includes(term) || 
        (t.description && t.description.toLowerCase().includes(term)) ||
        t.id.toLowerCase().includes(term);

     return matchesSearch;
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
    setIsLoadingSummary(true);
    try {
      // Fix: Use GoogleGenAI SDK directly instead of calling a remote BFF
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize the following support ticket description for a market administrator: ${description}`,
        config: {
          systemInstruction: 'You are an AI assistant helping market administrators by providing concise summaries of reported issues.',
        }
      });
      // Fix: Access response text property directly
      setAiSummary(response.text || "Summary generated.");
    } catch (error) {
      console.warn("AI Service unavailable, falling back to mock.");
      // Fallback for demo if backend is offline
      setTimeout(() => {
        setAiSummary("Based on the report, this requires immediate maintenance. The asset is critical to daily operations.");
      }, 1000);
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
        createdByRole: userRole,
        marketId: marketId || 'm1', // Assign ticket to current user's market context
        attachmentUrl: newTicket.file ? newTicket.file.name : undefined
    };

    setTickets([created, ...tickets]);
    setShowCreateModal(false);
    setNewTicket({ title: '', description: '', context: TicketContext.SUPPORT, priority: TicketPriority.MEDIUM, file: null });
    setSelectedTicketId(created.id);
  };

  const handleAssignTicket = (staffName: string) => {
      if (!selectedTicket) return;
      const updatedTickets = tickets.map(t => 
          t.id === selectedTicket.id 
          ? { ...t, status: 'ASSIGNED' as const, assignedTo: staffName } 
          : t
      );
      setTickets(updatedTickets);
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
                {ticket.status === 'ASSIGNED' && <span className="bg-slate-100 px-1 rounded text-[10px]">Assigned</span>}
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
              
              <div className="flex gap-2">
                  {canManageTickets && selectedTicket.status === 'OPEN' && (
                      <div className="relative group">
                          <button className="flex items-center gap-2 text-blue-700 text-xs font-bold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-200 transition-colors">
                              <UserPlus size={14} /> Assign
                          </button>
                          {/* Assignment Dropdown */}
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl hidden group-hover:block z-20 overflow-hidden">
                              <div className="px-4 py-2 text-[10px] font-bold uppercase text-slate-400 bg-slate-50">Staff List</div>
                              {MOCK_STAFF.map(staff => (
                                  <button 
                                    key={staff.id} 
                                    onClick={() => handleAssignTicket(staff.name)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                                  >
                                      {staff.name} ({staff.role})
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}
                  {canManageTickets && (
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
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
               {/* AI Summary Section - Admin Only */}
               {(aiSummary && canManageTickets) && (
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
                  {selectedTicket.attachmentUrl && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg w-fit border border-blue-100 cursor-pointer hover:bg-blue-100">
                          <Paperclip size={14} /> {selectedTicket.attachmentUrl}
                      </div>
                  )}
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
               {canManageTickets ? (
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
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Create New Ticket</h3>
                    <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
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
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                        <textarea 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                        ></textarea>
                    </div>
                    
                    {/* File Attachment Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Attachment</label>
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-600 transition-colors border border-slate-200">
                                <Paperclip size={16} /> 
                                {newTicket.file ? 'Change File' : 'Attach File'}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => {
                                        if(e.target.files?.[0]) setNewTicket({...newTicket, file: e.target.files[0]});
                                    }}
                                />
                            </label>
                            {newTicket.file && <span className="text-xs text-blue-600 font-bold">{newTicket.file.name}</span>}
                        </div>
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
