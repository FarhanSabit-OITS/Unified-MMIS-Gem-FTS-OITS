
import React, { useState, useMemo } from 'react';
import { MARKETS, CITIES } from '../constants';
import { Market, MarketType, UserRole } from '../types';
import { 
  MapPin, Building2, Calendar, LayoutGrid, PieChart as PieChartIcon, 
  BarChart3, X, History, Plus, Users, ShoppingBag, ShieldCheck, 
  Search, Info, Zap, ArrowUpDown, Navigation, ExternalLink
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export const MarketRegistry: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'ANALYTICS' | 'MAP'>('LIST');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const isAdmin = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MARKET_ADMIN;

  const filteredMarkets = useMemo(() => {
    return MARKETS.filter(market => {
      const matchesType = typeFilter === 'ALL' || market.type === typeFilter;
      const matchesOwnership = ownershipFilter === 'ALL' || market.ownership === ownershipFilter;
      return matchesType && matchesOwnership;
    }).sort((a, b) => {
      const dateA = new Date(a.establishmentDate).getTime();
      const dateB = new Date(b.establishmentDate).getTime();
      return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
    });
  }, [typeFilter, ownershipFilter, sortOrder]);

  const analyticsData = useMemo(() => {
    // BarChart Data: Capacity & Year
    const capacityData = MARKETS.map(m => ({
      name: m.name,
      capacity: m.capacity,
      year: new Date(m.establishmentDate).getFullYear(),
    })).sort((a, b) => a.year - b.year);

    // PieChart Data: Market Type Distribution
    const typeDistribution = Object.values(MarketType).map(type => ({
      name: type,
      value: MARKETS.filter(m => m.type === type).length
    })).filter(d => d.value > 0);

    return { capacityData, typeDistribution };
  }, []);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const getCityName = (cityId: string) => CITIES.find(c => c.id === cityId)?.name || 'Unknown City';

  const handleGetDirections = (market: Market) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${market.latitude},${market.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Market Registry</h2>
          <p className="text-slate-500 text-sm font-medium">Regional trade hub triangulation and classification.</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button onClick={() => setShowAddModal(true)} className="bg-indigo-600 hover:bg-indigo-700 font-black uppercase text-[10px] tracking-widest px-6 h-11">
              <Plus size={16} className="mr-2"/> Register Node
            </Button>
          )}
          <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200">
             <button onClick={() => setViewMode('LIST')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>List</button>
             <button onClick={() => setViewMode('MAP')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'MAP' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Map</button>
             <button onClick={() => setViewMode('ANALYTICS')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'ANALYTICS' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Analytics</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-wrap gap-6 items-end">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Classification</label>
                <select className="px-4 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold bg-slate-50 outline-none focus:border-indigo-500 transition-all min-w-[180px]" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="ALL">All Hub Types</option>
                    <option value={MarketType.WHOLESALE}>Wholesale Hub</option>
                    <option value={MarketType.RETAIL}>Retail Hub</option>
                    <option value={MarketType.MIXED}>Mixed Node</option>
                    <option value={MarketType.FARMERS}>Farmers Market</option>
                    <option value={MarketType.SPECIALIZED}>Specialized</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ownership Model</label>
                <select className="px-4 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold bg-slate-50 outline-none focus:border-indigo-500 transition-all min-w-[180px]" value={ownershipFilter} onChange={(e) => setOwnershipFilter(e.target.value)}>
                    <option value="ALL">All Models</option>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="PPP">PPP (Hybrid)</option>
                </select>
            </div>
            <Button variant="secondary" onClick={() => { setTypeFilter('ALL'); setOwnershipFilter('ALL'); }} className="h-12 border-2 text-[10px] font-black uppercase">Reset Filters</Button>
      </div>

      {viewMode === 'LIST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map(market => (
                <div 
                  key={market.id} 
                  onClick={() => setSelectedMarket(market)}
                  className="bg-white rounded-[40px] border-2 border-transparent hover:border-indigo-100 p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Building2 size={120} className="text-slate-900" />
                    </div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Building2 size={24} />
                        </div>
                        <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{market.ownership}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{market.name}</h3>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{getCityName(market.cityId)}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Node Capacity</p>
                            <p className="text-sm font-black text-slate-800">{market.capacity.toLocaleString()} Units</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Established</p>
                            <p className="text-sm font-black text-slate-800">{new Date(market.establishmentDate).getFullYear()}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {viewMode === 'MAP' && (
        <div className="relative h-[600px] bg-slate-200 rounded-[48px] overflow-hidden shadow-2xl border-8 border-white">
          {/* Conceptual Map Placeholder */}
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/32.5811,0.3136,11,0/1200x600?access_token=pk.placeholder')] bg-cover bg-center"></div>
          
          <div className="absolute top-6 left-6 z-10">
            <Card className="p-6 bg-white/90 backdrop-blur-md rounded-[32px] shadow-2xl border-none">
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">Map Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase">Operational Hub</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Markers */}
          {filteredMarkets.map((m, idx) => (
            <button 
              key={m.id}
              onClick={() => setSelectedMarket(m)}
              className="absolute group z-10"
              style={{ left: `${30 + (idx * 15)}%`, top: `${20 + (idx * 10)}%` }}
            >
              <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-4 border-white">
                <MapPin size={20} />
              </div>
              <div className="absolute left-full ml-3 bg-slate-900 text-white px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[10px] font-black uppercase tracking-widest">
                {m.name}
              </div>
            </button>
          ))}
          
          {/* Quick Details Floating Panel */}
          {selectedMarket && (
             <div className="absolute bottom-8 left-8 right-8 z-20 animate-in slide-in-from-bottom-6">
                <Card className="p-8 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[40px] border-none flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 size={32} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedMarket.name}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <MapPin size={12} className="text-indigo-400"/> {getCityName(selectedMarket.cityId)}
                        </p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setSelectedMarket(null)} className="h-14 border-2 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest">Close Node</Button>
                      <Button onClick={() => handleGetDirections(selectedMarket)} className="h-14 rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-100">
                         <Navigation size={18} className="mr-2"/> Get Directions
                      </Button>
                   </div>
                </Card>
             </div>
          )}
        </div>
      )}

      {viewMode === 'ANALYTICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-10 rounded-[48px] border-none shadow-xl flex flex-col items-center justify-between min-h-[500px]">
                <div className="text-center mb-8">
                    <h4 className="font-black uppercase text-sm tracking-widest text-slate-900 mb-2">Hub Capacity Timeline</h4>
                    <p className="text-xs font-medium text-slate-500">Node magnitude indexed by establishment cycle.</p>
                </div>
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.capacityData}>
                            <XAxis 
                              dataKey="year" 
                              fontSize={10} 
                              fontWeight="black" 
                              tickFormatter={(val) => `EST ${val}`}
                            />
                            <YAxis fontSize={10} fontWeight="black" />
                            <Tooltip 
                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }}
                                cursor={{ fill: '#F8FAFC' }}
                                formatter={(value: any, name: any, props: any) => [
                                    `${value.toLocaleString()} Units`, 
                                    `${props.payload.name} (Est. ${props.payload.year})`
                                ]}
                            />
                            <Bar dataKey="capacity" fill="#4F46E5" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-10 rounded-[48px] border-none shadow-xl flex flex-col items-center justify-between min-h-[500px]">
                <div className="text-center mb-8">
                    <h4 className="font-black uppercase text-sm tracking-widest text-slate-900 mb-2">Classification Distribution</h4>
                    <p className="text-xs font-medium text-slate-500">Sectoral triage of operational trade hubs.</p>
                </div>
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={analyticsData.typeDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={10}
                                dataKey="value"
                            >
                                {analyticsData.typeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }}
                            />
                            <Legend verticalAlign="bottom" align="center" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
      )}

      {/* Market Details Modal - Reuse existing logic */}
      {selectedMarket && viewMode === 'LIST' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[48px] shadow-2xl max-w-2xl w-full p-10 relative overflow-hidden">
            <button onClick={() => setSelectedMarket(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"><X size={32}/></button>
            
            <div className="flex gap-6 mb-10">
               <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-2xl">
                  <Building2 size={40} />
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedMarket.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">{selectedMarket.type} Hub</span>
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">{selectedMarket.ownership} Model</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
               <DetailNode label="Node Capacity" value={`${selectedMarket.capacity.toLocaleString()} Units`} icon={Users} />
               <DetailNode label="Establishment" value={new Date(selectedMarket.establishmentDate).toLocaleDateString()} icon={Calendar} />
               <DetailNode label="Location Vector" value={getCityName(selectedMarket.cityId)} icon={MapPin} />
            </div>

            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Primary Product Matrix</h4>
               <div className="flex flex-wrap gap-2">
                  {selectedMarket.primaryProducts.map(product => (
                    <span key={product} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200 flex items-center gap-2">
                       <ShoppingBag size={14} className="text-indigo-400" /> {product}
                    </span>
                  ))}
               </div>
            </div>

            <div className="mt-12 flex gap-4">
               <Button onClick={() => handleGetDirections(selectedMarket)} className="flex-1 h-16 rounded-3xl font-black uppercase text-[10px] tracking-widest bg-slate-900 text-white hover:bg-black">
                 <ExternalLink size={16} className="mr-2"/> View in Google Maps
               </Button>
               <Button className="flex-1 h-16 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-100">Synchronize Registry</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailNode = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
  <div className="flex flex-col gap-2">
     <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <Icon size={12} className="text-indigo-400" /> {label}
     </div>
     <p className="text-lg font-black text-slate-800">{value}</p>
  </div>
);
