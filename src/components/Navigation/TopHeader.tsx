import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, Wallet, Globe, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTierStyleConfig } from '../Profile/tierStyles';

export const TopHeader: React.FC = () => {
  const { user, profileLevel, language, setLanguage, navigateTo } = useApp();
  const tierStyle = getTierStyleConfig(profileLevel.tier);
  const [imgError, setImgError] = useState(false);

  // Reset img error if avatar URL changes
  useEffect(() => {
    setImgError(false);
  }, [user.avatarUrl]);

  const handleLanguageToggle = () => {
    if (language === 'mixed') setLanguage('en');
    else if (language === 'en') setLanguage('bn');
    else setLanguage('mixed');
  };

  // Extract clean names and handle user logic
  const rawFullName = (user.fullName || '').trim();
  const rawUsername = (user.username || '').trim().replace(/^@/, '');

  // Check if real full name is provided and distinct from username
  const hasFullName = Boolean(
    rawFullName &&
    rawFullName.toLowerCase() !== rawUsername.toLowerCase()
  );
  const hasUsername = Boolean(rawUsername);

  // Determine main display string & initial for avatar fallback
  const displayName = hasFullName ? rawFullName : (hasUsername ? `@${rawUsername}` : 'User');
  const avatarInitial = (displayName.replace(/^@/, '').trim().charAt(0) || 'U').toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full max-w-lg mx-auto bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#1A1A1C] px-4 py-3 flex items-center justify-between">
      {/* User Info */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => navigateTo('profile')}
          className="relative focus:outline-none group shrink-0"
          title="Profile"
        >
          {/* Avatar with Dynamic Tier Ring */}
          <div
            className={`w-10 h-10 rounded-full p-[2px] transition-all duration-300 group-hover:scale-105 bg-gradient-to-br ${tierStyle.avatarGradientBg} ${tierStyle.avatarRingClass}`}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#161618] flex items-center justify-center">
              {user.avatarUrl && !imgError ? (
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#2AABEE] to-[#00E5FF] flex items-center justify-center text-white font-black text-sm select-none shadow-inner">
                  {avatarInitial}
                </div>
              )}
            </div>
          </div>
          {user.isVerified && (
            <span className="absolute -bottom-0.5 -right-0.5 bg-[#0A0A0B] rounded-full p-0.5 border border-[#1A1A1C]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          )}
        </button>

        {/* Name & Username Display (Follows user instruction strictly) */}
        <div className="flex flex-col min-w-0 justify-center">
          {hasFullName ? (
            <>
              {/* Telegram Name on Top */}
              <h2 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[125px] sm:max-w-[155px] tracking-tight leading-tight">
                {rawFullName}
              </h2>

              {/* Username Below + Tier Badge */}
              <div className="flex items-center gap-1.5 mt-0.5">
                {hasUsername && (
                  <span className="text-[10px] font-semibold text-[#8E8E93] truncate max-w-[95px] leading-none">
                    @{rawUsername}
                  </span>
                )}
                <span
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border transition-all duration-300 leading-none shrink-0 ${tierStyle.pillBg} ${tierStyle.pillBorder} ${tierStyle.pillText}`}
                >
                  {profileLevel.crownText}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* If no Name, show only Username */}
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[130px] sm:max-w-[160px] tracking-tight leading-tight">
                  @{rawUsername || 'earner'}
                </h2>
                <span
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border transition-all duration-300 leading-none shrink-0 ${tierStyle.pillBg} ${tierStyle.pillBorder} ${tierStyle.pillText}`}
                >
                  {profileLevel.crownText}
                </span>
              </div>
            </>
          )}
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
