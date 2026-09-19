import React, { useState } from 'react';
import {
  Award,
  Users,
  Wallet,
  Tv,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Star,
  UserCheck,
  Crown,
  PlayCircle,
  Zap,
  Flame,
  Gem,
  ArrowRight,
  ChevronRight,
  Clock,
  Target,
  Gift,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AchievementCategory, AchievementItem } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

export const ProfileAchievementsSection: React.FC = () => {
  const {
    achievements,
    setActiveAchievementDetail,
    language,
    navigateTo,
    openEarningTab,
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const isBn = language === 'bn' || language === 'mixed';

  const categories: { id: AchievementCategory | 'all'; labelEn: string; labelBn: string; icon: string }[] = [
    { id: 'all', labelEn: 'All Milestones', labelBn: 'সকল মাইলস্টোন', icon: '🏆' },
    { id: 'referral', labelEn: 'Referrals', labelBn: 'রেফারেল', icon: '👥' },
    { id: 'earnings', labelEn: 'Earnings', labelBn: 'আয়', icon: '💰' },
    { id: 'ads', labelEn: 'Ads', labelBn: 'বিজ্ঞাপন', icon: '🎬' },
    { id: 'withdrawal', labelEn: 'Cashout', labelBn: 'ক্যাশআউট', icon: '💸' },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === selectedCategory);

  const completedCount = achievements.filter((a) => a.unlocked || a.claimed).length;

  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const iconClass = `w-5 h-5 ${isUnlocked ? 'text-amber-400' : 'text-[#8E8E93]'}`;
    switch (iconName) {
      case 'Users':
        return <Users className={iconClass} />;
      case 'UserCheck':
        return <UserCheck className={iconClass} />;
      case 'Crown':
        return <Crown className={iconClass} />;
      case 'Wallet':
        return <Wallet className={iconClass} />;
      case 'TrendingUp':
        return <TrendingUp className={iconClass} />;
      case 'Award':
        return <Award className={iconClass} />;
      case 'Gem':
        return <Gem className={iconClass} />;
      case 'Tv':
        return <Tv className={iconClass} />;
      case 'PlayCircle':
        return <PlayCircle className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      case 'Star':
        return <Star className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const getCategoryBadge = (category: AchievementCategory) => {
    switch (category) {
      case 'referral':
        return {
          label: isBn ? '👥 রেফারেল মাইলস্টোন' : '👥 Referral Milestone',
          color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
        };
      case 'earnings':
        return {
          label: isBn ? '💰 প্ল্যাটফর্ম আর্নিং' : '💰 Platform Earnings',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
        };
      case 'ads':
        return {
          label: isBn ? '🎬 রিওয়ার্ডেড বিজ্ঞাপন' : '🎬 Rewarded Ads',
          color: 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/25',
        };
      case 'withdrawal':
        return {
          label: isBn ? '💸 ক্যাশআউট ভেরিফিকেশন' : '💸 Cashout Verification',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
        };
    }
  };

  const handleActionClick = (e: React.MouseEvent, ach: AchievementItem) => {
    e.stopPropagation();
    triggerHaptic();

    if (ach.unlocked || ach.claimed) {
      setActiveAchievementDetail(ach);
      return;
    }

    if (ach.category === 'referral') {
      navigateTo('referral');
    } else if (ach.category === 'ads') {
      openEarningTab('ads');
    } else if (ach.category === 'earnings') {
      navigateTo('ads');
    } else if (ach.category === 'withdrawal') {
      navigateTo('wallet');
    }
  };

  const formatProgressValue = (val: number, category: AchievementCategory) => {
    if (category === 'earnings') {
      return `৳${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
    }
    return val.toString();
  };

  return (
    <div id="profile-achievements-section" className="p-4 rounded-[24px] bg-[#151518] border border-[#232326] shadow-xl space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,184,0,0.2)] shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Achievement</span>
            </h3>
            <p className="text-[10.5px] text-[#8E8E93] truncate">
              {isBn ? '১০০% রিয়েল অ্যাক্টিভিটি ভিত্তিক বোনাস' : '100% Real activity verified progression'}
            </p>
          </div>
        </div>

        {/* 2 Adjusted Badges Beside Title */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Badge 1: Total count */}
          <span className="text-[10px] font-extrabold px-2 py-1 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#00E5FF] font-mono tracking-wide shadow-sm">
            {achievements.length} TOTAL
          </span>

          {/* Badge 2: Completed count */}
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1 shadow-sm font-mono">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{completedCount}/{achievements.length} {isBn ? 'সম্পন্ন' : 'Completed'}</span>
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const count = cat.id === 'all'
            ? achievements.length
            : achievements.filter((a) => a.category === cat.id).length;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 flex items-center gap-1.5 transition-all border ${
                isActive
                  ? 'bg-[#00E5FF] text-[#0A0A0B] border-[#00E5FF] shadow-sm font-black'
                  : 'bg-[#111113] text-[#8E8E93] border-[#232326] hover:text-white hover:border-[#2F2F34]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{isBn ? cat.labelBn : cat.labelEn}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/20 text-[#0A0A0B]' : 'bg-[#1C1C1F] text-[#8E8E93]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 6-Box Super Premium Achievement Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {filteredAchievements.slice(0, 6).map((ach) => {
          const isCompleted = ach.unlocked || ach.claimed;
          const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));
          const catInfo = getCategoryBadge(ach.category);

          return (
            <div
              key={ach.id}
              onClick={() => {
                triggerHaptic();
                setActiveAchievementDetail(ach);
              }}
              className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group active:scale-[0.98] flex flex-col justify-between min-h-[175px] ${
                isCompleted
                  ? 'bg-gradient-to-b from-[#18181D] via-[#151519] to-[#1A160F] border-amber-500/40 hover:border-amber-400 shadow-[0_4px_18px_rgba(255,184,0,0.12)]'
                  : 'bg-[#121215] border-[#24242A] hover:border-[#383842] shadow-md'
              }`}
            >
              {/* Background ambient glow */}
              {isCompleted ? (
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-6 -mt-6" />
              ) : (
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl pointer-events-none -mr-6 -mt-6" />
              )}

              {/* 1. Header: Category Badge + Reward Pill */}
              <div className="flex items-center justify-between gap-1.5 relative z-10">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border flex items-center gap-1 ${catInfo.color}`}>
                  <span className="truncate max-w-[80px]">{catInfo.label.split(' ')[1] || catInfo.label}</span>
                </span>

                <div className="text-[10.5px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg shadow-sm inline-flex items-center gap-0.5 font-mono shrink-0">
                  <Gift className="w-2.5 h-2.5 text-emerald-400" />
                  <span>+৳{ach.rewardBdt.toFixed(0)}</span>
                </div>
              </div>

              {/* 2. Center: Icon + Title + Requirement */}
              <div className="my-2 relative z-10">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-amber-400/20 to-amber-600/10 border-amber-400/40 text-amber-400 shadow-[0_0_12px_rgba(255,184,0,0.25)]'
                        : 'bg-[#18181D] border-[#292930] text-[#8E8E93] group-hover:text-white'
                    }`}
                  >
                    {renderIcon(ach.icon, isCompleted)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-[12px] font-black text-white group-hover:text-amber-400 transition-colors leading-tight line-clamp-1">
                      {isBn ? ach.titleBn : ach.titleEn}
                    </h4>
                    <p className="text-[9.5px] font-semibold text-[#8E8E93] line-clamp-1 mt-0.5">
                      {isBn ? ach.requirementBn : ach.requirementEn}
                    </p>
                  </div>
                </div>

                {/* Mini Target vs Current Telemetry */}
                <div className="grid grid-cols-2 gap-1 p-1.5 rounded-lg bg-[#0D0D10] border border-[#1E1E23] text-center text-[9px]">
                  <div className="text-[#8E8E93] truncate">
                    <span>{isBn ? 'টার্গেট: ' : 'Target: '}</span>
                    <strong className="text-white font-bold">{formatProgressValue(ach.maxProgress, ach.category)}</strong>
                  </div>
                  <div className="truncate">
                    <span className="text-[#8E8E93]">{isBn ? 'অর্জন: ' : 'Done: '}</span>
                    <strong className={`font-bold ${isCompleted ? 'text-amber-400' : 'text-[#00E5FF]'}`}>
                      {formatProgressValue(ach.progress, ach.category)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 3. Footer: Progress Bar + Action / Status */}
              <div className="pt-1.5 border-t border-[#1E1E23] relative z-10 space-y-1.5">
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[#1C1C21] rounded-full overflow-hidden p-0.5 border border-[#27272E]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(255,184,0,0.5)]'
                        : 'bg-gradient-to-r from-[#00E5FF] to-teal-400'
                    }`}
                    style={{ width: `${Math.max(6, progressPercent)}%` }}
                  />
                </div>

                {/* Bottom Row: Status Badge or Start Action */}
                <div className="flex items-center justify-between text-[9.5px]">
                  <span className="font-bold text-[#8E8E93]">
                    {progressPercent}% {isBn ? 'সম্পন্ন' : 'Done'}
                  </span>

                  {isCompleted ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black inline-flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>{isBn ? 'আনলকড' : 'UNLOCKED'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleActionClick(e, ach)}
                      className="px-2 py-0.5 rounded-md bg-[#00E5FF] hover:bg-[#33EAFF] text-[#0A0A0B] font-black inline-flex items-center gap-0.5 shadow-sm active:scale-95 transition-all"
                    >
                      <span>{isBn ? 'শুরু' : 'START'}</span>
                      <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
