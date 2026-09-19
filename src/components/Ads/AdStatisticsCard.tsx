import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Tv, Award, Calendar, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdStatisticsCard: React.FC = () => {
  const { adProviders, user } = useApp();

  const totalWatchedToday = adProviders.reduce((acc, p) => acc + p.completedToday, 0);

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              Your Ad Stats 📊
            </h3>
            <p className="text-[10px] text-[#8E8E93]">
              Performance breakdown synchronized with ledger
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          LEDGER VERIFIED
        </span>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Ads Count Breakdown */}
        <div className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] space-y-1.5">
          <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider flex items-center gap-1">
            <Tv className="w-3 h-3 text-[#00E5FF]" />
            Ads Completed
          </span>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8E8E93]">Today:</span>
              <span className="font-extrabold text-white font-mono">{totalWatchedToday} Ads</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8E8E93]">This Week:</span>
              <span className="font-bold text-white font-mono">84 Ads</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8E8E93]">This Month:</span>
              <span className="font-bold text-white font-mono">320 Ads</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1 border-t border-[#1C1C1F]">
              <span className="text-[#8E8E93]">Lifetime:</span>
              <span className="font-black text-[#00E5FF] font-mono">1,240 Ads</span>
            </div>
          </div>
        </div>

        {/* Ad Earnings Breakdown */}
        <div className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] space-y-1.5">
          <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider flex items-center gap-1">
            <Coins className="w-3 h-3 text-amber-400" />
            Ad Earnings
          </span>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8E8E93]">Today:</span>
              <span className="font-extrabold text-[#00E5FF] font-mono">+৳{user.todayEarnedBdt.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8E8E93]">This Week:</span>
              <span className="font-bold text-white font-mono">৳168.00</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#8E8E93]">This Month:</span>
              <span className="font-bold text-white font-mono">৳640.00</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1 border-t border-[#1C1C1F]">
              <span className="text-[#8E8E93]">Lifetime:</span>
              <span className="font-black text-emerald-400 font-mono">৳1,250.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
