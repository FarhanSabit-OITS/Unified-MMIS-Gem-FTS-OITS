
import React, { useState, useMemo } from 'react';
import { Vendor, Transaction, UserRole, Market, PaymentType, Product, ProductCategory } from '../types';
import { MOCK_TRANSACTIONS, MARKETS, CITIES, MOCK_PRODUCTS } from '../constants';
import { 
  X, User, History, FileText, Building2, MapPin, 
  Phone, Mail, Calendar, Wallet, Info, Receipt,
  CheckCircle, AlertTriangle, Clock, ShieldCheck, Tag, Edit3,
  Download, DollarSign, LayoutGrid, ShoppingBag, Package,
  ArrowUpRight, CreditCard, ChevronRight, QrCode, Save, ArrowLeft
} from 'lucide-react';
import { Button } from './ui/Button';

interface VendorDetailsModalProps {
  vendor: Vendor;
  userRole: UserRole;
  onClose: () => void;
  onUpdateVendor: (updatedVendor: Vendor) => void;
}

export const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({ 
  vendor, userRole, onClose, onUpdateVendor 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'PRODUCTS' | 'DOCUMENTS' | 'EDIT'>('OVERVIEW');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'RENT' | 'VAT'>('ALL');

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: vendor.name,
    email: vendor.email || '',
    phone: vendor.phone || '',
    shopNumber: vendor.shopNumber,
    storeType: vendor.storeType || ProductCategory.GENERAL,
    section: vendor.section || '',
    status: vendor.status
  });

  const market = MARKETS.find(m => m.id === vendor.marketId);
  const city = CITIES.find(c => c.id === market?.cityId);

  const vendorTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const isOwner = t.entityId === vendor.id;
      if (!isOwner) return false;
      if (historyFilter === 'RENT') return t.type === PaymentType.RENT;
      if (historyFilter === 'VAT') return t.type === PaymentType.URA_VAT;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [vendor.id, historyFilter]);

  // Added missing fiscalStats calculation for financial summaries
  const fiscalStats = useMemo(() => {
    const settled = vendorTransactions
      .filter(t => t.status === 'PAID')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const outstanding = vendorTransactions
      .filter(t => t.status === 'PENDING' || t.status === 'OVERDUE')
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { settled, outstanding };
  }, [vendorTransactions]);

  const vendorProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.vendorId === vendor.id);
  }, [vendor.id]);

  const handleSave = () => {
    onUpdateVendor({
      ...vendor,
      ...editForm
    });
    setActiveTab('OVERVIEW');
    alert("SYSTEM NOTIFICATION: Registry Node Updated Successfully.");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[48px] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
           <div className="flex gap-8">
              <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center font-black text-4xl shadow-2xl">
                {editForm.name[0]}
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">{editForm.name}</h3>
                <div className="flex gap-3">
                    <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] border-2 ${editForm.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {editForm.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
                       <Tag size={12}/> NODE: {vendor.id}
                    </span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-300 hover:text-slate-950 hover:rotate-90 duration-300"><X size={32} /></button>
        </div>
        
        {/* Tabs HUD */}
        <div className="flex border-b border-slate-100 px-10 gap-10 bg-white overflow-x-auto scrollbar-hide">
            {[
                { id: 'OVERVIEW', label: 'Telemetry', icon: Info },
                { id: 'HISTORY', label: 'Fiscal Ledger', icon: History },
                { id: 'PRODUCTS', label: 'Inventory', icon: ShoppingBag },
                { id: 'DOCUMENTS', label: 'Registry KYC', icon: ShieldCheck },
                { id: 'EDIT', label: 'Node Control', icon: Edit3 }
            ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`py-6 text-[10px] font-black uppercase tracking-[0.3em] border-b-[6px] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        <div className="p-10 space-y-8 overflow-y-auto bg-white flex-1">
           {activeTab === 'OVERVIEW' && (
               <div className="space-y-12 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`p-8 rounded-[40px] border-4 flex flex-col justify-between shadow-inner ${vendor.rentDue > 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <div>
                            <div className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Fiscal Liability</div>
                            <div className={`text-4xl font-black tracking-tighter ${vendor.rentDue > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{vendor.rentDue.toLocaleString()} <span className="text-lg opacity-40">UGX</span></div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-900/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                                <Calendar size={14} className="text-indigo-500" />
                                {vendor.rentDueDate || 'Lifecycle Pending'}
                            </div>
                            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Manage Arrears</button>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-950 text-white rounded-[40px] shadow-2xl flex items-center justify-between relative overflow-hidden group">
                        <div>
                            <div className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-[0.2em]">Store QR Identity</div>
                            <p className="text-xs text-slate-400 max-w-[180px] font-medium leading-relaxed">Public digital node for customer-facing profile & inventory.</p>
                            <Button variant="secondary" className="mt-6 font-black uppercase text-[9px] tracking-widest rounded-xl bg-white/10 text-white border-none hover:bg-indigo-600"><QrCode size={14} className="mr-2"/> View Code</Button>
                        </div>
                        <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                           <QrCode className="w-full h-full text-slate-900" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Building2 size={16} className="text-indigo-500" /> Hub Enrollment Matrix
                  </h4>
                  <div className="bg-slate-50 rounded-[40px] border-2 border-slate-100 p-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Building2 size={12} className="text-indigo-500"/> Registered Hub
                            </p>
                            <p className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                                {market?.name || 'PENDING'}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <LayoutGrid size={12} className="text-indigo-500"/> Classification
                            </p>
                            <span className="bg-white border-2 border-slate-200 text-indigo-700 px-4 py-1 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                {market?.type || 'MIXED'} NODE
                            </span>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={12} className="text-rose-500"/> Regional Vector
                            </p>
                            <p className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                                {city?.name || 'UNKNOWN'}
                            </p>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Contact Telemetry</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                          <Mail size={16} className="text-indigo-400" /> {editForm.email || 'No Email'}
                        </div>
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                          <Phone size={16} className="text-indigo-400" /> {editForm.phone || 'No Phone'}
                        </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Unit Specifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                          <Tag size={16} className="text-indigo-400" /> Section: {editForm.section || 'Unassigned'}
                        </div>
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                          <ShoppingBag size={16} className="text-indigo-400" /> Store Type: {editForm.storeType}
                        </div>
                      </div>
                   </div>
                </div>
               </div>
           )}

           {activeTab === 'HISTORY' && (
             <div className="animate-in fade-in space-y-6">
                <div className="flex justify-between items-center bg-slate-950 p-6 rounded-[32px] text-white">
                   <div className="flex gap-10">
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Lifetime Volume</p>
                        <p className="text-xl font-black tracking-tighter">{(fiscalStats.settled + fiscalStats.outstanding).toLocaleString()} UGX</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Settled Nodes</p>
                        <p className="text-xl font-black tracking-tighter text-emerald-400">{fiscalStats.settled.toLocaleString()} UGX</p>
                      </div>
                   </div>
                   <Button variant="secondary" className="bg-white/10 text-white border-none hover:bg-white/20 text-[10px] font-black uppercase tracking-widest rounded-xl"><Download size={16} className="mr-2"/> Audit Export</Button>
                </div>

                <div className="space-y-4">
                   {vendorTransactions.map(tx => (
                     <div key={tx.id} className="p-6 bg-slate-50 rounded-[28px] border-2 border-transparent hover:border-slate-100 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                              <Receipt size={24} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.type.replace('_', ' ')} • {tx.method.replace('_', ' ')}</p>
                              <p className="text-sm font-black text-slate-900 mt-1 uppercase">{tx.reference || 'SYSTEM GEN'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-black text-slate-900 tracking-tighter">{tx.amount.toLocaleString()} UGX</p>
                           <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${tx.status === 'PAID' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>{tx.status}</span>
                        </div>
                     </div>
                   ))}
                   {vendorTransactions.length === 0 && (
                     <div className="text-center py-20 text-slate-400 font-bold uppercase text-xs tracking-widest">No Fiscal History Triangulated.</div>
                   )}
                </div>
             </div>
           )}

           {activeTab === 'PRODUCTS' && (
             <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendorProducts.map(product => (
                  <div key={product.id} className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 group hover:bg-white hover:border-indigo-600 transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                           <Package size={28} />
                        </div>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${product.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                           STOCK: {product.stock}
                        </span>
                     </div>
                     <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                     <p className="text-[10px] text-slate-400 font-mono mt-2 tracking-widest uppercase">SKU: {product.sku}</p>
                     <div className="mt-8 pt-8 border-t border-slate-200/50 flex justify-between items-end">
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Magnitude</p>
                           <p className="text-xl font-black text-slate-900 tracking-tighter">{product.price.toLocaleString()} <span className="text-sm font-normal opacity-40">UGX</span></p>
                        </div>
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">Protocol <ChevronRight size={14}/></button>
                     </div>
                  </div>
                ))}
                {vendorProducts.length === 0 && (
                  <div className="col-span-full text-center py-20 text-slate-400 font-bold uppercase text-xs tracking-widest">No Inventory Nodes Found.</div>
                )}
             </div>
           )}

           {activeTab === 'EDIT' && (
             <div className="animate-in fade-in space-y-10 max-w-2xl mx-auto py-4">
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <User size={16}/> Registry Identity Protocol
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                        <input 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white font-bold text-sm transition-all"
                           value={editForm.name}
                           onChange={e => setEditForm({...editForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle State</label>
                        <select 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white font-bold text-sm transition-all appearance-none"
                           value={editForm.status}
                           onChange={e => setEditForm({...editForm, status: e.target.value as any})}
                        >
                           <option value="ACTIVE">ACTIVE NODE</option>
                           <option value="SUSPENDED">SUSPENDED</option>
                        </select>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <Phone size={16}/> Communication Uplink
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Email</label>
                        <input 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white font-bold text-sm transition-all"
                           value={editForm.email}
                           onChange={e => setEditForm({...editForm, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                        <input 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white font-bold text-sm transition-all"
                           value={editForm.phone}
                           onChange={e => setEditForm({...editForm, phone: e.target.value})}
                        />
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] flex items-center gap-3">
                      <Building2 size={16}/> Unit & Store Geometry
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Node Number</label>
                        <input 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white font-bold text-sm transition-all"
                           value={editForm.shopNumber}
                           onChange={e => setEditForm({...editForm, shopNumber: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Section</label>
                        <input 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white font-bold text-sm transition-all"
                           value={editForm.section}
                           onChange={e => setEditForm({...editForm, section: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification Triage</label>
                        <select 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white font-bold text-sm transition-all appearance-none"
                           value={editForm.storeType}
                           onChange={e => setEditForm({...editForm, storeType: e.target.value as any})}
                        >
                           {Object.values(ProductCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex gap-4">
                   <Button variant="secondary" onClick={() => setActiveTab('OVERVIEW')} className="flex-1 h-16 rounded-3xl font-black uppercase text-[10px] tracking-widest border-2">Cancel Edit</Button>
                   <Button onClick={handleSave} className="flex-1 h-16 rounded-3xl font-black uppercase text-[10px] tracking-widest bg-indigo-600 shadow-2xl shadow-indigo-100"><Save size={18} className="mr-3"/> Execute Override</Button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
