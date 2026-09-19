import React from 'react';
import { motion } from 'motion/react';
import { Tv, Play, ChevronRight, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdsPreviewSection: React.FC = () => {
  const { adProviders, openAdPlayer, navigateTo, language } = useApp();

  const totalAdsCompleted = adProviders.reduce((acc, p) => acc + p.completedToday, 0);
  const totalDailyLimit = adProviders.reduce((acc, p) => acc + p.dailyLimit, 0);
  const totalEarnedTodayFromAds = adProviders.reduce((acc, p) => acc + (p.completedToday * p.rewardBdt), 0);
  const adProgressPercent = Math.min(100, Math.round((totalAdsCompleted / totalDailyLimit) * 100));

  return (
    <div className="space-y-3">
      {/* Section Title Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            Watch & Earn 🎬
          </h3>
          <p className="text-[10px] text-[#8E8E93]">
            Available advertisements today
          </p>
        </div>

        <button
          onClick={() => navigateTo('ads')}
          className="text-[10px] font-bold text-[#00E5FF] hover:underline flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ads Daily Progress Bar Indicator */}
      <div className="p-3 rounded-xl bg-[#161618] border border-[#232326] space-y-1.5 shadow-sm">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#8E8E93] font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#00E5FF]" />
            Today's Ads Progress
          </span>
          <span className="font-bold text-[#00E5FF] font-mono">
            {totalAdsCompleted} / {totalDailyLimit} Ads Completed
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 rounded-full bg-[#222224] overflow-hidden">
          <div
            className="h-full bg-[#00E5FF] transition-all duration-500"
            style={{ width: `${adProgressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] text-[#8E8E93] pt-0.5">
          <span>{adProgressPercent}% Daily Goal</span>
          <span className="font-bold text-emerald-400">৳{totalEarnedTodayFromAds.toFixed(2)} earned today</span>
        </div>
      </div>

      {/* Provider Cards List */}
      <div className="space-y-2">
        {adProviders.map((provider) => {
          const availableCount = Math.max(0, provider.dailyLimit - provider.completedToday);
          const isLimitReached = availableCount === 0;

          return (
            <div
              key={provider.id}
              className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] flex items-center justify-between gap-3 hover:border-[#2A2A2E] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF10] text-[#00E5FF] border border-[#00E5FF20] flex items-center justify-center shrink-0">
                  <Tv className="w-5 h-5" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {provider.name}
                  </h4>
                  <p className="text-[10px] text-[#8E8E93] mt-0.5">
                    Reward: <span className="font-bold text-[#00E5FF]">৳{provider.rewardBdt.toFixed(2)}</span> • Available: <span className="font-mono text-white">{availableCount} Ads</span>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                disabled={isLimitReached}
                onClick={() => openAdPlayer(provider)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all shrink-0 ${
                  isLimitReached
                    ? 'bg-[#222224] text-[#636366] cursor-not-allowed border border-[#2A2A2E]'
                    : 'bg-[#00E5FF] hover:bg-[#70F3FF] text-[#0A0A0B] shadow-md glow-cyan'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isLimitReached ? 'LIMIT' : 'WATCH'}</span>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
