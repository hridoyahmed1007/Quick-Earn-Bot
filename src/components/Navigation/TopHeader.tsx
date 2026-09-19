import React from 'react';
import { motion } from 'motion/react';
import { Bell, Wallet, Coins, Globe, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTierStyleConfig } from '../Profile/tierStyles';

export const TopHeader: React.FC = () => {
  const { user, profileLevel, language, setLanguage, navigateTo } = useApp();
  const tierStyle = getTierStyleConfig(profileLevel.tier);

  const handleLanguageToggle = () => {
    if (language === 'mixed') setLanguage('en');
    else if (language === 'en') setLanguage('bn');
    else setLanguage('mixed');
  };

  return (
    <header className="sticky top-0 z-30 w-full max-w-lg mx-auto bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#1A1A1C] px-4 py-3 flex items-center justify-between">
      {/* User Info & App Title */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigateTo('profile')}
          className="relative focus:outline-none group"
        >
          {/* Avatar with Dynamic Tier Ring */}
          <div
            className={`w-10 h-10 rounded-full p-[2px] transition-all duration-300 group-hover:scale-105 bg-gradient-to-br ${tierStyle.avatarGradientBg} ${tierStyle.avatarRingClass}`}
          >
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-full h-full rounded-full object-cover bg-[#111113]"
            />
          </div>
          {user.isVerified && (
            <span className="absolute -bottom-0.5 -right-0.5 bg-[#0A0A0B] rounded-full p-0.5 border border-[#1A1A1C]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          )}
        </button>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#8E8E93] max-w-[100px] truncate">
              @{user.username}
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border transition-all duration-300 ${tierStyle.pillBg} ${tierStyle.pillBorder} ${tierStyle.pillText}`}
            >
              {profileLevel.crownText}
            </span>
          </div>
          <p className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#70F3FF] to-white">
            Quick Earn
          </p>
        </div>
      </div>

      {/* Balance Pill & Actions */}
      <div className="flex items-center gap-2">
        {/* Balance Display Pill */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('withdraw')}
          className="flex items-center gap-1.5 bg-[#161618] hover:bg-[#1F1F22] border border-[#232326] hover:border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-inner transition-all group"
        >
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <div className="flex items-center text-white font-black text-xs font-mono">
            <span>৳{user.bdtBalance.toFixed(2)}</span>
          </div>
        </motion.button>

        {/* Quick Language Toggle */}
        <button
          onClick={handleLanguageToggle}
          title="Toggle Language Mode"
          className="p-1.5 rounded-lg bg-[#161618] border border-[#232326] text-[#8E8E93] hover:text-[#00E5FF] text-xs font-bold flex items-center gap-1 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="uppercase text-[10px]">
            {language === 'mixed' ? 'MIX' : language}
          </span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => navigateTo('notifications')}
          className="relative p-2 rounded-lg bg-[#161618] border border-[#232326] text-[#8E8E93] hover:text-[#00E5FF] transition-colors"
        >
          <Bell className="w-4 h-4" />
          {user.unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3B30] rounded-full animate-ping" />
          )}
          {user.unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3B30] rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};
