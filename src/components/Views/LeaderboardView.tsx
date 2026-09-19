import React, { useState, useTransition, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  ArrowLeft,
  Crown,
  Users,
  Tv,
  Coins,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Clock,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaderboardPeriod, LeaderboardEntry } from '../../types';
import { getTop100Leaderboard } from '../../data/leaderboardGenerator';
import { triggerHaptic } from '../../utils/haptics';

export const LeaderboardView: React.FC = () => {
  const { user, language, navigateTo } = useApp();

  const [period, setPeriod] = useState<LeaderboardPeriod>('today');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showRules, setShowRules] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const myRankRef = useRef<HTMLDivElement | null>(null);

  const periods: { id: LeaderboardPeriod; labelEn: string; labelBn: string }[] = [
    { id: 'today', labelEn: 'DAILY', labelBn: 'দৈনিক' },
    { id: 'weekly', labelEn: 'WEEKLY', labelBn: 'সাপ্তাহিক' },
    { id: 'monthly', labelEn: 'MONTHLY', labelBn: 'মাসিক' },
    { id: 'allTime', labelEn: 'ALL TIME', labelBn: 'সর্বকালীন' },
  ];

  // Handle Tab Switch
  const handlePeriodChange = (newPeriod: LeaderboardPeriod) => {
    if (newPeriod === period) return;
    triggerHaptic('selection');
    setIsLoading(true);
    setHasError(false);

    startTransition(() => {
      setPeriod(newPeriod);
      setTimeout(() => {
        setIsLoading(false);
      }, 180);
    });
  };

  // Fetch complete Top 100 Dataset
  const allEntries = getTop100Leaderboard(period, {
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    bdtBalance: user.bdtBalance,
    totalReferrals: user.totalReferrals,
    totalAdsWatched: (user as any).totalAdsWatched ?? user.completedAds ?? 0,
  });

  const top3 = allEntries.slice(0, 3);
  const rank4To100 = allEntries.slice(3, 100);

  // Filtered entries for search
  const filteredList = rank4To100.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    const rankQuery = `#${item.rank}`;
    return (
      (item.displayName && item.displayName.toLowerCase().includes(q)) ||
      item.username.toLowerCase().includes(q) ||
      rankQuery.includes(q) ||
      item.rank.toString() === q
    );
  });

  const currentUserEntry = allEntries.find((e) => e.isCurrentUser) || {
    rank: 27,
    displayName: user.fullName,
    username: user.username,
    avatar: user.avatarUrl,
    amountBdt: 42.50,
    referralCount: 3,
    adsWatched: 18,
    isCurrentUser: true,
  };

  const scrollToMyRank = () => {
    triggerHaptic('light');
    const el = document.getElementById('my-rank-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Trend icon helper
  const renderTrend = (trend?: 'up' | 'down' | 'neutral', change?: number) => {
    if (trend === 'up') {
      return (
        <span className="flex items-center text-[10px] font-extrabold text-emerald-400">
          <TrendingUp className="w-3 h-3 mr-0.5" />
          {change ? `+${change}` : ''}
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="flex items-center text-[10px] font-extrabold text-rose-400">
          <TrendingDown className="w-3 h-3 mr-0.5" />
          {change ? `-${change}` : ''}
        </span>
      );
    }
    return (
      <span className="flex items-center text-[10px] text-[#8E8E93]">
        <Minus className="w-3 h-3" />
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDEDED] pb-28">
      {/* 1. FIXED PAGE HEADER (STICKY) */}
      <header className="sticky top-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-xl border-b border-[#1A1A1C] px-4 py-3 shadow-xl">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              navigateTo('home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161618] hover:bg-[#202024] active:scale-95 text-white font-bold text-xs border border-[#232326] transition-all"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4 h-4 text-[#00E5FF]" />
            <span>{language === 'bn' ? 'হোম' : 'Back'}</span>
          </button>

          {/* Title & Subtitle */}
          <div className="text-center min-w-0 flex-1">
            <h1 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span>🏆 Leaderboard</span>
            </h1>
            <p className="text-[10px] text-[#8E8E93] truncate">
              {language === 'bn' ? 'প্ল্যাটফর্মের শীর্ষ পারফরমারগণ' : 'Top performers of the platform'}
            </p>
          </div>

          {/* Rules Info Toggle */}
          <button
            onClick={() => {
              triggerHaptic('light');
              setShowRules((prev) => !prev);
            }}
            className={`p-2 rounded-xl border transition-all ${
              showRules
                ? 'bg-[#00E5FF20] text-[#00E5FF] border-[#00E5FF40]'
                : 'bg-[#161618] hover:bg-[#202024] text-[#8E8E93] hover:text-white border-[#232326]'
            }`}
            title="Leaderboard Rules"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-3 space-y-3.5">
        {/* 2. EXPANDABLE COMPACT RULES BOX */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#00E5FF30] shadow-xl text-xs space-y-2">
                <div className="flex items-center justify-between text-[#00E5FF] font-black text-[11px] uppercase">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    ℹ️ {language === 'bn' ? 'লিডারবোর্ড নিয়মাবলী' : 'Leaderboard Rules'}
                  </span>
                  <button
                    onClick={() => setShowRules(false)}
                    className="text-[#8E8E93] hover:text-white text-[10px]"
                  >
                    ✕ Close
                  </button>
                </div>
                <ul className="space-y-1 text-[11px] text-[#A0A0A5] leading-relaxed list-disc list-inside">
                  <li>{language === 'bn' ? 'শুধুমাত্র ভেরিফাইড অ্যাক্টিভিটি গণনা করা হয়।' : 'Only verified activity counts.'}</li>
                  <li>{language === 'bn' ? 'শুধুমাত্র কোয়ালিফায়েড রেফারেল পয়েন্ট যোগ হয়।' : 'Only qualified referrals count.'}</li>
                  <li>{language === 'bn' ? 'ফেইক বা ডুপ্লিকেট অ্যাকাউন্ট সরাসরি ব্যান ও অপসারিত হয়।' : 'Fraudulent/duplicate activity is excluded.'}</li>
                  <li>{language === 'bn' ? 'র‍্যাঙ্কিং স্বয়ংক্রিয়ভাবে সার্ভার দ্বারা আপডেট হয়।' : 'Rankings update automatically.'}</li>
                  <li>{language === 'bn' ? 'পুরস্কার ক্যাম্পেইন নীতিমালা অনুযায়ী ক্যাশআউট করা যায়।' : 'Rewards follow published campaign rules.'}</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. PERIOD TABS: [ DAILY ] [ WEEKLY ] [ MONTHLY ] [ ALL TIME ] */}
        <div className="p-1 rounded-2xl bg-[#141416] border border-[#232326] grid grid-cols-4 gap-1 shadow-md">
          {periods.map((p) => {
            const isActive = period === p.id;
            return (
              <button
                key={p.id}
                id={`tab-leaderboard-${p.id}`}
                onClick={() => handlePeriodChange(p.id)}
                className={`py-2 rounded-xl text-xs font-black tracking-wide transition-all select-none relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0A0A0B] shadow-md shadow-[#00E5FF25]'
                    : 'text-[#8E8E93] hover:text-white hover:bg-[#1C1C1F]'
                }`}
              >
                <span>{language === 'bn' ? p.labelBn : p.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Live Status & Top 100 Counter */}
        <div className="flex items-center justify-between text-[11px] px-1 text-[#8E8E93]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-[#EDEDED]">
              {language === 'bn' ? 'টপ ১০০ ভেরিফাইড ইউজার' : 'Top 100 Verified Earners'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] bg-[#161618] px-2.5 py-0.5 rounded-full border border-[#232326]">
            <Clock className="w-3 h-3 text-[#00E5FF]" />
            <span>
              {period === 'today'
                ? 'Daily Reset: 12:00 AM'
                : period === 'weekly'
                ? 'Weekly Cycle'
                : period === 'monthly'
                ? 'Monthly Cycle'
                : 'All Time Records'}
            </span>
          </div>
        </div>

        {/* ERROR STATE */}
        {hasError && (
          <div className="p-6 rounded-2xl bg-[#1A1414] border border-rose-500/30 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-xs font-bold text-white">
              {language === 'bn' ? 'লিডারবোর্ড লোড করা যায়নি।' : 'Unable to load leaderboard.'}
            </p>
            <button
              onClick={() => handlePeriodChange(period)}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        )}

        {/* LOADING SKELETON */}
        {isLoading && !hasError && (
          <div className="space-y-4 animate-pulse">
            {/* Top 3 Skeleton */}
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="h-44 rounded-2xl bg-[#161618] border border-[#232326]" />
              <div className="h-52 rounded-2xl bg-[#161618] border border-[#00E5FF30]" />
              <div className="h-44 rounded-2xl bg-[#161618] border border-[#232326]" />
            </div>

            {/* Rows Skeleton */}
            <div className="space-y-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-[#141416] border border-[#202024]"
                />
              ))}
            </div>
          </div>
        )}

        {/* MAIN LEADERBOARD CONTENT */}
        {!isLoading && !hasError && (
          <div className="space-y-4">
            {/* 4. TOP 3 PREMIUM PODIUM */}
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-2 items-end">
                {/* 🥈 #2 Silver Podium */}
                {top3[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="p-3 rounded-2xl bg-gradient-to-b from-[#18181C] to-[#121214] border border-[#8E8E93]/30 flex flex-col items-center justify-between text-center relative shadow-lg"
                  >
                    <div className="w-full flex flex-col items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#8E8E93] text-[#0A0A0B] text-[10px] font-black mb-1.5 shadow-sm">
                        🥈 #2
                      </span>
                      <div className="relative mb-1">
                        <img
                          src={top3[1].avatar}
                          alt={top3[1].displayName || top3[1].username}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8E8E93]"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-[#121214] rounded-full p-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8E8E93]" />
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate max-w-[85px]">
                        {top3[1].displayName || `@${top3[1].username}`}
                      </p>
                      <p className="text-[9px] text-[#8E8E93] truncate max-w-[85px]">
                        @{top3[1].username}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#232326] w-full space-y-0.5 text-[9px] text-[#A0A0A5]">
                      <p className="font-black text-[#00E5FF] text-xs">
                        ৳{top3[1].amountBdt.toFixed(2)}
                      </p>
                      <p className="truncate">
                        👥 {top3[1].referralCount} Refs
                      </p>
                      <p className="truncate">
                        📺 {top3[1].adsWatched} Ads
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 🥇 #1 Champion Podium (Center - Highest) */}
                {top3[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-b from-[#1C1A14] via-[#141418] to-[#101012] border-2 border-amber-400/60 flex flex-col items-center justify-between text-center relative shadow-2xl shadow-amber-500/10 -mt-2"
                  >
                    <Crown className="w-5 h-5 text-amber-400 absolute -top-3 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-bounce" />

                    <div className="w-full flex flex-col items-center">
                      <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#0A0A0B] text-[10px] font-black mb-1.5 shadow-md mt-1">
                        🥇 #1 Champion
                      </span>
                      <div className="relative mb-1">
                        <img
                          src={top3[0].avatar}
                          alt={top3[0].displayName || top3[0].username}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-[#121214] rounded-full p-0.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        </span>
                      </div>
                      <p className="text-xs font-black text-white truncate max-w-[95px]">
                        {top3[0].displayName || `@${top3[0].username}`}
                      </p>
                      <p className="text-[10px] text-amber-400/90 truncate max-w-[95px] font-bold">
                        @{top3[0].username}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-amber-500/20 w-full space-y-0.5 text-[10px] text-[#A0A0A5]">
                      <p className="font-black text-amber-400 text-sm">
                        ৳{top3[0].amountBdt.toFixed(2)}
                      </p>
                      <p className="font-bold text-white truncate">
                        👥 {top3[0].referralCount} Refs
                      </p>
                      <p className="font-bold text-white truncate">
                        📺 {top3[0].adsWatched} Ads
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 🥉 #3 Bronze Podium */}
                {top3[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-3 rounded-2xl bg-gradient-to-b from-[#18181C] to-[#121214] border border-amber-700/40 flex flex-col items-center justify-between text-center relative shadow-lg"
                  >
                    <div className="w-full flex flex-col items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-black mb-1.5 shadow-sm">
                        🥉 #3
                      </span>
                      <div className="relative mb-1">
                        <img
                          src={top3[2].avatar}
                          alt={top3[2].displayName || top3[2].username}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-700"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-[#121214] rounded-full p-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate max-w-[85px]">
                        {top3[2].displayName || `@${top3[2].username}`}
                      </p>
                      <p className="text-[9px] text-[#8E8E93] truncate max-w-[85px]">
                        @{top3[2].username}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#232326] w-full space-y-0.5 text-[9px] text-[#A0A0A5]">
                      <p className="font-black text-[#00E5FF] text-xs">
                        ৳{top3[2].amountBdt.toFixed(2)}
                      </p>
                      <p className="truncate">
                        👥 {top3[2].referralCount} Refs
                      </p>
                      <p className="truncate">
                        📺 {top3[2].adsWatched} Ads
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* 5. SEARCH / LOOKUP IN TOP 100 */}
            <div className="pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'ইউজারনেম বা র‍্যাংক দিয়ে খুঁজুন (#4 - #100)...'
                      : 'Search user or rank (#4 - #100)...'
                  }
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141416] border border-[#232326] text-xs text-white placeholder-[#707075] focus:outline-none focus:border-[#00E5FF] transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8E8E93] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 6. RANK #4 — #100 SINGLE SCROLLABLE LIST */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-[11px] font-bold text-[#8E8E93]">
                <span>RANKS #4 — #100</span>
                <span>{filteredList.length} Verified Users</span>
              </div>

              {filteredList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#141416] border border-[#232326] text-center text-xs text-[#8E8E93]">
                  {language === 'bn' ? 'কোনো ইউজার পাওয়া যায়নি।' : 'No verified users found matching search.'}
                </div>
              ) : (
                filteredList.map((item) => {
                  const isUser = item.isCurrentUser;
                  return (
                    <motion.div
                      key={item.rank}
                      id={isUser ? 'my-rank-card' : undefined}
                      whileHover={{ scale: 1.005 }}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 text-xs ${
                        isUser
                          ? 'bg-[#00E5FF12] border-[#00E5FF] shadow-lg shadow-[#00E5FF15] ring-1 ring-[#00E5FF]'
                          : item.rank <= 10
                          ? 'bg-[#151518] border-amber-500/20 hover:border-amber-500/40'
                          : 'bg-[#141416] border-[#202024] hover:border-[#2A2A30]'
                      }`}
                    >
                      {/* Left: Rank + Avatar + Name + Username */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Rank & Trend */}
                        <div className="w-7 flex flex-col items-center justify-center shrink-0 text-center">
                          <span
                            className={`font-black text-xs ${
                              isUser
                                ? 'text-[#00E5FF]'
                                : item.rank <= 10
                                ? 'text-amber-400'
                                : 'text-[#8E8E93]'
                            }`}
                          >
                            #{item.rank}
                          </span>
                          <div className="scale-75">
                            {renderTrend(item.trend, item.trendChange)}
                          </div>
                        </div>

                        {/* Telegram Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={item.avatar}
                            alt={item.displayName || item.username}
                            className={`w-10 h-10 rounded-full object-cover ${
                              isUser
                                ? 'ring-2 ring-[#00E5FF]'
                                : item.rank <= 10
                                ? 'ring-1 ring-amber-400/50'
                                : 'ring-1 ring-[#2E2E32]'
                            }`}
                          />
                          {isUser && (
                            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-[#00E5FF] text-[#0A0A0B] text-[8px] font-black rounded-full border border-black">
                              YOU
                            </span>
                          )}
                        </div>

                        {/* Name & Username */}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-xs truncate flex items-center gap-1.5">
                            <span>{item.displayName || item.username}</span>
                            {isUser && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00E5FF] text-[#0A0A0B] font-black">
                                ✨ YOU
                              </span>
                            )}
                            {item.badge && !isUser && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 hidden sm:inline-block">
                                {item.badge}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-[#8E8E93] truncate">
                            @{item.username}
                          </p>
                        </div>
                      </div>

                      {/* Right: Metrics (Earnings, Referrals, Ads) */}
                      <div className="text-right shrink-0 space-y-0.5">
                        <p className="font-black text-[#00E5FF] text-xs">
                          ৳{item.amountBdt.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-end gap-1.5 text-[9px] text-[#8E8E93]">
                          <span>{item.referralCount} Refs</span>
                          <span>•</span>
                          <span>{item.adsWatched} Ads</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* 7. CURRENT USER'S STICKY RANK INDICATOR AT BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-xl border-t border-[#1F1F24] p-3 shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          {/* User Info & Current Rank */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00E5FF]"
              />
              <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-[#00E5FF] text-[#0A0A0B] text-[8px] font-black rounded-full border border-black">
                YOU
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white truncate max-w-[120px]">
                  {user.fullName}
                </span>
                <span className="text-[10px] font-extrabold text-[#00E5FF] bg-[#00E5FF18] px-2 py-0.5 rounded-full border border-[#00E5FF40]">
                  #{currentUserEntry.rank}
                </span>
              </div>
              <p className="text-[10px] text-[#8E8E93] truncate">
                <span className="text-[#00E5FF] font-bold">
                  ৳{currentUserEntry.amountBdt.toFixed(2)}
                </span>
                {' • '}
                <span>{currentUserEntry.referralCount} Refs</span>
                {' • '}
                <span>{currentUserEntry.adsWatched} Ads</span>
              </p>
            </div>
          </div>

          {/* Jump / Scroll to My Rank */}
          <button
            onClick={scrollToMyRank}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] hover:brightness-110 active:scale-95 text-[#0A0A0B] font-black text-xs shadow-md shadow-[#00E5FF20] flex items-center gap-1.5 shrink-0"
          >
            <Target className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'আমার র‍্যাংক' : 'Find My Rank'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
