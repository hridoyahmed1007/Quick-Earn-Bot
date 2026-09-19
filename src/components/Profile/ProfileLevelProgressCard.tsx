import React from 'react';
import { motion } from 'motion/react';
import { Zap, Sparkles, CheckSquare, Tv, Users, ChevronRight, Trophy, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTierStyleConfig } from './tierStyles';

export const ProfileLevelProgressCard: React.FC = () => {
  const {
    profileLevel,
    nextProfileLevel,
    levelProgressPercent,
    profileExp,
    remainingExpForNext,
    totalTasksCompleted,
    totalAdsWatched,
    totalReferrals,
    language,
    navigateTo,
    openEarningTab,
  } = useApp();

  const isBn = language === 'bn' || language === 'mixed';
  const currentTierStyle = getTierStyleConfig(profileLevel.tier);
  const nextTierStyle = nextProfileLevel ? getTierStyleConfig(nextProfileLevel.tier) : null;

  return (
    <div
      id="profile-level-progress-card"
      className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#18181D] via-[#131316] to-[#0D0D0F] border border-[#27272D] shadow-xl relative overflow-hidden transition-all duration-300"
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-50"
        style={{ backgroundColor: currentTierStyle.glowColor }}
      />

      {/* Header: Level Identity & EXP Score */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Metallic Tier Emblem */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all duration-300 shadow-md ${currentTierStyle.pillBorder} ${currentTierStyle.pillBg}`}
          >
            <span className="select-none filter drop-shadow">{currentTierStyle.crownEmoji}</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs font-black text-white tracking-tight">
                {isBn ? 'প্রোফাইল লেভেল প্রগ্রেস' : 'Profile Level Progression'}
              </h3>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${currentTierStyle.pillBg} ${currentTierStyle.pillBorder} ${currentTierStyle.pillText}`}
              >
                {profileLevel.crownText}
              </span>
            </div>
            <p className="text-[10px] text-[#A1A1AA] mt-0.5">
              {isBn ? profileLevel.descriptionBn : profileLevel.descriptionEn}
            </p>
          </div>
        </div>

        {/* Current Total EXP Badge */}
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 bg-[#101014] border border-[#26262C] px-2 py-1 rounded-xl shadow-inner">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-white tracking-wide font-mono">
              {profileExp}
            </span>
            <span className="text-[9px] font-bold text-[#8E8E93]">XP</span>
          </div>
        </div>
      </div>

      {/* 3 Activity Metrics Grid - Medium Paddingless Sleek Cards */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 my-2.5 relative z-10">
        {/* Metric 1: Tasks */}
        <button
          onClick={() => {
            openEarningTab('tasks');
            navigateTo('earn');
          }}
          className="group text-left p-2 rounded-xl bg-[#111114]/90 hover:bg-[#18181F] border border-[#232328] hover:border-cyan-500/40 transition-all duration-200"
        >
          <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mb-1">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <CheckSquare className="w-3 h-3 text-cyan-400" />
              <span>{isBn ? 'টাস্ক' : 'Tasks'}</span>
            </span>
            <span className="text-[8px] font-mono text-cyan-300/80 bg-cyan-500/10 px-1 rounded">
              +15 XP
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
              {totalTasksCompleted}
            </span>
            <span className="text-[8.5px] text-[#71717A] group-hover:text-cyan-400 flex items-center">
              {isBn ? 'কাজ' : 'Jobs'} <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </button>

        {/* Metric 2: Ads */}
        <button
          onClick={() => {
            openEarningTab('ads');
            navigateTo('earn');
          }}
          className="group text-left p-2 rounded-xl bg-[#111114]/90 hover:bg-[#18181F] border border-[#232328] hover:border-amber-500/40 transition-all duration-200"
        >
          <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mb-1">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Tv className="w-3 h-3 text-amber-400" />
              <span>{isBn ? 'অ্যাড' : 'Ads'}</span>
            </span>
            <span className="text-[8px] font-mono text-amber-300/80 bg-amber-500/10 px-1 rounded">
              +3 XP
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-black text-white font-mono group-hover:text-amber-300 transition-colors">
              {totalAdsWatched}
            </span>
            <span className="text-[8.5px] text-[#71717A] group-hover:text-amber-400 flex items-center">
              {isBn ? 'ভিউ' : 'Views'} <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </button>

        {/* Metric 3: Referrals */}
        <button
          onClick={() => navigateTo('referral')}
          className="group text-left p-2 rounded-xl bg-[#111114]/90 hover:bg-[#18181F] border border-[#232328] hover:border-emerald-500/40 transition-all duration-200"
        >
          <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mb-1">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>{isBn ? 'রেফার' : 'Refer'}</span>
            </span>
            <span className="text-[8px] font-mono text-emerald-300/80 bg-emerald-500/10 px-1 rounded">
              +25 XP
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-black text-white font-mono group-hover:text-emerald-300 transition-colors">
              {totalReferrals}
            </span>
            <span className="text-[8.5px] text-[#71717A] group-hover:text-emerald-400 flex items-center">
              {isBn ? 'বন্ধু' : 'Users'} <ChevronRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </button>
      </div>

      {/* Step-by-Step Level Progression Status */}
      {nextProfileLevel && nextTierStyle ? (
        <div className="space-y-2 pt-2 border-t border-[#232328] relative z-10">
          {/* Target Level Info */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-[#D4D4D8] flex items-center gap-1.5">
              <span className="text-xs">{nextTierStyle.crownEmoji}</span>
              <span>
                {isBn ? 'পরবর্তী টার্গেট:' : 'Next Target:'}{' '}
                <strong className="text-white font-bold">
                  {isBn ? nextProfileLevel.labelBn : nextProfileLevel.labelEn}
                </strong>
              </span>
            </span>
            <span className="font-mono font-black text-xs text-white">
              {levelProgressPercent}%
            </span>
          </div>

          {/* Premium Animated Progress Bar */}
          <div className="w-full h-2.5 bg-[#0C0C0E] rounded-full overflow-hidden border border-[#222228] p-[2px] relative shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(4, levelProgressPercent)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${nextTierStyle.progressBarGradient} relative shadow-[0_0_12px_rgba(0,229,255,0.4)]`}
            >
              {/* Highlight shimmer overlay */}
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse opacity-40" />
            </motion.div>
          </div>

          {/* Progress Math & Required Points */}
          <div className="flex items-center justify-between text-[10px] text-[#A1A1AA] pt-0.5">
            <span className="text-amber-300/90 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
              {isBn
                ? `প্রয়োজন: আরও ${remainingExpForNext} XP (টাস্ক, অ্যাড বা রেফার)`
                : `Need ${remainingExpForNext} more XP via tasks, ads, or referrals`}
            </span>
            <span className="font-mono font-bold text-[#E4E4E7]">
              {profileExp} / {nextProfileLevel.minPoints} XP
            </span>
          </div>

          {/* Next Level Perk Banner */}
          {nextProfileLevel && (
            <div className="flex items-center justify-between text-[10px] px-2.5 py-1.5 rounded-xl bg-[#141418] border border-[#222228] text-[#9CA3AF]">
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold truncate">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {isBn
                    ? `পরবর্তী আনলক: +${nextProfileLevel.bonusPercent}% এক্সট্রা রিওয়ার্ড বুস্ট (${nextProfileLevel.perkBn || ''})`
                    : `Next Unlock: +${nextProfileLevel.bonusPercent}% Extra Payout Boost (${nextProfileLevel.perkEn || ''})`}
                </span>
              </span>
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 shrink-0 ml-1">
                {nextProfileLevel.minPoints} XP
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Max Level State */
        <div className="pt-2 border-t border-[#232328] flex items-center justify-between text-xs text-purple-200 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B388FF] animate-spin" />
            <span className="font-bold">
              {isBn
                ? '🏆 অভিনন্দন! সর্বোচ্চ ডায়মন্ড লেজেন্ড অর্জিত!'
                : '🏆 Diamond Legend: Highest Rank Achieved!'}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B388FF]/20 text-[#E1BEE7] border border-[#B388FF]/40 font-bold">
            MAX TIER
          </span>
        </div>
      )}
    </div>
  );
};
