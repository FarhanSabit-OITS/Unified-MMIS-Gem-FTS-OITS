import React, { useState } from 'react';
import { MOCK_CCTV, MOCK_POWER, MOCK_STAFF } from '../constants';
import { Activity, Camera, Zap, Users, UserCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const AssetManagementModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CCTV' | 'POWER' | 'STAFF'>('CCTV');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Asset & Staff Management</h2>
          <p className="text-slate-500 text-sm">Monitor facility hardware and operational staff.</p>
        </div>
        
        <div className="bg-slate-100 p-1 rounded-lg flex">
            <button 
                onClick={() => setActiveTab('CCTV')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'CCTV' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
                <Camera size={14} /> CCTV
            </button>
            <button 
                onClick={() => setActiveTab('POWER')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'POWER' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500'}`}
            >
                <Zap size={14} /> Power
            </button>
            <button 
                onClick={() => setActiveTab('STAFF')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'STAFF' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
            >
                <Users size={14} /> Staff Roster
            </button>
        </div>
      </div>

      {activeTab === 'CCTV' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CCTV.map(cam => (
                <div key={cam.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="aspect-video bg-black relative flex items-center justify-center group">
                        {cam.status === 'OFFLINE' ? (
                            <div className="text-center">
                                <AlertTriangle className="text-red-500 mx-auto mb-2" size={32} />
                                <span className="text-red-500 font-mono text-xs">NO SIGNAL</span>
                            </div>
                        ) : (
                            <>
                              <img 
                                src={`https://source.unsplash.com/random/400x225?market,security&sig=${cam.id}`} 
                                alt="Feed" 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                              />
                              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-mono rounded flex items-center gap-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> REC
                              </div>
                            </>
                        )}
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                             <div>
                                <h4 className="font-bold text-slate-800 text-sm">{cam.name}</h4>
                                <p className="text-xs text-slate-500">{cam.location}</p>
                             </div>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                 cam.status === 'ONLINE' ? 'bg-green-100 text-green-700' : 
                                 cam.status === 'RECORDING' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                             }`}>{cam.status}</span>
                        </div>
                        <div className="mt-3 text-[10px] text-slate-400">Last Maintenance: {cam.lastMaintenance}</div>
                    </div>
                </div>
            ))}
            <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition cursor-pointer">
                <Camera size={32} className="mb-2" />
                <span className="text-sm font-bold">Add Camera</span>
            </div>
        </div>
      )}

      {activeTab === 'POWER' && (
          <div className="space-y-4">
              {MOCK_POWER.map(zone => (
                  <div key={zone.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-full ${zone.status === 'STABLE' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                              <Zap size={24} />
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-800 text-lg">{zone.floor}</h4>
                              <p className="text-sm text-slate-500">Zone ID: {zone.id}</p>
                          </div>
                      </div>
                      
                      <div className="flex-1 max-w-xs mx-8">
                          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                              <span>Load Usage</span>
                              <span>{zone.load}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${zone.load > 85 ? 'bg-red-500' : zone.load > 60 ? 'bg-amber-500' : 'bg-green-500'}`} 
                                style={{ width: `${zone.load}%` }}
                              ></div>
                          </div>
                      </div>

                      <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              zone.status === 'STABLE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                              {zone.status}
                          </span>
                          <button className="block text-xs text-blue-600 mt-2 hover:underline">View Consumption Report</button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {activeTab === 'STAFF' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-4">Staff Member</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Shift</th>
                          <th className="px-6 py-4">Contact</th>
                          <th className="px-6 py-4">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {MOCK_STAFF.map(staff => (
                          <tr key={staff.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                      <UserCircle size={20} />
                                  </div>
                                  {staff.name}
                              </td>
                              <td className="px-6 py-4">
                                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{staff.role}</span>
                              </td>
                              <td className="px-6 py-4 text-slate-600">{staff.shift}</td>
                              <td className="px-6 py-4 font-mono text-xs">{staff.phone}</td>
                              <td className="px-6 py-4">
                                  {staff.status === 'ON_DUTY' ? (
                                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle size={12}/> On Duty</span>
                                  ) : (
                                      <span className="flex items-center gap-1 text-slate-400 text-xs font-bold"><XCircle size={12}/> {staff.status.replace('_', ' ')}</span>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
    </div>
  );
};
