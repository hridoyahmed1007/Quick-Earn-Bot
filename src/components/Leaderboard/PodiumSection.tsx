import React from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { useApp } from '../../context/AppContext';

interface PodiumSectionProps {
  top3: LeaderboardEntry[];
}

export const PodiumSection: React.FC<PodiumSectionProps> = ({ top3 }) => {
  const { language } = useApp();

  if (!top3 || top3.length < 3) return null;

  const getTrendBadge = (entry: LeaderboardEntry) => {
    if (entry.trend === 'up') {
      return (
        <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" />
          +{entry.trendChange || 1}
        </span>
      );
    }
    if (entry.trend === 'down') {
      return (
        <span className="text-[9px] font-extrabold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-0.5">
          <TrendingDown className="w-3 h-3" />
          -{entry.trendChange || 1}
        </span>
      );
    }
    return (
      <span className="text-[9px] font-bold text-[#8E8E93] bg-[#232326] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
        <Minus className="w-2.5 h-2.5" />
      </span>
    );
  };

  return (
    <div className="pt-2 pb-1">
      <div className="grid grid-cols-3 gap-2 items-end max-w-md mx-auto">
        {/* 2nd Place Podium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col items-center bg-[#131316] border border-[#232326] rounded-2xl p-3 shadow-lg relative"
        >
          <div className="relative mb-2">
            <img
              src={top3[1].avatar}
              alt={top3[1].username}
              className="w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-slate-400 shadow-md"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-400 text-slate-950 text-[10px] font-extrabold shadow-md">
              🥈 #2
            </span>
          </div>

          <p className="text-xs font-bold text-white truncate max-w-[90px] text-center mt-1">
            {top3[1].username}
          </p>
          <p className="text-xs font-extrabold text-[#00E5FF] mt-0.5">
            ৳{top3[1].amountBdt.toFixed(2)}
          </p>
          <div className="mt-1.5">{getTrendBadge(top3[1])}</div>
        </motion.div>

        {/* 1st Place Champion Podium */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center bg-gradient-to-b from-[#00E5FF15] to-[#121215] border-2 border-[#00E5FF] rounded-2xl p-3.5 shadow-2xl relative glow-cyan -mt-4 z-10"
        >
          <div className="relative mb-2">
            <Crown className="w-6 h-6 text-[#00E5FF] absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce" />
            <img
              src={top3[0].avatar}
              alt={top3[0].username}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-[#00E5FF] shadow-2xl"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#00E5FF] text-[#0A0A0B] text-xs font-black shadow-lg flex items-center gap-1 whitespace-nowrap">
              🥇 #1 👑
            </span>
          </div>

          <p className="text-xs font-black text-white truncate max-w-[100px] text-center mt-1">
            {top3[0].username}
          </p>
          <p className="text-sm font-black text-[#00E5FF] mt-0.5">
            ৳{top3[0].amountBdt.toFixed(2)}
          </p>
          <div className="mt-1.5">{getTrendBadge(top3[0])}</div>
        </motion.div>

        {/* 3rd Place Podium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col items-center bg-[#131316] border border-[#232326] rounded-2xl p-3 shadow-lg relative"
        >
          <div className="relative mb-2">
            <img
              src={top3[2].avatar}
              alt={top3[2].username}
              className="w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-amber-600 shadow-md"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold shadow-md">
              🥉 #3
            </span>
          </div>

          <p className="text-xs font-bold text-white truncate max-w-[90px] text-center mt-1">
            {top3[2].username}
          </p>
          <p className="text-xs font-extrabold text-[#00E5FF] mt-0.5">
            ৳{top3[2].amountBdt.toFixed(2)}
          </p>
          <div className="mt-1.5">{getTrendBadge(top3[2])}</div>
        </motion.div>
      </div>
    </div>
  );
};
