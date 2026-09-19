import React from 'react';
import { motion } from 'motion/react';
import { Crown, Flame, Sparkles, TrendingUp, Award } from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { useApp } from '../../context/AppContext';

interface ChampionSpotlightProps {
  champion?: LeaderboardEntry;
}

export const ChampionSpotlight: React.FC<ChampionSpotlightProps> = ({ champion }) => {
  const { language } = useApp();

  if (!champion) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {/* Champion Spotlight Banner */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF12] via-[#161619] to-[#00E5FF10] border border-[#00E5FF30] shadow-xl flex items-center justify-between gap-3 relative overflow-hidden"
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={champion.avatar}
              alt={champion.username}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#00E5FF]"
            />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00E5FF] text-[#0A0A0B] flex items-center justify-center font-black text-[10px]">
              👑
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase text-[#00E5FF] px-2 py-0.2 rounded-full bg-[#00E5FF15] border border-[#00E5FF25]">
                {language === 'bn' ? 'আজকের চ্যাম্পিয়ন' : 'DAILY CHAMPION'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mt-1">
              {champion.username}
            </h4>
            <p className="text-[10px] text-[#8E8E93]">
              {language === 'bn' ? 'আজ সর্বমোট অর্জন:' : 'Earned Today:'}{' '}
              <span className="text-[#00E5FF] font-bold">৳{champion.amountBdt.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg font-black text-[#00E5FF]">#1</span>
          <p className="text-[9px] text-emerald-400 font-bold flex items-center justify-end gap-0.5">
            <TrendingUp className="w-3 h-3" />
            +৳1,250 today
          </p>
        </div>
      </motion.div>

      {/* Fastest Climber Banner */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#161619] to-amber-500/5 border border-amber-500/30 shadow-xl flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shrink-0">
            🔥
          </div>

          <div>
            <span className="text-[9px] font-black uppercase text-amber-400 px-2 py-0.2 rounded-full bg-amber-500/15 border border-amber-500/25">
              {language === 'bn' ? 'ফাস্টেস্ট ক্লাইম্বার' : 'FASTEST CLIMBER'}
            </span>
            <h4 className="text-xs font-bold text-white mt-1">
              faisal_sylhet
            </h4>
            <p className="text-[10px] text-[#8E8E93]">
              {language === 'bn' ? 'আজ দ্রুততম র‍্যাংক বৃদ্ধি' : 'Fastest rank surge today'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-black text-amber-400 block">+18 POS</span>
          <p className="text-[9px] text-[#8E8E93]">↑ Moved from #26</p>
        </div>
      </motion.div>
    </div>
  );
};
