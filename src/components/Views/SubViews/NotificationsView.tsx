import React, { useEffect } from 'react';
import { ArrowLeft, Bell, Check, CheckCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationsRead, goBack, language } = useApp();

  useEffect(() => {
    markNotificationsRead();
  }, []);

  return (
    <div className="space-y-4 pb-28">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-black text-white">
              {language === 'bn' ? 'নোটিফিকেশন সেন্টার' : 'Notifications Center'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'ক্যাশআউট ও বোনাস বার্তা' : 'Updates on cashouts & bonus rewards'}
            </p>
          </div>
        </div>

        <button
          onClick={markNotificationsRead}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1"
        >
          <CheckCheck className="w-4 h-4" />
          <span>{language === 'bn' ? 'সব পঠিত' : 'Read All'}</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl border ${
                notif.read ? 'border-slate-800 bg-slate-900/60' : 'border-emerald-500/40 bg-slate-900 glow-emerald'
              } space-y-1`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{notif.title}</span>
                </h3>
                <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 pl-5">{notif.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
