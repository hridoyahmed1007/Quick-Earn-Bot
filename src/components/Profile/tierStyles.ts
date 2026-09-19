import { ProfileTier } from '../../types';

export interface TierStyleConfig {
  tier: ProfileTier;
  crownEmoji: string;
  badgeLabel: string;
  accentColor: string;
  glowColor: string;
  avatarRingClass: string;
  avatarInnerBorder: string;
  avatarGradientBg: string;
  avatarGlowRgba: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  progressBarGradient: string;
  cardGlowGradient: string;
}

export const getTierStyleConfig = (tier: ProfileTier): TierStyleConfig => {
  switch (tier) {
    case 'Bronze':
      return {
        tier: 'Bronze',
        crownEmoji: '🥉',
        badgeLabel: 'BRONZE MEMBER',
        accentColor: '#CD7F32',
        glowColor: '#CD7F32',
        avatarRingClass: 'border-[#CD7F32] shadow-[0_0_18px_rgba(205,127,50,0.5)] ring-2 ring-[#CD7F32]/40',
        avatarInnerBorder: 'border-[#CD7F32]/50',
        avatarGradientBg: 'from-[#CD7F32] via-[#A0522D] to-[#5C2E0B]',
        avatarGlowRgba: 'rgba(205, 127, 50, 0.4)',
        pillBg: 'bg-[#CD7F32]/15',
        pillBorder: 'border-[#CD7F32]/40',
        pillText: 'text-[#CD7F32]',
        progressBarGradient: 'from-[#CD7F32] via-[#E59866] to-[#CD7F32]',
        cardGlowGradient: 'rgba(205, 127, 50, 0.12)',
      };
    case 'Silver':
      return {
        tier: 'Silver',
        crownEmoji: '🥈',
        badgeLabel: 'SILVER MEMBER',
        accentColor: '#E2E8F0',
        glowColor: '#E2E8F0',
        avatarRingClass: 'border-[#E2E8F0] shadow-[0_0_22px_rgba(226,232,240,0.55)] ring-2 ring-slate-300/50',
        avatarInnerBorder: 'border-slate-300/60',
        avatarGradientBg: 'from-[#FFFFFF] via-[#CBD5E1] to-[#64748B]',
        avatarGlowRgba: 'rgba(226, 232, 240, 0.45)',
        pillBg: 'bg-slate-300/15',
        pillBorder: 'border-slate-300/40',
        pillText: 'text-slate-200',
        progressBarGradient: 'from-slate-300 via-white to-slate-400',
        cardGlowGradient: 'rgba(226, 232, 240, 0.12)',
      };
    case 'Gold':
      return {
        tier: 'Gold',
        crownEmoji: '👑',
        badgeLabel: 'GOLD MEMBER',
        accentColor: '#FFB800',
        glowColor: '#FFB800',
        avatarRingClass: 'border-[#FFB800] shadow-[0_0_26px_rgba(255,184,0,0.65)] ring-2 ring-amber-400/60',
        avatarInnerBorder: 'border-amber-400/60',
        avatarGradientBg: 'from-[#FFE082] via-[#FFB800] to-[#E65100]',
        avatarGlowRgba: 'rgba(255, 184, 0, 0.5)',
        pillBg: 'bg-amber-400/20',
        pillBorder: 'border-amber-400/50',
        pillText: 'text-amber-400',
        progressBarGradient: 'from-amber-400 via-yellow-300 to-amber-500',
        cardGlowGradient: 'rgba(255, 184, 0, 0.14)',
      };
    case 'Platinum':
      return {
        tier: 'Platinum',
        crownEmoji: '⚡',
        badgeLabel: 'PLATINUM MEMBER',
        accentColor: '#00E5FF',
        glowColor: '#00E5FF',
        avatarRingClass: 'border-[#00E5FF] shadow-[0_0_28px_rgba(0,229,255,0.7)] ring-2 ring-[#00E5FF]/60',
        avatarInnerBorder: 'border-[#00E5FF]/60',
        avatarGradientBg: 'from-[#84FFFF] via-[#00E5FF] to-[#0091EA]',
        avatarGlowRgba: 'rgba(0, 229, 255, 0.5)',
        pillBg: 'bg-[#00E5FF]/20',
        pillBorder: 'border-[#00E5FF]/50',
        pillText: 'text-[#00E5FF]',
        progressBarGradient: 'from-[#00E5FF] via-[#80D8FF] to-[#00B0FF]',
        cardGlowGradient: 'rgba(0, 229, 255, 0.14)',
      };
    case 'Diamond':
      return {
        tier: 'Diamond',
        crownEmoji: '💎',
        badgeLabel: 'DIAMOND LEGEND',
        accentColor: '#B388FF',
        glowColor: '#B388FF',
        avatarRingClass: 'border-[#B388FF] shadow-[0_0_32px_rgba(179,136,255,0.75)] ring-2 ring-[#B388FF]/70',
        avatarInnerBorder: 'border-[#B388FF]/65',
        avatarGradientBg: 'from-[#EA80FC] via-[#B388FF] to-[#651FFF]',
        avatarGlowRgba: 'rgba(179, 136, 255, 0.55)',
        pillBg: 'bg-[#B388FF]/20',
        pillBorder: 'border-[#B388FF]/50',
        pillText: 'text-[#D1C4E9]',
        progressBarGradient: 'from-[#B388FF] via-[#E1BEE7] to-[#7C4DFF]',
        cardGlowGradient: 'rgba(179, 136, 255, 0.16)',
      };
    default:
      return {
        tier: 'Default',
        crownEmoji: '👤',
        badgeLabel: 'MEMBER',
        accentColor: '#8E8E93',
        glowColor: '#8E8E93',
        avatarRingClass: 'border-[#3A3A40] ring-1 ring-white/10',
        avatarInnerBorder: 'border-white/10',
        avatarGradientBg: 'from-[#3A3A40] to-[#232326]',
        avatarGlowRgba: 'transparent',
        pillBg: 'bg-white/10',
        pillBorder: 'border-white/15',
        pillText: 'text-[#8E8E93]',
        progressBarGradient: 'from-[#8E8E93] to-[#48484A]',
        cardGlowGradient: 'transparent',
      };
  }
};
