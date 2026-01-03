
import React, { useState, useEffect } from 'react';
import { Vendor, UserRole, Transaction } from '../types';
import { MOCK_VENDORS, CITIES, MARKETS } from '../constants';
import { ApiService } from '../services/api';
import { PaymentGateway } from './PaymentGateway';
import { VendorKYCForm } from './VendorKYCForm';
import { VendorDetailsModal } from './VendorDetailsModal';
import { 
  Search, QrCode, Ban, CheckCircle, Gavel, Power, CreditCard, Download, X,
  FileText, Save, AlertTriangle, UserPlus, Building2, Loader2,
  Layers, DollarSign, ShieldAlert, Mail, MapPin, Tag, Phone, Printer, RefreshCcw,
  Store, ArrowUpDown, ArrowUp, ArrowDown, Calendar, ShieldCheck
} from 'lucide-react';
import { Button } from './ui/Button';

interface VendorModuleProps {
  userRole?: UserRole;
  currentUserId?: string;
  marketId?: string;
}

export const VendorModule: React.FC<VendorModuleProps> = ({ userRole = UserRole.USER, currentUserId, marketId }) => {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toolbar Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('c1'); // Kampala
  const [selectedMarket, setSelectedMarket] = useState('m1'); // Nakasero Market
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rentDueFilter, setRentDueFilter] = useState('ALL');
  const [rentSortOrder, setRentSortOrder] = useState<'NONE' | 'ASC' | 'DESC'>('NONE');
  
  // Modals
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [addVendorStep, setAddVendorStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  
  const [isKycValid, setIsKycValid] = useState(false);
  const [isSubmittingNewVendor, setIsSubmittingNewVendor] = useState(false);

  const [newVendorData, setNewVendorData] = useState({
    name: '', shopNumber: '', marketId: marketId || '', email: '', phone: '',
    rentDue: 0, rentDueDate: '', vatDue: 0, status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
    kycVerified: false, gender: 'MALE' as 'MALE' | 'FEMALE', age: 30,
    cityId: '', level: '', section: '', storeType: 'Retail', ownershipType: 'Sole Proprietorship'
  });

  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;
  const isMarketAdmin = userRole === UserRole.MARKET_ADMIN;

  const getMarketName = (id: string) => MARKETS.find(m => m.id === id)?.name || id;

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.vendors.getAll();
        if (response.data && Array.isArray(response.data)) setVendors(response.data);
      } catch (error) {
        console.warn("Backend API unavailable, using mock data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v => {
    if (isMarketAdmin && marketId && v.marketId !== marketId) return false;

    const term = searchTerm.toLowerCase();
    const matchesSearch = v.name.toLowerCase().includes(term) || 
                          v.shopNumber.toLowerCase().includes(term) ||
                          (v.email && v.email.toLowerCase().includes(term));
                          
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesMarket = selectedMarket ? v.marketId === selectedMarket : true;
    const market = MARKETS.find(m => m.id === v.marketId);
    const matchesCity = selectedCity ? market?.cityId === selectedCity : true;

    let matchesRentRange = true;
    if (rentDueFilter === '0-50K') matchesRentRange = v.rentDue >= 0 && v.rentDue <= 50000;
    else if (rentDueFilter === '50K-200K') matchesRentRange = v.rentDue > 50000 && v.rentDue <= 200000;
    else if (rentDueFilter === '200K+') matchesRentRange = v.rentDue > 200000;

    return matchesSearch && matchesStatus && matchesMarket && matchesCity && matchesRentRange;
  }).sort((a, b) => {
    if (rentSortOrder === 'ASC') return a.rentDue - b.rentDue;
    if (rentSortOrder === 'DESC') return b.rentDue - a.rentDue;
    return 0;
  });

  const availableMarketsForForm = MARKETS.filter(m => !newVendorData.cityId || m.cityId === newVendorData.cityId);

  const handleSubmitNewVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorData.name || !newVendorData.shopNumber || !newVendorData.marketId) {
      alert("Missing required fields."); return;
    }
    if (!isKycValid) {
      alert("Please upload valid KYC documents."); return;
    }
    setIsSubmittingNewVendor(true);
    setTimeout(() => {
      setIsSubmittingNewVendor(false);
      const newV: Vendor = {
        id: `v${Date.now()}`,
        ...newVendorData,
        productsCount: 0,
        kycVerified: newVendorData.kycVerified,
      };
      setVendors(prev => [newV, ...prev]);
      setAddVendorStep('SUCCESS');
    }, 1200);
  };

  const resetAddVendorModal = () => {
    setShowAddVendorModal(false);
    setAddVendorStep('FORM');
    setIsKycValid(false);
    setNewVendorData({ 
        name: '', shopNumber: '', marketId: isMarketAdmin && marketId ? marketId : '', 
        email: '', phone: '', rentDue: 0, rentDueDate: '', vatDue: 0, status: 'ACTIVE', 
        kycVerified: false, gender: 'MALE', age: 30, cityId: '', level: '', 
        section: '', storeType: 'Retail', ownershipType: 'Sole Proprietorship' 
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedMarket('');
    setStatusFilter('ALL');
    setRentDueFilter('ALL');
    setRentSortOrder('NONE');
  };

  const toggleRentSort = () => {
      // Fixed: corrected variable name to rentSortOrder
      if (rentSortOrder === 'NONE') setRentSortOrder('ASC');
      else if (rentSortOrder === 'ASC') setRentSortOrder('DESC');
      else setRentSortOrder('NONE');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Name or Shop..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
            </select>
            
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                <select className="px-3 py-2 text-sm bg-transparent outline-none border-none" value={rentDueFilter} onChange={(e) => setRentDueFilter(e.target.value)}>
                    <option value="ALL">All Ranges</option>
                    <option value="0-50K">0 - 50K</option>
                    <option value="50K-200K">50K - 200K</option>
                    <option value="200K+">200K+</option>
                </select>
                <button 
                    onClick={toggleRentSort}
                    className={`px-3 py-2 transition-colors hover:bg-slate-200 flex items-center gap-1 border-l border-slate-200 ${rentSortOrder !== 'NONE' ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}
                    title="Sort by Rent Amount"
                >
                    {rentSortOrder === 'ASC' ? <ArrowUp size={16} /> : rentSortOrder === 'DESC' ? <ArrowDown size={16} /> : <ArrowUpDown size={16} />}
                    <span className="text-[10px] uppercase font-black tracking-widest hidden lg:inline">Sort</span>
                </button>
            </div>

            {!isMarketAdmin && (
              <>
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedMarket(''); }}>
                    <option value="">All Cities</option>
                    {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" value={selectedMarket} onChange={(e) => setSelectedMarket(e.target.value)}>
                    <option value="">All Markets</option>
                    {MARKETS.filter(m => !selectedCity || m.cityId === selectedCity).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </>
            )}
            <button onClick={clearFilters} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Reset Filters">
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
        
        {isAdmin && (
          <Button onClick={() => setShowAddVendorModal(true)} className="w-full xl:w-auto flex items-center justify-center gap-2">
            <UserPlus size={18} /> Add New Vendor
          </Button>
        )}
      </div>

      {/* Vendor Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Vendor Info</th>
              <th className="px-6 py-4">Shop</th>
              <th className="px-6 py-4">Rent / Due Date</th>
              <th className="px-6 py-4">Account Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVendors.map(vendor => (
              <tr key={vendor.id} className="hover:bg-slate-50 cursor-pointer group" onClick={() => setSelectedVendor(vendor)}>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{vendor.name}</div>
                  <div className="text-xs text-slate-500">{vendor.email || vendor.gender + ' • ' + vendor.age + 'y'}</div>
                </td>
                <td className="px-6 py-4">
                    <div className="font-mono text-slate-700 font-bold">{vendor.shopNumber}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{vendor.section || 'General'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                      {vendor.rentDue > 0 ? (
                        <span className="text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} /> {vendor.rentDue.toLocaleString()} UGX
                        </span>
                      ) : (
                        <span className="text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1 w-fit">
                          <CheckCircle size={12} /> Paid
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                         <Calendar size={10} />
                         {vendor.rentDueDate ? `Due: ${vendor.rentDueDate}` : 'No date set'}
                      </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${vendor.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                     <button onClick={(e) => { e.stopPropagation(); setQrModalVendor(vendor); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600" title="Store QR Profile">
                       <QrCode size={18} />
                     </button>
                     <button onClick={(e) => { e.stopPropagation(); setSelectedVendor(vendor); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600" title="View Details">
                       <FileText size={18} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
            {filteredVendors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                   No registry nodes triangulated for current parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* QR Store Profile Modal */}
      {qrModalVendor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <button onClick={() => setQrModalVendor(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24}/></button>
            
            <div className="mb-6">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Store Passport</h3>
              <p className="text-slate-500 text-sm font-medium">Digital identity for regional trade.</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-[32px] shadow-2xl mb-8 border-4 border-slate-800">
               <div className="bg-white p-4 rounded-2xl shadow-inner flex items-center justify-center">
                  <QrCode size={180} className="text-slate-900" />
               </div>
               <div className="mt-4 text-white font-mono text-sm tracking-widest uppercase opacity-80">
                  {qrModalVendor.id}-{qrModalVendor.shopNumber}
               </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest px-4">
                 <span className="text-slate-400">Vendor:</span>
                 <span className="text-slate-900 font-black">{qrModalVendor.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest px-4">
                 <span className="text-slate-400">Location:</span>
                 <span className="text-slate-900 font-black">{getMarketName(qrModalVendor.marketId)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest px-4">
                 <span className="text-slate-400">Shop ID:</span>
                 <span className="text-indigo-600 font-black">{qrModalVendor.shopNumber}</span>
              </div>
            </div>

            <div className="flex gap-3">
               <Button variant="secondary" className="flex-1 font-black uppercase text-[10px] tracking-widest"><Printer size={16} /> Print</Button>
               <Button className="flex-1 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100"><Download size={16} /> Export</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight"><UserPlus size={20} className="text-indigo-600" /> Register Entity</h3>
                  <button onClick={resetAddVendorModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              {addVendorStep === 'FORM' ? (
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmitNewVendor} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name *</label>
                                <input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all" value={newVendorData.name} onChange={e => setNewVendorData({...newVendorData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                                <select className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none" value={newVendorData.gender} onChange={e => setNewVendorData({...newVendorData, gender: e.target.value as any})}><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none" value={newVendorData.age} onChange={e => setNewVendorData({...newVendorData, age: parseInt(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <input type="email" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none" value={newVendorData.email} onChange={e => setNewVendorData({...newVendorData, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none" value={newVendorData.phone} onChange={e => setNewVendorData({...newVendorData, phone: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                                <select className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none" value={newVendorData.cityId} onChange={e => setNewVendorData({...newVendorData, cityId: e.target.value, marketId: ''})}><option value="">Select City</option>{CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Market *</label>
                                <select required className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none" value={newVendorData.marketId} onChange={e => setNewVendorData({...newVendorData, marketId: e.target.value})} disabled={!newVendorData.cityId}><option value="">Select Market</option>{availableMarketsForForm.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                            </div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shop Number *</label><input required className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none font-mono" value={newVendorData.shopNumber} onChange={e => setNewVendorData({...newVendorData, shopNumber: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rent Amount (UGX)</label><input type="number" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none" value={newVendorData.rentDue} onChange={e => setNewVendorData({...newVendorData, rentDue: parseFloat(e.target.value)})} /></div>
                            <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rent Due Date</label><input type="date" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none" value={newVendorData.rentDueDate} onChange={e => setNewVendorData({...newVendorData, rentDueDate: e.target.value})} /></div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14}/> Identity Verification</h4>
                            <VendorKYCForm onFilesChange={(f, v) => setIsKycValid(v)} />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={resetAddVendorModal} className="flex-1 uppercase font-black tracking-widest text-[10px]">Cancel</Button>
                            <Button type="submit" disabled={isSubmittingNewVendor} className="flex-1 flex items-center justify-center gap-2 uppercase font-black tracking-widest text-[10px] shadow-xl shadow-indigo-100">{isSubmittingNewVendor ? <Loader2 className="animate-spin" /> : <Save size={16} />} Commit Registry</Button>
                        </div>
                    </form>
                </div>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center text-center animate-in zoom-in">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm"><Loader2 size={48} className="animate-spin" /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Registry Record Pending</h3>
                    <p className="text-slate-500 mb-8 text-sm max-w-xs leading-relaxed font-medium">
                        Vendor application for <strong>{newVendorData.name}</strong> at <strong>{getMarketName(newVendorData.marketId)}</strong> has been submitted. Awaiting administrative triangulation.
                    </p>
                    <Button onClick={resetAddVendorModal} className="w-full max-w-xs font-black uppercase tracking-widest text-xs">Return to Terminal</Button>
                </div>
              )}
           </div>
        </div>
      )}

      {selectedVendor && (
        <VendorDetailsModal 
          vendor={selectedVendor} 
          userRole={userRole} 
          onClose={() => setSelectedVendor(null)} 
          onUpdateVendor={(u) => setVendors(prev => prev.map(v => v.id === u.id ? u : v))} 
        />
      )}
    </div>
  );
};
