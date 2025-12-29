import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product, Sale } from '../types';
import { Plus, Trash2, Edit2, Package, Search, ShoppingCart, Calculator, X, Save, AlertTriangle } from 'lucide-react';
import { PaymentGateway } from './PaymentGateway';

interface MyShopModuleProps {
  isSupplier?: boolean;
}

export const MyShopModule: React.FC<MyShopModuleProps> = ({ isSupplier = false }) => {
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'POS'>('INVENTORY');
  
  // Inventory State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // POS State
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);

  // --- Inventory Handlers ---
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this item from inventory?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const lowStockItems = products.filter(p => p.stock < 15).length;

  // --- POS Handlers ---
  const addToCart = (product: Product) => {
      const existing = cart.find(item => item.product.id === product.id);
      if (existing) {
          setCart(cart.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      } else {
          setCart([...cart, { product, qty: 1 }]);
      }
  };

  const removeFromCart = (productId: string) => {
      setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
      setCart(cart.map(item => {
          if (item.product.id === productId) {
              const newQty = Math.max(1, item.qty + delta);
              return { ...item, qty: newQty };
          }
          return item;
      }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
  const cartTax = cartTotal * 0.18; // 18% VAT

  const handlePaymentSuccess = (txId: string, method: string) => {
      const newSale: Sale = {
          id: `sale-${Date.now()}`,
          date: new Date().toISOString(),
          items: cart.map(i => ({ productId: i.product.id, name: i.product.name, qty: i.qty, price: i.product.price })),
          totalAmount: cartTotal,
          taxAmount: cartTax,
          paymentMethod: method as 'CASH' | 'MOMO' | 'CARD'
      };

      setSalesHistory([newSale, ...salesHistory]);
      
      // Update Stock (Simulation)
      setProducts(products.map(p => {
          const inCart = cart.find(c => c.product.id === p.id);
          if (inCart) {
              return { ...p, stock: Math.max(0, p.stock - inCart.qty) };
          }
          return p;
      }));

      setCart([]);
      setIsCheckout(false);
  };

  return (
    <div className="space-y-6">
      {isCheckout && (
          <PaymentGateway 
             amount={cartTotal}
             taxAmount={cartTax}
             description={`POS Sale: ${cart.length} items`}
             onSuccess={handlePaymentSuccess}
             onClose={() => setIsCheckout(false)}
          />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{isSupplier ? 'Warehouse Inventory' : 'My Shop'}</h2>
          <p className="text-slate-500 text-sm">Manage stock, sales, and pricing.</p>
        </div>
        
        {/* Toggle between Inventory and POS (Only for Vendors) */}
        {!isSupplier && (
            <div className="bg-slate-100 p-1 rounded-lg flex">
                <button 
                    onClick={() => setActiveTab('INVENTORY')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'INVENTORY' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                    Inventory
                </button>
                <button 
                    onClick={() => setActiveTab('POS')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'POS' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
                >
                    POS Terminal <Calculator size={14} />
                </button>
            </div>
        )}

        {activeTab === 'INVENTORY' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <Plus size={16} /> Add Product
            </button>
        )}
      </div>

      {lowStockItems > 0 && !isSupplier && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between text-amber-800 text-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
                <AlertTriangle size={18} />
                <span><strong>Attention:</strong> {lowStockItems} items are running low on stock.</span>
            </div>
            <button className="text-amber-700 font-bold hover:underline">
                 Create Requisition &rarr;
            </button>
        </div>
      )}

      {activeTab === 'INVENTORY' ? (
          <>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search items..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4">Unit Price (UGX)</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                        <div className="p-2 bg-slate-100 rounded text-slate-500">
                            <Package size={16} />
                        </div>
                        {product.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono">{product.sku}</td>
                        <td className="px-6 py-4 text-slate-600">{product.category}</td>
                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            product.stock < 20 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                            {product.stock} units
                        </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{product.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                            <Edit2 size={16} />
                            </button>
                            <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                            <Trash2 size={16} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-400">No products found.</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
          </>
      ) : (
          /* --- POS INTERFACE --- */
          <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] gap-6">
              {/* Product Grid */}
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 overflow-y-auto">
                 <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Scan or Search Product..." 
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredProducts.map(p => (
                         <button 
                            key={p.id}
                            disabled={p.stock === 0}
                            onClick={() => addToCart(p)}
                            className="text-left p-4 border border-slate-100 rounded-xl hover:border-green-400 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50 hover:bg-white"
                         >
                             <div className="text-xs text-slate-400 mb-1">{p.category}</div>
                             <div className="font-bold text-slate-800 mb-1 group-hover:text-green-700">{p.name}</div>
                             <div className="flex justify-between items-center mt-3">
                                 <span className="font-bold text-slate-900">{p.price.toLocaleString()}</span>
                                 <span className={`text-xs px-2 py-0.5 rounded ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                                     Qty: {p.stock}
                                 </span>
                             </div>
                         </button>
                     ))}
                 </div>
              </div>

              {/* Cart Sidebar */}
              <div className="lg:w-96 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col">
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                          <ShoppingCart size={20} /> Current Sale
                      </div>
                      <span className="text-xs text-slate-500">Order #{Date.now().toString().slice(-6)}</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {cart.length === 0 ? (
                          <div className="text-center text-slate-400 py-10 text-sm">Cart is empty</div>
                      ) : (
                          cart.map(item => (
                              <div key={item.product.id} className="flex justify-between items-center border-b border-slate-50 pb-2">
                                  <div>
                                      <div className="font-medium text-slate-800">{item.product.name}</div>
                                      <div className="text-xs text-slate-500">{item.product.price.toLocaleString()} x {item.qty}</div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <div className="flex items-center border border-slate-200 rounded-lg">
                                          <button onClick={() => updateCartQty(item.product.id, -1)} className="px-2 py-1 hover:bg-slate-100 text-slate-600">-</button>
                                          <span className="px-2 text-sm font-bold">{item.qty}</span>
                                          <button onClick={() => updateCartQty(item.product.id, 1)} className="px-2 py-1 hover:bg-slate-100 text-slate-600">+</button>
                                      </div>
                                      <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>

                  <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl space-y-4">
                      <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>Subtotal</span>
                          <span>{cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>VAT (18%)</span>
                          <span>{cartTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-slate-900 border-t border-slate-200 pt-2">
                          <span>Total</span>
                          <span>{(cartTotal).toLocaleString()} UGX</span>
                      </div>
                      
                      <button 
                        onClick={() => setIsCheckout(true)}
                        disabled={cart.length === 0}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                          <Save size={18} /> Checkout & Pay
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};