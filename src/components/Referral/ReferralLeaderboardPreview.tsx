import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Crown, ArrowRight, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_LEADERBOARD } from '../../data/mockData';

export const ReferralLeaderboardPreview: React.FC = () => {
  const { navigateTo, user } = useApp();
  const topThree = MOCK_LEADERBOARD.weekly.referral.slice(0, 3);

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Top Referrers Leaderboard</h3>
            <p className="text-[10px] text-[#8E8E93]">Weekly top promoters reward race</p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigateTo('leaderboard')}
          className="text-xs font-bold text-[#00E5FF] hover:underline flex items-center gap-1"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-3 gap-2 py-1">
        {topThree.map((item, idx) => (
          <div
            key={item.username}
            className="p-2.5 rounded-2xl bg-[#111113] border border-[#1C1C1F] text-center space-y-1 relative"
          >
            <div className="relative w-10 h-10 mx-auto">
              <img
                src={item.avatar}
                alt={item.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500/30"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                #{item.rank}
              </span>
            </div>

            <div className="pt-0.5">
              <span className="text-[11px] font-bold text-white block truncate">
                {item.username}
              </span>
              <span className="text-[10px] font-mono font-extrabold text-[#00E5FF] block">
                {item.referralCount} Refs
              </span>
              <span className="text-[9px] font-mono text-amber-400 block mt-0.5">
                ৳{item.amountBdt.toFixed(0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* User's Own Rank Banner */}
      <div className="p-2.5 rounded-xl bg-[#111113] border border-[#1C1C1F] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#00E5FF15] text-[#00E5FF] font-black text-xs flex items-center justify-center border border-[#00E5FF20]">
            #27
          </div>
          <div>
            <span className="font-bold text-white block">Your Current Rank</span>
            <span className="text-[10px] text-[#8E8E93]">18 Qualified Referrals</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigateTo('leaderboard')}
          className="px-3 py-1.5 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] text-white border border-[#2A2A2E] text-[10px] font-bold"
        >
          Leaderboard
        </motion.button>
      </div>
    </div>
  );
};
