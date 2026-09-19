import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReferralEarningsCard: React.FC = () => {
  const { user, language } = useApp();

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-xl space-y-3 relative overflow-hidden">
      {/* Top Title Row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider flex items-center gap-1.5">
          <Wallet className="w-3.5 h-3.5 text-amber-400" />
          {language === 'bn' ? 'রেফারেল আয় সামারি' : 'Referral Earnings Ledger'}
        </span>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          VERIFIED LEDGER
        </span>
      </div>

      {/* Main Big Balance */}
      <div className="flex items-baseline justify-between pt-0.5">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">৳</span>
            <span className="text-3xl font-black text-white tracking-tight font-mono">
              {(user.referralEarningsBdt || 540.0).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-400 ml-1">BDT</span>
          </div>
          <p className="text-[10px] text-[#8E8E93] mt-0.5">
            {language === 'bn' ? 'অনুমোদিত রেফারেল কমিশন ব্যালেন্স' : 'Approved Referral Commission Balance'}
          </p>
        </div>

        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-center">
          <span className="text-[9px] uppercase font-bold block text-amber-400/80">Commission Rate</span>
          <span className="text-xs font-black font-mono">Up to 10%</span>
        </div>
      </div>

      {/* 4-Period Breakdown Grid */}
      <div className="pt-2.5 border-t border-[#232326] grid grid-cols-4 gap-1.5 text-xs text-center">
        <div className="p-2 rounded-xl bg-[#111113] border border-[#1C1C1F]">
          <span className="text-[9px] text-[#8E8E93] uppercase block">Today</span>
          <span className="text-xs font-black text-[#00E5FF] font-mono mt-0.5 block">+৳80.00</span>
        </div>

        <div className="p-2 rounded-xl bg-[#111113] border border-[#1C1C1F]">
          <span className="text-[9px] text-[#8E8E93] uppercase block">This Week</span>
          <span className="text-xs font-bold text-white font-mono mt-0.5 block">+৳220.00</span>
        </div>

        <div className="p-2 rounded-xl bg-[#111113] border border-[#1C1C1F]">
          <span className="text-[9px] text-[#8E8E93] uppercase block">This Month</span>
          <span className="text-xs font-bold text-white font-mono mt-0.5 block">+৳540.00</span>
        </div>

        <div className="p-2 rounded-xl bg-[#111113] border border-[#1C1C1F]">
          <span className="text-[9px] text-[#8E8E93] uppercase block">Lifetime</span>
          <span className="text-xs font-black text-amber-400 font-mono mt-0.5 block">৳2,450.00</span>
        </div>
      </div>
    </div>
  );
};
