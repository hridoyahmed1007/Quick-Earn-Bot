import { ProfileTier } from '../types';

export interface TierBonusInfo {
  tier: ProfileTier;
  bonusPercent: number; // e.g., 0, 1.5, 3.0, 5.0, 7.5, 10.0
  multiplier: number; // e.g., 1.0, 1.015, 1.03, 1.05, 1.075, 1.10
  badgeText: string;
  badgeBn: string;
  badgeEn: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextCol: string;
}

export const TIER_BONUS_MAP: Record<ProfileTier, TierBonusInfo> = {
  Default: {
    tier: 'Default',
    bonusPercent: 0,
    multiplier: 1.0,
    badgeText: '0% Boost',
    badgeBn: 'বেস রেট',
    badgeEn: 'Base Rate',
    badgeBg: 'bg-zinc-500/10',
    badgeBorder: 'border-zinc-500/20',
    badgeTextCol: 'text-zinc-400',
  },
  Bronze: {
    tier: 'Bronze',
    bonusPercent: 1.5,
    multiplier: 1.015,
    badgeText: '+1.5% Boost',
    badgeBn: '+১.৫% ব্রোঞ্জ বোনাস',
    badgeEn: '+1.5% Bronze Boost',
    badgeBg: 'bg-[#CD7F32]/15',
    badgeBorder: 'border-[#CD7F32]/35',
    badgeTextCol: 'text-[#E5A869]',
  },
  Silver: {
    tier: 'Silver',
    bonusPercent: 3.0,
    multiplier: 1.03,
    badgeText: '+3.0% Boost',
    badgeBn: '+৩.০% সিলভার বোনাস',
    badgeEn: '+3.0% Silver Boost',
    badgeBg: 'bg-slate-200/15',
    badgeBorder: 'border-slate-300/40',
    badgeTextCol: 'text-slate-200',
  },
  Gold: {
    tier: 'Gold',
    bonusPercent: 5.0,
    multiplier: 1.05,
    badgeText: '+5.0% Boost',
    badgeBn: '+৫.০% গোল্ড বোনাস',
    badgeEn: '+5.0% Gold Boost',
    badgeBg: 'bg-amber-400/15',
    badgeBorder: 'border-amber-400/35',
    badgeTextCol: 'text-amber-300',
  },
  Platinum: {
    tier: 'Platinum',
    bonusPercent: 7.5,
    multiplier: 1.075,
    badgeText: '+7.5% Boost',
    badgeBn: '+৭.৫% প্লাটিনাম বোনাস',
    badgeEn: '+7.5% Platinum Boost',
    badgeBg: 'bg-[#00E5FF]/15',
    badgeBorder: 'border-[#00E5FF]/35',
    badgeTextCol: 'text-[#00E5FF]',
  },
  Diamond: {
    tier: 'Diamond',
    bonusPercent: 10.0,
    multiplier: 1.10,
    badgeText: '+10.0% Boost',
    badgeBn: '+১০.০% ডায়মন্ড বোনাস',
    badgeEn: '+10.0% Diamond Boost',
    badgeBg: 'bg-[#B388FF]/15',
    badgeBorder: 'border-[#B388FF]/40',
    badgeTextCol: 'text-[#D1B3FF]',
  },
};

export function getTierBonusInfo(tier?: ProfileTier): TierBonusInfo {
  if (!tier || !TIER_BONUS_MAP[tier]) {
    return TIER_BONUS_MAP.Default;
  }
  return TIER_BONUS_MAP[tier];
}

export interface CalculatedTierReward {
  baseBdt: number;
  bonusBdt: number;
  finalBdt: number;
  baseCoins: number;
  bonusCoins: number;
  finalCoins: number;
  bonusPercent: number;
  multiplier: number;
  hasBonus: boolean;
  tier: ProfileTier;
  bonusBadgeBn: string;
  bonusBadgeEn: string;
}

export function calculateTierReward(
  baseBdt: number,
  baseCoins: number,
  tier?: ProfileTier
): CalculatedTierReward {
  const info = getTierBonusInfo(tier);
  if (info.bonusPercent <= 0) {
    return {
      baseBdt,
      bonusBdt: 0,
      finalBdt: baseBdt,
      baseCoins,
      bonusCoins: 0,
      finalCoins: baseCoins,
      bonusPercent: 0,
      multiplier: 1.0,
      hasBonus: false,
      tier: info.tier,
      bonusBadgeBn: info.badgeBn,
      bonusBadgeEn: info.badgeEn,
    };
  }

  // Calculate percentage bonus
  const rawBonus = baseBdt * (info.bonusPercent / 100);
  const bonusBdt = Number(Math.max(0.01, Number(rawBonus.toFixed(2))).toFixed(2));
  const finalBdt = Number((baseBdt + bonusBdt).toFixed(2));

  const rawBonusCoins = baseCoins * (info.bonusPercent / 100);
  const bonusCoins = Math.max(1, Math.round(rawBonusCoins));
  const finalCoins = baseCoins + bonusCoins;

  return {
    baseBdt,
    bonusBdt,
    finalBdt,
    baseCoins,
    bonusCoins,
    finalCoins,
    bonusPercent: info.bonusPercent,
    multiplier: info.multiplier,
    hasBonus: true,
    tier: info.tier,
    bonusBadgeBn: info.badgeBn,
    bonusBadgeEn: info.badgeEn,
  };
}
