import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Award, CheckCircle2, Lock, Gift, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_REFERRAL_MILESTONES } from '../../data/mockData';
import { triggerHaptic } from '../../utils/haptics';

export const ReferralMilestoneCard: React.FC = () => {
  const { user, showToast } = useApp();
  const [milestones, setMilestones] = useState(MOCK_REFERRAL_MILESTONES);

  const currentReferrals = user.totalReferrals || 18;

  // Active next target milestone (e.g. 25 referrals)
  const nextMilestone = milestones.find((m) => m.threshold > currentReferrals) || milestones[milestones.length - 1];
  const prevThreshold = milestones.filter((m) => m.threshold <= currentReferrals).slice(-1)[0]?.threshold || 0;

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((currentReferrals / nextMilestone.threshold) * 100))
  );

  const remaining = Math.max(0, nextMilestone.threshold - currentReferrals);

  const handleClaimMilestone = (id: string, reward: number, title: string) => {
    triggerHaptic('success');
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'claimed' } : m))
    );
    showToast('🎉 মাইলস্টোন রিওয়ার্ড!', `+৳${reward.toFixed(2)} টাকা আপনার একাউন্টে যোগ হয়েছে (${title})!`);
  };

  return (
    <div 
      id="referral-milestone-card"
      className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl space-y-3.5 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1F1F24] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              রেফারেল মাইলস্টোন বোনাস
            </h3>
            <p className="text-[10px] text-[#8E8E93]">টার্গেট পূরণ করে ইনস্ট্যান্ট এক্সট্রা ক্যাশ বোনাস ক্লেইম করুন</p>
          </div>
        </div>

        <span className="text-xs font-black text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
          {currentReferrals} / {nextMilestone.threshold}
        </span>
      </div>

      {/* Main Target Box */}
      <div className="p-3 rounded-xl bg-[#0E0E10] border border-[#1F1F24] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{nextMilestone.titleBn || nextMilestone.titleEn} রিওয়ার্ড: <span className="font-mono text-amber-400 font-black">+৳{nextMilestone.rewardBdt.toFixed(2)}</span></span>
          </span>

          <span className="text-[10px] font-bold text-emerald-400">
            {remaining > 0 ? `আরও ${remaining}টি রেফার বাকি` : '🎉 টার্গেট সম্পূর্ণ!'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1A1A1E] h-2 rounded-full overflow-hidden p-0.5 border border-[#232328]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-amber-400 to-[#00E5FF] rounded-full shadow-[0_0_8px_rgba(0,229,255,0.4)]"
          />
        </div>
      </div>

      {/* Levels Milestone List */}
      <div className="space-y-1.5">
        <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider block">
          মাইলস্টোন রিওয়ার্ড লেভেলসমূহ
        </span>

        <div className="space-y-1.5">
          {milestones.map((m) => {
            const isReached = currentReferrals >= m.threshold;
            const isClaimed = m.status === 'claimed';

            return (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#18181C] text-amber-400 text-[10px] font-black flex items-center justify-center shrink-0 border border-[#232328]">
                    L{m.level}
                  </span>

                  <div>
                    <span className="font-bold text-white block">{m.titleBn || m.titleEn}</span>
                    <span className="text-[10px] text-[#8E8E93]">
                      টার্গেট: {m.threshold} রেফারেল
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">
                    +৳{m.rewardBdt.toFixed(2)}
                  </span>

                  {isClaimed ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Claimed
                    </span>
                  ) : isReached ? (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleClaimMilestone(m.id, m.rewardBdt, m.titleBn || m.titleEn)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-sm"
                    >
                      <Gift className="w-3 h-3" />
                      CLAIM
                    </motion.button>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#18181C] text-[#8E8E93] text-[9px] font-bold border border-[#232328] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
