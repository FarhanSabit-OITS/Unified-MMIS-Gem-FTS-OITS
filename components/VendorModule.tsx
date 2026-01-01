
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
  Layers, DollarSign, ShieldAlert, Mail, MapPin, Tag, Phone
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
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rentDueFilter, setRentDueFilter] = useState('ALL');
  
  // Modals
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [qrModalVendor, setQrModalVendor] = useState<Vendor | null>(null);
  const [paymentVendor, setPaymentVendor] = useState<{ id: string, amount: number, name: string } | null>(null);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [addVendorStep, setAddVendorStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  
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

    let matchesRent = true;
    if (rentDueFilter === '0-50K') matchesRent = v.rentDue >= 0 && v.rentDue <= 50000;
    else if (rentDueFilter === '50K-200K') matchesRent = v.rentDue > 50000 && v.rentDue <= 200000;
    else if (rentDueFilter === '200K+') matchesRent = v.rentDue > 200000;

    return matchesSearch && matchesStatus && matchesMarket && matchesCity && matchesRent;
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
        city: CITIES.find(c => c.id === newVendorData.cityId)?.name || 'Kampala'
      };
      setVendors(prev => [newV, ...prev]);
      setAddVendorStep('SUCCESS');
    }, 1200);
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
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" value={rentDueFilter} onChange={(e) => setRentDueFilter(e.target.value)}>
                <option value="ALL">All Rent Ranges</option>
                <option value="0-50K">0 - 50K</option>
                <option value="50K-200K">50K - 200K</option>
                <option value="200K+">200K+</option>
            </select>
            {!isMarketAdmin && (
              <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setSelectedMarket(''); }}>
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
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
              <th className="px-6 py-4">Rent Status</th>
              <th className="px-6 py-4">Account Status</th>
              <th className="px-6 py-4 text-right">QR</th>
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
                  {vendor.rentDue > 0 ? (
                    <span className="text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1 w-fit">
                      <AlertTriangle size={12} /> {vendor.rentDue.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1 w-fit">
                      <CheckCircle size={12} /> Paid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${vendor.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button onClick={(e) => { e.stopPropagation(); setQrModalVendor(vendor); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                     <QrCode size={16} className="text-slate-600" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><UserPlus size={20} className="text-indigo-600" /> Register Entity</h3>
                  <button onClick={resetAddVendorModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              {addVendorStep === 'FORM' ? (
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmitNewVendor} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name *</label>
                                <input required type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.name} onChange={e => setNewVendorData({...newVendorData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                                <select className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.gender} onChange={e => setNewVendorData({...newVendorData, gender: e.target.value as any})}><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.age} onChange={e => setNewVendorData({...newVendorData, age: parseInt(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                <input type="email" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.email} onChange={e => setNewVendorData({...newVendorData, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.phone} onChange={e => setNewVendorData({...newVendorData, phone: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                                <select className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.cityId} onChange={e => setNewVendorData({...newVendorData, cityId: e.target.value, marketId: ''})}><option value="">Select City</option>{CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Market *</label>
                                <select required className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.marketId} onChange={e => setNewVendorData({...newVendorData, marketId: e.target.value})} disabled={!newVendorData.cityId}><option value="">Select Market</option>{availableMarketsForForm.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                            </div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shop Number *</label><input required className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.shopNumber} onChange={e => setNewVendorData({...newVendorData, shopNumber: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Level</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.level} onChange={e => setNewVendorData({...newVendorData, level: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Section</label><input className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.section} onChange={e => setNewVendorData({...newVendorData, section: e.target.value})} /></div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ownership</label>
                                <select className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.ownershipType} onChange={e => setNewVendorData({...newVendorData, ownershipType: e.target.value})}><option value="Sole Proprietorship">Sole Proprietorship</option><option value="Partnership">Partnership</option><option value="Limited Company">Limited Company</option></select>
                            </div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rent Due (UGX)</label><input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.rentDue} onChange={e => setNewVendorData({...newVendorData, rentDue: parseFloat(e.target.value)})} /></div>
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">VAT Due (UGX)</label><input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={newVendorData.vatDue} onChange={e => setNewVendorData({...newVendorData, vatDue: parseFloat(e.target.value)})} /></div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">KYC Documents</h4>
                            <VendorKYCForm onFilesChange={(f, v) => setIsKycValid(v)} />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={resetAddVendorModal} className="flex-1">Cancel</Button>
                            <Button type="submit" disabled={isSubmittingNewVendor} className="flex-1 flex items-center justify-center gap-2">{isSubmittingNewVendor ? <Loader2 className="animate-spin" /> : <Save size={16} />} Register Entity</Button>
                        </div>
                    </form>
                </div>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center text-center animate-in zoom-in">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm"><Loader2 size={48} className="animate-spin" /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Registry Record Pending</h3>
                    <p className="text-slate-500 mb-8 text-sm max-w-xs leading-relaxed">
                        Vendor application for <strong>{newVendorData.name}</strong> at <strong>{getMarketName(newVendorData.marketId)}</strong> has been submitted. Awaiting administrative verification.
                    </p>
                    <Button onClick={resetAddVendorModal} className="w-full max-w-xs">Return to Dashboard</Button>
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
          onAuditAction={()=>{}} 
          onToggleStatus={()=>{}} 
        />
      )}
    </div>
  );
};
