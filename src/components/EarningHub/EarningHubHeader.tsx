import React from 'react';
import { HelpCircle, History, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EarningHubHeaderProps {
  onOpenInfo: () => void;
  onOpenHistory: () => void;
}

export const EarningHubHeader: React.FC<EarningHubHeaderProps> = ({
  onOpenInfo,
  onOpenHistory,
}) => {
  const { language } = useApp();

  return (
    <div className="flex items-center justify-between bg-emerald-950/40 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Title & Subtext */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold text-white tracking-tight">
              {language === 'bn' ? '💰 আর্নিং হাব' : language === 'en' ? '💰 Earning Hub' : '💰 Earning Hub'}
            </h1>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
              PREMIUM
            </span>
          </div>
          <p className="text-xs text-emerald-300/80">
            {language === 'bn'
              ? 'আপনার পছন্দের আর্নিং অপশন থেকে আয় শুরু করুন'
              : 'Choose your preferred earning module'}
          </p>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex items-center gap-2 relative z-10">
        <button
          onClick={onOpenHistory}
          className="p-2 bg-emerald-900/40 hover:bg-emerald-800/60 active:scale-95 text-emerald-300 hover:text-white rounded-xl border border-emerald-500/30 transition-all flex items-center justify-center shadow-sm"
          title="Earnings Ledger History"
        >
          <History className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenInfo}
          className="p-2 bg-emerald-900/40 hover:bg-emerald-800/60 active:scale-95 text-emerald-300 hover:text-white rounded-xl border border-emerald-500/30 transition-all flex items-center justify-center shadow-sm"
          title="Earning Rules & Verification Info"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
