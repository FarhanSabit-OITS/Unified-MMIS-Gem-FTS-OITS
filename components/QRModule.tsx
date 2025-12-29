import React, { useState } from 'react';
import { 
  QrCode, Ticket, FileText, Download, Printer, Plus, 
  Search, X, Camera, CheckCircle2, History, AlertTriangle,
  Clock, ShieldCheck, User, Zap, Mail, Smartphone, Warehouse,
  ShoppingBag, ClipboardList, Package, Scan
} from 'lucide-react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface Token {
  id: string;
  type: 'ENTRY' | 'RECEIPT' | 'PRODUCT' | 'VENDOR_STORE' | 'SUPPLY_MANIFEST' | 'REQUISITION';
  owner: string;
  issued: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  code: string;
}

export const QRModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TOKENS' | 'SCANNER'>('TOKENS');
  const [search, setSearch] = useState('');
  
  const [tokens] = useState<Token[]>([
    { id: 'T-1001', type: 'ENTRY', owner: 'John Doe (Supplier)', issued: '2024-05-18 08:30', status: 'ACTIVE', code: 'MMIS-ENT-8821' },
    { id: 'T-1002', type: 'VENDOR_STORE', owner: 'Mukasa James', issued: '2023-12-10 14:22', status: 'ACTIVE', code: 'MMIS-VND-4452' },
    { id: 'T-1005', type: 'SUPPLY_MANIFEST', owner: 'GreenMart Logistics', issued: '2024-05-18 11:05', status: 'ACTIVE', code: 'MMIS-MAN-9912' },
    { id: 'T-1006', type: 'REQUISITION', owner: 'Fresh Foods Ltd', issued: '2024-05-18 10:45', status: 'ACTIVE', code: 'MMIS-REQ-1001' },
  ]);

  const typeIcons: Record<string, React.ReactNode> = {
    ENTRY: <Ticket size={24} />,
    RECEIPT: <FileText size={24} />,
    PRODUCT: <Package size={24} />,
    VENDOR_STORE: <Warehouse size={24} />,
    SUPPLY_MANIFEST: <ClipboardList size={24} />,
    REQUISITION: <ShoppingBag size={24} />
  };

  const filteredTokens = tokens.filter(t => 
    t.owner.toLowerCase().includes(search.toLowerCase()) || 
    t.code.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-slate-100">
             <QrCode size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">QR Ecosystem Ledger</h2>
              <p className="text-slate-500 font-medium text-lg">Centralized triangulation for digital trade tokens.</p>
           </div>
        </div>
        <div className="flex gap-3">
           <Button variant="secondary" onClick={() => setActiveTab('SCANNER')} className="h-12 px-6 font-black uppercase text-[10px] tracking-widest shadow-sm">
              <Camera size={18}/> Optical Sync
           </Button>
           <Button className="shadow-2xl shadow-indigo-200 h-12 px-8 font-black uppercase tracking-widest text-xs">
              <Plus size={18} /> New Token
           </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100/50 p-2 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        <button onClick={() => setActiveTab('TOKENS')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TOKENS' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-white'}`}>Active Tokens</button>
        <button onClick={() => setActiveTab('SCANNER')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SCANNER' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-white'}`}>Triage Scanner</button>
      </div>

      {activeTab === 'TOKENS' ? (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                 <Input icon={Search} placeholder="Search ledger by token ID or type..." value={search} onChange={(e:any)=>setSearch(e.target.value)} />
              </div>
              <select className="bg-black text-white border-2 border-slate-800 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest outline-none shadow-lg">
                 <option value="ALL">Classification: All</option>
                 <option value="ENTRY">Entry Manifests</option>
                 <option value="VENDOR_STORE">Vendor Profiles</option>
                 <option value="SUPPLY_MANIFEST">Logistics Manifests</option>
                 <option value="REQUISITION">Demand Tokens</option>
              </select>
              <Button variant="secondary" className="font-black text-[10px] uppercase tracking-widest h-12"><Printer size={16}/> Daily Sync</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map(token => (
                <Card key={token.id} className="group relative overflow-hidden rounded-[32px] border-none shadow-xl hover:shadow-2xl transition-all p-8 border-l-8 border-l-indigo-600 bg-white">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                     <QrCode size={120} className="text-slate-800" />
                  </div>
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${token.status === 'ACTIVE' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                       {typeIcons[token.type] || <QrCode size={24}/>}
                     </div>
                     <div>
                       <h4 className="font-black text-slate-900 tracking-tight text-lg">{token.type.replace('_', ' ')}</h4>
                       <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">{token.id}</p>
                     </div>
                  </div>
                  <div className="space-y-3 mb-8 border-y border-slate-50 py-6 relative z-10">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">Node Operator:</span>
                       <span className="text-slate-800 truncate max-w-[140px] text-right">{token.owner}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">Integrity:</span>
                       <span className={token.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}>{token.status}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">Issued Node:</span>
                       <span className="text-slate-800">{token.issued.split(' ')[0]}</span>
                     </div>
                  </div>
                  <div className="bg-slate-900 text-white p-4 rounded-2xl mb-6 flex items-center justify-between group-hover:bg-indigo-600 transition-colors shadow-xl">
                     <span className="font-mono text-xs font-black tracking-widest">{token.code}</span>
                     <Zap size={16} className="text-indigo-400" />
                  </div>
                  <div className="flex gap-3 relative z-10">
                    <Button variant="secondary" className="flex-1 text-[10px] font-black uppercase py-2 h-10 border-slate-200"><Download size={14} /> PDF</Button>
                    <Button variant="outline" className="flex-1 text-[10px] font-black uppercase py-2 h-10 border-2"><Printer size={14} /> PRINT</Button>
                  </div>
                </Card>
              ))}
           </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8 py-10 animate-in fade-in slide-in-from-bottom-4">
           <Card className="rounded-[48px] shadow-2xl border-none p-12 text-center bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                    <Scan size={48} className="text-indigo-400 animate-pulse" />
                 </div>
                 <h3 className="text-3xl font-black tracking-tight mb-4 uppercase">Sync Node Active</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 max-w-sm mx-auto">Optical triangulation for entry, supply, and requisition validation. High frequency nodes prioritized automatically.</p>
                 <div className="aspect-video bg-black rounded-[32px] mb-10 border-4 border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-56 h-56 border-2 border-indigo-500/40 rounded-3xl animate-ping opacity-20"></div>
                       <div className="w-48 h-48 border-2 border-indigo-500/60 rounded-3xl absolute animate-pulse"></div>
                       <div className="w-2 h-full bg-indigo-500/30 absolute shadow-[0_0_20px_rgba(79,70,229,0.5)] animate-scan-y"></div>
                    </div>
                 </div>
                 <Button className="w-full py-5 font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-900/40 bg-indigo-600 border-none rounded-2xl">Calibrate Scanner</Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};