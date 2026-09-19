import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, BarChart2, Eye, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MyRankCardProps {
  onViewStats: () => void;
  onScrollToMyRank?: () => void;
  userRank?: number;
  userScore?: number;
  referralCount?: number;
}

export const MyRankCard: React.FC<MyRankCardProps> = ({
  onViewStats,
  onScrollToMyRank,
  userRank = 27,
  userScore = 1280.0,
  referralCount = 18,
}) => {
  const { user, language } = useApp();

  const handleScroll = () => {
    if (onScrollToMyRank) {
      onScrollToMyRank();
    } else {
      const el = document.getElementById('my-rank-item');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const [imgErr, setImgErr] = React.useState(false);
  const cleanFullName = (user.fullName || '').trim();
  const cleanUsername = (user.username || '').replace(/^@/, '').trim();
  const displayName = cleanFullName || (cleanUsername ? `@${cleanUsername}` : 'You');
  const avatarLetter = displayName.replace(/^@/, '').charAt(0).toUpperCase() || 'Y';

  return (
    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#00E5FF18] via-[#121215] to-[#121215] border border-[#00E5FF50] shadow-2xl glow-cyan space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#00E5FF] bg-[#161618] flex items-center justify-center">
              {user.avatarUrl && !imgErr ? (
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  onError={() => setImgErr(true)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#2AABEE] to-[#00E5FF] flex items-center justify-center text-white font-black text-sm select-none">
                  {avatarLetter}
                </div>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-[#00E5FF] text-[#0A0A0B] text-[8px] font-black rounded-full border border-black">
              YOU
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">{displayName}</span>
              <span className="text-[10px] font-extrabold text-[#00E5FF] bg-[#00E5FF15] px-2 py-0.5 rounded-full border border-[#00E5FF30]">
                #{userRank}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#8E8E93]">
              <span className="font-bold text-[#00E5FF]">৳{userScore.toFixed(2)}</span>
              <span>•</span>
              <span>{referralCount} Refs</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                ↑ +4
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleScroll}
            className="px-2.5 py-1.5 rounded-xl bg-[#1F1F22] hover:bg-[#2A2A2E] text-white font-bold text-[10px] border border-[#2A2A2E] transition-all"
            title="Locate my card in list"
          >
            🎯 {language === 'bn' ? 'আমার স্থান' : 'Find Me'}
          </button>

          <button
            onClick={onViewStats}
            className="px-3 py-1.5 rounded-xl bg-[#00E5FF] hover:bg-[#00B8D4] text-[#0A0A0B] font-extrabold text-[11px] shadow-md transition-all flex items-center gap-1"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'স্ট্যাটস' : 'STATS'}</span>
          </button>
        </div>
      </div>

      <div className="p-2 rounded-xl bg-[#18181B] border border-[#232326] flex items-center justify-between text-[10px]">
        <span className="text-[#8E8E93]">
          {language === 'bn'
            ? `Top 20 তে ঢুকতে আর ৳45.00 বিডিটি প্রয়োজন`
            : `৳45.00 BDT needed to reach Top 20`}
        </span>
        <span className="text-emerald-400 font-bold">↑ Climb #27 → #20</span>
      </div>
    </div>
  );
};
