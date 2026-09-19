import React from 'react';
import { motion } from 'motion/react';
import { Tv, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdsHeaderProps {
  onOpenRules: () => void;
}

export const AdsHeader: React.FC<AdsHeaderProps> = ({ onOpenRules }) => {
  const { language } = useApp();

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-lg flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#00E5FF15] text-[#00E5FF] border border-[#00E5FF20] flex items-center justify-center shrink-0 shadow-sm">
          <Tv className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white leading-tight flex items-center gap-1.5">
              🎬 Watch & Earn
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#00E5FF10] border border-[#00E5FF20] text-[#00E5FF] text-[9px] font-extrabold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              VERIFIED ADS
            </span>
          </div>

          <p className="text-[11px] text-[#8E8E93] mt-0.5 leading-tight">
            {language === 'bn'
              ? 'বিজ্ঞাপন দেখুন এবং eligible reward earn করুন।'
              : 'Watch eligible advertisements to earn instant BDT cash rewards.'}
          </p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onOpenRules}
        className="p-2.5 rounded-xl bg-[#1F1F22] border border-[#2A2A2E] text-[#8E8E93] hover:text-[#00E5FF] hover:border-[#00E5FF30] transition-colors flex items-center gap-1 shrink-0"
        title="Ad Earning Rules & Guide"
      >
        <Info className="w-4 h-4 text-[#00E5FF]" />
        <span className="text-[10px] font-bold hidden sm:inline">Rules</span>
      </motion.button>
    </div>
  );
};
