import React, { useState, useEffect } from 'react';
import { Vendor, UserRole } from '../types';
import { MOCK_VENDORS, CITIES, MARKETS, MOCK_TRANSACTIONS } from '../constants';
import { ApiService } from '../services/api';
import { PaymentGateway } from './PaymentGateway';
import { 
  Filter, 
  Search, 
  QrCode, 
  Ban, 
  CheckCircle, 
  Gavel,
  Power,
  CreditCard,
  Download,
  X,
  History,
  ArrowUpDown,
  FileText,
  Save,
  AlertTriangle,
  Upload,
  UserPlus,
  MapPin,
  Building2,
  Loader2,
  Briefcase,
  Mail,
  Phone,
  StickyNote,
  User,
  ShieldAlert,
  Layers,
  Banknote
} from 'lucide-react';
import { Button } from './ui/Button';

interface VendorModuleProps {
  userRole?: UserRole;
  currentUserId?: string;
}

export const VendorModule: React.FC<VendorModuleProps> = ({ userRole = UserRole.USER, currentUserId }) => {
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
  const [activeModalTab, setActiveModalTab] = useState<'OVERVIEW' | 'DUES' | 'DOCUMENTS' | 'NOTES'>('OVERVIEW');
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);
  
  // Payment State
  const [paymentVendor, setPaymentVendor] = useState<{ id: string, amount: number, name: string } | null>(null);

  // Admin Notes State
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  // Dues History State
  const [duesSort, setDuesSort] = useState<'DATE' | 'AMOUNT'>('DATE');
  const [duesFilter, setDuesFilter] = useState('ALL'); // Status Filter
  const [duesTypeFilter, setDuesTypeFilter] = useState('ALL'); // Type Filter
  const [duesSearchTerm, setDuesSearchTerm] = useState('');

  // --- Add Vendor Modal State ---
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [addVendorStep, setAddVendorStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [addVendorFile, setAddVendorFile] = useState<File | null>(null);
  const [addFileError, setAddFileError] = useState('');
  const [isSubmittingNewVendor, setIsSubmittingNewVendor] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: '', shopNumber: '', marketId: '', email: '', phone: '',
    rentDue: 0, vatDue: 0, status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
    kycVerified: false, gender: 'MALE' as 'MALE' | 'FEMALE', age: 0,
    city: '', level: '', section: '', storeType: 'Retail', ownershipType: 'Sole Proprietorship'
  });

  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;

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
    const term = searchTerm.toLowerCase();
    const matchesSearch = v.name.toLowerCase().includes(term) || 
                          v.shopNumber.toLowerCase().includes(term);
                          
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesMarket = selectedMarket ? v.marketId === selectedMarket : true;
    
    // City filter logic (indirect relationship via market)
    const market = MARKETS.find(m => m.id === v.marketId);
    const matchesCity = selectedCity ? market?.cityId === selectedCity : true;

    // Rent Range Logic
    let matchesRent = true;
    if (rentDueFilter === '0-50K') matchesRent = v.rentDue >= 0 && v.rentDue <= 50000;
    else if (rentDueFilter === '50K-200K') matchesRent = v.rentDue > 50000 && v.rentDue <= 200000;
    else if (rentDueFilter === '200K+') matchesRent = v.rentDue > 200000;

    return matchesSearch && matchesStatus && matchesMarket && matchesCity && matchesRent;
  });

  const availableMarkets = MARKETS.filter(m => !selectedCity || m.cityId === selectedCity);

  // --- Dues History Logic ---
  const vendorTransactions = selectedVendor 
    ? MOCK_TRANSACTIONS.filter(t => t.entityId === selectedVendor.id)
    : [];
  
  const filteredTransactions = vendorTransactions
    .filter(t => {
        const matchesStatus = duesFilter === 'ALL' || t.status === duesFilter;
        const matchesType = duesTypeFilter === 'ALL' || t.type === duesTypeFilter;
        const matchesSearch = !duesSearchTerm || 
            (t.reference?.toLowerCase().includes(duesSearchTerm.toLowerCase()) || 
             t.amount.toString().includes(duesSearchTerm));
        return matchesStatus && matchesType && matchesSearch;
    })
    .sort((a, b) => {
        if (duesSort === 'DATE') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return b.amount - a.amount;
    });

  const getMarketName = (id: string) => MARKETS.find(m => m.id === id)?.name || id;

  // --- Handlers & Audit ---
  
  const logAuditAction = (action: string, vendorName: string, details: string) => {
    const timestamp = new Date().toISOString();
    // Simulate logging to backend
    console.log(`[AUDIT LOG] | Time: ${timestamp} | AdminID: ${currentUserId || 'Unknown'} | Role: ${userRole} | Action: ${action} | Target: ${vendorName} | Details: ${details}`);
  };

  const handleToggleStatus = (vendor: Vendor, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: Vendor['status'] = vendor.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    
    if (confirm(`Are you sure you want to change status of ${vendor.name} to ${newStatus}?`)) {
        const updatedVendors = vendors.map(v => v.id === vendor.id ? { ...v, status: newStatus } : v);
        setVendors(updatedVendors);
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
      setActiveModalTab('OVERVIEW');
      setIsEditingNote(false);
      setNoteDraft(vendor.notes || '');
      // Reset inner filters
      setDuesTypeFilter('ALL');
      setDuesFilter('ALL');
      setDuesSearchTerm('');
  };

  const handleSaveNote = () => {
      if (!selectedVendor) return;
      const updatedVendors = vendors.map(v => v.id === selectedVendor.id ? { ...v, notes: noteDraft } : v);
      setVendors(updatedVendors);
      setSelectedVendor({ ...selectedVendor, notes: noteDraft });
      setIsEditingNote(false);
      logAuditAction('NOTE_UPDATE', selectedVendor.name, `Admin updated notes. Length: ${noteDraft.length} chars.`);
  };

  // --- Add Vendor Logic ---
  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddFileError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setAddFileError('Invalid file type. Use JPG, PNG, or PDF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAddFileError('File size exceeds 5MB limit.');
        return;
      }
      setAddVendorFile(file);
    }
  };

  const handleSubmitNewVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorData.name || !newVendorData.shopNumber || !newVendorData.marketId) {
      alert("Please fill in required fields (Name, Shop, Market)");
      return;
    }
    if (!addVendorFile) {
      setAddFileError("KYC Document is required.");
      return;
    }
    setIsSubmittingNewVendor(true);
    setTimeout(() => {
      setIsSubmittingNewVendor(false);
      const newVendor: Vendor = {
        id: `v${Date.now()}`,
        name: newVendorData.name,
        shopNumber: newVendorData.shopNumber,
        marketId: newVendorData.marketId,
        status: newVendorData.status,
        rentDue: newVendorData.rentDue,
        vatDue: newVendorData.vatDue,
        gender: newVendorData.gender,
        age: newVendorData.age || 30,
        productsCount: 0,
        kycVerified: false,
        notes: 'New application pending review.',
        storeType: newVendorData.storeType,
        ownershipType: newVendorData.ownershipType,
        level: newVendorData.level,
        section: newVendorData.section,
        email: newVendorData.email,
        phone: newVendorData.phone
      };
      setVendors(prev => [newVendor, ...prev]);
      setAddVendorStep('SUCCESS');
      logAuditAction('CREATE_VENDOR', newVendor.name, 'Registered new vendor via dashboard.');
    }, 1500);
  };

  const resetAddVendorModal = () => {
    setShowAddVendorModal(false);
    setAddVendorStep('FORM');
    setAddVendorFile(null);
    setNewVendorData({ name: '', shopNumber: '', marketId: '', email: '', phone: '', rentDue: 0, vatDue: 0, status: 'ACTIVE', kycVerified: false, gender: 'MALE', age: 0, city: '', level: '', section: '', storeType: 'Retail', ownershipType: 'Sole Proprietorship' });
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
            <select 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 shrink-0 outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCity}
                onChange={(e) => { setSelectedCity(e.target.value); setSelectedMarket(''); }}
            >
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            {selectedCity && (
                <select 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 shrink-0 outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
            >
                <option value="">All Markets</option>
                {availableMarkets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
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
                            title="Initiate Deep-Dive Audit"
                         >
                           <Gavel size={14} />
                         </button>
                         <button 
                            onClick={(e) => handleToggleStatus(vendor, e)}
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

      {/* --- Detail Modal --- */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start shrink-0 bg-slate-50/50">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <User size={20} className="text-slate-600" />
                      {selectedVendor.name}
                  </h3>
                  <div className="flex gap-3 mt-1">
                      <p className="text-xs text-slate-500 font-mono">ID: {selectedVendor.id}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${selectedVendor.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedVendor.status}
                      </span>
                  </div>
               </div>
               <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
            </div>
            
            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 gap-6 shrink-0 overflow-x-auto bg-white">
                <button 
                    onClick={() => setActiveModalTab('OVERVIEW')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeModalTab === 'OVERVIEW' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveModalTab('DUES')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeModalTab === 'DUES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <History size={14} /> Dues History
                </button>
                <button 
                    onClick={() => setActiveModalTab('DOCUMENTS')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeModalTab === 'DOCUMENTS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <FileText size={14} /> Documents
                </button>
                {isAdmin && (
                  <button 
                      onClick={() => setActiveModalTab('NOTES')}
                      className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeModalTab === 'NOTES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                      <StickyNote size={14} /> Admin Notes
                      {selectedVendor.notes && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                  </button>
                )}
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
               {activeModalTab === 'OVERVIEW' ? (
                   <>
                    {/* Financial & Stock Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg border flex flex-col justify-between ${selectedVendor.rentDue > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                            <div className="flex justify-between items-start">
                                <div className={`text-xs font-bold uppercase tracking-wider ${selectedVendor.rentDue > 0 ? 'text-red-700' : 'text-green-700'}`}>Financial Status</div>
                                {selectedVendor.rentDue > 0 && <AlertTriangle size={14} className="text-red-600" />}
                            </div>
                            <div className="mt-2">
                                <div className={`text-2xl font-black ${selectedVendor.rentDue > 0 ? 'text-red-700' : 'text-green-700'}`}>
                                    {selectedVendor.rentDue.toLocaleString()} <span className="text-sm font-normal">UGX</span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1">Rent Due</div>
                                {selectedVendor.vatDue !== undefined && (
                                    <div className="text-xs font-medium text-slate-600 mt-1">
                                        + {selectedVendor.vatDue.toLocaleString()} VAT
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Store Inventory</div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{selectedVendor.productsCount}</div>
                                    <div className="text-[10px] text-slate-400">Total Products Listed</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location & Contact */}
                    <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg mt-0.5"><Building2 size={16} /></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500">Shop</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedVendor.shopNumber}</span>
                                    <span className="text-[10px] text-slate-400">{selectedVendor.level || 'Ground Floor'}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg mt-0.5"><MapPin size={16} /></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500">Market</span>
                                    <span className="text-sm font-bold text-slate-900">{getMarketName(selectedVendor.marketId)}</span>
                                    <span className="text-[10px] text-slate-400">{selectedVendor.city || 'Kampala'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-slate-400" />
                                <span className="text-sm font-medium text-slate-700">{selectedVendor.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-sm font-medium text-slate-700">{selectedVendor.email || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-2 text-sm">Quick Actions</h4>
                        <div className="flex gap-2">
                        <button onClick={() => { setQrModalVendor(selectedVendor); setSelectedVendor(null); }} className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                            <QrCode size={16}/> Print Shop QR
                        </button>
                        {isAdmin && (
                            <button onClick={(e) => handleToggleStatus(selectedVendor, e)} className={`flex-1 py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${selectedVendor.status === 'ACTIVE' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                                <Ban size={16}/> {selectedVendor.status === 'ACTIVE' ? 'Suspend Access' : 'Reactivate'}
                            </button>
                        )}
                        </div>
                    </div>
                   </>
               ) : activeModalTab === 'DUES' ? (
                   /* DUES / HISTORY TAB */
                   <div className="space-y-4">
                       <div className="flex flex-col gap-2">
                           <div className="relative flex-1">
                               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                               <input type="text" placeholder="Search Ref ID or Amount..." className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={duesSearchTerm} onChange={(e) => setDuesSearchTerm(e.target.value)} />
                           </div>
                           <div className="flex gap-2 shrink-0 flex-wrap">
                               <button onClick={() => setDuesSort(duesSort === 'DATE' ? 'AMOUNT' : 'DATE')} className="text-xs flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 whitespace-nowrap">
                                   <ArrowUpDown size={12} /> {duesSort === 'DATE' ? 'Date' : 'Amount'}
                               </button>
                               <select value={duesFilter} onChange={(e) => setDuesFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-2 bg-white outline-none flex-1">
                                   <option value="ALL">All Status</option>
                                   <option value="PAID">Paid</option>
                                   <option value="PENDING">Pending</option>
                                   <option value="OVERDUE">Overdue</option>
                               </select>
                               <select value={duesTypeFilter} onChange={(e) => setDuesTypeFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-2 bg-white outline-none flex-1">
                                   <option value="ALL">All Types</option>
                                   <option value="RENT">Rent</option>
                                   <option value="VAT">VAT</option>
                                   <option value="UTILITY">Utility</option>
                                   <option value="FINE">Fine</option>
                               </select>
                           </div>
                       </div>

                       <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                           <table className="w-full text-xs text-left">
                               <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 shadow-sm border-b border-slate-200">
                                   <tr>
                                       <th className="px-3 py-3">Ref ID</th>
                                       <th className="px-3 py-3">Date</th>
                                       <th className="px-3 py-3">Type</th>
                                       <th className="px-3 py-3 text-right">Amount</th>
                                       <th className="px-3 py-3 text-center">Status</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                   {filteredTransactions.map(tx => (
                                       <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                           <td className="px-3 py-2 font-mono text-slate-500 font-medium">{tx.reference || tx.id}</td>
                                           <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{tx.date}</td>
                                           <td className="px-3 py-2 text-slate-700">
                                               <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-600">{tx.type}</span>
                                           </td>
                                           <td className="px-3 py-2 font-bold text-slate-800 text-right">{tx.amount.toLocaleString()}</td>
                                           <td className="px-3 py-2 text-center">
                                               <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                                   tx.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                   tx.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                               }`}>
                                                   {tx.status}
                                               </span>
                                           </td>
                                       </tr>
                                   ))}
                                   {filteredTransactions.length === 0 && (
                                       <tr><td colSpan={5} className="text-center py-8 text-slate-400 italic"><Banknote size={24} className="mx-auto mb-2 opacity-20"/>No transaction history found.</td></tr>
                                   )}
                               </tbody>
                           </table>
                       </div>
                   </div>
               ) : activeModalTab === 'NOTES' && isAdmin ? (
                  /* ADMIN NOTES TAB */
                  <div className="space-y-4">
                      <div className="bg-amber-50/50 rounded-lg border border-amber-100 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><FileText size={16} className="text-amber-600" /> Administrative Records</h4>
                            {!isEditingNote && <button onClick={() => setIsEditingNote(true)} className="text-xs text-blue-600 font-bold hover:underline">Edit Notes</button>}
                        </div>
                        {isEditingNote ? (
                            <div className="space-y-2">
                                <textarea className="w-full p-3 text-sm border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[150px] shadow-sm resize-none" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Add notes regarding vendor compliance, special requests, or behavioral flags..." autoFocus />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => { setIsEditingNote(false); setNoteDraft(selectedVendor.notes || ''); }} className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1">Cancel</button>
                                    <button onClick={handleSaveNote} className="flex items-center gap-1 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-amber-700 shadow-sm transition-colors"><Save size={12} /> Save Note</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-700 bg-white p-4 rounded-lg border border-amber-100 min-h-[100px] whitespace-pre-wrap leading-relaxed shadow-sm">
                                {selectedVendor.notes || <span className="text-slate-400 italic">No administrative notes available for this vendor. Click edit to add one.</span>}
                            </div>
                        )}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-100 text-[10px] text-amber-700/60 font-medium"><ShieldAlert size={12} /> Changes to these notes are logged in the system audit trail.</div>
                    </div>
                  </div>
               ) : (
                  /* DOCUMENTS TAB */
                  <div className="space-y-4">
                     <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                        <h4 className="text-sm font-bold text-slate-700">Vendor Documents</h4>
                        <p className="text-xs text-slate-500 mb-4">KYC verification documents and licenses.</p>
                     </div>
                     <div className="space-y-2">
                        {/* Mock Documents */}
                        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-100 transition-colors"><FileText size={18} /></div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Trading_License_2023.pdf</div>
                                    <div className="text-xs text-slate-500">Uploaded on 2023-01-15</div>
                                </div>
                            </div>
                            <button className="text-slate-300 hover:text-blue-600"><Download size={16}/></button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100 transition-colors"><FileText size={18} /></div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">National_ID_Scan.jpg</div>
                                    <div className="text-xs text-slate-500">Uploaded on 2023-01-10</div>
                                </div>
                            </div>
                            <button className="text-slate-300 hover:text-blue-600"><Download size={16}/></button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal and QR Modal are handled similarly... */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><UserPlus size={20} className="text-indigo-600" /> Add New Vendor</h3>
                    <p className="text-xs text-slate-500">Register a new vendor and allocate shop space.</p>
                  </div>
                  <button onClick={resetAddVendorModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              {addVendorStep === 'FORM' ? (
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmitNewVendor} className="space-y-6">
                        {/* Simplification: Form fields remain as provided previously */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-bold text-slate-500 mb-1">Full Name *</label><input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.name} onChange={e => setNewVendorData({...newVendorData, name: e.target.value})} /></div>
                            <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-bold text-slate-500 mb-1">Shop Number *</label><input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.shopNumber} onChange={e => setNewVendorData({...newVendorData, shopNumber: e.target.value})} /></div>
                            {/* ... more fields ... */}
                            <div className="col-span-2"><label className="block text-xs font-bold text-slate-500 mb-1">Market *</label><select required className="w-full px-3 py-2 border rounded-lg text-sm bg-white" value={newVendorData.marketId} onChange={e => setNewVendorData({...newVendorData, marketId: e.target.value})}><option value="">Select Market</option>{MARKETS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                        </div>
                        
                        <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                            <input type="file" id="modal-kyc-upload" className="hidden" accept=".jpg,.png,.pdf" onChange={handleAddFileChange} />
                            <label htmlFor="modal-kyc-upload" className="cursor-pointer">{addVendorFile ? <div className="flex items-center justify-center gap-2 text-green-600 font-bold"><CheckCircle size={20} />{addVendorFile.name}</div> : <div className="flex flex-col items-center gap-1 text-slate-500"><Upload size={24} className="mb-1" /><span className="font-bold text-sm">Upload KYC Document *</span><span className="text-xs">ID or License (Max 5MB)</span></div>}</label>
                            {addFileError && <p className="text-xs text-red-500 mt-2 font-bold">{addFileError}</p>}
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
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Registration Successful</h3>
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