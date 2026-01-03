
import React, { useState, useEffect } from 'react';
import { Vendor, UserRole, ProductCategory } from '../types';
import { MOCK_VENDORS, CITIES, MARKETS } from '../constants';
import { ApiService } from '../services/api';
import { VendorKYCForm } from './VendorKYCForm';
import { VendorDetailsModal } from './VendorDetailsModal';
import { 
  Search, QrCode, CheckCircle, Save, AlertTriangle, UserPlus, Loader2,
  RefreshCcw, Store, ArrowUpDown, ArrowUp, ArrowDown, Calendar, ShieldCheck,
  CheckSquare, Square, Play, Ban, X, Download, FileText, Printer
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
  
  // Selection State
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  
  // Toolbar Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rentDueFilter, setRentDueFilter] = useState('ALL');
  const [rentSortOrder, setRentSortOrder] = useState<'NONE' | 'ASC' | 'DESC'>('NONE');
  const [nameSortOrder, setNameSortOrder] = useState<'NONE' | 'ASC' | 'DESC'>('NONE');
  
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
    cityId: '', level: '', section: '', storeType: ProductCategory.GENERAL, ownershipType: 'Sole Proprietorship'
  });

  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;
  const isMarketAdmin = userRole === UserRole.MARKET_ADMIN;

  const getMarketName = (id: string) => MARKETS.find(m => m.id === id)?.name || id;

  const getRentStatus = (vendor: Vendor) => {
    if (vendor.rentDue <= 0) return { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    const dueDate = vendor.rentDueDate ? new Date(vendor.rentDueDate) : null;
    const today = new Date();
    if (dueDate && dueDate < today) return { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-200' };
    return { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' };
  };

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
    if (nameSortOrder !== 'NONE') {
      const comparison = a.name.localeCompare(b.name);
      return nameSortOrder === 'ASC' ? comparison : -comparison;
    }
    if (rentSortOrder === 'ASC') return a.rentDue - b.rentDue;
    if (rentSortOrder === 'DESC') return b.rentDue - a.rentDue;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedVendorIds.length === filteredVendors.length) {
      setSelectedVendorIds([]);
    } else {
      setSelectedVendorIds(filteredVendors.map(v => v.id));
    }
  };

  const toggleSelectVendor = (id: string) => {
    setSelectedVendorIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'ACTIVATE' | 'SUSPEND') => {
    if (selectedVendorIds.length === 0) return;
    const status = action === 'ACTIVATE' ? 'ACTIVE' : 'SUSPENDED';
    setVendors(prev => prev.map(v => 
      selectedVendorIds.includes(v.id) ? { ...v, status: status as any } : v
    ));
    setSelectedVendorIds([]);
    alert(`Bulk ${action} completed for ${selectedVendorIds.length} nodes.`);
  };

  const toggleNameSort = () => {
    setRentSortOrder('NONE');
    setNameSortOrder(prev => prev === 'NONE' ? 'ASC' : prev === 'ASC' ? 'DESC' : 'NONE');
  };

  const toggleRentSort = () => {
    setNameSortOrder('NONE');
    setRentSortOrder(prev => prev === 'NONE' ? 'ASC' : prev === 'ASC' ? 'DESC' : 'NONE');
  };

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
        section: '', storeType: ProductCategory.GENERAL, ownershipType: 'Sole Proprietorship' 
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Bulk Action Toolbar */}
      {selectedVendorIds.length > 0 && isMarketAdmin && (
        <div className="bg-indigo-600 p-4 rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 text-white">
          <div className="flex items-center gap-4">
             <div className="bg-white/20 p-2 rounded-lg font-black text-xs">{selectedVendorIds.length} Selected</div>
             <p className="text-sm font-bold hidden md:block">Registry batch operations active.</p>
          </div>
          <div className="flex gap-2">
             <button onClick={() => handleBulkAction('ACTIVATE')} className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                <Play size={14}/> Activate All
             </button>
             <button onClick={() => handleBulkAction('SUSPEND')} className="px-4 py-2 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all shadow-sm">
                <Ban size={14}/> Suspend All
             </button>
             <button onClick={() => setSelectedVendorIds([])} className="p-2 text-white/60 hover:text-white"><X size={20}/></button>
          </div>
        </div>
      )}

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
                >
                    {rentSortOrder === 'ASC' ? <ArrowUp size={16} /> : rentSortOrder === 'DESC' ? <ArrowDown size={16} /> : <ArrowUpDown size={16} />}
                </button>
            </div>

            <button onClick={toggleNameSort} className={`px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 flex items-center gap-2 transition-all ${nameSortOrder !== 'NONE' ? 'text-indigo-600 border-indigo-200 bg-indigo-50 font-bold' : 'text-slate-500'}`}>
               Name {nameSortOrder === 'ASC' ? <ArrowUp size={14}/> : nameSortOrder === 'DESC' ? <ArrowDown size={14}/> : <ArrowUpDown size={14}/>}
            </button>

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
            <button onClick={() => {setSearchTerm(''); setStatusFilter('ALL'); setRentSortOrder('NONE'); setNameSortOrder('NONE');}} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Reset Filters">
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
          <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-200">
            <tr>
              {isMarketAdmin && (
                <th className="px-6 py-4 w-10">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-indigo-600">
                    {selectedVendorIds.length === filteredVendors.length && filteredVendors.length > 0 ? <CheckSquare size={18}/> : <Square size={18}/>}
                  </button>
                </th>
              )}
              <th className="px-6 py-4">Vendor Info</th>
              <th className="px-6 py-4">Shop Node</th>
              <th className="px-6 py-4">Rent Status</th>
              <th className="px-6 py-4">Acc. Status</th>
              <th className="px-6 py-4 text-right">Registry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVendors.map(vendor => {
              const rentStatus = getRentStatus(vendor);
              return (
                <tr key={vendor.id} className={`hover:bg-slate-50 cursor-pointer group transition-colors ${selectedVendorIds.includes(vendor.id) ? 'bg-indigo-50/30' : ''}`} onClick={() => setSelectedVendor(vendor)}>
                  {isMarketAdmin && (
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                       <button onClick={() => toggleSelectVendor(vendor.id)} className={`${selectedVendorIds.includes(vendor.id) ? 'text-indigo-600' : 'text-slate-300'} transition-colors`}>
                          {selectedVendorIds.includes(vendor.id) ? <CheckSquare size={18}/> : <Square size={18}/>}
                       </button>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{vendor.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{vendor.email || vendor.gender + ' • ' + vendor.age + 'y'}</div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="font-mono text-slate-700 font-bold text-xs">{vendor.shopNumber}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black mt-0.5">{vendor.section || 'General'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border w-fit ${rentStatus.color}`}>
                           {rentStatus.label}
                        </div>
                        {vendor.rentDue > 0 && (
                          <div className="text-[10px] font-black text-slate-900 flex items-center gap-1">
                            {vendor.rentDue.toLocaleString()} <span className="opacity-40">UGX</span>
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${vendor.status === 'ACTIVE' ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                       <button onClick={(e) => { e.stopPropagation(); setQrModalVendor(vendor); }} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-900" title="Store QR Profile">
                         <QrCode size={18} />
                       </button>
                       <button onClick={(e) => { e.stopPropagation(); setSelectedVendor(vendor); }} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-indigo-600" title="View Details">
                         <ArrowUpDown size={18} className="rotate-90" />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredVendors.length === 0 && (
              <tr>
                <td colSpan={isMarketAdmin ? 6 : 5} className="px-6 py-12 text-center text-slate-400 italic font-medium uppercase tracking-[0.2em] text-xs">
                   No registry nodes triangulated.
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
