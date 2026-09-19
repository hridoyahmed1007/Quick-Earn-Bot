import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Tv, Users, Wallet, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MainRoute } from '../../types';

interface NavItemConfig {
  key: MainRoute;
  icon: React.ElementType;
  badgeCount?: number;
}

export const BottomNav: React.FC = () => {
  const { mainRoute, navigateTo, isNavVisible, adProviders, referrals, user } = useApp();

  // Dynamic Badges
  const availableAdsCount = adProviders.filter(
    (p) => p.isAvailable && p.completedToday < p.dailyLimit
  ).length;

  const newReferralBadge = referrals.filter((r) => r.status === 'active').length > 0 ? 3 : 0;
  const profileBadge = user.unreadNotificationsCount;

  const navItems: NavItemConfig[] = [
    { key: 'home', icon: Home },
    { key: 'ads', icon: Tv, badgeCount: availableAdsCount > 0 ? availableAdsCount : undefined },
    { key: 'referral', icon: Users, badgeCount: newReferralBadge > 0 ? newReferralBadge : undefined },
    { key: 'wallet', icon: Wallet },
    { key: 'profile', icon: User, badgeCount: profileBadge > 0 ? profileBadge : undefined },
  ];

  const englishLabels: Record<string, string> = {
    home: 'Home',
    ads: 'Ads',
    referral: 'Referral',
    wallet: 'Wallet',
    profile: 'Profile',
  };

  return (
    <AnimatePresence>
      {isNavVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto px-3 pb-safe pt-2 pointer-events-none"
        >
          <nav
            aria-label="Main Navigation"
            className="pointer-events-auto relative flex items-center justify-around px-2 py-2.5 rounded-2xl bg-[#0A0A0B]/95 backdrop-blur-xl border border-[#1A1A1C] shadow-2xl shadow-black/80"
          >
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = mainRoute === item.key;
              const labelText = englishLabels[item.key] || item.key;

              return (
                <motion.button
                  key={item.key}
                  id={`nav-item-${item.key}`}
                  onClick={() => navigateTo(item.key)}
                  whileTap={{ scale: 0.92 }}
                  className="relative flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 transition-colors select-none group focus:outline-none"
                >
                  {/* Active Indicator Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#00E5FF20] via-[#00E5FF15] to-[#00E5FF20] rounded-xl border border-[#00E5FF30] glow-cyan"
                    />
                  )}

                  {/* Icon Container with Badge */}
                  <div className="relative z-10 flex items-center justify-center mb-1">
                    <IconComponent
                      className={`w-[22px] h-[22px] transition-all duration-200 ${
                        isActive
                          ? 'text-[#00E5FF] scale-110 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                          : 'text-[#8E8E93] group-hover:text-white'
                      }`}
                    />

                    {/* Dynamic Badge */}
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[9px] font-extrabold text-white bg-[#FF3B30] rounded-full shadow-md border border-[#0A0A0B]"
                      >
                        {item.badgeCount > 99 ? '99+' : item.badgeCount}
                      </motion.span>
                    )}
                  </div>

                  {/* Menu Label */}
                  <span
                    className={`relative z-10 text-[11px] font-bold tracking-tight uppercase leading-tight transition-colors duration-200 ${
                      isActive
                        ? 'text-[#00E5FF]'
                        : 'text-[#8E8E93] group-hover:text-[#EDEDED]'
                    }`}
                  >
                    {labelText}
                  </span>

                  {/* Active Top/Bottom Glow Line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlowDot"
                      className="absolute -bottom-1 w-5 h-[3px] bg-[#00E5FF] rounded-full shadow-[0_4px_12px_rgba(0,229,255,0.8)]"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
