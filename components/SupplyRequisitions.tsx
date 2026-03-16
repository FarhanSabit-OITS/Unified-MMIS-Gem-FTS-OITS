
import React, { useState } from 'react';
import { MOCK_REQUISITIONS, MOCK_BIDS } from '../constants';
import { Requisition, Bid, UserRole } from '../types';
import { Truck, Plus, Calendar, Clock, CheckCircle2, XCircle, Search, DollarSign, Bot, Check, X, Trash2, Filter, Package } from 'lucide-react';

export const SupplyRequisitions: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const [requisitions, setRequisitions] = useState<Requisition[]>(MOCK_REQUISITIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReqForBids, setSelectedReqForBids] = useState<Requisition | null>(null);
  const [bids, setBids] = useState<Bid[]>(MOCK_BIDS);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'BIDDING' | 'FULFILLED'>('ALL');
  
  const [newReqItems, setNewReqItems] = useState([{ name: '', qty: '', unit: 'Pcs' }]);
  const [newReqDeadline, setNewReqDeadline] = useState('');

  const handleAddItem = () => {
    setNewReqItems([...newReqItems, { name: '', qty: '', unit: 'Pcs' }]);
  };

  const handleRemoveItem = (index: number) => {
    setNewReqItems(newReqItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const updated = [...newReqItems];
    updated[index] = { ...updated[index], [field]: value };
    setNewReqItems(updated);
  };

  const handleCreate = () => {
    // Validation
    if (!newReqDeadline) {
        alert("Please select a deadline.");
        return;
    }
    const validItems = newReqItems.filter(item => item.name.trim() !== '' && item.qty !== '');
    if (validItems.length === 0) {
        alert("Please add at least one valid item.");
        return;
    }

    const req: Requisition = {
        id: `req-${Date.now()}`,
        vendorId: 'v1',
        vendorName: 'Alice Namatovu', // Logged in user simulation
        marketId: 'm1',
        items: validItems.map(i => ({ name: i.name, qty: parseInt(i.qty), unit: i.unit })),
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        deadline: newReqDeadline
    };

    setRequisitions([req, ...requisitions]);
    setShowCreateModal(false);
    setNewReqItems([{ name: '', qty: '', unit: 'Pcs' }]);
    setNewReqDeadline('');
  };

  const handleAcceptBid = (bidId: string) => {
      if(!confirm("Are you sure you want to accept this bid? This will lock funds in escrow.")) return;
      
      // Update Bid Status
      setBids(prev => prev.map(b => b.id === bidId ? { ...b, status: 'ACCEPTED' } : b));
      
      // Update Requisition Status
      if (selectedReqForBids) {
          setRequisitions(prev => prev.map(r => r.id === selectedReqForBids.id ? { ...r, status: 'FULFILLED' } : r));
      }
      
      alert("Bid Accepted! Logistics token generated for supplier.");
      setSelectedReqForBids(null);
  };

  const handleCancelReq = (reqId: string) => {
      if(!confirm("Are you sure you want to cancel this requisition?")) return;
      setRequisitions(prev => prev.filter(r => r.id !== reqId));
  };

  const getBidsForReq = (reqId: string) => bids.filter(b => b.requisitionId === reqId);

  const filteredRequisitions = requisitions.filter(req => {
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
      return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Product Requisitions</h2>
          <p className="text-slate-500 text-sm">Request stock from the supplier network and manage bids.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm">
                <Filter size={16} className="text-slate-400 ml-2 mr-1" />
                <select 
                    className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 outline-none pr-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="BIDDING">Bidding</option>
                    <option value="FULFILLED">Fulfilled</option>
                </select>
            </div>
            <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors"
            >
                <Plus size={18} /> New Request
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
         {filteredRequisitions.map(req => (
             <div key={req.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${
                            req.status === 'FULFILLED' ? 'bg-green-50 text-green-600' : 
                            req.status === 'BIDDING' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                            <Package size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">Order #{req.id}</h3>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                        req.status === 'OPEN' ? 'bg-green-50 text-green-700 border-green-200' :
                        req.status === 'BIDDING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                        {req.status}
                    </span>
                 </div>

                 <div className="space-y-2 mb-4 flex-1">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Requested Items</div>
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
                    <div className="flex items-center gap-3">
                        {req.status === 'OPEN' && (
                            <button onClick={() => handleCancelReq(req.id)} className="text-red-500 hover:text-red-700 font-medium">Cancel</button>
                        )}
                        <button 
                            onClick={() => setSelectedReqForBids(req)}
                            className="text-blue-600 font-bold cursor-pointer hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
                        >
                            {getBidsForReq(req.id).length} Bids &rarr;
                        </button>
                    </div>
                 </div>
             </div>
         ))}
         {filteredRequisitions.length === 0 && (
             <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                 <Package size={48} className="mx-auto text-slate-300 mb-3" />
                 <h3 className="text-lg font-bold text-slate-700 mb-1">No Requisitions Found</h3>
                 <p className="text-slate-500 text-sm">You haven't created any product requests matching this filter.</p>
             </div>
         )}
      </div>

      {/* Create Requisition Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Create Product Requisition</h3>
                      <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                      <div>
                          <div className="flex justify-between items-center mb-3">
                              <label className="block text-xs font-bold text-slate-500 uppercase">Items Needed</label>
                              <button onClick={handleAddItem} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                  <Plus size={14} /> Add Item
                              </button>
                          </div>
                          
                          <div className="space-y-3">
                              {newReqItems.map((item, index) => (
                                  <div key={index} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                                      <div className="flex-1">
                                          <input 
                                            type="text" 
                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Item name (e.g. Tomatoes)"
                                            value={item.name}
                                            onChange={e => handleItemChange(index, 'name', e.target.value)}
                                          />
                                      </div>
                                      <div className="w-24">
                                          <input 
                                            type="number" 
                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Qty"
                                            value={item.qty}
                                            onChange={e => handleItemChange(index, 'qty', e.target.value)}
                                          />
                                      </div>
                                      <div className="w-28">
                                          <select 
                                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white outline-none"
                                            value={item.unit}
                                            onChange={e => handleItemChange(index, 'unit', e.target.value)}
                                          >
                                              <option>Pcs</option>
                                              <option>Kg</option>
                                              <option>Crates</option>
                                              <option>Sacks</option>
                                              <option>Boxes</option>
                                          </select>
                                      </div>
                                      {newReqItems.length > 1 && (
                                          <button onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mt-0.5">
                                              <Trash2 size={16} />
                                          </button>
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Delivery Deadline</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newReqDeadline}
                            onChange={e => setNewReqDeadline(e.target.value)}
                          />
                          <p className="text-xs text-slate-500 mt-2">Bidding will automatically close 12 hours before this deadline.</p>
                      </div>
                  </div>

                  <div className="flex gap-3 pt-6 mt-4 border-t border-slate-100">
                      <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors">Cancel</button>
                      <button onClick={handleCreate} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Publish Requisition</button>
                  </div>
              </div>
          </div>
      )}

      {/* Bid Review Modal */}
      {selectedReqForBids && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <div>
                          <h3 className="text-xl font-bold text-slate-900">Bid Analysis</h3>
                          <p className="text-sm text-slate-500 mt-1">Requisition #{selectedReqForBids.id} • {selectedReqForBids.items.length} items requested</p>
                      </div>
                      <button onClick={() => setSelectedReqForBids(null)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
                      {getBidsForReq(selectedReqForBids.id).length === 0 ? (
                          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                              <Search size={48} className="mx-auto mb-4 text-slate-300" />
                              <h4 className="text-lg font-bold text-slate-700">No Bids Yet</h4>
                              <p className="text-slate-500 text-sm mt-1">Suppliers have not placed any bids on this requisition.</p>
                          </div>
                      ) : (
                          <div className="space-y-4">
                              {getBidsForReq(selectedReqForBids.id).map(bid => (
                                  <div key={bid.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden">
                                      {bid.status === 'ACCEPTED' && (
                                          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                                              Winning Bid
                                          </div>
                                      )}
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                          <div>
                                              <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                                  {bid.supplierName}
                                                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">Verified Supplier</span>
                                              </h4>
                                              <div className="flex items-center gap-3 mt-2">
                                                  <span className="text-sm text-slate-600 flex items-center gap-1">
                                                      <Truck size={14} className="text-slate-400"/> Delivers: {bid.deliveryDate}
                                                  </span>
                                                  <div className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                                                      <Bot size={14} /> {bid.aiTrustScore}% AI Match Score
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="text-left sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-100 w-full sm:w-auto">
                                              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Offer</div>
                                              <div className="text-2xl font-black text-slate-900">{bid.amount.toLocaleString()} <span className="text-sm font-bold text-slate-500">UGX</span></div>
                                          </div>
                                      </div>
                                      
                                      {bid.status === 'PENDING' && selectedReqForBids.status !== 'FULFILLED' && (
                                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                                              <button className="px-5 py-2.5 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-lg transition-colors">View Supplier Profile</button>
                                              <button 
                                                  onClick={() => handleAcceptBid(bid.id)}
                                                  className="px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-md shadow-green-200 transition-all"
                                              >
                                                  <CheckCircle2 size={16} /> Accept & Lock Escrow
                                              </button>
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

