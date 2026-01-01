import React, { useState } from 'react';
import { MARKETS, CITIES } from '../constants';
import { MapPin, Building2, Calendar, Filter, LayoutGrid, PieChart as PieChartIcon, BarChart3, X, History, ArrowUpDown } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const MarketRegistry: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'ANALYTICS'>('LIST');
  
  // Filter States
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const getMarketAgeCategory = (dateString: string) => {
    const age = new Date().getFullYear() - new Date(dateString).getFullYear();
    if (age >= 50) return { label: 'Heritage', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (age >= 20) return { label: 'Established', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    return { label: 'Modern', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  const filteredMarkets = MARKETS.filter(market => {
    // 1. Type Filter
    const matchesType = typeFilter === 'ALL' || market.type === typeFilter;
    
    // 2. Ownership Filter
    const matchesOwnership = ownershipFilter === 'ALL' || market.ownership === ownershipFilter;
    
    // 3. Date Range Filter
    const marketDate = new Date(market.establishmentDate).getTime();
    const startDate = dateRange.start ? new Date(dateRange.start).getTime() : 0;
    const endDate = dateRange.end ? new Date(dateRange.end).getTime() : Infinity;
    
    const matchesDate = marketDate >= startDate && marketDate <= endDate;

    return matchesType && matchesOwnership && matchesDate;
  }).sort((a, b) => {
    const dateA = new Date(a.establishmentDate).getTime();
    const dateB = new Date(b.establishmentDate).getTime();
    return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
  });

  const getCityName = (cityId: string) => CITIES.find(c => c.id === cityId)?.name || 'Unknown City';

  // Analytics Data
  const ownershipData = [
    { name: 'Public', value: MARKETS.filter(m => m.ownership === 'PUBLIC').length, color: '#22c55e' },
    { name: 'Private', value: MARKETS.filter(m => m.ownership === 'PRIVATE').length, color: '#a855f7' },
    { name: 'PPP', value: MARKETS.filter(m => m.ownership === 'PPP').length, color: '#f97316' },
  ].filter(d => d.value > 0);

  const typeData = [
    { name: 'Wholesale', count: MARKETS.filter(m => m.type === 'WHOLESALE').length },
    { name: 'Retail', count: MARKETS.filter(m => m.type === 'RETAIL').length },
    { name: 'Mixed', count: MARKETS.filter(m => m.type === 'MIXED').length },
  ];

  const clearFilters = () => {
      setTypeFilter('ALL');
      setOwnershipFilter('ALL');
      setDateRange({ start: '', end: '' });
      setSortOrder('NEWEST');
  };

  const activeFiltersCount = [
      typeFilter !== 'ALL',
      ownershipFilter !== 'ALL',
      dateRange.start !== '',
      dateRange.end !== ''
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Market Registry</h2>
          <p className="text-slate-500 text-sm">Manage and view market details across regions.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
             <button onClick={() => setViewMode('LIST')} className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${viewMode === 'LIST' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}><LayoutGrid size={16} /> Registry</button>
             <button onClick={() => setViewMode('ANALYTICS')} className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${viewMode === 'ANALYTICS' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><PieChartIcon size={16} /> Analytics</button>
        </div>
      </div>

      {viewMode === 'LIST' ? (
        <>
            {/* Filtering Toolbar */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <Filter size={18} className="text-indigo-600" />
                        <span>Filters & Sorting</span>
                        {activeFiltersCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{activeFiltersCount} Active</span>
                        )}
                    </div>
                    {activeFiltersCount > 0 && (
                        <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                            <X size={14} /> Clear All
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Market Type */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market Type</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            value={typeFilter} 
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="ALL">All Types</option>
                            <option value="WHOLESALE">Wholesale</option>
                            <option value="RETAIL">Retail</option>
                            <option value="MIXED">Mixed</option>
                        </select>
                    </div>

                    {/* Ownership */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ownership Model</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            value={ownershipFilter} 
                            onChange={(e) => setOwnershipFilter(e.target.value)}
                        >
                            <option value="ALL">All Ownership</option>
                            <option value="PUBLIC">Public (Gov)</option>
                            <option value="PRIVATE">Private</option>
                            <option value="PPP">PPP (Hybrid)</option>
                        </select>
                    </div>

                    {/* Establishment Date Range */}
                    <div className="space-y-1 lg:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Establishment Date Range</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input 
                                    type="date" 
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                />
                            </div>
                            <span className="text-slate-400 self-center">-</span>
                            <div className="relative flex-1">
                                <input 
                                    type="date" 
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sort Order */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
                        <div className="relative">
                            <select 
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none" 
                                value={sortOrder} 
                                onChange={(e) => setSortOrder(e.target.value as 'NEWEST' | 'OLDEST')}
                            >
                                <option value="NEWEST">Newest First</option>
                                <option value="OLDEST">Oldest First</option>
                            </select>
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Markets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.length > 0 ? (
                    filteredMarkets.map(market => {
                        const ageCat = getMarketAgeCategory(market.establishmentDate);
                        return (
                        <div key={market.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600 shadow-sm group-hover:scale-110 transition-transform"><Building2 size={24} /></div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${market.ownership === 'PUBLIC' ? 'bg-green-50 text-green-700 border-green-100' : market.ownership === 'PRIVATE' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>{market.ownership}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${ageCat.color}`}>{ageCat.label}</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 relative z-10">{market.name}</h3>
                            <div className="space-y-2 mt-4 relative z-10">
                                <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} className="text-slate-400" />{getCityName(market.cityId)}</div>
                                <div className="flex items-center gap-2 text-sm text-slate-600"><LayoutGrid size={16} className="text-slate-400" />{market.type} Market</div>
                                <div className="flex items-center gap-2 text-sm text-slate-600"><Calendar size={16} className="text-slate-400" />Est. {new Date(market.establishmentDate).toLocaleDateString()}</div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end relative z-10">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
                                    View Registry Details <ArrowUpDown size={12} className="rotate-90" />
                                </button>
                            </div>
                            <div className="absolute -bottom-4 -right-4 text-slate-50 z-0 group-hover:text-slate-100 transition-colors"><History size={100} opacity={0.5} /></div>
                        </div>
                    )})
                ) : (
                    <div className="col-span-full py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No markets match your criteria.</p>
                        <p className="text-xs mt-1">Try adjusting the ownership or date range filters.</p>
                        <button onClick={clearFilters} className="text-indigo-600 font-bold mt-4 hover:underline text-sm">Reset Filters</button>
                    </div>
                )}
            </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChartIcon size={20} /> Ownership Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={ownershipData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{ownershipData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /><Legend /></PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={20} /> Market Types</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} /><YAxis fontSize={12} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: '#f1f5f9' }} /><Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} /></BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};