import React from 'react';
import { 
  BookOpen, UserPlus, ShieldCheck, Store, Globe, Truck, Package, 
  Building2, Mail, CheckCircle2, Loader2, Menu, LayoutDashboard, 
  Users, ClipboardList, Settings, Search, FileText, Upload, 
  BarChart3, Wallet, LogOut, Inbox, Gavel 
} from 'lucide-react';

export const UserManual: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">MMIS HUB System</h1>
            <p className="text-slate-500 mt-1 text-lg">Comprehensive User Manual</p>
          </div>
        </div>

        <div className="space-y-16">
          {/* 1. User Registration Walkthrough */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <UserPlus size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">1. User Registration Walkthrough</h2>
            </div>
            <p className="text-slate-600 mb-6">This section guides new users through the platform registration process.</p>
            
            <div className="space-y-8 ml-4 border-l-2 border-slate-100 pl-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1 & 2: Navigate to Registration Form & Assign Role</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Action:</strong> Navigate to the "Create Entity Ledger" (Registration) page.</li>
                  <li><strong>Action:</strong> Enter the Legal Entity Name (e.g., sunad_VENDOR_KABALE).</li>
                  <li><strong>Action:</strong> Enter a valid Registry Email address (e.g., sfoxdev123@gmail.com).</li>
                  <li><strong>Action:</strong> Create a Master Key (password).</li>
                  <li><strong>Action:</strong> Click the Entity Role dropdown and select Vendor.</li>
                  <li><strong>Action:</strong> Click the Target Market dropdown and select a specific market (e.g., Kabale Central Market).</li>
                  <li><strong>Action:</strong> Click the Dispatch Credentials button.</li>
                </ul>
                
                {/* UI Replica: Registration Form */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-w-md shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold flex items-center gap-2 text-slate-800">
                    <Building2 size={18} className="text-indigo-600" /> MMIS HUB | Create Entity Ledger
                  </div>
                  <div className="p-6 space-y-4">
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Legal Entity Name</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="sunad_VENDOR_KABALE" /></div>
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Registry Email</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="sfoxdev123@gmail.com" /></div>
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Master Key</label><input disabled type="password" className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="•••••••••••••••••••" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Entity Role</label><select disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"><option>Vendor</option></select></div>
                      <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Target Market</label><select disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"><option>Kabale Central Market</option></select></div>
                    </div>
                    <button disabled className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 opacity-90"><Mail size={18}/> Dispatch Credentials</button>
                    <div className="text-center text-xs font-bold text-indigo-600 mt-2">Already have an account? Login here</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 3: Email Verification</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Action:</strong> Open your email inbox and click the Verify Email button inside the message sent by MMIS HUB.</li>
                  <li><strong>Result:</strong> The browser opens a verification tab confirming success.</li>
                </ul>
                
                {/* UI Replica: Verification Screen */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-w-md shadow-sm p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Success!</h3>
                  <p className="text-slate-500 text-sm">Email verified: Automatic login successful.<br/>Redirecting to your dashboard...</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 4: Awaiting Approval</h3>
                <p className="text-slate-700 mb-6"><strong>Status:</strong> The system displays a "Registration Under Review" status. Step 1 (Email Verified) is complete. Step 2 (Admin Approval) is pending.</p>
                
                {/* UI Replica: Onboarding Status */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-w-md shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                      <Loader2 size={24} className="animate-spin" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Registration Under Review</h3>
                      <p className="text-xs text-slate-500 mt-1">Your account is currently pending Market Admin approval.</p>
                    </div>
                  </div>
                  <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Progress</div>
                    <div className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 size={18} className="text-green-500"/> <span className="text-slate-700">Step 1: Email Verified</span></div>
                    <div className="flex items-center gap-3 text-sm font-medium"><div className="w-4 h-4 rounded-full border-2 border-slate-300 ml-0.5"></div> <span className="text-slate-500">Step 2: Admin Approval (Pending)</span></div>
                    <div className="flex items-center gap-3 text-sm font-medium"><div className="w-4 h-4 rounded-full border-2 border-slate-300 ml-0.5"></div> <span className="text-slate-500">Step 3: Shop Setup</span></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Market Admin Approval Walkthrough */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">2. Market Admin Approval Walkthrough</h2>
            </div>
            <p className="text-slate-600 mb-6">Market Masters use this workflow to activate new vendors.</p>
            
            <div className="space-y-8 ml-4 border-l-2 border-slate-100 pl-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1 & 2: Login & Process Registration</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Action:</strong> Log in using Market Master credentials.</li>
                  <li><strong>Action:</strong> Navigate to the Registrations tab in the left sidebar.</li>
                  <li><strong>Action:</strong> Locate the pending request (e.g., azwad VENOSER_XABALE).</li>
                  <li><strong>Action:</strong> Click Grant Access to approve the user.</li>
                  <li><strong>Result:</strong> A notification confirms "Registration approved successfully."</li>
                </ul>
                
                {/* UI Replica: Market Admin Dashboard */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex h-[320px] max-w-3xl">
                  <div className="w-48 bg-slate-900 text-slate-300 p-4 flex flex-col gap-2 text-sm shrink-0">
                    <div className="flex items-center gap-2 text-white font-bold mb-4"><Menu size={16}/> Menu</div>
                    <div className="flex items-center gap-2 py-1.5"><LayoutDashboard size={14}/> Dashboard</div>
                    <div className="flex items-center gap-2 py-1.5"><Users size={14}/> Vendors</div>
                    <div className="flex items-center gap-2 py-1.5 text-white bg-indigo-600/20 rounded-lg px-2 -mx-2 font-medium"><ClipboardList size={14} className="text-indigo-400"/> Registrations</div>
                    <div className="flex items-center gap-2 py-1.5"><Settings size={14}/> Settings</div>
                  </div>
                  <div className="flex-1 p-6 bg-slate-50 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-900">Pending Registrations</h3>
                      <div className="relative"><Search size={14} className="absolute left-2.5 top-2 text-slate-400"/><input disabled className="pl-8 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white" placeholder="Search..." /></div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                          <tr><th className="p-3 font-medium">Entity Name</th><th className="p-3 font-medium">Role</th><th className="p-3 font-medium text-right">Action</th></tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="p-3 font-medium text-slate-700">azwad VENOSER_XABALE</td>
                            <td className="p-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">Vendor</span></td>
                            <td className="p-3 text-right"><button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">Grant Access</button></td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium text-slate-700">fresh_foods_ltd</td>
                            <td className="p-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">Vendor</span></td>
                            <td className="p-3 text-right"><button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">Grant Access</button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-auto bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 text-sm font-bold flex items-center gap-2 shadow-sm">
                      <CheckCircle2 size={16}/> Registration approved successfully!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Vendor Shop Setup Walkthrough */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <Store size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">3. Vendor Shop Setup Walkthrough</h2>
            </div>
            <p className="text-slate-600 mb-6">Once approved, the narrator logs back into the Vendor account to set up the digital shop.</p>
            
            <div className="space-y-8 ml-4 border-l-2 border-slate-100 pl-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1: Configure Shop Details</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Observation:</strong> The system prompts a "Shop Setup" wizard.</li>
                  <li><strong>Action:</strong> Select the Market Location from the dropdown (e.g., Kabale Central Market).</li>
                  <li><strong>Action:</strong> Enter the Shop/Business Name.</li>
                  <li><strong>Action:</strong> Enter a Stall Number (or leave empty for auto-assignment).</li>
                  <li><strong>Action:</strong> Click Launch Shop.</li>
                </ul>
                
                {/* UI Replica: Shop Setup Wizard */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-w-md shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold flex items-center gap-2 text-slate-800">
                    <Store size={18} className="text-orange-600" /> Shop Setup Wizard
                  </div>
                  <div className="p-6 space-y-4">
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Market Location</label><select disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"><option>Kabale Central Market</option></select></div>
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Shop/Biz Name</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="Fresh Veggies Hub" /></div>
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Stall Number</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="A-104 (Leave blank for auto)" /></div>
                    <button disabled className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 opacity-90">🚀 Launch Shop</button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 2: Add Inventory (Single Product)</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Observation:</strong> The dashboard loads with an empty inventory list.</li>
                  <li><strong>Action:</strong> Click Add Product.</li>
                  <li><strong>Action:</strong> Fill in the product details:
                    <ul className="list-[circle] list-inside ml-6 mt-1 space-y-1 text-sm">
                      <li>Name: Fresh tomato (later corrected to Fresh tomatoo).</li>
                      <li>Category: Fresh veggies.</li>
                      <li>SKU: prod-toma-998.</li>
                      <li>Cost Price: 120.</li>
                      <li>Selling Price: 900 (Margin auto-calculated).</li>
                      <li>Current Stock: 50.</li>
                    </ul>
                  </li>
                  <li><strong>Action:</strong> Click Update Product to save.</li>
                </ul>
                
                {/* UI Replica: Add Product Modal */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-w-md shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold flex items-center gap-2 text-slate-800">
                    <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center"><span className="text-lg leading-none font-black">+</span></div> Add New Product
                  </div>
                  <div className="p-6 space-y-4">
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Name</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="Fresh tomatoo" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Category</label><select disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"><option>Fresh veggies</option></select></div>
                      <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">SKU</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="prod-toma-998" /></div>
                      <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Cost Price</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="$ 120.00" /></div>
                      <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Selling Price</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="$ 900.00" /></div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-100"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Margin: 86.6% (Auto-calculated)</div>
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Current Stock</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="50" /></div>
                    <div className="flex gap-3 mt-6">
                      <button disabled className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">Cancel</button>
                      <button disabled className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">💾 Update Product</button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 3: Bulk Upload Inventory</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Action:</strong> Click Bulk Import.</li>
                  <li><strong>Action:</strong> Click Download Template to get the CSV file.</li>
                  <li><strong>Note:</strong> The narrator opens the CSV file to show the required columns (stall_id, name, category, unit, price, etc.) and confirms this method is used for uploading many products at once.</li>
                </ul>
                
                {/* UI Replica: Bulk Import Modal */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-w-md shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold flex items-center gap-2 text-slate-800">
                    <FileText size={18} className="text-indigo-600" /> Bulk Import Inventory
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="text-sm text-slate-600 space-y-3 font-medium">
                      <p>1. <button className="text-indigo-600 font-bold hover:underline">⬇️ Download CSV Template</button></p>
                      <p>2. Fill in your product details in the spreadsheet.</p>
                      <p>3. Upload the completed file below:</p>
                    </div>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3"><Upload size={24}/></div>
                      <p className="text-sm font-medium text-slate-600 mb-3">Drag and drop your .CSV file here or</p>
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm">Browse Files</button>
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 mt-8 mb-4"><strong>Result:</strong> The inventory list is populated with the uploaded products. Below is the Vendor Product List highlighting key UI components.</p>
                
                {/* UI Replica: Vendor Product List */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm max-w-4xl mt-6 relative">
                  <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2"><Package size={18} className="text-indigo-600"/> Inventory Management</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">Manage your shop's products and stock levels.</p>
                    </div>
                    
                    {/* Highlighted Action Buttons */}
                    <div className="relative border-2 border-indigo-400 border-dashed rounded-lg p-1.5 flex gap-2 bg-indigo-50/50 mt-2 sm:mt-0">
                      <div className="absolute -top-3 -right-2 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Primary Actions</div>
                      <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-bold flex items-center gap-2 shadow-sm"><Upload size={14}/> Bulk Import</button>
                      <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-bold flex items-center gap-2 shadow-sm">+ Add Product</button>
                    </div>
                  </div>
                  
                  <div className="p-4 border-b border-slate-100 bg-white flex gap-4">
                     {/* Highlighted Search & Filter */}
                     <div className="relative border-2 border-amber-400 border-dashed rounded-lg p-1.5 flex-1 flex flex-col sm:flex-row gap-2 bg-amber-50/50">
                       <div className="absolute -top-3 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Search & Filters</div>
                       <div className="relative flex-1"><Search size={14} className="absolute left-2.5 top-2.5 text-slate-400"/><input disabled className="w-full pl-8 pr-2 py-2 border border-slate-200 rounded-md text-sm bg-white" placeholder="Search products by name or SKU..." /></div>
                       <select disabled className="border border-slate-200 rounded-md text-sm bg-white px-3 py-2 text-slate-600 font-medium"><option>All Categories</option></select>
                     </div>
                  </div>

                  <div className="overflow-x-auto relative p-4">
                    {/* Highlighted Data Table */}
                    <div className="relative border-2 border-emerald-400 border-dashed rounded-lg p-1 bg-emerald-50/30">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Product Data Table</div>
                      <table className="w-full text-left text-sm mt-2">
                        <thead className="bg-slate-50 border-y border-slate-200 text-slate-500">
                          <tr>
                            <th className="p-3 font-bold text-xs uppercase tracking-wider">Product Name</th>
                            <th className="p-3 font-bold text-xs uppercase tracking-wider">SKU</th>
                            <th className="p-3 font-bold text-xs uppercase tracking-wider">Category</th>
                            <th className="p-3 font-bold text-xs uppercase tracking-wider">Price</th>
                            <th className="p-3 font-bold text-xs uppercase tracking-wider">Stock</th>
                            <th className="p-3 font-bold text-xs uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100 bg-white">
                            <td className="p-3 font-bold text-slate-800">Fresh tomatoo</td>
                            <td className="p-3 text-slate-500 font-mono text-xs">prod-toma-998</td>
                            <td className="p-3 text-slate-600">Fresh veggies</td>
                            <td className="p-3 font-medium text-slate-900">$ 900.00</td>
                            <td className="p-3"><span className="font-medium text-slate-900">50</span> <span className="text-xs text-slate-500">units</span></td>
                            <td className="p-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100">In Stock</span></td>
                          </tr>
                          <tr className="border-b border-slate-100 bg-white">
                            <td className="p-3 font-bold text-slate-800">Organic Carrots</td>
                            <td className="p-3 text-slate-500 font-mono text-xs">prod-carr-102</td>
                            <td className="p-3 text-slate-600">Fresh veggies</td>
                            <td className="p-3 font-medium text-slate-900">$ 450.00</td>
                            <td className="p-3"><span className="font-medium text-slate-900">120</span> <span className="text-xs text-slate-500">units</span></td>
                            <td className="p-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100">In Stock</span></td>
                          </tr>
                          <tr className="border-b border-slate-100 bg-white">
                            <td className="p-3 font-bold text-slate-800">Red Onions</td>
                            <td className="p-3 text-slate-500 font-mono text-xs">prod-onio-404</td>
                            <td className="p-3 text-slate-600">Fresh veggies</td>
                            <td className="p-3 font-medium text-slate-900">$ 320.00</td>
                            <td className="p-3"><span className="font-medium text-red-600">0</span> <span className="text-xs text-slate-500">units</span></td>
                            <td className="p-3"><span className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-red-100">Out of Stock</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Super Admin Overview Walkthrough */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Globe size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">4. Super Admin Overview Walkthrough</h2>
            </div>
            <p className="text-slate-600 mb-6">The narrator briefly logs in as a Super Admin to demonstrate oversight capabilities.</p>
            
            <div className="space-y-8 ml-4 border-l-2 border-slate-100 pl-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1: View Vendor Database</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Action:</strong> Navigate to the main dashboard.</li>
                  <li><strong>Observation:</strong> The system loads a paginated list of all vendors (showing 819 total vendors).</li>
                  <li><strong>Action:</strong> Use the pagination controls (e.g., changing from 10 to 20 per page) to navigate the list.</li>
                  <li><strong>Action:</strong> Use the Add New Vendor button to manually add vendors if needed.</li>
                </ul>
                
                {/* UI Replica: Super Admin Vendor Database */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm max-w-4xl">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2"><Users size={18} className="text-indigo-600"/> Global Vendor Database</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">Total Vendors: 819 | Active: 800 | Pending: 19</p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">+ Add New Vendor</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white border-b border-slate-200 text-slate-500">
                        <tr><th className="p-4 font-bold text-xs uppercase tracking-wider">ID</th><th className="p-4 font-bold text-xs uppercase tracking-wider">Entity Name</th><th className="p-4 font-bold text-xs uppercase tracking-wider">Market</th><th className="p-4 font-bold text-xs uppercase tracking-wider">Status</th><th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Action</th></tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100"><td className="p-4 text-slate-500 font-mono">101</td><td className="p-4 font-bold text-slate-800">sunad_VENDOR_KABALE</td><td className="p-4 text-slate-600 font-medium">Kabale Central</td><td className="p-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">Active</span></td><td className="p-4 text-right"><button className="text-indigo-600 text-xs font-bold hover:underline">Edit</button></td></tr>
                        <tr className="border-b border-slate-100"><td className="p-4 text-slate-500 font-mono">102</td><td className="p-4 font-bold text-slate-800">fresh_foods_ltd</td><td className="p-4 text-slate-600 font-medium">Kabale Central</td><td className="p-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">Active</span></td><td className="p-4 text-right"><button className="text-indigo-600 text-xs font-bold hover:underline">Edit</button></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-slate-50 flex justify-between items-center text-xs font-medium text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-2">Rows per page: <select className="bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-700"><option>10</option></select></div>
                    <div className="flex gap-4 items-center">
                      <button className="text-slate-400 font-bold">&lt; Prev</button>
                      <span className="text-slate-700">Page 1 of 82</span>
                      <button className="text-indigo-600 font-bold">Next &gt;</button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 2: Financial Oversight</h3>
                <p className="text-slate-700 mb-2">The narrator highlights the Revenue Command Center.</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Observation:</strong> View key metrics such as Order Collections, Net Revenue, and Tax Liability.</li>
                </ul>
                
                {/* UI Replica: Revenue Command Center */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm p-6 max-w-4xl">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6"><BarChart3 size={18} className="text-indigo-600"/> Revenue Command Center</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Wallet size={14} className="text-indigo-500"/> Order Collections</div>
                      <div className="text-3xl font-black text-slate-900">$ 124,500.00</div>
                    </div>
                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><BarChart3 size={14} className="text-emerald-500"/> Net Revenue</div>
                      <div className="text-3xl font-black text-emerald-600">$ 98,200.00</div>
                    </div>
                    <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Building2 size={14} className="text-orange-500"/> Tax Liability</div>
                      <div className="text-3xl font-black text-orange-600">$ 14,730.00</div>
                    </div>
                  </div>
                  <div className="h-48 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-slate-400 text-sm font-medium">
                    <BarChart3 size={32} className="mb-2 opacity-50" />
                    📊 Revenue Chart / Graph Visualization Area
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Gate Staff Operations Walkthrough */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <Truck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">5. Gate Staff Operations Walkthrough</h2>
            </div>
            <p className="text-slate-600 mb-6">The narrator logs in as Gate Staff to demonstrate market entry and exit procedures.</p>
            
            <div className="space-y-8 ml-4 border-l-2 border-slate-100 pl-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1: Generate Access Token (Registered Supplier)</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Action:</strong> Navigate to the Gate Terminal.</li>
                  <li><strong>Action:</strong> Enter the Supplier's Email or ID code (e.g., # azwafahadsan@gmail.com).</li>
                  <li><strong>Action:</strong> Enter the Vehicle Plate and Vehicle Type.</li>
                  <li><strong>Action:</strong> Click Generate Access Token.</li>
                  <li><strong>Result:</strong> A token is generated and displayed (e.g., KAB-9EA070).</li>
                </ul>
                
                {/* UI Replica: Gate Terminal - Entry */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-w-md shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold flex items-center gap-2 text-slate-800">
                    <ShieldCheck size={18} className="text-indigo-600" /> Gate Terminal - Entry Management
                  </div>
                  <div className="flex border-b border-slate-100 bg-white">
                    <div className="flex-1 text-center py-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600">Registered Supplier</div>
                    <div className="flex-1 text-center py-3 text-sm font-bold text-slate-500 hover:text-slate-700 cursor-pointer">Guest Supplier</div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Supplier Email/ID</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="azwafahadsan@gmail.com" /></div>
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Vehicle Plate</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="UAB 123C" /></div>
                    <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Vehicle Type</label><select disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"><option>Light Truck</option></select></div>
                    <button disabled className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 opacity-90">🎫 Generate Access Token</button>
                    <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold text-center border border-emerald-100">
                      ✅ Token Generated: KAB-9EA070
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 2: Generate Access Token (Guest Supplier)</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Action:</strong> Switch to the Guest tab.</li>
                  <li><strong>Action:</strong> Enter the Guest's Full Name and ID Number.</li>
                  <li><strong>Action:</strong> Enter Vehicle details and click Generate Access Token.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 3: Record Sales & Exit</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Action:</strong> Enter the generated token code into the Search bar.</li>
                  <li><strong>Action:</strong> Click Record Sales.</li>
                  <li><strong>Action:</strong> Select the good type (e.g., Clothes or Vegetables) and enter the Total Sale Value (e.g., $100 or $300).</li>
                  <li><strong>Action:</strong> Click Submit Dispatch Record.</li>
                  <li><strong>Action:</strong> Click Finalize Exit to log the supplier's departure from the market.</li>
                </ul>
                
                {/* UI Replica: Gate Terminal - Exit */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white max-w-md shadow-sm">
                  <div className="bg-slate-50 border-b border-slate-100 p-4 font-bold flex items-center gap-2 text-slate-800">
                    <LogOut size={18} className="text-orange-600" /> Gate Terminal - Exit Management
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-slate-400"/><input disabled className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="KAB-9EA070" /></div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                      <div className="flex justify-between mb-1"><span className="text-slate-500">Supplier:</span> <span className="font-bold text-slate-900">Azwad Fahad</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Vehicle:</span> <span className="font-bold text-slate-900">UAB 123C</span></div>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                      <div className="font-bold text-sm flex items-center gap-2 text-slate-800"><FileText size={16} className="text-indigo-600"/> Record Sales</div>
                      <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Good Type</label><select disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700"><option>Vegetables</option></select></div>
                      <div><label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Total Sale Value</label><input disabled className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700" value="$ 300.00" /></div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button disabled className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2">📤 Submit Dispatch</button>
                      <button disabled className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">🛑 Finalize Exit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Supplier Dashboard Walkthrough */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <Package size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">6. Supplier Dashboard Walkthrough</h2>
            </div>
            <p className="text-slate-600 mb-6">Suppliers use this view to manage their operations and warehouse.</p>
            
            <div className="space-y-8 ml-4 border-l-2 border-slate-100 pl-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Step 1: Dashboard Overview</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 mb-6">
                  <li><strong>Observation:</strong> The dashboard provides navigation to find other suppliers, manage warehouse inventory, and view incoming orders.</li>
                  <li><strong>Note:</strong> The "Bidding Room" feature is marked as pending development.</li>
                </ul>
                
                {/* UI Replica: Supplier Dashboard */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex h-[360px] max-w-4xl">
                  <div className="w-56 bg-slate-900 text-slate-300 p-4 flex flex-col gap-2 text-sm shrink-0">
                    <div className="flex items-center gap-2 text-white font-bold mb-6"><Menu size={16}/> Supplier Menu</div>
                    <div className="flex items-center gap-3 py-2 text-white bg-indigo-600/20 rounded-lg px-3 -mx-3 font-medium"><LayoutDashboard size={16} className="text-indigo-400"/> Dashboard</div>
                    <div className="flex items-center gap-3 py-2"><Search size={16}/> Find Suppliers</div>
                    <div className="flex items-center gap-3 py-2"><Package size={16}/> Warehouse</div>
                    <div className="flex items-center gap-3 py-2"><Inbox size={16}/> Orders</div>
                    <div className="flex items-center gap-3 py-2 opacity-50"><Gavel size={16}/> Bidding Room</div>
                  </div>
                  <div className="flex-1 p-8 bg-slate-50 flex flex-col gap-6 overflow-hidden">
                    <h3 className="text-xl font-bold text-slate-900">Welcome back, Azwad!</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-800"><Package size={16} className="text-indigo-600"/> Warehouse Inventory</div>
                        <div className="text-sm text-slate-500 mb-1">Total Items: <span className="font-bold text-slate-900 text-lg ml-1">1,204</span></div>
                        <div className="text-sm text-slate-500">Low Stock Alerts: <span className="font-bold text-orange-600 text-lg ml-1">2</span></div>
                      </div>
                      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="font-bold text-sm mb-4 flex items-center gap-2 text-slate-800"><Inbox size={16} className="text-indigo-600"/> Incoming Orders</div>
                        <div className="text-sm text-slate-500 mb-1">Pending: <span className="font-bold text-slate-900 text-lg ml-1">5</span></div>
                        <div className="text-sm text-slate-500">Processing: <span className="font-bold text-slate-900 text-lg ml-1">12</span></div>
                      </div>
                    </div>
                    <div className="relative mt-auto">
                      <Search size={18} className="absolute left-4 top-3.5 text-slate-400"/>
                      <input disabled className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-sm font-medium shadow-sm" placeholder="Search by name or category..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
