import React, { useState } from 'react';
import { MARKETS, CITIES } from '../constants';
import { MapPin, Building2, Calendar, Filter } from 'lucide-react';

export const MarketRegistry: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  const filteredMarkets = MARKETS.filter(market => {
    const matchesType = typeFilter === 'ALL' || market.type === typeFilter;
    const matchesOwnership = ownershipFilter === 'ALL' || market.ownership === ownershipFilter;
    return matchesType && matchesOwnership;
  }).sort((a, b) => {
    const dateA = new Date(a.establishmentDate).getTime();
    const dateB = new Date(b.establishmentDate).getTime();
    return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
  });

  const getCityName = (cityId: string) => CITIES.find(c => c.id === cityId)?.name || 'Unknown City';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Market Registry</h2>
          <p className="text-slate-500 text-sm">Manage and view market details across regions.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <select 
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="WHOLESALE">Wholesale</option>
          <option value="RETAIL">Retail</option>
          <option value="MIXED">Mixed</option>
        </select>

        <select 
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
          value={ownershipFilter}
          onChange={(e) => setOwnershipFilter(e.target.value)}
        >
          <option value="ALL">All Ownership</option>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
          <option value="PPP">PPP</option>
        </select>

        <select 
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 ml-auto"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'NEWEST' | 'OLDEST')}
        >
          <option value="NEWEST">Newest First</option>
          <option value="OLDEST">Oldest First</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.map(market => (
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
                <Filter size={16} className="text-slate-400" />
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
        ))}
      </div>
    </div>
  );
};
