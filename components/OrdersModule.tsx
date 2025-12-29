import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Filter, Calendar, Tag, ChevronDown, 
  ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, 
  Package, Truck, MoreVertical, Eye, Printer, Download, ListFilter,
  DollarSign
} from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Order, UserProfile } from '../types';

interface OrdersModuleProps {
  user?: UserProfile;
}

export const OrdersModule: React.FC<OrdersModuleProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'INCOMING' | 'OUTGOING'>('INCOMING');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [orders, setOrders] = useState<Order[]>([
    { 
      id: 'ORD-1001', 
      customerName: 'Alice Johnson', 
      vendorName: user?.name || 'My Store', 
      items: [{ id: '1', productId: 'P1', name: 'Maize Flour', quantity: 5, price: 12000 }],
      total: 60000, 
      status: 'PENDING', 
      createdAt: '2024-05-18 09:30', 
      type: 'INCOMING',
      tags: ['Retail', 'Priority']
    },
    { 
      id: 'ORD-1002', 
      customerName: 'John Doe', 
      vendorName: user?.name || 'My Store', 
      items: [{ id: '2', productId: 'P2', name: 'Cooking Oil', quantity: 2, price: 45000 }],
      total: 90000, 
      status: 'DISPATCHED', 
      createdAt: '2024-05-17 14:20', 
      type: 'INCOMING',
      tags: ['Bulk']
    },
    { 
      id: 'ORD-1003', 
      customerName: user?.name || 'My Store', 
      vendorName: 'Nile Agro', 
      items: [{ id: '3', productId: 'P3', name: 'Fertilizer', quantity: 10, price: 150000 }],
      total: 1500000, 
      status: 'DELIVERED', 
      createdAt: '2024-05-15 11:00', 
      type: 'OUTGOING' 
    },
  ]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = order.type === activeTab;
      const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || 
                           order.customerName.toLowerCase().includes(search.toLowerCase()) ||
                           order.vendorName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      
      const matchesDate = (dateRange.start === '' || order.createdAt >= dateRange.start) &&
                          (dateRange.end === '' || order.createdAt <= dateRange.end + ' 23:59');

      return matchesTab && matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, activeTab, search, statusFilter, dateRange]);

  const statusColors = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    DISPATCHED: 'bg-blue-50 text-blue-600 border-blue-100',
    DELIVERED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    CANCELLED: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-indigo-50">
             <ShoppingBag size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Order Management</h2>
              <p className="text-slate-500 font-medium text-lg">Transaction tracking & fulfillment hub.</p>
           </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 border-2"><Download size={18}/> Export Ledger</Button>
          <Button className="h-12 px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100"><Printer size={18}/> Bulk Print Labels</Button>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100/50 p-2 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        <button onClick={() => setActiveTab('INCOMING')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'INCOMING' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Incoming Sales</button>
        <button onClick={() => setActiveTab('OUTGOING')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'OUTGOING' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>Outgoing Purchases</button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input icon={Search} placeholder="Search Order ID, Name, or Node..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
          </div>
          <div className="relative group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-black text-white border-2 border-slate-800 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer shadow-xl"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
          <Button variant="secondary" onClick={() => setShowAdvanced(!showAdvanced)} className="h-full border-2">
            <ListFilter size={18}/> {showAdvanced ? 'Hide Filters' : 'Advanced Filters'}
          </Button>
        </div>

        {showAdvanced && (
          <Card className="p-6 bg-slate-50 border-slate-200 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Created From</label>
                <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-indigo-600 shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Created To</label>
                <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-indigo-600 shadow-sm" />
              </div>
              <div className="flex items-end">
                <Button variant="ghost" onClick={() => { setSearch(''); setStatusFilter('ALL'); setDateRange({start:'', end:''}); }} className="text-red-500 font-black uppercase text-[10px]">Reset All Logic</Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map(order => (
          <Card key={order.id} className="p-6 rounded-[32px] border-slate-100 shadow-xl hover:shadow-2xl transition-all group overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all ${order.type === 'INCOMING' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                   {order.type === 'INCOMING' ? <ArrowDownLeft size={28}/> : <ArrowUpRight size={28}/>}
                </div>
                <div>
                   <div className="flex items-center gap-3">
                     <h4 className="text-xl font-black text-slate-900 tracking-tight">{order.id}</h4>
                     <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${statusColors[order.status]}`}>
                       {order.status}
                     </span>
                   </div>
                   <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-tight">
                     {order.type === 'INCOMING' ? `Customer: ${order.customerName}` : `Target: ${order.vendorName}`}
                   </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8 lg:text-right">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center lg:justify-end gap-1.5"><Calendar size={12}/> Allocation Date</p>
                   <p className="text-sm font-black text-slate-800">{order.createdAt.split(' ')[0]}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center lg:justify-end gap-1.5"><Package size={12}/> Items</p>
                   <p className="text-sm font-black text-slate-800">{order.items.length} Units</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center lg:justify-end gap-1.5"><DollarSign size={12}/> Settlement</p>
                   <p className="text-xl font-black text-indigo-600 tracking-tighter">UGX {order.total.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                   <Button variant="secondary" className="h-12 w-12 p-0 rounded-xl"><Eye size={20}/></Button>
                   <Button variant="secondary" className="h-12 w-12 p-0 rounded-xl"><Printer size={20}/></Button>
                   <Button variant="outline" className="h-12 border-2 rounded-xl"><Truck size={20}/> Ship</Button>
                </div>
              </div>
            </div>
            {order.tags && (
              <div className="mt-6 pt-4 border-t border-slate-50 flex gap-2">
                {order.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                    <Tag size={8}/> {tag}
                  </span>
                ))}
              </div>
            )}
          </Card>
        ))}
        {filteredOrders.length === 0 && (
          <div className="py-32 text-center text-slate-400 bg-white rounded-[48px] border-2 border-dashed border-slate-100 shadow-inner">
             <Clock size={64} className="mx-auto mb-4 opacity-10"/>
             <p className="font-black uppercase text-xs tracking-widest">No order manifests triangulated in this quadrant.</p>
             <p className="text-[10px] mt-2 font-medium">Verify your filter parameters or search registry.</p>
          </div>
        )}
      </div>
    </div>
  );
};