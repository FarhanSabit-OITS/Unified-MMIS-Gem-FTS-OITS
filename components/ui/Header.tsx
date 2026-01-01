import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Search, X, ChevronRight, Store, Package, ShoppingBag } from 'lucide-react';
import { UserProfile } from '../../types';
import { MOCK_VENDORS, MOCK_PRODUCTS } from '../../constants';

interface HeaderProps {
  user: UserProfile | null;
  isSimplified?: boolean;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, isSimplified, onLogoClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock Orders for search (usually in a context or store)
  const MOCK_ORDERS = [
     { id: 'ORD-1001', customerName: 'Alice', type: 'Order' },
     { id: 'ORD-1002', customerName: 'John', type: 'Order' }
  ];

  // Debounced Search Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        const lowerQ = query.toLowerCase();
        
        const vendors = MOCK_VENDORS
          .filter(v => v.name.toLowerCase().includes(lowerQ) || v.shopNumber.toLowerCase().includes(lowerQ))
          .map(v => ({ ...v, type: 'Vendor', icon: Store }));
          
        const products = MOCK_PRODUCTS
          .filter(p => p.name.toLowerCase().includes(lowerQ))
          .map(p => ({ ...p, type: 'Product', icon: Package }));

        const orders = MOCK_ORDERS
          .filter(o => o.id.toLowerCase().includes(lowerQ) || o.customerName.toLowerCase().includes(lowerQ))
          .map(o => ({ ...o, name: o.id, description: o.customerName, type: 'Order', icon: ShoppingBag }));

        setResults([...vendors, ...products, ...orders]);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
          <LayoutDashboard size={20} />
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">MMIS</span>
      </div>
      
      {!isSimplified && user && (
        <>
          {/* Global Search Bar */}
          <div ref={searchRef} className="hidden md:block relative w-full max-w-md mx-4">
             <div className={`flex items-center bg-slate-100 rounded-lg px-3 py-2 border transition-all ${searchOpen ? 'border-indigo-500 ring-2 ring-indigo-100 bg-white' : 'border-transparent'}`}>
                <Search size={18} className="text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search vendors, products, orders..." 
                  className="bg-transparent border-none outline-none text-sm w-full ml-2 placeholder:text-slate-400 text-slate-900"
                  onFocus={() => setSearchOpen(true)}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && <button onClick={() => {setQuery(''); setResults([]);}}><X size={16} className="text-slate-400 hover:text-slate-600"/></button>}
             </div>

             {/* Search Dropdown */}
             {searchOpen && query.length > 1 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {results.length > 0 ? (
                        <div>
                            <div className="px-4 py-2 bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                                Search Results ({results.length})
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {results.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                                            {item.icon ? <item.icon size={16} /> : <Search size={16} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-slate-800">{item.name}</div>
                                            <div className="text-xs text-slate-500">{item.type} • {item.description || item.shopNumber || 'View Details'}</div>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            <Search size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-xs">No results found for "{query}"</p>
                        </div>
                    )}
                </div>
             )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900">{user.name}</div>
              <div className="text-xs text-slate-500">{user.role}</div>
            </div>
            <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
              {user.name[0]}
            </div>
          </div>
        </>
      )}
    </header>
  );
};