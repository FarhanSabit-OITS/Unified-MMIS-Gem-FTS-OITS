
import React, { useState } from 'react';
import { MARKETS, CITIES } from '../constants';
import { MapPin, Building2, Calendar, Filter, LayoutGrid, PieChart as PieChartIcon, BarChart3, X, History, ArrowUpDown } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const MarketRegistry: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'ANALYTICS'>('LIST');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredMarkets = MARKETS.filter(market => {
    const matchesType = typeFilter === 'ALL' || market.type === typeFilter;
    const matchesOwnership = ownershipFilter === 'ALL' || market.ownership === ownershipFilter;
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

  const clearFilters = () => {
      setTypeFilter('ALL');
      setOwnershipFilter('ALL');
      setDateRange({ start: '', end: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-900">Market Registry</h2><p className="text-slate-500 text-sm">Centralized registry of regional trade hubs.</p></div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
             <button onClick={() => setViewMode('LIST')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${viewMode === 'LIST' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Registry</button>
             <button onClick={() => setViewMode('ANALYTICS')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${viewMode === 'ANALYTICS' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Analytics</button>
        </div>
      </div>

      {viewMode === 'LIST' ? (
        <>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Market Type</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 outline-none" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="ALL">All Types</option><option value="WHOLESALE">Wholesale</option><option value="RETAIL">Retail</option></select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Ownership Model</label>
                    <select className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 outline-none" value={ownershipFilter} onChange={(e) => setOwnershipFilter(e.target.value)}><option value="ALL">All Ownership</option><option value="PUBLIC">Public</option><option value="PRIVATE">Private</option><option value="PPP">PPP</option></select>
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Establishment Date Range</label>
                    <div className="flex gap-2">
                        <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 outline-none" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
                        <input type="date" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 outline-none" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.map(market => (
                    <div key={market.id} className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Building2 size={24} /></div>
                            <span className="bg-slate-50 border px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-500">{market.ownership}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{market.name}</h3>
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} className="text-slate-400" />{getCityName(market.cityId)}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-600"><LayoutGrid size={16} className="text-slate-400" />{market.type}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-600"><Calendar size={16} className="text-slate-400" />Est. {new Date(market.establishmentDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col items-center justify-center text-slate-400"><PieChartIcon size={40} className="mb-2 opacity-20" /><p>Ownership Distribution Analytics</p></div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex flex-col items-center justify-center text-slate-400"><BarChart3 size={40} className="mb-2 opacity-20" /><p>Market Type Saturation</p></div>
        </div>
      )}
    </div>
  );
};
