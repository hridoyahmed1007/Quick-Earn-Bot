import React from 'react';
import { Crown, Zap, ShieldCheck, Users, CheckCircle2, Coins, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReferralHeroCard: React.FC = () => {
  const { user } = useApp();

  const earnings = user.referralEarningsBdt ?? 1250;
  const totalRefs = user.totalReferrals || 18;
  const qualifiedRefs = user.activeReferrals || 15;
  const MIN_REQUIRED_REFS = 15;
  const isWithdrawQualified = totalRefs >= MIN_REQUIRED_REFS;

  return (
    <div 
      id="referral-hero-card"
      className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl relative overflow-hidden space-y-3.5"
    >
      {/* Background Subtle Ambient Cyan Glow */}
      <div className="absolute -top-10 right-0 w-44 h-44 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between relative z-10 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#8E8E93] block truncate">
              PARTNER PROGRAM
            </span>
            <h1 className="text-sm font-extrabold text-white leading-tight truncate">
              REFER & EARN
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[9px] font-bold flex items-center gap-1 font-mono whitespace-nowrap shrink-0">
            <Zap className="w-2.5 h-2.5 shrink-0" />
            10% Commission
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
            <Crown className="w-2.5 h-2.5 shrink-0" />
            VIP Level 2
          </span>
        </div>
      </div>

      {/* Main Earning Display Focus */}
      <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] relative z-10 shadow-inner flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-extrabold text-[#8E8E93] uppercase tracking-wider block truncate">
            রেফারেল মোট ইনকাম (APPROVED EARNINGS)
          </span>
          <div className="text-2xl font-black text-[#00E5FF] font-mono tracking-tight flex items-baseline gap-1 mt-0.5">
            <span>৳{earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs text-[#00E5FF]/70 font-sans font-bold">BDT</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[9px] font-bold text-[#8E8E93] block mb-0.5">উইথড্র এলিজিবিলিটি</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border whitespace-nowrap ${
            isWithdrawQualified 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          }`}>
            {isWithdrawQualified ? '১৫/১৫ পূর্ণ (ELIGIBLE ✓)' : `${totalRefs}/${MIN_REQUIRED_REFS} বাকি`}
          </span>
        </div>
      </div>

      {/* 3-Column Compact Metric Row */}
      <div className="grid grid-cols-3 gap-2 relative z-10">
        <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] text-center">
          <span className="text-[8px] font-bold text-[#8E8E93] uppercase block truncate">
            মোট রেফারেল
          </span>
          <span className="text-xs font-black text-white font-mono block mt-0.5">
            {totalRefs} জন
          </span>
          <span className="text-[7px] text-[#00E5FF] block mt-0.5 truncate">Total Network</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] text-center">
          <span className="text-[8px] font-bold text-[#8E8E93] uppercase block truncate">
            সক্রিয় মেম্বার
          </span>
          <span className="text-xs font-black text-emerald-400 font-mono block mt-0.5">
            {qualifiedRefs} জন
          </span>
          <span className="text-[7px] text-emerald-400/80 block mt-0.5 truncate">Active & Verified</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] text-center">
          <span className="text-[8px] font-bold text-[#8E8E93] uppercase block truncate">
            কমিশন রেট
          </span>
          <span className="text-xs font-black text-purple-400 font-mono block mt-0.5">
            ১০%
          </span>
          <span className="text-[7px] text-purple-400/80 block mt-0.5 truncate">Lifetime Passive</span>
        </div>
      </div>
    </div>
  );
};
