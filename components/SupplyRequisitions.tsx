import React, { useState } from 'react';
import { MOCK_REQUISITIONS } from '../constants';
import { Requisition } from '../types';
import { Truck, Plus, Calendar, Clock, CheckCircle2, XCircle, Search } from 'lucide-react';

export const SupplyRequisitions: React.FC = () => {
  const [requisitions, setRequisitions] = useState<Requisition[]>(MOCK_REQUISITIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReq, setNewReq] = useState({
     itemName: '',
     quantity: '',
     unit: 'Pcs',
     deadline: ''
  });

  const handleCreate = () => {
    if (!newReq.itemName || !newReq.quantity || !newReq.deadline) {
        alert("Please fill all fields");
        return;
    }

    const req: Requisition = {
        id: `req-${Date.now()}`,
        vendorId: 'v1',
        vendorName: 'Alice Namatovu', // Logged in user simulation
        marketId: 'm1',
        items: [{ name: newReq.itemName, qty: parseInt(newReq.quantity), unit: newReq.unit }],
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        deadline: newReq.deadline
    };

    setRequisitions([req, ...requisitions]);
    setShowCreateModal(false);
    setNewReq({ itemName: '', quantity: '', unit: 'Pcs', deadline: '' });
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Supply Requisitions</h2>
          <p className="text-slate-500 text-sm">Request stock from the supplier network.</p>
        </div>
        <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-sm"
        >
            <Plus size={18} /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {requisitions.map(req => (
             <div key={req.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Order #{req.id}</h3>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                        req.status === 'OPEN' ? 'bg-green-50 text-green-700 border-green-200' :
                        req.status === 'BIDDING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                        {req.status}
                    </span>
                 </div>

                 <div className="space-y-2 mb-4">
                     {req.items.map((item, i) => (
                         <div key={i} className="flex justify-between text-sm border-b border-slate-50 pb-2 last:border-0">
                             <span className="text-slate-700">{item.name}</span>
                             <span className="font-bold text-slate-900">{item.qty} {item.unit}</span>
                         </div>
                     ))}
                 </div>

                 <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        Deadline: <span className="font-medium text-slate-700">{new Date(req.deadline).toLocaleDateString()}</span>
                    </div>
                    {req.status === 'BIDDING' && (
                        <span className="text-blue-600 font-bold cursor-pointer hover:underline">View Bids &rarr;</span>
                    )}
                 </div>
             </div>
         ))}
      </div>

      {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Create Stock Request</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Needed</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Fresh Tomatoes"
                            value={newReq.itemName}
                            onChange={e => setNewReq({...newReq, itemName: e.target.value})}
                          />
                      </div>
                      <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                            <input 
                                type="number" 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="50"
                                value={newReq.quantity}
                                onChange={e => setNewReq({...newReq, quantity: e.target.value})}
                            />
                          </div>
                          <div className="w-1/3">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unit</label>
                            <select 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white outline-none"
                                value={newReq.unit}
                                onChange={e => setNewReq({...newReq, unit: e.target.value})}
                            >
                                <option>Pcs</option>
                                <option>Kg</option>
                                <option>Crates</option>
                                <option>Sacks</option>
                            </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deadline</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newReq.deadline}
                            onChange={e => setNewReq({...newReq, deadline: e.target.value})}
                          />
                      </div>
                      <div className="flex gap-3 pt-4">
                          <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 text-slate-500 hover:bg-slate-50 rounded-lg font-medium">Cancel</button>
                          <button onClick={handleCreate} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Submit Request</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
