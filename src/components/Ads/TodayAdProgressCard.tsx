import React from 'react';
import { motion } from 'motion/react';
import { Clock, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TodayAdProgressCard: React.FC = () => {
  const { adProviders, language } = useApp();

  const totalWatched = adProviders.reduce((acc, p) => acc + p.completedToday, 0);
  const totalDailyLimit = adProviders.reduce((acc, p) => acc + p.dailyLimit, 0);
  const remainingAds = Math.max(0, totalDailyLimit - totalWatched);
  const progressPercent = Math.min(100, Math.round((totalWatched / totalDailyLimit) * 100));

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00E5FF15] text-[#00E5FF] border border-[#00E5FF20]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              {language === 'bn' ? 'আজকের অগ্রগতির ট্র্যাকার' : "Today's Ad Progress"}
            </h3>
            <p className="text-[10px] text-[#8E8E93]">
              Daily server limits reset at 12:00 AM UTC
            </p>
          </div>
        </div>

        <span className="text-xs font-black text-[#00E5FF] font-mono bg-[#00E5FF10] px-2.5 py-1 rounded-xl border border-[#00E5FF20]">
          {totalWatched} / {totalDailyLimit} Ads
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[#111113] h-3 rounded-full overflow-hidden p-0.5 border border-[#1C1C1F]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#00E5FF] to-teal-400 rounded-full shadow-[0_0_12px_#00E5FF]"
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] pt-0.5">
        <div className="flex items-center gap-1.5 text-[#8E8E93]">
          {remainingAds > 0 ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {remainingAds} {language === 'bn' ? 'টি বিজ্ঞাপন বাকি আছে' : 'ads remaining today'}
            </span>
          ) : (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {language === 'bn' ? 'আজকের সব বিজ্ঞাপন দেখা শেষ!' : "All today's ads completed!"}
            </span>
          )}
        </div>

        <span className="font-mono text-[#8E8E93] text-[10px] font-semibold">
          {progressPercent}% Goal
        </span>
      </div>
    </div>
  );
};
