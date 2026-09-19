import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'warning':
      case 'error':
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -60, opacity: 0, scale: 0.95 }}
        className="fixed top-16 left-0 right-0 z-50 max-w-sm mx-auto px-4 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 shadow-xl shadow-emerald-950/40 glow-emerald">
          <div className="flex items-center gap-2.5">
            {getIcon()}
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">{toast.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.body}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
