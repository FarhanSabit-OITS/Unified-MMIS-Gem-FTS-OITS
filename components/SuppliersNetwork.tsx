import React, { useState } from 'react';
import { MOCK_SUPPLIERS, MOCK_REQUISITIONS, MOCK_BIDS } from '../constants';
import { Supplier, Bid, Requisition, UserRole } from '../types';
import { Star, ShieldCheck, Truck, BarChart3, X, Gavel, FileText, CheckCircle2, Bot, Search, Lock, MessageSquare } from 'lucide-react';

interface SuppliersNetworkProps {
  userRole?: UserRole;
  userId?: string;
}

export const SuppliersNetwork: React.FC<SuppliersNetworkProps> = ({ userRole = UserRole.USER, userId }) => {
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'BIDDING'>('DIRECTORY');

  // Directory State
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [ratingModalSupplier, setRatingModalSupplier] = useState<Supplier | null>(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');

  // Bidding State
  const [requisitions, setRequisitions] = useState<Requisition[]>(MOCK_REQUISITIONS);
  const [bids, setBids] = useState<Bid[]>(MOCK_BIDS);
  const [selectedReq, setSelectedReq] = useState<Requisition | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidNote, setBidNote] = useState('');

  // Permissions
  const canRate = userRole === UserRole.VENDOR;
  const canBid = userRole === UserRole.SUPPLIER;

  // --- Directory Handlers ---
  const filteredSuppliers = suppliers.filter(s => 
    s.companyName.toLowerCase().includes(supplierSearch.toLowerCase()) || 
    s.categories.some(c => c.toLowerCase().includes(supplierSearch.toLowerCase()))
  );

  const handleRateSubmit = () => {
    if (!ratingModalSupplier || currentRating === 0) return;

    // Calculate new average rating
    const currentTotalRatings = ratingModalSupplier.totalRatings;
    const currentAverage = ratingModalSupplier.rating;
    
    const newTotalRatings = currentTotalRatings + 1;
    // Formula: (OldAvg * OldCount + NewRating) / NewCount
    const newAverage = ((currentAverage * currentTotalRatings) + currentRating) / newTotalRatings;

    // Update state
    setSuppliers(prevSuppliers => prevSuppliers.map(s => {
      if (s.id === ratingModalSupplier.id) {
        return {
          ...s,
          rating: parseFloat(newAverage.toFixed(1)),
          totalRatings: newTotalRatings
        };
      }
      return s;
    }));

    alert(`Rating of ${currentRating} stars submitted for ${ratingModalSupplier.companyName}. Review stored.`);
    console.log("Review submitted:", reviewText);
    
    setRatingModalSupplier(null);
    setCurrentRating(0);
    setReviewText('');
  };

  // --- Bidding Handlers ---
  const handlePlaceBid = () => {
      if (!selectedReq || !bidAmount) return;
      if (!canBid) {
          alert("Only registered Suppliers can place bids.");
          return;
      }
      
      const newBid: Bid = {
          id: `b${Date.now()}`,
          requisitionId: selectedReq.id,
          supplierId: userId || 'unknown-supplier', 
          supplierName: 'My Supplier Ltd', // In real app, fetch from user profile
          amount: parseFloat(bidAmount),
          deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days later
          status: 'PENDING',
          aiTrustScore: Math.floor(Math.random() * (98 - 70 + 1)) + 70 // Mock AI score
      };

      setBids([...bids, newBid]);
      setBidAmount('');
      setBidNote('');
      alert('Bid Placed Successfully! AI has analyzed your proposal.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Suppliers Network Hub</h2>
          <p className="text-slate-500 text-sm">Connect with verified suppliers, view trust scores, and manage requisitions.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-1 rounded-lg flex">
            <button 
                onClick={() => setActiveTab('DIRECTORY')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'DIRECTORY' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
                Directory
            </button>
            <button 
                onClick={() => setActiveTab('BIDDING')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'BIDDING' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500'}`}
            >
                Bidding War-Room <Gavel size={14} />
            </button>
        </div>
      </div>

      {activeTab === 'DIRECTORY' ? (
          /* --- DIRECTORY VIEW --- */
          <>
            {/* Search Input */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search suppliers by name or category (e.g. 'Electronics', 'Vegetables')..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4">
              {filteredSuppliers.map(supplier => (
                <div key={supplier.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${
                      (supplier.trustScore || 0) > 80 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      <BarChart3 size={12} />
                      {(supplier.trustScore || 0)}/100 Trust
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{supplier.companyName}</h3>
                    
                    {/* Rating Display */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                          <Star size={16} className="text-amber-500 fill-amber-500" />
                          <span className="font-bold text-amber-700">{supplier.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-slate-400">({supplier.totalRatings} Reviews)</span>
                      {supplier.kycVerified && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          <ShieldCheck size={10} /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {supplier.categories.map(cat => (
                      <span key={cat} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {canRate ? (
                      <button 
                        onClick={() => setRatingModalSupplier(supplier)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Rate Supplier
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed border border-slate-200"
                        title="Only Vendors can rate suppliers"
                      >
                        Rate Supplier
                      </button>
                    )}
                    <button className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                      View Profile
                    </button>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Truck size={100} />
                  </div>
                </div>
              ))}
              {filteredSuppliers.length === 0 && (
                  <div className="col-span-full text-center py-10 text-slate-400">
                      No suppliers found matching "{supplierSearch}"
                  </div>
              )}
            </div>
          </>
      ) : (
          /* --- BIDDING WAR ROOM --- */
          <div className="flex gap-6 h-[calc(100vh-14rem)] animate-in fade-in slide-in-from-bottom-4">
              {/* Left: Requisition List */}
              <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">Open Requisitions</div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {requisitions.map(req => (
                          <div 
                             key={req.id}
                             onClick={() => setSelectedReq(req)}
                             className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                                 selectedReq?.id === req.id ? 'bg-purple-50 border-purple-300 shadow-sm' : 'bg-white border-slate-200'
                             }`}
                          >
                              <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-bold text-slate-500">{req.marketId === 'm1' ? 'Nakasero' : 'Owino'} Market</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                                      req.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                  }`}>{req.status}</span>
                              </div>
                              <h4 className="font-bold text-slate-800 mb-1">{req.vendorName}</h4>
                              <p className="text-sm text-slate-600">{req.items.map(i => `${i.qty} ${i.unit} ${i.name}`).join(', ')}</p>
                              <div className="mt-3 text-xs text-slate-400">Deadline: {new Date(req.deadline).toLocaleDateString()}</div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Right: Details & Bidding Form */}
              <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  {selectedReq ? (
                      <div className="flex-1 flex flex-col">
                          <div className="p-6 border-b border-slate-200">
                              <h3 className="text-xl font-bold text-slate-900 mb-1">Place Bid for Order #{selectedReq.id}</h3>
                              <p className="text-sm text-slate-500">Review requirements and submit your best offer.</p>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto p-6 space-y-6">
                              {/* Requirement Details */}
                              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><FileText size={16}/> Requirements</h4>
                                  <ul className="space-y-2 text-sm text-slate-600">
                                      {selectedReq.items.map((item, idx) => (
                                          <li key={idx} className="flex justify-between border-b border-slate-200 pb-1 last:border-0">
                                              <span>{item.name}</span>
                                              <span className="font-bold text-slate-900">{item.qty} {item.unit}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>

                              {/* Bidding Form (Suppliers Only) */}
                              {canBid ? (
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><Gavel size={16}/> Your Offer</h4>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bid Amount (UGX)</label>
                                            <input 
                                                type="number" 
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                placeholder="e.g. 500000"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Delivery Date</label>
                                            <input type="date" className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notes / Terms</label>
                                        <textarea 
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-none"
                                            placeholder="Specifics about delivery or quality..."
                                            value={bidNote}
                                            onChange={(e) => setBidNote(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <button 
                                        onClick={handlePlaceBid}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        Submit Competitive Bid
                                    </button>
                                </div>
                              ) : (
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center">
                                    <Lock className="text-slate-400 mb-2" size={32} />
                                    <h4 className="font-bold text-slate-700">Restricted Access</h4>
                                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                                        Only KYC-verified Suppliers can submit bids. You are currently viewing as {userRole}.
                                    </p>
                                </div>
                              )}

                              {/* Live Bids Feed */}
                              <div>
                                  <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Live Activity</h4>
                                  <div className="space-y-3">
                                      {bids.filter(b => b.requisitionId === selectedReq.id).map(bid => (
                                          <div key={bid.id} className="p-3 rounded-lg border border-slate-100 flex justify-between items-center hover:bg-slate-50">
                                              <div>
                                                  <div className="font-bold text-slate-800">{bid.supplierName}</div>
                                                  <div className="text-xs text-slate-500">{new Date().toLocaleDateString()}</div>
                                              </div>
                                              <div className="text-right">
                                                  <div className="font-bold text-slate-900">{bid.amount.toLocaleString()} UGX</div>
                                                  <div className="flex items-center justify-end gap-1 text-xs text-green-600 font-bold">
                                                      <Bot size={12} /> {bid.aiTrustScore}% Match
                                                  </div>
                                              </div>
                                          </div>
                                      ))}
                                      {bids.filter(b => b.requisitionId === selectedReq.id).length === 0 && (
                                          <div className="text-center text-slate-400 text-xs py-4">No bids placed yet. Be the first!</div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <Gavel size={48} className="mb-4 opacity-20" />
                          <p>Select a requisition to view details and bid.</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Rating & Review Modal */}
      {ratingModalSupplier && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
             <div className="flex justify-between items-center mb-4">
               <div>
                 <h3 className="text-lg font-bold text-slate-900">Rate Supplier</h3>
                 <p className="text-xs text-slate-500">{ratingModalSupplier.companyName}</p>
               </div>
               <button onClick={() => setRatingModalSupplier(null)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
             </div>
             
             <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setCurrentRating(star)}
                    className="hover:scale-110 transition-transform focus:outline-none"
                  >
                    <Star 
                      size={32} 
                      className={`${star <= currentRating ? "text-amber-400 fill-amber-400" : "text-slate-300"} transition-colors`} 
                    />
                  </button>
                ))}
             </div>

             <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Write a Review (Optional)</label>
                <textarea 
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                    placeholder="Describe your experience with delivery times, product quality..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
             </div>

             <div className="text-center text-sm text-slate-500 mb-6">
                {currentRating === 0 ? "Select a rating to submit" : `You are rating ${currentRating} out of 5 stars`}
             </div>

             <button 
                disabled={currentRating === 0}
                onClick={handleRateSubmit}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
             >
               <CheckCircle2 size={18} /> Submit Review
             </button>
           </div>
        </div>
      )}
    </div>
  );
};