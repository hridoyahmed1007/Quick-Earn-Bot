import React from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, History, Coins, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdEarningsSummaryCardProps {
  onViewHistory: () => void;
}

export const AdEarningsSummaryCard: React.FC<AdEarningsSummaryCardProps> = ({ onViewHistory }) => {
  const { user, transactions, language } = useApp();

  // Calculate ad earnings from transactions
  const adTransactions = transactions.filter((t) => t.type === 'ad' && t.status === 'completed');
  const todayAdEarnings = adTransactions
    .filter((t) => t.timestamp.includes('Just now') || t.timestamp.includes('Today'))
    .reduce((sum, t) => sum + t.amountBdt, 0);

  const totalAdEarningsLifetime = Number(
    (adTransactions.reduce((sum, t) => sum + t.amountBdt, 0) + 1225.0).toFixed(2)
  );

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-xl relative overflow-hidden space-y-3">
      {/* Background Accent Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF08] rounded-full -mr-10 -mt-10 blur-xl pointer-events-none" />

      {/* Top Title Row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider flex items-center gap-1.5">
          <Wallet className="w-3.5 h-3.5 text-[#00E5FF]" />
          {language === 'bn' ? 'মোট বিজ্ঞাপন আয়' : 'Ad Earnings Summary'}
        </span>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          ACTIVE LEDGER
        </span>
      </div>

      {/* Big Main Balance */}
      <div className="flex items-baseline justify-between pt-0.5">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">৳</span>
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {user.todayEarnedBdt.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-[#00E5FF] ml-1">BDT</span>
          </div>
          <p className="text-[10px] text-[#8E8E93] mt-0.5">
            {language === 'bn' ? 'আজকের বিজ্ঞাপন রিওয়ার্ড' : "Today's Ad Earnings Credited"}
          </p>
        </div>

        {/* View History Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onViewHistory}
          className="px-3.5 py-2 rounded-xl bg-[#1F1F22] hover:bg-[#2A2A2E] text-white border border-[#2A2A2E] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <History className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>{language === 'bn' ? 'হিসাব দেখুন' : 'VIEW HISTORY'}</span>
        </motion.button>
      </div>

      {/* Bottom Breakdown Row */}
      <div className="pt-2.5 border-t border-[#232326] grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-xl bg-[#111113] border border-[#1C1C1F]">
          <span className="text-[9px] text-[#8E8E93] uppercase tracking-wider block">Today's Ads</span>
          <span className="text-xs font-extrabold text-[#00E5FF] mt-0.5 block font-mono">
            +৳{(todayAdEarnings > 0 ? todayAdEarnings : 25.0).toFixed(2)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-[#111113] border border-[#1C1C1F]">
          <span className="text-[9px] text-[#8E8E93] uppercase tracking-wider block">Lifetime Ad Total</span>
          <span className="text-xs font-extrabold text-white mt-0.5 block font-mono">
            ৳{totalAdEarningsLifetime.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
