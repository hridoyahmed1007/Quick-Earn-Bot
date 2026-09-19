import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Users, Gift, CheckSquare, ChevronRight, Megaphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  buttonText: string;
  color: string;
  icon: any;
  route: any;
}

const BANNERS: BannerItem[] = [
  {
    id: 'b1',
    title: 'Referral Campaign 👥',
    subtitle: 'Invite More, Earn More! Get 10% commission + ৳100 milestone bonus.',
    badge: '10% Commission',
    buttonText: 'Invite Now',
    color: 'from-amber-950/80 via-[#161618] to-slate-900 border-amber-500/30',
    icon: Users,
    route: 'referral',
  },
  {
    id: 'b2',
    title: 'Daily Bonus Week 🎁',
    subtitle: 'Maintain your streak every day to unlock up to ৳25.00 cash rewards!',
    badge: 'Streak Special',
    buttonText: 'Claim Bonus',
    color: 'from-[#00E5FF15] via-[#161618] to-teal-950/80 border-[#00E5FF30]',
    icon: Gift,
    route: 'bonus',
  },
  {
    id: 'b3',
    title: 'Special Micro Jobs 💼',
    subtitle: 'Complete 30-second social media & telegram tasks for ৳5-৳20 payouts.',
    badge: 'New Micro Tasks',
    buttonText: 'Start Jobs',
    color: 'from-indigo-950/80 via-[#161618] to-slate-900 border-indigo-500/30',
    icon: CheckSquare,
    route: 'tasks',
  },
  {
    id: 'b4',
    title: 'Monetag HD Ads 🎬',
    subtitle: 'High paying video advertisements available today. Watch & earn instantly.',
    badge: 'Unlimited Ads',
    buttonText: 'Watch Ads',
    color: 'from-rose-950/80 via-[#161618] to-slate-900 border-rose-500/30',
    icon: Megaphone,
    route: 'ads',
  },
];

export const BannerSlider: React.FC = () => {
  const { navigateTo } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const activeBanner = BANNERS[currentIndex];
  const Icon = activeBanner.icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative rounded-[22px] bg-[#161618] border border-[#232326] p-4 shadow-md overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBanner.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between gap-3"
        >
          <div className="space-y-1 max-w-[70%]">
            <span className="px-2 py-0.5 rounded-full bg-[#00E5FF15] border border-[#00E5FF20] text-[#00E5FF] text-[9px] font-bold uppercase tracking-wider">
              {activeBanner.badge}
            </span>

            <h3 className="text-xs font-bold text-white leading-tight mt-1">
              {activeBanner.title}
            </h3>

            <p className="text-[10px] text-[#8E8E93] line-clamp-2 leading-tight">
              {activeBanner.subtitle}
            </p>

            <button
              onClick={() => navigateTo(activeBanner.route)}
              className="mt-2 text-[11px] font-extrabold text-[#00E5FF] hover:underline flex items-center gap-0.5 pt-0.5"
            >
              <span>{activeBanner.buttonText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#00E5FF10] border border-[#00E5FF20] text-[#00E5FF] flex items-center justify-center shrink-0 shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-[#232326]">
        {BANNERS.map((banner, idx) => (
          <button
            key={banner.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-5 bg-[#00E5FF]' : 'w-1.5 bg-[#2A2A2E]'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
