import React, { useState } from 'react';
import { MARKETS, CITIES } from '../constants';
import { MapPin, Building2, Calendar, Filter, LayoutGrid, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const MarketRegistry: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'ANALYTICS'>('LIST');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [yearRange, setYearRange] = useState({ start: '1900', end: new Date().getFullYear().toString() });

  const filteredMarkets = MARKETS.filter(market => {
    const matchesType = typeFilter === 'ALL' || market.type === typeFilter;
    const matchesOwnership = ownershipFilter === 'ALL' || market.ownership === ownershipFilter;
    
    const estYear = new Date(market.establishmentDate).getFullYear();
    const startYear = parseInt(yearRange.start) || 0;
    const endYear = parseInt(yearRange.end) || 9999;
    const matchesDate = estYear >= startYear && estYear <= endYear;

    return matchesType && matchesOwnership && matchesDate;
  }).sort((a, b) => {
    const dateA = new Date(a.establishmentDate).getTime();
    const dateB = new Date(b.establishmentDate).getTime();
    return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
  });

  const getCityName = (cityId: string) => CITIES.find(c => c.id === cityId)?.name || 'Unknown City';

  // Analytics Data Preparation
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Market Registry</h2>
          <p className="text-slate-500 text-sm">Manage and view market details across regions.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
                onClick={() => setViewMode('LIST')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${viewMode === 'LIST' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
                <LayoutGrid size={16} /> Registry
            </button>
            <button 
                onClick={() => setViewMode('ANALYTICS')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${viewMode === 'ANALYTICS' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
                <PieChartIcon size={16} /> Analytics
            </button>
        </div>
      </div>

      {viewMode === 'LIST' ? (
        <>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
                <div className="flex items-center gap-2 text-slate-500 self-center">
                <Filter size={18} />
                <span className="text-sm font-medium">Filters:</span>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Type</label>
                    <select 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    >
                    <option value="ALL">All Types</option>
                    <option value="WHOLESALE">Wholesale</option>
                    <option value="RETAIL">Retail</option>
                    <option value="MIXED">Mixed</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Ownership</label>
                    <select 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={ownershipFilter}
                    onChange={(e) => setOwnershipFilter(e.target.value)}
                    >
                    <option value="ALL">All Ownership</option>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="PPP">PPP</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Est. Year (From)</label>
                    <input 
                        type="number" 
                        placeholder="Start"
                        className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={yearRange.start}
                        onChange={(e) => setYearRange({...yearRange, start: e.target.value})}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Est. Year (To)</label>
                    <input 
                        type="number" 
                        placeholder="End"
                        className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={yearRange.end}
                        onChange={(e) => setYearRange({...yearRange, end: e.target.value})}
                    />
                </div>

                <div className="space-y-1 ml-auto">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Sort Order</label>
                    <select 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'NEWEST' | 'OLDEST')}
                    >
                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.length > 0 ? (
                    filteredMarkets.map(market => (
                    <div key={market.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <Building2 size={24} />
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                            market.ownership === 'PUBLIC' ? 'bg-green-50 text-green-700 border-green-100' :
                            market.ownership === 'PRIVATE' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                            'bg-orange-50 text-orange-700 border-orange-100'
                        }`}>
                            {market.ownership}
                        </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1">{market.name}</h3>
                        
                        <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin size={16} className="text-slate-400" />
                            {getCityName(market.cityId)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <LayoutGrid size={16} className="text-slate-400" />
                            {market.type} Market
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar size={16} className="text-slate-400" />
                            Est. {new Date(market.establishmentDate).getFullYear()} ({new Date().getFullYear() - new Date(market.establishmentDate).getFullYear()} yrs)
                        </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            View Registry Details &rarr;
                        </button>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No markets match your criteria.</p>
                    </div>
                )}
            </div>
        </>
      ) : (
        /* ANALYTICS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChartIcon size={20} /> Ownership Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={ownershipData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {ownershipData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={20} /> Market Types</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                 <p className="text-slate-500 text-sm">Analytics generated from real-time registry data. Data reflects current operational status across all regions.</p>
            </div>
        </div>
      )}
    </div>
  );
};