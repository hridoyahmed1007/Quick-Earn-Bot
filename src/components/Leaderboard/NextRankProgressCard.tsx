import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NextRankProgressCardProps {
  currentRank?: number;
  targetRank?: number;
  bdtNeeded?: number;
  percent?: number;
}

export const NextRankProgressCard: React.FC<NextRankProgressCardProps> = ({
  currentRank = 27,
  targetRank = 20,
  bdtNeeded = 180.0,
  percent = 70,
}) => {
  const { language, navigateTo } = useApp();

  return (
    <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#00E5FF15] border border-[#00E5FF30] flex items-center justify-center text-[#00E5FF]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{language === 'bn' ? `পরবর্তী লক্ষ্য: #${targetRank} র‍্যাংক` : `Next Target: Reach #${targetRank}`}</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                Current #{currentRank}
              </span>
            </h4>
            <p className="text-[10px] text-[#8E8E93]">
              {language === 'bn'
                ? `আর মাত্র ৳${bdtNeeded.toFixed(2)} আয় করলে #${targetRank} অবস্থানে উঠবেন`
                : `Earn ৳${bdtNeeded.toFixed(2)} more to reach rank #${targetRank}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('ads')}
          className="text-[10px] font-bold text-[#00E5FF] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>{language === 'bn' ? 'আয় বাড়ান' : 'Earn More'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 rounded-full bg-[#232326] overflow-hidden p-0.5 border border-[#2A2A2E]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-emerald-400 shadow-sm"
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#8E8E93] font-bold pt-0.5">
          <span>{percent}% {language === 'bn' ? 'সম্পন্ন' : 'Completed'}</span>
          <span className="text-[#00E5FF]">৳{bdtNeeded.toFixed(2)} Needed</span>
        </div>
      </div>
    </div>
  );
};
