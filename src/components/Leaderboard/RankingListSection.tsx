import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, TrendingDown, Minus, EyeOff, Eye, UserCheck } from 'lucide-react';
import { LeaderboardEntry } from '../../types';
import { useApp } from '../../context/AppContext';

interface RankingListSectionProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export const RankingListSection: React.FC<RankingListSectionProps> = ({ entries, isLoading }) => {
  const { language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [useAnonymous, setUseAnonymous] = useState(false);

  const filteredEntries = entries.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const rankStr = `#${item.rank}`;
    return item.username.toLowerCase().includes(term) || rankStr.includes(term) || item.rank.toString() === term;
  });

  const getTrendIndicator = (item: LeaderboardEntry) => {
    if (item.trend === 'up') {
      return (
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5 shrink-0">
          <TrendingUp className="w-3 h-3" />
          +{item.trendChange || 1}
        </span>
      );
    }
    if (item.trend === 'down') {
      return (
        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-0.5 shrink-0">
          <TrendingDown className="w-3 h-3" />
          -{item.trendChange || 1}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-[#8E8E93] bg-[#232326] px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
        <Minus className="w-3 h-3" />
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {/* Search & Privacy Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'ইউজারনেম বা র‍্যাংক দিয়ে খুঁজুন (#1-#100)...' : 'Search username or rank (#1-#100)...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#161618] border border-[#232326] text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#00E5FF] transition-all"
          />
        </div>

        {/* Privacy Toggle */}
        <button
          onClick={() => setUseAnonymous(!useAnonymous)}
          className={`px-3 py-2.5 rounded-2xl border text-[11px] font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            useAnonymous
              ? 'bg-[#00E5FF15] border-[#00E5FF] text-[#00E5FF]'
              : 'bg-[#161618] border-[#232326] text-[#8E8E93] hover:text-white'
          }`}
        >
          {useAnonymous ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{useAnonymous ? (language === 'bn' ? 'অ্যানোনিমাস' : 'Anonymous Mode') : (language === 'bn' ? 'পাবলিক নাম' : 'Public Name')}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-2 pt-1">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] animate-pulse flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-4 bg-[#232326] rounded" />
                <div className="w-9 h-9 rounded-full bg-[#232326]" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3 bg-[#232326] rounded" />
                  <div className="w-16 h-2 bg-[#232326] rounded" />
                </div>
              </div>
              <div className="w-16 h-4 bg-[#232326] rounded" />
            </div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        /* Empty State */
        <div className="p-8 rounded-3xl bg-[#161618] border border-[#232326] text-center space-y-2">
          <span className="text-3xl block">🏆</span>
          <h4 className="text-xs font-bold text-white">
            {language === 'bn' ? 'কোনো ইউজার পাওয়া যায়নি' : 'No Earner Found'}
          </h4>
          <p className="text-[11px] text-[#8E8E93]">
            {language === 'bn' ? 'আপনার সার্চকৃত নাম বা র‍্যাংক লিডারবোর্ডে নেই।' : 'Try searching another username or rank number.'}
          </p>
        </div>
      ) : (
        /* List */
        <div className="space-y-2">
          {filteredEntries.map((item) => {
            const displayName = useAnonymous && !item.isCurrentUser
              ? `Anonymous #${1000 + item.rank}`
              : item.username;

            return (
              <motion.div
                key={item.rank}
                id={item.isCurrentUser ? 'my-rank-item' : undefined}
                whileHover={{ scale: 1.005 }}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                  item.isCurrentUser
                    ? 'bg-[#00E5FF10] border-[#00E5FF] shadow-lg glow-cyan ring-1 ring-[#00E5FF]'
                    : item.rank <= 10
                    ? 'bg-[#18181C] border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-[#161618] border-[#232326] hover:border-[#2A2A2E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 flex flex-col items-center justify-center shrink-0">
                    <span className={`font-black text-xs ${
                      item.rank <= 10 ? 'text-amber-400' : 'text-[#8E8E93]'
                    }`}>
                      #{item.rank}
                    </span>
                  </div>

                  <img
                    src={item.avatar}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border border-[#2A2A2E] shrink-0"
                  />

                  <div className="min-w-0">
                    <p className="font-bold text-white truncate flex items-center gap-1.5">
                      <span>@{displayName}</span>
                      {item.isCurrentUser && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00E5FF] text-[#0A0A0B] font-black">
                          YOU
                        </span>
                      )}
                      {item.badge && !item.isCurrentUser && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 hidden sm:inline-block">
                          {item.badge}
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-[#8E8E93] truncate">
                      {item.referralCount !== undefined && item.referralCount > 0 ? `${item.referralCount} Refs • ` : ''}
                      {item.adsWatched !== undefined && item.adsWatched > 0 ? `${item.adsWatched} Ads • ` : ''}
                      {item.jobsCompleted !== undefined && item.jobsCompleted > 0 ? `${item.jobsCompleted} Jobs • ` : ''}
                      {item.channelsJoined !== undefined && item.channelsJoined > 0 ? `${item.channelsJoined} Channels • ` : ''}
                      Verified Earner
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-black text-[#00E5FF] text-xs">
                    ৳{item.amountBdt.toFixed(2)}
                  </span>
                  {getTrendIndicator(item)}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
