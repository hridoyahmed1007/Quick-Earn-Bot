import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HomeHeader } from '../Home/HomeHeader';
import { BalanceCard } from '../Home/BalanceCard';
import { QuickEarnHub } from '../Home/QuickEarnHub';
import { DailyBonusCard } from '../Home/DailyBonusCard';
import { LeaderboardPreview } from '../Home/LeaderboardPreview';
import { LiveActivityFeed } from '../Home/LiveActivityFeed';
import { AnnouncementAndRecent } from '../Home/AnnouncementAndRecent';
import { FeaturedOpportunity } from '../Home/FeaturedOpportunity';
import { WifiOff, AlertTriangle } from 'lucide-react';

export const HomeView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Offline banner indicator
  if (isOffline) {
    return (
      <div className="p-8 text-center space-y-4 my-12">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8" />
        </div>
        <h2 className="text-base font-bold text-white">You're Offline</h2>
        <p className="text-xs text-[#8E8E93] max-w-xs mx-auto">
          Please check your internet connection and try again to load your earnings data.
        </p>
        <button
          onClick={handleRefresh}
          className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A0B] font-bold text-xs shadow-md glow-cyan"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Error fallback
  if (hasError) {
    return (
      <div className="p-8 text-center space-y-4 my-12">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-base font-bold text-white">Something Went Wrong</h2>
        <p className="text-xs text-[#8E8E93]">
          Failed to load dashboard sync data.
        </p>
        <button
          onClick={handleRefresh}
          className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A0B] font-bold text-xs shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-4 pb-28 animate-pulse">
        <div className="h-12 bg-[#161618] rounded-2xl w-full" />
        <div className="h-44 bg-[#161618] rounded-[24px] w-full" />
        <div className="h-28 bg-[#161618] rounded-[20px] w-full" />
        <div className="h-20 bg-[#161618] rounded-[20px] w-full" />
        <div className="h-40 bg-[#161618] rounded-[22px] w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 pb-28"
    >
      {/* 1. Main Balance Card & Withdraw / View Wallet */}
      <BalanceCard />

      {/* 2. Quick Earn Hub (Ads, Micro Jobs, Channel Tasks) */}
      <QuickEarnHub />

      {/* 4. Daily Bonus Card */}
      <DailyBonusCard />

      {/* 5. Top Leaderboard Preview */}
      <LeaderboardPreview />

      {/* 6. Live Withdrawals */}
      <LiveActivityFeed />

      {/* 7. Announcements */}
      <AnnouncementAndRecent />

      {/* 8. Featured Opportunity (Shows if active) */}
      <FeaturedOpportunity />
    </motion.div>
  );
};
