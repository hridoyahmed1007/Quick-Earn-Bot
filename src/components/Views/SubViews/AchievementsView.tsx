import React, { useState } from 'react';
import { ArrowLeft, Award, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AchievementCategory } from '../../../types';
import { ProfileAchievementsSection } from '../../Profile/ProfileAchievementsSection';
import { ProfileLevelProgressCard } from '../../Profile/ProfileLevelProgressCard';
import { AchievementDetailModal } from '../../Profile/AchievementDetailModal';

export const AchievementsView: React.FC = () => {
  const { goBack, language } = useApp();
  const isBn = language === 'bn' || language === 'mixed';

  return (
    <div className="space-y-4 pb-28">
      {/* Back Navigation Bar */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#232326]">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-[#161618] border border-[#232326] text-white hover:text-[#00E5FF] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-black text-white">
            {isBn ? 'মাইলস্টোন ও অর্জন সিস্টেম' : 'Achievements & Milestones'}
          </h2>
          <p className="text-[10px] text-[#8E8E93]">
            {isBn ? '১০০% রিয়েল ভেরিফাইড অ্যাক্টিভিটি ভিত্তিক রিওয়ার্ড' : '100% real verified progression & automatic rewards'}
          </p>
        </div>
      </div>

      {/* Level Progress */}
      <ProfileLevelProgressCard />

      {/* Full Achievements List */}
      <ProfileAchievementsSection />

      {/* Modal */}
      <AchievementDetailModal />
    </div>
  );
};
