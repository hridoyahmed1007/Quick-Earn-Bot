import React from 'react';
import { Award, Sprout, Flame, Zap, Gem, Crown, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { MOCK_REFERRAL_BADGES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const ReferralBadgesGrid: React.FC = () => {
  const { user } = useApp();
  const badges = MOCK_REFERRAL_BADGES;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-[#00E5FF]" />;
      case 'Gem': return <Gem className="w-5 h-5 text-indigo-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-yellow-400" />;
      default: return <Trophy className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Referral Badges & Titles</h3>
            <p className="text-[10px] text-[#8E8E93]">Earn prestigious badges as you invite</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          2 / 6 Unlocked
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {badges.map((badge) => {
          return (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border transition-all text-center space-y-1 relative overflow-hidden ${
                badge.unlocked
                  ? 'bg-[#111113] border-[#2C2C32] shadow-sm'
                  : 'bg-[#111113]/50 border-[#1C1C1F] opacity-60'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-[#1A1A1D] border border-[#28282D] mx-auto flex items-center justify-center relative">
                {getBadgeIcon(badge.icon)}

                {!badge.unlocked && (
                  <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center text-[#8E8E93]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-white block leading-tight truncate">
                  {badge.nameEn}
                </span>
                <span className="text-[9px] text-[#8E8E93] font-mono block mt-0.5">
                  {badge.unlocked ? 'Unlocked' : `Target: ${badge.threshold}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
