import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Crown, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaderboardPeriod } from '../../types';
import { getTop100Leaderboard } from '../../data/leaderboardGenerator';

export const LeaderboardPreview: React.FC = () => {
  const { user, navigateTo } = useApp();
  const [period, setPeriod] = useState<LeaderboardPeriod>('today');

  const periods: { id: LeaderboardPeriod; label: string }[] = [
    { id: 'today', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'allTime', label: 'All Time' },
  ];

  // Retrieve top 3 entries for selected period
  const dataset = getTop100Leaderboard(period, {
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    bdtBalance: user.bdtBalance,
    totalReferrals: user.totalReferrals,
    totalAdsWatched: user.completedAds,
  });
  const top3 = dataset.slice(0, 3);

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-lg space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
              🏆 TOP LEADERS
            </h2>
            <p className="text-[10px] text-[#8E8E93]">
              Top verified earners platform-wide
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('leaderboard')}
          className="text-[10px] font-extrabold text-[#00E5FF] hover:underline flex items-center gap-0.5 px-2 py-1 rounded-lg bg-[#00E5FF10] border border-[#00E5FF20]"
        >
          <span>SEE ALL</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Period Selector */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#111113] border border-[#232326] text-[11px]">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`py-1.5 rounded-lg font-bold transition-all text-center ${
              period === p.id
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-sm'
                : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 Users Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={period}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-3 gap-2 text-center pt-1"
        >
          {/* #2 Rank */}
          {top3[1] && (
            <div className="p-2.5 rounded-2xl bg-[#111113] border border-[#232326] flex flex-col items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-[#8E8E93] text-black text-[9px] font-extrabold mb-1.5 inline-block">
                  🥈 #2
                </span>
                <img
                  src={top3[1].avatar}
                  alt={top3[1].username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8E8E93] mx-auto mb-1"
                />
                <p className="text-[10px] font-bold text-white truncate max-w-[75px] mx-auto">
                  @{top3[1].username}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-[#1C1C1F] w-full space-y-0.5 text-[9px] text-[#8E8E93]">
                <p className="font-extrabold text-[#00E5FF] text-[10px]">
                  ৳{(top3[1].amountBdt || 0).toLocaleString()}
                </p>
                <p>Refs: {top3[1].referralCount || 0}</p>
                <p>Ads: {top3[1].adsWatched || 0}</p>
              </div>
            </div>
          )}

          {/* #1 Champion Rank */}
          {top3[0] && (
            <div className="p-2.5 rounded-2xl bg-[#111113] border border-[#00E5FF40] flex flex-col items-center justify-between relative shadow-lg shadow-[#00E5FF10]">
              <Crown className="w-4 h-4 text-amber-400 absolute -top-2" />
              <div>
                <span className="px-2 py-0.5 rounded-full bg-[#00E5FF] text-[#0A0A0B] text-[9px] font-extrabold mb-1.5 inline-block mt-0.5">
                  🥇 #1
                </span>
                <img
                  src={top3[0].avatar}
                  alt={top3[0].username}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#00E5FF] mx-auto mb-1"
                />
                <p className="text-[10px] font-extrabold text-white truncate max-w-[75px] mx-auto">
                  @{top3[0].username}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-[#1C1C1F] w-full space-y-0.5 text-[9px] text-[#8E8E93]">
                <p className="font-black text-[#00E5FF] text-xs">
                  ৳{(top3[0].amountBdt || 0).toLocaleString()}
                </p>
                <p>Refs: {top3[0].referralCount || 0}</p>
                <p>Ads: {top3[0].adsWatched || 0}</p>
              </div>
            </div>
          )}

          {/* #3 Rank */}
          {top3[2] && (
            <div className="p-2.5 rounded-2xl bg-[#111113] border border-[#232326] flex flex-col items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-extrabold mb-1.5 inline-block">
                  🥉 #3
                </span>
                <img
                  src={top3[2].avatar}
                  alt={top3[2].username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-600 mx-auto mb-1"
                />
                <p className="text-[10px] font-bold text-white truncate max-w-[75px] mx-auto">
                  @{top3[2].username}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-[#1C1C1F] w-full space-y-0.5 text-[9px] text-[#8E8E93]">
                <p className="font-extrabold text-[#00E5FF] text-[10px]">
                  ৳{(top3[2].amountBdt || 0).toLocaleString()}
                </p>
                <p>Refs: {top3[2].referralCount || 0}</p>
                <p>Ads: {top3[2].adsWatched || 0}</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* See All Leaderboard Action */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => navigateTo('leaderboard')}
        className="w-full py-2.5 rounded-xl bg-[#1F1F22] hover:bg-[#2A2A2E] text-white font-bold text-xs border border-[#2A2A2E] flex items-center justify-center gap-1.5 transition-all"
      >
        <Trophy className="w-3.5 h-3.5 text-amber-400" />
        <span>SEE ALL LEADERBOARD</span>
      </motion.button>
    </div>
  );
};
