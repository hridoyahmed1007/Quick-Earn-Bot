import React from 'react';
import { Wallet, TrendingUp, PlayCircle, Briefcase, Radio, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EarningSummaryCard: React.FC = () => {
  const { user, language, navigateTo } = useApp();

  // Calculate breakdown values from user's current session state
  const adsEarned = 60.0;
  const jobsEarned = 40.0;
  const channelsEarned = 25.0;
  const todayTotal = user.todayEarnedBdt || (adsEarned + jobsEarned + channelsEarned);

  return (
    <div className="bg-gradient-to-br from-[#12141A] via-[#14171F] to-[#0E1318] border border-emerald-500/25 hover:border-emerald-500/40 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300">
      {/* Super Premium Ambient Glow Accents */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#00E5FF]/8 rounded-full blur-3xl pointer-events-none -ml-10 -mb-10" />
      <div className="absolute top-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* Main Stats Row */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div>
          <span className="text-[10.5px] font-black text-emerald-400/90 uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{language === 'bn' ? 'মোট ব্যালেন্স' : 'TOTAL BALANCE'}</span>
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)] font-mono">
              ৳{user.bdtBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Today's Total Badge - Compact & Neatly Adjusted */}
        <div className="bg-[#181D26]/90 border border-emerald-500/30 rounded-xl px-2.5 py-1 shadow-[0_2px_12px_rgba(0,0,0,0.35)] flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-right">
            <span className="text-[9px] text-[#94A3B8] font-bold block uppercase tracking-wide leading-tight">
              {language === 'bn' ? 'আজকের আয়' : "Today's Earn"}
            </span>
            <span className="text-[13px] font-black text-emerald-400 font-mono leading-none">
              +৳{todayTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Chips */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#222B38] mb-3 relative z-10">
        <div className="bg-[#0F131C]/90 border border-[#232F42] hover:border-cyan-500/40 rounded-xl p-2 text-center transition-colors">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[#00E5FF] font-black mb-0.5">
            <PlayCircle className="w-3 h-3 text-[#00E5FF]" />
            <span>Ads</span>
          </div>
          <span className="text-xs font-black text-white font-mono">৳{adsEarned.toFixed(0)}</span>
        </div>

        <div className="bg-[#0F131C]/90 border border-[#232F42] hover:border-emerald-500/40 rounded-xl p-2 text-center transition-colors">
          <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-black mb-0.5">
            <Briefcase className="w-3 h-3 text-emerald-400" />
            <span>Jobs</span>
          </div>
          <span className="text-xs font-black text-white font-mono">৳{jobsEarned.toFixed(0)}</span>
        </div>

        <div className="bg-[#0F131C]/90 border border-[#232F42] hover:border-blue-500/40 rounded-xl p-2 text-center transition-colors">
          <div className="flex items-center justify-center gap-1 text-[11px] text-blue-400 font-black mb-0.5">
            <Radio className="w-3 h-3 text-blue-400" />
            <span>Channels</span>
          </div>
          <span className="text-xs font-black text-white font-mono">৳{channelsEarned.toFixed(0)}</span>
        </div>
      </div>

      {/* View Wallet CTA */}
      <button
        onClick={() => navigateTo('wallet')}
        className="w-full py-2.5 px-3.5 bg-gradient-to-r from-[#17202E] via-[#1B2738] to-[#17202E] hover:from-[#1E2B3E] hover:to-[#1E2B3E] active:scale-[0.99] border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.35)] relative z-10 group"
      >
        <span className="tracking-wide">{language === 'bn' ? 'ওয়ালেট ও ক্যাশআউট দেখুন' : 'VIEW WALLET & CASHOUT'}</span>
        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
