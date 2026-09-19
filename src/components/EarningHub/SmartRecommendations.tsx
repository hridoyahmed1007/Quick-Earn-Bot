import React from 'react';
import { Flame, Zap, Play, Radio, Briefcase, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { EarningTabType } from '../../types';
import { useApp } from '../../context/AppContext';

interface SmartRecommendationsProps {
  onSelectTab: (tab: EarningTabType) => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ onSelectTab }) => {
  const { language, adProviders } = useApp();

  const totalWatched = adProviders.reduce((acc, p) => acc + p.completedToday, 0);
  const totalDailyLimit = adProviders.reduce((acc, p) => acc + p.dailyLimit, 0);
  const remainingAds = Math.max(0, totalDailyLimit - totalWatched);
  const progressPercent = totalDailyLimit > 0 ? Math.min(100, Math.round((totalWatched / totalDailyLimit) * 100)) : 0;

  const isBn = language === 'bn';

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#16171C] via-[#121316] to-[#0F1013] border border-[#232730] hover:border-[#2D3340] p-3.5 shadow-xl overflow-hidden transition-all">
      {/* Top subtle golden/cyan accent reflection */}
      <div className="absolute top-0 right-0 w-36 h-28 bg-gradient-to-bl from-amber-500/10 via-[#00E5FF]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      {/* 1. Header with Badge */}
      <div className="relative z-10 flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <h3 className="text-xs font-black text-white tracking-wider uppercase font-mono">
            {isBn ? 'স্মার্ট আয় রিকমেন্ডেশন' : 'Top Earning Opportunities'}
          </h3>
        </div>
        <span className="text-[9.5px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full border border-[#00E5FF]/25 shadow-sm">
          Fast & Verified
        </span>
      </div>

      {/* 2. Three Opportunity Cards (Adjustable & Ultra Premium) */}
      <div className="relative z-10 grid grid-cols-3 gap-2">
        {/* Rec 1: Channel Task */}
        <button
          onClick={() => onSelectTab('channel_tasks')}
          className="bg-gradient-to-b from-[#181A20] to-[#121317] hover:from-[#1E212A] hover:to-[#16181F] active:scale-[0.97] border border-[#262A35] hover:border-blue-500/40 rounded-xl p-2.5 text-left transition-all group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[10px] text-blue-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-blue-400" />
                <span>Telegram</span>
              </span>
              <Zap className="w-2.5 h-2.5 text-amber-400" />
            </div>
            <div className="text-[11.5px] font-extrabold text-white truncate group-hover:text-blue-400 transition-colors">
              Channel Join
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#22252F] text-[10px]">
            <span className="font-black text-blue-400 font-mono">+৳10.00</span>
            <span className="text-[#8E8E93] text-[9.5px] font-mono">~20s</span>
          </div>
        </button>

        {/* Rec 2: Featured Micro Job */}
        <button
          onClick={() => onSelectTab('micro_jobs')}
          className="bg-gradient-to-b from-[#181A20] to-[#121317] hover:from-[#1E212A] hover:to-[#16181F] active:scale-[0.97] border border-[#262A35] hover:border-emerald-500/40 rounded-xl p-2.5 text-left transition-all group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-emerald-400" />
                <span>Job</span>
              </span>
              <span className="text-[8.5px] font-black bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded border border-amber-500/30">
                HOT
              </span>
            </div>
            <div className="text-[11.5px] font-extrabold text-white truncate group-hover:text-emerald-400 transition-colors">
              FB Like & Share
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#22252F] text-[10px]">
            <span className="font-black text-emerald-400 font-mono">+৳15.00</span>
            <span className="text-[#8E8E93] text-[9.5px] font-mono">~2m</span>
          </div>
        </button>

        {/* Rec 3: Ads */}
        <button
          onClick={() => onSelectTab('ads')}
          className="bg-gradient-to-b from-[#181A20] to-[#121317] hover:from-[#1E212A] hover:to-[#16181F] active:scale-[0.97] border border-[#262A35] hover:border-[#00E5FF]/40 rounded-xl p-2.5 text-left transition-all group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#00E5FF] font-bold mb-1">
              <span className="flex items-center gap-1">
                <Play className="w-3 h-3 text-[#00E5FF] fill-[#00E5FF]" />
                <span>Watch Ad</span>
              </span>
              <ChevronRight className="w-3 h-3 text-[#00E5FF] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-[11.5px] font-extrabold text-white truncate group-hover:text-[#00E5FF] transition-colors">
              Gigapop Video
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#22252F] text-[10px]">
            <span className="font-black text-[#00E5FF] font-mono">+৳2.50</span>
            <span className="text-[#8E8E93] text-[9.5px] font-mono">15s</span>
          </div>
        </button>
      </div>

      {/* 3. Compact Integrated Progress Indicator (Small, Adjusted & Premium) */}
      <div className="relative z-10 mt-3 pt-2.5 border-t border-[#22252F]">
        <div className="flex items-center justify-between text-[10.5px] mb-1.5">
          <div className="flex items-center gap-1.5 text-[#94A3B8]">
            <Clock className="w-3 h-3 text-[#00E5FF]" />
            <span className="font-semibold text-slate-300">
              {isBn ? 'দৈনিক বিজ্ঞাপন অগ্রগতি' : "Today's Ad Goal"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-white text-[10.5px]">
              <span className="text-[#00E5FF]">{totalWatched}</span>/{totalDailyLimit}
            </span>
            <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 font-mono">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Micro Progress Bar */}
        <div className="w-full bg-[#0D0E11] h-1.5 rounded-full overflow-hidden p-0 border border-[#20232B]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#00E5FF] to-emerald-400 rounded-full shadow-[0_0_8px_#00E5FF]"
          />
        </div>

        <div className="flex items-center justify-between text-[9.5px] text-[#71717A] mt-1.5">
          <span>
            {remainingAds > 0
              ? `${remainingAds} ${isBn ? 'টি বিজ্ঞাপন বাকি' : 'ads remaining today'}`
              : `${isBn ? 'আজকের সব বিজ্ঞাপন সম্পন্ন!' : 'All ads completed today!'}`}
          </span>
          <span className="text-[#8E8E93] flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-400" />
            <span>Reset 12:00 AM UTC</span>
          </span>
        </div>
      </div>
    </div>
  );
};
