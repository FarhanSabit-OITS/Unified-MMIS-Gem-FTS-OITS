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
  Layers, DollarSign, ShieldAlert
} from 'lucide-react';
import { Button } from './ui/Button';

interface VendorModuleProps {
  userRole?: UserRole;
  currentUserId?: string;
  marketId?: string;
}

export const VendorModule: React.FC<VendorModuleProps> = ({ userRole = UserRole.USER, currentUserId, marketId }) => {
  // Use local state initialized with MOCK data to allow updates
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toolbar Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rentDueFilter, setRentDueFilter] = useState('ALL');
  
  // Modals & Selection
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);
  
  // Payment State
  const [paymentVendor, setPaymentVendor] = useState<{ id: string, amount: number, name: string } | null>(null);

  // --- Add Vendor Modal State ---
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [addVendorStep, setAddVendorStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  
  // Replaced single file state with reusable component state
  const [kycDocs, setKycDocs] = useState<{ nid: File | null; license: File | null }>({ nid: null, license: null });
  const [isKycValid, setIsKycValid] = useState(false);
  
  const [isSubmittingNewVendor, setIsSubmittingNewVendor] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: '', shopNumber: '', marketId: marketId || '', email: '', phone: '',
    rentDue: 0, vatDue: 0, status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
    kycVerified: false, gender: 'MALE' as 'MALE' | 'FEMALE', age: 30,
    cityId: '', level: '', section: '', storeType: 'Retail', ownershipType: 'Sole Proprietorship'
  });

  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;
  const isMarketAdmin = userRole === UserRole.MARKET_ADMIN;

  // FETCH VENDORS
  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const response = await ApiService.vendors.getAll();
        if (response.data && Array.isArray(response.data)) {
          setVendors(response.data);
        }
      } catch (error) {
        console.warn("Failed to fetch vendors from API, using mock data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // --- Filtering Logic ---
  const filteredVendors = vendors.filter(v => {
    // 1. RBAC Scope Filter
    if (isMarketAdmin && marketId && v.marketId !== marketId) return false;

    // 2. Toolbar Filters
    const term = searchTerm.toLowerCase();
    const matchesSearch = v.name.toLowerCase().includes(term) || 
                          v.shopNumber.toLowerCase().includes(term);
                          
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    
    // Market Filter (Target Market)
    const matchesMarket = selectedMarket ? v.marketId === selectedMarket : true;
    
    // City filter logic (indirect relationship via market or explicit field)
    const market = MARKETS.find(m => m.id === v.marketId);
    const matchesCity = selectedCity ? market?.cityId === selectedCity : true;

    // Rent Range Logic
    let matchesRent = true;
    if (rentDueFilter === '0-50K') matchesRent = v.rentDue >= 0 && v.rentDue <= 50000;
    else if (rentDueFilter === '50K-200K') matchesRent = v.rentDue > 50000 && v.rentDue <= 200000;
    else if (rentDueFilter === '200K+') matchesRent = v.rentDue > 200000;

    return matchesSearch && matchesStatus && matchesMarket && matchesCity && matchesRent;
  });

  // Calculate available markets for filters based on selected city
  const availableMarketsForFilter = MARKETS.filter(m => !selectedCity || m.cityId === selectedCity);
  
  // Calculate available markets for Add Form based on selected city in form
  const availableMarketsForForm = MARKETS.filter(m => !newVendorData.cityId || m.cityId === newVendorData.cityId);

  const getMarketName = (id: string) => MARKETS.find(m => m.id === id)?.name || id;
  const getCityName = (id: string) => CITIES.find(c => c.id === id)?.name || id;

  // --- Handlers & Audit ---
  
  const logAuditAction = (action: string, vendorName: string, details: string) => {
    const timestamp = new Date().toISOString();
    // Simulate logging to backend
    console.log(`[AUDIT LOG] | Time: ${timestamp} | AdminID: ${currentUserId || 'Unknown'} | Role: ${userRole} | Action: ${action} | Target: ${vendorName} | Details: ${details}`);
  };

  const handleToggleStatus = (vendor: Vendor) => {
    const newStatus: Vendor['status'] = vendor.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    
    if (confirm(`Are you sure you want to change status of ${vendor.name} to ${newStatus}?`)) {
        const updatedVendors = vendors.map(v => v.id === vendor.id ? { ...v, status: newStatus } : v);
        setVendors(updatedVendors);
        // Also update selected vendor if modal is open
        if (selectedVendor && selectedVendor.id === vendor.id) {
            setSelectedVendor({ ...vendor, status: newStatus });
        }
        logAuditAction('STATUS_CHANGE', vendor.name, `Changed status from ${vendor.status} to ${newStatus}`);
    }
  };
  
  const handleToggleDues = (vendorId: string, vendorName: string, action: 'MARK_PAID' | 'FLAG_AUDIT', e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (action === 'MARK_PAID') {
        const v = vendors.find(ven => ven.id === vendorId);
        if(v) setPaymentVendor({ id: v.id, amount: v.rentDue, name: v.name });
    } else if (action === 'FLAG_AUDIT') {
        alert(`Vendor ${vendorName} flagged for deep-dive audit.`);
        logAuditAction('AUDIT_INITIATED', vendorName, 'Flagged vendor account for detailed financial audit');
    }
  };

  const handleRentPaymentSuccess = (txId: string, method: string) => {
      if(!paymentVendor) return;
      setVendors(prev => prev.map(v => {
          if (v.id === paymentVendor.id) return { ...v, rentDue: 0 };
          return v;
      }));
      logAuditAction('RENT_PAYMENT', paymentVendor.name, `Rent cleared via ${method}. TX: ${txId}`);
      setPaymentVendor(null);
  };

  const handleOpenVendor = (vendor: Vendor) => {
      setSelectedVendor(vendor);
  };

  const handleUpdateVendor = (updated: Vendor) => {
      setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
      setSelectedVendor(updated);
  };

  // --- Add Vendor Logic ---
  const handleSubmitNewVendor = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVendorData.name || !newVendorData.shopNumber || !newVendorData.marketId) {
      alert("Please fill in required fields (Name, Shop, Market)");
      return;
    }
    
    if (!isKycValid) {
      alert("Please upload valid KYC documents (ID and License) before proceeding.");
      return;
    }

    setIsSubmittingNewVendor(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmittingNewVendor(false);
      
      const cityName = getCityName(newVendorData.cityId);
      
      const newVendor: Vendor = {
        id: `v${Date.now()}`,
        name: newVendorData.name,
        shopNumber: newVendorData.shopNumber,
        marketId: newVendorData.marketId,
        status: newVendorData.status,
        rentDue: Number(newVendorData.rentDue),
        vatDue: Number(newVendorData.vatDue),
        gender: newVendorData.gender,
        age: Number(newVendorData.age) || 30,
        productsCount: 0,
        kycVerified: newVendorData.kycVerified, // Use form data state
        notes: 'New registration pending final review.',
        storeType: newVendorData.storeType,
        ownershipType: newVendorData.ownershipType,
        level: newVendorData.level,
        section: newVendorData.section,
        email: newVendorData.email,
        phone: newVendorData.phone,
        city: cityName
      };
      
      setVendors(prev => [newVendor, ...prev]);
      setAddVendorStep('SUCCESS');
      logAuditAction('CREATE_VENDOR', newVendor.name, 'Registered new vendor via dashboard.');
    }, 1500);
  };

  const resetAddVendorModal = () => {
    setShowAddVendorModal(false);
    setAddVendorStep('FORM');
    setKycDocs({ nid: null, license: null });
    setIsKycValid(false);
    setNewVendorData({ 
        name: '', shopNumber: '', marketId: isMarketAdmin && marketId ? marketId : '', 
        email: '', phone: '', rentDue: 0, vatDue: 0, status: 'ACTIVE', 
        kycVerified: false, gender: 'MALE', age: 30, cityId: '', level: '', 
        section: '', storeType: 'Retail', ownershipType: 'Sole Proprietorship' 
    });
  };

  return (
    <div className="space-y-6">
      {paymentVendor && (
          <PaymentGateway 
             amount={paymentVendor.amount}
             description={`Rent Payment for ${paymentVendor.name}`}
             onClose={() => setPaymentVendor(null)}
             onSuccess={handleRentPaymentSuccess}
          />
      )}

      {/* --- Filter Toolbar --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto overflow-hidden">
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full scrollbar-hide">
            {!isMarketAdmin && (
              <select 
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 shrink-0 outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCity}
                  onChange={(e) => { setSelectedCity(e.target.value); setSelectedMarket(''); }}
              >
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}

            {/* Target Market Filter */}
            {(!isMarketAdmin) && (
                <select 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 shrink-0 outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
            >
                <option value="">All Markets</option>
                {availableMarketsForFilter.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            )}

            {/* Status Filter */}
            <select 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 shrink-0 outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
            </select>

            {/* Rent Due Range Filter */}
            <select 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 shrink-0 outline-none focus:ring-2 focus:ring-blue-500"
                value={rentDueFilter}
                onChange={(e) => setRentDueFilter(e.target.value)}
            >
                <option value="ALL">All Rent Ranges</option>
                <option value="0-50K">0 - 50K</option>
                <option value="50K-200K">50K - 200K</option>
                <option value="200K+">200K+</option>
            </select>
          </div>
        </div>
        
        {isAdmin && (
          <Button onClick={() => setShowAddVendorModal(true)} className="w-full xl:w-auto flex items-center justify-center gap-2 shrink-0">
            <UserPlus size={18} /> Add Vendor
          </Button>
        )}
      </div>

      {/* --- Vendor Table --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Vendor Info</th>
                <th className="px-6 py-4 whitespace-nowrap">Shop / Location</th>
                <th className="px-6 py-4 whitespace-nowrap">Details</th>
                <th className="px-6 py-4 whitespace-nowrap">Rent Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                {isAdmin && <th className="px-6 py-4 text-center whitespace-nowrap">Quick Actions</th>}
                <th className="px-6 py-4 text-right whitespace-nowrap">QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">Loading Vendor Database...</td></tr>
              ) : filteredVendors.map(vendor => (
                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleOpenVendor(vendor)}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{vendor.name}</div>
                    <div className="text-xs text-slate-500">{vendor.gender} • {vendor.age} yrs</div>
                    {vendor.kycVerified && (
                        <div className="text-[10px] text-green-600 flex items-center gap-1 mt-1 font-bold">
                            <CheckCircle size={10} /> Verified
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                      <div className="font-mono text-slate-700 font-bold">{vendor.shopNumber}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Building2 size={10} /> {getMarketName(vendor.marketId)}
                      </div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                              <Layers size={10} /> {vendor.level || 'Ground Floor'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded border w-fit ${
                              vendor.ownershipType === 'Sole Proprietorship' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              'bg-purple-50 text-purple-700 border-purple-100'
                          }`}>
                              {vendor.ownershipType || 'Leasehold'}
                          </span>
                      </div>
                  </td>
                  <td className="px-6 py-4">
                    {vendor.rentDue > 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1.5 rounded-full text-xs font-bold border border-red-100">
                        <AlertTriangle size={12} /> {vendor.rentDue.toLocaleString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full text-xs font-bold border border-green-100">
                        <CheckCircle size={12} /> Paid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vendor.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  
                  {isAdmin && (
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                         <button 
                            onClick={(e) => handleToggleDues(vendor.id, vendor.name, 'MARK_PAID', e)}
                            className={`p-1.5 rounded-lg transition-all border ${vendor.rentDue === 0 ? 'text-slate-300 border-slate-100 cursor-not-allowed' : 'text-slate-500 border-slate-200 hover:text-green-600 hover:bg-green-50 hover:border-green-200'}`}
                            title="Mark Dues as Paid"
                            disabled={vendor.rentDue === 0}
                         >
                           <CreditCard size={14} />
                         </button>
                         <button 
                            onClick={(e) => handleToggleDues(vendor.id, vendor.name, 'FLAG_AUDIT', e)}
                            className="p-1.5 rounded-lg transition-all border border-slate-200 text-slate-500 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200" 
                            title="Initiate Audit"
                         >
                           <Gavel size={14} />
                         </button>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(vendor); }}
                            className={`p-1.5 rounded-lg transition-all border ${vendor.status === 'ACTIVE' ? 'border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200' : 'border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'}`} 
                            title={vendor.status === 'ACTIVE' ? "Suspend Vendor" : "Activate Vendor"}
                         >
                           <Power size={14} />
                         </button>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4 text-right">
                     <button 
                        onClick={(e) => { e.stopPropagation(); setQrModalVendor(vendor); }}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                     >
                       <QrCode size={16} className="text-slate-600" />
                     </button>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                    No vendors found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Detail Modal (Refactored) --- */}
      {selectedVendor && (
        <VendorDetailsModal 
            vendor={selectedVendor}
            userRole={userRole}
            onClose={() => setSelectedVendor(null)}
            onUpdateVendor={handleUpdateVendor}
            onAuditAction={(action, details) => logAuditAction(action, selectedVendor.name, details)}
            onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><UserPlus size={20} className="text-indigo-600" /> Add New Vendor</h3>
                    <p className="text-xs text-slate-500">Complete vendor profile and attach KYC documents.</p>
                  </div>
                  <button onClick={resetAddVendorModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              {addVendorStep === 'FORM' ? (
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmitNewVendor} className="space-y-6">
                        
                        {/* Section 1: Core Identity */}
                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Core Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Full Name *</label>
                                    <input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={newVendorData.name} onChange={e => setNewVendorData({...newVendorData, name: e.target.value})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Gender</label>
                                    <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white" value={newVendorData.gender} onChange={e => setNewVendorData({...newVendorData, gender: e.target.value as any})}>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Age</label>
                                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.age} onChange={e => setNewVendorData({...newVendorData, age: parseInt(e.target.value)})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="+256..." value={newVendorData.phone} onChange={e => setNewVendorData({...newVendorData, phone: e.target.value})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                                    <input type="email" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.email} onChange={e => setNewVendorData({...newVendorData, email: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Shop & Location */}
                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center gap-2"><Building2 size={14}/> Shop Allocation</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Shop Number *</label>
                                    <input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.shopNumber} onChange={e => setNewVendorData({...newVendorData, shopNumber: e.target.value})} />
                                </div>
                                
                                {/* New City Dropdown */}
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                                    {!isMarketAdmin ? (
                                        <select 
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white" 
                                            value={newVendorData.cityId} 
                                            onChange={e => setNewVendorData({...newVendorData, cityId: e.target.value, marketId: ''})}
                                        >
                                            <option value="">Select City</option>
                                            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-100 text-slate-500 cursor-not-allowed" value="Current City" readOnly />
                                    )}
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Market *</label>
                                    {isMarketAdmin && marketId ? (
                                        <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-100 text-slate-600 cursor-not-allowed" value={getMarketName(marketId)} readOnly />
                                    ) : (
                                        <select 
                                            required 
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white disabled:bg-slate-100" 
                                            value={newVendorData.marketId} 
                                            onChange={e => setNewVendorData({...newVendorData, marketId: e.target.value})}
                                            disabled={!newVendorData.cityId && !isMarketAdmin}
                                        >
                                            <option value="">Select Market</option>
                                            {availableMarketsForForm.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    )}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Store Level</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. L1" value={newVendorData.level} onChange={e => setNewVendorData({...newVendorData, level: e.target.value})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Section</label>
                                    <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Textile" value={newVendorData.section} onChange={e => setNewVendorData({...newVendorData, section: e.target.value})} />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Store Type</label>
                                    <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white" value={newVendorData.storeType} onChange={e => setNewVendorData({...newVendorData, storeType: e.target.value})}>
                                        <option>Retail</option>
                                        <option>Wholesale</option>
                                        <option>Service</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Ownership</label>
                                    <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white" value={newVendorData.ownershipType} onChange={e => setNewVendorData({...newVendorData, ownershipType: e.target.value})}>
                                        <option>Sole Proprietorship</option>
                                        <option>Partnership</option>
                                        <option>Limited Company</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Financials & Status */}
                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center gap-2"><DollarSign size={14}/> Financials & Status</h4>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Rent Due</label>
                                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.rentDue} onChange={e => setNewVendorData({...newVendorData, rentDue: parseFloat(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">VAT Due</label>
                                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.vatDue} onChange={e => setNewVendorData({...newVendorData, vatDue: parseFloat(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                                    <select className="w-full px-3 py-2 border rounded-lg text-sm bg-white" value={newVendorData.status} onChange={e => setNewVendorData({...newVendorData, status: e.target.value as any})}>
                                        <option value="ACTIVE">Active</option>
                                        <option value="SUSPENDED">Suspended</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">KYC Status</label>
                                    <select 
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white" 
                                        value={newVendorData.kycVerified ? 'VERIFIED' : 'PENDING'} 
                                        onChange={e => setNewVendorData({...newVendorData, kycVerified: e.target.value === 'VERIFIED'})}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="VERIFIED">Verified</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* Section 4: KYC Uploads via Reusable Component */}
                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4 flex items-center gap-2"><ShieldAlert size={14}/> KYC Verification</h4>
                            <VendorKYCForm 
                                onFilesChange={(files, isValid) => {
                                    setKycDocs(files);
                                    setIsKycValid(isValid);
                                }}
                            />
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <Button type="button" variant="secondary" onClick={resetAddVendorModal} className="flex-1">Cancel</Button>
                            <Button type="submit" disabled={isSubmittingNewVendor} className="flex-1 flex items-center justify-center gap-2">{isSubmittingNewVendor ? <Loader2 className="animate-spin" /> : <Save size={16} />} Register Vendor</Button>
                        </div>
                    </form>
                </div>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center text-center animate-in zoom-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm"><CheckCircle size={48} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Application Submitted</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4 inline-flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${newVendorData.kycVerified ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></span>
                        <span className={`${newVendorData.kycVerified ? 'text-green-800' : 'text-amber-800'} font-bold text-sm uppercase tracking-wide`}>
                            {newVendorData.kycVerified ? 'KYC Verified' : 'KYC Pending'}
                        </span>
                    </div>
                    <p className="text-slate-500 mb-6 text-sm max-w-xs mx-auto">
                        Vendor has been added to the registry. {newVendorData.kycVerified ? 'Full access granted.' : 'Full access is restricted until documents are reviewed.'}
                    </p>
                    <Button onClick={resetAddVendorModal} className="w-full max-w-xs">Return to Dashboard</Button>
                </div>
              )}
           </div>
        </div>
      )}

      {qrModalVendor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in-95 relative">
                <button onClick={() => setQrModalVendor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                <div className="mb-4"><h3 className="text-xl font-bold text-slate-900">{qrModalVendor.name}</h3><p className="text-sm text-slate-500">Shop: {qrModalVendor.shopNumber}</p></div>
                <div className="bg-white p-4 border-2 border-slate-900 rounded-xl inline-block mb-6"><QrCode size={150} className="text-slate-900" /></div>
                <Button className="w-full flex items-center justify-center gap-2"><Download size={18} /> Download Code</Button>
            </div>
        </div>
      )}
    </div>
  );
};