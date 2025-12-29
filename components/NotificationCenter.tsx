import React, { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { Notification } from '../types';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Rent Due Reminder', message: 'Your shop rent for November is due in 3 days.', type: 'WARNING', timestamp: '2h ago', read: false },
    { id: '2', title: 'Payment Received', message: 'Payment of 500,000 UGX confirmed via MTN Momo.', type: 'SUCCESS', timestamp: '5h ago', read: false },
    { id: '3', title: 'System Maintenance', message: 'MMIS will be down for 30 mins tonight at 2 AM.', type: 'INFO', timestamp: '1d ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <Check size={14} className="text-green-600" />;
      case 'WARNING': return <AlertTriangle size={14} className="text-amber-600" />;
      case 'ERROR': return <XCircle size={14} className="text-red-600" />;
      default: return <Info size={14} className="text-blue-600" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
        case 'SUCCESS': return 'bg-green-100';
        case 'WARNING': return 'bg-amber-100';
        case 'ERROR': return 'bg-red-100';
        default: return 'bg-blue-100';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
              <div className="flex gap-2">
                 <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                 <button onClick={clearAll} className="text-xs text-slate-400 hover:text-red-600">Clear</button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                    No new notifications
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 relative group ${!n.read ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${getTypeBg(n.type)}`}>
                        {getTypeIcon(n.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    <button 
                        onClick={(e) => deleteNotification(n.id, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all bg-white shadow-sm rounded-full"
                    >
                        <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
