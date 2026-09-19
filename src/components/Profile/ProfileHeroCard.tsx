import React from 'react';
import { CheckCircle2, Sparkles, Shield, Flame, Award, Users, Wallet, ArrowUpRight, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTierStyleConfig } from './tierStyles';

export const ProfileHeroCard: React.FC = () => {
  const { user, profileLevel, profileExp, language, navigateTo } = useApp();
  const isBn = language === 'bn' || language === 'mixed';
  const style = getTierStyleConfig(profileLevel.tier);
  const totalEarnedBdt = Number((user.bdtBalance + user.totalCashoutBdt).toFixed(2));

  return (
    <div id="profile-hero-card" className="p-3.5 sm:p-4 rounded-[24px] bg-gradient-to-b from-[#18181D] via-[#141417] to-[#101012] border border-[#27272D] shadow-xl space-y-3.5 relative overflow-hidden transition-all duration-300">
      {/* Background Ambient Glow tailored to tier */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-500"
        style={{ backgroundColor: style.glowColor }}
      />

      <div className="flex items-center gap-3.5 relative z-10">
        {/* Avatar with Dynamic Level Crown & Metallic Border Effect */}
        <div className="relative shrink-0">
          {/* Floating Crown Badge */}
          {profileLevel.tier !== 'Default' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] animate-bounce">
              <span className="text-sm select-none">{style.crownEmoji}</span>
            </div>
          )}

          {/* Avatar Ring Container with Tier Gradient and Border */}
          <div
            className={`w-15 h-15 rounded-2xl p-[2.5px] transition-all duration-500 bg-gradient-to-br ${style.avatarGradientBg} ${style.avatarRingClass}`}
          >
            <div className="w-full h-full rounded-[13px] bg-[#0E0E10] flex items-center justify-center overflow-hidden relative border border-black/40">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || user.username}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xl font-black text-white">
                  {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Verified Badge */}
          <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#141416] border border-[#27272D] shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-500/20" />
          </span>
        </div>

        {/* User Info & Level Pill */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-sm font-extrabold text-white truncate max-w-[160px]">
              {user.fullName || user.username}
            </h1>
            {/* Dynamic Profile Level Badge */}
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border flex items-center gap-1 shrink-0 transition-all duration-300 ${style.pillBg} ${style.pillBorder} ${style.pillText}`}
            >
              <span>{profileLevel.crownText}</span>
            </span>
          </div>

          <p className="text-xs text-[#8E8E93] font-mono mt-0.5 truncate">
            @{user.username || 'telegram_user'}
          </p>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isBn ? 'ভেরিফাইড অ্যাকাউন্ট' : 'Verified Member'}
            </span>
            <span className="text-[9px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-400/20 flex items-center gap-0.5 font-mono">
              <Zap className="w-2.5 h-2.5" />
              {profileExp} XP
            </span>
            {(profileLevel.bonusPercent ?? 0) > 0 && (
              <span className="text-[9px] text-amber-300 font-black bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1 font-mono animate-pulse">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                +{profileLevel.bonusPercent}% {isBn ? 'রিওয়ার্ড বুস্ট' : 'Reward Boost'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#232326] text-center relative z-10">
        <div className="p-2 rounded-xl bg-[#111113] border border-[#1F1F22]">
          <span className="text-[8.5px] text-[#8E8E93] uppercase block font-bold truncate">
            {isBn ? 'মোট আয়' : 'Total Earned'}
          </span>
          <span className="text-xs font-black text-emerald-400 block mt-0.5">
            ৳{totalEarnedBdt.toFixed(0)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-[#111113] border border-[#1F1F22]">
          <span className="text-[8.5px] text-[#8E8E93] uppercase block font-bold truncate">
            {isBn ? 'উত্তোলন' : 'Cashout'}
          </span>
          <span className="text-xs font-black text-[#00E5FF] block mt-0.5">
            ৳{user.totalCashoutBdt.toFixed(0)}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-[#111113] border border-[#1F1F22]">
          <span className="text-[8.5px] text-[#8E8E93] uppercase block font-bold truncate">
            {isBn ? 'স্ট্রিক' : 'Streak'}
          </span>
          <span className="text-xs font-black text-amber-400 block mt-0.5">
            {user.streakDays || 1}d 🔥
          </span>
        </div>

        <div className="p-2 rounded-xl bg-[#111113] border border-[#1F1F22]">
          <span className="text-[8.5px] text-[#8E8E93] uppercase block font-bold truncate">
            {isBn ? 'রেফারেল' : 'Referrals'}
          </span>
          <span className="text-xs font-black text-white block mt-0.5">
            {user.totalReferrals || 0}
          </span>
        </div>
      </div>
    </div>
  );
};
